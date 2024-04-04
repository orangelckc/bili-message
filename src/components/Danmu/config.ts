import SampleA from '@/components/Danmu/SampleA.vue'
import SampleB from '@/components/Danmu/SampleB.vue'

export const danmaku: IMsg = {
  id: 'Sp96GuKWs9ZbUGa6JrK7H',
  type: 'message',
  uname: '用户昵称',
  message: '测试弹幕<img style="width: 20px; height: 20px;" src="http://i0.hdslb.com/bfs/live/816402551e6ce30d08b37a917f76dea8851fe529.png" />',
  time: '00:00:29',
  uface: 'https://i1.hdslb.com/bfs/face/ab5bb211fb3119d129bc9a4d551ce32078aceb61.jpg@300w_300h_1c.avif',
}

export const demos = [
  {
    name: '样例1',
    id: 'A',
    component: SampleA,
    baseStyle: {
      avatarSize: 100,
      unameColor: 'rgba(255, 255, 255, 0.8)',
      unameFontSize: 16,
      msgColor: 'rgba(255, 255, 255, 0.9)',
      msgFontSize: 20,
      msgBackground: 'rgba(0, 0, 0, 0.5)',
      showMedal: false,
    },
  },
  {
    name: '样例2',
    id: 'B',
    component: SampleB,
    baseStyle: {
      unameColor: 'rgba(255, 255, 255, 0.8)',
      unameFontSize: 16,
      msgColor: 'rgba(255, 255, 255, 0.9)',
      msgFontSize: 20,
      msgBackground: '0, 0, 0',
      showMedal: false,
    },
  },
]
