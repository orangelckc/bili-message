<script lang="ts" setup>
import { VirtualList } from 'vue-tiny-virtual-list'

import Medal from '@/components/Medal.vue'
import { ROOM_URL_PREFIX } from '@/utils/constants'

const props = defineProps<{
  msgList: IMsg[]
  mode: 'host' | 'client'
  customStyle?: ICustomStyle
}>()

const { autoScroll } = storeToRefs(useAppStore())

const danmuRef: Ref<InstanceType<typeof VirtualList> | null> = ref(null)

watch(() => props.msgList, () => {
  if (!danmuRef.value || !autoScroll.value)
    return

  nextTick(() => {
    danmuRef.value.scrollToBottom()
  })
}, {
  deep: true,
})

watch(autoScroll, (val) => {
  if (val)
    danmuRef.value.scrollToBottom()
})
</script>

<template>
  <div class="danmu">
    <slot />
    <VirtualList
      ref="danmuRef" item-key="id" :list="msgList" :min-size="30" :fixed="false" :buffer="2"
    >
      <template #default="{ itemData }">
        <div
          class="p1 text-sm"
          :style="{
            paddingBottom: `${customStyle?.msgGap}px`,
          }"
        >
          <div
            v-if="itemData.type === 'emoji'" class="flex items-center"
            :style="{
              background: customStyle?.msgBackground,
            }"
          >
            <div v-if="itemData.medal">
              <el-tooltip
                placement="top"
                :width="80"
                trigger="hover"
                effect="light"
              >
                <template #content>
                  <a :href="`${ROOM_URL_PREFIX}/${itemData.medal?.room_id}`" target="_blank" class="text-blue-400">去直播间
                  </a>
                </template>
                <Medal v-if="itemData.medal && itemData.medal.is_lighted" :medal="itemData.medal" class="w24rpx" />
              </el-tooltip>
            </div>
            <span
              class="text-base text-amber"
              :style="{
                color: customStyle?.unameColor,
                fontSize: `${customStyle?.unameFontSize}px`,
              }"
            >{{ itemData.uname }} </span>
            <div v-if="itemData.type === 'emoji'">
              <img :src="itemData.message" alt="" class="ml1 min-h-6 w14">
            </div>
          </div>
          <div
            v-else-if="itemData.type === 'message'" class="flex flex-col gap1"
            :style="{
              background: customStyle?.msgBackground,
            }"
          >
            <div class="inline-flex items-center gap1">
              <el-avatar v-if="itemData.uface" :src="itemData.uface" size="small" shape="circle" />
              <el-tooltip
                placement="top"
                :width="80"
                trigger="hover"
                effect="light"
              >
                <template #content>
                  <a :href="`${ROOM_URL_PREFIX}/${itemData.medal?.room_id}`" target="_blank" class="text-blue-400">去直播间
                  </a>
                </template>
                <Medal v-if="itemData.medal && itemData.medal.is_lighted" :medal="itemData.medal" class="w24rpx" />
              </el-tooltip>
              <div class="text-base text-amber">
                {{ itemData.uname }}
              </div>
              <div class="ml2 text-xs text-gray/200">
                {{ itemData.time }}
              </div>
            </div>
            <div
              class="ml2 inline-flex items-center text-base text-blue-500"
              :style="{
                color: customStyle?.msgColor,
                fontSize: `${customStyle?.msgFontSize}px`,
              }"
              v-html="itemData.message"
            />
          </div>
          <span v-else-if="itemData.type === 'gift'" class="text-red">{{ itemData.message }}</span>
          <span v-else-if="itemData.type === 'like' || itemData.type === 'follow'" class="text-orange">{{ itemData.message }}</span>
          <span v-else class="text-gray-400">{{ itemData.message }}</span>
        </div>
      </template>
    </VirtualList>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
.danmu{
  @apply h-130 w-full p-2 relative;
}
</style>
