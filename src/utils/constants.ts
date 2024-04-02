// 小破站基础 api 前缀
export const BASE_URL_PREFIX = 'https://api.bilibili.com'

// 小破站登录 api 前缀
export const LOGIN_URL_PREFIX = 'https://passport.bilibili.com/x/passport-login/web'

// 小破站直播 api 前缀
export const LIVE_URL_PREFIX = 'https://api.live.bilibili.com'

// 小破站直播间 api 前缀
export const ROOM_URL_PREFIX = 'https://live.bilibili.com'

// 直播长链接地址
export const WEBSOCKET_URL = 'wss://broadcastlv.chat.bilibili.com/sub'

// 本地分发socket地址
export const LOCAL_WEBSOCKET_URL = 'ws://localhost:1234'

// 本地广播的页面地址
export const LOCAL_BROADCAST_URL = 'http://localhost:4000/client'

// 弹幕CMD类型
export const MESSAGE_TYPE = {
  RANK: 'ONLINE_RANK_V2',
  DANMU: 'DANMU_MSG',
  GIFT: 'SEND_GIFT' || 'COMBO_SEND',
  INTERACT: 'INTERACT_WORD',
  ENTRY: 'ENTRY_EFFECT',
  GUARD_ENTRY: 'WELCOME_GUARD',
  TOP3: 'ONLINE_RANK_TOP3',
  SUPERCHAT: 'SUPER_CHAT_MESSAGE',
  ROOMCHANGE: 'ROOM_CHANGE',
  LIVESTART: 'LIVE',
  LIVECLOSE: 'PREPARING',
  REDPACKET: 'POPULARITY_RED_POCKET_NEW',
  WATCHCHANGE: 'WATCHED_CHANGE',
  GUARDBUY: 'GUARD_BUY',
  LIKE: 'LIKE_INFO_V3_CLICK',
  LIVEGAME: 'LIVE_INTERACTIVE_GAME',
  NOTICE_MSG: 'USER_TOAST_MSG' || 'NOTICE_MSG',
  ONLINE_RANK_COUNT: 'ONLINE_RANK_COUNT',
  ONLINE_LIKE_COUNT: 'ONLINE_LIKE_COUNT',
}
