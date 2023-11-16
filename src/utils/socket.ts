import { ElNotification } from 'element-plus'

import { LOCAL_WEBSOCKET_URL } from './constants'

/**
 * 代理实现单例模式
 * @param className 类定义
 */
function singletonProxy(className: any) {
  let instance: any = null
  return new Proxy(className, {
    construct(target, args) {
      if (!instance)
        // eslint-disable-next-line new-cap
        instance = new target(...args)

      return instance
    },
  })
}

class Socket {
  ws: WebSocket

  constructor(wss: string = LOCAL_WEBSOCKET_URL) {
    this.ws = new WebSocket(wss)

    this.ws.onopen = () => {
      // socket保活，30s发送一次心跳
      setInterval(() => {
        this.ws.send('ping')
      }, 30 * 1000)
    }

    this.ws.onerror = () => {
      const { isBroadcast } = storeToRefs(useAppStore())
      ElNotification({
        title: 'ws连接失败',
        type: 'error',
      })

      isBroadcast.value = false
    }
  }

  send(data: Record<string, any>) {
    this.ws.send(JSON.stringify(data))
  }
}

// 本地socket仅用于向外发出消息
const socket = new (singletonProxy(Socket))()

export { socket }
