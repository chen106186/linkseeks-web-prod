import { LocalStorage } from '../adapter'
import { LocalStorageModule } from '../storageModules/LocalStorageModule'

export interface TestLocalStorageProps {
  setItem(value: any, options?: any): void
  getItem(options?: any): string | object | null | undefined
  removeItem(options?: any): void
}

export interface Type_TestLocalFactory {
  storage: TestLocalStorageProps
  setTEST(value: any): void
  getTEST(): string | object | null | undefined
  removeTEST(): void
}

export const testLocalStorage = new LocalStorageModule({
  servicePrefix: 'Linkseeks',
  storageKey: 'TEST',
  cryptoType: 'base64',
  storageInstance: new LocalStorage(),
  storageSplit: '_',
})

export class TestLocalFactory {
  storage: TestLocalStorageProps
  constructor() {
    this.storage = testLocalStorage
  }

  setTEST<T extends object>(text: T) {
    this.storage.setItem(text)
  }

  getTEST() {
    try {
      const auth = this.storage.getItem()
      return auth || null
    } catch (err) {
      console.log(err)
      return null
    }
  }

  removeTEST() {
    this.storage.removeItem()
  }
}
