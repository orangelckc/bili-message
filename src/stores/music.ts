import { Howl } from 'howler'

import { getVideoDetail } from '@/apis/music'

export const useMusicStore = defineStore('music', () => {
  // 正在播放列表
  const playList = ref<ISong[]>([])
  // 历史播放列表
  const historyList = ref<ISong[]>([])
  const currentSong = ref<ISong>({
    name: '',
    artist: '',
    pic: '',
    urls: [],
    bvid: '',
  })
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  let player: Howl

  const playUrls = computed(() => {
    return currentSong.value?.urls || []
  })

  let timerInterval = 0
  const stop = () => {
    isPlaying.value = false
    player.unload()
    clearInterval(timerInterval)
  }

  const playByBvid = async (bvid: string) => {
    if (player && player.state() !== 'unloaded')
      stop()
    const target = playList.value.find(item => item.bvid === bvid)
    currentSong.value = target ?? await getVideoDetail(bvid)
    setPlayer()
  }

  const addToHistoryList = () => {
    const index = historyList.value.findIndex(item => item.bvid === currentSong.value.bvid)
    if (index !== -1)
      historyList.value.splice(index, 1)

    historyList.value.unshift(currentSong.value)
  }

  const addToPlayList = () => {
    const index = playList.value.findIndex(item => item.bvid === currentSong.value.bvid)
    if (index !== -1)
      return

    playList.value.push(currentSong.value)
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
          Referer: 'https://www.bilibili.com',
        },
      },
    })

    player.on('load', () => {
      duration.value = player.duration()
      currentTime.value = 0
      player.play()
    })

    player.on('loaderror', async () => {
      ElMessage.error('音乐加载失败，加载替换链接')
      stop()
      currentSong.value = await getVideoDetail(currentSong.value.bvid)
      setPlayer()
    })

    player.on('play', () => {
      isPlaying.value = true
      // 添加历史播放记录
      addToHistoryList()
      // 添加到播放列表
      addToPlayList()
      timerInterval = setInterval(() => {
        currentTime.value = Math.round(player.seek())
      }, 1000) as unknown as number
    })

    player.on('pause', () => {
      isPlaying.value = false
    })

    player.on('end', () => {
      playNext()
    })

    player.on('playerror', () => {
      stop()
      playNext()
    })

    player.on('stop', () => {
      stop()
    })

    player.on('seek', () => {
      currentTime.value = player.seek()
    })
  }

  function playPrev() {
    const index = playList.value.findIndex(item => item.bvid === currentSong.value.bvid)
    if (index === 0)
      return

    const song = playList.value[index - 1]
    playByBvid(song.bvid)
  }

  function playNext() {
    const index = playList.value.findIndex(item => item.bvid === currentSong.value.bvid)
    if (index === playList.value.length - 1) {
      ElMessage.success('没有歌曲了')
      isPlaying.value = false
      clearInterval(timerInterval)
      return
    }
    const song = playList.value[index + 1]
    playByBvid(song.bvid)
  }

  function togglePlay() {
    if (isPlaying.value)
      player.pause()
    else
      player.state() === 'unloaded' ? playByBvid(currentSong.value.bvid) : player.play()
  }

  function seek(time: number) {
    player.seek(Math.round(time))
    currentTime.value = Math.round(time)
  }

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    playList,
    historyList,
    playPrev,
    playNext,
    togglePlay,
    seek,
    playByBvid,
  }
},
{
  persist: {
    paths: ['playList', 'historyList'],
  },
},
)
