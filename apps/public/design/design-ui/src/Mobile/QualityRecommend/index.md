## 优质推荐

[优质推荐组件](https://codesign.qq.com/workspace/prototype/eGyOl9yn2V0dxaW/RG6X0k3BJR0xEPB/inspect)

示例：

```tsx
import React from 'react'
import {
  ClassifyLabel,
  QualityRecommend,
  RecommendList,
  RecommendCommodityList,
  RecommendShopList,
  Commodity,
  RecommendBrandList,
  RecommendInformationList,
} from '@apps/design-ui'

const productList = [
  {
    name: '智能电器0',
    mainPic:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/VCG211334581103a5fa17c7025545748d5d039dd8d4a975.jpg',
    price: '5,288.00',
  },
  {
    name: '智能电器0',
    mainPic:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/VCG211334581103a5fa17c7025545748d5d039dd8d4a975.jpg',
    price: '5,288.00',
  },
  {
    name: '智能电器0',
    mainPic:
      'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/VCG211334581103a5fa17c7025545748d5d039dd8d4a975.jpg',
    price: '5,288.00',
  },
]

const mockData = [
  {
    title: '推荐',
    explain: '猜你喜欢',
    type: 1,
    manageWay: 3, // 1:自动按销量排序展示; 2:自动按上架时间排序展示; 3:自定义商品
    num: null,
    id: [1, 2, 3],
  },
  {
    title: '店铺',
    explain: '优选好货',
    type: 2,
    memberShop: [
      {
        memberShopId: 1,
        productId: [1, 2, 3],
      },
      {
        memberShopId: 2,
        productId: [1, 2, 3],
      },
    ],
  },
  {
    title: '品牌',
    explain: '进货首选',
    type: 3,
    id: [1, 2, 3],
  },
  {
    title: '资讯',
    explain: '成交快讯',
    type: 4,
    id: [1, 2, 3],
  },
]

export default () => {
  return (
    <div style={{ width: 375, backgroundColor: '#F5F6F7' }}>
      <QualityRecommend>
        <ClassifyLabel>
          {mockData.map((item) => (
            <ClassifyLabel.LabelItem
              type={item.type}
              title={item.title}
              explain={item.explain}
            />
          ))}
        </ClassifyLabel>
        <RecommendList>
          <RecommendCommodityList
            dataList={[
              {
                name: '轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶',
                mainPic:
                  'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
                min: 289.28,
                sold: 37,
              },
              {
                name: '轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶',
                mainPic:
                  'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
                min: 289.28,
                sold: 37,
              },
              {
                name: '轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶',
                mainPic:
                  'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
                min: 289.28,
                sold: 37,
              },
            ]}
          />
          <RecommendShopList>
            <RecommendShopList.Item
              id={1}
              logo="https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg"
              memberName="花花供应商"
              registerYears={3}
              creditPoint={888}
              productList={productList}
            />
            <RecommendShopList.Item />
          </RecommendShopList>
          <RecommendBrandList>
            <RecommendBrandList.Item
              name="家具"
              image="https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg"
              brandList={[
                {
                  id: 1,
                  name: '品牌1',
                  logoUrl:
                    'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg',
                },
                {
                  id: 2,
                  name: '品牌2',
                  logoUrl:
                    'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg',
                },
                {
                  id: 3,
                  name: '品牌3',
                  logoUrl:
                    'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg',
                },
                {
                  id: 4,
                  name: '品牌4',
                  logoUrl:
                    'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg',
                },
              ]}
            />
            <RecommendBrandList.Item />
          </RecommendBrandList>
          <RecommendInformationList
            dataList={[
              {
                id: 1,
                title:
                  'B2B供应链电商系统平台解决方案，如何实现全网整合B2B供...',
                imageUrl:
                  'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg',
                columnName: '今日热点',
                createTime: '',
                readCount: 20,
              },
              {
                id: 1,
                title:
                  'B2B供应链电商系统平台解决方案，如何实现全网整合B2B供...',
                imageUrl:
                  'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg',
                columnName: '今日热点',
                createTime: '',
                readCount: 20,
              },
            ]}
          />
        </RecommendList>
      </QualityRecommend>
    </div>
  )
}
```
