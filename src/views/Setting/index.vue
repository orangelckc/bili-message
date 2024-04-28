<script lang="ts" setup>
import { emit } from '@tauri-apps/api/event'

import Updater from '@/components/Updater.vue'

const updaterRef = ref()

const activeTab = ref('/setting/danmu')
const menus = ref([
  {
    index: '/setting/danmu',
    title: '弹幕广播',
  },
  {
    index: '/setting/speech',
    title: '语音播报',
  },
  {
    index: '/setting/music',
    title: '点歌机',
  },
  {
    index: '/setting/background',
    title: '动态背景',
  },
  {
    index: '/setting/about',
    title: '关于',
  },
])
</script>

<template>
  <div class="h-100vh w-full flex">
    <el-menu :default-active="activeTab" router>
      <el-menu-item v-for="menu in menus" :key="menu.index" :index="menu.index">
        <span>{{ menu.title }}</span>
      </el-menu-item>

      <div class="absolute bottom-6 center w-full">
        <el-link type="info" :underline="false" @click="emit('check-update', false)">
          检查更新
        </el-link>
      </div>
    </el-menu>
    <div class="flex-1 overflow-auto p2">
      <router-view />
    </div>
  </div>
  <Updater ref="updaterRef" :silent="false" />
</template>
