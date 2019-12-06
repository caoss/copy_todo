import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { inject, observer } from 'mobx-react'

// fake data generator
const getItems = (count) => Array.from({length: count}, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));
  
  
  //重新排序结果,替换
  const reorder =  (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  
  //使用一些小的内联样式帮助程序看起来不错
  const grid = 8;
  const getItemStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    marginBottom: grid,
  
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',
  
    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
  });

@inject('store')
@observer  
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
          items: getItems(5)
        }
        this.onDragEnd = this.onDragEnd.bind(this);
      }

      componentDidMount(){
        console.log('items----------',this.state.items);
            this.getStepList();   
            // this._getModuleGroupList();
      }

      _getModuleGroupList(){
        const { moduleGroupStore } = this.props.store
        return new Promise(function (resolve, reject) {
            moduleGroupStore.getList().then(res=>{
                console.log('ressssss',res);
                resolve(res)
            });
        });
    }

      getStepList(){
        const { mainboardStore } = this.props.store
        mainboardStore.getStepList({ softwareId:1,parentId:"UP22"}).then(res=>{
            this.setState({
                stepList:res
            })
        });
    }
    
      onDragEnd (result) {
        // dropped outside the list
        console.log('result----------',result);
        if(!result.destination) {
          return;
        }
    
        const stepList = reorder(
          this.state.stepList,
          result.source.index,
          result.destination.index
        );
    
        this.setState({
            stepList
        });
      }
    
    render() {
        let  stepList = this.state.stepList;
        return (
            <div>
               <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {

                                    stepList && stepList.length>0?
                                    stepList.map(item => (
                                           <Draggable
                                               key={item.id}
                                               draggableId={item.id}
                                           >
                                               {(provided, snapshot) => (
                                                   <div>
                                                       <div
                                                           ref={provided.innerRef}
                                                           style={getItemStyle(
                                                               provided.draggableStyle,
                                                               snapshot.isDragging
                                                           )}
                                                           {...provided.dragHandleProps}
                                                       >
                                                           {item.stepName}
                                                       </div>
                                                           {provided.placeholder}
                                                   </div>
                                               
                                               )}
                                           </Draggable>
                                       ))
                                    :null

                                }
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
      }
}
export default Index;
