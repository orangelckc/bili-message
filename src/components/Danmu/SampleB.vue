<script lang="ts" setup>
import Medal from '@/components/Medal.vue'

const props = defineProps<{
  danmaku: IMsg
  customStyle?: ICustomStyle
}>()

const baseColor = ref('0, 0, 0') // 黑色

const background = computed(() => {
  return `linear-gradient(to right, rgba(${baseColor.value}, 0.9) 0%, rgba(${baseColor.value}, 0.9) 66%, rgba(${baseColor.value}, 0.6) 80%, rgba(${baseColor.value},0.4) 100%)`
})

watchEffect(() => {
  if (props.customStyle?.msgBackground) {
    // 如果是#开头的颜色值，转换为rgb
    if (props.customStyle.msgBackground.startsWith('#')) {
      const color = props.customStyle.msgBackground
        .slice(1)
        .match(/.{2}/g)
        ?.map(x => Number.parseInt(x, 16))
        .join(', ')

      baseColor.value = color || '0, 0, 0'
    }
  }
})
</script>

<template>
  <div class="content">
    <div class="absolute right-0 w-2/5 -top-1/3 -z-1">
      <img v-if="danmaku?.uface" :src="danmaku.uface" class="h-full w-full">
    </div>
    <div class="mb3 flex items-center gap3">
      <span class="text-base text-white/80">{{ props.danmaku.uname }}</span>

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
      class="text-shadow-3px-3px-3px-#000 inline-flex items-center text-xl font-bold text-white/90"
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
