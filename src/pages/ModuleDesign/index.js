/**
 * @author YM
 */
import React, { Component } from 'react'
import './index.scss'
import { Card, Icon } from 'antd'
import Workspace from '../../components/Workspace'
import Slider from '../../components/Slider'
import Storage from '../../utils/Storage'
import AttrContent from '../../components/NodeAttribute'

class Index extends Component {
  state = {
    workspaceRef: null,
    descriptors: {},
    saveData: Storage.getFormStorage('moduleDesign'),
    isShowAttrs: false,
    selectedItem: null
  }

  componentDidMount() {
    import('../../json/sliderConfig.json').then(descriptors => {
      this.setState({
        descriptors: descriptors.default
      })
    })
    this.setState({
      workspaceRef: this.refs.myWorkspace
    })

    eventBus.on('elementsSelect', this.handlers.selectElement)
    eventBus.on('elementsNoSelect', this.handlers.noSelectElement)
  }

  componentWillUnmount() {
    eventBus.off('elementsSelect', this.handlers.selectElement)
    eventBus.off('elementsNoSelect', this.handlers.noSelectElement)
  }

  handlers = {
    selectElement: ele => {
      this.setState({
        selectedItem: ele,
        isShowAttrs: true
      })
    },
    noSelectElement: () => {
      this.setState({
        selectedItem: null,
        isShowAttrs: false
      })
    }
  }

  render() {
    const { descriptors, workspaceRef, isShowAttrs, selectedItem } = this.state
    return (
      <div className="module-design-page">
        <div className="component-slider">
          <Slider workspaceRef={workspaceRef} descriptors={descriptors} />
        </div>
        <Workspace
          id="moduleDesign"
          ref="myWorkspace"
          saveData={this.state.saveData}
        />
        {isShowAttrs ? (
          <div className="attribute-slider">
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon
                    type="setting"
                    style={{ color: '#5B77D9', fontSize: '22px' }}
                  />
                  <span className="attr-title">属性面板</span>
                </div>
              }
              bodyStyle={{ padding: 0 }}
              className="attribute-con"
            >
              <AttrContent
                workspaceRef={workspaceRef}
                descriptors={descriptors}
                selectedItem={selectedItem}
                // onChange={(e, changedValues, allValues) => {
                //   console.log('onchange------e', changedValues, allValues)
                // }}
              />
            </Card>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}
export default Index
