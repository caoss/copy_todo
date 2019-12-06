/**
 * @author YM
 */
import React, { Component } from 'react'
import './index.scss'
import { inject, observer } from 'mobx-react'
import { Row,Col,Button, Table, message } from 'antd'
import { toJS } from 'mobx';

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    let self = this;
    this.state = {
        arr:[],
        selAxis:[],
        columns: [
            {
              title: '口 名称',
              dataIndex: 'interfaceName',
            },
            {
              title: '值',
              width:'20px',
              render: (id, row, index) => (
                <div>
                  { row.invertFlag?
                        <div style={{width:'20px',height:'20px',background:'green',borderRadius:'50%'}} ></div>
                    :
                        <div style={{width:'20px',height:'20px',background:'red',borderRadius:'50%'}} ></div>
                    }
                </div>
              )
            },
            {
                title: '操作',
                dataIndex: 'id',
                key: 'x',
                render: (id, row, index) => (
                  <div>
                    <Button
                      type="primary"
                      style={{ marginRight: '8px' }}
                      onClick={
                        self._setInvert.bind(self,row,1)
                      }
                    >
                        开
                    </Button>

                    <Button
                      type="primary"
                      style={{ marginRight: '8px' }}
                      onClick={
                        self._setInvert.bind(self,row,2)
                      }
                    >
                        关
                    </Button>
    
                  </div>
                )
              }
          ],
    }
  }

  _setInvert(row,type){
    let id = row.id;
    let self = this;
    const { mainboardStore } = this.props.store
      let value = type=='2'?'off':'on';
      mainboardStore.setOinvert({infId:id,value}).then(res=>{
          if (res.code === '0') {
            //   setTimeout(function(){
            //       self.getIOPortList();
            //   },1000)
            //   message.success('操作成功')
          }else if(res.msg){
            message.error(res.msg);
          }
      });
}

  componentDidMount() {
      this.getIOPortList();
  }
    getIOPortList(){
        console.log('getIOPortList-----1111');
        const { mainboardStore } = this.props.store
        mainboardStore.getModelDetail(this.props.id).then((res)=>{
            this.setState({
                arr:res.outList
            })
        });
    }
  componentWillReceiveProps(nextProps) {
    const { mainboardStore } = this.props.store
      if(nextProps.data){
        mainboardStore.getModelDetail(nextProps.id).then((res)=>{
            this.setState({
                arr:res.outList
            })
        });
      }
  }


//   onDoubleClick={}
  renderContent() {
    return (
        <div style={{ width:'100%'}}>
            <Row type="flex">
                <Col span={20} className='cusk'>
                    <div >
                    <Table
                        size="small" 
                        bordered
                        columns={this.state.columns}
                        dataSource={this.state.arr}
                        pagination={{  // 分页
                            simple: true,
                            pageSize: 200
                        }}
                    />
                        
                    </div>
                </Col>
            </Row>
        </div>
    )
  }

  render() {
    return <div>{this.renderContent()}</div>
  }
}
export default Index
