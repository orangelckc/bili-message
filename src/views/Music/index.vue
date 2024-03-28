<script setup lang="ts">
import Bar from './Bar.vue'
import List from './List.vue'
import Search from './Search.vue'

const { playByBvid } = useMusicStore()
const { playList, historyList } = storeToRefs(useMusicStore())

const tab = ref('playing')

function setSong(bvid: string) {
  playByBvid(bvid)
}

function handleChange(val: any) {
  tab.value = val
}
</script>

<template>
  <div class="relative h-100vh flex flex-col">
    <Search @change="setSong" />
    <div class="h30px center cursor-move text-sm text-gray-300" data-tauri-drag-region>
      —— 拖拽我移动位置吧 ——
    </div>
    <el-tabs v-model="tab" class="flex-1 px3" type="card" :stretch="true" @tab-change="handleChange">
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
