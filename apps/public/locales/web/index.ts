import { createLocaleWordSpace } from '../factory'
import * as common from './common'
import * as resource from './resource'
import * as extra from './extra'

import publicLocales from '../public'

export const zh_CN = Object.assign(
  createLocaleWordSpace('web', {
    ...createLocaleWordSpace('common', common.zh_CN),
    ...createLocaleWordSpace('resource', resource.zh_CN),
    ...createLocaleWordSpace('extra', extra.zh_CN),
  }),
  createLocaleWordSpace('public', publicLocales.zh_CN),
)

export const en_US = Object.assign(
  createLocaleWordSpace('web', {
    ...createLocaleWordSpace('common', common.en_US),
    ...createLocaleWordSpace('resource', resource.en_US),
    ...createLocaleWordSpace('extra', extra.en_US),
  }),
  createLocaleWordSpace('public', publicLocales.en_US),
)

export const ko_KR = Object.assign(
  createLocaleWordSpace('web', {
    ...createLocaleWordSpace('common', common.ko_KR),
    ...createLocaleWordSpace('resource', resource.ko_KR),
    ...createLocaleWordSpace('extra', extra.ko_KR),
  }),
  createLocaleWordSpace('public', publicLocales.ko_KR),
)

export const zh_TW = Object.assign(
  createLocaleWordSpace('web', {
    ...createLocaleWordSpace('common', common.zh_TW),
    ...createLocaleWordSpace('resource', resource.zh_TW),
    ...createLocaleWordSpace('extra', extra.zh_TW),
  }),
  createLocaleWordSpace('public', publicLocales.zh_TW),
)
