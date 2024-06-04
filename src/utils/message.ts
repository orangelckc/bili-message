import { emit } from '@tauri-apps/api/event'
import DOMPurify from 'dompurify'
import { dayjs } from 'element-plus'
import { nanoid } from 'nanoid'

import { MESSAGE_TYPE } from './constants'
import { LIVE_END_EVENT, LIVE_START_EVENT, WATCHED_CHANGE_EVENT } from './events'

import { colorHexToRgba } from '@/utils/tools'

// 格式化弹幕信息
async function handleMessage(messages: any[]) {
  const rankList: any[] = []
  const barrageList: any[] = []
  const giftList: any[] = []
  const welcomeList: any[] = []
  const superChatList: any[] = []
  const redPocketList: any[] = []

  const parseRank = (data: any) => {
    const list = data?.list || data?.online_list || []
    list.length > 3 && list.splice(3)
    rankList.splice(0)
    list.forEach((item: any) => rankList.push(item))
  }

  const parseGift = (data: any) => {
    const id = nanoid()

    giftList.push({
      id,
      barrage: {
        ...data,
        isGift: true,
      },
      barrageType: 'gift',
    })
  }

  const parseInteract = (data: any) => {
    const id = nanoid()
    let info: any
    switch (data.msg_type) {
      case 1:
        info = {
          id,
          ...data,
          msg_type: 'entry',
        }
        break
      case 2:
        info = {
          id,
          ...data,
          msg_type: 'follow',
        }
        break
      case -10:
        // 高能用户
        info = {
          id,
          rankInfo: data.list[0],
          msg_type: 'top3',
        }
        break
      case -1:
        // 欢迎信息
        // info = {
        //   id,
        //   rankInfo: data.list[0],
        //   msg_type: "vip_entry"
        // };
        break
      default:
        info = { id, ...data }
    }

    welcomeList.push({ ...info })
  }

  const parseVIPEntry = (data: any) => {
    const id = nanoid()

    welcomeList.push({
      id,
      ...data,
      msg_type: 'vip_entry',
    })
  }

  const parseDanmu = async (message: any) => {
    const { info } = message

    const id = nanoid()
    const { currentUser } = useAppStore()

    const up_id = currentUser?.mid

    const originMsg = info[1]
    const sanitizedMsg = DOMPurify.sanitize(originMsg)
    const isSafe = sanitizedMsg.length

    const barrageInfo = {
      uid: info[2][0],
      uname: info[2][1],
      uface: info[0][15].user.base.face,
      message: isSafe ? sanitizedMsg : originMsg,
      isSafe, // 是否安全，XSS过滤
      isAnchor: +info[2][0] === up_id, // 是否主播本人
      isManager: !!info[2][2], // 房管
      isGuard: info[7], // 舰队成员，1-总督，2-提督，3-舰长
      isEmoji: !!info[0][12], // 弹幕类型，0-文字，1-emoji
      emoji: info[0][13],
      unameColor: info[2][7],
      medal: info[3].length
        ? {
            level: info[3][0],
            medal_name: info[3][1],
            medal_color_start: info[3][8],
            medal_color_end: info[3][7],
            medal_color_border: info[3][9],
            room_id: info[3][3],
            is_lighted: !!info[3][11],
          }
        : undefined,
      backgroundColor: '',
      time: dayjs().format('HH:mm:ss'),
    }
    const nameColor = barrageInfo.unameColor

    if (nameColor)
      barrageInfo.backgroundColor = colorHexToRgba(nameColor, 0.3) as string

    const extra = JSON.parse(info[0][15].extra)

    // 替换emoji表情
    if (extra.emots) {
      for (const key in extra.emots) {
        const reg = new RegExp(key.replace('[', '\\[').replace(']', '\\]'), 'gi')
        barrageInfo.message = barrageInfo.message.replaceAll(reg, `<img style="width: 20px; height: 20px;" src="${extra.emots[key].url}" />`)
      }
    }

    barrageList.push({
      id,
      barrage: barrageInfo,
      barrageType: 'general',
    })

    // 处理抽奖弹幕/表情动画
    // if (
    //   barrageInfo.message === "老板大气！点点红包抽礼物！" ||
    //   barrageInfo.isEmoji
    // ) { break; }
  }

  const parseSuperchat = (data: any) => {
    const id = nanoid()

    superChatList.push({
      id,
      barrage: data,
      barrageType: 'superchat',
    })
  }

  const parseRedpacket = (data: any) => {
    const id = nanoid()

    redPocketList.push({
      id,
      barrage: data,
      barrageType: 'redpocket',
    })
    giftList.push({
      id,
      barrage: {
        ...data,
        giftId: data.gift_id,
        giftName: data.gift_name,
      },
      barrageType: 'redpocket',
    })
  }

  const parseGuardBuy = (data: any) => {
    const id = nanoid()

    giftList.push({
      id,
      barrage: {
        ...data,
        uname: data.username,
        giftId: data.gift_id,
        giftName: data.gift_name,
      },
      barrageType: 'guardbuy',
    })
  }

  const parseNotice = (data: any) => {
    console.info('全屏消息', data.toast_msg)
  }

  const parseLike = (data: any) => {
    const id = nanoid()
    barrageList.push({
      id,
      barrage: data,
      barrageType: 'like',
    })
  }

  // 处理单独一条弹幕信息的数据解析
  const messageFormatter = async (message: any) => {
    const { cmd } = message
    if (cmd.includes(MESSAGE_TYPE.RANK)) { // 直播间排行榜列表，只需要得到前三名
      await parseRank(message?.data)
    }
    else if (cmd.includes(MESSAGE_TYPE.GIFT)) { // 礼物信息
      await parseGift(message?.data)
    }
    else if (cmd.includes(MESSAGE_TYPE.INTERACT)) { // 进场信息（文字）
      await parseInteract(message?.data)
    }
    else if (cmd.includes(MESSAGE_TYPE.ENTRY)) { // VIP进场信息展示
      await parseVIPEntry(message?.data)
    }
    else if (cmd.includes(MESSAGE_TYPE.DANMU)) { // 弹幕信息
      await parseDanmu(message)
    }
    else if (cmd.includes(MESSAGE_TYPE.SUPERCHAT)) { // SC信息
      await parseSuperchat(message?.data)
    }
    else if (cmd.includes(MESSAGE_TYPE.ROOMCHANGE)) { // 房间信息更新
      // TODO 房间信息改变需要触发的操作
    }
    else if (cmd.includes(MESSAGE_TYPE.LIVESTART)) { // 直播开始
      await emit(LIVE_START_EVENT, message)
    }
    else if (cmd.includes(MESSAGE_TYPE.LIVECLOSE)) { // 直播关闭
      await emit(LIVE_END_EVENT, message)
    }
    else if (cmd.includes(MESSAGE_TYPE.REDPACKET)) { // 红包信息
      await parseRedpacket(message?.data)
    }
    else if (cmd.includes(MESSAGE_TYPE.WATCHCHANGE)) { // 观看人数更新
      await emit(WATCHED_CHANGE_EVENT, { num: message?.data?.num })
    }
    else if (cmd.includes(MESSAGE_TYPE.GUARDBUY)) { // 舰长登船
      await parseGuardBuy(message?.data)
    }
    else if (cmd.includes(MESSAGE_TYPE.NOTICE_MSG)) { // 全屏提示
      await parseNotice(message?.data)
    }
    else if (cmd.includes(MESSAGE_TYPE.LIKE)) { // 点赞
      await parseLike(message?.data)
    }
    else if (cmd.includes(MESSAGE_TYPE.LIVEGAME)) { // 直播游戏
    }
    else if (cmd.includes(MESSAGE_TYPE.ONLINE_RANK_COUNT)) { // 在线人数更新
    }
    else if (cmd.includes(MESSAGE_TYPE.ONLINE_LIKE_COUNT)) { // 点赞更新
    }
    else {
      // console.log('未知消息类型', message)
    }
  }

  for (const message of messages)
    await messageFormatter(message)

  return {
    rankList,
    barrageList,
    giftList,
    welcomeList,
    superChatList,
    redPocketList,
  }
}

export default handleMessage
