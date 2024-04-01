<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'

import Bar from './Bar.vue'
import Collection from './Collection.vue'
import List from './List.vue'
import Search from './Search.vue'

import type { UnlistenFn } from '@tauri-apps/api/event'

import { sendMessageApi } from '@/apis/live'
import { EDMType } from '@/utils/enums'

const { playByBvid, addToPlayList, playNext } = useMusicStore()
const { playList, historyList } = storeToRefs(useMusicStore())
const { currentUser } = storeToRefs(useAppStore())

const tab = ref<'playing' | 'fav' | 'history'>('playing')

const setSong = useThrottleFn((bvid: string) => {
  playByBvid(bvid)
}, 1000)

function handleChange(val: any) {
  tab.value = val
}

const listeners: UnlistenFn[] = []
onMounted(async () => {
  if (listeners.length) {
    listeners.forEach(listener => listener())
    listeners.length = 0
  }

  const listener1 = await listen('danmaku-demand-music', async ({ payload }) => {
    const { bvid, uname, uid } = payload as { bvid: string; uname: string; uid: number }
    await addToPlayList(bvid)
    if (+uid === currentUser.value?.mid)
      return
    await sendMessageApi(`@${uname} 点歌成功❤️`, EDMType.普通弹幕)
  })
  const listener2 = await listen('danmaku-cut-music', () => {
    playNext()
  })

  listeners.push(listener1, listener2)
})
</script>

<template>
  <div class="relative h-100vh flex flex-col">
    <Search @change="setSong" />
    <el-tabs v-model="tab" type="card" :stretch="true" class="px3" @tab-change="handleChange">
      <el-tab-pane label="正在播放" name="playing" />
      <el-tab-pane label="我的歌单" name="fav" />
      <el-tab-pane label="播放历史" name="history" />
    </el-tabs>
    <div class="flex-1 overflow-auto px1">
      <List v-if="tab === 'playing'" :list="playList" @change="setSong" />
      <List v-if="tab === 'history'" :list="historyList" @change="setSong" />
      <Collection v-if="tab === 'fav'" @change="setSong" />
    </div>
    <Bar />
  </div>
</template>
