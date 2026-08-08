---
group:
  title: 小型组件
  order: 1
---

# LineTitle

带有线条的 title

```jsx
import { LineTitle } from '@apps/components'

export default () => <LineTitle>标题</LineTitle>
```

通常可能和卡片组合在一起形成局部表单

```jsx
import { LineTitle } from '@apps/components'
import { Card, Input } from '@linkseeks/ui'

export default () => (
  <Card bodyStyle={{ border: '1px solid red' }}>
    <LineTitle>标题</LineTitle>
    <Input placeholder="菜单名称" />
  </Card>
)
```
