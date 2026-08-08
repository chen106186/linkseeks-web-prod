## 橱窗广告

[推荐店铺组件](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/BGAE9KKLoA9lRd8/inspect)

示例：

```tsx
import React from 'react'
import { ShowCaseBanner } from '@apps/design-ui'

export default () => {
  const productList = [
    {
      name: '推荐商品',
      banner:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/QQ%E6%88%AA%E5%9B%BE20210729134628e0a6e93460d6472ca387f47023512b3d.png',
      inner:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/QQ%E6%88%AA%E5%9B%BE20210729134628e0a6e93460d6472ca387f47023512b3d.png',
    },
    {
      banner:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___img.315che.com_s_CY708S5cz86h9ocLU0U0.jpg&refer=http___img.315chef8ce70914f594bf5a74c9d7f3e29a50f.jpg',
    },
  ]

  return (
    <div style={{ width: 375, backgroundColor: '#F5F6F7' }}>
      <ShowCaseBanner>
        {productList.map((item) => (
          <ShowCaseBanner.Item banner={item.banner} />
        ))}
        <ShowCaseBanner.Item />
      </ShowCaseBanner>
    </div>
  )
}
```
