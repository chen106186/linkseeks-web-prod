import React from 'react'
import { Form, Row, Col, Input, Select, Space, DatePicker, FormInstance } from 'antd'
import { EventEmitter } from '@linkseeks/hooks'
import moment from 'moment'
import { Card as CardLayout } from '@linkseeks/ui'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

interface BasicInfoProps {
  focus$?: EventEmitter<void>
  /** FormInstance */
  form?: FormInstance
  /** 是否编辑 */
  isEdit?: boolean
}

const avtivityTypes = [
  { lable: `${intl.formatMessage({ id: 'selfManagement.noSales' })}`, value: 1 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.straightDownThePromotion' })}`, value: 2 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.salesPromotion' })}`, value: 3 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.fullAmountOfThePromotion' })}`, value: 4 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.quotaPromotion' })}`, value: 5 },
  // { lable: `${intl.formatMessage({ id: 'selfManagement.giftPromotion' })}`, value: 6 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.moreThanAPromotion' })}`, value: 7 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.combinationOfPromotion' })}`, value: 8 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.spellGroup' })}`, value: 9 },
  // { lable: `${intl.formatMessage({ id: 'selfManagement.luckyDraw' })}`, value: 10 },
  // { lable: `${intl.formatMessage({ id: 'selfManagement.bargaining' })}`, value: 11 },
  { lable: `${intl.formatMessage({ id: 'selfManagement.secondsKill' })}`, value: 12 },
  // { lable: `${intl.formatMessage({ id: 'selfManagement.buy' })}`, value: 13 },
  // { lable: `${intl.formatMessage({ id: 'selfManagement.openToBooking' })}`, value: 14 },
  // { lable: `${intl.formatMessage({ id: 'selfManagement.package' })}`, value: 15 },
  // { lable: `${intl.formatMessage({ id: 'selfManagement.theTrial' })}`, value: 16 },
]

const BasicInfoLayout: React.FC<BasicInfoProps> = (props: any) => {
  const { focus$, form, isEdit } = props

  const startTimeDisabled = (current, name) => {
    const _endTime = form.getFieldValue(name)
    if (_endTime) {
      return (
        current &&
        (current < moment().max(_endTime).startOf('hour') || moment(_endTime).diff(moment(current), 'hour') < 1)
      )
    } else {
      return current && current < moment().startOf('hour')
    }
  }

  const endTimeDisabled = (current, name) => {
    const _startTime = form.getFieldValue(name)
    if (_startTime) {
      return (
        current &&
        (current < moment().min(_startTime).startOf('hour') || moment(current).diff(moment(_startTime), 'hour') < 1)
      )
    } else {
      return current && current < moment().startOf('hour')
    }
  }

  const handleChange = (e, option) => {
    focus$.emit(option)
  }

  return (
    <CardLayout
      id="basicInfoLayout"
      title={intl.formatMessage({ id: 'selfManagement.theBasicInformation' })}
      bodyStyle={{ paddingBottom: '0px' }}
    >
      <Row gutter={[48, 24]}>
        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'selfManagement.theNameOfTheEvent' })}
            name="activityName"
            rules={[{ required: true, message: `${intl.formatMessage({ id: 'selfManagement.pleaseEnterAName' })}` }]}
          >
            <Input
              maxLength={30}
              placeholder={intl.formatMessage({ id: 'selfManagement.longestCharactersCharacters' })}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'selfManagement.theActivityType' })}
            name="activityType"
            initialValue={1}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectTheActivityType' })}`,
              },
            ]}
          >
            <Select onChange={handleChange} disabled={isEdit}>
              {avtivityTypes.map((item) => (
                <Select.Option key={'ACTIVITY_TYPE' + item.value} value={item.value}>
                  {item.lable}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'selfManagement.theActivityTime' })}
            style={{ margin: 0 }}
            required
          >
            <Space style={{ display: 'flex' }} align="baseline">
              <Form.Item
                name="startTime"
                validateFirst
                rules={[
                  {
                    required: true,
                    validator: (_, value) => {
                      const _signUpEndTime = form.getFieldValue('signUpEndTime')
                      if (!value) {
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.pleaseSelectStartTime' })}`),
                        )
                      }
                      if (_signUpEndTime && !moment(value).isAfter(_signUpEndTime)) {
                        return Promise.reject(
                          new Error(`${intl.formatMessage({ id: 'selfManagement.activitiesGreater' })}`),
                        )
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <DatePicker
                  showTime
                  showNow={false}
                  allowClear
                  disabledDate={(current) => startTimeDisabled(current, 'endTime')}
                />
              </Form.Item>
              ~
              <Form.Item
                name="endTime"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({ id: 'selfManagement.pleaseSelectActivityOverTime' })}`,
                  },
                ]}
              >
                <DatePicker
                  showTime
                  showNow={false}
                  allowClear
                  disabledDate={(current) => endTimeDisabled(current, 'startTime')}
                />
              </Form.Item>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </CardLayout>
  )
}
export default BasicInfoLayout
