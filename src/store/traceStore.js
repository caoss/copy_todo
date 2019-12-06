/**
 * @author YM
 */
import {observable, action} from 'mobx'
import Http from '../utils/Http'
import ApiConst from '../configs/ApiConst'
import EvnConst from '../configs/EvnConst'
import {  message } from 'antd'
class Tracetore {
    @observable traceList =[];

	@action
	async getList(parmas={}) {
        const res = await Http.get(EvnConst.mainHost + ApiConst.TRACE_LIST)
        if(res.code==='0'){
            if(res.data && (res.data instanceof Array)){
                this.traceList =res.data;
            }else{
                this.traceList =[].push(res.data);
            }
        }
        return res.data;
    }
	@action
	async getPos(id) {
        const res = await Http.get(EvnConst.mainHost + ApiConst.TRACE+'/'+id+'/pos')
        if (!res || res.code != 0) {
            return
        }

        return res.data
    }
    
	@action
	async createTrace(parmas={}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.TRACE }`,
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
	async createPoint(parmas={}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.TRACE_POINT }`,
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
	async removeTrace(parmas={}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.TRACE }`,
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
	async removeAxisPoint(parmas={}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.TRACE_POINT }`,
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
    async editTrace(params = {},id) {
        const res = await Http.put(
            `${EvnConst.temHost + ApiConst.TRACE+'/'+id }`,
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
    // 添加 动作流程
    @action
    async editTraceOffset(params = {},id) {
        const res = await Http.put(
            `${EvnConst.temHost + ApiConst.TRACE+'/'+id+'/offset' }`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }

        return {
            code: res.code,
            message: '操作成功'
        }

    }
    //
    @action
    async editTracePoint(id,params = {}) {
        console.log('parmas---',params);
        const res = await Http.put(
            `${EvnConst.temHost + ApiConst.TRACE_POINT +'/'+id}`,
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
	async _traceDebug(parmas={}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.TRACE_DEBUG }`,
            parmas
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        return {
            code: res.code,
            message: '试校成功'
        }
    }

    @action
	async _tracePointDebug(parmas={}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.TRACE_POINT_DEBUG }`,
            parmas
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        return {
            code: res.code,
            message: '试校成功'
        }
    }

    
}

export default new Tracetore()