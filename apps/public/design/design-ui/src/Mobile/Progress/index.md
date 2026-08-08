## 进度条

🌰 带文字进度条

```tsx
import React from 'react'
import { Progress } from '@apps/design-ui'

export default () => (
  <>
    <h3>进度条</h3>
    <div
      style={{ width: 360, backgroundColor: '#F7F8FA', padding: '12px 8px' }}
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

### 不带文字

只要去掉 `progressTips` 属性即可

```tsx
import React from 'react'
import { Progress } from '@apps/design-ui'

export default () => (
  <>
    <h3>进度条</h3>
    <div
      style={{ width: 360, backgroundColor: '#F7F8FA', padding: '12px 8px' }}
    >
      <Progress
        percent={30}
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

### 不带右侧文字

只要去掉 `extra` 属性即可

```tsx
import React from 'react'
import { Progress } from '@apps/design-ui'

export default () => (
  <>
    <h3>进度条</h3>
    <div
      style={{ width: 360, backgroundColor: '#F7F8FA', padding: '12px 8px' }}
    >
      <Progress percent={30} />
    </div>
  </>
)
```

### API

|     参数     |    说明    |         类型          |
| :----------: | :--------: | :-------------------: |
|   percent    |   百分比   |        number         |
| progressTips | 进度条文字 |     string(可选)      |
|    extra     | 右侧 Node  | React.ReactNode(可选) |
