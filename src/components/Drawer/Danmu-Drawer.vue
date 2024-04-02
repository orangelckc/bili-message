<script lang="ts" setup>
import { writeText } from '@tauri-apps/api/clipboard'

import SampleA from '@/components/Danmu/SampleA.vue'
import SampleB from '@/components/Danmu/SampleB.vue'
import { LOCAL_BROADCAST_URL } from '@/utils/constants'
import { socket } from '@/utils/socket'

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(['update:modelValue'])

const danmaku = ref<IMsg>({
  id: 'Sp96GuKWs9ZbUGa6JrK7H',
  type: 'message',
  uname: '用户昵称',
  message: '测试弹幕<img style="width: 20px; height: 20px;" src="http://i0.hdslb.com/bfs/live/816402551e6ce30d08b37a917f76dea8851fe529.png" />',
  time: '00:00:29',
  uface: 'https://i1.hdslb.com/bfs/face/1fedc000ed0efc646e0dec26c4e9f66334c0e0de.jpg@100w_100h_1c.avif',
})

const trigger = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})

const { isOn, voices, voice, pattern } = storeToRefs(useSpeechStore())
const { isBroadcast, customStyle, defaultSample } = storeToRefs(useAppStore())

const demos = [
  {
    name: '样例1',
    id: 'A',
    component: SampleA,
  },
  {
    name: '样例2',
    id: 'B',
    component: SampleB,
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

function useDemo(id: string) {
  defaultSample.value = id
  socket.send({
    type: 'sample',
    data: id,
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
    <div class="mt4 flex flex-col gap2">
      <div
        v-for="demo in demos" :key="demo.name"
        class="relative max-h100px center cursor-pointer rounded-lg p3 shadow hover:shadow-lg"
        @click="useDemo(demo.id) "
      >
        <span v-if="demo.id === defaultSample" class="i-carbon-checkmark-filled absolute z-9 h8 w8 text-orange -left-1 -top-1" />
        <component :is="demo.component" :custom-style="customStyle" :danmaku="danmaku" />
      </div>
    </div>
  </el-drawer>
</template>
