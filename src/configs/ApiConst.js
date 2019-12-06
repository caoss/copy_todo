/**
 * @author YM
 */
const ApiConst = {
  // 版本管理
  VERSION_LIST: 'software/page',
  VERSION_CREATE: 'software',
  VERSION_DELETE: 'software',
  VERSION_EDIT: 'software',
  // 模组管理
  MODULE_LIST: 'moduleGroup/list',
  MODULE_CREATE: 'moduleGroup',
  MODULE_DELETE: 'moduleGroup',
  MODULE_EDIT: 'moduleGroup',
  // 硬件管理
  HARDWARE_LIST: 'hardware/page',
  HARDWARE_CREATE: 'hardware',
  HARDWARE_DELETE: 'hardware',
  HARDWARE_EDIT: 'hardware',
  // 主卡管理
  MAINBOARD_LIST: 'cardConf/list',
  MAINBOARD_CREATE: 'cardConf',
  MAINBOARD_DELETE: 'cardConf',
  MAINBOARD_EDIT: 'cardConf',
  // 主卡管理
  PORT_LIST: 'infSetting/list',
  PORT_CREATE: 'infSetting',
  PORT_DELETE: 'infSetting',
  PORT_EDIT: 'infSetting',
  // 参数管理
  PARAMS_LIST: 'paramConf/page',
  PARAMS_CREATE: 'paramConf',
  PARAMS_DELETE: 'paramConf',
  PARAMS_EDIT: 'paramConf',
  // 轴口参数管理
  AXIS_PARAMS: 'axisSetting',
  AXIS_CREATE: 'axisSetting',
  // 点位管理
  AXISPOINT_LIST: 'axisPoint/list',
  AXISPOINT_CREATE: 'axisPoint',
  AXISPOINT_DELETE: 'axisPoint',
  AXISPOINT_EDIT: 'axisPoint',
  // 点位管理
  BUTTON_LIST: 'button/list',
  BUTTON_CREATE: 'button',
  BUTTON_DELETE: 'button',
  BUTTON_EDIT: 'button',

    //轴点位管理
    AXIS_POINT_LIST:'point/detail/list',
    POINT_DETAIL:'point/detail',

  //流程
  STEP_CONFIG:'stepConf',//CDUR动作
  STEP_LIST:'stepConf/list',//动作列表
  CRITERIA_CONFIG:'stepConf/criteria',//动作条件
  CRITERIA_LIST:'stepConf/criteria/list',//动作条件列表

  AXIS_INFO:'axisSetting',
  
   AXIS_MSG:'dashboard/axisInfo',
   IO_MSG:'dashboard/infInfo',

    // 引擎
   ENGINE_CLOSE:'engine/close',
   ENGINE_REFRESH:'engine/refresh',
   ENGINE_START:'engine/start',
   ENGINE_STATUS:'engine/status',

    AXIS_JK:'dashboard/axisInfo',
    
    
    
    AXIS_MOVE_REL:'debug/axisMoveRel',
    AXIS_JOG:'debug/axisJog',
    AXIS_MOVE:'debug/axisMove',
    AXIS_MOVE_ABS:'debug/axisMoveAbs',
    AXIS_STOP:'debug/axisStop',
    AXIS_GO_HOME:'debug/axisGoHome',


    I_INVERT:'infSetting/setInvert',
    O_INVERT:'debug/setOut',
    AXIS_LIST:'axisSetting/list',
    AXIS_TEACH:'debug/axisTeach',
    BUG_STEP_CONFIG:'debug/stepDebug',


    WORK_MODE_TOGGLE:'debug/workModeToggle',
    WORK_FLOW_TRIGGER:'debug/workflowTrigger',
    SET_ENABLE:'stepConf/setEnable',

    //工位管理
    CUBE:'cube',
    CUBE_LIST:'cube/list',
    
    //料号管理
    PRODUCT:'product',
    PRODUCT_LIST:'product/list',

    //模组管理
    MODULE_GROUP:'moduleGroup',
    MODULE_GROUP_LIST:'moduleGroup/list',

    //
    PART_LIST:'part/list',
    PART:'part',

    //ccd
    CCD_GET:'ccd/getCCDRecv',
    CCD_SEND:'ccd/send2CCD',
    CCD_START:'ccd/startCCDClient',
    CCD_DEL:'ccd/clearCCDRecv',

    //
     MODULE_GP:'moduleGroup/detail/',

     //
     CYLINEDER_MOVE:'debug/cylinderMove',
     VACUUM_OP :'debug/vacuumOp',

    //  POST /debug/buttonMock
    BUTTON_MOCK:'debug/buttonMock',
    CUR_STOP:'debug/emergency',

    //动作排序
    STEP_CONF:'stepConf/reorder',

    //轨迹    
    TRACE:'trace',
    TRACE_LIST:'trace/list',
    TRACE_POINT:'trace/point',

    //工艺参数
    ADJUST:'processing/adjust',
    TRACE_DEBUG:'debug/traceDebug',
    TRACE_POINT_DEBUG:'debug/tracePointDebug',
    //日志
    STEP_LOGS:'stepLog/page',

    PROCESS_DATA:'processing'

}

export default ApiConst
