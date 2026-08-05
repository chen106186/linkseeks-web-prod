import React, { useMemo } from 'react'

import { SchemaMarkupField as Field } from '@apps/formily'
import { Row, Col } from 'antd'

type ValueType = {
  name: string
  value: string | number
}

interface Iprops {
  value: ValueType[]
}

const FormilyProductAttrsLayout: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value } = props
  const titleStyle = useMemo(() => {
    return {
      paddingLeft: '8px',
      marginBottom: '24px',
      lineHeight: '14px',
      fontSize: '14px',
      fontWeight: 500,
      borderLeft: '2px solid #00A98F',
    }
  }, [])

  const cacheValue = useMemo(() => value, [value])

  return (
    <>
      {cacheValue?.map((item, key) => {
        return (
          <div key={key} style={key < value.length - 1 ? { marginBottom: '24px' } : {}}>
            <div style={titleStyle}>{item.name}</div>
            <Row>
              <Col span={4} style={{ color: '#909399' }}>
                {item.name}
              </Col>
              <Col span={18}>{item.value}</Col>
            </Row>
          </div>
        )
      })}
    </>
  )
}

FormilyProductAttrsLayout.isFieldComponent = true

export default FormilyProductAttrsLayout
