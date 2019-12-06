/**
 * @author 
 */
import React, { Component } from 'react'
import { Icon,} from "antd";

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  _toggle(){
      console.log('this.porps',this.props);
      this.props._tog();
    }

  componentWillReceiveProps(nextProps) {}

  render() {
    return(
        <div className={ this.props.data?"btn_toggle act":"btn_toggle"} onClick={this._toggle.bind(this)}>
            {
                this.props.data?
                <Icon type="left" />
                :
                <Icon type="right" />
            }
        </div>
    )
  }
}
export default Index
