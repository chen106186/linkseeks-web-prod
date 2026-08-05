import cloneDeep from 'lodash/cloneDeep'

export class MemoryStorageModule<T> {
  private memoryData: Record<string, T> = {}

  setItem(key: string, value: T) {
    this.memoryData[key] = value
  }

  getItem(key: string) {
    return this.memoryData[key] || null
  }

  getAllItems() {
    return cloneDeep(this.memoryData)
  }

  removeItem(key: string): void {
    delete this.memoryData[key]
  }

  removeAllItem() {
    this.memoryData = {}
  }
}
