import { getUserInfoApi } from '@/apis/bilibili'

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
    }])

    // 当前的房间号
    const room = ref<number>()

    // 打卡房间号
    const signRoom = ref<number>()

    // 信息列表
    const msgList = ref<IMsg[]>([])

    // 置顶
    const isFix = ref(false)

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

    return {
      currentUser,
      userList,
      room,
      msgList,
      isFix,
      signRoom,
      refreshCurrentUser,
    }
  },
  {
    persist: {
      paths: ['currentUser', 'userList', 'room', 'signRoom'],
    },
  },
)
