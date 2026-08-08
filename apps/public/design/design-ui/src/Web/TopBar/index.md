## 商城顶部

### 基础用法

```tsx
import React from 'react'
import { TopBar, LocaleProvide } from '@apps/design-ui'

export default () => (
  <div className="theme-shop-science">
    <LocaleProvide locale="en-US">
      <TopBar shopname="数商云" city="广州" />
    </LocaleProvide>
  </div>
)
```
