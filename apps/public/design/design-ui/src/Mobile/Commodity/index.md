## 活动商品

[商品组件](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/nGaV968raNZPqwd/inspect)

🌰

```tsx
import React from 'react'
import { Commodity, Progress } from '@apps/design-ui'
import { TagOutlined } from '@ant-design/icons'

export default () => (
  <>
    <h3>商品</h3>
    <div
      style={{ width: 360, backgroundColor: '#F7F8FA', padding: '12px 8px' }}
    >
      <Commodity
        name="轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶"
        image="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        mode="horizontal"
        discountPrice={289.28}
        tags={[
          {
            type: 'purple',
            icon: <TagOutlined />,
            name: '满300减20',
          },
        ]}
        buyBtnType="purple"
        originalPrice={300}
      ></Commodity>
    </div>
    <div
      style={{ width: 360, backgroundColor: '#F7F8FA', padding: '12px 8px' }}
    >
      <Commodity
        name="轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶"
        image="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        mode="horizontal"
        discountPrice={289.28}
        progress={
          <Progress
            percent={30}
            progressTips={'剩余32%'}
            extra={
              <div
                style={{
                  fontSize: '10px',
                  color: '#919598',
                  marginLeft: '30px',
                  minWidth: '80px',
                }}
              >
                已送出<span style={{ color: '#ef3346' }}>312</span>件
              </div>
            }
          />
        }
        buyBtnType="purple"
        originalPrice={300}
      ></Commodity>
    </div>
    <div
      style={{
        width: 175,
        marginTop: 35,
        backgroundColor: '#F7F8FA',
        padding: '12px 8px',
      }}
    >
      <Commodity
        name="轩妈家蛋黄酥6枚 雪媚娘糕点点心网红零食休闲小吃食品早餐下午茶"
        image="https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg"
        mode="vertical"
        discountPrice={289.28}
        sold={37}
        buyBtn={false}
        tags={['满300减20']}
      ></Commodity>
    </div>
    <div
      style={{
        width: 333,
        marginTop: 35,
        backgroundColor: '#F7F8FA',
        padding: '12px 8px',
      }}
    >
      <Progress
        percent={30}
        progressTips={'剩余32%'}
        extra={
          <div
            style={{
              fontSize: '10px',
              color: '#919598',
              marginLeft: '30px',
              minWidth: '80px',
            }}
          >
            已送出<span style={{ color: '#ef3346' }}>312</span>件
          </div>
        }
      />
    </div>
  </>
)
```

## 空状态

```tsx
import React from 'react'
import { Commodity, Progress } from '@apps/design-ui'
import { TagOutlined } from '@ant-design/icons'

export default () => {
  return (
    <div
      style={{
        width: 175,
        marginTop: 35,
        backgroundColor: '#F7F8FA',
        padding: '12px 8px',
      }}
    >
      <Commodity empty mode={'vertical'}></Commodity>
    </div>
  )
}
```

## 简单商品 SimpleCommodity

```tsx
import React from 'react'
import { SimpleCommodity, Progress, CustomizeTag } from '@apps/design-ui'
import { TagOutlined } from '@ant-design/icons'

export default () => {
  return (
    <div
      style={{
        width: 128,
        marginTop: 35,
        backgroundColor: '#F7F8FA',
        padding: '12px 8px',
      }}
    >
      <SimpleCommodity
        image={
          'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
        }
        originalPrice={266}
        discount={198.88}
      ></SimpleCommodity>

      <div style={{ marginTop: '12px' }}>
        <SimpleCommodity
          image={
            'https://img2.baidu.com/it/u=4073850171,2776482768&fm=26&fmt=auto&gp=0.jpg'
          }
          discount={198.88}
          footer={
            <CustomizeTag
              mode="doubleColor"
              background="#fffbe6"
              color="#d48806"
              icon={<TagOutlined />}
              type="purple"
            >
              purple
            </CustomizeTag>
          }
        ></SimpleCommodity>
      </div>
    </div>
  )
}
```

### API

|     参数      |        说明        |                                  类型                                  |
| :-----------: | :----------------: | :--------------------------------------------------------------------: |
|     name      |       商品名       |                                 string                                 |
|     image     |      商品图片      |                                 string                                 |
|     mode      |        方向        |                   `horizonal(横向)， vertical(纵向)`                   |
| discountPrice |       折扣价       |                                 number                                 |
| originalPrice |        原价        |                             `number(可选)`                             |
|     sold      |       已售出       |                             `number(可选)`                             |
|     tags      |        标签        |              `string[]` 或者 `WithNameType[]` 或者 `null`              |
|    buyBtn     | 是否有立即购买按钮 |                 `boolean (当自定义footer时该属性没用)`                 |
|  buyBtnText   |      按钮文案      |        `string(当自定义footer时或者buyBtn = false, 该属性没用)`        |
|  buyBtnType   |      按钮类型      | `"danger" , "purple" (当自定义footer时或者buyBtn = false, 该属性没用)` |
|   progress    |       进度条       |                    [进度条(可选)](/mobile/progress)                    |
|    footer     |   自定义 footer    |                        `React.ReactNode(可选)`                         |

### WithNameType 类型

| 参数 |   说明   |               类型                |
| :--: | :------: | :-------------------------------: |
| type |   类型   | [Tag 类型](/mobile/customize-tag) |
| name | tag 文案 |              string               |
| icon |   icon   |       React.ReactNode(可选)       |
