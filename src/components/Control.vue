<script lang="ts" setup>
import { WebviewWindow, appWindow } from '@tauri-apps/api/window'

import DanmuDrawer from './Drawer/Danmu-Drawer.vue'
import MusicDrawer from './Drawer/Music-Drawer.vue'

import { connected, startWebsocket, stopWebsocket } from '@/utils/room'

const { room, isFix, isBroadcast, roomList } = storeToRefs(useAppStore())
const { deleteRoom } = useAppStore()

const danmuDrawer = ref(false)
const musicDrawer = ref(false)

watchEffect(() => {
  appWindow.setAlwaysOnTop(isFix.value)
})

watch(connected, () => {
  isBroadcast.value = connected.value
})

async function openMusic() {
  musicDrawer.value = true
  const win = WebviewWindow.getByLabel('music')
  if (win) {
    win.show()
  }
  else {
    // eslint-disable-next-line no-new
    new WebviewWindow('music', {
      url: '/music',
      title: '点歌机',
      width: 360,
      height: 700,
      decorations: true,
      resizable: false,
    })
  }
}
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
    <el-tooltip content="广播" placement="bottom">
      <el-button round :type="isBroadcast ? 'success' : 'info'" @click="danmuDrawer = true">
        <span class="i-carbon-connection-signal h5 w5" />
      </el-button>
    </el-tooltip>
    <el-tooltip content="Music" placement="bottom">
      <el-button round type="warning" @click="openMusic">
        <span class="i-carbon-music h5 w5" />
      </el-button>
    </el-tooltip>
  </div>
  <DanmuDrawer v-model="danmuDrawer" />
  <MusicDrawer v-model="musicDrawer" />
</template>

<style lang="scss" scoped>
.room {
  @apply flex items-center justify-between gap-1 rounded-md py-4 w-full;
}
</style>
