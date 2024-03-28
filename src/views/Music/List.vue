<script lang="ts" setup>
defineProps<{
  list: ISong[]
}>()

const emits = defineEmits(['change'])

function playMusic(item: ISong) {
  emits('change', item)
}
</script>

<template>
  <div v-if="list.length" class="flex flex-1 flex-col gap3 overflow-auto p4">
    <div v-for="item in list" :key="item.bvid">
      <el-card
        class="w-full hover:cursor-pointer" shadow="hover" :body-style="{
          padding: '0',
        }"
        @click="playMusic(item)"
      >
        <div class="relative w-full flex items-center">
          <el-avatar shape="square" :size="60" :src="item.pic" />
          <div class="ml2 flex flex-1 flex-col justify-between">
            <span class="line-clamp-2">
              {{ item.name }}
            </span>
            <span class="text-sm">
              {{ item.artist }}
            </span>
          </div>
        </div>
      </el-card>
    </div>
  </div>

  <div v-else class="h-full center">
    <span class="text-2xl text-gray-400">No Music</span>
  </div>
</template>
