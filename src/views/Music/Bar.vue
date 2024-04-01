<script lang="ts" setup>
const { currentSong, isPlaying, duration, currentTime, currentVolume } = storeToRefs(useMusicStore())
const { playPrev, playNext, togglePlay, seek, setVolume } = useMusicStore()

function formattedTime(timeInSeconds: number) {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)

  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}

function onChange(value: any) {
  seek(value)
}

function changeVolume(value: any) {
  setVolume(value)
}
</script>

<template>
  <div class="relative h20 w-full flex items-center border border-t-1 rounded-t-xl border-solid bg-white px5">
    <div class="absolute left-3 right-3 z-2 px-1 -top-2">
      <el-slider
        v-model="currentTime"
        :step="0.1"
        :max="duration"
        height="0"
        size="small"
        :format-tooltip="formattedTime"
        @change="onChange"
      />
    </div>
    <el-avatar shape="square" :size="60" :src="currentSong?.pic" />
    <div class="relative mx2 box-border flex flex-1 flex-col justify-between overflow-hidden">
      <span class="line-scroll">
        {{ currentSong?.name }}
      </span>
      <span class="truncate">
        {{ currentSong?.artist }}
      </span>
    </div>
    <div class="ml-auto center flex-col gap1">
      <div class="flex gap5">
        <span class="btn i-carbon-skip-back" @click="playPrev" />
        <span class="btn" :class="isPlaying ? 'i-carbon-pause' : 'i-carbon-play'" @click="togglePlay" />
        <span class="btn i-carbon-skip-forward" @click="playNext" />
      </div>
      <div class="w-full flex">
        <!-- <span>音量</span> -->
        <el-slider
          v-model="currentVolume"
          :step="1"
          :max="100"
          height="0"
          size="small"
          @change="changeVolume"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.btn {
  @apply cursor-pointer font-extrabold text-xl;
}

:deep(.el-slider__button){
  @apply w-2 h-2;
}

.line-scroll{
  white-space: nowrap;
  animation: marquee 10s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
