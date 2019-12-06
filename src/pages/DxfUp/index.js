/**
 * @author 
 */
import React, { Component } from 'react'
import './index.scss'
import { Upload, Icon, message } from 'antd';
import { inject, observer } from 'mobx-react'
import EvnConst from '../../configs/EvnConst'
const { Dragger } = Upload;

@inject('store')
@observer
class Index extends Component {

    constructor(props) {
        super(props)
        let self = this;
        this.propss = {
            name: 'file',
            multiple: false,
            action: main_host+'/dxf/upload',
            onChange(info) {
                const { status } = info.file;
                if (status === 'done') {
                    console.log(info.file.response);
                    if( info.file&&info.file.response&&info.file.response.data&&info.file.response.data.jpgUrl ){
                        self.setState({
                            jpgUrl:info.file.response.data.jpgUrl
                        })
                    }
                    if( info.file&&info.file.response&&info.file.response.data&&info.file.response.data.result ){
                        message.success(`${info.file.name}上传成功了.${info.file.response.data.result}条`);
                    }
                } else if (status === 'error') {
                message.error(`${info.file.name} 上传失败.`);
                }
            },
        }
        this.state = {
            jpgUrl:''
        }
        
    }
    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {}
  
    render() {
        console.log('props',this.propss);
        return(
            <div className="drag_box">
                <div style={{width:'400px',height:'400px'}}>
                    <Dragger {...this.propss}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">单击或拖动文件到此区域上传</p>
                    </Dragger>
                </div>
                <div style={{margin:'0 20px'}}>
                    <img src={ main_host+''+this.state.jpgUrl } alt=''/>
                </div>
            </div>
        )
    }
}
export default Index
