export const useSpeechStore = defineStore('speech', () => {
  const isOn = ref(false)
  const voice = ref<SpeechSynthesisVoice>(undefined as unknown as SpeechSynthesisVoice)
  const text = ref('')
  const pattern = ref('{user}说{msg}')
  const pitch = ref(1)
  const rate = ref(1)

  const speech = useSpeechSynthesis(text, {
    voice,
    pitch,
    rate,
  })

  let synth: SpeechSynthesis

  const voices = ref<SpeechSynthesisVoice[]>([])

  function init() {
    if (speech.isSupported.value) {
      setTimeout(() => {
        synth = window.speechSynthesis
        voices.value = synth.getVoices().filter(voice => voice.lang.includes('zh'))
        voice.value = voices.value[0]
      })
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
    isOn,
    text,
    voices,
    voice,
    pattern,
    init,
    play,
    pause,
    stop,
  }
})
