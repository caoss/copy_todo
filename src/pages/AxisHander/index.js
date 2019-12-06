/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import './index.scss'
import { Row,Col,Input,Form,Icon,Select,Button,message } from 'antd'
import { timeFormat } from '../../utils/Utils'
import SystemUtils from '../../utils/SystemUtil'
import CustomTable from '../../components/CustomTable'

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state={
        axis_JK:{},
        axisId:'',
        safePosition:0,
    }
  }

  componentDidMount() {
    // this._getVersionList()
    const { mainboardStore } = this.props.store
    this.getAxisList();
    let self = this;
    this.t = setInterval(function(){
        if(self.state.axisId){
            self._getAxisJk( self.state.axisId);
        }
    },1000)
  }

  componentWillUnmount(){
    clearInterval(this.t)
}

  //获取轴列表interfaceType5
  getAxisList(){
        const { mainboardStore } = this.props.store
        mainboardStore.getAxisList();
    }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  handleSelectChange = (name,value) => {
    const { mainboardStore } = this.props.store;
    let axisList= mainboardStore.axisList;
    if( name =='axis' ){//切换轴的时候，点位列表切换
        this.setState({
            axisId:axisList[value].axisId,
            safePosition:axisList[value].safePosition,
        })
    }
}

_getAxisJk(axisId){
    let self = this;
    const { mainboardStore } = this.props.store
    mainboardStore.getAxisJK({axisId:axisId}).then(res=>{
        if(res&&res.data){
            this.setState({
                axis_JK:res.data
            })
        }else{
            console.log('res-----',res);   
            message.error(res.msg)
            this.setState({
                axis_JK:{}
            })
            clearInterval(self.t)
        }
    })
}
_axisMoveRel(type,e){
    e.preventDefault();
    const { mainboardStore } = this.props.store
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if(!type){
            values.dist = -(values.dist)-0;
        }
        values.axisId= this.state.axisId;
        mainboardStore.axisMoveRel(values).then(res=>{
            console.log('axisMoveRel--',res);
            if(res.code!='0'&&res.msg){
                message.error(res.msg);
            }
        });
      }
    });
}

