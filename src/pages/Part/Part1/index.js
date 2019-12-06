/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { toJS } from 'mobx'
import './index.scss'
import { Card, Button, Popconfirm, message, Checkbox, Row, Col,Icon } from 'antd'
import ModalCustomForm from '../../../components/ModalCustomForm'
import CustomTable from '../../../components/CustomTable'

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
      columns: [
        {
          title: '部件名称',
          dataIndex: 'partName'
        },
        {
          title: '部件参数',
          dataIndex: 'partParams'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          key: 'x',
          render: (id, row, index) => (
            <div>

              <Popconfirm
                title="确定删除工位?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => {
                  // console.log('data, row, index', data, row, index)
                  self.handlers.removePart([row])
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
                    self._setParams();
                    let { partName,partType=1,remark,id  }  = row;
                    let { mpIn,opIn,out1,out2 } = JSON.parse( row.partParams );
                    let obj = { partName,partType,remark,mpIn,opIn,out1,out2,id };
                    self.setState({
                        data: obj,
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
          type: 'text',
          label: '部件名称',
          valueKey: 'partName',
          required: true
        },
          {
            type: 'text',
            label: '备注',
            valueKey: 'remark',
          },
          {
            type: 'select',
            label: '原点信号',
            valueKey: 'opIn',
            required: true,
          },
          {
            type: 'select',
            label: '动点信号',
            valueKey: 'mpIn',
            required: true,
          },
          {
            type: 'select',
            label: '电磁阀信号1',
            valueKey: 'out1',
          },
          {
            type: 'select',
            label: '电磁阀信号2',
            valueKey: 'out2',
          },
      ],
    }
  }

  componentDidMount() {
  }

  _setParams(){
    let {inList,outList} = this.props;
    let formData = this.state.formData;
    let items = [];
    let items2 = [];
    inList.forEach(element => {
        items.push({ 
            value:element.id,  
            label:element.interfaceName 
        })
    });
    outList.forEach(element => {
        items2.push({ 
            value:element.id,  
            label:element.interfaceName 
        })
    });
    formData[2].items = items;
    formData[3].items = items;
    formData[4].items = items2;
    formData[5].items = items2;
  }
  
    _editPart(row){
        let self = this;
        self._setParams();
        let { partName,partType=1,remark,id  }  = row;
        let { mpIn,opIn,out1,out2 } = JSON.parse( row.partParams );
        let obj = { partName,partType,remark,mpIn,opIn,out1,out2,id };
        self.setState({
            data: obj,
            mode: 2
        })
    }

  _addCube(){
      this._setParams();
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
    onSubmit: (err, values) =>{
        const { partStore } = this.props.store
        const { mode } = this.state
        if(mode == 3){
            if(values.out1 || values.out2){
                let { partName,partType=1,remark,mpIn,opIn,out1,out2 } = values;
                let obj = {  partName,partType,remark };
                obj.partParams =  JSON.stringify( {mpIn,opIn,out1,out2} );
                return new Promise((r, j) => {
                    partStore. createPart(obj).then(res => {
                        if (res.code === '0') {
                            this.props._callback();
                          r(res)
                        } else {
                          j(res)
                        }
                      })
                      .catch(err => {
                        j(err)
                      })
                })
            }else{
                return new Promise((r, j) => {
                    j({code:-1,message:'电磁阀信号1,电磁阀信号1,必须选择一个'});
                    r({code:-1,message:'123'});
                })
            }
        }else{
            if(values.out1 || values.out2){
                let { partName,partType=1,remark,mpIn,opIn,out1,out2 } = values;
                let obj = {  partName,partType,remark };
                obj.partParams =  JSON.stringify( {mpIn,opIn,out1,out2} );
                return new Promise((r, j) => {
                    partStore. editPart(obj,this.state.data.id).then(res => {
                        if (res.code === '0') {
                            this.props._callback();
                          r(res)
                        } else {
                          j(res)
                        }
                      })
                      .catch(err => {
                        j(err)
                      })
                })
            }else{
                return new Promise((r, j) => {
                    j({code:-1,message:'电磁阀信号1,电磁阀信号1,必须选择一个'});
                    r({code:-1,message:'123'});
                })
            }
        }
    },    
    removePart: row => {
        let id = row[0]['id'];
      const { partStore } = this.props.store
      partStore.removePart({ idList:[id]}).then(res => {
        if (res.code === '0') {
          message.success(res.message)
          this.props._callback();
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
 
  _filtData(data,type){
    let obj = [];
    data.forEach(element => {
        if(element.partType == type){
            obj.push(element);
        }
    });
    return obj
  }

  render() {
    let self = this;
    const { cubeStore } = this.props.store
    const { formData, formData3,formData2,columns, mode, data} = this.state

    let partList = this.props.data;

    let filePartList = this._filtData.bind(this,toJS(partList),1)();

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
              <Button style={{ marginRight: '16px' }}  onClick={  this._addCube.bind(this) } type="primary">增加气缸</Button>
              </div>


              {/* <CustomTable
                rowSelection={null}
                columns={columns}
                dataSource={ filePartList }
                onTableChange={this.handlers.onTableChange}
              /> */}

            <Row gutter={24}>
                {
                    filePartList && filePartList.length>0?
                        filePartList.map(function(item){
                            return(
                                <Col key={item.id} className="gutter-row" span={8}>
                                    <div className="gutter-box">
                                        <div className='box_l' onClick={self._editPart.bind(self,item)}>
                                            { item.partName }
                                        </div>
                                        <div className='box_r'>

                                        <Popconfirm
                                            title="确定删除工位?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => {
                                            // console.log('data, row, index', data, row, index)
                                            self.handlers.removePart([item])
                                            }}
                                        >
                                            <Icon style={{color:'red'}} type="delete" />
                                        </Popconfirm>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })
                    :null
                }
            </Row>


              <ModalCustomForm
                title="操作"
                visible={!!mode}
                destroyOnClose
                onCancel={() => {
                  this.setState({ mode: 0 })
                }}
                onSubmit={this.handlers.onSubmit}
                formData={ formData }
                defaultData={data}
              />
            </Col>
        </Row>
      </Card>
    )
  }
}
export default Index
