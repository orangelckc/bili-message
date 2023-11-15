interface IUser {
  mid: number
  uname: string;
  face: string;
  cookie?: string;
  csrf?: string;
}

interface IAccess {
  uid: number;
  cookie?: string;
  csrf?: string;
}

interface ILogin {
  url: string
  refresh_token: string
  timestamp: number
  code: 0 | 86038 | 86090 | 86101
  message: string
}

interface IMsg {
  id: string
  type: 'entry' | 'message' | 'gift' | 'like' | 'follow'|'emoji'
  uname: string
  message: string
}