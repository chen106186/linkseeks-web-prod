---
group:
  title: 小型组件
  order: 6
---

# FileList

文件列表

```jsx
import { FileList } from '@apps/components'

const fileList = [
  'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/logo6a3124e01b0547ff89bcc338155f14b8.png',
  'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/text37ed8af7d43949618fa6681d69d6b5d1.txt',
]

export default () => <FileList fileList={fileList} />
```

文件列表 - 图片文件预览

```jsx
import { FileList } from '@apps/components'

const fileList = [
  'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/logo6a3124e01b0547ff89bcc338155f14b8.png',
  'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/text37ed8af7d43949618fa6681d69d6b5d1.txt',
]

export default () => <FileList imagePreview fileList={fileList} />
```

单个文件 - 图片

```jsx
import { FileItem } from '@apps/components'

const imageFile = 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/logo6a3124e01b0547ff89bcc338155f14b8.png'

export default () => <FileItem imagePreview file={imageFile} />
```

单个文件 - 文本

```jsx
import { FileItem } from '@apps/components'

const txtfile = 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com/text37ed8af7d43949618fa6681d69d6b5d1.txt'

export default () => <FileItem file={txtfile} />
```
