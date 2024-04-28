<script lang="ts" setup>
import { writeText } from '@tauri-apps/api/clipboard'

import DynamicBackground from '@/components/Dynamic-Background.vue'
import { LOCAL_BROADCAST_URL } from '@/utils/constants'
import { useSocket } from '@/utils/socket'

const { backgroundImage, isDynamic } = storeToRefs(useBackgroundStore())

async function handleCopyBackground() {
  await writeText(`${LOCAL_BROADCAST_URL}/background`)
  ElMessage.success('复制成功, 链接可直接在OBS中使用')
}

function toggleDynamic(val: any) {
  isDynamic.value = val
  if (!val) {
    useSocket({
      type: 'background',
      command: 'change',
      data: backgroundImage.value,
    })
  }

  useSocket({
    type: 'background',
    command: 'dynamic',
    data: val,
  })
}

function handleRandom() {
  const id = Math.floor(Math.random() * 100)
  backgroundImage.value = `https://picsum.photos/id/${id}/600/400`
}

watch(backgroundImage, (val) => {
  useSocket({
    type: 'background',
    command: 'change',
    data: val,
  })
})
</script>

<template>
  <div class="center flex-col p3 gap3">
    <el-switch
      v-model="isDynamic"
      active-text="使用音乐封面背景"
      inactive-text="使用固定图片背景"
      @change="toggleDynamic"
    />
    <el-input v-model="backgroundImage" placeholder="请输入图片链接" :disabled="isDynamic">
      <template #prepend>
        固定背景图片
      </template>
      <template #append>
        <el-button @click="handleRandom">
          随机
        </el-button>
      </template>
    </el-input>
    <el-link type="primary" @click="handleCopyBackground">
      复制背景URL
    </el-link>
    <DynamicBackground v-if="!isDynamic" :album-image-url="backgroundImage" class="w-full h100 rounded-xl" />
  </div>
</template>
