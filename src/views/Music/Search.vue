<script lang="ts" setup>
import { searchKeyword } from '@/apis/music'

const emits = defineEmits(['add'])

const input = ref('')
const searchList = ref<ISong[]>([])
const loading = ref(false)

const searchMusic = useDebounceFn(async () => {
  const query = input.value.trim()
  if (!query)
    return

  // 搜索音乐
  loading.value = true
  const { data } = await searchKeyword(query)
  loading.value = false

  searchList.value = data.result.filter((item: any) => item.type === 'video')
    .map((item: any) => {
      return {
        urls: [],
        bvid: item.bvid,
        name: item.title,
        pic: `https:${item.pic}@300w_300h_1c.avif`,
        artist: item.author,
        duration: item.duration,
      }
    })

  if (!searchList.value.length)
    ElMessage.error('未搜索到相关视频')
}, 1000)

async function setQuery(query: string) {
  input.value = query
}

function addSongFromSearch(item: ISong) {
  emits('add', item.bvid)
  searchList.value = []
}
</script>

<template>
  <div class="sticky mt2 p-3">
    <el-select
      v-model.trim="input"
      filterable
      clearable
      remote
      reserve-keyword
      placeholder="搜索音乐(可直接使用BV号)"
      :loading="loading"
      class="w-full"
      :remote-method="setQuery"
      @keyup.enter="searchMusic()"
    >
      <template #prefix>
        <i class="i-carbon-search" />
      </template>
      <template #empty>
        <div class="h30px center text-sm text-gray">
          {{ loading ? '搜索中' : '未搜索到相关视频' }}
        </div>
      </template>

      <el-option v-if="searchList.length !== 0" value="" :style="{ display: 'none' }" />

      <div class="max-w-340px flex flex-col gap3 p2">
        <el-card
          v-for="item in searchList"
          :key="item.bvid"
          class="w-full hover:cursor-pointer"
          :body-style="{
            padding: '0',
          }"
        >
          <div class="relative w-full flex items-center pr2">
            <el-avatar shape="square" :size="60" :src="item.pic" />
            <div class="relative ml2 box-border flex flex-1 flex-col gap2 overflow-hidden">
              <span class="w-full truncate" v-html="item.name" />
              <span class="text-sm">
                {{ item.artist }}
              </span>
            </div>
            <el-button
              size="small"
              type="info"
              @click="addSongFromSearch(item)"
            >
              加入
            </el-button>
          </div>
        </el-card>
      </div>
    </el-select>
  </div>
</template>
