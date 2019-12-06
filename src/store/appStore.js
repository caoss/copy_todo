/**
 * @author YM
 */
import {observable, action} from 'mobx'
import Http from '../utils/Http'
import ApiConst from '../configs/ApiConst'
import EvnConst from '../configs/EvnConst'

class AppStore {
	constructor() {
		
	}

	@action
	async getList(parmas={}) {
		const res = await Http.get(EvnConst.mainHost + ApiConst.DAY_RECOMMEND)
		console.log('getList-----132-------------------res',res);
    }
    

	@action
	async getSoftWareMsg(parmas={}) {
		const res = await Http.get(EvnConst.mainHost + 'software')
        console.log('getList-----132-------------------res',res);
        if(res.data){
            return res.data
        }
    }
    
}

export default new AppStore()