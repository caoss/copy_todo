/**
 * @author YM
 */
const defaultOptions = {}

joint.shapes.node.Node.define(
  'node.End',
  {
    attrs: {
      label: {
        text: '结束'
      },
      image: {
        xlinkHref: require('./images/icon_end.png')
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
      const obj = new joint.shapes.node.End(mergeOptions)
      obj.addPort({ group: 'in' })
      // obj.addPort({ group: 'out' })
      // console.log('obj---------', obj)
      return obj
    }
  }
)

export default joint.shapes.node.End.create
