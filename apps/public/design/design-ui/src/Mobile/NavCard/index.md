## 品类导航

示例:

```tsx
import React from 'react'
import { MobileNavCard } from '@apps/design-ui'
import chunk from 'lodash/chunk'
// import 'antd/lib/carousel/style/index.less';

const mockDataList = [
  {
    name: '热轧板卷',
    type: 1,
    url: '',
    icon: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/icon-48-placeholder@2xc3bd6b7d9d344c3bb124b47a2a4e331b.png',
  },
  // {
  //   name: '热轧硅钢',
  //   type: 1,
  //   url: '',
  //   icon: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/icon-48-placeholder@2xc3bd6b7d9d344c3bb124b47a2a4e331b.png'
  // },
  // {
  //   name: '热轧板卷',
  //   type: 1,
  //   url: '',
  //   icon: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/icon-48-placeholder@2xc3bd6b7d9d344c3bb124b47a2a4e331b.png'
  // },
  // {
  //   name: '容器钢板',
  //   type: 1,
  //   url: '',
  //   icon: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/icon-48-placeholder@2xc3bd6b7d9d344c3bb124b47a2a4e331b.png'
  // },
  // {
  //   name: '造船钢板',
  //   type: 1,
  //   url: '',
  //   icon: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/icon-48-placeholder@2xc3bd6b7d9d344c3bb124b47a2a4e331b.png'
  // },
  // {
  //   name: '管线钢板',
  //   type: 1,
  //   url: '',
  //   icon: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/icon-48-placeholder@2xc3bd6b7d9d344c3bb124b47a2a4e331b.png'
  // },
  // {
  //   name: '镀锌钢管',
  //   type: 1,
  //   url: '',
  //   icon: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/icon-48-placeholder@2xc3bd6b7d9d344c3bb124b47a2a4e331b.png'
  // },
  // {
  //   name: '焊接钢管',
  //   type: 1,
  //   url: '',
  //   icon: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/icon-48-placeholder@2xc3bd6b7d9d344c3bb124b47a2a4e331b.png'
  // },
  // {
  //   name: '管线钢板',
  //   type: 1,
  //   url: '',
  //   icon: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/icon-48-placeholder@2xc3bd6b7d9d344c3bb124b47a2a4e331b.png'
  // },
  // {
  //   name: '镀锌钢管',
  //   type: 1,
  //   url: '',
  //   icon: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/icon-48-placeholder@2xc3bd6b7d9d344c3bb124b47a2a4e331b.png'
  // },
  // {
  //   name: '镀锌钢管',
  //   type: 1,
  //   url: '',
  //   icon: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/icon-48-placeholder@2xc3bd6b7d9d344c3bb124b47a2a4e331b.png'
  // },
]

export default () => (
  <>
    <h3>品类导航列表</h3>
    <div
      style={{ width: 360, backgroundColor: '#F7F8FA', padding: '12px 8px' }}
    >
      <MobileNavCard>
        {mockDataList.map((item, index) => (
          <MobileNavCard.NavItem
            empty={false}
            key={`nav_item_wrap_${index}`}
            name={item.name}
            icon={item.icon}
            url={item.url}
            type={item.type}
          />
        ))}
      </MobileNavCard>
    </div>
  </>
)
```

```tsx
import React from 'react'
import { MobileNavCard } from '@apps/design-ui'
import chunk from 'lodash/chunk'

export default () => (
  <>
    <h3>品类导航列表</h3>
    <div
      style={{ width: 360, backgroundColor: '#F7F8FA', padding: '12px 8px' }}
    >
      <MobileNavCard>
        <MobileNavCard.NavItem empty />
      </MobileNavCard>
    </div>
  </>
)
```

<!--
{
  mockDataListResult.map((listItem, listItemIndex) => (
    <div key={`nav_item_wrap_${listItemIndex}`}>
      <div style={{ display: 'flex', flexWrap: 'wrap', padding: '4px 0'}}>
        {
          listItem.map((item, index) => <MobileNavCard.NavItem key={`nav_item_wrap_${index}`} itemInfo={item} />)
        }
      </div>
    </div>
  ))
}
-->
