## 店铺推荐商品

[店铺推荐商品组件](https://codesign.qq.com/workspace/prototype/o5l429lOEpjdYDO/2kY5j3nrDgZExNd/inspect)

示例：

```tsx
import React from 'react'
import { MobileShopCommodity } from '@apps/design-ui'

export default () => {
  return (
    <div style={{ width: 375, backgroundColor: '#F5F6F7' }}>
      <MobileShopCommodity>
        <MobileShopCommodity.Item
          title="营养辅食"
          dataList={[
            {
              name: '轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶',
              mainPic:
                'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
              min: 289.28,
              tags: ['满300减20'],
              sold: 37,
            },
            {
              name: '轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶',
              mainPic:
                'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
              min: 289.28,
              tags: ['满300减20'],
              sold: 37,
            },
            {
              name: '轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶',
              mainPic:
                'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
              min: 289.28,
              tags: ['满300减20'],
              sold: 37,
            },
          ]}
        />
        <MobileShopCommodity.Item title="洗护用品" />
      </MobileShopCommodity>
    </div>
  )
}
```
