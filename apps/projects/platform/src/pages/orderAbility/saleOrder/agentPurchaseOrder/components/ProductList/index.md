<!--
 * @Author: GHua
 * @Date: 2022-03-24 15:44:53
 * @LastEditTime: 2022-03-29 16:36:39
 * @LastEditors: GHua
 * @Description:
-->

## 商品列表组件

示例:

```tsx
import React from 'react'
import { ProductList, LocaleProvide } from '@linkseeks/lingxi-mall-components'

const dataSource = [
  {
    id: 898,
    customerCategory: {
      id: 902,
      name: '板鞋',
      fullId: '00000903.00000902',
      sort: null,
      category: {
        id: 45,
        name: '板鞋',
        sort: null,
        fullId: '00000044.00000045',
      },
    },
    brand: null,
    mainPic:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/d8f9d72a6059252d4c640ae51035703d5ab5b910b87eedead13643df9c3bcd47f7945ca6.jpeg',
    name: 'dd鞋',
    slogan: null,
    sellingPoint: [],
    unitName: '件',
    minOrder: 1.0,
    priceType: 1,
    min: 100.0,
    max: 100.0,
    sold: 0.0,
    creditScore: 0,
    stockCount: 0.0,
    memberId: 540,
    memberRoleId: 84,
    memberName: 'crayon02',
    storeId: 50,
    storeName: 'crayon',
    storeLogo: null,
    publishTime: 1634636810457,
    preferentialPrice: null,
    tagList: null,
    commodityAttributeList: [
      {
        id: 1664,
        customerAttribute: {
          id: 191,
          groupName: '风格',
          name: '风格',
          isSearch: false,
          attribute: {
            id: 32,
            groupName: '风格',
            name: '风格',
            isSearch: false,
          },
        },
        customerAttributeValueList: [
          {
            id: 377,
            value: '风格1',
            attributeValue: { id: 57, value: '风格1' },
          },
        ],
      },
    ],
  },
  {
    id: 795,
    customerCategory: {
      id: 746,
      name: '品类q',
      fullId: '00000746',
      sort: null,
      category: null,
    },
    brand: {
      id: 177,
      name: '33',
      logoUrl:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/微信图片_202108301745308b73e6b6f7fd43a7879b33948d6aeb7a.png',
    },
    mainPic:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/微信图片_202108301745032b78065046e5432db3c336a9d2b737ff.png',
    name: '评价商品1',
    slogan: null,
    sellingPoint: null,
    unitName: '9',
    minOrder: 10.0,
    priceType: 1,
    min: 10000.0,
    max: 10000.0,
    sold: 0.0,
    creditScore: 143,
    stockCount: 0.0,
    memberId: 514,
    memberRoleId: 3,
    memberName: '电脑供应商',
    storeId: 48,
    storeName: '222',
    storeLogo: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/1d146db11dc6d4cffab13a1821408676b.jpg',
    publishTime: 1635842424527,
    preferentialPrice: null,
    tagList: null,
    commodityAttributeList: [],
  },
  {
    id: 789,
    customerCategory: {
      id: 759,
      name: '红柚',
      fullId: '00000753.00000756.00000759',
      sort: null,
      category: null,
    },
    brand: {
      id: 134,
      name: '荷花',
      logoUrl:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/E5B444A0-E950-43bc-B0A6-2EA015E8539D54997e8b169943cba9d00c627bea0f48.png',
    },
    mainPic: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/test576526d86de1b4f9c89d3f4a0fac469d4.jpg',
    name: '红柚子_1_1_1',
    slogan: null,
    sellingPoint: null,
    unitName: '箱',
    minOrder: 1.0,
    priceType: 1,
    min: 99.99,
    max: 99.99,
    sold: 0.0,
    creditScore: 0,
    stockCount: 0.0,
    memberId: 416,
    memberRoleId: 3,
    memberName: '花花供应商',
    storeId: 28,
    storeName: null,
    storeLogo: null,
    publishTime: 1637223446330,
    preferentialPrice: null,
    tagList: null,
    commodityAttributeList: [
      {
        id: 1551,
        customerAttribute: {
          id: 125,
          groupName: '规格',
          name: '规格1',
          isSearch: true,
          attribute: {
            id: 15,
            groupName: '规格',
            name: '规格1',
            isSearch: true,
          },
        },
        customerAttributeValueList: [{ id: 197, value: 't3', attributeValue: { id: 11, value: 't3' } }],
      },
      {
        id: 1552,
        customerAttribute: {
          id: 137,
          groupName: '尺码',
          name: '尺码',
          isSearch: true,
          attribute: {
            id: 26,
            groupName: '尺码',
            name: '尺码',
            isSearch: true,
          },
        },
        customerAttributeValueList: [
          { id: 231, value: '39', attributeValue: { id: 50, value: '39' } },
          { id: 232, value: '40', attributeValue: { id: 51, value: '40' } },
          { id: 235, value: '38', attributeValue: { id: 49, value: '38' } },
        ],
      },
    ],
  },
  {
    id: 776,
    customerCategory: {
      id: 759,
      name: '红柚',
      fullId: '00000753.00000756.00000759',
      sort: null,
      category: null,
    },
    brand: {
      id: 134,
      name: '荷花',
      logoUrl:
        'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/E5B444A0-E950-43bc-B0A6-2EA015E8539D54997e8b169943cba9d00c627bea0f48.png',
    },
    mainPic: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/test576526d86de1b4f9c89d3f4a0fac469d4.jpg',
    name: '红柚子吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃',
    slogan: null,
    sellingPoint: [],
    unitName: '箱',
    minOrder: 1.0,
    priceType: 1,
    min: 99.99,
    max: 99.99,
    sold: 0.0,
    creditScore: 0,
    stockCount: 0.0,
    memberId: 416,
    memberRoleId: 3,
    memberName: '花花供应商',
    storeId: 28,
    storeName: '花花供应商店铺',
    storeLogo: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/test55ce7c458c4eb44ad85be90e0ea025e7d.jpg',
    publishTime: 1636707617410,
    preferentialPrice: null,
    tagList: null,
    commodityAttributeList: [
      {
        id: 1828,
        customerAttribute: {
          id: 125,
          groupName: '规格',
          name: '规格1',
          isSearch: true,
          attribute: {
            id: 15,
            groupName: '规格',
            name: '规格1',
            isSearch: true,
          },
        },
        customerAttributeValueList: [{ id: 197, value: 't3', attributeValue: { id: 11, value: 't3' } }],
      },
      {
        id: 1829,
        customerAttribute: {
          id: 137,
          groupName: '尺码',
          name: '尺码',
          isSearch: true,
          attribute: {
            id: 26,
            groupName: '尺码',
            name: '尺码',
            isSearch: true,
          },
        },
        customerAttributeValueList: [
          { id: 231, value: '39', attributeValue: { id: 50, value: '39' } },
          { id: 232, value: '40', attributeValue: { id: 51, value: '40' } },
          { id: 235, value: '38', attributeValue: { id: 49, value: '38' } },
        ],
      },
    ],
  },
  {
    id: 729,
    customerCategory: {
      id: 732,
      name: '六级',
      fullId: '00000629.00000630.00000631.00000632.00000628.00000732',
      sort: null,
      category: {
        id: 31,
        name: '五级',
        sort: null,
        fullId: '00000022.00000023.00000024.00000028.00000031',
      },
    },
    brand: {
      id: 161,
      name: '三一重工',
      logoUrl: 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/test124544957e9f7495188ced64758e850c7.png',
    },
    mainPic:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/TIM截图20180814111448928de40dffe743818814746461b6c465.png',
    name: '168的商品买家运费-真无税率_1运费模板 呵呵呵',
    slogan: null,
    sellingPoint: [],
    unitName: '千克',
    minOrder: 2.0,
    priceType: 1,
    min: 200.0,
    max: 400.0,
    sold: 2.0,
    creditScore: 0,
    stockCount: 0.0,
    memberId: 70,
    memberRoleId: 3,
    memberName: '18800000035',
    storeId: 12,
    storeName: null,
    storeLogo: null,
    publishTime: 1632556941684,
    preferentialPrice: null,
    tagList: null,
    commodityAttributeList: [],
  },
]

export default () => {
  return (
    <div style={{ backgroundColor: '#F7F8FA', padding: '24px 12px' }}>
      <LocaleProvide>
        <ProductList dataSource={dataSource} layoutType="mall" type="gird" path="/" />
        <ProductList dataSource={dataSource} layoutType="mall" type="list" path="/" />
      </LocaleProvide>
    </div>
  )
}
```
