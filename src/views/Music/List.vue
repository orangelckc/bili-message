<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { showMenu } from 'tauri-plugin-context-menu'

import type { Item } from 'tauri-plugin-context-menu/dist/types'

const props = withDefaults(defineProps<{
  list: ISong[]
  type?: 'collection' | 'list'
}>(), {
  type: 'list',
})

const emits = defineEmits(['change'])

const showList = ref<ISong[]>([])
const selectedSong = ref<ISong>()

const { currentSong, isPlaying } = storeToRefs(useMusicStore())
const { playNext } = useMusicStore()
const { collectionOptions } = storeToRefs(useFavStore())
const { addToCollection } = useFavStore()
const subItems: Item[] = collectionOptions.value.map(option => ({
  label: option.name,
  event: () => {
    if (selectedSong.value)
      addToCollection(option.id, selectedSong.value)
  },
}))

watchEffect(() => {
  showList.value = props.list
})

async function playMusic(item: ISong) {
  emits('change', item.bvid)
}

function handleContextMenu(item: ISong) {
  selectedSong.value = item

  if (props.type === 'collection') {
    showMenu({
      items: [
        {
          label: '删除歌曲',
          event: () => {
            const index = showList.value.findIndex(i => i.bvid === item.bvid)
            showList.value.splice(index, 1)
          },
        },
        {
          label: '打开视频',
          event: () => {
            const url = `https://www.bilibili.com/video/${item.bvid}`
            open(url)
          },
        },
      ],
    })
    return
  }

  showMenu({
    items: [
      {
        label: '删除歌曲',
        event: () => {
          if (currentSong.value.bvid === item.bvid)
            playNext()

          const index = showList.value.findIndex(i => i.bvid === item.bvid)
          showList.value.splice(index, 1)
        },
      },
      {
        label: '打开视频',
        event: () => {
          const url = `https://www.bilibili.com/video/${item.bvid}`
          open(url)
        },
      },
      {
        label: '加入歌单',
        subitems: subItems,
      },
    ],
  })
}
</script>

<template>
  <div v-if="showList.length" class="flex flex-col gap3 overflow-auto p2">
    <el-card
      v-for="item in showList" :key="item.bvid" class="w-full hover:cursor-pointer"
      shadow="hover" :body-style="{
        padding: '0',
      }"
      @click="playMusic(item)"
      @contextmenu.prevent="handleContextMenu(item)"
    >
      <div class="relative w-full flex items-center">
        <el-avatar shape="square" :size="60" :src="`${item.pic}?@120w_120h_1c.avif`" />
        <div class="relative ml2 box-border flex flex-1 flex-col gap2 overflow-hidden">
          <span :class="currentSong.bvid === item.bvid ? 'line-scroll' : 'line-clamp-1'" class="w-full">
            {{ item.name }}
          </span>
          <span class="text-sm">
            {{ item.artist }}
          </span>
        </div>
        <div v-if="currentSong.bvid === item.bvid && isPlaying" class="center object-cover">
          <img src="@/static/playing.gif" alt="playing" class="w40px">
        </div>
      </div>
    </el-card>
  </div>

  <div v-else class="h-full center">
    <span class="text-2xl text-gray-400">暂无音乐</span>
  </div>
</template>

<style lang="scss" scoped>
.line-scroll{
  white-space: nowrap;
  animation: marquee 10s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
