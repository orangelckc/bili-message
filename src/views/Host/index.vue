<script lang="ts" setup>
import { emit } from '@tauri-apps/api/event'

import { sendMessageApi } from '@/apis/live'
import Account from '@/components/Account.vue'
import Control from '@/components/Control.vue'
import HostDanmu from '@/components/Danmu/Host.vue'
import Medal from '@/components/Medal.vue'
import useWebsocket from '@/hooks/useWebsocket'
import { ROOM_URL_PREFIX } from '@/utils/constants'
import { EDMType } from '@/utils/enums'
import { CLOSE_WEBSOCKET_EVENT } from '@/utils/events'

const { userList, currentMedal, currentUser } = storeToRefs(useAppStore())
const { refreshCurrentUser, getUserMedal, wearMedal, unWearMedal } = useAppStore()
const popover = ref()

const disabled = computed(() => {
  if (!currentMedal.value)
    return true

  return !!currentMedal.value.is_lighted
})

async function handleSign() {
  const res = await sendMessageApi('打卡', EDMType.打卡专用)

  if (!res)
    return

  ElMessage.success('打卡成功')
  currentMedal.value!.is_lighted = 1
}

function changeMedal(medal: IUserMedal) {
  // 卸掉当前佩戴的勋章
  if (currentMedal.value?.medal_id === medal.medal_id)
    unWearMedal()
  else
    wearMedal(medal)

  popover.value?.hide()
}

onMounted(() => {
  useWebsocket().trigger()
  refreshCurrentUser()
})

onUnmounted(() => {
  emit(CLOSE_WEBSOCKET_EVENT)
})
</script>

<template>
  <div class="container">
    <div class="left">
      <div class="accounts">
        <Account v-for="user in userList" :key="user.mid" :user="user" />
      </div>
      <div class="sign">
        <el-popover
          ref="popover"
          placement="top-start"
          trigger="click"
          :popper-style="{
            margin: 0,
            padding: 0,
            width: '184px',
          }"
          @before-enter="getUserMedal"
        >
          <div v-if="currentUser?.medalCount" class="flex flex-wrap gap1 p2">
            <div
              v-for="medal in currentUser.medals"
              :key="medal.medal_id"
              class="min-w-[80px]"
            >
              <Medal :medal="medal" @click="changeMedal(medal)" />
            </div>
          </div>
          <div v-else class="p2">
            <span>当前没有任何粉丝勋章</span>
          </div>
          <template #reference>
            <div class="h-full w-[100px] center">
              <el-tooltip
                placement="top"
                :width="80"
                trigger="hover"
                effect="light"
              >
                <template #content>
                  <span v-if="!currentMedal">点击更换勋章</span>
                  <a v-else :href="`${ROOM_URL_PREFIX}/${currentMedal?.roomid}`" target="_blank" class="text-blue-400">去直播间
                  </a>
                </template>
                <Medal :medal="currentMedal" />
              </el-tooltip>
            </div>
          </template>
        </el-popover>
        <el-button size="small" :disabled="disabled" @click="handleSign">
          点亮勋章
        </el-button>
      </div>
      <div class="tip">
        <span>
          <a href="https://space.bilibili.com/405579368" target="_blank" class="text-blue-400">@半糖人类</a> 出品
        </span>
      </div>
    </div>
    <div class="right">
      <Control />
      <el-card
        class="w-full"
        :body-style="{
          padding: '0',
          margin: '0',
        }"
      >
        <HostDanmu />
        <Chat />
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}

.container{
  @apply h-screen p-4 flex justify-around gap-4 w-full border border-gray-200 border-solid rounded-lg bg-white;
  .left{
    @apply relative <sm:hidden;

    .accounts{
      @apply h-[calc(100%-90px)] overflow-y-scroll flex flex-col gap-2;
    }

    .sign{
      @apply fixed bottom-13 w-40 bg-white flex justify-around items-center;
    }

    .tip{
      @apply fixed bottom-4 text-sm text-gray-400 font-bold left-10;
    }
  }
  .right{
    @apply relative w-120 flex flex-col items-center;
  }
}
</style>
