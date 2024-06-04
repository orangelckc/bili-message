import { emit, listen, once } from '@tauri-apps/api/event'
import { ElNotification } from 'element-plus'

import { hxdEmoji, textEmoji } from './emoji'
import { useSocket } from './socket'

import type { UnlistenFn } from '@tauri-apps/api/event'

import { getEmojiApi, getLiveStatusApi } from '@/apis/live'
import * as EVENTS from '@/utils/events'

const connected = ref(false)

const unlisteners: UnlistenFn[] = []
const emojiList = ref<any[]>([textEmoji, hxdEmoji])

async function init_listener() {
  const { msgList } = storeToRefs(useAppStore())

  // 清空监听
  unlisteners.forEach(unlistener => unlistener())
  unlisteners.length = 0

  // 监听关注事件/进入房间事件
  const entryListener = await listen(EVENTS.WELCOME_EVENT, (event) => {
    const data = event.payload as object[]
    data.forEach(async (item: any) => {
      if (item.msg_type === 'follow') {
        // 关注事件
        ElNotification({
          message: `${item.uname}关注了主播`,
          type: 'error',
          duration: 0,
        })
        msgList.value.push({
          type: 'follow',
          uname: item.uname,
          message: `${item.uname} 关注了主播`,
          id: item.id,
          medal: item.medal,
        })
        const { followConfig, text } = storeToRefs(useSpeechStore())
        const { play } = useSpeechStore()
        if (followConfig.value.isOn) {
          text.value = followConfig.value.pattern.replace('{user}', item.uname)
          play()
        }
      }
      else if (item.msg_type === 'entry') {
        // 进入房间事件
        msgList.value.push({
          type: 'entry',
          uname: item.uname,
          message: `${item.uname} 进入了直播间`,
          id: item.id,
          medal: item.medal,
        })
      }
    })
  })
  unlisteners.push(entryListener)

  // 监听弹幕事件
  const danmuListener = await listen(EVENTS.BARRAGE_MESSAGE_EVENT, (event) => {
    const data = event.payload as object[]
    data.forEach(async (item: any) => {
      const { uname, message, isEmoji, emoji, medal, uface, time, isManager, uid, isAnchor, isSafe } = item.barrage

      const msg = {
        uid,
        uname,
        uface: `${uface}@300w_300h_1c.avif`,
        message: isEmoji ? emoji.url : message,
        isSafe,
        type: isEmoji ? 'emoji' : 'message',
        id: item.id,
        medal,
        time,
        isManager,
        isAnchor,
      }

      if (message) {
        msgList.value.push(msg as IMsg)

        // 是否是点歌弹幕
        if (message.startsWith('点歌')) {
          const { currentRoom } = storeToRefs(useAppStore())
          const demand = message.split(/点歌\s+/)[1]
          if (demand && demand.length) {
            // 主播/房管/牌牌点歌不计数
            const isFree = isManager || isAnchor || +medal?.room_id === +(currentRoom.value || 0)
            emit('danmaku-demand-music', { demand, uname, uid, isFree })
          }
        }

        // 房管切歌
        if ((isManager || isAnchor) && message === '切歌')
          emit('danmaku-cut-music')

        const { isBroadcast } = storeToRefs(useAppStore())
        if (isBroadcast.value) {
          useSocket({
            type: 'danmu',
            command: 'send',
            data: msg,
          })
        }

        const { danmuConfig, text } = storeToRefs(useSpeechStore())
        const { play } = useSpeechStore()
        if (danmuConfig.value.isOn && msg.type === 'message') {
          // 去除message中的表情
          const pureText = message.replace(/<[^>]+>/g, '')
          text.value = danmuConfig.value.pattern.replace('{user}', uname).replace('{msg}', pureText)
          play()
        }
      }

      if (item.barrageType === 'like') {
        // 点赞事件
        msgList.value.push({
          type: 'like',
          uname,
          message: `${uname} 点了个赞`,
          id: item.id,
          medal: item.medal,
        })
      }
    })
  })
  unlisteners.push(danmuListener)

  // 监听礼物事件
  const giftListener = await listen(EVENTS.GIFT_EVENT, (event) => {
    const data = event.payload as object[]
    data.forEach(async (item: any) => {
      const { uname, giftName, giftId } = item.barrage

      if (giftId !== 1) {
        msgList.value.push({
          type: 'gift',
          uname,
          message: `感谢 ${uname} 赠送了 ${giftName}`,
          id: item.id,
          medal: item.medal,
        })

        const { giftConfig, text } = storeToRefs(useSpeechStore())
        const { play } = useSpeechStore()
        if (giftConfig.value.isOn) {
          text.value = giftConfig.value.pattern.replace('{user}', uname).replace('{msg}', `赠送了 ${giftName}`)
          play()
        }
      }
    })
  })
  unlisteners.push(giftListener)
}

async function getEmojiList() {
  const { data } = await getEmojiApi()
  emojiList.value = [
    textEmoji,
    ...data.data,
  ]
}

async function startWebsocket() {
  const { currentRoom, msgList } = storeToRefs(useAppStore())
  const { data } = await getLiveStatusApi()
  const roomid = Object.keys(data.by_room_ids)[0]
  if (!roomid) {
    ElNotification({
      title: '房间号错误',
      type: 'error',
    })
    return
  }

  const { addRoom } = useAppStore()

  const info: IRoom = {
    roomid: +data.by_room_ids[`${roomid}`].room_id,
    uname: data.by_room_ids[`${roomid}`].uname,
  }

  currentRoom.value = info.roomid
  addRoom(info)

  emit(EVENTS.OPEN_WEBSOCKET_EVENT, `${roomid}`)
  once(EVENTS.CONNECT_SUCCESS_EVENT, () => {
    ElNotification({
      title: '连接成功',
      type: 'success',
    })
    connected.value = true
    msgList.value = []
    getEmojiList()
    init_listener()
    const { init } = useSpeechStore()
    init()
  })
}

function stopWebsocket() {
  connected.value = false
  emit(EVENTS.CLOSE_WEBSOCKET_EVENT)
  unlisteners.forEach(unlistener => unlistener())
  unlisteners.length = 0
  const { stop } = useSpeechStore()
  stop()
}

export {
  connected,
  emojiList,
  startWebsocket,
  stopWebsocket,
  getEmojiList,
}
