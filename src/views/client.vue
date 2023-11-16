<script lang="ts" setup>
import Danmu from '@/components/Danmu.vue'
import { LOCAL_WEBSOCKET_URL } from '@/utils/constants'

const msgList = ref<IMsg[]>([])
let ws: WebSocket

async function init_listener() {
  ws = new WebSocket(LOCAL_WEBSOCKET_URL)

  ws.onopen = () => {
    ElMessage.success('连接成功')
  }

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data) as IMsg
    msgList.value.push(data)
  }

  ws.onerror = () => {
    ElMessage.error('连接失败')
  }
}

onMounted(() => {
  init_listener()
})
</script>

<template>
  <div class="w-400px overflow-hidden rounded-lg">
    <Danmu
      mode="client"
      :msg-list="msgList"
      :custom-style="{
        unameColor: 'orange',
        unameFontSize: '18px',
        msgColor: 'white',
        msgFontSize: '18px',
        msgGap: '8px',
        msgBackground: 'linear-gradient(to right, #8A2BE2, #4B0082)',
      }"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
