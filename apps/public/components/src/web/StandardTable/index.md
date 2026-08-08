---
group:
  title: 重型组件
---

# StandardTable

This is an example component.

```jsx
import { StandardTable } from '@apps/components'

export default () => {
  return (
    <StandardTable
      columns={[
        {
          dataIndex: 'id',
          title: 'ID',
        },
        {
          dataIndex: 'name',
          title: '姓名',
        },
      ]}
    />
  )
}
```
