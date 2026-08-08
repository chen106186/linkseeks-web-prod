import { createLocaleWordSpace } from '../../factory'
import home from './home/zh-CN.json'
import order from './order/zh-CN.json'
import basicSetting from './basicSetting/zh-CN.json'
import user from './user/zh-CN.json'
import contract from './contract/zh-CN.json'
import askPurchase from './askPurchase/zh-CN.json'

export default {
  ...createLocaleWordSpace('home', home),
  ...createLocaleWordSpace('order', order),
  ...createLocaleWordSpace('basicSetting', basicSetting),
  ...createLocaleWordSpace('user', user),
  ...createLocaleWordSpace('contract', contract),
  ...createLocaleWordSpace('askPurchase', askPurchase),
}
