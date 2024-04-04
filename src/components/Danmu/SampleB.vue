<script lang="ts" setup>
import Medal from '@/components/Medal.vue'

const props = defineProps<{
  danmaku: IMsg
  customStyle?: ICustomStyle
}>()

const baseStyle: ICustomStyle = {
  unameColor: 'rgba(255, 255, 255, 0.8)',
  unameFontSize: 16,
  msgColor: 'rgba(255, 255, 255, 0.9)',
  msgFontSize: 20,
  msgBackground: '0, 0, 0',
  showMedal: false,
}
const showStyle = computed(() => {
  return Object.assign({}, baseStyle, props.customStyle)
})

const background = computed(() => {
  if (props.customStyle?.msgBackground) {
    // 如果是#开头的颜色值，转换为rgb
    if (props.customStyle.msgBackground.startsWith('#')) {
      const color = props.customStyle.msgBackground
        .slice(1)
        .match(/.{2}/g)
        ?.map(x => Number.parseInt(x, 16))
        .join(', ')

      return `linear-gradient(to right, rgba(${color}, 0.9) 0%, rgba(${color}, 0.9) 66%, rgba(${color}, 0.6) 80%, rgba(${color},0.4) 100%)`
    }
    return props.customStyle.msgBackground
  }

  const color = '0, 0, 0'
  return `linear-gradient(to right, rgba(${color}, 0.9) 0%, rgba(${color}, 0.9) 66%, rgba(${color}, 0.6) 80%, rgba(${color},0.4) 100%)`
})
</script>

<template>
  <div class="content">
    <div class="absolute right-0 w-2/5 -top-1/3 -z-1">
      <img v-if="danmaku?.uface" :src="danmaku.uface" class="h-full w-full">
    </div>
    <div class="mb3 flex items-center gap3">
      <span
        :style="{
          color: showStyle.unameColor,
          fontSize: `${showStyle.unameFontSize}px`,
        }"
      >{{ props.danmaku.uname }}</span>

      <div v-if="danmaku.medal && danmaku.medal.is_lighted && customStyle?.showMedal">
        <Medal :medal="danmaku.medal" class="w24px" />
      </div>
      <span class="text-white/50">{{ props.danmaku.time }}</span>
    </div>
    <div v-if="danmaku.type === 'emoji'">
      <img :src="danmaku.message" alt="" class="ml1 h-12">
    </div>
    <div
      v-else
      class="text-shadow-3px-3px-3px-#000 inline-flex items-center font-bold leading-relaxed"
      :style="{
        color: showStyle.msgColor,
        fontSize: `${showStyle.msgFontSize}px`,
      }"
      v-html="danmaku.message"
    />
  </div>
</template>

<style scoped land="scss">
.content{
  @apply relative min-h60px w-full overflow-hidden rounded-2xl p4 shadow-lg;

  background-image: v-bind(background);
}
</style>
