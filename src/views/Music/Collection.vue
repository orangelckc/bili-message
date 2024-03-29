<script lang="ts" setup>
import { nanoid } from 'nanoid'

import List from './List.vue'

const emits = defineEmits(['change'])

const { collections } = storeToRefs(useFavStore())
const selected = ref('')

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
</script>

<template>
  <div class="h-full flex flex-col px2">
    <div class="mb2 flex justify-between">
      <span>我的歌单</span>
      <el-button type="primary" size="small" @click="addCollection">
        新建
      </el-button>
    </div>
    <el-collapse v-if="collections.length" v-model="selected" accordion>
      <el-collapse-item
        v-for="collection in collections"
        :key="collection.id"
        :title="collection.name"
        :name="collection.id"
      >
        <List :list="collection.songs" :show-context-menu="false" @change="handleChange" />
      </el-collapse-item>
    </el-collapse>
    <div v-else class="center flex-1">
      <span class="text-2xl text-gray-400">暂无歌单</span>
    </div>
  </div>
</template>
