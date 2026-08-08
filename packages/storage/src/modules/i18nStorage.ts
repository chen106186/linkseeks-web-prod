import { CookieStorage } from '../adapter'
import { CookieStorageModule } from '../storageModules/CookieStorageModule'

export const localesStorage = new CookieStorageModule({
  storageKey: 'LX_LANG',
  cryptoType: 'base64',
  storageInstance: new CookieStorage(),
})
