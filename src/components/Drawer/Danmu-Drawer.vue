<script lang="ts" setup>
import { writeText } from '@tauri-apps/api/clipboard'

import { danmaku, demos } from '@/components/Danmu/config'
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
const { isBroadcast, customStyle, defaultSample } = storeToRefs(useAppStore())

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
  socket.send({
    type: 'config',
    data: customStyle.value,
  })
}
</script>

<template>
  <el-drawer v-model="trigger" title="广播弹幕配置" :with-header="true" direction="ltr" :modal="true" size="300" @close="trigger = false">
    <div class="h-full flex flex-col">
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
        <el-input v-model="customStyle.avatarSize" placeholder="头像大小" @change="handleStyleChange">
          <template #prepend>
            头像大小
          </template>
        </el-input>
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
      <div class="mt4 flex flex-1 flex-col gap3 overflow-auto p4">
        <div
          v-for="demo in demos" :key="demo.name"
          class="relative center cursor-pointer rounded-lg p3 shadow hover:shadow-lg"
          @click="useDemo(demo.id) "
        >
          <span v-if="demo.id === defaultSample" class="i-carbon-checkmark-filled absolute z-9 h8 w8 text-orange -right-1 -top-1" />
          <component
            :is="demo.component"
            :custom-style="{
              ...demo.baseStyle,
              ...customStyle,
            }"
            :danmaku="danmaku"
          />
        </div>
      </div>
    </div>
  </el-drawer>
</template>
