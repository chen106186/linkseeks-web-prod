## 推荐店铺

[推荐店铺组件](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/BGAE9KKLoA9lRd8/inspect)

示例：

```tsx
import React from 'react'
import { RecommendShop } from '@apps/design-ui'

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
      <RecommendShop>
        <RecommendShop.Item
          id={1}
          logo="https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg"
          memberName="花花供应商"
          registerYears={3}
          creditPoint={888}
          productList={productList}
        />
        <RecommendShop.Item />
      </RecommendShop>
    </div>
  )
}
```
