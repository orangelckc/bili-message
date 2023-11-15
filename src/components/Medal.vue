<script lang="ts" setup>
const props = defineProps<{
  medal: IUserMedal | undefined
}>()

const colors = computed(() => {
  if (!props.medal) {
    return {
      start: '#999',
      end: '#999',
      border: '#999',
    }
  }

  return {
    start: calcColor(props.medal.medal_color_start),
    end: calcColor(props.medal.medal_color_end),
    border: calcColor(props.medal.medal_color_border),
  }
})

// 将十进制的数值转换为十六进制的颜色值
function calcColor(ori: number) {
  return `#${ori.toString(16).padStart(6, '0')}`
}
</script>

<template>
  <div
    class="medal h-18px w-80px text-xs hover:cursor-pointer hover:shadow-lime"
    :style="{
      borderColor: colors.border,
    }"
  >
    <div
      class="h-full center flex-1 px-1 text-white"
      :style="{
        background: `linear-gradient(to left, ${colors.start}, ${colors.end})`,
      }"
    >
      {{ medal?.medal_name || '未佩戴' }}
    </div>
    <div v-if="medal" class="w-24px center bg-white px-1 text-gray-500" :class="`text-[${colors.end}]`">
      {{ medal.level }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.medal{
  @apply flex items-center rounded-md shadow border-solid border-1 overflow-hidden;
}
</style>
