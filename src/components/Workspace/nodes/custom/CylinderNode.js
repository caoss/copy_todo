/**
 * @author YM
 */
const defaultOptions = {}

joint.shapes.node.Node.define(
  'node.Cylinder',
  {
    attrs: {
      label: {
        text: '气缸'
      },
      image: {
        xlinkHref: require('./images/icon_cylinder.png')
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
      const obj = new joint.shapes.node.Cylinder(mergeOptions)
      obj.addPort({ group: 'in' })
      obj.addPort({ group: 'out' })
      return obj
    }
  }
)

export default joint.shapes.node.Cylinder.create
