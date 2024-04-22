<script lang="ts" setup>
import ClientDanmu from '@/components/Danmu/Client.vue'
import { LOCAL_WEBSOCKET_URL } from '@/utils/constants'

const msgList = ref<IMsg[]>([])
let ws: WebSocket

const { customStyle, defaultSample } = useAppStore()
const newStyle = ref(customStyle)
const newSample = ref(defaultSample)

async function init_listener() {
  ws = new WebSocket(LOCAL_WEBSOCKET_URL)

  ws.onopen = () => {
    ws.send('sync-config')
    setInterval(() => {
      ws.send('client-ping')
    }, 30 * 1000)
  }

  ws.onmessage = (e) => {
    if (typeof e.data !== 'string')
      return

    try {
      const data = JSON.parse(e.data)

      if (data.type !== 'danmu')
        return

      const command = data.command as SocketDanmuCommand
      const msg = data.data as any
      switch (command) {
        case 'sample':{
          // 切换样例
          newSample.value = msg
          break
        }
        case 'config':{
          // 更新样式
          newStyle.value = msg
          break
        }
        case 'clear':{
          // 清空弹幕
          msgList.value = []
          break
        }
        case 'send':{
          // 捕获弹幕
          msgList.value.push(msg as IMsg)
          break
        }
      }
    }
    catch (error) {
      ElMessage.success(e.data)
    }
  }

  ws.onerror = (error) => {
    ElMessage.error(`连接失败: ${error}`)
  }
}

onMounted(() => {
  init_listener()
})
</script>

<template>
  <div class="w-full overflow-hidden rounded-lg">
    <ClientDanmu
      :msg-list="msgList"
      :custom-style="newStyle"
      :sample="newSample"
    />
  </div>
</template>
