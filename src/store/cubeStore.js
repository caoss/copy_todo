/**
 * @author YM
 */
import {observable, action} from 'mobx'
import Http from '../utils/Http'
import ApiConst from '../configs/ApiConst'
import EvnConst from '../configs/EvnConst'

class CubeStore {
    @observable cubeList =[];

	@action
	async getList(parmas={}) {
        const res = await Http.get(EvnConst.mainHost + ApiConst.CUBE_LIST)
        if(res.code==='0'){
            if(res.data && (res.data instanceof Array)){
                this.cubeList =res.data;
            }else{
                this.cubeList =[].push(res.data);
            }
        }
    }
	@action
	async createCude(parmas={}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.CUBE }`,
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

	@action
	async removeCube(parmas={}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.CUBE }`,
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
    // 添加 动作流程
    @action
    async editCube(params = {},id) {
        const res = await Http.put(
            `${EvnConst.temHost + ApiConst.CUBE+'/'+id }`,
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
    
}

export default new CubeStore()