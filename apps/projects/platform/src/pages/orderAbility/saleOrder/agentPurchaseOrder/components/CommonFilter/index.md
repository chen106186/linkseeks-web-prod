## 商品公共筛选组件

示例:

```tsx
import React from 'react'
import { CommonFilter, LocaleProvide, FILTER_TYPE } from '@linkseeks/lingxi-mall-components'

const activeStoresList = [
  {
    memberId: 236,
    memberLogo: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/8413e8c3d0d25f6425f87f0cf5355038d95.png',
    memberName: '168一路发',
    memberShopId: null,
    roleId: 3,
  },
]

const newJoinList = [
  {
    areas: '所有/所有',
    avgTradeCommentStar: 5,
    creditPoint: 352,
    customerCategoryName:
      '小黑 | 鲁大师一级 | 手表 | 168品类 | 品类1 | 一级 | 文  | 文具 | 家居 | 文具       | 积分兑换品类    | 智能手机 | 积分兑换商品 | 家用电器家用电器 | 测试品类 | 女装搭配 | 床前明月光 | 鞋子 | 上衣 | 挖掘机 | 打印机 | 刘德华 | 刘大帅专用一级 | 电子 | iPhone',
    id: 20,
    levelTag: '青铜会员',
    logo: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/8413e8c3d0d25f6425f87f0cf5355038d95.png',
    memberId: 236,
    memberName: '168一路发',
    registerYears: 0,
    roleId: 3,
    status: 1,
  },
]

const brandList = [
  {
    id: 79,
    name: '斗山',
    logoUrl: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/机械设备-斗山b7742f79201c49adab38b11625ed3dd8.jpg',
  },
  {
    id: 102,
    name: 'TOTO',
    logoUrl: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/家居建材-toto4dfd98e4883d4bb09c5576f7f5210290.jpg',
  },
]

const categoryList = [
  {
    title: 'MRO测试品类1',
    name: 'MRO测试品类1',
    treeName: 'MRO测试品类1',
    key: 'c118',
    id: '118',
    children: [
      {
        title: '5-MRO测试品类1-1',
        name: '5-MRO测试品类1-1',
        treeName: 'MRO测试品类1 5-MRO测试品类1-1',
        key: 'c118_c119',
        id: '119',
        link: '/commodity/c118_c119',
      },
      {
        title: 'MRO测试品类1-2',
        name: 'MRO测试品类1-2',
        treeName: 'MRO测试品类1 MRO测试品类1-2',
        key: 'c118_c120',
        id: '120',
        children: [
          {
            title: 'MRO测试品类1-2-1',
            name: 'MRO测试品类1-2-1',
            treeName: 'MRO测试品类1 MRO测试品类1-2 MRO测试品类1-2-1',
            key: 'c118_c120_c124',
            id: '124',
            children: [
              {
                title: 'MRO测试品类四级',
                name: 'MRO测试品类四级',
                treeName: 'MRO测试品类1 MRO测试品类1-2 MRO测试品类1-2-1 MRO测试品类四级',
                key: 'c118_c120_c124_c125',
                id: '125',
                link: '/commodity/c118_c120_c124_c125',
              },
            ],
            link: '/commodity/c118_c120_c124',
          },
        ],
        link: '/commodity/c118_c120',
      },
      {
        title: 'MRO测试属性1-4',
        name: 'MRO测试属性1-4',
        treeName: 'MRO测试品类1 MRO测试属性1-4',
        key: 'c118_c122',
        id: '122',
        children: [
          {
            title: 'MRO测试属性1-4-1',
            name: 'MRO测试属性1-4-1',
            treeName: 'MRO测试品类1 MRO测试属性1-4 MRO测试属性1-4-1',
            key: 'c118_c122_c126',
            id: '126',
            link: '/commodity/c118_c122_c126',
          },
        ],
        link: '/commodity/c118_c122',
      },
      {
        title: 'MRO测试属性1-5',
        name: 'MRO测试属性1-5',
        treeName: 'MRO测试品类1 MRO测试属性1-5',
        key: 'c118_c123',
        id: '123',
        link: '/commodity/c118_c123',
      },
    ],
    link: '/commodity/c118',
  },
  {
    title: '品类1',
    name: '品类1',
    treeName: '品类1',
    key: 'c61',
    id: '61',
    children: [
      {
        title: '平台品类1',
        name: '平台品类1',
        treeName: '品类1 平台品类1',
        key: 'c61_c62',
        id: '62',
        link: '/commodity/c61_c62',
      },
    ],
    link: '/commodity/c61',
  },
]

export default () => {
  return (
    <div style={{ backgroundColor: '#F7F8FA', padding: '24px 12px' }}>
      <LocaleProvide>
        <CommonFilter
          filterConfig={[
            {
              type: FILTER_TYPE.category,
              source: categoryList,
            },
            {
              type: FILTER_TYPE.brand,
              source: brandList,
            },
            {
              type: FILTER_TYPE.price,
            },
            {
              type: FILTER_TYPE.points,
            },
            {
              type: FILTER_TYPE.activeStores,
              source: activeStoresList,
            },
            {
              type: FILTER_TYPE.newJoin,
              source: newJoinList,
            },
          ]}
        />
      </LocaleProvide>
    </div>
  )
}
```
