<script lang="ts" setup>
import { appWindow } from '@tauri-apps/api/window'

import { sendMessageApi } from '@/apis/live'
import Account from '@/components/Account.vue'
import Danmu from '@/components/Danmu.vue'
import useWebsocket from '@/hooks/useWebsocket'
import { EDMType } from '@/utils/enums'
import { connected, startWebsocket, stopWebsocket } from '@/utils/room'

const { userList, room, isFix, signRoom } = storeToRefs(useAppStore())
const { refreshCurrentUser } = useAppStore()

function handleFix() {
  isFix.value = !isFix.value
  appWindow.setAlwaysOnTop(isFix.value)
}

async function handleSign() {
  const res = await sendMessageApi('打卡', EDMType.打卡专用)

  if (!res)
    return

  ElMessage.success('打卡成功')
}

onMounted(() => {
  refreshCurrentUser()
  useWebsocket().trigger()
})
</script>

<template>
  <div class="container">
    <div class="left">
      <div class="accounts">
        <Account v-for="user in userList" :key="user.mid" :user="user" />
      </div>
      <div class="sign">
        <el-input v-model.trim="signRoom" placeholder="房间号">
          <template #append>
            <el-button @click="handleSign">
              打卡
            </el-button>
          </template>
        </el-input>
      </div>
      <div class="tip">
        <span>
          <a href="https://space.bilibili.com/405579368" target="_blank" class="text-blue-400">@半糖人类</a> 出品
        </span>
      </div>
    </div>
    <div class="right">
      <div class="room">
        <el-input v-model="room" placeholder="直播间ID" :disabled="connected" />
        <el-button v-if="!connected" plain type="success" @click="startWebsocket">
          开启监听
        </el-button>
        <el-button v-else plain type="danger" @click="stopWebsocket">
          断开监听
        </el-button>
        <el-tooltip content="置顶" placement="bottom">
          <el-button round :type="isFix ? 'danger' : ''" @click="handleFix">
            <span class="i-carbon-pin h-5 w-5" />
          </el-button>
        </el-tooltip>
      </div>
      <div class="my-1 cursor-move text-sm text-gray-200" data-tauri-drag-region>
        —— 拖拽我移动位置吧 ——
      </div>
      <Danmu class="w-full" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}

.container{
  @apply h-screen p-4 flex justify-around gap-4 w-full;
  .left{
    @apply relative <sm:hidden;

    .accounts{
      @apply h-[calc(100%-90px)] overflow-y-scroll flex flex-col gap-2;
    }

    .sign{
      @apply fixed bottom-15 flex gap-4 items-center w-40 bg-white;
    }

    .tip{
      @apply fixed bottom-4 text-sm text-gray-400 font-bold left-10;
    }
  }
  .right{
    @apply relative w-120 flex flex-col items-center;
    .room{
      @apply center gap-4 p-4 rounded-md shadow-lg w-full;
    }
  }
}
</style>
