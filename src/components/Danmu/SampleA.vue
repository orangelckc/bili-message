<script lang="ts" setup>
import Medal from '@/components/Medal.vue'

defineProps<{
  danmaku: IMsg
  customStyle?: ICustomStyle
}>()
</script>

<template>
  <div
    class="p1 text-sm"
    :style="{
      paddingBottom: `${customStyle?.msgGap}px`,
    }"
  >
    <div
      v-if="danmaku.type === 'emoji'" class="flex items-center"
      :style="{
        background: customStyle?.msgBackground,
      }"
    >
      <div v-if="danmaku.medal && danmaku.medal.is_lighted">
        <Medal :medal="danmaku.medal" class="w24rpx" />
      </div>
      <span
        class="text-base text-amber"
        :style="{
          color: customStyle?.unameColor,
          fontSize: `${customStyle?.unameFontSize}px`,
        }"
      >{{ danmaku.uname }} </span>
      <div v-if="danmaku.type === 'emoji'">
        <img :src="danmaku.message" alt="" class="ml1 min-h-6 w14">
      </div>
    </div>
    <div
      v-else-if="danmaku.type === 'message'" class="flex flex-col gap1"
      :style="{
        background: customStyle?.msgBackground,
      }"
    >
      <div class="inline-flex items-center gap1">
        <el-avatar v-if="danmaku.uface" :src="danmaku.uface" size="small" shape="circle" />
        <Medal v-if="danmaku.medal && danmaku.medal.is_lighted" :medal="danmaku.medal" class="w24rpx" />
        <div class="text-base text-amber">
          {{ danmaku.uname }}
        </div>
        <div class="ml2 text-xs text-gray/200">
          {{ danmaku.time }}
        </div>
      </div>
      <div
        class="ml2 inline-flex items-center text-base text-blue-500"
        :style="{
          color: customStyle?.msgColor,
          fontSize: `${customStyle?.msgFontSize}px`,
        }"
        v-html="danmaku.message"
      />
    </div>
    <span v-else-if="danmaku.type === 'gift'" class="text-red">{{ danmaku.message }}</span>
    <span v-else-if="danmaku.type === 'like' || danmaku.type === 'follow'" class="text-orange">{{ danmaku.message }}</span>
    <span v-else class="text-gray-400">{{ danmaku.message }}</span>
  </div>
</template>
