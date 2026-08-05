---
group:
  title: 小型组件
  order: 1
---

# RequireItem

表单自定义必填项

```jsx
import { RequireItem } from '@apps/components'

export default () => <RequireItem label="页面名称" isRequire />
```

表单自定义必填项 带 Tooltip

```jsx
import { RequireItem } from '@apps/components'
import { Tooltip } from '@linkseeks/ui'
import { QuestionCircleIcon } from '@linkseeks/icons'

export default () => (
  <RequireItem
    label="访问链接"
    width={96}
    brief={
      <Tooltip placement="top" title="访问该页面的链接">
        <QuestionCircleIcon size={16} />
      </Tooltip>
    }
  />
)
```
