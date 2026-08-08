import { createLocaleWordSpace } from '../../factory'
import home from './home'
import order from './order'
import basicSetting from './basicSetting'
import user from './user'
import contract from './contract'
import askPurchase from './askPurchase'

export const zh_CN = {
  ...createLocaleWordSpace('home', home.zh_CN),
  ...createLocaleWordSpace('order', order.zh_CN),
  ...createLocaleWordSpace('basicSetting', basicSetting.zh_CN),
  ...createLocaleWordSpace('user', user.zh_CN),
  ...createLocaleWordSpace('contract', contract.zh_CN),
  ...createLocaleWordSpace('askPurchase', askPurchase.zh_CN),
}

export const en_US = {
  ...createLocaleWordSpace('home', home.en_US),
  ...createLocaleWordSpace('order', order.en_US),
  ...createLocaleWordSpace('basicSetting', basicSetting.en_US),
  ...createLocaleWordSpace('user', user.en_US),
  ...createLocaleWordSpace('contract', contract.en_US),
  ...createLocaleWordSpace('askPurchase', askPurchase.en_US),
}

export const ko_KR = {
  ...createLocaleWordSpace('home', home.ko_KR),
  ...createLocaleWordSpace('order', order.ko_KR),
  ...createLocaleWordSpace('basicSetting', basicSetting.ko_KR),
  ...createLocaleWordSpace('user', user.ko_KR),
  ...createLocaleWordSpace('contract', contract.ko_KR),
  ...createLocaleWordSpace('askPurchase', askPurchase.ko_KR),
}

export const zh_TW = {
  ...createLocaleWordSpace('home', home.zh_TW),
  ...createLocaleWordSpace('order', order.zh_TW),
  ...createLocaleWordSpace('basicSetting', basicSetting.zh_TW),
  ...createLocaleWordSpace('user', user.zh_TW),
  ...createLocaleWordSpace('contract', contract.zh_TW),
  ...createLocaleWordSpace('askPurchase', askPurchase.zh_TW),
}
