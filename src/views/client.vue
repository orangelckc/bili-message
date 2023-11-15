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
    <el-card
      class="w-full"
      :body-style="{
        padding: '0',
        margin: '0',
        backgroundColor: 'rgba(0,0,0,0.7)',
      }"
    >
      <Danmu :msg-list="msgList" mode="client" @clear="msgList = []" />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>

</style>
