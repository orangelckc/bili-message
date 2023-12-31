interface IUser {
  mid: number
  uname: string;
  face: string;
  cookie?: string;
  csrf?: string;
  medals: IUserMedal[],
  medalCount: number
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
  type: 'entry' | 'message' | 'gift' | 'like' | 'follow' | 'emoji'|'config'
  uname: string
  uface?: string
  message: string
  medal: IUserMedal
}

interface IUserMedal {
  can_deleted: boolean;
  day_limit: number;
  guard_level: number;
  guard_medal_title: string;
  intimacy: number;
  is_lighted: number;
  level: number;
  medal_name: string;
  medal_color_border: number;
  medal_color_end: number;
  medal_color_start: number;
  medal_id: number;
  next_intimacy: number;
  today_feed: number;
  roomid: number;
  status: number;
  target_id: number;
  target_name: string;
  uname: string;
}

interface ICustomStyle {
    unameColor?: string
    unameFontSize?: number
    msgColor?: string
    msgFontSize?: number
    msgGap?: number
    msgBackground?: string
  }