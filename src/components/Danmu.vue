<script lang="ts" setup>
import Medal from '@/components/Medal.vue'

const props = defineProps<{
  msgList: IMsg[]
  mode: 'host' | 'client'
  customStyle?: ICustomStyle
}>()

const { autoScroll } = storeToRefs(useAppStore())

const danmuRef = ref<HTMLElement>()

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
  <div
    ref="danmuRef" class="danmu"
    :style="{
      gap: `${customStyle?.msgGap}px`,
    }"
  >
    <slot />
    <div
      v-for="item in msgList" :key="item.id" class="flex flex-col justify-center px1 text-sm"
    >
      <div v-if="item.type === 'emoji'" class="flex items-center">
        <div v-if="item.medal">
          <Medal :medal="item.medal" />
        </div>
        <span
          class="text-base text-amber"
          :style="{
            color: customStyle?.unameColor,
            fontSize: `${customStyle?.unameFontSize}px`,
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
              fontSize: `${customStyle?.unameFontSize}px`,
            }"
          >{{ item.uname }}: </span>
          <span
            class="text-base text-blue-500"
            :style="{
              color: customStyle?.msgColor,
              fontSize: `${customStyle?.msgFontSize}px`,
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
