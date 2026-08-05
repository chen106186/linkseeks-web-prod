## 活动卡片

### 基础用法

[特价促销](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/6ym7ZRR5J2ZAYED/screen-list)

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/dist/antd.less'

const { Header, CommonContainer, GoodsItem } = MarketingCard
export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <Header type={1}></Header>
      <CommonContainer>
        <GoodsItem
          img={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          info="打骨折"
          originalPrice="100.00"
          discountPrice="80.00"
          isnull={false}
          key={1}
        />
        <GoodsItem
          img={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          info="打骨折"
          originalPrice="100.00"
          discountPrice="80.00"
          isnull={false}
          key={2}
        />
        <GoodsItem
          img={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          info="打骨折"
          originalPrice="100.00"
          discountPrice="80.00"
          isnull={false}
          key={3}
        />
      </CommonContainer>
    </MarketingCard>
  </div>
)
```

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/dist/antd.less'

const { ChannelHeader, CommonContainer, GoodsItem } = MarketingCard
export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <ChannelHeader type={12} countDown={['10', '08', '07']}></ChannelHeader>
      <CommonContainer>
        <GoodsItem
          img={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          info="打骨折"
          originalPrice="100.00"
          discountPrice="80.00"
          isnull={false}
          key={1}
        />
        <GoodsItem
          img={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          info="打骨折"
          originalPrice="100.00"
          discountPrice="80.00"
          isnull={false}
          key={2}
        />
        <GoodsItem
          img={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          info="打骨折"
          originalPrice="100.00"
          discountPrice="80.00"
          isnull={false}
          key={3}
        />
      </CommonContainer>
    </MarketingCard>
  </div>
)
```

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/dist/antd.less'

const {
  ShopHeader,
  CommonContainer,
  VerticalContainer,
  GoodsItem,
  DetailItem,
  CollageContainerItem,
} = MarketingCard
export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard shopColorType={1}>
      <ShopHeader type={1}></ShopHeader>
      <VerticalContainer>
        <DetailItem
          containStyle={{
            padding: '8px',
            backgroundColor: '#FFF',
          }}
          detail={{
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            originalPrice: '100.00',
            discountPrice: '80.00',
            endTime: 1627372487509,
            label: '2人团',
            people: 1,
            buy: 10,
          }}
          isnull={false}
          detailType="collage"
        />
        <GoodsItem
          img={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          info="打骨折"
          name="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
          originalPrice="100.00"
          discountPrice="80.00"
          isnull={true}
          key={1}
          mode="horizontal"
        />
        <GoodsItem
          img={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          info="打骨折"
          originalPrice="100.00"
          discountPrice="80.00"
          isnull={false}
          name="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
          key={2}
          mode="horizontal"
        />
        <GoodsItem
          img={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          info="打骨折"
          originalPrice="100.00"
          discountPrice="80.00"
          isnull={false}
          name="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
          key={3}
          mode="horizontal"
        />
      </VerticalContainer>
    </MarketingCard>
  </div>
)
```

### 基础编辑状态

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/dist/antd.less'
const { Header, CommonContainer, GoodsItem } = MarketingCard

export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <Header type={1}></Header>
      <CommonContainer>
        <GoodsItem key={1} />
        <GoodsItem key={2} />
        <GoodsItem key={3} />
      </CommonContainer>
    </MarketingCard>
  </div>
)
```

### 秒杀

[秒杀](https://codesign.qq.com/workspace/prototype/eGyOl9yn2V0dxaW/2nL6jgdArz9pJXV/screen-list)

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/dist/antd.less'
const { Header, CommonContainer, GoodsItem } = MarketingCard

export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <Header type={12} countDown={['10', '09', '08']}></Header>
      <CommonContainer>
        <GoodsItem key={1} />
        <GoodsItem key={2} />
        <GoodsItem key={3} />
      </CommonContainer>
    </MarketingCard>
  </div>
)
```

### 优惠券类型

[赠优惠券](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/NlO1Zn3kGRjLMV2/screen-list)

```tsx
import React from 'react'
import { MarketingCard, LocaleProvide } from '@apps/design-ui'
import 'antd/dist/antd.less'
const { Header, CommonContainer, CouponsItem } = MarketingCard

export default () => (
  <div style={{ width: 375 }}>
    <LocaleProvide locale="en-US">
      <MarketingCard>
        <Header type={9} replaceArr={[10]}></Header>
        <CommonContainer span={10} containerScorll={true}>
          <CouponsItem
            money={100}
            info={'满69可使用'}
            tag={'平台通用券'}
            key={1}
            isnull={false}
          />
          <CouponsItem
            money={20}
            info={'满69可使用'}
            tag={'平台通用券'}
            key={2}
            isnull={false}
          />
          <CouponsItem
            money={10}
            info={'满69可使用'}
            tag={'平台通用券'}
            key={3}
            isnull={false}
          />
        </CommonContainer>
      </MarketingCard>
    </LocaleProvide>
  </div>
)
```

### 优惠券编辑状态

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/dist/antd.less'
const { Header, CommonContainer, CouponsItem } = MarketingCard

export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <Header type={9} replaceArr={[10]}></Header>
      <CommonContainer span={10} containerScorll={true}>
        <CouponsItem key={1} />
        <CouponsItem key={2} />
        <CouponsItem key={3} />
      </CommonContainer>
    </MarketingCard>
  </div>
)
```

### 自定义标题

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/dist/antd.less'

const { Header, CommonContainer, GoodsItem } = MarketingCard

export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <Header
        type={1}
        title="自定义titile"
        explain="自定义info"
        icon="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
      ></Header>
      <CommonContainer>
        <GoodsItem
          img={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          info="打骨折"
          originalPrice="100.00"
          discountPrice="80.00"
          isnull={false}
          key={1}
        />
        <GoodsItem
          img={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          info="打骨折"
          originalPrice="100.00"
          discountPrice="80.00"
          isnull={false}
          key={2}
        />
        <GoodsItem
          img={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          info="打骨折"
          originalPrice="100.00"
          discountPrice="80.00"
          isnull={false}
          key={3}
        />
      </CommonContainer>
    </MarketingCard>
  </div>
)
```

### 拼团

[拼团](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/GPEpZGX4EEjw3z7/screen-list)

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/lib/carousel/style/index.less'

const { Header, CollageContainer, CollageContainerItem } = MarketingCard

export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <Header type={13} replaceArr={[10]}></Header>
      <CollageContainer>
        <CollageContainerItem
          detail={{
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            info: '打骨折',
            originalPrice: '100.00',
            discountPrice: '80.00',
            endTime: 1627372487509,
            people: 1,
            id: 1,
          }}
          isnull={false}
          key={1}
        />
        <CollageContainerItem
          detail={{
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            info: '打骨折',
            originalPrice: '100.00',
            discountPrice: '80.00',
            endTime: 1627372487509,
            people: 1,
            id: 2,
          }}
          isnull={false}
          key={2}
        />
        <CollageContainerItem
          detail={{
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            info: '打骨折',
            originalPrice: '100.00',
            discountPrice: '80.00',
            endTime: 1627372487509,
            people: 1,
            id: 3,
          }}
          isnull={false}
          key={3}
        />
        <CollageContainerItem
          detail={{
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            info: '打骨折',
            originalPrice: '100.00',
            discountPrice: '80.00',
            endTime: 1627372487509,
            people: 1,
            id: 4,
          }}
          isnull={false}
          key={4}
        />
        <CollageContainerItem
          detail={{
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            info: '打骨折',
            originalPrice: '100.00',
            discountPrice: '80.00',
            endTime: 1627372487509,
            people: 1,
            id: 5,
          }}
          isnull={false}
          key={5}
        />
        <CollageContainerItem
          detail={{
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            info: '打骨折',
            originalPrice: '100.00',
            discountPrice: '80.00',
            endTime: 1627372487509,
            people: 1,
            id: 6,
          }}
          isnull={false}
          key={6}
        />
        <CollageContainerItem
          detail={{
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            info: '打骨折',
            originalPrice: '100.00',
            discountPrice: '80.00',
            endTime: 1627372487509,
            people: 1,
            id: 6,
          }}
          isnull={false}
          key={7}
        />
      </CollageContainer>
    </MarketingCard>
  </div>
)
```

### 拼团编辑

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/lib/carousel/style/index.less'

const { Header, CollageContainer, CollageContainerItem } = MarketingCard

export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <Header type={13} replaceArr={[10]}></Header>
      <CollageContainer>
        <CollageContainerItem detail={{}} key={1} />
        <CollageContainerItem detail={{}} key={2} />
        <CollageContainerItem detail={{}} key={3} />
        <CollageContainerItem detail={{}} key={4} />
        <CollageContainerItem detail={{}} key={5} />
        <CollageContainerItem detail={{}} key={6} />
      </CollageContainer>
    </MarketingCard>
  </div>
)
```

### 套餐

[套餐](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/kv8398APJm0nKeg/screen-list)

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/lib/carousel/style/index.less'

const {
  Header,
  PackageContainer,
  PackageContainerTabs,
  PackageContainerTabsTabPane,
  DetailItem,
  GoodsItem,
} = MarketingCard

export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <Header type={18}></Header>
      <PackageContainer>
        <DetailItem
          detail={{
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            discountPrice: '800.00',
            buy: 10,
          }}
          isnull={false}
          detailType="package"
          tag="购买商品"
        />
        <PackageContainerTabs>
          <PackageContainerTabsTabPane
            title="套餐一"
            key={0}
            containerScorll={true}
          >
            <GoodsItem
              key={`GoodsItem-1-1`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
              isnull={false}
            />
            <GoodsItem
              key={`GoodsItem-1-2`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
              isnull={false}
            />
            <GoodsItem
              key={`GoodsItem-1-3`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
              isnull={false}
            />
            <GoodsItem
              key={`GoodsItem-1-4`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
              isnull={false}
            />
          </PackageContainerTabsTabPane>
          <PackageContainerTabsTabPane
            title="套餐二"
            key={1}
            containerScorll={true}
          >
            <GoodsItem
              key={`GoodsItem-2-1`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
              isnull={false}
            />
            <GoodsItem
              key={`GoodsItem-2-2`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
              isnull={false}
            />
            <GoodsItem
              key={`GoodsItem-2-3`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
              isnull={false}
            />
            <GoodsItem
              key={`GoodsItem-2-4`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
              isnull={false}
            />
          </PackageContainerTabsTabPane>
        </PackageContainerTabs>
      </PackageContainer>
    </MarketingCard>
  </div>
)
```

### 套餐编辑

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/lib/carousel/style/index.less'

const {
  Header,
  PackageContainer,
  PackageContainerTabs,
  PackageContainerTabsTabPane,
  DetailItem,
  GoodsItem,
} = MarketingCard

export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <Header type={18}></Header>
      <PackageContainer>
        <DetailItem
          detail={{
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            discountPrice: '800.00',
            buy: 10,
          }}
          detailType="package"
          tag="购买商品"
        />
        <PackageContainerTabs>
          <PackageContainerTabsTabPane
            title="套餐一"
            key={0}
            containerScorll={true}
          >
            <GoodsItem
              key={`GoodsItem-1-1`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
            />
            <GoodsItem
              key={`GoodsItem-1-2`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
            />
            <GoodsItem
              key={`GoodsItem-1-3`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
            />
            <GoodsItem
              key={`GoodsItem-1-4`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
            />
          </PackageContainerTabsTabPane>
          <PackageContainerTabsTabPane
            title="套餐二"
            key={1}
            containerScorll={true}
          >
            <GoodsItem
              key={`GoodsItem-2-1`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
            />
            <GoodsItem
              key={`GoodsItem-2-2`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
            />
            <GoodsItem
              key={`GoodsItem-2-3`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
            />
            <GoodsItem
              key={`GoodsItem-2-4`}
              title="SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml"
              img="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
              discountPrice="80.00"
              endTime={1627372487509}
              people={1}
            />
          </PackageContainerTabsTabPane>
        </PackageContainerTabs>
      </PackageContainer>
    </MarketingCard>
  </div>
)
```

### 赠送商品

[赠送商品](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/OEvq0rpk5aj3PAY/screen-list)

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/lib/carousel/style/index.less'

const { Header, PackageContainer, GiveContainer, GiveContainerItem } =
  MarketingCard

export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <Header type={8}></Header>
      <GiveContainer>
        <GiveContainerItem
          isnull={false}
          childType="goods"
          detail={{
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            discountPrice: '800.00',
            originalPrice: '800.00',
            goodsSubsidiaryGroupList: [
              {
                limitValue: 2,
                goodsSubsidiaryGroupDetailsList: [
                  {
                    productImgUrl:
                      'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
                    price: '100',
                    num: 1,
                  },
                  {
                    productImgUrl:
                      'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
                    price: '100',
                    num: 2,
                  },
                ],
              },
              {
                limitValue: 3,
                goodsSubsidiaryGroupDetailsList: [
                  {
                    productImgUrl:
                      'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
                    price: '100',
                    num: 1,
                  },
                  {
                    productImgUrl:
                      'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
                    price: '100',
                    num: 1,
                  },
                ],
              },
            ],
          }}
        />
      </GiveContainer>
    </MarketingCard>
  </div>
)
```

### 赠送优惠券

[赠送优惠券](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/OEvq0rpk5aj3PAY/screen-list)

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/lib/carousel/style/index.less'

const { Header, PackageContainer, GiveContainer, GiveContainerItem } =
  MarketingCard

export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <Header type={9}></Header>
      <GiveContainer>
        <GiveContainerItem
          isnull={false}
          childType="coupons"
          detail={{
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            discountPrice: '800.00',
            originalPrice: '800.00',
            giveCouponList: [
              {
                limitValue: 2,
                list: [
                  {
                    typeName: '商家优惠券',
                    denomination: 10,
                    useConditionMoney: 20,
                    num: 2,
                  },
                  {
                    typeName: '商家优惠券',
                    denomination: 100,
                    useConditionMoney: 1,
                    num: 1,
                  },
                ],
              },
              {
                limitValue: 2,
                list: [
                  {
                    typeName: '商家优惠券',
                    denomination: 10,
                    useConditionMoney: 20,
                    num: 2,
                  },
                  {
                    typeName: '商家优惠券',
                    denomination: 100,
                    useConditionMoney: 1,
                    num: 1,
                  },
                ],
              },
            ],
          }}
        />
      </GiveContainer>
    </MarketingCard>
  </div>
)
```

### 赠送优惠券/商品编辑

[赠送优惠券](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/OEvq0rpk5aj3PAY/screen-list)

```tsx
import React from 'react'
import { MarketingCard } from '@apps/design-ui'
import 'antd/lib/carousel/style/index.less'

const { Header, PackageContainer, GiveContainer, GiveContainerItem } =
  MarketingCard

export default () => (
  <div style={{ width: 375 }}>
    <MarketingCard>
      <Header type={9}></Header>
      <GiveContainer>
        <GiveContainerItem
          isnull={true}
          childType="coupons"
          detail={{
            img: 'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg',
            title:
              'SILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946mlSILK香草味豆奶汁营养早餐富含植物奶高钙膳食纤维饮946ml',
            discountPrice: '800.00',
            originalPrice: '800.00',
            giveCouponList: [
              {
                limitValue: 2,
                list: [
                  {
                    typeName: '商家优惠券',
                    denomination: 10,
                    useConditionMoney: 20,
                    num: 2,
                  },
                  {
                    typeName: '商家优惠券',
                    denomination: 100,
                    useConditionMoney: 1,
                    num: 1,
                  },
                ],
              },
              {
                limitValue: 2,
                list: [
                  {
                    typeName: '商家优惠券',
                    denomination: 10,
                    useConditionMoney: 20,
                    num: 2,
                  },
                  {
                    typeName: '商家优惠券',
                    denomination: 100,
                    useConditionMoney: 1,
                    num: 1,
                  },
                ],
              },
            ],
          }}
        />
      </GiveContainer>
    </MarketingCard>
  </div>
)
```
