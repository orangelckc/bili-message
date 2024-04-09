<script lang="ts" setup>
import { writeText } from '@tauri-apps/api/clipboard'
import { emit, listen } from '@tauri-apps/api/event'

import type { UnlistenFn } from '@tauri-apps/api/event'

import List from '@/components/Music-List.vue'
import { LOCAL_BROADCAST_URL } from '@/utils/constants'

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(['update:modelValue'])
const { isBroadcast } = storeToRefs(useAppStore())

const trigger = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

async function handleCopy() {
  await writeText(`${LOCAL_BROADCAST_URL}/music`)
  ElMessage.success('复制成功, 链接可直接在OBS中使用')
}

const { freeLimit, blockList } = storeToRefs(useMusicStore())

watch(freeLimit, (val) => {
  emit('change-free-limit', val)
})

let listener: UnlistenFn
onMounted(async () => {
  if (listener)
    listener()

  listener = await listen('add-to-block', ({ payload }) => {
    blockList.value.push(payload as ISong)
  })
})

onUnmounted(() => {
  if (listener)
    listener()
})
</script>

<template>
  <el-drawer v-model="trigger" title="点歌配置" :with-header="true" direction="ltr" :modal="true" size="300" @close="trigger = false">
    <div class="h-full flex flex-col gap3">
      <div class="center gap3">
        <span class="i-carbon-music h5 w5" :class="isBroadcast ? 'bg-green' : 'bg-gray'" />
        <el-link type="primary" :disabled="!isBroadcast" @click="handleCopy">
          复制音乐URL
        </el-link>
      </div>
      <el-input v-model="freeLimit" placeholder="数量">
        <template #prepend>
          免费数量
        </template>
      </el-input>
      <div class="mt5 flex-1">
        <span>黑名单<span class="text-xs text-[#666]">(显示有延迟，点歌的时候自动拦截)</span></span>
        <List :list="blockList" type="collection" />
      </div>
    </div>
  </el-drawer>
</template>
