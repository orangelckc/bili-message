<script lang="ts" setup>
import { LOCAL_WEBSOCKET_URL } from '@/utils/constants'

const msgList = ref<string[]>([])
let ws: WebSocket

async function init_listener() {
  ws = new WebSocket(LOCAL_WEBSOCKET_URL)

  ws.onopen = () => {
    ElMessage.success('连接成功')
  }

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data)
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
  <div>
    {{ msgList }}
  </div>
</template>

<style lang="scss" scoped>

</style>
