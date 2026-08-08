import React from 'react'
import { Row, Input, Col, Button } from '@linkseeks/ui'
// import useCountDown from '@/utils/hooks'

const Phone = (props: any) => {
  // const { text, isActive, start } = useCountDown({
  //   maxTime: 60,
  //   minTime: 0,
  //   initText: '获取验证码',
  //   onEnd: () => {},
  //   decayRate: 1,
  //   delay: 1 * 1000,
  // })

  const { value } = props
  return (
    <Row style={{ width: '100%' }}>
      <Col flex={1}>
        <Input value={value || ''} onChange={(e) => props.mutators.change(e.target.value)} {...props} />
      </Col>
      <Col style={{ marginLeft: 8 }}>
        {/* <Button disabled={isActive} style={{ minWidth: 110, marginLeft: 8 }} size="large" onClick={start}>
          {text}
        </Button> */}
      </Col>
    </Row>
  )
}

Phone.defaultProps = {}

Phone.isFieldComponent = true

export default Phone
