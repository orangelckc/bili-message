<script lang="ts" setup>
import { nanoid } from 'nanoid'
import { showMenu } from 'tauri-plugin-context-menu'

import List from '@/components/Music-List.vue'

const emits = defineEmits(['change'])

const { playList } = storeToRefs(useMusicStore())
const { collections } = storeToRefs(useFavStore())
const selected = ref('')
const isEdit = ref(false)

function addCollection() {
  collections.value.push({
    name: '新建歌单',
    songs: [],
    id: nanoid(8),
  })
  selected.value = collections.value[collections.value.length - 1].id
}

function handleChange(bvid: string) {
  emits('change', bvid)
}

function handleContextMenu(collection: ICollection) {
  showMenu({
    items: [
      {
        label: '重命名',
        event: () => {
          selected.value = collection.id
          isEdit.value = true
        },
      },
      {
        label: '删除歌单',
        event: () => {
          collections.value = collections.value.filter(item => item.id !== collection.id)
        },
      },
    ],
  })
}

function handleToList(collection: ICollection) {
  playList.value.push(...collection.songs)
}
</script>

<template>
  <div class="h-full flex flex-col px2">
    <div class="mb2 flex justify-between">
      <span>我的歌单</span>
      <el-button type="primary" size="small" @click="addCollection">
        新建
      </el-button>
    </div>
    <el-collapse v-if="collections.length" v-model="selected" accordion @change="isEdit = false">
      <el-collapse-item
        v-for="collection in collections"
        :key="collection.id"
        :name="collection.id"
      >
        <template #title>
          <div class="w-full" @contextmenu.prevent="handleContextMenu(collection)">
            <div v-if="isEdit && selected === collection.id">
              <el-input v-model="collection.name" size="small" placeholder="歌单名称" @click.stop @keydown.enter.stop="isEdit = false" @blur.stop="isEdit = false" />
            </div>
            <div v-else class="flex items-center gap3">
              <span>{{ collection.name }}</span>
              <div class="cursor-pointer border border-gray rounded border-solid px-1 text-xs" @click.stop="handleToList(collection)">
                加入播放列表
              </div>
            </div>
          </div>
        </template>
        <List :list="collection.songs" type="collection" @change="handleChange" />
      </el-collapse-item>
    </el-collapse>
    <div v-else class="center flex-1">
      <span class="text-2xl text-gray-400">暂无歌单</span>
    </div>
  </div>
</template>
