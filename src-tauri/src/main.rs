#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{utils::config::AppUrl, WindowUrl};
use tokio::runtime::Runtime;

mod ws;

fn main() {
    let port = 4000;
    let mut context = tauri::generate_context!();
    let url = format!("http://localhost:{}", port).parse().unwrap();
    let window_url = WindowUrl::External(url);
    context.config_mut().build.dist_dir = AppUrl::Url(window_url.clone());

    let rt = Runtime::new().unwrap();
    rt.spawn(ws::server());

    tauri::Builder::default()
        .plugin(tauri_plugin_localhost::Builder::new(port).build())
        .run(context)
        .expect("error while running tauri application");
}
