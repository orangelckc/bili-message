<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'

import Bar from './Bar.vue'
import List from './List.vue'
import Search from './Search.vue'

import type { UnlistenFn } from '@tauri-apps/api/event'

const { playByBvid, addToPlayList } = useMusicStore()
const { playList, historyList, favList } = storeToRefs(useMusicStore())

const tab = ref('playing')

const showList = computed(() => {
  switch (tab.value) {
    case 'playing':
      return playList.value
    case 'favorite':
      return favList.value
    case 'history':
      return historyList.value
    default:
      return []
  }
})

const setSong = useThrottleFn((bvid: string) => {
  playByBvid(bvid)
}, 1000)

function handleChange(val: any) {
  tab.value = val
}

let listener: UnlistenFn
onMounted(async () => {
  if (listener)
    listener()

  listener = await listen('danmaku-demand-music', ({ payload }) => {
    addToPlayList(payload as string)
  })
})
</script>

<template>
  <div class="relative h-100vh flex flex-col">
    <Search @change="setSong" />
    <el-tabs v-model="tab" type="card" :stretch="true" class="px3" @tab-change="handleChange">
      <el-tab-pane label="正在播放" name="playing" />
      <el-tab-pane label="我的歌单" name="favorite" />
      <el-tab-pane label="播放历史" name="history" />
    </el-tabs>
    <div class="flex-1 overflow-auto px1">
      <List :list="showList" @change="setSong" />
    </div>
    <Bar />
  </div>
</template>
