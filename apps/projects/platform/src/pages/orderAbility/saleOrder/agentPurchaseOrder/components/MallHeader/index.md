<!--
 * @Author: GHua
 * @Date: 2022-03-24 15:44:53
 * @LastEditTime: 2022-03-29 19:07:06
 * @LastEditors: GHua
 * @Description:
-->

## 商城头部

示例:

```tsx
import React from 'react'
import { MallHeader, LocaleProvide } from '@linkseeks/lingxi-mall-components'

export default () => {
  return (
    <div style={{ backgroundColor: '#F7F8FA', padding: '24px 12px' }}>
      <LocaleProvide>
        <MallHeader logo="https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/demo%20logo%20136x485c1637c713ad4ceab09af4dd290ef049.png" />
      </LocaleProvide>
    </div>
  )
}
```
