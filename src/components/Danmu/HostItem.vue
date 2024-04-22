<script lang="ts" setup>
import Medal from '@/components/Medal.vue'
import { ROOM_URL_PREFIX } from '@/utils/constants'

const props = defineProps<{
  itemData: IMsg
}>()

const { replyTo, currentUser } = storeToRefs(useAppStore())

function handleAt() {
  if (currentUser.value?.mid === props.itemData.uid)
    return

  replyTo.value = {
    uid: props.itemData?.uid || 0,
    uname: props.itemData.uname,
  }
}
</script>

<template>
  <div class="p1 text-sm">
    <div v-if="itemData.type === 'emoji'" class="flex items-center">
      <div v-if="itemData.medal">
        <el-tooltip
          v-if="itemData.medal && itemData.medal.is_lighted"
          placement="top"
          :width="80"
          trigger="hover"
          effect="light"
        >
          <template #content>
            <a :href="`${ROOM_URL_PREFIX}/${itemData.medal?.room_id}`" target="_blank" class="text-blue-400">去直播间
            </a>
          </template>
          <Medal :medal="itemData.medal" class="w24rpx" />
        </el-tooltip>
      </div>
      <span class="text-base text-amber">
        <el-tooltip
          placement="top"
          :width="80"
          trigger="hover"
          content="@TA"
        >
          <span class="cursor-pointer" @click="handleAt">{{ itemData.uname }}</span>
        </el-tooltip>
      </span>
      <div v-if="itemData.type === 'emoji'">
        <img :src="itemData.message" alt="" class="ml1 min-h-6 w14">
      </div>
    </div>
    <div
      v-else-if="itemData.type.startsWith('message')" class="flex flex-col gap1"
    >
      <div class="inline-flex items-center gap1">
        <el-avatar v-if="itemData.uface" :src="itemData.uface" size="small" shape="circle" />
        <el-tooltip
          v-if="itemData.medal && itemData.medal.is_lighted"
          placement="top"
          :width="80"
          trigger="hover"
          effect="light"
        >
          <template #content>
            <a :href="`${ROOM_URL_PREFIX}/${itemData.medal?.room_id}`" target="_blank" class="text-blue-400">去直播间
            </a>
          </template>
          <Medal :medal="itemData.medal" class="w24rpx" />
        </el-tooltip>
        <div class="text-base text-amber">
          <el-tooltip
            placement="top"
            :width="80"
            trigger="hover"
            content="@TA"
          >
            <span class="cursor-pointer" @click="handleAt">{{ itemData.uname }}</span>
          </el-tooltip>
        </div>
        <div class="ml2 text-xs text-gray/200">
          {{ itemData.time }}
        </div>
      </div>
      <div
        class="ml2 text-base text-blue-500"
        :class="{
          'line-through text-gray/80': itemData.type === 'message-banned',
        }"
      >
        <div v-if="itemData.isSafe" class="inline-flex flex-wrap items-center" v-html="itemData.message" />
        <div v-else v-text="itemData.message" />
      </div>
    </div>
    <span v-else-if="itemData.type === 'gift'" class="text-red">{{ itemData.message }}</span>
    <span v-else-if="itemData.type === 'like' || itemData.type === 'follow'" class="text-orange">{{ itemData.message }}</span>
    <span v-else class="text-gray-400">{{ itemData.message }}</span>
  </div>
</template>
