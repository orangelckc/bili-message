export const useBackgroundStore = defineStore('background', () => {
  const backgroundImage = ref<string>('https://i2.hdslb.com/bfs/face/e6138f6ecb8fb36f3bb9ef01e0caaaf499027e15.jpg')
  const isDynamic = ref(false)

  return {
    backgroundImage,
    isDynamic,
  }
}, {
  persist: {
    paths: ['backgroundImage', 'isDynamic'],
  },
})
