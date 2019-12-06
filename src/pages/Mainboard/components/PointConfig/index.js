/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import './index.scss'
import { Card, Button, Popconfirm, message, Checkbox, Row, Col,Icon } from 'antd'
import ModalCustomForm from '../../../../components/ModalCustomForm'
import CustomTable from '../../../../components/CustomTable'

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
      selectValue: null,
      actPointIndex:0,
      checkedPoints:[],
      disabledDel:true,
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
      formData: [
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
          label: '点位名称',
          valueKey: 'pointName',
          required: true
        },
      ],
      formData3: [
        {
          type: 'number',
          label: '点位位置',
          valueKey: 'position',
          required: true
        }
      ],
    }
  }

  componentDidMount() {
    this._getMainboardList();
    this._getPointList();
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
        this.state.formData3.unshift(obj);
        this.state.formData.unshift(obj);
        this.setState({
            formData3:this.state.formData3.concat([]),
            formData:this.state.formData.concat([]),
        })
    });
    
  }
  _addAxis(){
    this.setState({
        mode: 3, data: {} 
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
    const { mainboardStore } = this.props.store
    const softwareId = global.softwareId;
    mainboardStore.getPointList( { softwareId } ).then(() => {
    })
  }

  _getMainboardList() {
    const { mainboardStore } = this.props.store
    const softwareId = global.softwareId;
    mainboardStore.getMainboardList({ softwareId }).then(() => {
      const list = mainboardStore.mainboardData.list
      const data = []
      for (const r of list) {
        console.log('r------------------', r)
        data.push({
          value: r.id,
          label: r.remark,
          isLeaf: false
        })
      }

      this.setState({
        options: data
      })
    })
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

    _changePoint(i){
        console.log(i);
        this.setState({
            actPointIndex:i
        })
    }

    _delPoints(){
        let  checkedPoints  = this.state.checkedPoints;
        const { mainboardStore } = this.props.store;
        mainboardStore
        .delPoints(checkedPoints)
        .then(res => {
          if (res.code === '0') {
            message.success(res.message)
              this._getPointList();
          } else {
            j(res)
          }
        })
        .catch(err => {
        })
    }
    _delPoint(idList){
        const { mainboardStore } = this.props.store;
        mainboardStore
        .delPoints(idList)
        .then(res => {
          if (res.code === '0') {
            message.success(res.message)
              this._getPointList();
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
        const { mainboardStore } = this.props.store
        const { mode, data } = this.state
        const softwareId = global.softwareId;
          if (mode === 1) {
            mainboardStore
              .addPoint({ softwareId,...values })
              .then(res => {
                if (res.code === '0') {
                    this.setState({ mode: 0 });
                    this._getPointList();
                    r(res)
                //   eventBus.emit('onTableChange')
                } else {
                  j(res)
                }
              })
              .catch(err => {
                j(err)
              })
          }else if (mode === 4) {
            mainboardStore
              .editPoint({ softwareId,id:this.state.data.id,...values })
              .then(res => {
                if (res.code === '0') {
                    this.setState({ mode: 0 });
                    this._getPointList();
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
          else if(mode == 3){
            const pointData = mainboardStore.pointData;
            let pointId = '';
            if(pointData[this.state.actPointIndex]){
                pointId =pointData[this.state.actPointIndex]['id'];
            }
            let obj = Object.assign({},{ pointId },values);
            console.log(obj);
            mainboardStore
            .createAxisPoint(obj)
            .then(res => {
              if (res.code === '0') {
                  this._getPointList();
                r(res)
              //   eventBus.emit('onTableChange')
              } else {
                j(res)
              }
            })
            .catch(err => {
              j(err)
            })


          }else {
            let obj = Object.assign({},this.state.data,values);
            mainboardStore
              .editAxisPoint(obj)
              .then(res => {
                if (res.code === '0') {
                    this._getPointList();
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
        let { axisId,pointId } = row[0];
      const { mainboardStore } = this.props.store
      mainboardStore.removeAxisPoint({ axisId,pointId }).then(res => {
        if (res.code === '0') {
          message.success(res.message)
          this._getPointList();
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
    loadData: selectedOptions => {
      console.log('los----------', selectedOptions)
      const { mainboardStore } = this.props.store
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      mainboardStore
        .getAxisPortList({
          cardId: targetOption.value,
          interfaceType: 5
        })
        .then(() => {
          targetOption.loading = false
          const axisPortData = mainboardStore.axisPortData
          for (const r of axisPortData.list) {
            if (!targetOption.children) {
              targetOption.children = []
            }
            targetOption.children.push({
              label: r.interfaceName,
              value: r.id
            })
          }
          this.setState({
            options: [...this.state.options]
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
 

  render() {
      let self = this;
    const { mainboardStore } = this.props.store
    const { formData, formData3,formData2,columns, mode, data, pagination,disabledDel } = this.state
    const axisPointData = mainboardStore.axisPointData
    const pointData = mainboardStore.pointData
    const paginationData = Object.assign({}, pagination, {
      total: pointData[this.state.actPointIndex]&& pointData[this.state.actPointIndex]['detailList'] ? pointData[this.state.actPointIndex]['detailList'].length:0,
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
                  }} type="primary">增加点位</Button>

            <Popconfirm
                title="确定删除轴点位?"
                okText="Yes"
                cancelText="No"
                onConfirm={ this._delPoints.bind(this)}
              >
                <Button disabled={disabledDel} style={{ marginBottom: '16px' }} type="danger">删除点位</Button>
              </Popconfirm>
              
            </div>
            <h3 style={{ marginBottom: '16px',fontWeight:600 }}>
                点位列表
            </h3>
            <ul>
                {
                    pointData &&pointData.length>0?
                    pointData.map(function(item,i){
                        return(
                            <div key={item.id} style={{'dipplay':'block','padding':'10px'}} >
                                <Checkbox
                                    onChange={self.onChange.bind(self,item.id)}
                                ></Checkbox> 
                                <span onClick={self._changePoint.bind(self,i)}  className={self.state.actPointIndex==i?'point_li active':'point_li' } >{ item.pointName }</span> 
                                <Icon style={{ 'cursor':'pointer' }} onClick={()=>{ self.setState({ mode: 4, data:item }) }} type="edit" />
                                <Popconfirm
                                    title="确定删除按钮?"
                                    okText="Yes"
                                    cancelText="No"
                                    onConfirm={ self._delPoint.bind(self,[item.id])}
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
              <Button style={{ marginRight: '16px' }}  onClick={  this._addAxis.bind(this) } type="primary">增加轴点位</Button>
              </div>


              <CustomTable
                rowSelection={rowSelection}
                columns={columns}
                dataSource={ pointData[this.state.actPointIndex] && pointData[this.state.actPointIndex]['detailList'] }
                pagination={paginationData}
                onTableChange={this.handlers.onTableChange}
              />

              <ModalCustomForm
                title="操作"
                visible={!!mode}
                destroyOnClose
                onCancel={() => {
                  this.setState({ mode: 0 })
                }}
                onSubmit={this.handlers.onSubmit}
                formData={ mode =='3'?formData3:mode==1||mode==4?formData2:formData }
                defaultData={data}
              />
            </Col>
        </Row>
      </Card>
    )
  }
}
export default Index
