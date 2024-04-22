<script lang="ts" setup>
const props = defineProps<{
  danmaku: IMsg
  customStyle?: ICustomStyle
}>()

const baseStyle: ICustomStyle = {
  avatarSize: 100,
  unameColor: 'rgba(255, 255, 255, 0.8)',
  unameFontSize: 16,
  msgColor: 'rgba(255, 255, 255, 0.9)',
  msgFontSize: 20,
  msgBackground: 'rgba(0, 0, 0, 0.5)',
  showMedal: false,
}
const showStyle = computed(() => {
  return {
    ...baseStyle,
    ...props.customStyle,
  }
})
</script>

<template>
  <div class="content">
    <el-avatar :size="Number(showStyle.avatarSize)" :src="danmaku.uface" class="avatar-shadow" />
    <div
      class="rounded-b-xl rounded-r-xl px-4 py-2"
      :style="{
        background: showStyle.msgBackground || 'rgba(0, 0, 0, 0.5)',
      }"
    >
      <div v-if="danmaku.type === 'emoji'">
        <img :src="danmaku.message" alt="" class="ml1 h-12">
      </div>
      <div
        v-if="danmaku.type === 'message'"
        class="text-shadow-3px-3px-3px-#000 font-semibold leading-relaxed"
        :style="{
          color: showStyle.msgColor,
          fontSize: `${showStyle.msgFontSize}px`,
        }"
      >
        <div v-if="danmaku.isSafe" class="inline-flex flex-wrap items-center" v-html="danmaku.message" />
        <div v-else v-text="danmaku.message" />
      </div>
    </div>
  </div>
</template>

<style scoped land="scss">
.content{
  @apply w-full flex gap3;

  .avatar-shadow {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
}
</style>
