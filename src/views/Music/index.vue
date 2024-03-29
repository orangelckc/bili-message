<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'

import Bar from './Bar.vue'
import List from './List.vue'
import Search from './Search.vue'

import type { UnlistenFn } from '@tauri-apps/api/event'

const { playByBvid, addToPlayList } = useMusicStore()
const { playList, historyList } = storeToRefs(useMusicStore())

const tab = ref('playing')

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
    <div class="h30px center cursor-move text-sm text-gray-300" data-tauri-drag-region>
      —— 拖拽我移动位置吧 ——
    </div>
    <el-tabs v-model="tab" type="card" :stretch="true" class="flex-1 overflow-auto px3" @tab-change="handleChange">
      <el-tab-pane label="正在播放" name="playing">
        <List :list="playList" @change="setSong" />
      </el-tab-pane>
      <el-tab-pane label="我的歌单" name="list">
        我的歌单
      </el-tab-pane>
      <el-tab-pane label="播放历史" name="history">
        <List :list="historyList" @change="setSong" />
      </el-tab-pane>
    </el-tabs>
    <Bar />
  </div>
</template>
