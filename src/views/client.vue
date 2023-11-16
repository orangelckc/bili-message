<script lang="ts" setup>
import Danmu from '@/components/Danmu.vue'
import { LOCAL_WEBSOCKET_URL } from '@/utils/constants'

const msgList = ref<IMsg[]>([])
let ws: WebSocket

const { customStyle } = useAppStore()
const newStyle = ref(customStyle)

async function init_listener() {
  ws = new WebSocket(LOCAL_WEBSOCKET_URL)

  ws.onopen = () => {
    setInterval(() => {
      ws.send('client-ping')
    }, 30 * 1000)
  }

  ws.onmessage = (e) => {
    if (typeof e.data !== 'string')
      return

    try {
      const data = JSON.parse(e.data)
      if (data.type === 'config') {
        newStyle.value = data.data
        return
      }

      if (data.type === 'command') {
        switch (data.command) {
          case 'clear':
            msgList.value = []
            break
        }
      }

      msgList.value.push(data as IMsg)
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
  <div class="w-[400px] overflow-hidden rounded-lg">
    <Danmu
      mode="client"
      :msg-list="msgList"
      :custom-style="newStyle"
    />
  </div>
</template>
