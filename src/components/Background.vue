<script setup lang="ts">
import { BackgroundRender, EplorRenderer } from '@applemusic-like-lyrics/core'

import type { AbstractBaseRenderer, BaseRenderer } from '@applemusic-like-lyrics/core'

/**
 * 背景渲染组件的属性
 */
interface BackgroundRenderProps {
  /**
   * 设置背景专辑图片
   */
  albumImageUrl?: string
  /**
   * 设置当前背景动画帧率，如果为 `undefined` 则默认为 `30`
   */
  fps?: number
  /**
   * 设置当前播放状态，如果为 `undefined` 则默认为 `true`
   */
  playing?: boolean
  /**
   * 设置当前动画流动速度，如果为 `undefined` 则默认为 `2`
   */
  flowSpeed?: number
  /**
   * 设置背景是否根据“是否有歌词”这个特征调整自身效果，例如有歌词时会变得更加活跃
   *
   * 部分渲染器会根据这个特征调整自身效果
   *
   * 如果不确定是否需要赋值或无法知晓是否包含歌词，请传入 true 或不做任何处理（默认值为 true）
   */
  hasLyric?: boolean
  /**
   * 设置低频的音量大小，范围在 80hz-120hz 之间为宜，取值范围在 [0.0-1.0] 之间
   *
   * 部分渲染器会根据音量大小调整背景效果（例如根据鼓点跳动）
   *
   * 如果无法获取到类似的数据，请传入 undefined 或 1.0 作为默认值，或不做任何处理（默认值即 1.0）
   */
  lowFreqVolume?: number
  /**
   * 设置当前渲染缩放比例，如果为 `undefined` 则默认为 `0.5`
   */
  renderScale?: number
  /**
   * 设置渲染器，如果为 `undefined` 则默认为 `PixiRenderer`
   * 默认渲染器有可能会随着版本更新而更换
   */
  renderer?: { new(canvas: HTMLCanvasElement): BaseRenderer }
}

/**
 * 背景渲染组件的引用
 */
interface BackgroundRenderRef {
  /**
   * 背景渲染实例引用
   */
  bgRender?: Ref<AbstractBaseRenderer | undefined>
  /**
   * 将背景渲染实例的元素包裹起来的 DIV 元素实例
   */
  wrapperEl: Ref<HTMLDivElement | undefined>
}

const props = defineProps<BackgroundRenderProps>()
const wrapperRef = ref<HTMLDivElement>()
const bgRenderRef = ref<AbstractBaseRenderer>()

onMounted(() => {
  if (wrapperRef.value) {
    bgRenderRef.value = BackgroundRender.new(props.renderer ?? EplorRenderer)
    const el = bgRenderRef.value.getElement()
    el.style.width = '100%'
    el.style.height = '100%'
    wrapperRef.value.appendChild(el)
  }
})

onUnmounted(() => {
  if (bgRenderRef.value)
    bgRenderRef.value.dispose()
})

watchEffect(() => {
  if (props.albumImageUrl)
    bgRenderRef.value?.setAlbum(props.albumImageUrl)
})

watchEffect(() => {
  if (props.fps)
    bgRenderRef.value?.setFPS(props.fps)
})

watchEffect(() => {
  if (props.playing)
    bgRenderRef.value?.pause()
  else
    bgRenderRef.value?.resume()
})

watchEffect(() => {
  if (props.flowSpeed)
    bgRenderRef.value?.setFlowSpeed(props.flowSpeed)
})

watchEffect(() => {
  if (props.renderScale)
    bgRenderRef.value?.setRenderScale(props.renderScale)
})

watchEffect(() => {
  if (props.lowFreqVolume)
    bgRenderRef.value?.setLowFreqVolume(props.lowFreqVolume)
})

watchEffect(() => {
  if (props.hasLyric !== undefined)
    bgRenderRef.value?.setHasLyric(props.hasLyric ?? true)
})

defineExpose<BackgroundRenderRef>({
  bgRender: bgRenderRef,
  wrapperEl: wrapperRef,
})
</script>

<template>
  <div ref="wrapperRef" />
</template>
