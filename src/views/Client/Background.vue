<script lang="ts" setup>
import DynamicBackground from '@/components/Dynamic-Background.vue'
import { LOCAL_WEBSOCKET_URL } from '@/utils/constants'

const albumImageUrl = ref('')
const isDynamic = ref(false)

let ws: WebSocket
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
      if (data.type !== 'background')
        return

      // 获取到歌曲相关信息
      const command = data.command as SocketBackgroundCommand
      switch (command) {
        case 'change':{
          albumImageUrl.value = data.data.replace('http://', 'https://')
          break
        }
        case 'dynamic':{
          isDynamic.value = data.data
          break
        }
        case 'change-dynamic':{
          if (isDynamic.value)
            albumImageUrl.value = data.data

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
  <DynamicBackground
    :album-image-url="albumImageUrl"
    class="absolute inset-0 -z-1"
  />
</template>
