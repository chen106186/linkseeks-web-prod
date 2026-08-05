---
group:
  title: 小型组件
  order: 4
---

# ImageBox

##### 图片组件

## 代码演示

###### 标准使用:

```jsx
import { ImageBox } from '@apps/components'

export default () => {
  return (
    <ImageBox
      width={64}
      height={64}
      src="https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/1663676150949c5849b39c38845a3a6a84b6d5a5a25cb.jpg"
    />
  )
}
```

###### 圆角图片/圆形图片

```jsx
import { Space } from '@linkseeks/ui'
import { ImageBox } from '@apps/components'

export default () => {
  return (
    <Space>
      <ImageBox
        width={64}
        height={64}
        round={8}
        src="https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/1663676150949c5849b39c38845a3a6a84b6d5a5a25cb.jpg"
      />
      <ImageBox
        width={64}
        height={64}
        circle
        src="https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/1663676150949c5849b39c38845a3a6a84b6d5a5a25cb.jpg"
      />
    </Space>
  )
}
```

###### 图片预览

```jsx
import { Space } from '@linkseeks/ui'
import { ImageBox } from '@apps/components'

export default () => {
  return (
    <Space>
      <ImageBox
        width={200}
        round={8}
        preview
        src="https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/1663676150949c5849b39c38845a3a6a84b6d5a5a25cb.jpg"
      />
    </Space>
  )
}
```

###### 图片缩放模式

```jsx
import { Space } from '@linkseeks/ui'
import { ImageBox } from '@apps/components'

const imgUrl = 'https://www.linkseeks.com/themes/default/web/public/assets/images/logo2.png'

export default () => {
  return (
    <Space>
      <div>
        <p>默认：contain</p>
        <ImageBox width={120} height={120} round={8} resizeMode="contain" src={imgUrl} />
      </div>
      <div>
        <p>cover</p>
        <ImageBox width={120} height={120} round={8} src={imgUrl} />
      </div>
      <div>
        <p>fill</p>
        <ImageBox width={120} height={120} round={8} resizeMode="fill" src={imgUrl} />
      </div>
      <div>
        <p>scale-down</p>
        <ImageBox width={120} height={120} round={8} resizeMode="scale-down" src={imgUrl} />
      </div>
      <div>
        <p>none</p>
        <ImageBox width={120} height={120} round={8} resizeMode="none" src={imgUrl} />
      </div>
    </Space>
  )
}
```

## API

### ImageBoxProps Props

| **属性名** | **描述**         | **类型**                                              |
| ---------- | ---------------- | ----------------------------------------------------- |
| src        | 图片链接         | `string`                                              |
| width      | 图片宽度         | `number`                                              |
| height     | 图片高度         | `number`                                              |
| preview    | 是否可以预览     | `boolean`                                             |
| resizeMode | 图片缩放模式     | `"contain"，"cover" ，"fill" ，"none" ，"scale-down"` |
| round      | 圆角大小，默认 0 | `number`                                              |
| circle     | 是否圆角         | `boolean`                                             |
