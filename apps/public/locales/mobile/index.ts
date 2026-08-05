import { createLocaleWordSpace } from '../factory'
import * as common from './common'
import * as resource from './resource'
import * as extra from './extra'
import * as router from './router'

import publicLocales from '../public'
import oldLocales from '../oldMobile'

export const zh_CN = Object.assign(
  createLocaleWordSpace('mobile', {
    ...createLocaleWordSpace('common', common.zh_CN),
    ...createLocaleWordSpace('resource', resource.zh_CN),
    ...createLocaleWordSpace('extra', extra.zh_CN),
    ...createLocaleWordSpace('router', router.zh_CN),
  }),
  createLocaleWordSpace('public', publicLocales.zh_CN),
  createLocaleWordSpace('', oldLocales.zh_CN),
)
export const en_US = Object.assign(
  createLocaleWordSpace('mobile', {
    ...createLocaleWordSpace('common', common.en_US),
    ...createLocaleWordSpace('resource', resource.en_US),
    ...createLocaleWordSpace('extra', extra.en_US),
    ...createLocaleWordSpace('router', router.en_US),
  }),
  createLocaleWordSpace('public', publicLocales.en_US),
  createLocaleWordSpace('', oldLocales.en_US),
)

export const ko_KR = Object.assign(
  createLocaleWordSpace('mobile', {
    ...createLocaleWordSpace('common', common.ko_KR),
    ...createLocaleWordSpace('resource', resource.ko_KR),
    ...createLocaleWordSpace('extra', extra.ko_KR),
    ...createLocaleWordSpace('router', router.ko_KR),
  }),
  createLocaleWordSpace('public', publicLocales.ko_KR),
  createLocaleWordSpace('', oldLocales.ko_KR),
)

export const zh_TW = Object.assign(
  createLocaleWordSpace('mobile', {
    ...createLocaleWordSpace('common', common.zh_TW),
    ...createLocaleWordSpace('resource', resource.zh_TW),
    ...createLocaleWordSpace('extra', extra.zh_TW),
    ...createLocaleWordSpace('router', router.zh_TW),
  }),
  createLocaleWordSpace('public', publicLocales.zh_TW),
  createLocaleWordSpace('', oldLocales.zh_TW),
)
