<script lang="ts" setup>
import { writeText } from '@tauri-apps/api/clipboard'

import { danmaku, demos } from '@/components/Danmu/config'
import { LOCAL_BROADCAST_URL } from '@/utils/constants'
import { useSocket } from '@/utils/socket'

const { customStyle, defaultSample } = storeToRefs(useAppStore())

function handleStyleChange() {
  useSocket({
    type: 'danmu',
    command: 'config',
    data: customStyle.value,
  })
}

async function handleCopy() {
  await writeText(`${LOCAL_BROADCAST_URL}/danmu`)
  ElMessage.success('复制成功, 链接可直接在OBS中使用')
}

function useDemo(id: string) {
  defaultSample.value = id
  useSocket({
    type: 'danmu',
    command: 'sample',
    data: id,
  })

  useSocket({
    type: 'danmu',
    command: 'config',
    data: customStyle.value,
  })
}
</script>

<template>
  <div class="w-full h-full flex gap2">
    <div class="flex flex-1 flex-col gap3 overflow-auto p3">
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
    <div class="flex flex-col max-w-2/5">
      <div class="mt2 center gap3">
        <span class="i-carbon-connection-signal h5 w5 bg-green" />
        <el-link type="primary" @click="handleCopy">
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
    </div>
  </div>
</template>
