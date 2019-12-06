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
        <div className="btn_toggle" onClick={this._toggle.bind(this)}>
            {
                this.props.data?
                <Icon type="right" />
                :
                <Icon type="left" />
            }
        </div>
    )
  }
}
export default Index
