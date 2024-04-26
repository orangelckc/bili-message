<script lang="ts" setup>
import { appWindow } from '@tauri-apps/api/window'

import { connected, startWebsocket, stopWebsocket } from '@/utils/room'
import { openWindow } from '@/utils/window'

const { room, isFix, isBroadcast, roomList } = storeToRefs(useAppStore())
const { deleteRoom } = useAppStore()

watchEffect(() => {
  appWindow.setAlwaysOnTop(isFix.value)
})

watch(connected, () => {
  isBroadcast.value = connected.value
})
</script>

<template>
  <div class="relative w-full center cursor-move pt3 text-sm text-gray-300 -mt-3" data-tauri-drag-region>
    —— 拖拽我移动位置吧 ——
    <div class="fixed right-2 top-2">
      <el-tooltip content="置顶" placement="bottom">
        <el-button round :type="isFix ? 'danger' : ''" @click=" isFix = !isFix">
          <span class="i-carbon-pin h5 w5" />
        </el-button>
      </el-tooltip>
    </div>
  </div>
  <div class="room">
    <el-select
      v-model.trim="room"
      class="flex-1"
      filterable
      allow-create
      :reserve-keyword="false"
      :disabled="connected"
      placeholder="直播间ID"
    >
      <el-option
        v-for="item in roomList"
        :key="item.roomid"
        :label="item.roomid"
        :value="item.roomid"
      >
        <div class="flex justify-between items-center w-full gap2">
          <span class="truncate">{{ item.uname }}</span>
          <span class="i-carbon-close-outline text-red h4 w4 cursor-pointer" @click.stop="deleteRoom(item.roomid)" />
        </div>
      </el-option>
    </el-select>

    <el-button plain :type="connected ? 'danger' : 'success'" @click="connected ? stopWebsocket() : startWebsocket()">
      {{ connected ? '断开监听' : '开启监听' }}
    </el-button>
    <el-tooltip content="点歌机" placement="bottom">
      <el-button round type="warning" @click="openWindow('music')">
        <span class="i-carbon-music h5 w5" />
      </el-button>
    </el-tooltip>
    <el-tooltip content="控制面板" placement="bottom">
      <el-button round type="primary" @click="openWindow('setting')">
        <span class="i-carbon-settings h5 w5" />
      </el-button>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.room {
  @apply flex items-center justify-between gap-1 rounded-md py-4 w-full;
}
</style>
