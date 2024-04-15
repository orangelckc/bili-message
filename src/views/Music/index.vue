<script setup lang="ts">
import { listen } from '@tauri-apps/api/event'
import { showMenu } from 'tauri-plugin-context-menu'

import Bar from './Bar.vue'
import Collection from './Collection.vue'
import Search from './Search.vue'

import type { UnlistenFn } from '@tauri-apps/api/event'

import { sendMessageApi } from '@/apis/live'
import List from '@/components/Music-List.vue'
import { EDMType } from '@/utils/enums'

const { playByBvid, addToPlayList, playNext, getBvidByKeyword } = useMusicStore()
const { playList, historyList, freeLimit, blockList } = storeToRefs(useMusicStore())
const { currentUser } = storeToRefs(useAppStore())

const tab = ref<'playing' | 'fav' | 'history'>('playing')
// 点歌map
const demandMap = new Map<number, number>()

const setSong = useThrottleFn((bvid: string) => {
  playByBvid(bvid)
}, 1000)

function handleChange(val: any) {
  tab.value = val
}

const listeners: UnlistenFn[] = []
function stopListeners() {
  if (listeners.length) {
    listeners.forEach(listener => listener())
    listeners.length = 0
  }
}

async function handleDemand(payload: IDemandMusic) {
  const { demand, uname, uid, isFree } = payload

  const count = demandMap.get(uid) || 0

  if (!isFree) {
    // 防止重复点歌
    if (count && count >= freeLimit.value) {
      await sendMessageApi(`@${uname.slice(0, 7)} 今日点歌已达上限💔`, EDMType.普通弹幕)
      return
    }
  }

  let bvid
  if (demand.startsWith('BV') && demand.length === 12)
    bvid = demand
  else
    bvid = await getBvidByKeyword(demand)

  // 黑名单校验
  const block = blockList.value.find(item => item.bvid === bvid)
  if (block) {
    await sendMessageApi(`@${uname.slice(0, 8)} 换首歌吧😊`, EDMType.普通弹幕)
    return
  }

  await addToPlayList(bvid)
  demandMap.set(uid, count + 1)
  if (+uid === currentUser.value?.mid)
    return

  await sendMessageApi(`@${uname.slice(0, 11)} 点歌成功❤️`, EDMType.普通弹幕)
}

function handleContextMenu() {
  showMenu({
    items: [
      {
        label: '清空列表',
        event: () => {
          playList.value = []
        },
      },
    ],
  })
}

onMounted(async () => {
  stopListeners()

  const listener1 = await listen('danmaku-demand-music', async ({ payload }) => {
    handleDemand(payload as IDemandMusic)
  })
  const listener2 = await listen('danmaku-cut-music', () => {
    playNext()
  })
  const listener3 = await listen('change-free-limit', ({ payload }) => {
    freeLimit.value = Number(payload)
  })

  listeners.push(listener1, listener2, listener3)
})

onUnmounted(() => {
  stopListeners()
})
</script>

<template>
  <div class="relative h-100vh flex flex-col">
    <Search @change="setSong" />
    <el-tabs v-model="tab" type="card" :stretch="true" class="px3" @tab-change="handleChange">
      <el-tab-pane name="playing">
        <template #label>
          <div class="flex select-none items-center" @contextmenu.prevent="handleContextMenu">
            <span>正在播放</span>
            <el-badge v-show="playList.length" :value="playList.length" class="ml1" />
          </div>
        </template>
      </el-tab-pane>
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
