<script lang="ts" setup>
import { writeText } from '@tauri-apps/api/clipboard'
import { WebviewWindow, appWindow } from '@tauri-apps/api/window'

import { LOCAL_BROADCAST_URL } from '@/utils/constants'
import { connected, startWebsocket, stopWebsocket } from '@/utils/room'
import { socket } from '@/utils/socket'

const { room, isFix, isBroadcast, customStyle } = storeToRefs(useAppStore())

const drawer = ref(false)
const { isOn, voices, voice, pattern } = storeToRefs(useSpeechStore())

const demos = [
  {
    name: '自定义',
    style: customStyle.value,
  },
  {
    name: '样例1',
    style: {
      unameFontSize: 16,
      unameColor: '#fff',
      msgFontSize: 16,
      msgColor: '#fff',
      msgBackground: 'rgba(0,0,0,.5)',
      msgGap: 10,
    },
  },
  {
    name: '样例2',
    style: {
      unameFontSize: 14,
      unameColor: '#000',
      msgFontSize: 18,
      msgColor: '#333',
      msgBackground: 'rgba(255,255,255,.8)',
      msgGap: 20,
    },
  },
  {
    name: '样例3',
    style: {
      unameFontSize: 20,
      unameColor: '#ff0000',
      msgFontSize: 14,
      msgColor: '#000000',
      msgBackground: 'rgba(255,255,0,.7)',
      msgGap: 15,
    },
  },
  {
    name: '样例4',
    style: {
      unameFontSize: 12,
      unameColor: '#00ff00',
      msgFontSize: 20,
      msgColor: '#0000ff',
      msgBackground: 'rgba(255,0,255,.6)',
      msgGap: 12,
    },
  },
  {
    name: '样例5',
    style: {
      unameFontSize: 18,
      unameColor: '#ffa500',
      msgFontSize: 16,
      msgColor: '#800080',
      msgBackground: 'rgba(128,128,128,.5)',
      msgGap: 8,
    },
  },
]

function handleFix() {
  isFix.value = !isFix.value
  appWindow.setAlwaysOnTop(isFix.value)
}

async function handleCopy() {
  await writeText(LOCAL_BROADCAST_URL)
  ElMessage.success('复制成功, 链接可直接在OBS中使用')
}

function useDemo(demo: ICustomStyle) {
  socket.send({
    type: 'config',
    data: demo,
  })
}

watch(connected, () => {
  isBroadcast.value = connected.value
})

function handleStyleChange() {
  socket.send({
    type: 'config',
    data: customStyle.value,
  })
}

async function openMusic() {
  const win = WebviewWindow.getByLabel('music')
  if (win) {
    win.show()
  }
  else {
    // eslint-disable-next-line no-new
    new WebviewWindow('music', {
      url: '/music',
      title: '点歌机',
      width: 360,
      height: 700,
      decorations: true,
      resizable: false,
    })
  }
}
</script>

<template>
  <div class="relative w-full center cursor-move pt3 text-sm text-gray-300 -mt-3" data-tauri-drag-region>
    —— 拖拽我移动位置吧 ——
    <div class="fixed right-2 top-2">
      <el-tooltip content="置顶" placement="bottom">
        <el-button round :type="isFix ? 'danger' : ''" @click="handleFix">
          <span class="i-carbon-pin h5 w5" />
        </el-button>
      </el-tooltip>
    </div>
  </div>
  <div class="room">
    <el-input v-model="room" placeholder="直播间ID" :disabled="connected" class="flex-1" />
    <el-button plain :type="connected ? 'danger' : 'success'" @click="connected ? stopWebsocket() : startWebsocket()">
      {{ connected ? '断开监听' : '开启监听' }}
    </el-button>
    <el-tooltip content="广播" placement="bottom">
      <el-button round :type="isBroadcast ? 'success' : 'info'" @click="drawer = true">
        <span class="i-carbon-connection-signal h5 w5" />
      </el-button>
    </el-tooltip>
    <el-tooltip content="Music" placement="bottom">
      <el-button round type="warning" @click="openMusic">
        <span class="i-carbon-music h5 w5" />
      </el-button>
    </el-tooltip>
  </div>
  <el-drawer v-model="drawer" title="广播弹幕配置" :with-header="true" direction="ltr" :modal="true" size="300">
    <el-input v-model="pattern" placeholder="弹幕匹配规则">
      <template #prepend>
        语音模版
      </template>
    </el-input>
    <div class="mt2 center gap2">
      <el-select v-model="voice" class="flex-1" value-key="name">
        <el-option v-for="item in voices" :key="item.lang" :label="item.name" :value="item" />
      </el-select>
      <el-tooltip :content="isOn ? '关闭弹幕语音' : '开启弹幕语音'" placement="bottom">
        <el-switch v-model="isOn" active-color="#13ce66" />
      </el-tooltip>
    </div>
    <div class="mt2 center gap3">
      <!-- <el-switch v-model="isBroadcast" active-color="#13ce66" @change="toggleBroadcast" /> -->
      <span class="i-carbon-connection-signal h5 w5" :class="isBroadcast ? 'bg-green' : 'bg-gray'" />
      <el-link type="primary" :disabled="!isBroadcast" @click="handleCopy">
        复制广播URL
      </el-link>
    </div>
    <div class="mt4 flex flex-col gap2">
      <el-input v-model="customStyle.unameFontSize" placeholder="昵称字号" @change="handleStyleChange">
        <template #prepend>
          昵称字号
        </template>
      </el-input>
      <el-input v-model="customStyle.unameColor" placeholder="昵称颜色" @change="handleStyleChange">
        <template #prepend>
          昵称颜色
        </template>
      </el-input>
      <el-input v-model="customStyle.msgFontSize" placeholder="弹幕字号" @change="handleStyleChange">
        <template #prepend>
          弹幕字号
        </template>
      </el-input>
      <el-input v-model="customStyle.msgColor" placeholder="弹幕颜色" @change="handleStyleChange">
        <template #prepend>
          弹幕颜色
        </template>
      </el-input>
      <el-input v-model="customStyle.msgBackground" placeholder="弹幕背景" @change="handleStyleChange">
        <template #prepend>
          弹幕背景
        </template>
      </el-input>
      <el-input v-model="customStyle.msgGap" placeholder="弹幕间距" @change="handleStyleChange">
        <template #prepend>
          弹幕间距
        </template>
      </el-input>
    </div>
    <div class="mt4 flex flex-wrap gap2">
      <el-card v-for="demo in demos" :key="demo.name" class="h10 w30 center" @click="useDemo(demo.style)">
        {{ demo.name }}
      </el-card>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.room {
  @apply flex items-center justify-between gap-1 rounded-md py-4;
}
</style>
