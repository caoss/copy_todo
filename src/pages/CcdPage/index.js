/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import './index.scss'
import { Row,Col,Input,Form,Icon,Popconfirm,Button,message,Card } from 'antd'
import { timeFormat } from '../../utils/Utils'
import SystemUtils from '../../utils/SystemUtil'
import CustomTable from '../../components/CustomTable'

const { TextArea } = Input;

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state={
        pointData:[],
        value:'',
        arr:[],
    }
  }

  componentDidMount() {
    // this.t = setInterval(() => {
        this._getCCD();
    // }, 1000);
  }

  _getCCD(){
    const { mainboardStore } = this.props.store
    mainboardStore.getCCDList().then(res=>{
        console.log(res);
        if(res.code===0){
            let ccdRev = res.data.ccdRev;
            let arr = JSON.parse(ccdRev).split('/');
            if(arr&&arr.length>0){
                this.setState({
                    arr:arr
                });
            }else{
                    this.setState({
                        arr:[]
                    });
            }
        }

    })
  }

  _startCCD(){
    const { mainboardStore } = this.props.store
    mainboardStore.startCCDList().then(res=>{
        console.log(res);
        if(res.code==='0'){
            message.success('启动成功');
        }
    })
  }
  _delCCD(){
    const { mainboardStore } = this.props.store
    mainboardStore.delCCDList().then(res=>{
        console.log(res);
        if(res.code==='0'){
            message.success('清空成功');
        }
    })
  }

  

  _sendCCD(){
    // {
    //     "sendStr": "string"
    //   }
    if(this.state.value==''){
        message.error('请输入发送内容');
        return;
    }
    const { mainboardStore } = this.props.store
    mainboardStore.sendCCDList({  sendStr:this.state.value }).then(res=>{
        if(res.code==='0'){
            message.success('发送成功');
            this.setState({
                value:''
            })
        }
    })
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  componentWillMount(){
    clearInterval(this.t)
  }
  render() {
    var value = this.state.value;
    let arr = this.state.arr;
    return (
        <div style={{ 'background':'#fff',padding:'20px 50px' }}>
            <Button onClick={this._startCCD.bind(this)} type="primary" style={{'marginBottom':'20px'}}>启动客户端</Button>
            <Card
            actions={[
                <Button onClick={this._sendCCD.bind(this)} type='primary'>发送</Button>, 
            ]}
            style={{ width: 600 }}>
                <TextArea placeholder="请输入发送内容" value={value}  onChange={this.handleChange.bind(this)}/>
            </Card>

            <Card size="" title="接收区" 
             actions={[
                <Popconfirm
                title="确定要清空吗?"
                okText="Yes"
                cancelText="No"
                onConfirm={  this._delCCD.bind(this)  }
            >
                <Button type="danger"  icon="delete">清空</Button> 
            </Popconfirm>
            ]}
            style={{ width: 600,marginTop:'20px' }}>
                {
                    arr && arr.length>0?
                        arr.map(function(item,index) {
                            return(
                                <p key={index}>{item}</p>
                            )
                        })
                    :
                    ''
                }
            </Card>           
        </div>
    )
  }
}

const WrappedApp = Form.create()(Index);

export default WrappedApp
