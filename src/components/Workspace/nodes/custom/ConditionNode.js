/**
 * @author YM
 */
const defaultOptions = {}

joint.shapes.node.Node.define(
    'node.Condition', {
        attrs: {
            label: {
                text: '条件'
            },
            image: {
                xlinkHref: require('./images/icon_start.png')
            }
        }
    }, {}, {
        create(options, descriptor) {
            const mergeOptions = joint.util.assign({},
                defaultOptions, {
                    descriptor
                },
                options || {}
            )
            const obj = new joint.shapes.node.Condition(mergeOptions)
            obj.addPort({
                group: 'in'
            })
            obj.addPort({
                group: 'out'
            })
            // console.log('obj---------', obj)
            return obj
        }
    }
)

export default joint.shapes.node.Condition.create