---
group:
  title: 布局组件
---

# PageHeaderWrapper

##### 页面标题组件

## 代码演示

###### 标准使用:

```
import { PageHeaderWrapper } from '@apps/components'

export default () => {
  return <PageHeaderWrapper title="进口头层黄牛皮荔枝纹" subTitle="DPTY12" />
}
```

###### 带锚点样式:

```
import { PageHeaderWrapper } from '@apps/components'

export default () => {
  return (
    <PageHeaderWrapper
      title="进口头层黄牛皮荔枝纹"
      subTitle="DPTY12"
      isAnchor
      items={[
        {
          key: 'basicInfo',
          label: '基本信息',
        },
        {
          key: 'orderInfo',
          label: '订单商品 (2)',
        },
        {
          key: 'payInfo',
          label: '支付信息',
        },
        {
          key: 'otherInfo',
          label: '其他信息',
        },
      ]}
    >
      <div id="basicInfo" style={{ height: 120 }}>
        basicInfo
      </div>
      <div id="orderInfo" style={{ height: 120 }}>
        orderInfo
      </div>
      <div id="payInfo" style={{ height: 120 }}>
        payInfo
      </div>
      <div id="otherInfo" style={{ height: 120 }}>
        otherInfo
      </div>
    </PageHeaderWrapper>
  )
}
```

###### 标签页样式:

```
import { PageHeaderWrapper } from '@apps/components'

export default () => {
  return (
    <PageHeaderWrapper
      title="进口头层黄牛皮荔枝纹"
      subTitle="DPTY12"
      isTabs
      items={[
        {
          key: 'basicInfo',
          label: '基本信息',
        },
        {
          key: 'orderInfo',
          label: '订单商品 (2)',
        },
        {
          key: 'payInfo',
          label: '支付信息',
        },
        {
          key: 'otherInfo',
          label: '其他信息',
        },
      ]}
    >
      <div id="basicInfo" style={{ height: 120 }}>
        basicInfo
      </div>
      <div id="orderInfo" style={{ height: 120 }}>
        orderInfo
      </div>
      <div id="payInfo" style={{ height: 120 }}>
        payInfo
      </div>
      <div id="otherInfo" style={{ height: 120 }}>
        otherInfo
      </div>
    </PageHeaderWrapper>
  )
}
```

###### 自定义底部样式:

```
import { PageHeaderWrapper } from '@apps/components'

export default () => {
  return <PageHeaderWrapper title="进口头层黄牛皮荔枝纹" subTitle="DPTY12" footer={<div>footer</div>} />
}
```

## API

### PageHeaderWrapper Props

| **属性名**  | **描述**                      | **类型**                                |
| ----------- | ----------------------------- | --------------------------------------- |
| title       | 标题                          | `string, React.ReactNode`               |
| subTitle    | 子标题                        | `string , React.ReactNode`              |
| isAnchor    | 底部是否是否锚点              | `boolean`                               |
| isTabs      | 底部是否是否锚点              | `boolean`                               |
| affix       | 锚点模式下 affix 固定模式     | `boolean`                               |
| items       | 锚点或标签页数据              | `Array<{ key: string, label: string }>` |
| extra       | 操作区，位于 title 行的行尾   | `React.ReactNode`                       |
| onTabChange | 标签页切换时触发              | `(key: string) => void`                 |
| onBack      | 点击返回按钮时触发            | `() => void`                            |
| backDom     | 返回按钮                      | `boolean, React.ReactNode`              |
| footer      | 页脚部分，一般用于渲染 TabBar | `ReactNode`                             |
| style       | 自定义 style                  | `React.CSSProperties`                   |
| className   | 自定义样式名称                | `string`                                |
