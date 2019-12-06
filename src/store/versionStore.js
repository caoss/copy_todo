/**
 * @author YM
 */
import { observable, action } from 'mobx'
import Http from '../utils/Http'
import ApiConst from '../configs/ApiConst'
import EvnConst from '../configs/EvnConst'

class VersionStore {
  @observable versionData = {}

  constructor() {}

  @action
  async getVersionList(params = {}) {
    const { pageNum = 1, pageSize = 10, ...rest } = params
    const res = await Http.get(`${EvnConst.temHost + ApiConst.VERSION_LIST}`, {
      pageNum,
      pageSize,
      ...rest
    })
    // console.log('getVersionList------------------------res', res)
    if (!res || res.code != 0) {
      return
    }

    const data = res.data
    this.versionData = {
      list: data.list,
      total: data.total
    }
  }

  @action
  async createVersion(params = {}) {
    const res = await Http.post(
      `${EvnConst.temHost + ApiConst.VERSION_CREATE}`,
      params
    )
    // console.log('createVersion------------------------res', res)
    if (!res || res.code != 0) {
      return {
        code: res.code,
        message: res.msg ? res.msg : '版本创建失败,请检查网络后稍后重试'
      }
    }

    return {
      code: res.code,
      message: '版本创建成功'
    }
  }

  @action
  async removeVersion(params = {}) {
    const res = await Http.del(
      `${EvnConst.temHost + ApiConst.VERSION_DELETE}`,
      params
    )
    // console.log('removeVersion------------------------res', res)
    if (!res || res.code != 0) {
      return {
        code: res.code,
        message: res.msg ? res.msg : '版本删除失败,请检查网络后稍后重试'
      }
    }

    return {
      code: res.code,
      message: '版本删除成功'
    }
  }

  @action
  async editVersion(params = {}) {
    const { id, ...rest } = params
    const res = await Http.put(
      `${EvnConst.temHost + ApiConst.VERSION_EDIT}/${id}`,
      rest
    )
    // console.log('editVersion------------------------res', res)
    if (!res || res.code != 0) {
      return {
        code: res.code,
        message: res.msg ? res.msg : '版本创建失败,请检查网络后稍后重试'
      }
    }

    return {
      code: res.code,
      message: '版本修改成功'
    }
  }
}

export default new VersionStore()
