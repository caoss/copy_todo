/**
 * @author YM
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Tabs, Table, Card,Select, Form ,DatePicker,Button} from 'antd'
import SystemUtil from '../../utils/SystemUtil'
import moment from 'moment'; 
import 'moment/locale/zh-cn'; 

import img1 from '../WorkflowDesign/img/1.png';
import img2 from '../WorkflowDesign/img/2.png';
import img3 from '../WorkflowDesign/img/3.png';
import img4 from '../WorkflowDesign/img/4.png';
import img5 from '../WorkflowDesign/img/5.png';
import img6 from '../WorkflowDesign/img/6.png';
import img7 from '../WorkflowDesign/img/7.png';
import img8 from '../WorkflowDesign/img/8.png';
import img9 from '../WorkflowDesign/img/9.png';
import img10 from '../WorkflowDesign/img/10.png';
import img11 from '../WorkflowDesign/img/11.png';
import img12 from '../WorkflowDesign/img/12.png';
import img13 from '../WorkflowDesign/img/13.png';
import img14 from '../WorkflowDesign/img/13.png';
import img15 from '../WorkflowDesign/img/13.png';
import img16 from '../WorkflowDesign/img/13.png';
import img17 from '../WorkflowDesign/img/13.png';
import img18 from '../WorkflowDesign/img/13.png';
import img19 from '../WorkflowDesign/img/13.png';
import img20 from '../WorkflowDesign/img/20.png';


moment.locale('zh-cn');

const { MonthPicker, RangePicker, } = DatePicker;

const TabPane = Tabs.TabPane

@inject('store')
@observer
class ModalCustomForm extends Component {
  constructor(props) {
    super(props)
    const self = this
    this.imgs= [
        img1,img2,img3,img4,img5,img6,img7,img8,img9,img10,img11,img12,img13,img14,img15,img16,img17,img18,img19,img20
    ];
    this.state = {
      mode: 0,
      data: {},
      pagination: {},
      loading:false,
      activeIndex: 0,
      worklogs:{},
      formData:{},
      panes: [
        { title: '工程师参数配置', key: 1 },
        { title: '点位配置', key: 2 },
        { title: '按钮配置', key: 3 }
      ],
      step_status:[
        {value:2,label:"等待完成"},
        {value:3,label:"完成"},
        {value:4,label:"执行失败 "},
        {value:5,label:"就绪失败"},
      ],
      columns: [
        {
          title: '动作名称',
          dataIndex: 'step_name',
          filterForm: {
            type: 'text',
            label: '动作名称',
            valueKey: 'step_name',
            value: ''
          }
        },
        {
          title: '动作类型',
          dataIndex: 'step_type',
          render: (id, row, index) => (
            <div>
              <img className='actionIcon' src={this.imgs[row.step_type-1] } />
            </div>
          )
        },
        {
          title: '日志级别',
          dataIndex: 'log_level',
          render: (id, row, index) => (
            <div>
                { 
                    row.log_level =='1'?
                    '提示'
                    :
                    row.log_level =='2'?
                    '警报'
                    :
                    '错误'
                }
            </div>
          )
        },
        {
          title: '动作状态',
          dataIndex: 'step_status_str'
        },
        {
          title: '日志内容',
          dataIndex: 'content'
        },
        {
          title: '时间',
          dataIndex: 'record_time',
          render: (id, row, index) => (
            <div>
                { SystemUtil.getdate(row.record_time)}
            </div>
          )
        },
      ],
    }
  }

  componentDidMount() {
      this.fetch();
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.fetch();
  };

    handleTableChange = (pagination, filters, sorter) => {
        const{ ...reset2 } = this.state.formData;
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
          pagination: pager,
        });
        this.fetch({
            pageSize: pagination.pageSize,
            pageNum: pagination.current,
            ...filters,
            ...reset2
        });
    };

    fetch = (params = {}) => {
      this.setState({ loading: true });
      const { mainboardStore } = this.props.store
      const{ ...reset } = params;
      const{ ...reset2 } = this.state.formData;

      mainboardStore.getWorkLogs(params).then(res=>{
          const pagination = { ...this.state.pagination };
          pagination.total = res.total;
          pagination.showSizeChanger=true;
          pagination.pageSize=params.pageSize?params.pageSize:null;
          this.setState({
              loading: false,
              pagination,
              ...reset,
              ...reset2
          });
      });
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (!err) {
                console.log("fieldsValue",fieldsValue);
            const rangeTimeValue = fieldsValue['range-time-picker'];
            const values = {
                bgnDate:rangeTimeValue ? rangeTimeValue[0].format('YYYYMMDD'):'',
                endDate:rangeTimeValue ? rangeTimeValue[1].format('YYYYMMDD'):'',
                stepStatus:fieldsValue.step_status?fieldsValue.step_status:''
              };
              console.log(values);
              this.setState({
                  formData:values
              },()=>{
                this.fetch({...values});
              })
          }
        });
      };
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      columns,
    } = this.state
    const { mainboardStore } = this.props.store
    let worklogs = mainboardStore.worklogs
    const rangeConfig = {
        rules: [{ type: 'array', message: 'Please select time!' }],
    };
    return (
    <div style={{ 'background':'#fff',padding:'20px' }}>
        <div className="right">

            <Form layout="inline"  onSubmit={this.handleSubmit}>
                <Form.Item label="选择日期">
                    {getFieldDecorator('range-time-picker', rangeConfig)(
                        <RangePicker showTime format="YYYY-MM-DD" />,
                    )}
                </Form.Item>
                <Form.Item label="日志类型">
                    {getFieldDecorator('step_status')(
                        <Select  style={{ width: 100 }} >
                            {
                                this.state.step_status.map(function(item){
                                    return(
                                        <Option value={item.value} key={item.value}>{item.label}</Option>
                                    )
                                })
                            }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="danger" onClick={this.handleReset.bind(this)}>
                        清空
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        查询
                    </Button>
                </Form.Item>
            </Form>

            <Card bordered={false} style={{ backgroundColor: '#FFF' }}>
                <Table
                    columns={columns}
                    dataSource={worklogs.list}
                    pagination={this.state.pagination}
                    onChange={this.handleTableChange}
                    loading={this.state.loading}
                    
                />
            </Card>
        </div>
      </div>
    )
  }
}
const WrappedApp = Form.create()(ModalCustomForm);
export default WrappedApp
