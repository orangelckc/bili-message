<script lang="ts" setup>
import { emit, listen } from '@tauri-apps/api/event'

import type { UnlistenFn } from '@tauri-apps/api/event'

import List from '@/components/Music-List.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(['update:modelValue'])

const trigger = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

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
    <div class="h-full flex flex-col">
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
