/* eslint-disable jsdoc/check-param-names */
import { getWbi } from './wbi'

import { BASE_URL_PREFIX } from '@/utils/constants'
import request from '@/utils/request'

/**
 * 获取视频详情
 * @param bvid 视频bvid
 * @returns 视频详情
 */
export async function getVideoDetail(bvid: string) {
  const { currentUser } = useAppStore()
  if (!currentUser?.cookie || !currentUser?.csrf)
    throw new Error('请先登录')

  const { data } = await request({
    url: `${BASE_URL_PREFIX}/x/web-interface/view`,
    method: 'GET',
    params: { bvid },
    headers: {
      cookie: currentUser.cookie,
    },
  })

  const params = {
    bvid,
  }

  if (data?.aid)
    Object.assign(params, { aid: data.aid })

  if (data?.cid)
    Object.assign(params, { cid: data.cid })

  // 获取视频流详情
  const res = await getStreamDetail(params).catch((err) => {
    console.error('getVideoDetail', err)
  })

  const urls = [
    res?.data.durl[0].url,
  ]

  // TODO 音频有鉴权问题
  // const urls = [
  //   ...res?.data.dash.audio.map((audio: any) => audio.baseUrl),
  //   ...res?.data.dash.audio.map((audio: any) => audio.base_url),
  // ]

  return {
    name: data.title,
    urls,
    pic: data.pic,
    artist: data.owner.name,
    bvid: data.bvid,
  } as ISong
}

/**
 * 获取视频流详情
 * @param query 视频的请求参数（aid, bvid, cid）
 * @returns 视频详情
 * @description fnval: 16 为dash格式, 暂时使用mp4格式，pc端和dash模式需要鉴权防盗链，html5不需要，但是画质低
 */
function getStreamDetail(query: {
  aid?: number
  bvid: string
  cid?: number
}) {
  const { currentUser } = useAppStore()

  const params = {
    ...query,
    qn: 16, // 画质
    fnval: 16, // 格式 1/16/1040
    fnver: 0, // 格式版本
    platform: 'html5', // 平台
    gaia_source: 'pre-load',
    voice_balance: 1,
  }

  return request({
    url: `${BASE_URL_PREFIX}/x/player/wbi/playurl`,
    method: 'GET',
    params,
    headers: {
      cookie: currentUser?.cookie,
    },
  })
}

/**
 * 获取搜索结果
 * @param {string} keyword 关键词
 */
export async function searchKeyword(keyword: string) {
  const params = {
    keyword,
    search_type: 'video',
  }
  const { currentUser } = useAppStore()
  const wbi = await getWbi(params)

  return request({
    url: `${BASE_URL_PREFIX}/x/web-interface/wbi/search/type?${wbi}`,
    method: 'GET',
    headers: {
      cookie: currentUser?.cookie,
    },
  })
}

export async function getSongInfo(artist: string, song: string) {
  return request({
    url: `https://musicbrainz.org/ws/2/recording/?query=artist:"${artist}"%20AND%20recording:"${song}"&fmt=json`,
    method: 'GET',
    headers: {
      // cookie: currentUser?.cookie,
    },
  })
}
