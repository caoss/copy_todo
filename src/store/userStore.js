/**
 * @author YM
 */
import { observable, action } from 'mobx'
import Http from '../utils/Http'
import AuthUtil from '../utils/AuthUtil'
import ApiConst from '../configs/ApiConst'
import EvnConst from '../configs/EvnConst'

class AppStore {
  constructor() {}

  @action
  async getMessageCode(params = {}) {
    const { phone = '' } = params
    const res = await Http.post(EvnConst.ucHost + ApiConst.UC_SEND_CODE, {
      phone
    })
    return res
  }

  @action
  async logout(params = {}) {
    AuthUtil.removeUserInfo()
  }

  @action
  async login(params = {}) {
    // const { phone='', smsCode='', randomKey='' } = params
    // const res = await Http.post(EvnConst.ucHost + ApiConst.UC_LOGIN, {
    // 	phone: phone,
    // 	smsCode: smsCode,
    // 	randomKey: randomKey
    // })

    // if(!res || res.status) {
    // 	return {
    // 		code: 1,
    // 		message: 'fail'
    // 	}
    // }

    AuthUtil.saveUserInfo({
      id: 'R1ZUd1F3MFJ3VFo5QVMrUXBaemZnQT09'
    })

    return {
      code: 0
    }
  }

  @action
  async getUserInfo(params = {}) {
    const res = await Http.get(EvnConst.ucHost + ApiConst.UC_GET_USER_INFO)
    console.log('getUserInfo', res)
    if (!res || res.status) {
      return {
        code: 1,
        message: 'fail'
      }
    }

    return {
      code: 0,
      res
    }
  }
}

export default new AppStore()
