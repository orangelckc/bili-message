import md5 from 'md5'

import { getUserInfoApi } from './bilibili'

const mixinKeyEncTab = [
  46,
  47,
  18,
  2,
  53,
  8,
  23,
  32,
  15,
  50,
  10,
  31,
  58,
  3,
  45,
  35,
  27,
  43,
  5,
  49,
  33,
  9,
  42,
  19,
  29,
  28,
  14,
  39,
  12,
  38,
  41,
  13,
  37,
  48,
  7,
  16,
  24,
  55,
  40,
  61,
  26,
  17,
  0,
  1,
  60,
  51,
  30,
  4,
  22,
  25,
  54,
  21,
  56,
  59,
  6,
  63,
  57,
  62,
  11,
  36,
  20,
  34,
  44,
  52,
]

// 对 imgKey 和 subKey 进行字符顺序打乱编码
const getMixinKey = (orig: string) => mixinKeyEncTab.map(n => orig[n]).join('').slice(0, 32)

// 为请求参数进行 wbi 签名
function encWbi(params: Record<string, any>, key: string) {
  const mixin_key = getMixinKey(key)
  const curr_time = Math.round(Date.now() / 1000)
  const chr_filter = /[!'()*]/g

  Object.assign(params, { wts: curr_time }) // 添加 wts 字段
  // 按照 key 重排参数
  const query = Object
    .keys(params)
    .sort()
    .map((key: any) => {
      // 过滤 value 中的 "!'()*" 字符
      const value = params[key].toString().replace(chr_filter, '')
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&')

  const wbi_sign = md5(query + mixin_key) // 计算 w_rid

  return `${query}&w_rid=${wbi_sign}`
}

export async function getWbi(params: Record<string, any>) {
  // 1. 从 nav 接口 中获取 img_url、sub_url 两个字段的参数
  const { data } = await getUserInfoApi()
  const { wbi_img: { img_url, sub_url } } = data
  const img_key = img_url.slice(
    img_url.lastIndexOf('/') + 1,
    img_url.lastIndexOf('.'),
  )
  const sub_key = sub_url.slice(
    sub_url.lastIndexOf('/') + 1,
    sub_url.lastIndexOf('.'),
  )

  // 2. 加密参数
  const query = encWbi(params, img_key + sub_key)
  return query
}
