<script lang="ts" setup>
import { VirtualList } from 'vue-tiny-virtual-list'

import SampleA from './SampleA.vue'
import SampleB from './SampleB.vue'

const props = defineProps<{
  msgList: IMsg[]
  customStyle?: ICustomStyle
  sample: string
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
          <SampleA v-if="sample === 'A'" :danmaku="itemData" :custom-style="customStyle" />
          <SampleB v-if="sample === 'B'" :danmaku="itemData" :custom-style="customStyle" />
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
