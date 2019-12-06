/**
 * @author YM
 */
const defaultOptions = {
  ports: {
    groups: {
      'left-in': {
        attrs: {
          '.port-body': {
            fill: '#008FE0',
            strokeWidth: 0,
            magnet: true,
            'x-alignment': 'middle',
            'y-alignment': 'middle'
          },
          '.port-label': {
            fill: '#FFF'
          }
        },
        markup: '<rect width="14" height="14" class="port-body"/>',
        position: {
          name: 'line',
          args: { start: { x: 0, y: 30 }, end: { x: 0, y: 270 } }
        }
      },
      'right-in': {
        attrs: {
          '.port-body': {
            fill: '#008FE0',
            strokeWidth: 0,
            magnet: true,
            'x-alignment': 'middle',
            'y-alignment': 'middle'
          },
          '.port-label': {
            fill: '#FFF'
          }
        },
        markup: '<rect width="14" height="14"  class="port-body"/>',
        position: {
          name: 'line',
          args: { start: { x: 300, y: 30 }, end: { x: 300, y: 270 } }
        }
      },
      'top-out': {
        attrs: {
          '.port-body': {
            fill: '#55C587',
            strokeWidth: 0,
            magnet: true,
            'x-alignment': 'middle',
            'y-alignment': 'middle'
          },
          '.port-label': {
            fill: '#FFF'
          }
        },
        markup:
          '<rect width="14" height="14"  rx="7" ry="7" class="port-body"/>',
        position: {
          name: 'line',
          args: { start: { x: 30, y: 0 }, end: { x: 270, y: 0 } }
        }
      },
      'bottom-out': {
        attrs: {
          '.port-body': {
            fill: '#55C587',
            strokeWidth: 0,
            magnet: true,
            'x-alignment': 'middle',
            'y-alignment': 'middle'
          },
          '.port-label': {
            fill: '#FFF'
          }
        },
        markup:
          '<rect width="14" height="14" rx="7" ry="7" class="port-body"/>',
        position: {
          name: 'line',
          args: { start: { x: 30, y: 300 }, end: { x: 270, y: 300 } }
        }
      }
    }
  }
}

joint.shapes.node.Node.define(
  'node.Control',
  {
    size: { width: 300, height: 300 },
    attrs: {
      label: {
        text: 'PLC',
        fontSize: 20,
        ref: 'image',
        refY: '100%',
        fill: '#000',
        'x-alignment': 'middle',
        'y-alignment': 'top'
      },
      body: {
        rx: 30,
        ry: 30
      },
      image: {
        xlinkHref: require('./images/icon_chip.png'),
        width: 150,
        height: 150,
        'x-alignment': 'middle',
        'y-alignment': 'middle'
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
      const obj = new joint.shapes.node.Control(mergeOptions)
      let i = 0
      for (i = 0; i < 12; i++) {
        obj.addPort({
          group: 'left-in'
        })
      }

      for (i; i < 12 * 2; i++) {
        obj.addPort({
          group: 'bottom-out'
        })
      }

      for (i; i < 12 * 3; i++) {
        obj.addPort({
          group: 'right-in'
        })
      }

      for (i; i < 12 * 4; i++) {
        obj.addPort({
          group: 'top-out'
        })
      }
      return obj
    }
  }
)

export default joint.shapes.node.Control.create
