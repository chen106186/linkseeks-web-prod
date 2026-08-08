<!--
 * @Author: GHua
 * @Date: 2022-03-24 15:44:53
 * @LastEditTime: 2022-03-29 16:28:05
 * @LastEditors: GHua
 * @Description:
-->

## 标签组件

示例:

```tsx
import React from 'react'
import { TagList } from '@linkseeks/lingxi-mall-components'

export default () => {
  return (
    <div style={{ width: 375 }}>
      <TagList tagList={['满减', '直降']} />
      <br />
      <TagList.Item isCoupon />
      <TagList.Item tag="这是个标签" />
    </div>
  )
}
```
