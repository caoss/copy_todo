/**
 * @author YM
 */
import {observable, action} from 'mobx'
import Http from '../utils/Http'
import ApiConst from '../configs/ApiConst'
import EvnConst from '../configs/EvnConst'

class CubeStore {
    @observable modeleList =[];

	@action
	async getList(parmas={}) {
        const res = await Http.get(EvnConst.mainHost + ApiConst.MODULE_GROUP_LIST)
        if(res.code==='0'){
            if(res.data && (res.data instanceof Array)){
                this.modeleList =res.data;
            }else{
                this.modeleList =[].push(res.data);
            }
        }
        if (!res || res.code != 0) {
            return
        }
        return res.data;
    }

	@action
	async getMGMsg(parmas={}) {
        const res = await Http.get(EvnConst.mainHost + ApiConst.MODULE_GROUP +'/'+parmas)
        if (!res || res.code != 0) {
            return
        }

        return res.data

    }


	@action
	async createMG(parmas={}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.MODULE_GROUP }`,
            parmas
        )
        if (!res || res.code != 0) {
            return
        }

        return {
            code: res.code,
            message: '添加成功'
        }

    }

	@action
	async removeMG(parmas={}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.MODULE_GROUP }`,
            parmas
        )
        if (!res || res.code != 0) {
            return
        }

        return {
            code: res.code,
            message: '删除成功'
        }
    }
    // 添加 动作流程
    @action
    async editMG(params = {},id) {
        const res = await Http.put(
            `${EvnConst.temHost + ApiConst.MODULE_GROUP+'/'+id }`,
            params
        )
        if (!res || res.code != 0) {
            return
        }

        return {
            code: res.code,
            message: '编辑成功'
        }

    }
    
}

export default new CubeStore()