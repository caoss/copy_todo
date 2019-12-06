/**
 * @author YM
 */
import React, { Component } from 'react'
import './index.scss'

export default class ModalCustomForm extends Component {
  static propTypes = {}

  state = {
  }

    componentDidMount(){
        this._draw(this.props.data);
    }
    
    componentWillReceiveProps(nextProps){
        this._draw(nextProps.data);
    }
    
    _draw( arr ) {

    console.log("arr",arr);
    let newArr = [];
    arr.forEach(function(item){
        newArr.push(item.posX);
        newArr.push(item.posY);
    })
    newArr.sort(function (a, b) {
        return a-b;
    });
    let minNum = newArr[0]
    let maxNum = newArr[newArr.length-1]
    console.log('minNum',minNum);
    console.log('maxNum',maxNum);
    let self = this;
    var canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 800;
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        let cir ={} ;
        arr.forEach(function(item){
            if( minNum <0 ){
                item.posX = item.posX-minNum+10;
                item.posY = item.posY-minNum+10;
            }
            switch (item.posType) {
                case 1://直线起点
                    ctx.moveTo(item.posX, item.posY);
                    break;
                case 2://直线中间点
                    ctx.lineTo(item.posX, item.posY);
                    break;
                case 3://直线终点
                    ctx.lineTo(item.posX, item.posY);
                    ctx.stroke(); //绘制路径。
                    break;
                case 5://圆弧起点
                    cir.sx= item.posX;
                    cir.sy= item.posY;
                    break;
                case 8://圆心
                    cir.cx= item.posX;
                    cir.cy= item.posY;
                    break;
                case 7://圆弧终点
                    cir.ex= item.posX;
                    cir.ey= item.posY;
                    //当圆弧起点终点在同一位置时，画圆
                    var r = self._getR(cir.sx,cir.sy,cir.cx,cir.cy);
                    if(cir.sx == cir.ex && cir.sy== cir.ey){
                        ctx.beginPath();
                        ctx.arc(cir.cx,cir.cy,r,0,2*Math.PI );
                        ctx.stroke();
                        cir ={};
                    }else if( (cir.sx == cir.cx && cir.ey == cir.cy) || cir.ex == cir.cx && cir.sy == cir.cy){
                        ctx.lineTo(cir.sx,cir.sy);
                        ctx.stroke();
                        ctx.beginPath();
                        let obj = self.getSEAngle(cir.cx,cir.cy,cir.sx,cir.sy,cir.ex,cir.ey );
                        let   startAngle = obj.startAngle* (Math.PI/180);
                        let   endAngle = obj.endAngle * (Math.PI/180);
                        self.drawCir(ctx,cir.cx,cir.cy,r,startAngle,endAngle)
                        ctx.stroke();
                        ctx.moveTo(cir.ex,cir.ey);
                        cir ={};
                    }
                    break;
                    
                default:
                    break;
            }
        })
        
    }
    }
    _getR(sx,sy,cx,cy){
        return Math.sqrt( Math.pow(Math.abs( sx-cx ),2) + Math.pow(Math.abs( sy-cy ),2) ) 
    }
    // //绘制圆弧 ctx.arc(50, 200, 50, 0, (Math.PI/180)*90, false);
    // //起始点，角度。顺时针/逆时针
    drawCir(ctx,x,y,r,startAngle,endAngle,anticlockwise){
        // anticlockwise为true表示逆时针，默认为顺时针
        // 角度都传的是弧度（弧度 = (Math.PI/180)*角度）
        // arc(x, y, radius, startAngle, endAngle, anticlockwise) 
        // arcTo(x1, y1, x2, y2, radius)
        ctx.beginPath();
        ctx.arc(x, y, r, startAngle,endAngle,anticlockwise);
        ctx.stroke();
    }

    getSEAngle( X1,Y1,X2,Y2,X3,Y3 ){
        var startAngle = null;
        var endAngle = null;
        if( X2>X1 && Y2 == Y1 ){//ok1
            startAngle = 0;
        }else if( X2>X1 && Y2<Y1 ){//ok2
            startAngle = 360 - this.getAngle(X1,Y1,X2,Y2,X1,Y2);
        }else if( X2==X1 && Y2<Y1 ){//ok3
            startAngle = 270;
        }else if( X2<X1 && Y2<Y1 ){//ok4
            startAngle = 180 + this.getAngle(X1,Y1,X2,Y2,X2,Y1);
        }else if(X2<X1 && Y2== Y1 ){//oK5
            startAngle = 180;
        }else if( X2<X1 && Y2> Y1){//ok6
            startAngle = 90 + this.getAngle(X1,Y1,X2,Y2,X1,Y2);
        }else if(  X2==X1 && Y2> Y1 ){//7
            startAngle = 90;
        }else if( X2>X1 && Y2>Y1 ){//8
            startAngle = this.getAngle(X1,Y1,X2,Y2,X2,Y1);
        }
        endAngle = startAngle + this.getAngle(X1,Y1,X2,Y2,X3,Y3);
        return {startAngle:startAngle, endAngle:endAngle}
        
    }
    getAngle(X1,Y1,X2,Y2,X3,Y3){
        //(X1,Y1)圆心
        //(X2,Y2)起始点
        //(X3,Y3)结束点
        var AB = Math.abs( Math.pow( [ Math.pow(X2-X1-0,2) + Math.pow(Y2-Y1-0,2) ],0.5 ) );
        var AC = Math.abs( Math.pow( [ Math.pow(X3-X1-0,2) + Math.pow(Y3-Y1-0,2) ],0.5 ) );
        console.log( Math.acos(  [(X2-X1)*(X3-X1)+(Y2-Y1)*(Y3-Y1)]/(AB*AC) )/(Math.PI/180) );
        return Math.acos(  [(X2-X1)*(X3-X1)+(Y2-Y1)*(Y3-Y1)]/(AB*AC) )/(Math.PI/180)
    }


    render() {
        return (
            <div>
                <canvas id="canvas" >
                    当前浏览器不支持Canvas，请更换浏览器后再试
                </canvas>
            </div>
        )
    }
}
