<script lang="ts" setup>
import { sendMessageApi } from '@/apis/live'
import { EDMType } from '@/utils/enums'
import { connected, emojiList } from '@/utils/room'

const { msgList, currentUser } = storeToRefs(useAppStore())

const msg = ref('')
const danmuRef = ref<HTMLElement>()
const emojiRef = ref()
const activeTab = ref('0')
const disabled = computed(() => !connected.value || !currentUser.value)

async function handleSend() {
  if (!msg.value.trim())
    return

  const res = await sendMessageApi(msg.value.trim(), EDMType.普通弹幕)
  if (!res)
    return

  msg.value = ''
}

function handleSendEmoji(value: string) {
  sendMessageApi(value, EDMType.表情弹幕)
  emojiRef.value.hide()
}

watch(msgList, () => {
  if (!danmuRef.value)
    return

  danmuRef.value.scrollTop = danmuRef.value.scrollHeight
}, {
  deep: true,
})
</script>

<template>
  <el-card
    :body-style="{
      padding: '0',
      margin: '0',
    }"
  >
    <div ref="danmuRef" class="danmu">
      <div v-for="item in msgList" :key="item.id" class="text-sm">
        <div v-if="item.type === 'message' || item.type === 'emoji'" class="flex items-center gap-2 text-base">
          <span class="max-w-50 truncate text-amber">{{ item.uname }}: </span>
          <div v-if="item.type === 'emoji'">
            <img :src="item.message" alt="" class="min-h-6 w-20">
          </div>
          <span v-else class="text-blue-500">{{ item.message }}</span>
        </div>
        <span v-else-if="item.type === 'gift'" class="text-red">{{ item.message }}</span>
        <span v-else-if="item.type === 'like' || item.type === 'follow'" class="text-orange">{{ item.message }}</span>
        <span v-else class="text-gray-400">{{ item.message }}</span>
      </div>
    </div>
    <div class="chat">
      <el-popover ref="emojiRef" placement="top" trigger="click" :width="300">
        <template #reference>
          <el-button class="border-none!" plain :disabled="disabled">
            <span class="i-carbon-face-activated-add h-6 w-6" />
          </el-button>
        </template>
        <el-tabs v-model="activeTab">
          <el-tab-pane v-for="tab in emojiList" :key="tab.pkg_id" :label="tab.pkg_name" class="h-30 overflow-y-scroll">
            <div class="flex flex-wrap gap-3">
              <div v-for="emoji in tab.emoticons" :key="emoji.emoticon_id" class="min-h-6 w-20 center cursor-pointer" @click="handleSendEmoji(emoji.emoticon_unique)">
                <el-tooltip :content="emoji.emoji">
                  <img :src="emoji.url" :alt="emoji.emoji">
                </el-tooltip>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-popover>
      <el-input v-model="msg" placeholder="发送一条弹幕吧" class="flex-1" :disabled="disabled" @keyup.enter="handleSend" />
      <el-button round type="primary" :disabled="disabled" @click="handleSend">
        <span class="i-carbon-send-alt h-6 w-6" />
      </el-button>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
.danmu{
  @apply h-130 overflow-y-scroll w-full relative p-2 flex flex-col gap-2;
  scroll-behavior: smooth;
}
.chat{
  @apply center gap-2 px-2 py-3 border-t border-gray-200;
}
</style>
