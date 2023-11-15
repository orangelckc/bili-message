import { BASE_URL_PREFIX, LOGIN_URL_PREFIX } from '@/utils/constants'
import request from '@/utils/request'

/**
 * 获取登录url
 */
function getLoginUrlApi(): PromiseData<{
  qrcode_key: string
  url: string
}> {
  return request({
    url: `${LOGIN_URL_PREFIX}/qrcode/generate`,
    method: 'GET',
  })
}

/**
 * 验证二维码是否被扫描
 * @param qrcode_key 收到的二维码key
 */
function verifyQrCodeApi(qrcode_key: string): PromiseData<ILogin> {
  return request({
    url: `${LOGIN_URL_PREFIX}/qrcode/poll`,
    method: 'GET',
    params: {
      qrcode_key,
    },
  })
}

/**
 * 获取用户信息
 */
function getUserInfoApi(): PromiseData<IUser> {
  const { currentUser } = useAppStore()

  return request({
    url: `${BASE_URL_PREFIX}/x/web-interface/nav`,
    headers: {
      cookie: currentUser!.cookie,
    },
  })
}

// 验证登录信息是否有效
async function validateLoginInfoApi() {
  const { currentUser } = useAppStore()
  if (!currentUser?.cookie || !currentUser?.csrf)
    return

  return request({
    method: 'POST',
    url: 'https://api.vc.bilibili.com/link_setting/v1/link_setting/get',
    data: {
      msg_notify: '1',
      show_unfollowed_msg: '1',
      build: '0',
      mobi_app: 'web',
      csrf_token: currentUser.csrf,
      csrf: currentUser.csrf,
    },
    headers: {
      cookie: currentUser.cookie,
    },
  })
}

export {
  getLoginUrlApi,
  verifyQrCodeApi,
  validateLoginInfoApi,
  getUserInfoApi,
}
