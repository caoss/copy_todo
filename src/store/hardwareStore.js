/**
 * @author YM
 */
import { observable, action } from 'mobx'
import Http from '../utils/Http'
import ApiConst from '../configs/ApiConst'
import EvnConst from '../configs/EvnConst'

class HardwareStore {
  @observable hardwareData = { total: 0, list: [] }

  constructor() {}

  @action
  async getHardwareList(params = {}) {
    const res = await Http.get(
      `${EvnConst.temHost + ApiConst.HARDWARE_LIST}`,
      params
    )
    console.log('getHardwareList------------------------res', res)
    if (!res || parseInt(res.code) != 0) {
      return
    }

    const data = res.data
    this.hardwareData = {
      list: data.list,
      total: data.total
    }
  }

  @action
  async createHardware(params = {}) {
    const res = await Http.post(
      `${EvnConst.temHost + ApiConst.HARDWARE_CREATE}`,
      params
    )
    // console.log('createHardware------------------------res', res)
    if (!res || res.code != 0) {
      return {
        code: res.code,
        message: res.msg ? res.msg : '硬件创建失败,请检查网络后稍后重试'
      }
    }

    return {
      code: res.code,
      message: '硬件创建成功'
    }
  }

  @action
  async removeHardware(params = {}) {
    const res = await Http.del(
      `${EvnConst.temHost + ApiConst.HARDWARE_DELETE}`,
      params
    )
    // console.log('removeHardware------------------------res', res)
    if (!res || res.code != 0) {
      return {
        code: res.code,
        message: res.msg ? res.msg : '硬件删除失败,请检查网络后稍后重试'
      }
    }

    return {
      code: res.code,
      message: '硬件删除成功'
    }
  }

  @action
  async editHardware(params = {}) {
    const { id, ...rest } = params
    const res = await Http.put(
      `${EvnConst.temHost + ApiConst.HARDWARE_EDIT}/${id}`,
      rest
    )
    // console.log('editHardware------------------------res', res)
    if (!res || res.code != 0) {
      return {
        code: res.code,
        message: res.msg ? res.msg : '硬件编辑失败,请检查网络后稍后重试'
      }
    }

    return {
      code: res.code,
      message: '硬件编辑成功'
    }
  }
}

export default new HardwareStore()
