<script setup>
// 这个组件最好在外部包裹div来设定尺寸位置和字体信息
const props = defineProps({ html: String })
const text1Ele = ref(null)
const sizerEle = ref(null)
const staticTextEle = ref(null)
const needScroll = ref(false)
const resizeObserver = new ResizeObserver(() => {
  updateIfNeedScroll()
})
onMounted(() => {
  updateIfNeedScroll()
  if (sizerEle.value)
    resizeObserver.observe(sizerEle.value)
})
onUpdated(() => {
  updateIfNeedScroll()
})

onUnmounted(() => {
  resizeObserver.disconnect()
})
function updateIfNeedScroll() {
  if (text1Ele.value != null && sizerEle.value != null && staticTextEle.value != null) {
    const widthValue = Math.max(text1Ele.value.offsetWidth, staticTextEle.value.offsetWidth)
    needScroll.value = widthValue > sizerEle.value.offsetWidth
    if (needScroll.value)
      sizerEle.value.style.setProperty('--marquee-duration', `${widthValue / 80}s`)
  }
  else {
    needScroll.value = false
  }
}
</script>

<template>
  <div ref="sizerEle" class="marquee-sizer">
    <div v-show="needScroll" class="marquee-outer">
      <div class="marquee-container">
        <div ref="text1Ele" class="marquee-text1 marquee-content" v-html="props.html" />
        <div class="marquee-text2 marquee-content" v-html="props.html" />
      </div>
    </div>
    <div v-show="!needScroll" ref="staticTextEle" class="marquee-static-text" v-html="props.html" />
  </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
}

.marquee-sizer {
    --marquee-duration: 5s;

    overflow: hidden;
    white-space: nowrap;
    height: 100%;
    width: 100%;
}

.marquee-outer {
    display: inline-block;
}

.marquee-container {
    display: inline-block;
    height: 100%;
    position: relative;
    animation: marquee var(--marquee-duration) linear infinite;
}

.marquee-content {
    display: inline-block;
}

.marquee-text2 {
    margin-left: 2.5em;
    margin-right: 2.5em;
}

.marquee-static-text {
    display: inline-block;
}

@keyframes marquee {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(-50%);
    }
}
</style>
