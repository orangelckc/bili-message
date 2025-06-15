import cheerio from 'cheerio'
import { toSimplified } from 'chinese-simple2traditional'
import { setupEnhance } from 'chinese-simple2traditional/enhance'
import { Howl, Howler } from 'howler'

import { getSongInfo, getVideoDetail, searchKeyword } from '@/apis/music'
import { useSocket } from '@/utils/socket'
import { convertTimeToMs } from '@/utils/tools'

setupEnhance() // 注入短语库

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
    duration: 0,
  })

  const isPlaying = ref(false)
  const isLoading = ref(false)
  const currentTime = ref(0)
  const currentVolume = ref(50)
  const freeLimit = ref(5)

  let player: Howl

  let timerInterval = 0
  const stop = () => {
    isPlaying.value = false
    Howler.unload()
    clearInterval(timerInterval)
  }

  // 匹配歌曲和歌手
  const matchSongArtist = async (songInfos: Array<any>, biliResult: Array<any>) => {
    // 匹配最佳时长的视频
    const recordingBase: Array<any> = []
    let BvIndex: number = 0
    let videoLenDiff: number = -1
    for (let i = 0; i < songInfos.length; i++) {
      recordingBase.push(
        {
          index: i,
          length: songInfos[i].length,
          title: toSimplified(songInfos[i].title),
          artist: songInfos[i]['artist-credit'] ? toSimplified(songInfos[i]['artist-credit'][0].name) : '',
        },
      )
    }
    for (let i = 0; i < biliResult.length; i++) {
      for (let k = 0; k < recordingBase.length; k++) {
        if (recordingBase[k].length) {
          const diff = Math.abs(convertTimeToMs(biliResult[i].duration) - recordingBase[k].length)
          if (
            (diff < videoLenDiff
            // 标题中需要包含点歌的歌名 和 歌手名 提高命中率
            && (cheerio.load(biliResult[i].title).text().toLowerCase().includes(recordingBase[k].artist.toLowerCase()) && cheerio.load(biliResult[i].title).text().toLowerCase().includes(recordingBase[k].title.toLowerCase()))
            )
            || videoLenDiff === -1) {
            BvIndex = i
            videoLenDiff = diff
            // console.log(`最后一个时间差值 ${videoLenDiff} recordingBase index ${k} BV Index ${i}`)
          }
        }
      }
    }
    ElMessage.info('通过歌曲信息查询接口匹配')
    return BvIndex
  }

  const getBvidByKeyword = async (query: string) => {
    query = query.trim()
    const { data } = await searchKeyword(query)

    const song_artist = query.split(/\s+/)
    let songName = ''
    let artist = ''
    if (song_artist.length > 1) {
      songName = query.substring(0, query.length - song_artist[song_artist.length - 1].length).trim()
      artist = song_artist[song_artist.length - 1]
    }
    else {
      songName = query
    }

    let songsInfos: Array<any> = []
    try {
      // 从第三方接口获取歌曲的基本信息（时长）
      let { recordings: songs } = await getSongInfo(artist, songName)
      if (songs.length > 0) {
        // 筛选名称相同或者名称长度相同的歌曲信息，尽可能过滤掉错误的信息
        songs = songs.filter((item: any) => toSimplified(item.title).toLowerCase() === songName)
      }
      if (songs.length === 0) {
        // 没有查询到结果，可能是错误地把最后一个词组作为歌手名称，不输出歌手参数再尝试查询一次
        const re = await getSongInfo('', query)
        if (re.recordings) {
          songs = re.recordings
          // 筛选名称相同或者名称长度相同的歌曲信息，尽可能过滤掉错误的信息
          songs = songs.filter((item: any) => toSimplified(item.title) === query)
        }
      }
      songsInfos = songs
    }
    catch (e) {
      ElMessage.error('查询歌曲信息失败')
    }

    // 视频索引
    let BvIndex: number = 0

    let target = data.result.filter((item: any) => item.type === 'video')
    if (songsInfos && songsInfos.length > 0) {
      // 匹配最佳时长的视频
      BvIndex = await matchSongArtist(songsInfos, target)
    }
    else {
      // 获取播放量最大且包含歌名的视频返回
      let tmp: any = []
      tmp = target.filter((item: any) => cheerio.load(item.title).text().toLowerCase().includes(query.toLowerCase()))// .sort((a: any, b: any) => b.play - a.play)
      if (tmp.length === 0)
        tmp = target.filter((item: any) => cheerio.load(item.title).text().toLowerCase().includes(songName.toLowerCase()))// .sort((a: any, b: any) => b.play - a.play)

      target = tmp
    }
    if (!target)
      ElMessage.error('未搜索到相关视频')

    return target[BvIndex].bvid
  }

  const addToPlayList = async (bvid: string) => {
    const target = playList.value.find(item => item.bvid === bvid)
    if (target)
      return target

    const song = await getVideoDetail(bvid)
    song.pic = song.pic.replace('http://', 'https://')
    playList.value.push(song)

    // 通知更新播放列表
    const idx = playList.value.findIndex(item => item.bvid === currentSong.value.bvid)
    useSocket({
      type: 'music',
      command: 'sync',
      data: playList.value.slice(idx + 1, idx + 11),
    })

    // 没在播放状态下，直接播放所选歌曲
    if (!player?.state() || player?.state() === 'unloaded') {
      currentSong.value = song
      togglePlay()
    }

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
      currentSong.value.duration = player.duration()
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
        useSocket({
          type: 'music',
          command: 'update',
          data: currentTime.value,
        })
      }, 1000) as unknown as number
      useSocket({
        type: 'music',
        command: 'play',
        data: currentSong.value,
      })
      useSocket({
        type: 'background',
        command: 'change-dynamic',
        data: currentSong.value.pic,
      })

      const idx = playList.value.findIndex(item => item.bvid === currentSong.value.bvid)
      // 返回10首歌曲
      const list = playList.value.slice(idx + 1, idx + 11)
      useSocket({
        type: 'music',
        command: 'sync',
        data: list,
      })
    })

    player.on('pause', () => {
      isPlaying.value = false
      useSocket({
        type: 'music',
        command: 'pause',
      })
    })

    player.once('end', () => {
      playNext()
      useSocket({
        type: 'music',
        command: 'end',
      })
    })

    player.once('playerror', () => {
      stop()
      playNext()
    })

    player.on('stop', () => {
      stop()
      useSocket({
        type: 'music',
        command: 'end',
      })
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
    getBvidByKeyword,
  }
}, {
  persist: {
    paths: ['playList', 'historyList', 'blockList', 'currentVolume', 'freeLimit'],
  },
})
