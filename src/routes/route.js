/**
 * @author YM
 */
/**
 * 路由组件出口文件
 */
// import { app } from 'electron'
import LoadableComponent from '../components/LoadableComponent'

const NotFound = LoadableComponent(() => import('../pages/NotFound/index')) // 参数一定要是函数，否则不会懒加载，只会代码拆分
const Index = LoadableComponent(() => import('../pages/Index/index'))
const Login = LoadableComponent(() => import('../pages/Login/index'))
const ModuleDesign = LoadableComponent(() =>
  import('../pages/ModuleDesign/index')
)
const WorkflowDesign = LoadableComponent(() =>
  import('../pages/WorkflowDesign/index')
)
const WorkflowDesign2 = LoadableComponent(() =>
  import('../pages/WorkflowDesign2/index')
)
const ActionflowDesign = LoadableComponent(() =>
  import('../pages/ActionflowDesign/index')
)
const ActionDesign = LoadableComponent(() =>
  import('../pages/ActionDesign/index')
)
const Schedule = LoadableComponent(() =>
  import('../pages/plan/schedule')
)

const AxisInfo = LoadableComponent(() =>
  import('../pages/AxisInfo')
)
const Part = LoadableComponent(() =>
  import('../pages/Part')
)
const Cube = LoadableComponent(() =>
  import('../pages/Cube')
)
const WorkLogs = LoadableComponent(() =>
  import('../pages/WorkLogs')
)
const ModuleGroup = LoadableComponent(() =>
  import('../pages/ModuleGroup')
)
const Product = LoadableComponent(() =>
  import('../pages/Product')
)

const AxisHander = LoadableComponent(() =>
  import('../pages/AxisHander')
)
const AxisOne = LoadableComponent(() =>
  import('../pages/AxisOne')
)
const CCDPage = LoadableComponent(() =>
  import('../pages/CcdPage')
)
const Craft = LoadableComponent(() =>
  import('../pages/Craft')
)
const MGDebug = LoadableComponent(() =>
  import('../pages/MGDebug')
)

const IOInfo = LoadableComponent(() =>
  import('../pages/IoInfo')
)
const IOInfo2 = LoadableComponent(() =>
  import('../pages/IoInfo2')
)

const Mainboard = LoadableComponent(() => import('../pages/Mainboard/index'))

const Hardware = LoadableComponent(() =>
  import('../pages/Basic/Hardware/index')
)
const Instruction = LoadableComponent(() =>
  import('../pages/Basic/Instruction/index')
)
const Module = LoadableComponent(() => import('../pages/Basic/Module/index'))

const Version = LoadableComponent(() =>
import('../pages/Software/Version/index')
)

const ButtonConfig = LoadableComponent(() =>
import('../pages/Mainboard/components/ButtonConfig')
)
const PointConfig = LoadableComponent(() =>
import('../pages/Mainboard/components/PointConfig')
)
const TraceConfig = LoadableComponent(() =>
import('../pages/Trace')
)
const TraceConfig2 = LoadableComponent(() =>
import('../pages/Trace2')
)
const AxisParms = LoadableComponent(() =>
import('../pages/AxisParms')
)
const ParamsConfig = LoadableComponent(() =>
import('../pages/Mainboard/components/ParamsConfig')
)

const DxfUp = LoadableComponent(() =>
import('../pages/DxfUp')
)

const Home = LoadableComponent(() => import('../pages/Home/index'))
const User = LoadableComponent(() => import('../pages/Home/User/index'))
const Setting = LoadableComponent(() => import('../pages/Home/Setting/index'))

