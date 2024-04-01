<script lang="ts" setup>
import { writeText } from '@tauri-apps/api/clipboard'

import { LOCAL_BROADCAST_URL } from '@/utils/constants'
import { socket } from '@/utils/socket'

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(['update:modelValue'])

const trigger = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

const { isOn, voices, voice, pattern } = storeToRefs(useSpeechStore())
const { isBroadcast, customStyle } = storeToRefs(useAppStore())

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

function handleStyleChange() {
  socket.send({
    type: 'config',
    data: customStyle.value,
  })
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
</script>

<template>
  <el-drawer v-model="trigger" title="广播弹幕配置" :with-header="true" direction="ltr" :modal="true" size="300" @close="trigger = false">
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
