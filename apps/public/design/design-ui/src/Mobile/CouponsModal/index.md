## 优惠券弹窗

### 基础用法

[优惠券弹窗](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/zKaDZdlKe6Z2GPL/screen-list)

```tsx
import React from 'react'
import { CouponsModal } from '@apps/design-ui'
import 'antd/dist/antd.less'

const { CouponsItem } = CouponsModal

export default () => (
  <div style={{ width: 375 }}>
    <CouponsModal name={'送你60元红包'}>
      <CouponsItem
        key={1}
        type={1}
        name="平台通用优惠券"
        useConditionMoney={99}
        expiredDay={10}
        denomination={10}
        isnull={false}
      />
      <CouponsItem
        key={2}
        type={2}
        name="商品优惠券-限购五常大米"
        useConditionMoney={99}
        expiredDay={10}
        denomination={100}
        isnull={false}
      />
      <CouponsItem
        key={3}
        type={1}
        name="平台通用优惠券"
        useConditionMoney={99}
        expiredDay={10}
        denomination={10}
        isnull={false}
      />
      <CouponsItem
        key={4}
        type={1}
        name="平台通用优惠券"
        useConditionMoney={99}
        expiredDay={10}
        denomination={10}
        isnull={false}
      />
    </CouponsModal>
  </div>
)
```

### 编辑状态

```tsx
import React from 'react'
import { CouponsModal } from '@apps/design-ui'
import 'antd/dist/antd.less'

const { CouponsItem } = CouponsModal

export default () => (
  <div style={{ width: 375 }}>
    <CouponsModal name={'送你60元红包'}>
      <CouponsItem
        key={1}
        type={1}
        name="平台通用优惠券"
        useConditionMoney={99}
        expiredDay={10}
        denomination={10}
        isnull={true}
      />
      <CouponsItem
        key={2}
        type={2}
        name="商品优惠券-限购五常大米"
        useConditionMoney={99}
        expiredDay={10}
        denomination={100}
        isnull={true}
      />
      <CouponsItem
        key={3}
        type={1}
        name="平台通用优惠券"
        useConditionMoney={99}
        expiredDay={10}
        denomination={10}
        isnull={true}
      />
      <CouponsItem
        key={4}
        type={1}
        name="平台通用优惠券"
        useConditionMoney={99}
        expiredDay={10}
        denomination={10}
        isnull={true}
      />
    </CouponsModal>
  </div>
)
```
