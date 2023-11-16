<script lang="ts" setup>
import Medal from '@/components/Medal.vue'
import { connected } from '@/utils/room'

const props = defineProps<{
  msgList: IMsg[]
  mode: 'host' | 'client'
}>()

defineEmits(['clear'])

const danmuRef = ref<HTMLElement>()

const autoScroll = ref(true)

watch(() => props.msgList, () => {
  if (!danmuRef.value || !autoScroll.value)
    return

  nextTick(() => {
    danmuRef.value!.scrollTop = danmuRef.value!.scrollHeight
  })
}, {
  deep: true,
})

watch(autoScroll, (val) => {
  if (val)
    danmuRef.value!.scrollTop = danmuRef.value!.scrollHeight
})
</script>

<template>
  <div ref="danmuRef" class="danmu">
    <div v-if="mode === 'host'" class="fixed right-5 top-28 center gap-2">
      <el-tooltip content="自动滚动">
        <el-button v-show="connected" :type="autoScroll ? 'primary' : 'info'" size="small" round plain @click="autoScroll = !autoScroll">
          <span class="i-carbon-auto-scroll h-4 w-4" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="清屏">
        <el-button v-show="msgList.length" type="danger" size="small" plain round @click="$emit('clear')">
          <span class="i-carbon-trash-can h-4 w-4" />
        </el-button>
      </el-tooltip>
    </div>
    <span v-for="item in msgList" :key="item.id" class="flex items-center gap-1 text-sm">
      <div v-if="item.type === 'emoji'" class="flex gap-2 text-base">
        <div v-if="item.medal">
          <Medal :medal="item.medal" />
        </div>
        <span class="text-amber">{{ item.uname }}: </span>
        <div v-if="item.type === 'emoji'">
          <img :src="item.message" alt="" class="min-h-6 w-20">
        </div>
      </div>
      <div v-else-if="item.type === 'message'" class="text-base">
        <Medal v-if="item.medal" :medal="item.medal" />
        <span class="ml-1 text-amber">{{ item.uname }}: </span>
        <span
          :class="{
            'text-blue-500': mode === 'host',
            'text-white': mode === 'client',
          }"
        >{{ item.message }}</span>
      </div>
      <span v-else-if="item.type === 'gift'" class="text-red">{{ item.message }}</span>
      <span v-else-if="item.type === 'like' || item.type === 'follow'" class="text-orange">{{ item.message }}</span>
      <span v-else class="text-gray-400">{{ item.message }}</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
.danmu{
  @apply h-130 overflow-y-scroll w-full p-2 flex flex-col gap-2 relative;
  scroll-behavior: smooth;
}
</style>
