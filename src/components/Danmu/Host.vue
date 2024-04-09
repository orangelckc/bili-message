<script lang="ts" setup>
import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'
import { dayjs } from 'element-plus'
import { VirtualList } from 'vue-tiny-virtual-list'

import Medal from '@/components/Medal.vue'
import { ROOM_URL_PREFIX } from '@/utils/constants'
import { connected } from '@/utils/room'
import { useSocket } from '@/utils/socket'

const { autoScroll } = storeToRefs(useAppStore())
const { msgList } = storeToRefs(useAppStore())

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
    danmuRef.value.scrollToBottom()
  })
}, {
  deep: true,
})

watch(autoScroll, (val) => {
  if (val)
    danmuRef.value.scrollToBottom()
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
        <div class="p1 text-sm">
          <div v-if="itemData.type === 'emoji'" class="flex items-center">
            <div v-if="itemData.medal">
              <el-tooltip
                v-if="itemData.medal && itemData.medal.is_lighted"
                placement="top"
                :width="80"
                trigger="hover"
                effect="light"
              >
                <template #content>
                  <a :href="`${ROOM_URL_PREFIX}/${itemData.medal?.room_id}`" target="_blank" class="text-blue-400">去直播间
                  </a>
                </template>
                <Medal :medal="itemData.medal" class="w24rpx" />
              </el-tooltip>
            </div>
            <span class="text-base text-amber">{{ itemData.uname }} </span>
            <div v-if="itemData.type === 'emoji'">
              <img :src="itemData.message" alt="" class="ml1 min-h-6 w14">
            </div>
          </div>
          <div v-else-if="itemData.type === 'message'" class="flex flex-col gap1">
            <div class="inline-flex items-center gap1">
              <el-avatar v-if="itemData.uface" :src="itemData.uface" size="small" shape="circle" />
              <el-tooltip
                v-if="itemData.medal && itemData.medal.is_lighted"
                placement="top"
                :width="80"
                trigger="hover"
                effect="light"
              >
                <template #content>
                  <a :href="`${ROOM_URL_PREFIX}/${itemData.medal?.room_id}`" target="_blank" class="text-blue-400">去直播间
                  </a>
                </template>
                <Medal :medal="itemData.medal" class="w24rpx" />
              </el-tooltip>
              <div class="text-base text-amber">
                {{ itemData.uname }}
              </div>
              <div class="ml2 text-xs text-gray/200">
                {{ itemData.time }}
              </div>
            </div>
            <div class="ml2 inline-flex items-center text-base text-blue-500" v-html="itemData.message" />
          </div>
          <span v-else-if="itemData.type === 'gift'" class="text-red">{{ itemData.message }}</span>
          <span v-else-if="itemData.type === 'like' || itemData.type === 'follow'" class="text-orange">{{ itemData.message }}</span>
          <span v-else class="text-gray-400">{{ itemData.message }}</span>
        </div>
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
