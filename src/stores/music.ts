import { Howl, Howler } from 'howler'

import { getVideoDetail } from '@/apis/music'

export const useMusicStore = defineStore('music', () => {
  // 正在播放列表
  const playList = ref<ISong[]>([])
  // 历史播放列表
  const historyList = ref<ISong[]>([])
  // 歌曲黑名单
  const blockList = ref<ISong[]>([])
  // 当前播放歌曲
  const currentSong = ref<ISong>({
    name: '',
    artist: '',
    pic: '',
    urls: [],
    bvid: '',
  })

  const isPlaying = ref(false)
  const isLoading = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const currentVolume = ref(50)
  const freeLimit = ref(5)

  let player: Howl

  let timerInterval = 0
  const stop = () => {
    isPlaying.value = false
    Howler.unload()
    clearInterval(timerInterval)
  }

  const addToPlayList = async (bvid: string) => {
    const target = playList.value.find(item => item.bvid === bvid)
    if (target)
      return target

    const song = await getVideoDetail(bvid)
    playList.value.push(song)
    return song
  }

  const playByBvid = async (bvid: string) => {
    currentTime.value = 0
    if (player && player.state() !== 'unloaded')
      stop()

    currentSong.value = await addToPlayList(bvid)

    setTimeout(() => {
      setPlayer()
    }, 500)
  }

  const addToHistoryList = () => {
    const index = historyList.value.findIndex(item => item.bvid === currentSong.value.bvid)
    if (index !== -1)
      historyList.value.splice(index, 1)

    historyList.value.unshift(currentSong.value)
  }

  function setPlayer() {
    isLoading.value = true
    player = new Howl({
      src: currentSong.value.urls,
      format: ['mp4'],
      html5: true,
      xhr: {
        method: 'GET',
        headers: {
          Referer: 'https://www.bilibili.com',
        },
        withCredentials: true,
      },
      volume: currentVolume.value / 100,
    })

    player.once('load', () => {
      duration.value = player.duration()
      isLoading.value = false
      player.play()
    })

    player.once('loaderror', async () => {
      stop()
      currentSong.value = await getVideoDetail(currentSong.value.bvid)
      setPlayer()
    })

    player.on('play', () => {
      isPlaying.value = true
      // 添加历史播放记录
      addToHistoryList()
      timerInterval = setInterval(() => {
        currentTime.value = Math.round(player.seek())
      }, 1000) as unknown as number
    })

    player.on('pause', () => {
      isPlaying.value = false
    })

    player.once('end', () => {
      playNext()
    })

    player.once('playerror', () => {
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
      stop()
      return
    }
    const song = playList.value[index + 1]
    playByBvid(song.bvid)
  }

  function togglePlay() {
    if (playList.value.length === 0) {
      ElMessage.info('播放列表为空，请先添加歌曲')
      return
    }

    if (!currentSong.value?.bvid)
      currentSong.value = playList.value[0]

    if (isPlaying.value) {
      player.pause()
    }
    else {
      if (isLoading.value)
        return ElMessage.info('音乐正在加载中，请稍后...')
      switch (player?.state()) {
        case 'loaded':
          player.play()
          break
        case 'loading':
          ElMessage.info('音乐正在加载中，请稍后...')
          break

        default:
          playByBvid(currentSong.value.bvid)
      }
    }
  }

  function seek(time: number) {
    player.seek(Math.round(time))
    currentTime.value = Math.round(time)
  }

  function setVolume(volume: number) {
    currentVolume.value = volume
    player.volume(volume / 100)
  }

  return {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    playList,
    historyList,
    blockList,
    currentVolume,
    freeLimit,
    playPrev,
    playNext,
    togglePlay,
    addToPlayList,
    seek,
    playByBvid,
    setVolume,
  }
},
{
  persist: {
    paths: ['playList', 'historyList', 'blockList', 'currentVolume', 'freeLimit'],
  },
},
)
