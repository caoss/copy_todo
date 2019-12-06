/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import './index.scss'
import { Card, Button, Popconfirm, message, Checkbox, Row, Col,Icon } from 'antd'
import ModalCustomForm from '../../components/ModalCustomForm'
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
      data: {},
      loading: false,
      selectValue: null,
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
                  // console.log('data, row, index', data, row, index)
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
                    console.log(row);
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
      formData: [
        {
          type: 'number',
          label: '点位位置',
          valueKey: 'position',
          required: true
        }
      ],
      formData3: [
        {
          type: 'text',
          label: '工位名称',
          valueKey: 'cubeName',
          required: true
        },
        {
          type: 'boolean',
          label: '使能',
          valueKey: 'enableFlag',
          required: true
        },
        {
          type: 'text',
          label: '备注',
          valueKey: 'remark',
        }
      ],
    }
  }

  componentDidMount() {
    this._getCubeList();
  }

    _getCubeList(){
        const { cubeStore } = this.props.store
        return new Promise(function (resolve, reject) {
            cubeStore.getList().then(res=>{
                resolve(res)
            });
        });
    }

  _addCube(){
    this.setState({
        mode: 3, data: {enableFlag:false} 
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
        const { mainboardStore,cubeStore } = this.props.store
        const { mode, data } = this.state
        const softwareId = global.softwareId;
        if(mode == 3){//增加工位
            values.enableFlag =(values.enableFlag?1:0);
            cubeStore
            .createCude(values)
            .then(res => {
              if (res.code === '0') {
                  this._getCubeList();
                r(res)
              } else {
                j(res)
              }
            })
            .catch(err => {
              j(err)
            })

          }else {
            values.enableFlag =(values.enableFlag?1:0);
            cubeStore
              .editCube(values,this.state.data.id)
              .then(res => {
                if (res.code === '0') {
                    this._getCubeList();
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
    removeCube: row => {
        let id = row[0]['id'];
      const { cubeStore } = this.props.store
      cubeStore.removeCube({ idList:[id]}).then(res => {
        if (res.code === '0') {
          message.success(res.message)
          this._getCubeList();
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
    const { cubeStore } = this.props.store
    const { formData, formData3,formData2,columns, mode, data} = this.state

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.selection = selectedRows
      }
    }

    return (
      <Card bordered={false} className="point-config">
        <Row type="flex">
            <Col span={24}>
              <div style={{ paddingBottom: '24px' }}>
              <Button style={{ marginRight: '16px' }}  onClick={  this._addCube.bind(this) } type="primary">增加工位</Button>
              </div>

              <CustomTable
                rowSelection={rowSelection}
                columns={columns}
                dataSource={ cubeStore['cubeList'] }
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
