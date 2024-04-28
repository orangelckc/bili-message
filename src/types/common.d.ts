type SetInterval = ReturnType<typeof setInterval>

declare type PromiseData<T> = Promise<Data<T>>

interface Data<T> {
  code: number
  msg: string
  data: T
}

interface SocketMessage {
  type: SocketType
  command: SocketCommand
  data?: any
}

type SocketType = 'danmu' | 'music' | 'subtitle' | 'background'
type SocketDanmuCommand = 'sample' | 'clear' | 'config' | 'send'
type SocketMusicCommand = 'pause' | 'play' | 'pause' | 'stop' | 'demand' | 'update' | 'end' | 'sync'
type SocketBackgroundCommand = 'change' | 'clear' | 'dynamic' | 'change-dynamic'
type SocketCommand = SocketDanmuCommand | SocketMusicCommand | SocketBackgroundCommand
