## 自营商城 Banner

### 基础用法

```tsx
import React from 'react'
import { OwnBanner } from '@apps/design-ui'

const advertList = [
  {
    type: 1,
    picUrl:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/2021100914175174fcad6ec8974e6eb5ff48b435f28ff3.jpg',
  },
]

const advertList2 = [
  {
    type: 2,
    picUrl:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/20211009141804019edb108ef3403e80ab67bc5ed6efbf.jpg',
  },
]

const advertList3 = [
  {
    type: 3,
    picUrl:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/202110091418140370141ee7424f83a48c1c117a4dd194.jpg',
  },
  {
    type: 3,
    picUrl:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/20211009141825078c1eaecac64cf49690066ac7426c80.jpg',
  },
]

const advertList4 = [
  {
    type: 4,
    picUrl:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/2021100914272168dc2510bf774cddbf78dae7a8681749.jpg',
  },
  {
    type: 4,
    picUrl:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/20211009142735c40c04de5c5f4ecf8e28a8535321ad0e.jpg',
  },
]

export default () => (
  <div className="theme-ownmall-science">
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <OwnBanner type={1} advertList={advertList} />
      <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 16 }}>
        <OwnBanner type={2} advertList={advertList2} />
        <OwnBanner type={3} advertList={advertList3} />
      </div>
    </div>
    <OwnBanner type={4} advertList={advertList4} />
  </div>
)
```
