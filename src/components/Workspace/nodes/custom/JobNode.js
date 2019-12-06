/**
 * @author YM
 */
const defaultOptions = {}

joint.shapes.node.Node.define(
  'node.Job',
  {
    attrs: {
      label: {
        text: '动作'
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
      const obj = new joint.shapes.node.Job(mergeOptions)
      obj.addPort({ group: 'in' })
      obj.addPort({ group: 'out' })
      // console.log('obj---------', obj)
      return obj
    }
  }
)

export default joint.shapes.node.Job.create
