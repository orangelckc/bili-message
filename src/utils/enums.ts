export enum ELoginState {
  未登录 = 0,
  已扫码 = 1,
  已过期 = 2,
  扫码登陆成功 = 3,
}

export enum EQRCodeState {
  成功登陆 = 0,
  已失效 = 86038,
  未扫码 = 86101,
  已扫码未确认 = 86090,
}

export enum EDMType {
  普通弹幕 = '0',
  表情弹幕 = '1',
  打卡专用 = '2',
}