_axisJog(type){
    const { mainboardStore } = this.props.store 
    this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          if(type){
              values.dir = 1;
            }else{
                values.dir = -1;
          }
          values.axisId= this.state.axisId;
          mainboardStore.axisMoveJog(values).then(res=>{
            if(res.code!='0'&&res.msg){
                message.error(res.msg);
            }
          });
        }
      });
}
axisStop(){
    const { mainboardStore } = this.props.store 
    this.props.form.validateFields((err, values) => {
        if (!err) {
          mainboardStore.axisStop({ axisId:this.state.axisId}).then(res=>{
            if(res.code!='0'&&res.msg){
                message.error(res.msg);
            }

          });
        }
      });
}
_axisMove(type){
    const { mainboardStore } = this.props.store 
    this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
            values.destType = type;
            values.axisId= this.state.axisId;
          mainboardStore.axisMove(values).then(res=>{
                if(res.code!='0'&&res.msg){
                    message.error(res.msg);
                }
          });
        }
      });
}
axisMoveAbs(type){ 
    const { mainboardStore } = this.props.store 
    this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          if(!values.position){
            message.error('把旁边的值填上')
            return;
          }
          values.axisId= this.state.axisId;
          mainboardStore.axisMoveAbs(values).then(res=>{
            if(res.code!='0'&&res.msg){
                message.error(res.msg);
            }
          });
        }
      });
}
axisGoHome(){
    const { mainboardStore } = this.props.store 
    this.props.form.validateFields((err, values) => {
        if (!err) {
          mainboardStore.axisGoHome({ axisId:this.state.axisId}).then(res=>{
            if(res.code!='0'&&res.msg){
                message.error(res.msg);
            }

          });
        }
      });
}

  render() {
    const { mainboardStore } = this.props.store
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    let axisList= mainboardStore.axisList;
    let axisIds = [];
    if(this.props.data&&this.props.data.axisIds){
        axisIds =JSON.parse(this.props.data.axisIds); 
    }
    return (
        <div style={{ 'background':'#fff' }} >
           
           <Row>
                <Col span={10} className="row_left">
                    <Form.Item
                        label="选择轴口"
                        labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}
                    >
                        {getFieldDecorator('axisId',{rules: [{required: true, message: 'Please input your axis!' }]})(
                            <Select  style={{ width: 150 }} onChange={this.handleSelectChange.bind(this,'axis')}>
                                {
                                    axisList.map(function(item,i){
                                        if( axisIds && axisIds.length>0 && axisIds.includes(item.axisId) ){
                                            return(
                                                <Option value={i} key={item.axisId}>{item.axisName}</Option>
                                            )
                                        }
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>        

                    <Form.Item
                        label="定长(mm)"
                        labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}
                    >
                        {getFieldDecorator('dist', {initialValue:1,rules: [{required: true, message: 'Please input your fitDist!' }], })(
                        <Input />
                        )}
                    </Form.Item>

                    <Form.Item
                        label="速度(mm/s)"
                        labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}
                    >
                        {getFieldDecorator('speed', {initialValue:10,rules: [{required: true, message: 'Please input your fitDist!' }], })(
                        <Input />
                        )}
                    </Form.Item>
                    
                    {
                        Object.getOwnPropertyNames(this.state.axis_JK).length!=0?
                            <div className='boxx'>
                                <p style={{padding:'15px 0px'}}>
                                    实时MPos: { this.state.axis_JK.realTimeMPos }
                                </p>

                                <p style={{padding:'15px 0px'}}>
                                    实时DPos:  { this.state.axis_JK.realTimeDPos }
                                </p>
                                <p style={{padding:'15px 0px'}}>
                                    是否回过原点:  { this.state.axis_JK.alreadyGoHome?'是':'否' }
                                </p>
                            </div>
                        :
                        null
                    }
                    
                </Col>
                <Col span={14} className="row_right">
                    <div className='btns'>       
                        <Button type="primary" onClick={this._axisMoveRel.bind(this,1)}>定长(+)</Button>
                        <Button type="primary" onClick={this._axisMoveRel.bind(this,0)}>定长(-)</Button>
                    </div>
                   
                    
                    <div className='btns'>       
                        <Button type="primary" onClick={this._axisMove.bind(this,1)}>反转</Button>
                        <Button type="primary" onClick={this.axisGoHome.bind(this)}>找原点</Button>
                    </div>
                   
                   
                    <div className='btns'>       
                        <Button type="primary" onMouseDown={ this._axisJog.bind(this,1)} onMouseUp={ this.axisStop.bind(this) }>Jog(+)</Button>
                        <Button type="primary" onMouseDown={ this._axisJog.bind(this,0)} onMouseUp={ this.axisStop.bind(this) }>Jog(-)</Button>
                    </div>

                    <div className='btns'>       
                        <Button type="primary" onClick={this.axisMoveAbs.bind(this)} > 绝对(mm) </Button>
                        <Form.Item style={{ width:'75px',margin:'0',marginLeft:'10px',display:'inline-block'}}>
                            {getFieldDecorator('position', {initialValue:1})(
                            <Input />
                            )}
                        </Form.Item>
                    </div>

                    <div className='btns'>       
                        <Button type="primary" onClick={this._axisMove.bind(this,1)}>归零</Button>
                        {
                            this.state.safePosition?
                            <Button type="primary" onClick={this._axisMove.bind(this,2)}>安全位</Button>
                            :null
                        }
                    </div>
                    
                    
                </Col>
            </Row>

        </div>
    )
  }
}

const WrappedApp = Form.create()(Index);

export default WrappedApp
