import { WebviewWindow } from '@tauri-apps/api/window'

const windows = {
  setting: {
    url: '/setting',
    title: '设置面板',
    width: 600,
    height: 600,
    decorations: true,
    resizable: false,
  },
  music: {
    url: '/music',
    title: '点歌机',
    width: 360,
    height: 700,
    decorations: true,
    resizable: false,
  },
} as const

type Labels = keyof typeof windows

export async function openWindow(label: Labels) {
  const win = WebviewWindow.getByLabel(label)
  if (win) {
    win.show()
    await win.setAlwaysOnTop(true)
    await win.setAlwaysOnTop(false)
    return
  }

  const options = windows[label]

  // eslint-disable-next-line no-new
  new WebviewWindow(label, options)
}
