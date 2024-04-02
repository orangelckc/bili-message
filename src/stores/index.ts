import { getUserInfoApi } from '@/apis/bilibili'
import { getMedalApi, unWearMedalApi, wearMedalApi } from '@/apis/live'

export const useAppStore = defineStore(
  'app',
  () => {
    // 当前选中的用户
    const currentUser = ref<IUser>()

    // 所有登陆用户列表
    const userList = ref<IUser[]>([{
      mid: 0,
      uname: '',
      face: '',
      medals: [],
      medalCount: 0,
    }])

    // 当前的房间号
    const room = ref<number>()

    // 信息列表
    const msgList = ref<IMsg[]>([])

    // 自动滚动
    const autoScroll = ref(true)

    // 置顶
    const isFix = ref(false)

    // 广播
    const isBroadcast = ref(false)

    // 当前佩戴的粉丝勋章
    const currentMedal = ref<IUserMedal>()

    // 自定义样式
    const customStyle = ref<ICustomStyle>({
      unameColor: 'orange',
      unameFontSize: 18,
      msgColor: 'white',
      msgFontSize: 18,
      msgGap: 20,
      msgBackground: 'linear-gradient(to right, #8A2BE2, #4B0082)',
      showMedal: false,
    })

    // 默认选中的弹幕类型
    const defaultSample = ref('A')

    // 刷新当前用户信息
    async function refreshCurrentUser() {
      if (!currentUser.value)
        return

      const { data } = await getUserInfoApi()

      if (!data)
        return

      const { uname, face } = data
      currentUser.value.face = face
      currentUser.value.uname = uname

      // 更新用户列表
      const index = userList.value.findIndex(item => item.mid === currentUser.value?.mid)
      if (index !== -1)
        userList.value[index] = currentUser.value
    }

    // 获取当前用户的所有粉丝勋章
    async function getUserMedal() {
      if (!currentUser.value)
        return

      const list: IUserMedal[] = []
      const { data } = await getMedalApi(1)

      if (!data)
        return

      currentUser.value.medalCount = data.count

      list.push(...data.items)

      const { cur_page, total_page } = data.page_info
      // 循环获取所有勋章
      if (cur_page < total_page) {
        for (let i = cur_page + 1; i <= total_page; i++) {
          const { data } = await getMedalApi(i)
          if (!data)
            return

          list.push(...data.items)
        }
      }

      currentUser.value.medals = list

      // 更新当前选中的粉丝勋章
      const target = list.find(item => item.medal_id === currentMedal.value?.medal_id)

      if (target)
        currentMedal.value = target
    }

    // 佩戴粉丝勋章
    async function wearMedal(medal: IUserMedal) {
      if (!currentUser.value || !medal)
        return

      const data = await wearMedalApi(medal.medal_id) as any

      if (data.code === 0)
        currentMedal.value = medal

      ElMessage({
        message: data.message,
        type: data.code === 0 ? 'success' : 'error',
      })
    }

    // 卸掉粉丝勋章
    async function unWearMedal() {
      if (!currentUser.value)
        return

      const data = await unWearMedalApi() as any

      if (data.code === 0)
        currentMedal.value = undefined

      ElMessage({
        message: data.message,
        type: data.code === 0 ? 'success' : 'error',
      })
    }

    return {
      currentUser,
      userList,
      room,
      msgList,
      isFix,
      isBroadcast,
      currentMedal,
      refreshCurrentUser,
      getUserMedal,
      wearMedal,
      unWearMedal,
      autoScroll,
      customStyle,
      defaultSample,
    }
  },
  {
    persist: {
      paths: ['currentUser', 'userList', 'room', 'currentMedal', 'autoScroll', 'isFix', 'customStyle', 'defaultSample'],
    },
  },
)
