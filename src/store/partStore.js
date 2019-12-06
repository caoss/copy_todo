/**
 * @author YM
 */
import {observable, action} from 'mobx'
import Http from '../utils/Http'
import ApiConst from '../configs/ApiConst'
import EvnConst from '../configs/EvnConst'

class CubeStore {
    @observable partList =[];

	@action
	async getList(parmas={}) {
        const res = await Http.get(EvnConst.mainHost + ApiConst.PART_LIST ,parmas)
        if(res.code==='0'){
            if(res.data && (res.data instanceof Array)){
                this.partList =res.data;
            }else{
                this.partList =[].push(res.data);
            }
        }
        return res.data;
    }

    @action
	async createPart(parmas={}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.PART }`,
            parmas
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        return {
            code: res.code,
            message: '添加成功'
        }
    }

    // 添加 动作流程
    @action
    async editPart(params = {},id) {
        const res = await Http.put(
            `${EvnConst.temHost + ApiConst.PART+'/'+id }`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        return {
            code: res.code,
            message: '编辑成功'
        }

    }

    @action
	async removePart(parmas={}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.PART }`,
            parmas
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        return {
            code: res.code,
            message: '删除成功'
        }
    }

     @action
     async edit_cylinderMove(params = {}) {
         const res = await Http.post(
             `${EvnConst.temHost + ApiConst.CYLINEDER_MOVE }`,
             params
         )
         // console.log('getMainboardList------------------------res', res)
         if (!res || res.code != 0) {
             return res;
         }
 
         return {
             code: res.code,
             message: '编辑成功'
         }
 
     }

     @action
     async edit_vacuumOp(params = {}) {
         const res = await Http.post(
             `${EvnConst.temHost + ApiConst.VACUUM_OP }`,
             params
         )
         // console.log('getMainboardList------------------------res', res)
         if (!res || res.code != 0) {
             return res;
         }
 
         return {
             code: res.code,
             message: '编辑成功'
         }
 
     }

    
}

export default new CubeStore()