import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
  ],
  shortcuts: [
    {
      center: 'flex justify-center items-center',
      column_center: 'flex items-center flex-col',
    },
  ],
  transformers: [
    transformerDirectives(),
  ],
})
