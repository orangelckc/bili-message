<script setup lang="ts">
import { getVersion } from '@tauri-apps/api/app'
import { listen } from '@tauri-apps/api/event'
import {
  installUpdate,
  onUpdaterEvent,
  checkUpdate as tauriCheckUpdate,
} from '@tauri-apps/api/updater'

const props = defineProps<{
  silent: boolean
}>()

const visible = ref(false)

const isDownload = ref(false)

const updateManifest = ref<any>({})
const currentVersion = ref('')

const showTime = computed(() => {
  if (!updateManifest.value?.date)
    return ''

  return updateManifest.value.date.split(' ')[0]
})

async function checkUpdate() {
  try {
    const updateInfo = await tauriCheckUpdate()

    if (!updateInfo.shouldUpdate) {
      !props.silent && ElMessage.success('已经是最新版本')
      return
    }

    updateManifest.value = {
      ...updateInfo?.manifest,
      currentVersion: await getVersion(),
    }

    visible.value = true
  }
  catch (error) {
    console.error(error)
    !props.silent && ElMessage.error('检查更新失败，请稍后再试或手动下载最新版本')
  }
}

async function handleInstall() {
  isDownload.value = true

  installUpdate()
}

function handleCancel() {
  visible.value = false
  isDownload.value = false
}

onMounted(async () => {
  checkUpdate()
  currentVersion.value = `v${await getVersion()}`
  listen('check-update', () => {
    checkUpdate()
  })
  const stopListen = await onUpdaterEvent(({ status }) => {
    switch (status) {
      case 'DONE':
        ElMessage.success('更新成功，请关闭后重启应用')
        handleCancel()
        stopListen()
        break

      case 'ERROR':
        ElMessage.error('更新失败，请手动下载最新版本')
        handleCancel()
        break
    }
  })
})
</script>

<template>
  <el-dialog v-model="visible" top="30%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <div>
      发现新版本：{{ currentVersion }} -> {{ updateManifest.version }}
    </div>
    <div>更新时间：{{ showTime }}</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :disabled="isDownload" @click="handleInstall">
          更新
        </el-button>
        <el-button :disabled="isDownload" @click="handleCancel">
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
