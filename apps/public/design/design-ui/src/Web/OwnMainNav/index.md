## 自营商场导航栏

### 基础用法

```tsx
import React from 'react'
import { OwnMainNav } from '@apps/design-ui'

const menuData = [
  {
    name: '商城首页',
    path: '/',
  },
  {
    name: '现货商品',
    path: '/commodity',
  },
  {
    name: '询价商品',
    path: '/inquery',
  },
  {
    name: '积分兑换',
    path: '/points',
  },
  {
    name: '行情资讯',
    path: '/information',
  },
  {
    name: '关于我们',
    path: '/about',
  },
]

const categoryList = [
  {
    id: 1,
    parentId: '0',
    title: '家具',
    checked: false,
    children: [
      {
        id: '12',
        parentId: '1',
        title: '桌子',
        checked: false,
        imageUrl: null,
        sort: 1,
        children: [],
      },
      {
        id: '13',
        parentId: '1',
        title: '椅子',
        checked: false,
        imageUrl: null,
        sort: 2,
        children: [],
      },
      {
        id: '14',
        parentId: '1',
        title: '沙发',
        checked: false,
        imageUrl: null,
        sort: 3,
        children: [],
      },
      {
        id: '15',
        parentId: '1',
        title: '床',
        checked: false,
        imageUrl: null,
        sort: 4,
        children: [],
      },
    ],
    brandList: [
      {
        id: '1',
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/%E5%9F%BA%E7%A1%80%EF%BC%9A120x48615ae40ccbbc4695adaa1f9cd88b5e888e739aa0a6314cd58a523f3e50e5ceaf.png',
      },
      {
        id: '1',
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/%E5%9F%BA%E7%A1%80%EF%BC%9A120x48615ae40ccbbc4695adaa1f9cd88b5e888e739aa0a6314cd58a523f3e50e5ceaf.png',
      },
      {
        id: '1',
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/%E5%9F%BA%E7%A1%80%EF%BC%9A120x48615ae40ccbbc4695adaa1f9cd88b5e888e739aa0a6314cd58a523f3e50e5ceaf.png',
      },
      {
        id: '1',
        brandLogo:
          'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/%E5%9F%BA%E7%A1%80%EF%BC%9A120x48615ae40ccbbc4695adaa1f9cd88b5e888e739aa0a6314cd58a523f3e50e5ceaf.png',
      },
    ],
  },
  {
    id: 2,
    parentId: '0',
    title: '文具',
    checked: false,
    children: [
      {
        id: '8',
        parentId: '2',
        title: '笔记本',
        checked: false,
        imageUrl: null,
        sort: 1,
        children: [],
      },
      {
        id: '9',
        parentId: '2',
        title: '圆珠笔',
        checked: false,
        imageUrl: null,
        sort: 2,
        children: [],
      },
      {
        id: '10',
        parentId: '2',
        title: '签字笔',
        checked: false,
        imageUrl: null,
        sort: 3,
        children: [],
      },
      {
        id: '11',
        parentId: '2',
        title: '水彩笔',
        checked: false,
        imageUrl: null,
        sort: 4,
        children: [],
      },
    ],
    brandList: [],
  },
  {
    id: 3,
    parentId: '0',
    title: '电子产品',
    checked: false,
    children: [
      {
        id: '4',
        parentId: '3',
        title: '三星',
        checked: false,
        imageUrl: null,
        sort: 1,
        children: [],
      },
      {
        id: '5',
        parentId: '3',
        title: '小米',
        checked: false,
        imageUrl: null,
        sort: 2,
        children: [],
      },
      {
        id: '6',
        parentId: '3',
        title: '苹果',
        checked: false,
        imageUrl: null,
        sort: 4,
        children: [],
      },
      {
        id: '7',
        parentId: '3',
        title: '锤子',
        checked: false,
        imageUrl: null,
        sort: 5,
        children: [],
      },
    ],
    brandList: [],
  },
  {
    id: 16,
    parentId: '0',
    title: '服装',
    checked: false,
    children: [
      {
        id: '17',
        parentId: '16',
        title: '衣服',
        checked: false,
        imageUrl: null,
        sort: 1,
        children: [],
      },
      {
        id: '18',
        parentId: '16',
        title: '裤子',
        checked: false,
        imageUrl: null,
        sort: 2,
        children: [],
      },
      {
        id: '19',
        parentId: '16',
        title: '鞋子',
        checked: false,
        imageUrl: null,
        sort: 3,
        children: [],
      },
      {
        id: '20',
        parentId: '16',
        title: '外套',
        checked: false,
        imageUrl: null,
        sort: 4,
        children: [],
      },
    ],
    brandList: [],
  },
  {
    id: 21,
    parentId: '0',
    title: '家电',
    checked: false,
    children: [
      {
        id: '22',
        parentId: '21',
        title: '电脑',
        checked: false,
        imageUrl: null,
        sort: 1,
        children: [],
      },
      {
        id: '23',
        parentId: '21',
        title: '空调',
        checked: false,
        imageUrl: null,
        sort: 2,
        children: [],
      },
      {
        id: '24',
        parentId: '21',
        title: '冰箱',
        checked: false,
        imageUrl: null,
        sort: 3,
        children: [],
      },
      {
        id: '25',
        parentId: '21',
        title: '电饭煲',
        checked: false,
        imageUrl: null,
        sort: 4,
        children: [],
      },
    ],
    brandList: [],
  },
  {
    id: 21,
    parentId: '0',
    title: '家电',
    checked: false,
    children: [
      {
        id: '22',
        parentId: '21',
        title: '电脑',
        checked: false,
        imageUrl: null,
        sort: 1,
        children: [],
      },
      {
        id: '23',
        parentId: '21',
        title: '空调',
        checked: false,
        imageUrl: null,
        sort: 2,
        children: [],
      },
      {
        id: '24',
        parentId: '21',
        title: '冰箱',
        checked: false,
        imageUrl: null,
        sort: 3,
        children: [],
      },
      {
        id: '25',
        parentId: '21',
        title: '电饭煲',
        checked: false,
        imageUrl: null,
        sort: 4,
        children: [],
      },
    ],
    brandList: [],
  },
  {
    id: 21,
    parentId: '0',
    title: '家电',
    checked: false,
    children: [
      {
        id: '22',
        parentId: '21',
        title: '电脑',
        checked: false,
        imageUrl: null,
        sort: 1,
        children: [],
      },
      {
        id: '23',
        parentId: '21',
        title: '空调',
        checked: false,
        imageUrl: null,
        sort: 2,
        children: [],
      },
      {
        id: '24',
        parentId: '21',
        title: '冰箱',
        checked: false,
        imageUrl: null,
        sort: 3,
        children: [],
      },
      {
        id: '25',
        parentId: '21',
        title: '电饭煲',
        checked: false,
        imageUrl: null,
        sort: 4,
        children: [],
      },
    ],
    brandList: [],
  },
  {
    id: 21,
    parentId: '0',
    title: '家电',
    checked: false,
    children: [
      {
        id: '22',
        parentId: '21',
        title: '电脑',
        checked: false,
        imageUrl: null,
        sort: 1,
        children: [],
      },
      {
        id: '23',
        parentId: '21',
        title: '空调',
        checked: false,
        imageUrl: null,
        sort: 2,
        children: [],
      },
      {
        id: '24',
        parentId: '21',
        title: '冰箱',
        checked: false,
        imageUrl: null,
        sort: 3,
        children: [],
      },
      {
        id: '25',
        parentId: '21',
        title: '电饭煲',
        checked: false,
        imageUrl: null,
        sort: 4,
        children: [],
      },
    ],
    brandList: [],
  },
  {
    id: 21,
    parentId: '0',
    title: '家电',
    checked: false,
    children: [
      {
        id: '22',
        parentId: '21',
        title: '电脑',
        checked: false,
        imageUrl: null,
        sort: 1,
        children: [],
      },
      {
        id: '23',
        parentId: '21',
        title: '空调',
        checked: false,
        imageUrl: null,
        sort: 2,
        children: [],
      },
      {
        id: '24',
        parentId: '21',
        title: '冰箱',
        checked: false,
        imageUrl: null,
        sort: 3,
        children: [],
      },
      {
        id: '25',
        parentId: '21',
        title: '电饭煲',
        checked: false,
        imageUrl: null,
        sort: 4,
        children: [],
      },
    ],
    brandList: [],
  },
]

export default () => (
  <div
    className="theme-ownmall-science"
    style={{ height: 600, backgroundColor: '#F5F6F7' }}
  >
    <OwnMainNav
      type="mall"
      menuData={menuData}
      categoryList={categoryList}
      pathname="/"
    />
  </div>
)
```
