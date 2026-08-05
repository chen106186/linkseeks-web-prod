## 品牌推荐

示例：

```tsx
import React from 'react'
import { MobileBrand } from '@apps/design-ui'

export default () => {
  const brandList = [
    {
      logoUrl:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___www049de5a335a24332b61ffdd00a4eff4b.canva',
      name: '品牌1',
      id: 1,
    },
    {
      logoUrl:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___www049de5a335a24332b61ffdd00a4eff4b.canva',
      name: '品牌2',
      id: 2,
    },
    {
      logoUrl:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___www049de5a335a24332b61ffdd00a4eff4b.canva',
      name: '品牌3',
      id: 3,
    },
    {
      logoUrl:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___www049de5a335a24332b61ffdd00a4eff4b.canva',
      name: '品牌4',
      id: 4,
    },
    {
      logoUrl:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___www049de5a335a24332b61ffdd00a4eff4b.canva',
      name: '品牌5',
      id: 5,
    },
    {
      logoUrl:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___www049de5a335a24332b61ffdd00a4eff4b.canva',
      name: '品牌6',
      id: 6,
    },
  ]

  return (
    <div style={{ width: 375 }}>
      <MobileBrand>
        <MobileBrand.Header />
        <MobileBrand.List brandList={brandList} />
      </MobileBrand>
    </div>
  )
}
```
