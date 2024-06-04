<script lang="ts" setup>
import { VirtList } from 'vue-virt-list'

import { demos } from './config'

const props = defineProps<{
  msgList: IMsg[]
  customStyle?: ICustomStyle
  sample: string
}>()

const demo = computed(() => {
  return demos.find(item => item.id === props.sample) || demos[0]
})

const { autoScroll } = storeToRefs(useAppStore())

const danmuRef: Ref<InstanceType<typeof VirtList> | null> = ref(null)

watch(() => props.msgList, () => {
  if (!danmuRef.value || !autoScroll.value)
    return

  nextTick(() => {
    danmuRef.value?.scrollToBottom()
  })
}, {
  deep: true,
})

watch(autoScroll, (val) => {
  if (val)
    danmuRef.value?.scrollToBottom()
})
</script>

<template>
  <div class="danmu">
    <slot />
    <VirtList
      ref="danmuRef" item-key="id" :list="msgList" :min-size="30" :fixed="false" :buffer="2"
    >
      <template #default="{ itemData }">
        <div
          class="p1 text-sm"
          :style="{
            paddingBottom: `${customStyle?.msgGap}px`,
          }"
        >
          <component
            :is="demo.component"
            :custom-style="{
              ...demo.baseStyle,
              ...customStyle,
            }"
            :danmaku="itemData"
          />
        </div>
      </template>
    </VirtList>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
.danmu{
  @apply h-100vh w-full p-2 relative;
}
</style>
