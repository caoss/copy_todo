/**
 * @author YM
 */
import {
    observable,
    action,
    toJS
} from 'mobx'
import Http from '../utils/Http'
import ApiConst from '../configs/ApiConst'
import EvnConst from '../configs/EvnConst'

class MainboardStore {

    @observable pointData = {
        list: [],
        total: 0
    }
    @observable stepList = {
    }
    @observable worklogs = {
    }
    @observable axisPointList = {}

    @observable mainboardData = {
        list: [],
        total: 0
    }

    @observable portData = {
        list: [],
        total: 0
    }

    @observable ioPortData = {
        list: [],
        total: 0
    }

    @observable axisPortData = {
        list: [],
        total: 0
    }

    @observable paramsData = {
        list: [],
        total: 0
    }

    @observable axisParams = {}
    @observable axisList = []

    @observable axisPointData = {
        list: [],
        total: 0
    }

    @observable buttonData = {
        list: [],
        total: 0
    }
    @observable axisMsg = {
        list: [],
        total: 0
    }
    @observable ioMsg = {
        list: [],
        total: 0
    }
    @observable engineStatus = {
    }

    constructor() {}

    @action
    async getMainboardList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.MAINBOARD_LIST}`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        const data = res.data
        this.mainboardData = {
            list: data,
            total: data.length
        }
    }

    //获取轴信息
    @action
    async getAxisInfo(axisId) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.AXIS_INFO +'/'+axisId}`
        )
        console.log('getAxisInfo------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        const data = res.data
        return data;
    }
    // 
    @action
    async getPointList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + 'point/list' }`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        const data = res.data
        console.log('data',data);
        this.pointData = data
        return data;
    }

    
    //stepList
    @action
    async getStepList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost +  ApiConst.STEP_LIST  }`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        const data = res.data

        this.stepList = data;
        return data;
    }
    //stepList
    @action
    async getStepList_2(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost +  ApiConst.STEP_LIST  }`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        
        const data = res.data
        this.stepList[params.index]['steps'] = data;
        this.stepList[params.index]['expand'] = true;
        console.log( toJS(this.stepList) );
        return this.stepList;
    }
    @action
    _shrinkAction(params={}){
        this.stepList[params.index]['expand'] = false;
    }
  
    //stepList
    @action
    async getStepList_3(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost +  ApiConst.STEP_LIST  }`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }
        const data = res.data
        this.stepList[params.index]['steps'][params.i]['steps'] = data;
        this.stepList[params.index]['steps'][params.i]['expand'] = true;
        console.log( toJS(this.stepList) );
        return this.stepList;
    }
    @action
    _shrinkAction2(params={}){
        this.stepList[params.index]['steps'][params.i]['expand'] = false;
    }


    @action
    async getStepList_4(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost +  ApiConst.STEP_LIST  }`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }
        const data = res.data
        this.stepList[params.index]['steps'][params.i]['steps'][params.i3]['steps'] = data;
        this.stepList[params.index]['steps'][params.i]['steps'][params.i3]['expand'] = true;
        console.log( toJS(this.stepList) );
        return this.stepList;
    }
    @action
    _shrinkAction3(params={}){
        this.stepList[params.index]['steps'][params.i]['steps'][params.i3]['expand'] = false;
    }

    
    @action
    _shrinkAction4(params={}){
        this.stepList[params.index]['steps'][params.i]['steps'][params.i3]['steps'][params.i4]['expand'] = false;
    }
    @action
    async getStepList_5(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost +  ApiConst.STEP_LIST  }`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }
        const data = res.data
        this.stepList[params.index]['steps'][params.i]['steps'][params.i3]['steps'][params.i4]['steps']  = data;
        this.stepList[params.index]['steps'][params.i]['steps'][params.i3]['steps'][params.i4]['expand']  = true;
        console.log( toJS(this.stepList) );
        return this.stepList;
    }



   
    
    @action
    async getAxisPointData(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.AXIS_POINT_LIST}`,
            params
        )
        if (!res || res.code != 0) {
            return
        }
        return res.data
    }

    // 添加点位
    @action
    async addPoint(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + 'point' }`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        return {
            code: res.code,
            message: '创建成功'
        }

    }
    // 查看点位
    @action
    async getPoint(id) {
        const res = await Http.get(
            `${EvnConst.temHost + 'point/'+id }`
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }
        const data = res.data
        return data;

    }
    // 添加 动作流程
    @action
    async addStep(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.STEP_CONFIG }`,
            params
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
    async addCriteria(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.CRITERIA_CONFIG }`,
            params
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
    async editCriteria(params = {}) {
        const res = await Http.put(
            `${EvnConst.temHost + ApiConst.CRITERIA_CONFIG }`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        return {
            code: res.code,
            message: '修改成功'
        }

    }
    // 添加 动作流程
    @action
    async delCriteria(params = {}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.CRITERIA_CONFIG }`,
            params
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
    async editStep(params = {},id) {
        const res = await Http.put(
            `${EvnConst.temHost + ApiConst.STEP_CONFIG+'/'+id }`,
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
    // 删除 动作流程
    @action
    async delSteps(params = {}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.STEP_CONFIG }`,
            params
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
    // 添加点位
    @action
    async delPoints(params = {}) {
        console.log('params',params);
        const res = await Http.del(
            `${EvnConst.temHost + 'point' }`,
            { idList:params}
        )
        console.log('params',params);
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
    async editPoint(params = {}) {
        let { pointName,softwareId } = params;
        const res = await Http.put(
            `${EvnConst.temHost + 'point/'+params.id }`,
            { pointName,softwareId }
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        return {
            code: res.code,
            message: '创建成功'
        }

    }




    @action
    async createMainboard(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.MAINBOARD_CREATE}`,
            params
        )
        // console.log('createModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '主卡创建失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '主卡创建成功'
        }
    }

    @action
    async editMainboard(params = {}) {
        const res = await Http.put(
            `${EvnConst.temHost + ApiConst.MAINBOARD_CREATE+'/'+params.id}`,
            params
        )
        // console.log('createModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '主卡修改失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '主卡修改成功'
        }
    }

    @action
    async removeMainboard(params = {}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.MAINBOARD_DELETE}`,
            params
        )
        // console.log('removeModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '主卡删除失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '主卡删除成功'
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
                message: res.msg ? res.msg : '主卡创建失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '主卡创建成功'
        }
    }

    // 端口配置
    @action
    async getPortList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.PORT_LIST}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        const data = res.data
        this.portData = {
            list: data,
            total: data.length
        }
        return res.data
    }

    @action
    async getAxisPortList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.PORT_LIST}`,
            params
        )
        console.log('getAxisPortList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        const data = res.data
        this.axisPortData = {
            list: data,
            total: data.length
        }
    }

    @action
    async createPort(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.PORT_CREATE}`,
            params
        )
        // console.log('createModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '创建失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '创建成功'
        }
    }

    @action
    async editPort(params = {}) {
        const {
            id,
            ...rest
        } = params
        const res = await Http.put(
            `${`${EvnConst.temHost + ApiConst.PORT_EDIT}/${id}`}`, {
                ...rest
            }
        )
        // console.log('createModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '编辑失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '编辑成功'
        }
    }

    @action
    async removePort(params = {}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.PORT_DELETE}`,
            params
        )
        // console.log('removeModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '删除失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '删除成功'
        }
    }

    // 参数配置
    @action
    async getParamsList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.PARAMS_LIST}`,
            params
        )
        console.log('getParamsList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        const data = res.data
        this.paramsData = {
            list: data.list,
            total: data.total
        }
    }

    @action
    async createParams(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.PARAMS_CREATE}`,
            params
        )
        // console.log('createModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '创建失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '创建成功'
        }
    }

    @action
    async editParams(params = {}) {
        const {
            id,
            ...rest
        } = params
        const res = await Http.put(
            `${`${EvnConst.temHost + ApiConst.PARAMS_EDIT}/${id}`}`, {
                ...rest
            }
        )
        // console.log('createModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '编辑失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '编辑成功'
        }
    }

    @action
    async removeParams(params = {}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.PARAMS_DELETE}`,
            params
        )
        // console.log('removeModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '删除失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '删除成功'
        }
    }

    // 轴口参数配置
    @action
    async getAxisParams(params = {}) {
        const {
            axisId
        } = params
        const res = await Http.get(
            `${`${EvnConst.temHost + ApiConst.AXIS_PARAMS}/${axisId}`}`,
            params
        )
        // console.log('getAxisParams------------------------res', res)
        if (!res || res.code != 0) {
            this.axisParams = {}
            return
        }

        this.axisParams = res.data
    }

    @action
    async createAxisParams(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.AXIS_CREATE}`,
            params
        )
        // console.log('createModule------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '参数设置失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '参数设置成功'
        }
    }

    // 点位配置
    @action
    async getAxisPointList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.AXISPOINT_LIST}`,
            params
        )
        console.log('getAxisPointList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        const data = res.data
        this.axisPointData = {
            list: data,
            total: data.length
        }
    }

    @action
    async createAxisPoint(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + '/point/detail'}`,
            params
        )
        // console.log('createAxisPoint------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '创建失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '创建成功'
        }
    }
    // @action
    // async createAxisPoint(params = {}) {
    //     const res = await Http.post(
    //         `${EvnConst.temHost + ApiConst.AXISPOINT_CREATE}`,
    //         params
    //     )
    //     // console.log('createAxisPoint------------------------res', res)
    //     if (!res || res.code != 0) {
    //         return {
    //             code: res.code,
    //             message: res.msg ? res.msg : '创建失败,请检查网络后稍后重试'
    //         }
    //     }

    //     return {
    //         code: res.code,
    //         message: '创建成功'
    //     }
    // }

    @action
    async editAxisPoint(params = {}) {
        const res = await Http.put(
            `${EvnConst.temHost}/point/detail`, 
                params
        )
        // console.log('editAxisPoint------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '编辑失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '编辑成功'
        }
    }
    // @action
    // async editAxisPoint(params = {}) {
    //     const {
    //         id,
    //         ...rest
    //     } = params
    //     const res = await Http.put(
    //         `${`${EvnConst.temHost + ApiConst.AXISPOINT_EDIT}/${id}`}`, {
    //             ...rest
    //         }
    //     )
    //     // console.log('editAxisPoint------------------------res', res)
    //     if (!res || res.code != 0) {
    //         return {
    //             code: res.code,
    //             message: res.msg ? res.msg : '编辑失败,请检查网络后稍后重试'
    //         }
    //     }

    //     return {
    //         code: res.code,
    //         message: '编辑成功'
    //     }
    // }

    //删除轴点位
    @action
    async removeAxisPoint(params = {}) {
        const res = await Http.del(
            `${EvnConst.temHost + '/point/detail'}`,
            params
        )
        // console.log('removeAxisPoint------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '删除失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '删除成功'
        }
    }
    // @action
    // async removeAxisPoint(params = {}) {
    //     const res = await Http.del(
    //         `${EvnConst.temHost + ApiConst.AXISPOINT_DELETE}`,
    //         params
    //     )
    //     // console.log('removeAxisPoint------------------------res', res)
    //     if (!res || res.code != 0) {
    //         return {
    //             code: res.code,
    //             message: res.msg ? res.msg : '删除失败,请检查网络后稍后重试'
    //         }
    //     }

    //     return {
    //         code: res.code,
    //         message: '删除成功'
    //     }
    // }

    // 按钮配置
    @action
    async getButtonList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.BUTTON_LIST}`,
            params
        )
        console.log('getButtonList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        const data = res.data
        this.buttonData = {
            list: data,
            total: data.length
        }
        return data;
    }

    @action
    async createButton(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.BUTTON_CREATE}`,
            params
        )
        // console.log('createAxisPoint------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '创建失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '创建成功'
        }
    }

    @action
    async editButton(params = {}) {
        const {
            id,
            ...rest
        } = params
        const res = await Http.put(
            `${`${EvnConst.temHost + ApiConst.BUTTON_EDIT}/${id}`}`, {
                ...rest
            }
        )
        // console.log('editAxisPoint------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '编辑失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '编辑成功'
        }
    }

    @action
    async removeButton(params = {}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.BUTTON_DELETE}`,
            params
        )
        // console.log('removeAxisPoint------------------------res', res)
        if (!res || res.code != 0) {
            return {
                code: res.code,
                message: res.msg ? res.msg : '删除失败,请检查网络后稍后重试'
            }
        }

        return {
            code: res.code,
            message: '删除成功'
        }
    }

    // 端口配置
    @action
    async getIOPortList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.PORT_LIST}`,
            params
        )
        console.log('getIOPortList',res);
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        const data = res.data
        this.ioPortData = {
            list: data,
            total: data.length
        }
        return data;
    }
    // 获取模组详情
    @action
    async getModelDetail(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.MODULE_GP+params}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }
        
        return res.data;
    }

    // 端口配置
    @action
    async getXPortList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.PORT_LIST}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }

        const data = res.data
        return data
    }


    //轴监控
    @action
    async getAxisMsg(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.AXIS_MSG}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        const data = res.data
        this.axisMsg = {
            list: data,
            total: data.length
        }
        return res
    }
    //io监控
    @action
    async getIoMsg(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.IO_MSG}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        const data = res.data
        console.log('data',data);
        this.ioMsg = {
            list: data,
            total: data.length
        }
        return res;
    }

    //引擎状态
    @action
    async getEngineStatus(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.ENGINE_STATUS}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }
        const data = res.data
        this.engineStatus = data;
        return data;
    }

    //引擎启动
    @action
    async getEngineStart(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.ENGINE_START}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }
        console.log('res--------',res);
        return res;
    }
    //引擎停止
    @action
    async getEngineClose(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.ENGINE_CLOSE}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }
        console.log('res--------',res);
        return res;
    }

    //引擎刷新
    @action
    async getEngineRefresh(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.ENGINE_REFRESH}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }
        console.log('res--------',res);
        return res;
    }

    
    @action
    async getAxisJK(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.AXIS_JK +'/'+params.axisId}`,
        )
        return res;
    }

    @action
    async axisMoveRel(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.AXIS_MOVE_REL}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }

    @action
    async axisMoveJog(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.AXIS_JOG}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }
    @action
    async axisStop(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.AXIS_STOP}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }
    @action
    async axisMove(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.AXIS_MOVE}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }
    async axisMoveAbs(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.AXIS_MOVE_ABS}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }
    async axisTeach(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.AXIS_TEACH}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }
    async axisGoHome(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.AXIS_GO_HOME}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }
    
    async setIinvert(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.I_INVERT}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }
        console.log('res--------',res);
        return res;
    }
    async setOinvert(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.O_INVERT}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }
    async step_config(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.BUG_STEP_CONFIG}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }
        console.log('res--------',res);
        return res;
    }
    async setPointDetail(params = {}) {
        const res = await Http.put(
            `${EvnConst.temHost + ApiConst.POINT_DETAIL}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }
    async getAxisList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.AXIS_LIST}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }
        console.log('res--------',res);
        this.axisList = res.data;
    }


    async getCCDList(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.CCD_GET}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }
        return res;
       
    }
    async sendCCDList(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.CCD_SEND}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }
        return res;
       
    }
    async delCCDList(params = {}) {
        const res = await Http.del(
            `${EvnConst.temHost + ApiConst.CCD_DEL}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }
        return res;
       
    }
    async startCCDList(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.CCD_START}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }
        return res;
       
    }
    async setButtonMock(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.BUTTON_MOCK}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        return res;
       
    }
    


    async workModeToggle(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.WORK_MODE_TOGGLE}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }

    async _stop(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.CUR_STOP}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }



    async workFlowTrigger(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.WORK_FLOW_TRIGGER}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }

    async setEnable(params = {}) {
        console.log('res--------',params);
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.SET_ENABLE}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return null
        }
        if(params.i2==undefined){
            this.stepList[params.i1]['enableFlag'] = params.enableFlag ;
        }else if(params.i3==undefined){
            this.stepList[params.i1]['steps'][params.i2]['enableFlag'] = params.enableFlag ;
        }else if(params.i4==undefined){
            this.stepList[params.i1]['steps'][params.i2]['steps'][params.i3]['enableFlag'] = params.enableFlag ;
        }else if(params.i5==undefined){
            this.stepList[params.i1]['steps'][params.i2]['steps'][params.i3]['steps'][params.i4]['enableFlag'] = params.enableFlag ;
        }else{
            this.stepList[params.i1]['steps'][params.i2]['steps'][params.i3]['steps'][params.i4]['enableFlag'][params.i5]['enableFlag'] = params.enableFlag ;
        }

        console.log( toJS(this.stepList) );
        return this.stepList;
    }


    async _step_conf(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.STEP_CONF}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }
    async _adjust(params = {}) {
        const res = await Http.post(
            `${EvnConst.temHost + ApiConst.ADJUST}`,
            params
        )
        // console.log('getPortList------------------------res', res)
        if (!res || res.code != 0) {
            return res
        }
        console.log('res--------',res);
        return res;
    }
    
    @action
    async getWorkLogs(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.STEP_LOGS}`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }

        const data = res.data
        this.worklogs = data;
        return data;
    }
    @action
    async getProcessing(params = {}) {
        const res = await Http.get(
            `${EvnConst.temHost + ApiConst.PROCESS_DATA}`,
            params
        )
        // console.log('getMainboardList------------------------res', res)
        if (!res || res.code != 0) {
            return
        }
        const data = res.data
        return data;
    }

}

export default new MainboardStore()
