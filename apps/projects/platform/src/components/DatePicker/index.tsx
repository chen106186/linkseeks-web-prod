import React, { useState } from 'react'
import { Form, DatePicker, Row, Col } from 'antd'
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'

interface DatePickerSelectPropsType {
  /** 开始时间name */
  startTimeName?: string
  /** 结束时间name */
  endTimeName?: string
  /** ononPress */
  onPress?: () => void
  /** mode */
  mode?: any
}

const intl = getIntl()
const DatePickerSelect: React.FC<DatePickerSelectPropsType> = (props) => {
  const { startTimeName, endTimeName, onPress, mode = 'date' } = props
  const [timeList, setTimeList] = useState<Array<any>>([])

  /**
   * 1. 开始时间选择: 只能选择当日的
   * 2. 结束时间选择: 只能选择大于开始时间的
   * 3. 结束时间先选: 大于单日
   * 4. 结束时间先选然后在选开始时间: 只能选当日时间并且不能选择大于结束时间
   */
  const startDisabledDate = (current) => {
    const startTime = timeList[0] && current < timeList[0]
    const endTime = timeList[1] && current > timeList[1]
    return startTime || endTime || (current && current < moment().startOf('day'))
  }
  const endDisabledDate = (current) => {
    const startTime = timeList[0] && current < timeList[0]
    const endTime = timeList[1] && current >= timeList[1]
    return startTime || endTime || (current && current < moment().endOf('day'))
  }
  const startTimeChange = (val) => {
    let time = [...timeList]
    time[0] = val
    if (onPress) {
      if (time[0] && time[1]) {
        onPress()
      }
    }

    setTimeList(time)
  }
  const endStartTimeChange = (val) => {
    let time = [...timeList]
    time[1] = val
    if (onPress) {
      if (time[0] && time[1]) {
        onPress()
      }
    }
    setTimeList(time)
  }
  return (
    <Row>
      <Col span={11}>
        <Form.Item
          name={startTimeName}
          rules={[{ required: true, message: intl.formatMessage({ id: 'components.qingxuanzekaishiriqi' }) }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'components.xuanzekaishiriqi' })}
            format="YYYY-MM-DD"
            onChange={(val) => startTimeChange(val)}
            disabledDate={startDisabledDate}
            mode={mode}
          />
        </Form.Item>
      </Col>
      <Col span={2}>
        <span
          style={{
            display: 'flex',
            textAlign: 'center',
            height: '45%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          ~
        </span>
      </Col>
      <Col span={11}>
        <Form.Item
          name={endTimeName}
          rules={[{ required: true, message: intl.formatMessage({ id: 'components.qingxuanzejieshuriqi' }) }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            placeholder={intl.formatMessage({ id: 'components.xuanzejieshuriqi' })}
            disabledDate={endDisabledDate}
            onChange={(val) => endStartTimeChange(val)}
            mode={mode}
          />
        </Form.Item>
      </Col>
    </Row>
  )
}
DatePickerSelect.displayName = 'DatePicker'
DatePickerSelect.defaultProps = {
  startTimeName: intl.formatMessage({ id: 'components.kaishishijian' }),
  endTimeName: intl.formatMessage({ id: 'components.jieshushijian' }),
}
export default DatePickerSelect
