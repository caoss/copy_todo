/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import './index.scss'
import { Card, Button, Popconfirm, message, Checkbox, Row, Col,Tabs } from 'antd'
import ModalCustomForm from '../../components/ModalCustomForm'

import AxisOne from "../AxisOne"
import AxisHander from "../AxisHander"

import OutList from "./components/OutList"
import PartList from "./components/PartList"

const { TabPane } = Tabs;

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    const self = this
    this.state = {
      mode: 0,
      pagination: {},
      data: {},
      loading: false,
      selectMG: null,
      selectMGInfo:{},
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          isLeaf: false
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          isLeaf: false
        }
      ],
      columns: [
        {
          title: '工位名称',
          dataIndex: 'cubeName'
        },
        {
          title: ' 使能标识',
          dataIndex: 'enableFlag',
          render:(id,row)=>(
              <div>
                  { row.enableFlag=='1'?'是':'否' }
              </div>
          )
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'pointId',
          key: 'x',
          render: (id, row, index) => (
            <div>

              <Popconfirm
                title="确定删除工位?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  self.handlers.removeCube([row])
                }}
              >
                <Button type="danger" style={{ marginRight: '8px' }}>
                  删除
                </Button>
              </Popconfirm>

              <Button
                type="primary"
                style={{ marginRight: '8px' }}
                onClick={() => {
                    row.enableFlag = row.enableFlag?true:false
                  self.setState({
                    data: row,
                    mode: 2
                  })
                }}
              >
                编辑
              </Button>

            </div>
          )
        }
      ],
      formData3: [
        {
          type: 'text',
          label: '模组名称',
          valueKey: 'mgName',
          required: true
        },
        {
          type: 'select',
          label: '模组类型',
          valueKey: 'mgType',
          required: true,
          items:[ 
                { label:'工位内部模组' ,value:1 },
                { label:'多工位协同模组' ,value:2 },
                { label:'全局协同模组' ,value:3 },
            ],
        },
        {
          type: 'text',
          label: '备注',
          valueKey: 'remark',
          required: true
        }
      ],
    }
  }

  componentDidMount() {
    this._getModuleGroupList().then(res=>{
        this._changeMG(res[0]['id']);
    });
  }

  _getModuleGroupList(){
        const { moduleGroupStore } = this.props.store
        return new Promise(function (resolve, reject) {
            moduleGroupStore.getList().then(res=>{
                resolve(res)
            });
        });
    }

  _addCube(){
    this.setState({
        mode: 3, data: {enableFlag:false} 
    })
    
  }

    callback(key) {
        this.setState({
            currentkey:key
        })
    }
    //获取轴列表interfaceType5
    getAxisList(){
        const { mainboardStore } = this.props.store
        const softwareId = global.softwareId;
        return new Promise(function (resolve, reject) {
            mainboardStore.getAxisPortList({ softwareId,interfaceType:5 }).then(res=>{
                resolve(res)
            });
        });
    }


  _getPointList(){
  }

    onChange(id,e) {
        let checkedPoints = this.state.checkedPoints;
        if(e.target.checked){
            checkedPoints.push(id)
        }else{
            var index = checkedPoints.indexOf(id);
            if (index > -1) {
                checkedPoints.splice(index, 1);
            }
        }
        if(checkedPoints.length<=0){
            this.setState({
                disabledDel:true,
            })
        }else{
            this.setState({
                disabledDel:false,
                checkedPoints:checkedPoints
            })
        }
    }

  handlers = {
    onSubmit: (err, values) =>
    new Promise((r, j) => {
        const { moduleGroupStore,cubeStore } = this.props.store
        const { mode, data } = this.state
        if(mode == 3){//增加工位
            moduleGroupStore
            .createMG(values)
            .then(res => {
              if (res.code === '0') {
                  this._getModuleGroupList();
                r(res)
              } else {
                j(res)
              }
            })
            .catch(err => {
              j(err)
            })

          }else {
            cubeStore
              .editCube(values,this.state.data.id)
              .then(res => {
                if (res.code === '0') {
                    this._getModuleGroupList();
                  r(res)
                //   eventBus.emit('onTableChange')
                } else {
                  j(res)
                }
              })
              .catch(err => {
                j(err)
              })
          }
    }),
    removeMG: row => {
        let id =row.id;
      const { moduleGroupStore } = this.props.store
      moduleGroupStore.removeMG({ idList:[id]}).then(res => {
        if (res.code === '0') {
        this._getModuleGroupList();
          message.success(res.message)
        } else {
          message.error(res.message)
        }
      })
    },

    onTableChange: (page, params) => {
      const { mainboardStore } = this.props.store
      const { search = '', ...rest } = params
      const pagination = Object.assign({}, this.state.pagination, page)
      this.setState({ pagination })
      return new Promise((r, j) => {
        mainboardStore
          .getAxisPointList({
            ...rest,
            axisId,
            pageNum: pagination.current,
            pageSize: pagination.pageSize ? pagination.pageSize : 10
          })
          .then(res => {
            r(res)
          })
          .catch(err => {
            j(err)
          })
      })
    },
    onSelectChange: (value, selectedOptions) => {
      // this.state.selectValue = value
      this.setState(
        {
          selectValue: value
        },
        () => {
          eventBus.emit('onTableChange')
        }
      )
    }
  }
 

  //根据ID获取详情
  _getMGDetail(id){
    const { moduleGroupStore } = this.props.store
        moduleGroupStore.getMGMsg(id).then(res=>{
        console.log('----------------------------MSSS',res);
            this.setState({
                selectMGInfo:res
            })
        });
  }

  _changeMG(id){
      //获取详情传过去
      this.setState({
          selectMG:id
        },()=>{
            this._getMGDetail(id);
      })
  }


  render() {
    let self = this;
    const { cubeStore,moduleGroupStore } = this.props.store
    const { formData, formData3,formData2,columns, mode, data,selectMG,selectMGInfo,currentkey} = this.state
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.selection = selectedRows
      }
    }

    return (
      <Card bordered={false} className="point-config">
        <Row type="flex">
            
            <Col span={4}>
                <div style={{ paddingBottom: '24px',fontSize:'30px' }}>
                    模组列表
                </div>
                <div style={{ paddingBottom: '24px' }}>
                    {
                        moduleGroupStore['modeleList'] &&  moduleGroupStore['modeleList'].length>0?
                        moduleGroupStore['modeleList'].map((item,i)=>{
                                return(
                                    <div className={ !selectMG?(!i?'selMg':null):(selectMG==item.id)?'selMg':null } style={{ marginBottom:'20px',cursor:'pointer' }}>
                                        <b  onClick={this._changeMG.bind(this,item.id)} >{item.mgName}</b>
                                    </div>
                                )
                            })
                        :
                        null

                    }
                </div>
            </Col> 

            <Col span={20}>
                <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                    <TabPane tab="轴单步" key="1">
                        <AxisOne  data={ selectMGInfo } id={selectMG} />
                    </TabPane>
                    <TabPane tab="轴手动" key="3">
                        <AxisHander  data={ selectMGInfo } id={selectMG} />
                    </TabPane>
                    <TabPane tab="输出口" key="2">
                        <OutList data={ selectMGInfo } id={selectMG} />
                    </TabPane>
                    <TabPane tab="部件" key="4">
                        <PartList data={ selectMGInfo } id={selectMG} />
                    </TabPane>
                </Tabs>

              <ModalCustomForm
                title="操作"
                visible={!!mode}
                destroyOnClose
                onCancel={() => {
                  this.setState({ mode: 0 })
                }}
                onSubmit={this.handlers.onSubmit}
                formData={ mode =='3'||mode =='2'?formData3:mode==1||mode==4?formData2:formData }
                defaultData={data}
              />
            </Col>
        </Row>
      </Card>
    )
  }
}
export default Index
