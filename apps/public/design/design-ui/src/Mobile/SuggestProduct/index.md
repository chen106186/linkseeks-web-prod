## 推荐商品

### 基础用法

[推荐商品](https://codesign.qq.com/workspace/prototype/6dqN292O5q0aBXe/P4VlZMOxJ79q6wL/screen-list)

```tsx
import React from 'react'
import { SuggestProduct, Commodity } from '@apps/design-ui'
import 'antd/dist/antd.less'

const { Items } = SuggestProduct

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

export default () => (
  <div style={{ width: 375, position: 'relative', overFlow: 'hidden' }}>
    <SuggestProduct style={{ position: 'absolute' }}>
      <Items title="精选" explain="为你推荐" isnull={false}>
        <SuggestProduct.Commodity
          name="轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶"
          image="https://oss-business-middle-platform.oss-cn-shenzhen.aliyuncs.com/244c8570a9a8461890aff3964ad72d0b.jpg"
          mode="vertical"
          discountPrice={289.28}
          sold={37}
          buyBtn={false}
          tags={['满300减20']}
        />
        <SuggestProduct.Commodity
          name="轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶"
          image="https://oss-business-middle-platform.oss-cn-shenzhen.aliyuncs.com/244c8570a9a8461890aff3964ad72d0b.jpg"
          mode="vertical"
          discountPrice={289.28}
          sold={37}
          buyBtn={false}
          tags={['满300减20']}
          customerPrice={true}
          max={10}
          min={1}
          cashPriceType={1}
          specification={2}
        />
        <SuggestProduct.Commodity
          name="轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶"
          image="https://oss-business-middle-platform.oss-cn-shenzhen.aliyuncs.com/244c8570a9a8461890aff3964ad72d0b.jpg"
          mode="vertical"
          discountPrice={289.28}
          sold={37}
          buyBtn={false}
          tags={['满300减20']}
          customerPrice={true}
          max={10}
          min={1}
          cashPriceType={1}
          specification={1}
        />
        <SuggestProduct.Commodity
          name="轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶"
          image="https://oss-business-middle-platform.oss-cn-shenzhen.aliyuncs.com/244c8570a9a8461890aff3964ad72d0b.jpg"
          mode="vertical"
          discountPrice={289.28}
          sold={37}
          buyBtn={false}
          tags={['满300减20']}
          customerPrice={true}
          maxSidePrice={10}
          minSidePrice={1}
          cashPriceType={2}
          specification={2}
        />
        <SuggestProduct.Commodity
          name="轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶"
          image="https://oss-business-middle-platform.oss-cn-shenzhen.aliyuncs.com/244c8570a9a8461890aff3964ad72d0b.jpg"
          mode="vertical"
          discountPrice={289.28}
          sold={37}
          buyBtn={false}
          tags={['满300减20']}
          customerPrice={true}
          max={10}
          min={1}
          maxSidePrice={10}
          minSidePrice={1}
          cashPriceType={3}
          specification={2}
        />
        <SuggestProduct.Commodity
          name="轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶"
          image="https://oss-business-middle-platform.oss-cn-shenzhen.aliyuncs.com/244c8570a9a8461890aff3964ad72d0b.jpg"
          mode="vertical"
          discountPrice={289.28}
          sold={37}
          buyBtn={false}
          tags={['满300减20']}
          customerPrice={true}
          max={10}
          min={1}
          maxSidePrice={10}
          minSidePrice={10}
          cashPriceType={3}
          specification={2}
        />
      </Items>
      <Items title="精选店铺" explain="为你推荐" isnull={false} column={1}>
        <SuggestProduct.Store
          id={1}
          logo="https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg"
          memberName="花花供应商"
          registerYears={3}
          creditPoint={888}
          productList={productList}
        />
        <SuggestProduct.Store
          id={1}
          logo="https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg"
          memberName="花花供应商"
          registerYears={3}
          creditPoint={888}
          productList={productList}
        />
      </Items>
      <Items title="精选品牌" explain="为你推荐" isnull={false} column={1}>
        <SuggestProduct.Brand
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
        <SuggestProduct.Brand
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
      </Items>
      <Items title="精选资讯" explain="为你推荐" isnull={false} column={1}>
        <SuggestProduct.Information
          dataList={[
            {
              id: 1,
              title: 'B2B供应链电商系统平台解决方案，如何实现全网整合B2B供...',
              imageUrl:
                'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg',
              columnName: '今日热点',
              createTime: '',
              readCount: 20,
            },
            {
              id: 1,
              title: 'B2B供应链电商系统平台解决方案，如何实现全网整合B2B供...',
              imageUrl:
                'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg',
              columnName: '今日热点',
              createTime: '',
              readCount: 20,
            },
          ]}
        />
        <SuggestProduct.Information
          dataList={[
            {
              id: 1,
              title: 'B2B供应链电商系统平台解决方案，如何实现全网整合B2B供...',
              imageUrl:
                'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg',
              columnName: '今日热点',
              createTime: '',
              readCount: 20,
            },
            {
              id: 1,
              title: 'B2B供应链电商系统平台解决方案，如何实现全网整合B2B供...',
              imageUrl:
                'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/src=http___bpic.588ku.com_element_origin_min_pic_16_09_02_2357c99578ed389.jpg&refer=http___bpic.588kuc6578f1112194105aa761cfc8d7065e8.jpg',
              columnName: '今日热点',
              createTime: '',
              readCount: 20,
            },
          ]}
        />
      </Items>
    </SuggestProduct>
  </div>
)
```

### 编辑状态

[推荐商品](https://codesign.qq.com/workspace/prototype/6dqN292O5q0aBXe/P4VlZMOxJ79q6wL/screen-list)

```tsx
import React from 'react'
import { SuggestProduct, Commodity } from '@apps/design-ui'
import 'antd/dist/antd.less'

const { Items } = SuggestProduct
export default () => (
  <div style={{ width: 375, position: 'relative', overFlow: 'hidden' }}>
    <SuggestProduct style={{ position: 'absolute' }}>
      <Items title="精选" explain="为你推荐" isnull={true}>
        <Commodity
          empty
          name="轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶"
          image="https://oss-business-middle-platform.oss-cn-shenzhen.aliyuncs.com/244c8570a9a8461890aff3964ad72d0b.jpg"
          mode="vertical"
          discountPrice={289.28}
          sold={37}
          buyBtn={false}
          tags={['满300减20']}
        ></Commodity>
      </Items>
      <Items title="精选1" explain="为你推荐" isnull={true}>
        <Commodity
          empty
          name="轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶"
          image="https://oss-business-middle-platform.oss-cn-shenzhen.aliyuncs.com/244c8570a9a8461890aff3964ad72d0b.jpg"
          mode="vertical"
          discountPrice={289.28}
          sold={37}
          buyBtn={false}
          tags={['满300减20']}
        ></Commodity>
        <Commodity
          empty
          name="轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶"
          image="https://oss-business-middle-platform.oss-cn-shenzhen.aliyuncs.com/244c8570a9a8461890aff3964ad72d0b.jpg"
          mode="vertical"
          discountPrice={289.28}
          sold={37}
          buyBtn={false}
          tags={['满300减20']}
        ></Commodity>
      </Items>
      <Items title="精选2" explain="为你推荐" isnull={true}></Items>
      <Items title="精选3" explain="为你推荐" isnull={true}></Items>
    </SuggestProduct>
  </div>
)
```
