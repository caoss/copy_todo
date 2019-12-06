import Storage from './Storage'

class AuthUtil {
  static checkIsAppleDevice() {
    const u = navigator.userAgent
    const ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    const iPad = u.indexOf('iPad') > -1
    const iPhone = u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1
    if (ios || iPad || iPhone) {
      return true
    }
    return false
  }

  static isWxEnv() {
    const ua = window.navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true
    }
    return false
  }

  static isAndroid() {
    const u = navigator.userAgent
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    return isAndroid
  }

  static saveUserInfo(userinfo) {
    Storage.saveToStorage({
      key: 'neets_user',
      value: JSON.stringify(userinfo),
      expire: 16 * 24 * 60 * 60 * 1000
    })
  }

  static removeUserInfo() {
    Storage.removeFromStorage('neets_user')
  }

  static getUserInfo() {
    const userinfo = Storage.getFormStorage('neets_user')
    if (
      userinfo &&
      userinfo != 'undefined' &&
      userinfo != null &&
      userinfo != 'null'
    )
      var obj = JSON.parse(userinfo)
    return obj
  }

  static getUserId() {
    return AuthUtil.getUserInfo() && AuthUtil.getUserInfo().id
  }

  static getAuthToken() {
    if (
      AuthUtil.getUserId() == 'undefined' ||
      AuthUtil.getUserId() == undefined ||
      AuthUtil.getUserId() == null ||
      AuthUtil.getUserId() == 'null'
    ) {
      return undefined
    }

    return `userId=${AuthUtil.getUserId()}`
  }

  static isLogin() {
    //   return true;
    if (AuthUtil.getAuthToken() && AuthUtil.getAuthToken() != '') {
      return true
    }
    return false
  }
}

export default AuthUtil
