## Tag 标签

[商品组件](https://codesign.qq.com/workspace/prototype/XJMwy0b2Vy0O6LB/nGaV968raNZPqwd/inspect)

🌰

```tsx
import React from 'react'
import { Commodity, Progress, CustomizeTag } from '@apps/design-ui'
import { TagOutlined } from '@ant-design/icons'
import { Row, Col } from 'antd'

export default () => (
  <>
    <h3>tag</h3>
    <div style={{ width: 360, display: 'flex', flexDirection: 'row' }}>
      <Row gutter={[8, 8]}>
        <Col>
          <CustomizeTag type="primary">primary</CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag type="danger">danger</CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag type="success">success</CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag type="warn">warn</CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag type="default">default</CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag type="purple">purple</CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag type="main">main</CustomizeTag>
        </Col>
      </Row>
    </div>
  </>
)
```

## 带 icon 的 Tag

```tsx
import React from 'react'
import { Commodity, Progress, CustomizeTag } from '@apps/design-ui'
import { TagOutlined } from '@ant-design/icons'
import { Row, Col } from 'antd'

export default () => (
  <>
    <h3>tag</h3>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Row gutter={[8, 8]}>
        <Col>
          <CustomizeTag icon={<TagOutlined />} type="primary">
            primary
          </CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag icon={<TagOutlined />} type="danger">
            danger
          </CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag icon={<TagOutlined />} type="success">
            success
          </CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag icon={<TagOutlined />} type="warn">
            warn
          </CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag icon={<TagOutlined />} type="default">
            default
          </CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag icon={<TagOutlined />} type="purple">
            purple
          </CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag
            mode="doubleColor"
            background="#FFF0F2"
            color="#EF3346"
            icon={<TagOutlined />}
            type="purple"
          >
            purple
          </CustomizeTag>
        </Col>
      </Row>
    </div>
  </>
)
```

### 双色调

```tsx
import React from 'react'
import { Commodity, Progress, CustomizeTag } from '@apps/design-ui'
import { TagOutlined } from '@ant-design/icons'
import { Row, Col } from 'antd'

export default () => (
  <>
    <h3>tag</h3>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Row gutter={[8, 8]}>
        <Col>
          <CustomizeTag
            mode="doubleColor"
            background="#FFF0F2"
            color="#EF3346"
            icon={<TagOutlined />}
            type="purple"
          >
            purple
          </CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag
            mode="doubleColor"
            background="#fff0f6"
            color="#c41d7f"
            icon={<TagOutlined />}
            type="purple"
          >
            purple
          </CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag
            mode="doubleColor"
            background="#fffbe6"
            color="#d48806"
            icon={<TagOutlined />}
            type="purple"
          >
            purple
          </CustomizeTag>
        </Col>
      </Row>
    </div>
  </>
)
```

### 双色调 type

```tsx
import React from 'react'
import { Commodity, Progress, CustomizeTag } from '@apps/design-ui'
import { TagOutlined } from '@ant-design/icons'
import { Row, Col } from 'antd'

export default () => (
  <>
    <h3>tag</h3>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Row gutter={[8, 8]}>
        <Col>
          <CustomizeTag mode="doubleColor" icon={<TagOutlined />} type="purple">
            purple
          </CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag mode="doubleColor" icon={<TagOutlined />} type="danger">
            purple
          </CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag mode="doubleColor" icon={<TagOutlined />} type="main">
            success
          </CustomizeTag>
        </Col>
        <Col>
          <CustomizeTag
            mode="doubleColor"
            icon={<TagOutlined />}
            type="main"
            name="main"
          />
        </Col>
      </Row>
    </div>
  </>
)
```

<API></API>
