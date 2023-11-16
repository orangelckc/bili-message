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
  <span
    class="medal text-center"
    :style="{
      borderColor: colors.border,
    }"
  >
    <span
      class="px-1"
      :style="{
        background: `${medal ? `linear-gradient(to right, ${colors.start}, ${colors.end})` : 'white'}`,
        color: `${medal ? 'white' : 'gray'}`,
      }"
    >
      {{ medal?.medal_name || '未佩戴' }}
    </span>
    <span v-if="medal?.level" class="bg-white px-1 text-center font-medium text-gray-500" :class="`text-[${colors.end}]`">
      {{ medal.level }}
    </span>
  </span>
</template>

<style lang="scss" scoped>
.medal{
  @apply h-20px leading-20px text-xs hover:cursor-pointer rounded-sm border-solid border-1 hover:shadow;
}
</style>
