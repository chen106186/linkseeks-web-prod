## 资讯

[资讯组件](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/2nL6jg3vNwjpJXV/inspect)

示例：

```tsx
import React from 'react'
import { InformationCard } from '@apps/design-ui'

export default () => {
  const productList = [
    {
      name: '智能电器0',
      mainPic:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/VCG211334581103a5fa17c7025545748d5d039dd8d4a975.jpg',
      price: '5,288.00',
    },
    {
      name: '智能电器0',
      mainPic:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/VCG211334581103a5fa17c7025545748d5d039dd8d4a975.jpg',
      price: '5,288.00',
    },
    {
      name: '智能电器0',
      mainPic:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/VCG211334581103a5fa17c7025545748d5d039dd8d4a975.jpg',
      price: '5,288.00',
    },
  ]

  return (
    <div style={{ width: 375, backgroundColor: '#F5F6F7' }}>
      <InformationCard title="8月钢市价格走势判断" />
    </div>
  )
}
```
