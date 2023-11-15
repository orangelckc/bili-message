<script lang="ts" setup>
import QRCode from 'qrcode'
import QS from 'qs'

import { getLoginUrlApi, verifyQrCodeApi } from '@/apis/bilibili'
import { ELoginState, EQRCodeState } from '@/utils/enums'

const emits = defineEmits(['success'])

const { userList, currentUser } = storeToRefs(useAppStore())

const qrCodeImage = ref<string>()

const loginState = ref(ELoginState.未登录)

// 获取登录链接，生成二维码
async function getQRCode() {
  loginState.value = 0
  qrCodeImage.value = ''

  const { data } = await getLoginUrlApi()
  if (!data) {
    setTimeout(getQRCode, 1000 * 3)
    return
  }

  const { qrcode_key, url } = data

  qrCodeImage.value = await QRCode.toDataURL(url)
  verifyQrCode(qrcode_key)
}

// 验证扫码信息
async function verifyQrCode(qrcode_key: string) {
  const { data } = await verifyQrCodeApi(qrcode_key)

  if (!data) {
    setTimeout(() => verifyQrCode(qrcode_key), 1000 * 3)

    return
  }

  switch (data.code) {
    case EQRCodeState.已失效:
      loginState.value = ELoginState.已过期
      break

    case EQRCodeState.未扫码:
      setTimeout(() => verifyQrCode(qrcode_key), 1000 * 3)
      break

    case EQRCodeState.已扫码未确认:
      loginState.value = ELoginState.已扫码

      setTimeout(() => verifyQrCode(qrcode_key), 1000 * 3)
      break

    case EQRCodeState.成功登陆:
      loginState.value = ELoginState.扫码登陆成功

      saveLoginInfo(data.url)

      break
  }
}

// 解析数据
async function saveLoginInfo(url: string) {
  const { DedeUserID, bili_jct, SESSDATA } = QS.parse(url.split('?')[1])

  const data: IAccess = {
    uid: +DedeUserID!.toString(),
    cookie: `SESSDATA=${SESSDATA}`,
    csrf: bili_jct!.toString(),
  }

  setUserInfo(data)
}

// 写入用户信息
async function setUserInfo(access: IAccess) {
  const target = userList.value.find(user => access.uid === user.mid)

  if (target) {
    Object.assign(target, access)
    emits('success')

    return
  }

  const user: IUser = {
    uname: '新的用户',
    mid: access.uid,
    face: 'vite.svg',
    csrf: access.csrf,
    cookie: access.cookie,
  }

  // 写入到第一位
  userList.value.unshift(user)
  currentUser.value = user
  qrCodeImage.value = ''
  loginState.value = ELoginState.未登录
  emits('success')
}

onMounted(getQRCode)
</script>

<template>
  <div class="box">
    <h5 v-if="loginState === ELoginState.已扫码">
      扫码成功
    </h5>
    <h5 v-else-if="loginState === ELoginState.已过期">
      二维码已过期
      <el-link type="warning" :underline="false" @click="getQRCode">
        点击刷新
      </el-link>
    </h5>
    <h5 v-else-if="loginState === ELoginState.扫码登陆成功">
      登录成功
    </h5>
    <img v-else :src="qrCodeImage" class="h-full w-full">
  </div>
</template>

<style lang="scss" scoped>
.box{
  @apply h-40 w-40 center;
}
</style>
