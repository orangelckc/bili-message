<script lang="ts" setup>
// import BackgroundRender from '@/components/Background.vue'
import { Transition } from 'vue'

import { LOCAL_WEBSOCKET_URL } from '@/utils/constants'
import { formattedTime } from '@/utils/tools'

let ws: WebSocket
const currentTime = ref(0)
const currentSong = ref<ISong>()
const isPaused = ref(true)
const songList = ref<ISong[]>([])
const tip = ref('')
const showNotification = ref(false)

watch(tip, () => {
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 10000)
})

async function init_listener() {
  ws = new WebSocket(LOCAL_WEBSOCKET_URL)

  ws.onopen = () => {
    setInterval(() => {
      ws.send('client-ping')
    }, 30 * 1000)
  }

  ws.onmessage = (e) => {
    if (typeof e.data !== 'string')
      return

    try {
      const data = JSON.parse(e.data)
      if (data.type !== 'music')
        return

      // 获取到歌曲相关信息
      const command = data.command as SocketMusicCommand
      const msg = data.data as any
      switch (command) {
        case 'update':{
          // 更新歌曲播放进度
          currentTime.value = msg
          break
        }
        case 'play':{
          // 播放
          currentSong.value = msg
          isPaused.value = false
          break
        }
        case 'pause':{
          // 暂停
          isPaused.value = true
          break
        }
        case 'end':{
          // 结束
          isPaused.value = true
          break
        }
        case 'demand':{
          // 点歌
          tip.value = msg
          break
        }
        case 'sync':{
          // 同步播放列表
          songList.value = msg
          break
        }
      }
    }
    catch (error) {
      ElMessage.success(e.data)
    }
  }

  ws.onerror = (error) => {
    ElMessage.error(`连接失败: ${error}`)
  }
}

// const backgroundImage = computed(() => currentSong.value?.pic || '')

const showTime = computed(() => {
  if (!currentSong.value)
    return formattedTime(0)

  const rest = currentSong.value?.duration - currentTime.value

  return formattedTime(Math.max(0, rest))
})

const showName = computed(() => {
  if (!currentSong.value)
    return '暂无歌曲'

  return currentSong.value.name
})

const rotate = computed(() => {
  if (!currentSong.value)
    return -30

  if (currentTime.value >= currentSong.value.duration - 3)
    return -30

  return 0
})

onMounted(() => {
  init_listener()
})
</script>

<template>
  <div class="relative center overflow-hidden rounded-lg bg-black/10 p4 text-white/90">
    <Transition name="slide">
      <div
        v-if="showNotification"
        class="fixed left-0 right-20 top-10px z-9 flex items-center justify-end"
      >
        <div class="w-1/2 flex items-center overflow-hidden rounded-lg bg-black/10 px30px py10px">
          <span
            class="text-2xl text-white/90"
            :class="{
              'line-scroll': tip.length > 10,
            }"
          >
            {{ tip }}
          </span>
        </div>
      </div>
    </Transition>
    <div class="relative w-full center gap4">
      <div class="relative h30 w30 center flex-col gap4">
        <img
          src="@/assets/needle.png"
          alt="needle"
          class="absolute left-1/2 z-3 h16 transition-all transition-duration-800 -top-8 -translate-x-1/2"
          :style="{
            transform: `rotate(${rotate}deg)`,
            transformOrigin: 'left top',
          }"
        >
        <img
          src="@/assets/disc.png" alt="disc"
          class="absolute inset-0 z-1 h-full w-full"
          :class="{ 'rotate-disc': !isPaused }"
        >
        <el-avatar :src="currentSong?.pic" :size="70" shape="circle" fit="cover" class="z-2 shadow-2xl" />
        <span class="absolute z-1 truncate text-sm text-white/50 -bottom-6">{{ currentSong?.artist }}</span>
      </div>
      <div class="flex flex-1 flex-col overflow-hidden">
        <div class="center justify-between">
          <div class="flex items-end gap2">
            <span class="text-xl font-bold text-white/80">
              正在播放
            </span>
            <span class="text-sm text-white/50">
              {{ currentSong?.bvid }}
            </span>
          </div>
          <span class="w-16 rounded-xl bg-white/10 px3 py1 text-center">
            {{ showTime }}
          </span>
        </div>

        <span
          class="my6 box-border w-full text-2xl"
          :class="{
            'line-scroll': showName.length > 10,
          }"
        >
          {{ showName }}
        </span>

        <div class="w-full flex gap3 overflow-hidden rounded-lg bg-black/30 p4">
          <div class="relative flex-1">
            <div
              v-if="songList.length"
              class="absolute left-0 right-0 top-0 flex flex-1 flex-col gap3 overflow-hidden truncate"
              :class="{
                'scroll-list': songList.length > 1,
              }"
            >
              <span v-for="(song, index) in songList" :key="song.bvid" class="flex items-center gap2">
                <span class="text-sm text-white/40">{{ index + 1 }}</span>
                <span class="text-lg text-white/70"> {{ song.name }}</span>
              </span>
            </div>
            <span v-else class="text-lg text-white/70"> 弹幕点歌格式：点歌+空格+BV号</span>
          </div>
          <span class="text-xl font-semibold text-white/30">即将播放</span>
        </div>
      </div>
    </div>
    <!-- <BackgroundRender
      :album-image-url="backgroundImage"
      class="absolute inset-0 -z-1"
    /> -->
  </div>
</template>

<style scoped lang="scss">
.line-scroll{
  white-space: nowrap;
  animation: marquee 10s linear infinite;
  animation-delay: 1.5s;
}

@keyframes marquee {
  0% {
    transform: translateX(30px);
  }
  100% {
    transform: translateX(-100%);
  }
}

.rotate-disc {
  transition-delay: 2s;
  animation: spin 3s linear infinite;
}

.scroll-list{
  animation: scroll 30s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes scroll {
  0% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
}

.slide-enter-active {
  animation: slideDown 0.8s;
}
.slide-leave-active {
  animation: slideUp 0.8s;
}

@keyframes slideDown {
  0% { transform: translateY(-150%); }
  100% { transform: translateY(0); }
}

@keyframes slideUp {
  0% { transform: translateY(0); }
  100% { transform: translateY(-150%); }
}
</style>
