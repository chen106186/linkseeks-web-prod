## 底部导航

### 基础用法

[底部导航](https://codesign.qq.com/workspace/prototype/eGyOl9yn2V0dxaW/VbAE95NnqL0Plze/screen-list)

```tsx
import React from 'react'
import { BottomNavigation } from '@apps/design-ui'
import 'antd/dist/antd.less'

const { Items } = BottomNavigation
export default () => (
  <div
    style={{ width: 375, position: 'relative', height: 56, overFlow: 'hidden' }}
  >
    <BottomNavigation style={{ position: 'absolute' }}>
      <Items
        name="首页"
        defaultIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        selectIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        active={true}
        isnull={false}
      />
      <Items
        name="分类"
        defaultIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        selectIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        isnull={false}
      />
      <Items
        name="消息"
        defaultIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        selectIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        isnull={false}
      />
      <Items
        name="购物车"
        defaultIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        selectIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        isnull={false}
      />
      <Items
        name="我的"
        defaultIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        selectIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        isnull={false}
      />
    </BottomNavigation>
  </div>
)
```

### 编辑状态

```tsx
import React from 'react'
import { BottomNavigation } from '@apps/design-ui'
import 'antd/dist/antd.less'

const { Items } = BottomNavigation
export default () => (
  <div
    style={{ width: 375, position: 'relative', height: 56, overFlow: 'hidden' }}
  >
    <BottomNavigation style={{ position: 'absolute' }}>
      <Items
        name="首页"
        defaultIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        selectIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        active={true}
      />
      <Items
        name="分类"
        defaultIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        selectIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
      />
      <Items
        name="消息"
        defaultIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        selectIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
      />
      <Items
        name="购物车"
        defaultIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        selectIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
      />
      <Items
        name="我的"
        defaultIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        selectIcon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
      />
    </BottomNavigation>
  </div>
)
```
