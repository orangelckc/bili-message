// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { decode as b64dec, length as b64len } from '@protobufjs/base64'
import pako from 'pako'
import { Field, Type } from 'protobufjs'

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder('utf-8')
const UserInfo = new Type('UserInfo').add(new Field('face', 4, 'string'))
const DanmakuMessageV2 = new Type('DanmakuMessageV2').add(UserInfo).add(new Field('user', 20, 'UserInfo'))

function readInt(buffer: any, start: number, length: number) {
  let result = 0
  for (let i = length - 1; i >= 0; i--)
    result += 256 ** (length - i - 1) * buffer[start + i]

  return result
}

function writeInt(buffer: any,
  start: number,
  length: number,
  value: number) {
  let i = 0
  while (i < length) {
    buffer[start + i] = value / 256 ** (length - i - 1)
    i++
  }
}

function encode(string: string, op: number) {
  const data = textEncoder.encode(string)
  const packetLen = 16 + data.byteLength
  const header = [0, 0, 0, 0, 0, 16, 0, 1, 0, 0, 0, op, 0, 0, 0, 1]
  writeInt(header, 0, 4, packetLen)
  return new Uint8Array(header.concat(...data)).buffer
}

function decode(blob: any) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e: any) => {
      const buffer = new Uint8Array(e.target.result)
      const result: any = {}
      result.packetLen = readInt(buffer, 0, 4)
      result.headerLen = readInt(buffer, 4, 2)
      result.ver = readInt(buffer, 6, 2)
      result.op = readInt(buffer, 8, 4)
      result.seq = readInt(buffer, 12, 4)
      if (result.op === 5) {
        result.body = []
        let offset = 0
        while (offset < buffer.length) {
          const packetLen = readInt(buffer, offset, 4)
          const headerLen = 16 // readInt(buffer,offset + 4,4)
          const data = buffer.slice(offset + headerLen, offset + packetLen)

          let body
          try {
            body = textDecoder.decode(pako.inflate(data))
          }
          catch (e) {
            // console.log("ws解码失败", e);
          }
          if (body) {
            // eslint-disable-next-line no-control-regex
            const group = body.split(/[\x00-\x1F]+/)

            group.forEach((item) => {
              try {
                if (item && item.includes('{'))
                  result.body.push(JSON.parse(item))
              }
              catch (e) {
                // 忽略非 JSON 字符串，通常情况下为分隔符
              }
            })
          }

          offset += packetLen
        }
      }
      else if (result.op === 3) {
        result.body = {
          count: readInt(buffer, 16, 4),
        }
      }
      resolve(result)
    }
    reader.readAsArrayBuffer(blob)
  })
}

// hex颜色转为指定透明度颜色
function colorHexToRgba(color: string, opacity: number) {
  if (color) {
    color = color.toLowerCase()

    const colorList = []

    for (let i = 1; i < 7; i += 2)
      colorList.push(Number.parseInt(`0x${color.slice(i, i + 2)}`))

    return `rgba(${colorList.join()}, ${opacity})`
  }
}

function decodeB64(str: string) {
  const length = b64len(str)
  const buffer = new Uint8Array(length)
  b64dec(str, buffer, 0)
  return buffer
}

// 转换弹幕v2(目前只有头像数据)
// 因为不知道dm_v2的结构，理论上是包含弹幕的所有信息
export function decodeDmV2(str: string) {
  const buffer = decodeB64(str)
  const message = DanmakuMessageV2.decode(buffer)
  return DanmakuMessageV2.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
  })['user']['face']
}

export { encode, decode, colorHexToRgba }
