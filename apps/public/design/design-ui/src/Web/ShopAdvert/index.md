## 店铺广告图组件

### 基础用法

```tsx
import React from 'react'
import { ShopAdvert } from '@apps/design-ui'

const advertList = [
  {
    id: 27,
    type: 1,
    name: '1',
    picUrl:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/fb5b67cab9794cf2a0fefd3e60e17afb1601281348273.jpg',
    link: '',
    sort: 1,
  },
  {
    id: 28,
    type: 1,
    name: '2',
    picUrl:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/6385b53673734c779aed1548e275bbd21601281360139.jpg',
    link: '',
    sort: 2,
  },
  {
    id: 29,
    type: 1,
    name: '3',
    picUrl:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/f695c27b7ada424292baff4de01468331601281356852.jpg',
    link: '',
    sort: 3,
  },
]

export default () => (
  <div className="theme-shop-science">
    <ShopAdvert advertList={advertList} />
  </div>
)
```
