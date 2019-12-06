/**
 * @author YM
 * 定义连接线
 */
const defaultOptions = {
    // line: {
    //   sourceMarker: {
    //     // hour hand
    //     type: 'path',
    //     d: 'M 20 -10 0 0 20 10 Z'
    //   },
    //   targetMarker: {
    //     // minute hand
    //     type: 'path',
    //     stroke: 'green',
    //     'stroke-width': 2,
    //     fill: 'yellow',
    //     d: 'M 20 -10 0 0 20 10 Z'
    //   }
    // }
}
joint.dia.Link.define(
    'node.Link', {
        attrs: {
            '.connection': {//连线设置
                'stroke-width': 3,
                stroke: '#FF408A'
                // targetMarker: {
                //   type: 'path',
                //   'stroke-width': 0,
                //   fill: '#FF408A',
                //   d: 'M 8 -4 0 0 8 4 Z'
                // }
            },
            // '.marker-target': {
            //     fill: '#333333', //箭头颜色
            //     d: 'M 10 0 L 0 5 L 10 10 z' //箭头样式
            // }
        },
        router: {
            name: 'manhattan',
            args: {}
        },
        connector: {
            name: 'rounded',
            args: {
                radius: 5
            }
        }
    }, {}, {
        create(options) {
            const mergeOptions = joint.util.assign({}, defaultOptions, options || {})
            const obj = new joint.shapes.node.Link(mergeOptions)
            // console.log('link-----------------------', obj)
            return obj
        }
    }
)

export default joint.shapes.node.Link.create