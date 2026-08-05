## 渠道商城顶部导航

示例:

```tsx
import React from 'react'
import { ChannelHeaderNav, LocaleProvide } from '@apps/design-ui'

const mockData = [
  {
    name: '我的',
    content: '',
    status: true,
    type: 1,
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
      <ChannelHeaderNav categoryList={categoryList}>
        {mockData.map((item) => (
          <ChannelHeaderNav.ActionItem key={item.type} data={item} />
        ))}
      </ChannelHeaderNav>
      <LocaleProvide locale="ko-KR">
        <ChannelHeaderNav categoryList={categoryList}>
          {mockData.map((item) => (
            <ChannelHeaderNav.ActionItem key={item.type} data={item} />
          ))}
        </ChannelHeaderNav>
      </LocaleProvide>
    </div>
  )
}
```

```tsx
import React from 'react'
import { ChannelHeaderNav } from '@apps/design-ui'

const mockData = [
  {
    name: '我的',
    content: '',
    status: true,
    type: 1,
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
      <ChannelHeaderNav styleTheme={1} categoryList={categoryList}>
        {mockData.map((item) => (
          <ChannelHeaderNav.ActionItem key={item.type} data={item} />
        ))}
      </ChannelHeaderNav>
    </div>
  )
}
```
