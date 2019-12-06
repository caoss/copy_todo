/**
 * @author 
 */
import React, { Component } from 'react'
import { Card } from "antd";
import icon_auto from '../../img/icon_auto.png';
import icon_reset from '../../img/icon_reset.png';

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  _checkID(item,type){
       let id = (type=='2'?item.resetId:item.autoId);
      this.props._checkID( id,item.axisIds,item.partIds,type,item.mgName  );
  }


  componentWillReceiveProps(nextProps) {}

  render() {
      let item = this.props.data;
    return(
            <Card 
            className='card_box'
            size='small'
            >
                <p>{ item.mgName }</p>
                <div className='icons_sss'>
                    <div className='icons_1 icons_2' onClick={this._checkID.bind(this,item,1)} >
                        <img src={icon_auto} />
                    </div>
                    <div className='icons_1' onClick={this._checkID.bind(this,item,2)}>
                        <img src={icon_reset} />
                    </div>
                </div>
                <div style={{clear:'both'}}/>
            </Card>
    )
  }
}
export default Index
