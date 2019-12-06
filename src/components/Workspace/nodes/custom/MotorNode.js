/**
 * @author YM
 */
const defaultOptions = {}

joint.shapes.node.Node.define(
  'node.Motor',
  {
    attrs: {
      label: {
        text: '电机'
      },
      image: {
        xlinkHref: require('./images/icon_motor.png')
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
      const obj = new joint.shapes.node.Motor(mergeOptions)
      obj.addPort({ group: 'in' })
      obj.addPort({ group: 'out' })
      return obj
    }
  }
)

export default joint.shapes.node.Motor.create
