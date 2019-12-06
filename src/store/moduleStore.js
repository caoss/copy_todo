/**
 * @author YM
 */
import {
    observable,
    action
} from 'mobx'
import Http from '../utils/Http'
import ApiConst from '../configs/ApiConst'
import EvnConst from '../configs/EvnConst'

class ModuleStore {
    @observable moduleData = {}

    constructor() {}

    @action
    async getModuleList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.MODULE_LIST}`,
            params
        )
        console.log('getModuleList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        const data = res.data
        this.moduleData = {
            list: data,
            total: data.length
        }
    }

    @action
    async createModule(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.MODULE_CREATE}`,
            params
        )
        // console.log('createModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '模组创建失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '模组创建成功'
        }
    }

    @action
    async removeModule(params = {}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.MODULE_DELETE}`,
            params
        )
        // console.log('removeModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '模组删除失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '模组删除成功'
        }
    }

    @action
    async editModule(params = {}) {
        const {
            id,
            ...rest
        } = params
        const res = await Http.put(
            `${EvnConst.temHost + ApiConst.MODULE_EDIT}/${id}`,
            rest
        )
        // console.log('editModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '模组创建失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '模组创建成功'
        }
    }
}

export default new ModuleStore()
