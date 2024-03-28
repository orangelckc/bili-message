<script lang="ts" setup>
import { showMenu } from 'tauri-plugin-context-menu'

const props = defineProps<{
  list: ISong[]
}>()

const emits = defineEmits(['change'])

const showList = ref<ISong[]>([])

const { currentSong, isPlaying } = storeToRefs(useMusicStore())

watchEffect(() => {
  showList.value = props.list
})

async function playMusic(item: ISong) {
  emits('change', item.bvid)
}

function handleContextMenu(item: ISong) {
  showMenu({
    items: [
      {
        label: '删除',
        disabled: false,
        event: () => {
          const index = showList.value.findIndex(i => i.bvid === item.bvid)
          showList.value.splice(index, 1)
        },
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
        <div class="ml2 flex flex-1 flex-col gap2">
          <span class="line-clamp-1">
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
    <span class="text-2xl text-gray-400">No Music</span>
  </div>
</template>
