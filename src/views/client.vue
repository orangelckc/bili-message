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
    setInterval(() => {
      ws.send('client-ping')
    }, 30 * 1000)
  }

  ws.onmessage = (e) => {
    if (typeof e.data !== 'string')
      return

    try {
      const data = JSON.parse(e.data)
      if (data.type === 'sample') {
        newSample.value = data.data
        return
      }
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
  <div class="w-full overflow-hidden rounded-lg">
    <ClientDanmu
      :msg-list="msgList"
      :custom-style="newStyle"
      :sample="newSample"
    />
  </div>
</template>
