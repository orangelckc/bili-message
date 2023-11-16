<script lang="ts" setup>
import Medal from '@/components/Medal.vue'
import { connected } from '@/utils/room'

const props = defineProps<{
  msgList: IMsg[]
  mode: 'host' | 'client'
  customStyle?: {
    unameColor?: string
    unameFontSize?: string
    msgColor?: string
    msgFontSize?: string
    msgGap?: string
    msgBackground?: string
  }
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
    <div v-if="mode === 'host'" class="fixed right-5 top-28 center gap2">
      <el-tooltip content="自动滚动">
        <el-button v-show="connected" :type="autoScroll ? 'primary' : 'info'" size="small" round plain @click="autoScroll = !autoScroll">
          <span class="i-carbon-auto-scroll h4 w4" />
        </el-button>
      </el-tooltip>
      <el-tooltip content="清屏">
        <el-button v-show="msgList.length" type="danger" size="small" plain round @click="$emit('clear')">
          <span class="i-carbon-trash-can h4 w4" />
        </el-button>
      </el-tooltip>
    </div>
    <div
      v-for="item in msgList" :key="item.id" class="flex flex-col justify-center gap-1 py-0 text-sm" :style="{
        padding: `${customStyle?.msgGap} 0`,
      }"
    >
      <div v-if="item.type === 'emoji'" class="flex items-center gap2">
        <div v-if="item.medal">
          <Medal :medal="item.medal" />
        </div>
        <span
          class="text-base text-amber"
          :style="{
            color: customStyle?.unameColor,
            fontSize: customStyle?.unameFontSize,
          }"
        >{{ item.uname }}: </span>
        <div v-if="item.type === 'emoji'">
          <img :src="item.message" alt="" class="min-h-6 w20">
        </div>
      </div>
      <div
        v-else-if="item.type === 'message'" class="flex items-center text-base" :style="{
          background: customStyle?.msgBackground,
        }"
      >
        <el-avatar v-if="item.uface" :src="item.uface" size="small" shape="circle" />
        <div>
          <Medal v-if="item.medal" :medal="item.medal" class="ml1" />
          <span
            class="ml1 text-base text-amber"
            :style="{
              color: customStyle?.unameColor,
              fontSize: customStyle?.unameFontSize,
            }"
          >{{ item.uname }}: </span>
          <span
            class="text-base text-blue-500"
            :style="{
              color: customStyle?.msgColor,
              fontSize: customStyle?.msgFontSize,
            }"
          >{{ item.message }}</span>
        </div>
      </div>
      <span v-else-if="item.type === 'gift'" class="text-red">{{ item.message }}</span>
      <span v-else-if="item.type === 'like' || item.type === 'follow'" class="text-orange">{{ item.message }}</span>
      <span v-else class="text-gray-400">{{ item.message }}</span>
    </div>
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
