## 店铺顶部

[店铺顶部组件](https://codesign.qq.com/workspace/prototype/o5l429lOEpjdYDO/2kY5j3nrDgZExNd/inspect)

示例：

```tsx
import React from 'react'
import { MobileShopHeader, LocaleProvide } from '@apps/design-ui'

export default () => {
  return (
    <div style={{ width: 375, backgroundColor: '#F5F6F7' }}>
      <LocaleProvide locale="en-US">
        <MobileShopHeader
          shopInfo={{
            logo: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/20210830152943e2ac5df675d5467ca93840f86ec983ab.jpg',
            memberName: '温州市龙昌皮业有限公司',
            registerYears: 2,
            creditPoint: 88,
            avgTradeCommentStar: 4,
          }}
        />
      </LocaleProvide>
    </div>
  )
}
```
