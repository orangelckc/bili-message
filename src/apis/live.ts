import { LIVE_URL_PREFIX } from '@/utils/constants'
import { EDMType } from '@/utils/enums'
import request from '@/utils/request'

// 获取身份码
function getLiveCodeApi() {
  const { currentUser } = useAppStore()
  return request({
    url: `${LIVE_URL_PREFIX}/xlive/open-platform/v1/common/operationOnBroadcastCode`,
    method: 'POST',
    data: {
      action: '1',
      csrf_token: currentUser?.csrf,
      csrf: currentUser?.csrf,
    },
    headers: {
      cookie: currentUser?.cookie,
    },
  })
}

// 获取ws认证token
function getLiveTokenApi() {
  const { currentUser, room } = useAppStore()

  return request({
    url: `${LIVE_URL_PREFIX}/xlive/web-room/v1/index/getDanmuInfo`,
    method: 'GET',
    params: {
      id: room,
    },
    headers: {
      cookie: currentUser?.cookie,
    },
  })
}

// 获取表情列表
function getEmojiApi() {
  const { currentUser, room } = useAppStore()

  return request({
    url: `${LIVE_URL_PREFIX}/xlive/web-ucenter/v2/emoticon/GetEmoticons`,
    method: 'GET',
    params: {
      platform: 'pc',
      room_id: room,
    },
    headers: {
      cookie: currentUser?.cookie,
    },
  })
}

// 发送消息
function sendMessageApi(message: string, type: EDMType) {
  const { currentUser, room, currentMedal } = useAppStore()
  const data = {
    roomid: type === EDMType.打卡专用 ? `${currentMedal?.roomid}` : `${room}`,
    msg: message,
    dm_type: type === EDMType.打卡专用 ? '0' : type,
    bubble: '0',
    isInitiative: type === EDMType.表情弹幕 ? true : '',
    color: '16777215',
    mode: '1',
    fontsize: '25',
    rnd: Math.floor(Date.now() / 1000).toString(),
    csrf: currentUser?.csrf,
    csrf_token: currentUser?.csrf,
  }

  return request({
    url: `${LIVE_URL_PREFIX}/msg/send`,
    method: 'POST',
    data,
    headers: {
      'cookie': currentUser?.cookie,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

// 获取当前直播状态
function getLiveStatusApi() {
  const { room } = useAppStore()
  return request({
    url: `${LIVE_URL_PREFIX}/xlive/web-room/v1/index/getRoomBaseInfo`,
    method: 'GET',
    params: {
      room_ids: room,
      req_biz: 'link-center',
    },
  })
}

// 获取用户持有的粉丝勋章
function getMedalApi(page: number = 1) {
  const { currentUser } = useAppStore()
  return request({
    url: `${LIVE_URL_PREFIX}/xlive/app-ucenter/v1/user/GetMyMedals`,
    method: 'GET',
    params: {
      page,
      page_size: 10,
    },
    headers: {
      cookie: currentUser?.cookie,
    },
  })
}

// 佩戴粉丝勋章
function wearMedalApi(medalId: number) {
  const { currentUser } = useAppStore()
  return request({
    url: `${LIVE_URL_PREFIX}/xlive/web-room/v1/fansMedal/wear`,
    method: 'POST',
    data: {
      medal_id: medalId,
      csrf: currentUser?.csrf,
      csrf_token: currentUser?.csrf,
    },
    headers: {
      'cookie': currentUser?.cookie,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

export {
  getLiveCodeApi,
  getLiveTokenApi,
  getEmojiApi,
  sendMessageApi,
  getLiveStatusApi,
  getMedalApi,
  wearMedalApi,
}
