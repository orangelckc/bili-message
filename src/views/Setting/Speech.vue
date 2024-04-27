<script lang="ts" setup>
const { voices, voice, danmuConfig, giftConfig, followConfig, volume } = storeToRefs(useSpeechStore())

function changeVolume(val: any) {
  volume.value = val
}
</script>

<template>
  <p class="text-lg text-center">
    输入框中的特殊标记会自动替换成指定的文本
  </p>
  <p class="w-full border border-gray/50 border-solid rounded-lg center justify-around mt2">
    <span>用户昵称: <span class="font-bold text-red">{user}</span></span>
    <span>弹幕消息: <span class="font-bold text-red">{msg}</span></span>
    <span>礼物名称: <span class="font-bold text-red">{gift}</span></span>
  </p>
  <div class="flex flex-col gap3 mt6">
    <div>
      <div class="w-full flex items-center">
        <span>播报语音</span>
        <div class="w-20 ml2">
          <el-slider v-model="volume" :step="1" :max="100" height="0" size="small" @change="changeVolume" />
        </div>
      </div>
      <el-select v-model="voice" class="flex-1" value-key="name">
        <el-option v-for="item in voices" :key="item.lang" :label="item.name" :value="item" />
      </el-select>
    </div>
    <div>
      <span>播报弹幕</span>
      <el-switch v-model="danmuConfig.isOn" class="ml2" />
      <el-input v-model="danmuConfig.pattern" placeholder="弹幕播报模版" :disabled="!danmuConfig.isOn">
        <template #prepend>
          弹幕播报模版
        </template>
      </el-input>
    </div>
    <div>
      <span>播报礼物</span>
      <el-switch v-model="giftConfig.isOn" class="ml2" />
      <el-input v-model="giftConfig.pattern" placeholder="礼物播报模版" :disabled="!giftConfig.isOn">
        <template #prepend>
          礼物播报模版
        </template>
      </el-input>
    </div>
    <div>
      <span>播报关注</span>
      <el-switch v-model="followConfig.isOn" class="ml2" />
      <el-input v-model="followConfig.pattern" placeholder="关注播报模版" :disabled="!followConfig.isOn">
        <template #prepend>
          关注播报模版
        </template>
      </el-input>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-slider__button) {
  @apply w-2 h-2;
}
</style>
