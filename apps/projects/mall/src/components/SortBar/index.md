<!--
 * @Author: GHua
 * @Date: 2022-03-24 15:44:53
 * @LastEditTime: 2022-03-29 16:28:00
 * @LastEditors: GHua
 * @Description:
-->

## 商城商品排序组件

示例:

```tsx
import React from 'react'
import { SortBar, LocaleProvide } from '@linkseeks/lingxi-mall-components'

export default () => {
  return (
    <div style={{ backgroundColor: '#F7F8FA', padding: '24px 12px' }}>
      <LocaleProvide>
        <SortBar current={1} totalCount={10} />
      </LocaleProvide>
    </div>
  )
}
```
