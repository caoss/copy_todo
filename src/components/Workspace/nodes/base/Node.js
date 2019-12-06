joint.shapes.standard.Rectangle.define(
  'node.Node',
  {
    attrs: {
      body: {
        fill: '#FFF',
        rx: 13,
        ry: 13,
        strokeWidth: 0
      },
      label: {
        text: '基本节点',
        fill: '#FFF',
        fontSize: 12,
        refY: 0,
        'x-alignment': 'middle',
        'y-alignment': 'bottom'
      },
      image: {
        width: 50,
        height: 50,
        refX: '50%',
        refY: '50%',
        'x-alignment': 'middle',
        'y-alignment': 'middle'
      }
    },
    size: { width: 80, height: 80 },
    ports: {
      groups: {
        in: {
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
          markup: '<rect width="14" height="14" class="port-body"/>'
        },
        out: {
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
            name: 'right'
          }
        }
      }
    }
  },
  {
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
        attributes: {
          stroke: 'none'
        }
      },
      {
        tagName: 'image',
        selector: 'image'
      },
      {
        tagName: 'text',
        selector: 'label'
      }
    ],
    getName() {
      const name = this.prop('attrs/label/text')
      return name
    },
    setName(name) {
      this.prop('attrs/label/text', name)
    },
    getModelBox() {
      const d = this.getBBox('size')
      const pos = this.prop('position')

      return {
        width: d.width,
        height: d.height,
        x: pos.x,
        y: pos.y
      }
    },
    setModelBox(obj) {
      const d = this.getBBox('size')
      const pos = this.prop('position')
      const bbox = Object.assign({}, d, pos, obj)
      this.prop('position', { x: bbox.x, y: bbox.y })
      this.getBBox('size', { width: bbox.width, height: bbox.height })
    }
  }
)
