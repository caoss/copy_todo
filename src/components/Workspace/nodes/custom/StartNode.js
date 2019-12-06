/**
 * @author YM
 */
const defaultOptions = {}

joint.shapes.node.Node.define(
  'node.Start',
  {
    attrs: {
      label: {
        text: '开始'
      },
      image: {
        xlinkHref: require('./images/icon_start.png')
      }
    }
  },
  {},
  {
    create(options, descriptor) {
      const mergeOptions = joint.util.assign(
        {},
        defaultOptions,
        { descriptor },
        options || {}
      )
      const obj = new joint.shapes.node.Start(mergeOptions)
      // obj.addPort({ group: 'in' })
      obj.addPort({ group: 'out' })
      // console.log('obj---------', obj)
      return obj
    }
  }
)

export default joint.shapes.node.Start.create
