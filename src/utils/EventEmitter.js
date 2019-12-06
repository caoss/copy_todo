/**
 * @author
 * 订阅
 */
class EventEmitter {
  constructor() {
    this.events = {}
  }

  getEvents() {
    return this.events || (this.events = {})
  }

  getListeners(event) {
    const events = this.getEvents()
    return events[event] || (events[event] = [])
  }
// 订阅事件
  on(event, handler, context) {
    const listeners = this.getListeners(event)

    const listener = {
      handler,
      context
    }

    listeners.push(listener)
  }
 // 删除订阅事件
  off(event, handler) {
    const events = this.getEvents()

    if (handler === undefined) {
      events[event] = []
      return
    }

    const listeners = this.getListeners(event)
    const size = listeners.length

    for (let i = 0; i < size; i++) {
      if (listeners[i].handler === handler) {
        listeners.splice(i, 1)
        return
      }
    }
  }
 // 触发事件(发布事件)
  emit(event, data) {
    const listeners = this.getListeners(event)
    const size = listeners.length

    for (let i = 0; i < size; i++) {
      listeners[i].handler.apply(listeners[i].context, data || [])
    }
  }
}

window.eventBus = new EventEmitter()
