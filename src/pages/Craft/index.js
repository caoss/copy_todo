/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import './index.scss'
import { Card,Form, Input, Button, Checkbox,message } from 'antd';

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 13 },
};
const formTailLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 9, offset: 2 },
};

@inject('store')
@observer
class ModalCustomForm extends Component {

    state = {
        checkNick: false,
        defaultData:{},
        newData:{},
      };
    
      check = () => {
        this.props.form.validateFields(err => {
          if (!err) {
            console.info('success');
          }
        });
      };
    
      handleChange = e => {
        this.setState(
          {
            checkNick: e.target.checked,
          },
          () => {
            this.props.form.validateFields(['nickname'], { force: true });
          },
        );
      };

      _submit= (e) =>{
        this.props.form.validateFields((err,values) => {
            if (!err) {
              console.info('success',values);
              const { mainboardStore } = this.props.store
              mainboardStore._adjust(values).then(res=>{
                    if(res && res.code==='0'){
                        message.success("添加成功");
                        this.props.form.resetFields();
                    }else{
                        message.error("添加失败");
                    }
              })
            }
          });
      }
      _getProcessing= (e) =>{
            const { mainboardStore } = this.props.store
            return new Promise(function (resolve, reject) {
                mainboardStore.getProcessing().then(res=>{
                    if(res){
                        resolve(res)
                    }else{
                        reject()
                    }
                })
            });
      }
      componentDidMount(){
        let self = this;
        this._getProcessing().then(res=>{
            this.setState({
                defaultData:res
            })
        });
        this.t = setInterval(function(){
            self._getProcessing().then(res=>{
                self.setState({
                    newData:res
                })
            })
        },2000)
      }

      componentWillUnmount(){
          clearInterval(this.t)
      }
    
  render() {
    const { getFieldDecorator } = this.props.form;
    const {defaultData,newData} = this.state;
    return (
      <Card bordered={false} className="point-config">
            <Form >
                <div className="craft_box">
                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="室内温度(℃)">
                            {getFieldDecorator('roomTemprature', {
                                initialValue:defaultData.roomTemprature,
                                rules: [
                                {
                                    required: false,
                                    // message: 'Please input your 室内温度',
                                },
                                ],
                            })(<Input type="Number" placeholder="" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.roomTemprature  }</p>
                    </div>
                    
                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="室内湿度(%)">
                            {getFieldDecorator('humidity', {
                                 initialValue:defaultData.humidity,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.humidity  }</p>
                    </div>
                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="打开时间(ms)">
                            {getFieldDecorator('openTime', {
                                initialValue:defaultData.openTime,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.openTime  }</p>
                    </div>
                    
                </div>
                
                <div className="craft_box">
                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="关闭时间(ms)">
                            {getFieldDecorator('closeTime', {
                                initialValue:defaultData.closeTime,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.closeTime  }</p>
                    </div>
                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="周期时间(ms)">
                            {getFieldDecorator('cycleTime', {
                                initialValue:defaultData.cycleTime,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.cycleTime  }</p>
                    </div>
                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="脉冲时间(ms)">
                            {getFieldDecorator('pulseTime', {
                                 initialValue:defaultData.pulseTime,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.pulseTime  }</p>
                    </div>
                
                </div>

                <div className="craft_box">

                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="实际加热温度(℃)">
                            {getFieldDecorator('actualTemprature', {
                                 initialValue:defaultData.actualTemprature,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.actualTemprature  }</p>
                    </div>

                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="设定加热温度(℃)">
                            {getFieldDecorator('heatTemprature', {
                                initialValue:defaultData.heatTemprature,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.heatTemprature   }</p>
                    </div>

                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="撞针行程(%)">
                            {getFieldDecorator('stroke', {
                                initialValue:defaultData.stroke,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.stroke  }</p>
                    </div>
                    
                   
                </div>
                
                <div className="craft_box">
                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="供胶压力(kpa)">
                            {getFieldDecorator('supplyPressure', {
                                 initialValue:defaultData.supplyPressure,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.supplyPressure  }</p>
                    </div>
                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="喷嘴直径(mm)">
                            {getFieldDecorator('nozzleDiameter', {
                                 initialValue:defaultData.nozzleDiameter,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.nozzleDiameter  }</p>
                    </div>
                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="点胶速度(mm/s)">
                            {getFieldDecorator('speed', {
                                 initialValue:defaultData.speed,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.speed  }</p>
                    </div>
                </div>
                
               
                <div className="craft_box">
                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="胶水粘度">
                            {getFieldDecorator('glueViscosity', {
                                 initialValue:defaultData.glueViscosity,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.glueViscosity  }</p>
                    </div>
                    {/* <div className="craft_item">
                        <Form.Item {...formItemLayout} label="胶线宽度(mm)">
                            {getFieldDecorator('y1', {
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.roomTemprature }</p>
                    </div> */}
                    <div className="craft_item">
                        <Form.Item {...formItemLayout} label="电压值(V)">
                            {getFieldDecorator('closeVoltage', {
                                 initialValue:defaultData.closeVoltage,
                            })(<Input type="Number" />)}
                        </Form.Item>
                        <p className="tag_s">{ newData.closeVoltage  }</p>
                    </div>
                    <div className="craft_item craft_item_act">
                        <p className="tag_s">{ newData.closeVoltage  }</p>
                    </div>
                
                </div>
                
                <Form.Item {...formTailLayout} className="bot_btns">
                    <Button type="primary" onClick={this._submit.bind(this)}>
                        调优
                    </Button>
                </Form.Item>
            </Form>
      </Card>
    )
  }
}
const WrappedApp = Form.create()(ModalCustomForm);

export default WrappedApp

