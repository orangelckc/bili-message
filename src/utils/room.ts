import { emit, listen, once } from '@tauri-apps/api/event'
import { ElNotification } from 'element-plus'

import { hxdEmoji, textEmoji } from './emoji'
import { socket } from './socket'

import type { UnlistenFn } from '@tauri-apps/api/event'

import { getEmojiApi, getLiveStatusApi } from '@/apis/live'
import * as EVENTS from '@/utils/events'

const connected = ref(false)

const unlisteners: UnlistenFn[] = []
const emojiList = ref<any[]>([textEmoji, hxdEmoji])

async function init_listener() {
  const { msgList } = storeToRefs(useAppStore())

  // 清空监听
  unlisteners.forEach(unlisten => unlisten())
  unlisteners.length = 0

  // 监听关注事件/进入房间事件
  const entryListener = await listen(EVENTS.WELCOME_EVENT, (event) => {
    unlisteners.push(entryListener)

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

  // 监听弹幕事件
  const danmuListener = await listen(EVENTS.BARRAGE_MESSAGE_EVENT, (event) => {
    unlisteners.push(danmuListener)

    const data = event.payload as object[]
    data.forEach(async (item: any) => {
      const { uname, message, isEmoji, emoji, medal, uface, time } = item.barrage

      const msg = {
        uname,
        uface,
        message: isEmoji ? emoji.url : message,
        type: isEmoji ? 'emoji' : 'message',
        id: item.id,
        medal,
        time,
      }

      if (message) {
        msgList.value.push(msg as IMsg)

        // 是否是点歌弹幕
        if (message.startsWith('点歌')) {
          const bvid = message.split('点歌')[1].trim()
          if (bvid.startsWith('BV') && bvid.length === 12)
            emit('danmaku-demand-music', bvid)
        }

        const { isBroadcast } = storeToRefs(useAppStore())
        if (isBroadcast.value)
          socket.send(msg)

        const { isOn, text, pattern } = storeToRefs(useSpeechStore())
        const { play } = useSpeechStore()
        if (isOn.value && msg.type === 'message') {
          text.value = pattern.value.replace('{user}', uname).replace('{msg}', message)
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

  // 监听礼物事件
  const giftListener = await listen(EVENTS.GIFT_EVENT, (event) => {
    unlisteners.push(giftListener)

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
      }
    })
  })
}

async function getEmojiList() {
  const { data } = await getEmojiApi()
  emojiList.value.push(...data.data)
}

async function startWebsocket() {
  const { room, msgList } = storeToRefs(useAppStore())
  const { data } = await getLiveStatusApi()
  const roomid = Object.keys(data.by_room_ids)[0]
  if (!roomid) {
    ElNotification({
      title: '房间号错误',
      type: 'error',
    })
    return
  }

  room.value = +roomid
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
}

export {
  connected,
  emojiList,
  startWebsocket,
  stopWebsocket,
  getEmojiList,
}
