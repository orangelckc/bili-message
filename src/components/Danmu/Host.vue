<script lang="ts" setup>
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'
import { dayjs } from 'element-plus'
import { VirtualList } from 'vue-tiny-virtual-list'

import HostItem from './HostItem.vue'

import { connected } from '@/utils/room'
import { useSocket } from '@/utils/socket'

const { msgList, autoScroll } = storeToRefs(useAppStore())

const danmuRef: Ref<InstanceType<typeof VirtualList> | null> = ref(null)

function handleClear() {
  msgList.value = []
  useSocket({
    type: 'danmu',
    command: 'clear',
  })
}

function handleExport() {
  const filename = `record-${dayjs().format('YYYY-MM-DD')}.txt`
  const data: string[] = []
  msgList.value.forEach((msg) => {
    if (msg.type === 'message') {
      const pureMessage = msg.message.replace(/<[^>]+>/g, '')
      data.push(`${msg.time}  ${msg.uname}: ${pureMessage}`)
    }
  })
  const str = data.join('\n')
  writeTextFile(filename, str, { dir: BaseDirectory.Desktop })
}

watch(() => msgList.value, () => {
  if (!danmuRef.value || !autoScroll.value)
    return

  nextTick(() => {
    danmuRef.value?.scrollToBottom()
  })
}, {
  deep: true,
})

watch(autoScroll, (val) => {
  if (val)
    danmuRef.value?.scrollToBottom()
})
</script>

<template>
  <div class="danmu">
    <div class="fixed right-5 top-28 opacity-0 hover:opacity-100">
      <el-tooltip v-if="connected" content="自动滚动">
        <el-button :type="autoScroll ? 'primary' : 'info'" size="small" round plain @click="autoScroll = !autoScroll">
          <span class="i-carbon-auto-scroll h4 w4" />
        </el-button>
      </el-tooltip>
      <el-tooltip v-if="msgList.length" content="导出记录">
        <el-button type="warning" size="small" plain round @click="handleExport">
          <span class="i-carbon-document-export h4 w4" />
        </el-button>
      </el-tooltip>
      <el-tooltip v-if="msgList.length" content="清屏">
        <el-button type="danger" size="small" plain round @click="handleClear">
          <span class="i-carbon-trash-can h4 w4" />
        </el-button>
      </el-tooltip>
    </div>
    <VirtualList
      ref="danmuRef" item-key="id" :list="msgList" :min-size="30" :fixed="false" :buffer="2"
    >
      <template #default="{ itemData }">
        <HostItem :item-data="itemData" />
      </template>
    </VirtualList>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
.danmu{
  @apply h-130 w-full p-2 relative;
}
</style>
