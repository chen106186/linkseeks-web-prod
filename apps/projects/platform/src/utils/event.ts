class EventEmitter {
  events = {}

  on(eventName: string, handler) {
    if (typeof handler !== 'function') {
      throw '必须传入一个函数'
    }
    if (this.events[eventName]) {
      this.events[eventName].push(handler)
    } else {
      this.events[eventName] = [handler]
    }
  }

  off(eventName) {
    this.events[eventName] = null
  }

  emit(eventName: string, ...payload) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(v => {
        v(...payload)
      })
    }
  }
}

export default new EventEmitter()
