use std::{
    collections::HashMap,
    net::SocketAddr,
    sync::{Arc, Mutex},
};

use futures_channel::mpsc::{unbounded, UnboundedSender};
use futures_util::{future, pin_mut, stream::TryStreamExt, FutureExt, StreamExt};

use tokio::net::{TcpListener, TcpStream};
use tungstenite::protocol::Message;
use uuid::Uuid;

type Tx = UnboundedSender<Message>;
type PeerMap = Arc<Mutex<HashMap<Uuid, (SocketAddr, Tx)>>>;

async fn handle_connection(peer_map: PeerMap, raw_stream: TcpStream, addr: SocketAddr) {
    println!("Incoming TCP connection from: {}", addr);

    let ws_stream = tokio_tungstenite::accept_async(raw_stream)
        .await
        .expect("Error during the websocket handshake occurred");

    let id = Uuid::new_v4(); // 生成一个新的唯一标识符
    println!("WebSocket connection established: {}-{}", &id, &addr);

    // Insert the write part of this peer to the peer map.
    let (tx, rx) = unbounded();
    let tx2 = tx.clone();
    peer_map.lock().unwrap().insert(id, (addr, tx));
    let m = Message::text(format!("连接成功"));
    tx2.unbounded_send(m).unwrap();

    let (outgoing, incoming) = ws_stream.split();

    let broadcast_incoming = incoming
        .try_for_each(|msg| {
            // println!(
            //     "Received a message from {}: {}",
            //     addr,
            //     msg.to_text().unwrap()
            // );

            // msg为关闭帧时，不用广播了
            if msg.is_close() {
                return future::ok(());
            }

            // 如果是心跳包(包含ping的字符串)，就不用广播了
            if msg.to_text().unwrap().contains("ping") {
                return future::ok(());
            }

            let peers = peer_map.lock().unwrap();

            // We want to broadcast the message to everyone except ourselves.
            let broadcast_recipients = peers
                .iter()
                .filter(|(peer_id, (_peer_addr, _))| peer_id != &&id)
                .map(|(_, (_, ws_sink))| ws_sink);

            for recipient in broadcast_recipients {
                recipient.unbounded_send(msg.clone()).unwrap();
            }

            future::ok(())
        })
        .then(|result| {
            match result {
                Err(tungstenite::Error::Protocol(_reset_without_closing_handshake)) => {
                    println!("Reset without closing handshake: {}", &id);
                    // 不立即移除客户端，等待一段时间后再移除
                    // 这里只是一个示例，你可能需要根据你的需求来调整这段代码
                    std::thread::sleep(std::time::Duration::from_secs(5));
                    let mut peers = peer_map.lock().unwrap();
                    if peers.contains_key(&id) {
                        peers.remove(&id);
                    }
                }
                Err(e) => {
                    println!("Error processing connection: {}", e);
                    let mut peers = peer_map.lock().unwrap();
                    if peers.contains_key(&id) {
                        peers.remove(&id);
                    }
                }
                _ => (),
            }
            future::ok::<_, std::convert::Infallible>(())
        });

    let receive_from_others = rx.map(Ok).forward(outgoing).then(|result| {
        match result {
            Err(tungstenite::Error::Protocol(_)) => {
                println!("WebSocket connection closed: {}", &id);
                let mut peers = peer_map.lock().unwrap();

                peers.remove(&id);
            }
            Err(e) => {
                println!("Error in outgoing websocket stream: {:?}", e);
                let mut peers = peer_map.lock().unwrap();
                if peers.contains_key(&id) {
                    peers.remove(&id);
                }
            }
            _ => (),
        }
        future::ok::<_, std::convert::Infallible>(())
    });

    pin_mut!(broadcast_incoming, receive_from_others);
    future::select(broadcast_incoming, receive_from_others).await;

    println!("{} disconnected", &id);
    let mut peers = peer_map.lock().unwrap();
    peers.remove(&id);
}

pub async fn server() {
    let addr = "0.0.0.0:1234";
    let state = PeerMap::new(Mutex::new(HashMap::new()));
    // Create the event loop and TCP listener we'll accept connections on.
    let try_socket = TcpListener::bind(&addr).await;
    let listener = try_socket.expect("Failed to bind");
    println!("Listening on: {}", addr);
    // Let's spawn the handling of each connection in a separate task.
    while let Ok((stream, addr)) = listener.accept().await {
        tokio::spawn(handle_connection(state.clone(), stream, addr));
    }
}
