## 广告图

### 基础用法

[底部导航](https://codesign.qq.com/workspace/prototype/eGyOl9yn2V0dxaW/dqN292QavdjaBXe/screen-list)

```tsx
import React from 'react'
import { Banner } from '@apps/design-ui'
import 'antd/dist/antd.less'

const { Items } = Banner
export default () => (
  <div style={{ width: 375, position: 'relative' }}>
    <Banner>
      <Items
        id={1}
        name="商品详情 - 广告"
        img="https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/a23c2085da57456ba4aa236805c8d0001612171483277.jpg"
        type={1}
        isnull={false}
      />
      <Items
        id={2}
        name="活动主页 - 广告"
        img="https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/4a3e8774807341e8a052189405381d9b1612171438150.jpg"
        type={2}
        isnull={false}
      />
      <Items
        id={3}
        name="积分详情 - 广告"
        img="https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/5fa17810501841a6926e7b9dadfd7ff01612171532882.jpg"
        type={3}
        isnull={false}
      />
      <Items
        id={4}
        name="店铺主页 - 广告"
        img="https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/4a3e8774807341e8a052189405381d9b1612171438150.jpg"
        type={4}
        isnull={false}
      />
      <Items
        id={5}
        name="不跳转 - 广告"
        img="https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/4a3e8774807341e8a052189405381d9b1612171438150.jpg"
        type={5}
        isnull={false}
      />
    </Banner>
  </div>
)
```

### 隐藏状态

```tsx
import React, { useState } from 'react'
import { Banner } from '@apps/design-ui'
import { Button } from 'antd'
import 'antd/dist/antd.less'

const { Items } = Banner
export default () => {
  const [status, setStatus] = useState<boolean>(false)

  return (
    <div style={{ width: 375, position: 'relative' }}>
      <Button style={{ marginBottom: 12 }} onClick={() => setStatus(!status)}>
        {status ? '隐藏' : '显示'}
      </Button>
      <Banner status={status}>
        <Items
          id={1}
          name="商品详情 - 广告"
          img="https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/a23c2085da57456ba4aa236805c8d0001612171483277.jpg"
          type={1}
          isnull={false}
        />
      </Banner>
    </div>
  )
}
```

### 编辑状态

```tsx
import React from 'react'
import { Banner } from '@apps/design-ui'
import 'antd/dist/antd.less'

const { Items } = Banner
export default () => (
  <div style={{ width: 375, position: 'relative' }}>
    <Banner>
      <Items
        id={1}
        name="商品详情 - 广告"
        img="https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/a23c2085da57456ba4aa236805c8d0001612171483277.jpg"
        type={1}
      />
      <Items
        id={2}
        name="活动主页 - 广告"
        img="https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/4a3e8774807341e8a052189405381d9b1612171438150.jpg"
        type={2}
      />
      <Items
        id={3}
        name="积分详情 - 广告"
        img="https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/5fa17810501841a6926e7b9dadfd7ff01612171532882.jpg"
        type={3}
      />
      <Items
        id={4}
        name="店铺主页 - 广告"
        img="https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/4a3e8774807341e8a052189405381d9b1612171438150.jpg"
        type={4}
      />
      <Items
        id={5}
        name="不跳转 - 广告"
        img="https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com/4a3e8774807341e8a052189405381d9b1612171438150.jpg"
        type={5}
      />
    </Banner>
  </div>
)
```
