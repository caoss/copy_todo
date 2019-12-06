/**
 * @author YM
 */
const defaultOptions = {}

joint.shapes.node.Node.define(
  'node.Driver',
  {
    attrs: {
      label: {
        text: '驱动器'
      },
      image: {
        xlinkHref: require('./images/icon_driver.png')
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
      const obj = new joint.shapes.node.Driver(mergeOptions)
      obj.addPort({ group: 'in' })
      obj.addPort({ group: 'out' })
      // console.log('obj---------', obj)
      return obj
    }
  }
)

export default joint.shapes.node.Driver.create
