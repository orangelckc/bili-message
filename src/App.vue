<script lang="ts" setup>
import useWebsocket from './hooks/useWebsocket'

onMounted(() => {
  useWebsocket().trigger()
})
</script>

<template>
  <RouterView />
</template>
