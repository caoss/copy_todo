/**
 * @author YM
 */
const defaultOptions = {}

joint.shapes.node.Node.define(
  'node.Synergy',
  {
    attrs: {
      label: {
        text: '协同'
      },
      image: {
        xlinkHref: require('./images/icon_job.png')
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
      const obj = new joint.shapes.node.Synergy(mergeOptions)
      obj.addPort({ group: 'in' })
      obj.addPort({ group: 'out' })
      // console.log('obj---------', obj)
      return obj
    }
  }
)

export default joint.shapes.node.Synergy.create
