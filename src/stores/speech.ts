export const useSpeechStore = defineStore('speech', () => {
  const text = ref('')
  const voice = ref<SpeechSynthesisVoice>(undefined as unknown as SpeechSynthesisVoice)
  const pitch = ref(1)
  const rate = ref(1)
  const volume = ref(50)

  const danmuConfig = ref({
    isOn: false,
    pattern: '{user}说{msg}',
  })

  const giftConfig = ref({
    isOn: false,
    pattern: '{user}赠送了{gift}',
  })

  const followConfig = ref({
    isOn: false,
    pattern: '感谢{user}的关注',
  })

  const speech = useSpeechSynthesis(text, {
    voice,
    pitch,
    rate,
    volume: volume.value / 100,
  })

  const synth: SpeechSynthesis = window.speechSynthesis

  const voices = ref<SpeechSynthesisVoice[]>([])

  function init() {
    if (speech.isSupported.value) {
      voices.value = []
      setTimeout(() => {
        voices.value = synth.getVoices().filter(voice => voice.lang.includes('zh'))
        voice.value = voices.value[0]
      }, 200)
    }
  }

  function play() {
    if (speech.status.value === 'pause')
      window.speechSynthesis.resume()
    else
      speech.speak()
  }

  function pause() {
    window.speechSynthesis.pause()
  }

  function stop() {
    speech.stop()
  }

  return {
    danmuConfig,
    giftConfig,
    followConfig,
    text,
    voices,
    voice,
    volume,
    init,
    play,
    pause,
    stop,
  }
}, {
  persist: {
    paths: ['danmuConfig', 'giftConfig', 'followConfig', 'volume'],
  },
})
