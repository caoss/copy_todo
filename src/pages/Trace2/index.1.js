/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import './index.scss'
import { Card, Button, Popconfirm, message,Modal, Checkbox, Row, Col,Icon } from 'antd'
import ModalCustomForm from '../../components/ModalCustomForm'
import ModalCustomTrace from '../../components/ModalCustomTrace'

import CustomTable from '../../components/CustomTable'

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    const self = this
    this.state = {
      mode: 0,
      pagination: {},
      pointList:[],
      data: {},
      visible:0,
      loading: false,
      selectValue: null,
      actTraceIndex:0,
      checkedTraces:[],
      disabledDel:true,
      detailList:[],
      pointType : [],
      pointID:null,
      columns_point: [
        {
          title: '轴名称',
          dataIndex: 'axisName'
        },
        {
          title: '位置',
          dataIndex: 'position'
        },
        {
          title: '操作',
          dataIndex: 'pointId',
          key: 'x',
          render: (id, row, index) => (
            <div>
              <Button
                type="primary"
                style={{ marginRight: '8px' }}
                onClick={() => {
                  self.setState({
                    data: row,
                    mode: 5
                  })
                }}
              >
                编辑
              </Button>

            </div>
          )
        }
      ],
      
      columns: [
        {
          title: '点位名称',
          dataIndex: 'pointName',
          render: (id, row, index) => (
            <div style={{cursor:"pointer",padding:'20px'}} onClick={self._getPointPosition.bind(self,row.id)}>
                {row.pointName}
            </div>
          )
        },
        {
            title: '点位类型',
            dataIndex: 'pointType',
            render: (id, row, index) => (
              <div>
                  { 
                      row.pointType==1?
                      "直线起点"
                      :
                      row.pointType==2?
                      "直线中间点"
                      :
                      row.pointType==3?
                      "直线终点"
                      :
                      row.pointType==4?
                      "引线"
                      :
                      row.pointType==5?
                      "圆弧起点"
                      :
                      row.pointType==6?
                      "圆弧中间点"
                      :
                      row.pointType==7?
                      "圆弧终点"
                      :
                      row.pointType==8?
                      "圆弧圆心"
                      :
                      ''
                      
                  }
              </div>
            )
          },
        {
          title: '出胶延时(s)',
          dataIndex: 'jetDelay'
        },
        {
          title: '抬针高度(mm,绝对值)',
          dataIndex: 'needleHeight'
        },
        
        {
          title: '速度(mm/s)',
          dataIndex: 'speed'
        },
        {
          title: '操作',
          dataIndex: 'pointId',
          key: 'x',
          render: (id, row, index) => (
            <div>

              <Popconfirm
                title="确定删除轴点位?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  // console.log('data, row, index', data, row, index)
                  self.handlers.removeAxisPoint([row])
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
                    row.pointId = row.pointId+'';
                  self.setState({
                    data: row,
                    mode2: 2,
                  })
                }}
              >
                编辑
              </Button>
                {/* 
                    圆心
                    圆弧中点
                */}
                {
                     row.pointType==8||row.pointType==6?
                     null
                     :
                    <Button
                        type="primary"
                        style={{ marginRight: '8px' }}
                        onClick={self._tracePointDebug.bind(self,row)}
                    >
                        示教
                    </Button>
                }

            </div>
          )
        }
      ],
      formData_p: [
        {
          type: 'number',
          label: '点位位置',
          valueKey: 'position',
          required: true
        }
      ],
      formData2: [
        {
          type: 'text',
          label: '轨迹名称',
          valueKey: 'traceName',
          required: true
        },
        {
          type: 'select',
          label: '胶阀信号',
          valueKey: 'glueOut',
          required: true,
          items:[],
        },
      ],
      formData3: [
        {
            type: 'select',
            label: '点位ID',
            valueKey: 'pointId',
            required: true,
            items:[],
          },
        {
            type: 'select',
            label: '点位类型',
            valueKey: 'pointType',
            required: true,
            items:[ 
                {
                    value: 1,
                    label: '直线起点',
                  },
                  {
                    value: 2,
                    label: '直线中间点',
                  },
                  {
                    value: 3,
                    label: '直线终点',
                  },
                //   {
                //     value: 4,
                //     label: '引线',
                //   },
                  {
                    value: 5,
                    label: '圆弧起点',
                  },
                  {
                    value: 6,
                    label: '圆弧中间点',
                  },
                  {
                    value: 7,
                    label: '圆弧终点',
                  },
                  {
                    value: 8,
                    label: '圆弧圆心',
                  }
            ],
          },
        {
          type: 'number',
          label: ' 抬针高度(mm,绝对值)',
          valueKey: 'needleHeight',
          required: true
        },
        {
          type: 'number',
          label: ' 出胶延时(s)',
          valueKey: 'jetDelay',
          required: true
        },
        {
          type: 'number',
          label: '速度(mm/s)',
          valueKey: 'speed',
          required: true
        },
      ],
    }
  }

  componentDidMount() {
      this.getTraceList();
      this._getPointList();
      this._getInList(2);

      this.getAxisList().then(()=>{
        const { mainboardStore } = this.props.store;
        mainboardStore.axisPortData['list'].map((item)=>{
            item.value =item.id;
            item.label = item.interfaceName;
        })
        let obj =   {
            type: 'select',
            label: '轴',
            valueKey: 'axisId',
            value: '',
            items: toJS( mainboardStore.axisPortData['list'] ) 
        }
        this.state.formData_p.unshift(obj);
        this.setState({
            formData_p:this.state.formData_p.concat([]),
        })
    });
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

  _traceDebug(){
        const { traceStore } = this.props.store
        const traceList = traceStore.traceList
        let traceId = traceList[this.state.actTraceIndex].id;
        traceStore._traceDebug({traceId}).then(res=>{
            console.log(res);
            if(res && res.message){
                message.success(res.message);
            }
        })
  }
  _tracePointDebug(row){
    const { traceStore } = this.props.store
    let {id} = row;
    traceStore._tracePointDebug({tracePointId:id}).then(res=>{
        console.log(res);
        if(res && res.message){
            message.success(res.message);
        }
    })
  }

  _getInList(type){
    const { mainboardStore } = this.props.store
    mainboardStore.getIOPortList({interfaceType:type}).then(res=>{
        let arr = [];
        if(res){
            arr = res.map(iterator => {
                return {
                    label: iterator.interfaceName,
                    value: iterator.id
                }
            }) 
        }
        console.log('22getIOPortList',arr);
        this.state.formData2[1].items = arr;
        this.setState({
            formData2:this.state.formData2.concat([])
        })
        // if(type  == 1){
        //     this.setState({
        //         inList:res 
        //     })
        // }else if(type == 2){ 
        //     this.setState({
        //         outList:res 
        //     })
        // }
    });
}
_getPointPosition(id){
    //查看点位
    const { mainboardStore } = this.props.store;
    this.state.pointID = id;
    mainboardStore.getPoint(id).then(res=>{
        console.log('res---',res.detailList);
        if(res && res.detailList){
            this.setState({
                pointList:res.detailList,
                visible:1
            })
        }
    })

}
  _getPointList(){
    const { mainboardStore } = this.props.store
    const softwareId = global.softwareId;
    mainboardStore.getPointList( { softwareId } ).then((res) => {
        console.log('res',res);
        let arr = JSON.parse(JSON.stringify(res).replace(/pointName/g, 'label')) 
        let arr2 = JSON.parse(JSON.stringify(arr).replace(/id/g, 'value')) 
        console.log(arr2);
        this.state.formData3[0].items = arr2;
        this.setState({
            formData3:this.state.formData3.concat([])
        })

    })
  }

  getTraceList(){
    const { traceStore } = this.props.store
    return new Promise(function (resolve, reject) {
        traceStore.getList().then(res=>{
            console.log(res);
            resolve(res)
        });
    });
  }


  _addAxis(){
    this.setState({
        mode2: 3, data: {} 
    })
    
  }

 
    onChange(id,e) {
        let checkedTraces = this.state.checkedTraces;
        if(e.target.checked){
            checkedTraces.push(id)
        }else{
            var index = checkedTraces.indexOf(id);
            if (index > -1) {
                checkedTraces.splice(index, 1);
            }
        }
        if(checkedTraces.length<=0){
            this.setState({
                disabledDel:true,
            })
        }else{
            this.setState({
                disabledDel:false,
                checkedTraces:checkedTraces
            })
        }
    }

    _changePoint(i){
        console.log(i);
        this.setState({
            actTraceIndex:i
        })
    }

    _delTraces(){
        let  checkedTraces  = this.state.checkedTraces;
        const { traceStore } = this.props.store;
        traceStore
        .removeTrace({idList:checkedTraces})
        .then(res => {
          if (res.code === '0') {
            message.success(res.message)
              this.getTraceList();
          } else {
            j(res)
          }
        })
        .catch(err => {
        })
    }

    _delTrace(idList){
        const { traceStore } = this.props.store;
        traceStore
        .removeTrace({idList})
        .then(res => {
          if (res.code === '0') {
            message.success(res.message)
            this.getTraceList();
          } else {
            j(res)
          }
        })
        .catch(err => {
        })
    }

  handlers = {
    onSubmit: (err, values) =>
    new Promise((r, j) => {
        const { mainboardStore,traceStore } = this.props.store
        const { mode,mode2, data } = this.state
          if (mode === 1) {
              console.log(values);
              //增加轨迹
              traceStore
              .createTrace({ ...values })
              .then(res => {
                if (res.code === '0') {
                    this.setState({ mode: 0 });
                    this.getTraceList();
                    r(res)
                //   eventBus.emit('onTableChange')
                } else {
                  j(res)
                }
              })
              .catch(err => {
                j(err)
              })
          }else if(mode == 5){
            let obj = Object.assign({},this.state.data,values);
            mainboardStore
              .editAxisPoint(obj)
              .then(res => {
                if (res.code === '0') {
                    this._getPointList();
                    this._getPointPosition(this.state.pointID);
                  r(res)
                //   eventBus.emit('onTableChange')
                } else {
                  j(res)
                }
              })
              .catch(err => {
                j(err)
              })
          }else if (mode === 4) {//编辑轨迹
            traceStore
              .editTrace(values,this.state.data.id)
              .then(res => {
                  console.log(res);
                if (res.code === '0') {
                    this.setState({ mode: 0 });
                    this.getTraceList();
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
          else if(mode2 == 3){
            const traceList = traceStore.traceList
            let traceId = traceList[this.state.actTraceIndex].id;
            console.log('traceID',values);
            traceStore
            .createPoint({ traceId,...values})
            .then(res => {
              if (res.code === '0') {
                  this.getTraceList();
                r(res)
              //   eventBus.emit('onTableChange')
              } else {
                j(res)
              }
            })
            .catch(err => {
              j(err)
            })


          }else if(mode2 == 2) {
            const traceList = traceStore.traceList
            let traceId = traceList[this.state.actTraceIndex].id;
            console.log('traceID',traceId);
            traceStore
            .editTracePoint(this.state.data.id,{traceId,...values})
            .then(res => {
              if (res.code === '0') {
                  this.getTraceList();
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
    removeAxisPoint: row => {
        console.log(row);
        let { traceId ,pointId,id } = row[0];
      const { traceStore } = this.props.store
      traceStore.removeAxisPoint( { "idList": [id]} ).then(res => {
        if (res.code === '0') {
          message.success(res.message)
          this.getTraceList();
        } else {
          message.error(res.message)
        }
      })
    },
    

    onTableChange: (page, params) => {
      const { mainboardStore } = this.props.store
      const { search = '', ...rest } = params
      const pagination = Object.assign({}, this.state.pagination, page)
      const axisId = this.state.selectValue ? this.state.selectValue[1] : null
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
      console.log('value----------------', value, selectedOptions)
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
 
  handles2={
    showModal : () => {
        this.setState({
          visible: true,
        });
      },
    
      handleOk : e => {
        console.log(e);
        this.setState({
          visible: false,
        });
      },
    
      handleCancel : e => {
        console.log(e);
        this.setState({
          visible: false,
        });
      }
  }

  render() {
      let self = this;
    const { mainboardStore,traceStore } = this.props.store
    const { formData, formData_p,formData3,formData2,columns, mode,mode2, data, pagination,disabledDel } = this.state
    const pointData = mainboardStore.pointData
    const traceList = traceStore.traceList
    const paginationData = Object.assign({}, pagination, {
      total: pointData[this.state.actTraceIndex]&& pointData[this.state.actTraceIndex]['detailList'] ? pointData[this.state.actTraceIndex]['detailList'].length:0,
      showSizeChanger: true
    })

    console.log( 'total',paginationData.total );

    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.selection = selectedRows
      }
    }
    return (
      <Card bordered={false} className="point-config">
        <Row type="flex">

          <Col span={6}>
            <div>
                <Button style={{ marginBottom: '16px',marginRight:'16px' }}  onClick={() => {
                    this.setState({ mode: 1, data: {} })
                  }} type="primary">增加轨迹</Button>

            <Popconfirm
                title="确定删除轨迹?"
                okText="Yes"
                cancelText="No"
                onConfirm={ this._delTraces.bind(this)}
              >
                <Button disabled={disabledDel} style={{ marginBottom: '16px' }} type="danger">删除轨迹</Button>
              </Popconfirm>
              
            </div>
            <h3 style={{ marginBottom: '16px',fontWeight:600 }}>
                轨迹列表
            </h3>
            <ul>
                {
                    traceList &&traceList.length>0?
                    traceList.map(function(item,i){
                        return(
                            <div key={item.id} style={{'dipplay':'block','padding':'10px'}} >
                                <Checkbox
                                    onChange={self.onChange.bind(self,item.id)}
                                ></Checkbox> 
                               
                                <span onClick={self._changePoint.bind(self,i)}  className={self.state.actTraceIndex==i?'point_li active':'point_li' } >
                                    { item.traceName }
                                </span> 
                               
                                <Icon style={{ 'cursor':'pointer' }} onClick={()=>{ 
                                    item.glueOut = item.glueOut-0;
                                    self.setState({ mode: 4, data:toJS(item )},()=>{
                                        console.log( self.state.data )
                                }) }} type="edit" />
                                
                                <Popconfirm
                                    title="确定删除按钮?"
                                    okText="Yes"
                                    cancelText="No"
                                    onConfirm={ self._delTrace.bind(self,[item.id])}
                                >
                                     <Icon style={{ 'cursor':'pointer','marginLeft':'20px','color':'red'  }} type="delete" />
                                </Popconfirm>
                            </div>
                        )
                    })
                    :
                    ''
                }
            </ul>
          </Col>

            <Col span={18}>
              <div style={{ paddingBottom: '24px' }}>
              <Button  onClick={this._traceDebug.bind(self)} style={{ marginRight: '16px' }} type="primary">示教</Button>
              <Button style={{ marginRight: '16px' }}  onClick={  this._addAxis.bind(this) } type="primary">增加点位</Button>
              </div>


              <CustomTable
                rowSelection={rowSelection}
                columns={columns}
                dataSource={ traceList[this.state.actTraceIndex] && traceList[this.state.actTraceIndex]['pointList'] }
                pagination={paginationData}
                onTableChange={this.handlers.onTableChange}
              />

            <Modal
                title="点位列表"
                visible={this.state.visible}
                onCancel={this.handles2.handleCancel.bind(this)}
                onOk={this.handles2.handleCancel.bind(this)}
                >
                <CustomTable
                    columns={this.state.columns_point}
                    dataSource={this.state.pointList}
                    pagination={paginationData}
                    onTableChange={this.handlers.onTableChange}
                />
            </Modal>

              <ModalCustomForm
                title="操作"
                visible={!!mode}
                destroyOnClose
                onCancel={() => {
                  this.setState({ mode: 0 })
                }}
                onSubmit={this.handlers.onSubmit}
                formData={ mode =='3'?formData3:mode==1||mode==4?formData2:mode==5?formData_p:formData3 }
                defaultData={data}
              />

              <ModalCustomTrace
                title="操作"
                visible={!!mode2}
                destroyOnClose
                onCancel={() => {
                  this.setState({ mode2: 0,data:{} })
                }}
                onSubmit={this.handlers.onSubmit}
                formData={ formData3 }
                defaultData={data}
              />
            </Col>

        </Row>
      </Card>
    )
  }
}
export default Index
