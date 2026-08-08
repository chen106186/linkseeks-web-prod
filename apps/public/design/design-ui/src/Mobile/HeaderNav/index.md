## 顶部导航

示例:

```tsx
import React from 'react'
import { HeaderNav, LocaleProvide } from '@apps/design-ui'

const mockData = [
  {
    name: '我的',
    content: '',
    status: true,
    type: 1,
  },
  {
    name: '购物车',
    content: '',
    status: true,
    type: 2,
  },
  {
    name: '客服',
    content: '',
    status: true,
    type: 3,
  },
  {
    name: '搜索框',
    content: '灯具',
    status: true,
    type: 4,
  },
]

export default () => {
  return (
    <div style={{ width: 375 }} className="theme-shop-science">
      <LocaleProvide locale="en-US">
        <HeaderNav>
          {mockData.map((item) => (
            <HeaderNav.ActionItem key={item.type} data={item} />
          ))}
        </HeaderNav>
      </LocaleProvide>
    </div>
  )
}
```

```tsx
import React from 'react'
import { HeaderNav, LocaleProvide } from '@apps/design-ui'

const mockData = [
  {
    name: '我的',
    content: '',
    status: true,
    type: 1,
  },
  {
    name: '购物车',
    content: '',
    status: false,
    type: 2,
  },
  {
    name: '客服',
    content: '',
    status: true,
    type: 3,
  },
  {
    name: '搜索框',
    content: '灯具',
    status: true,
    type: 4,
  },
]

const categoryList = [
  {
    value: 1,
    label: '建材',
  },
  {
    value: 2,
    label: '热卷热卷热卷',
  },
  {
    value: 3,
    label: '冷镀11',
  },
  {
    value: 4,
    label: '中厚板',
  },
  {
    value: 5,
    label: '型管型管型管',
  },
]

export default () => {
  return (
    <div style={{ width: 375 }}>
      <LocaleProvide locale="zh-CN">
        <HeaderNav styleTheme={1} categoryList={categoryList}>
          {mockData.map((item) => (
            <HeaderNav.ActionItem key={item.type} data={item} />
          ))}
        </HeaderNav>
      </LocaleProvide>
      <LocaleProvide locale="en-US">
        <HeaderNav styleTheme={1} categoryList={categoryList}>
          {mockData.map((item) => (
            <HeaderNav.ActionItem key={item.type} data={item} />
          ))}
        </HeaderNav>
      </LocaleProvide>
    </div>
  )
}
```
