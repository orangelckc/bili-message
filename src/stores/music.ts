import { Howl } from 'howler'

export const useMusicStore = defineStore('music', () => {
  const currentSong = ref<ISong>()
  const playList = ref<ISong[]>([])
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  let player: Howl

  const { currentUser } = storeToRefs(useAppStore())

  const playUrls = computed(() => {
    return currentSong.value?.urls || []
  })

  let timerInterval = 0
  const stop = () => {
    isPlaying.value = false
    player.unload()
    clearInterval(timerInterval)
    playNext()
  }

  function setPlayer() {
    if (playUrls.value.length === 0) {
      playNext()
      return
    }

    player = new Howl({
      src: playUrls.value[0] || [],
      html5: true,
      format: ['mp3', 'mp4', 'm4s'],
      xhr: {
        method: 'GET',
        headers: {
          'Referer': 'https://www.bilibili.com',
          'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
          'cookie': currentUser.value?.cookie || '',
        },
      },
    })

    player.on('load', () => {
      duration.value = player.duration()
      currentTime.value = 0
      player.play()
    })

    player.on('loaderror', () => {
      ElMessage.error('音乐加载失败，加载替换链接')
      playUrls.value.shift()
      setPlayer()
    })

    player.on('play', () => {
      isPlaying.value = true
      timerInterval = setInterval(() => {
        currentTime.value = Math.round(player.seek())
      }, 1000) as unknown as number
    })

    player.on('pause', () => {
      isPlaying.value = false
    })

    player.on('end', () => {
      stop()
    })

    player.on('playerror', () => {
      stop()
    })

    player.on('stop', () => {
      stop()
    })

    player.on('seek', () => {
      currentTime.value = player.seek()
    })
  }

  const playPrev = () => {
    const index = playList.value.findIndex(item => item === currentSong.value)
    if (index === 0) {
      player.stop()
      return
    }
    currentSong.value = playList.value[index - 1]
    setPlayer()
  }

  function playNext() {
    const index = playList.value.findIndex(item => item === currentSong.value)
    if (index === playList.value.length - 1) {
      player.stop()
      return
    }
    currentSong.value = playList.value[index + 1]
    setPlayer()
  }

  function togglePlay() {
    if (isPlaying.value)
      player.pause()
    else
      player.play()
  }

  function seek(time: number) {
    player.seek(Math.round(time))
    currentTime.value = Math.round(time)
  }

  return {
    currentSong,
    playList,
    isPlaying,
    currentTime,
    duration,
    playPrev,
    playNext,
    togglePlay,
    seek,
    setPlayer,
  }
},
{
  persist: {
    paths: ['playList'],
  },
},
)
