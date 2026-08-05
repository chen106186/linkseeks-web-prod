---
group:
  title: 重型组件
---

# UploadImage

和传统的 Upload 组件相比，该组件拥有自动压缩功能，可通过 `compressOptions` 参数进行配置， 其他的和 upload 组件基本相同

若需要查看有关压缩的 API， 可以阅读`@linkseeks/tools` 中的 `fileProcessor/strategy/image.strategy.ts`

```tsx
import { useState } from 'react'
import { UploadImage } from '@apps/components'
import { Button, Upload, UploadProps } from '@linkseeks/ui'
import { FileProcessorFactory, FileType, ImageCompressOptions } from '@linkseeks/tools'
export default () => {
  const [size1, setSize1] = useState<any>('')
  const [img1, setImg1] = useState<any>('')

  const transformSize = (size: number) => {
    return (size / 1024).toFixed(2)
  }
  const upload = async (fileObj) => {
    console.log(fileObj, 'fileObj')
    setSize1(fileObj.file.size)
  }
  return (
    <div>
      <UploadImage showUploadList onChange={upload} listType="text">
        <Button type="primary">点击上传</Button>
      </UploadImage>
      <div>size 为 {transformSize(size1)} KB</div>
    </div>
  )
}
```

### compressOptions

| 参数          | 说明       | 类型                     | 可选值 | 默认值 |
| ------------- | ---------- | ------------------------ | ------ | ------ |
| quality       | 压缩清晰度 | `number`                 |        |        |
| scaleStrategy | 缩放策略   | `(size: number): number` |        |        |
