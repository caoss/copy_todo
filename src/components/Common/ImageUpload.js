/**
 * @author YM
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, Icon } from 'antd'

class FileUpload extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    fileLimit: PropTypes.number,
    accept: PropTypes.string,
    imageMaxNum: PropTypes.number
  }

  static defaultProps = {
    fileLimit: 5,
    action: '',
    imageMaxNum: 2
  }

  state = {
    fileList: this.props.value
      ? [this.props.value]
      : [
          {
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url:
              'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
          }
        ],
    previewVisible: false,
    previewImage: null
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fileList: nextProps.value ? [nextProps.value] : []
    })
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    })
  }

  handleChange = ({ fileList }) => {
    console.log('onchange-------------------fileList', fileList)
    this.setState({ fileList })
  }

  customRequest = f => {
    console.log('f------------', f)
  }

  render() {
    const { accept, action, imageMaxNum } = this.props
    const { fileList, previewVisible, previewImage } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" style={{ fontSize: '32px' }} />
      </div>
    )
    const props = {
      accept,
      action,
      name: 'file',
      multiple: false,
      listType: 'picture-card',
      fileList,
      onPreview: this.handlePreview,
      onChange: this.handleChange
      // customRequest: this.customRequest
    }
    return (
      <React.Fragment>
        <Upload {...props}>
          {fileList.length >= imageMaxNum ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={() => {
            this.setState({ previewVisible: false })
          }}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </React.Fragment>
    )
  }
}

export default FileUpload
