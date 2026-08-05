import React from 'react'
import { Row, Col } from 'antd'
import classNames from 'classnames'

import styles from './index.less'

interface ButtonRadioValue {
  label: string
  value: number
}

interface ButtonRadioProps {
  data?: ButtonRadioValue[]
  actValue?: number
  onTab?: (value: number) => void
}

const ButtonRadio: React.FC<ButtonRadioProps> = (props: ButtonRadioProps) => {
  const { data, actValue, onTab } = props
  if (!data || data.length <= 0) {
    return null
  }

  const isAct = (value: number) => {
    return value === actValue
  }

  return (
    <Row className={styles['buttonRadio']}>
      {data?.map((item, index) => (
        <Col key={`${item.label}_${index}`}>
          <div
            className={classNames(styles['buttonRadio-btn'], { [styles['buttonRadio-btn-act']]: isAct(item.value) })}
            onClick={() => {
              onTab?.(item.value)
            }}
          >
            {item.label}
            {isAct(item.value) ? <div className={styles['buttonRadio-bar']} /> : null}
          </div>
        </Col>
      ))}
    </Row>
  )
}

export default ButtonRadio
