<script lang="ts" setup>
const emits = defineEmits(['change'])

const input = ref('')

async function searchMusic() {
  if (!input.value)
    return

  emits('change', input.value)
}
</script>

<template>
  <div class="sticky mt2 p-3">
    <el-input
      v-model.trim="input"
      placeholder="搜索音乐"
      size="large"
      @keydown.enter="searchMusic"
    >
      <template #prefix>
        <i class="i-carbon-search text-lg" />
      </template>
    </el-input>
  </div>
</template>
