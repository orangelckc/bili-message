<script lang="ts" setup>
import { sendMessageApi } from '@/apis/live'
import { EDMType } from '@/utils/enums'
import { connected, emojiList } from '@/utils/room'

const { currentUser } = storeToRefs(useAppStore())

const emojiRef = ref()
const activeTab = ref('0')
const msg = ref('')

const disabled = computed(() => !connected.value || !currentUser.value)

async function handleSend() {
  if (!msg.value.trim())
    return

  const res = await sendMessageApi(msg.value.trim(), EDMType.普通弹幕)
  if (!res)
    return

  msg.value = ''
}

function handleSendEmoji(emoji: any) {
  const { emoticon_unique } = emoji
  // 文字表情
  if (emoticon_unique.startsWith('emoji_')) {
    msg.value += emoji.emoji
    return
  }

  sendMessageApi(emoticon_unique, EDMType.表情弹幕)
  emojiRef.value.hide()
}
</script>

<template>
  <div class="chat">
    <el-popover ref="emojiRef" placement="top" trigger="click" :width="220">
      <template #reference>
        <el-button class="border-none!" plain :disabled="disabled">
          <span class="i-carbon-face-activated-add h-6 w-6" />
        </el-button>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane v-for="tab in emojiList" :key="tab.pkg_id" class="h-30 overflow-y-scroll">
          <template #label>
            <div class="h-8 w-8 center">
              <img :src="tab.current_cover" :alt="tab.pkg_name">
            </div>
          </template>
          <div class="flex flex-wrap gap-3">
            <div v-for="emoji in tab.emoticons" :key="emoji.emoticon_id" class="min-h-6 w-20 center cursor-pointer" @click="handleSendEmoji(emoji)">
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
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
.chat{
  @apply center gap-2 px-2 py-3 border-t border-gray-200;
}
</style>