export default {
  menus: [
    // 菜单相关路由
    {
      title: '软件管理',
      icon: 'project',
      key: '/app/software',
      subs: [
        {
          key: '/app/software/version',
          title: '版本管理',
          component: Version
        }
      ]
    },
    {
      title: '基础管理',
      icon: 'appstore',
      key: '/app/basic',
      subs: [
        {
          key: '/app/basic/hardward',
          title: '硬件列表',
          component: Hardware
        }
        // {
        //   key: '/app/basic/instruction',
        //   title: '指令列表',
        //   component: Instruction
        // }
        // {
        //   key: '/app/basic/module/:id',
        //   title: '模组管理',
        //   component: Module
        // }
      ]
    },
    {
      title: '开发计划',
      icon: 'appstore',
      key: '/app/plan',
      subs: [
        {
          key: '/app/plan/schedule',
          title: '排程',
          component: Schedule
        }
      ]
    },
    {//  { key: '/mainboard', title: '主板管理', component: Mainboard },
      title: '主板管理',
      icon: 'appstore',
      key: '/mainboard',
      subs: [
        {
          key: '/app/mainboard/index',
          title: '主板管理1',
          component: Mainboard
        }
      ]
    },
    {//  { key: '/mainboard', title: '主板管理', component: Mainboard },
      title: '工位管理',
      icon: 'appstore',
      key: '/cube',
      subs: [
        {
          key: '/app/Cube/index',
          title: '工位管理1',
          component: Cube
        }
      ]
    },
    {//  { key: '/mainboard', title: '主板管理', component: Mainboard },
      title: '工作日志',
      icon: 'appstore',
      key: '/worklogs',
      subs: [
        {
          key: '/app/worklogs/index',
          title: '工作日志',
          component:WorkLogs
        }
      ]
    },
    {//  { key: '/mainboard', title: '主板管理', component: Mainboard },
      title: '料号管理',
      icon: 'appstore',
      key: '/product',
      subs: [
        {
          key: '/app/product/index',
          title: '工位管理1',
          component: Product
        }
      ]
    },
    {//  { key: '/mainboard', title: '主板管理', component: Mainboard },
      title: '模组管理',
      icon: 'appstore',
      key: '/modulegroup',
      subs: [
        {
          key: '/app/moduleGroup/index',
          title: '模组管理1',
          component: ModuleGroup
        }
      ]
    },
    {//  { key: '/mainboard', title: '主板管理', component: Mainboard },
      title: '部件管理',
      icon: 'appstore',
      key: '/part',
      subs: [
        {
          key: '/app/part/index',
          title: '部件管理1',
          component: Part
        }
      ]
    },
    {// { key: '/workflow', title: '流程设计', component: WorkflowDesign },
      title: '流程设计',
      icon: 'appstore',
      key: '/workflow',
      subs: [
        {
          key: '/app/workflow/index',
          title: '流程设计1',
          component: WorkflowDesign
        }
      ]
    },
    {// { key: '/workflow', title: '流程设计', component: WorkflowDesign },
      title: '按钮设计',
      icon: 'appstore',
      key: '/button',
      subs: [
        {
          key: '/app/button/index',
          title: '流程设计1',
          component: ButtonConfig
        }
      ]
    },
    {// { key: '/workflow', title: '流程设计', component: WorkflowDesign },
      title: '点位设计',
      icon: 'appstore',
      key: '/point',
      subs: [
        {
          key: '/app/point/index',
          title: '点位设计',
          component: PointConfig
        }
      ]
    },
    {// { key: '/workflow', title: '流程设计', component: WorkflowDesign },
      title: '参数配置',
      icon: 'appstore',
      key: '/params',
      subs: [
        {
          key: '/app/params/index',
          title: '点位设计',
          component: ParamsConfig
        }
      ]
    },
    {
      title: '轴监控',
      icon: 'appstore',
      key: '/axisinfo',
      subs: [
        {
          key: '/app/axisinfo/index',
          title: '轴监控',
          component: AxisInfo
        }
      ]
    },
    {
      title: 'IO监控',
      icon: 'appstore',
      key: '/axisinfo',
      subs: [
        {
          key: '/app/ioinfo/index',
          title: 'IO监控',
          component: IOInfo
        }
      ]
    },
    {
      title: 'IO监控2',
      icon: 'appstore2',
      key: '/axisinfo2',
      subs: [
        {
          key: '/app/ioinfo2/index',
          title: 'IO监控2',
          component: IOInfo2
        }
      ]
    },
    {
      title: '工艺头条',
      icon: 'craft',
      key: '/craft',
      subs: [
        {
          key: '/app/craft/index',
          title: '工艺头条',
          component: Craft
        }
      ]
    },
    {
      title: '轴手动',
      icon: 'appstore',
      key: '/axishander',
      subs: [
        {
          key: '/app/axishander/index',
          title: '轴手动',
          component: AxisHander
        }
      ]
    },
    {
      title: '轴单步',
      icon: 'appstore',
      key: '/axisOne',
      subs: [
        {
          key: '/app/axisOne/index',
          title: '轴手动',
          component: AxisOne
        }
      ]
    },
    {
      title: '模组调试',
      icon: 'appstore',
      key: '/MGDebug',
      subs: [
        {
          key: '/app/MGDebug/index',
          title: '轴手动',
          component: MGDebug
        }
      ]
    },
    {
      title: 'CCD调试',
      icon: 'appstore',
      key: '/ccd',
      subs: [
        {
          key: '/app/ccdPage/index',
          title: 'CCD调试',
          component: CCDPage
        }
      ]
    },
    {
      title: '轨迹',
      icon: 'appstore',
      key: '/trace',
      subs: [
        {
          key: '/app/trace/index',
          title: '轨迹',
          component: TraceConfig
        }
      ]
    },
    {
      title: '轨迹2',
      icon: 'appstore',
      key: '/trace2',
      subs: [
        {
          key: '/app/trace2/index',
          title: '轨迹2',
          component: TraceConfig2
        }
      ]
    },
    {
      title: 'axisparms',
      icon: 'appstore',
      key: '/trace2',
      subs: [
        {
          key: '/app/axisParms/index',
          title: '轴配置',
          component: AxisParms
        }
      ]
    },
    {
      title: 'dxf_upload',
      icon: 'appstore',
      key: '/dxf_upload',
      subs: [
        {
          key: '/app/dxf/index',
          title: 'DXF',
          component: DxfUp
        }
      ]
    },
   
  ],
  others: [
    // 非菜单相关路由
    {
      key: '/app/basic/module/:id',
      title: '模组管理',
      component: Module
    },
    {
      key: '/app/home',
      title: '首页',
      subs: [
        {
          key: '/app/home/index',
          title: '首页',
          component: Home
        },
        {
          key: '/app/home/user',
          title: '个人中心',
          component: User
        },
        {
          key: '/app/home/setting',
          title: '用户设置',
          component: Setting
        }
      ]
    }
  ]
}

const firstRoutesConfig = [
  { key: '/module-design', title: '拓扑设计', component: ModuleDesign },
  { key: '/workflow', title: '流程设计', component: WorkflowDesign },
  { key: '/workflow2', title: '流程设计2', component: WorkflowDesign2},
  { key: '/actionflow', title: '动作设计', component: ActionflowDesign },
  { key: '/mainboard', title: '主板管理', component: Mainboard },
  { key: '/action', title: '动作设计', component: ActionDesign },
  { key: '/login', title: '登陆', component: Login, noAuth: true },
  { key: '/app', title: '共性软件平台', component: Index },
  { key: '/404', title: '404', component: NotFound, noAuth: true }
]

export { firstRoutesConfig }
