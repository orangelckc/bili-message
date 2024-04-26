<script lang="ts" setup>
import { emit } from '@tauri-apps/api/event'

import DanmuSetting from './Danmu.vue'
import SpeechSetting from './Speech.vue'

const activeTab = ref('/setting/danmu')
const menus = ref([
  {
    index: '/setting/danmu',
    title: '弹幕广播',
    component: shallowRef(DanmuSetting),
  },
  {
    index: '/setting/speech',
    title: '语音播报',
    component: shallowRef(SpeechSetting),
  },
  {
    index: '/setting/music',
    title: '点歌机',
    component: 'NavigatorTwo',
  },
  {
    index: '/setting/about',
    title: '关于',
    component: 'NavigatorTwo',
  },
])
</script>

<template>
  <div class="h-100vh w-full flex">
    <el-menu :default-active="activeTab" router>
      <el-menu-item v-for="menu in menus" :key="menu.index" :index="menu.index">
        <span>{{ menu.title }}</span>
      </el-menu-item>

      <div class="absolute bottom-2 center w-full">
        <el-link type="info" :underline="false" @click="emit('check-update')">
          检查更新
        </el-link>
      </div>
    </el-menu>
    <div class="flex-1 overflow-auto p2">
      <router-view />
    </div>
  </div>
</template>
