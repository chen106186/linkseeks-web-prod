import React, { useRef, useEffect, useState } from 'react'
import { Input } from 'antd'
import styled from 'styled-components'
import { useIntl } from '@linkseeks/i18n'

/**
 * 自定义数值范围控件
 */
const RowStyleLayout = styled((props) => <div {...props} />)`
  .site-input-split {
    background-color: #fff;
  }

  .site-input-right {
    border-left-width: 0;
  }

  .site-input-right:hover,
  .site-input-right:focus {
    border-left-width: 1px;
  }

  .ant-input-rtl.site-input-right {
    border-right-width: 0;
  }

  .ant-input-rtl.site-input-right:hover,
  .ant-input-rtl.site-input-right:focus {
    border-right-width: 1px;
  }
`

const NumberRange = (props) => {
  const { value, mutators } = props
  const intl = useIntl()

  const { placeholder = [], ...rest } = props.props['x-component-props'] || {}

  const [rangeValue, setrangeValue] = useState([])

  useEffect(() => {
    // if(rangeValue.length) {
    mutators.change(rangeValue)
    // }
  }, [rangeValue])

  const loseBlur = (e, index) => {
    setrangeValue(() => {
      let newValue = [...rangeValue]
      newValue[index] = e.target.value
      return newValue
    })
  }

  return (
    <RowStyleLayout>
      <Input.Group compact {...rest}>
        <Input
          style={{
            width: 100,
            textAlign: 'center',
          }}
          placeholder={placeholder[0] || intl.formatMessage({ id: 'components.zuixiaozhi', defaultMessage: '最小值' })}
          onChange={(e) => loseBlur(e, 0)}
          value={value[0] || null}
        />
        <Input
          className="site-input-split"
          style={{
            width: 30,
            borderLeft: 0,
            borderRight: 0,
            pointerEvents: 'none',
            background: '#fff',
          }}
          placeholder="~"
          disabled
        />
        <Input
          className="site-input-right"
          style={{
            width: 100,
            textAlign: 'center',
          }}
          placeholder={placeholder[1] || intl.formatMessage({ id: 'components.zuidazhi', defaultMessage: '最大值' })}
          onChange={(e) => loseBlur(e, 1)}
          value={value[1] || null}
        />
      </Input.Group>
    </RowStyleLayout>
  )
}

NumberRange.defaultProps = {}

NumberRange.isFieldComponent = true

export default NumberRange
