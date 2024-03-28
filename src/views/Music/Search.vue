<script lang="ts" setup>
import { getVideoDetail } from '@/apis/music'

const { currentSong } = storeToRefs(useMusicStore())
const { setPlayer } = useMusicStore()
const input = ref('')

async function searchMusic() {
  if (!input.value)
    return

  currentSong.value = await getVideoDetail(input.value)
  setPlayer()
}
</script>

<template>
  <div class="sticky mt2 p-3">
    <el-input
      v-model.trim="input"
      placeholder="搜索音乐"
      size="large"
      @keydown.enter="searchMusic"
    >
      <template #prefix>
        <i class="i-carbon-search text-lg" />
      </template>
    </el-input>
  </div>
</template>
