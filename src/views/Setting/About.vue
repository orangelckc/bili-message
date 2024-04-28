<script setup lang="ts">
import { getName, getTauriVersion, getVersion } from '@tauri-apps/api/app'
import { writeText } from '@tauri-apps/api/clipboard'
import { arch, platform, type, version } from '@tauri-apps/api/os'
import { open } from '@tauri-apps/api/shell'

const appInfo = reactive({
  appName: '',
  appVersion: '',
  tauriVersion: '',
  platform: '',
  os: '',
  osVersion: '',
  arch: '',
})

async function copySystemInfo() {
  const info = {
    ...appInfo,
    userAgent: navigator.userAgent,
  }

  await writeText(JSON.stringify(info))

  ElMessage.success('已复制到剪贴板')
}

function jumpGithub() {
  open('https://github.com/orangelckc/bili-message')
}

onMounted(async () => {
  appInfo.appName = await getName()
  appInfo.appVersion = await getVersion()
  appInfo.tauriVersion = await getTauriVersion()
  appInfo.platform = await platform()
  appInfo.os = await type()
  appInfo.osVersion = await version()
  appInfo.arch = await arch()
})
</script>

<template>
  <div class="center flex-col h-full justify-around">
    <div class="center flex-col gap5">
      <img src="@/assets/logo.png">
      <span class="text-lg">{{ appInfo.appName }}</span>
      <div class="flex gap4 items-center">
        <span class="text-sm text-[#666]">Version. {{ appInfo.appVersion }}</span>
        <span class="i-carbon-logo-github w6 h6 cursor-pointer" @click="jumpGithub" />
      </div>

      <el-button type="info" plain @click="copySystemInfo">
        系统版本信息
      </el-button>
    </div>
    <span class="text-sm text-[#666]">
      CopyRight © 2023-2024 <a href="https://space.bilibili.com/405579368" target="_blank" class="text-blue-400">半糖人类</a>. All Rights Reserved.
    </span>
  </div>
</template>
