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
        safePosition:'',
        pointData:[],
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
    const { mainboardStore } = this.props.store
    let axisList= mainboardStore.axisList;
    if( name =='axis' ){//切换轴的时候，点位列表切换
        this.setState({
            axisId:axisList[value].axisId,
            safePosition:axisList[value].safePosition,
        })
        this._getAxisPointData(axisList[value].axisId)
    }
}

_getAxisPointData(id){
    const { mainboardStore } = this.props.store
    mainboardStore.getAxisPointData({axisId:id}).then(res=>{
        if(res){
            this.setState({
                pointData:res
            })
        }else{
            this.setState({
                pointData:[]
            })
        }
    });
}

_getAxisJk(axisId){
    const { mainboardStore } = this.props.store
    mainboardStore.getAxisJK({axisId:axisId}).then(res=>{
        console.log('res-----',res);
        if(res&&res.data){
            this.setState({
                axis_JK:res.data
            })
        }else{
            this.setState({
                axis_JK:{}
            })
            message.error(res.msg)
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
        mainboardStore.axisMoveRel(values).then(res=>{
            console.log('axisMoveRel--',res);
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
          mainboardStore.axisMoveJog(values).then(res=>{
          });
        }
      });
}
axisStop(){
    const { mainboardStore } = this.props.store 
    this.props.form.validateFields((err, values) => {
        if (!err) {
          mainboardStore.axisStop({ axisId:this.state.axisId}).then(res=>{
          });
        }
      });
}
_axisMove(type){//type==1,归0,type==2,安全位
    const { mainboardStore } = this.props.store 
    this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
            values.destType = type;
            values.axisId = this.state.axisId;
            mainboardStore.axisMove(values).then(res=>{
          });
        }
      });
}
axisMoveAbs(item){
    const { mainboardStore } = this.props.store 
    this.props.form.validateFields((err, values) => {
        if (!err) {
            if(values[item.pointId]==''){
                message.error('位置不能为空')
                return;
            }
            values.axisId = this.state.axisId;
            values.position = values[item.pointId];
            console.log('Received values of form: ', values);
            mainboardStore.axisMoveAbs(values).then(res=>{});
        }
      });
}
axisTeach(item){
    const { mainboardStore } = this.props.store 
    this.props.form.validateFields((err, values) => {
        if (!err) {
            let axisId = this.state.axisId;
            mainboardStore.axisTeach({axisId}).then(res=>{
                console.log('asdfsafasfdfres',res);
                if(res.code==='0'){
                    let { realTimeMPos } = res.data;
                    if(item.pointId){
                        let obj ={};
                        obj[item.pointId] = realTimeMPos
                        this.props.form.setFieldsValue(obj)
                    }
                }
            });
        }
      });
}
_save(item){
    const { mainboardStore } = this.props.store 
    this.props.form.validateFields((err, values) => {
        if (!err) {
            
            values.axisId = this.state.axisId;
            values.pointId = item.pointId;
            values.position = values[item.pointId];

            let { axisId,pointId,position } = values;

            mainboardStore.setPointDetail( { axisId,pointId,position } ).then(res=>{
                if(res.code==='0'){
                    message.success('保存成功');
                }
            });
        }
      });
}

axisGoHome(){
    const { mainboardStore } = this.props.store 
    this.props.form.validateFields((err, values) => {
        if (!err) {
          mainboardStore.axisGoHome({ axisId:this.state.axisId}).then(res=>{});
        }
      });
}

  render() {
    const { mainboardStore } = this.props.store
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { pointData } =this.state;
    let axisList= mainboardStore.axisList;
    return (
        <div style={{ 'background':'#fff' }}>
           
           <Row>
                <Col span={8} className="row_left">
                    <Form.Item
                        label="选择轴口"
                        labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}
                    >
                        {getFieldDecorator('axisId',{rules: [{required: true, message: 'Please input your axis!' }]})(
                            <Select  style={{ width: 150 }} onChange={this.handleSelectChange.bind(this,'axis')}>
                                {
                                    axisList.map(function(item,i){
                                        return(
                                            <Option value={i} key={item.axisId}>{item.axisName}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>        
                    
                    {
                        Object.getOwnPropertyNames(this.state.axis_JK).length!=0?
                            <div className='boxx'>
                                <p style={{padding:'15px 30px'}}>
                                    实时MPos: { this.state.axis_JK.realTimeMPos }
                                </p>

                                <p style={{padding:'15px 30px'}}>
                                    实时DPos:  { this.state.axis_JK.realTimeDPos }
                                </p>
                                <p style={{padding:'15px 30px'}}>
                                    是否回过原点:  { this.state.axis_JK.alreadyGoHome?'是':'否' }
                                </p>
                            </div>
                        :
                        null
                    }
                    
                </Col>
                <Col span={16} className="row_right">
                    <div className='btns'>       
                        <Button type="primary" onClick={this.axisStop.bind(this)} >停止运动</Button>
                        <Button type="primary" onClick={this.axisGoHome.bind(this)}>找原点</Button>
                        <Button type="primary" onClick={this._axisMove.bind(this,1)}>归零</Button>
                        {
                            this.state.safePosition?
                            <Button type="primary" onClick={this._axisMove.bind(this,2)}>安全位</Button>
                            :null
                        }
                    </div>
                    <div> 
                        {
                            pointData && pointData.length>0?
                                pointData.map((item)=>{
                                    return(
                                        <div className='list_bos'>
                                            <Form.Item
                                                label= {item.pointName}
                                                style={{ width:'200px' }}
                                                labelCol={{ span: 12 }} wrapperCol={{ span: 7 }}
                                            >
                                                {getFieldDecorator(item.pointId+'', {initialValue:item.position})(
                                                    <Input  />
                                                )}
                                            </Form.Item>  

                                            <Button type="primary" size ="small" onClick={this.axisMoveAbs.bind(this,item)}>运动</Button>
                                            <Button type="primary" size ="small" onClick={this.axisTeach.bind(this,item)}>示教</Button>
                                            <Button type="primary" size ="small" onClick={this._save.bind(this,item)}>保存</Button>
                                        </div>
                                    )
                                })
                            :
                            null

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
