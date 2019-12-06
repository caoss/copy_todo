/**
 * @author 
 */
import React, { Component } from 'react'
import './index.scss'
import { Table,Row,Col } from 'antd';
import { inject, observer } from 'mobx-react'
import M3 from './M3.png'

@inject('store')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
         columns:[
            {
                title: '参数',
                dataIndex: 'parm',
                key: 'parm',
              },
              {
                title: '说明',
                dataIndex: 'explain',
                key: 'explain',
              },
        ],
        dataSource:[
            {
                parm: '机械重复精度',
                explain: '±0.01mm',
            },
            {
                parm: '抓边位置精度',
                explain: '±0.01mm',
            },
            {
                parm: '点胶位置精度',
                explain: '±0.05mm',
            },
            {
                parm: '胶线宽度稳定性',
                explain: '0.40mm±0.10mm',
            },
            {
                parm: '胶线高度稳定性',
                explain: '0.30mm±0.10mm',
            },
            {
                parm: '点胶胶量(称重)',
                explain: '±5%',
            },
            {
                parm: '胶水加热温范围',
                explain: '30℃-150℃（±5℃）',
            },
            {
                parm: 'X-Y轴运动速度',
                explain: '1m/sec 最高',
            },
            {
                parm: 'X-Y轴运动加速度',
                explain: '1g最高',
            },
            {
                parm: '点胶路径',
                explain: '点、直线、弧线',
            },
            {
                parm: '其他',
                explain: '待定',
            },
        ],
        columns2:[
            {
                title: '部件',
                dataIndex: 'part',
                key: 'part',
              },
              {
                title: '说明',
                dataIndex: 'explain',
                key: 'explain',
              },
        ],
        dataSource2:[
            {
                part: '传动机构',
                explain: '伺服+丝杆、伺服+直线电机',
            },
            {
                part: '运动平台',
                explain: 'X轴350毫米，Y轴500毫米，Z轴150毫米',
            },
            {
                part: '点胶阀及控制器',
                explain: '压电式、气动式、螺杆式等多功能匹配',
            },
            {
                part: '加热系统',
                explain: '热熔胶加热系统、治具平台加热系统',
            },
            {
                part: '相机模组',
                explain: 'CCD定位、尺寸检测、缺陷判定、不同光源',
            },
            {
                part: '工控电脑主机',
                explain: 'PC工控系统',
            },
            {
                part: '测高模组',
                explain: '激光测高、机械测高随意搭配',
            },
            {
                part: '显示屏',
                explain: '液晶显示屏',
            },
            {
                part: '电子称重系统',
                explain: '适用于胶水、物料重量判定（最小的单位）',
            },
            {
                part: '轨道传送组件',
                explain: '单双轨道自由调整，高度可调，限位定位功能',
            },
            {
                part: '擦胶机构',
                explain: '自动擦胶、吸胶、集胶',
            },
        ]
    }
    
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    let {columns,dataSource,columns2,dataSource2} = this.state;
    return(
        <div className='indexHome' style={{background:'#fff','padding':'30px'}}>
            {/* <img src={M3} style={{ width:'85%'}} /> */}
            <h3 style={{marginBottom:'10px'}}>设备简介: </h3>
            <p>
                自适应标准点胶机作为一种可半/全自动动作，通过搭载不同的功能模块，实现多种点胶功能。
            </p>
            <p>
                因为其具备通用性好，标准程度高，适应能力强的特点，在现代工业中应用于多个行业场景。
            </p>

            <Row>
                <Col span={12} style={{"padding":"20px 0"}}>
                    <h3 style={{marginBottom:'10px'}}>工艺参数: </h3>
                    <Table pagination={false} columns={columns} dataSource={dataSource} />
                </Col>

                <Col span={12} style={{"padding":"20px 0","paddingLeft":'40px'}}>
                    <h3 style={{marginBottom:'10px'}}>部件说明: </h3>
                    <Table pagination={false} columns={columns2} dataSource={dataSource2} />
                </Col>
            </Row>



        </div>
    )
  }
}
export default Index
