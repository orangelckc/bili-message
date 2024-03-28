<script setup lang="ts">
import Bar from './Bar.vue'
import List from './List.vue'
import Search from './Search.vue'

const { setPlayer } = useMusicStore()
const { playList, currentSong } = storeToRefs(useMusicStore())

function setSong(item: ISong) {
  currentSong.value = item
  setPlayer()
}
</script>

<template>
  <div class="relative h-100vh flex flex-col">
    <Search />
    <div class="center cursor-move text-sm text-gray-300" data-tauri-drag-region>
      —— 拖拽我移动位置吧 ——
    </div>
    <List :list="playList" @change="setSong" />
    <Bar />
  </div>
</template>
