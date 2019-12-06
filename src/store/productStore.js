/**
 * @author YM
 */
import {observable, action} from 'mobx'
import Http from '../utils/Http'
import ApiConst from '../configs/ApiConst'
import EvnConst from '../configs/EvnConst'

class ProductStore {
    @observable productList =[];

	@action
	async getList(parmas={}) {
        const res = await Http.get(EvnConst.mainHost + ApiConst.PRODUCT_LIST)
        if(res.code==='0'){
            if(res.data && (res.data instanceof Array)){
                this.productList =res.data;
            }else{
                this.productList =[].push(res.data);
            }
        }
        console.log('getcubeList-----132-------------------res',this.productList);

    }
	@action
	async createProduct(parmas={}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.PRODUCT }`,
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
	async removeProduct(parmas={}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.PRODUCT }`,
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
    async editProduct(params = {},id) {
        const res = await Http.put(
            `${EvnConst.temHost + ApiConst.PRODUCT+'/'+id }`,
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

export default new ProductStore()