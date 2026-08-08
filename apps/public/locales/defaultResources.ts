import { createLocaleWordSpace } from './factory'
import commonZhCN from './mobile/common/zh-CN.json'
import resourceZhCN from './mobile/resource/default'
import extraZhCN from './mobile/extra/zh-CN.json'
import routerZhCN from './mobile/router/zh-CN.json'

import publicZhCN from './public/zh-CN.json'
import oldZhCN from './oldMobile/zh-CN.json'

const zh_CN = Object.assign(
  createLocaleWordSpace('mobile', {
    ...createLocaleWordSpace('common', commonZhCN),
    ...createLocaleWordSpace('resource', resourceZhCN),
    ...createLocaleWordSpace('extra', extraZhCN),
    ...createLocaleWordSpace('router', routerZhCN),
  }),
  createLocaleWordSpace('public', publicZhCN),
  createLocaleWordSpace('', oldZhCN),
)

export default zh_CN
