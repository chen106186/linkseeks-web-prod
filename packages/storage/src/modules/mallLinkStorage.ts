import { CookieStorage } from '../adapter'
import { CookieStorageModule } from '../storageModules/CookieStorageModule'

export const mallLinkStorage = new CookieStorageModule({
  storageKey: 'currentMallLink',
  cryptoType: 'base64',
  storageInstance: new CookieStorage(),
})
