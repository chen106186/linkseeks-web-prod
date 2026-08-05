import React, { useEffect, useState } from 'react'
import { Card as CardLayout } from '@linkseeks/ui'
import { Form, Row, Col, Input, Select, Radio, Tooltip, Space, DatePicker } from 'antd'
import { FormInstance } from 'antd/es/form/Form'
import { EventEmitter } from '@linkseeks/hooks'
import moment from 'moment'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import {
  AVTIVITY_SIGNUP_MERCHANTREG,
  AVTIVITY_SIGNUP_PLATFORM,
  AVTIVITY_TYPE_LOTTERY,
} from '@/constants/const/marketing'

const { Option } = Select
const text =
  '商家报名活动指由平台建立的，商家参与的营销活动，平台创建活动后，不设置活动商品，由商家报名参加，活动商品由平台从报名通过的商家商品中选择。平台自建活动为平台单独使用的活动，目前平台自建活动仅支持抽奖活动。'

interface BasicInfoProps {
  /** 活动类型 */
  avtivityTypes: any[]
  focus$?: EventEmitter<void>
  /** FormInstance */
  form?: FormInstance
  /** 是否编辑 */
  isEdit?: boolean
}

const BasicInfoLayout: React.FC<BasicInfoProps> = (props: any) => {
  const { focus$, form, isEdit, avtivityTypes } = props
  const [activitySignUpType, setActivitySignUpType] = useState<Number>(0)

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
    if (e !== AVTIVITY_TYPE_LOTTERY) {
      setActivitySignUpType(AVTIVITY_SIGNUP_MERCHANTREG)
      form.setFieldsValue({ activitySignUpType: AVTIVITY_SIGNUP_MERCHANTREG })
    } else {
      setActivitySignUpType(AVTIVITY_SIGNUP_PLATFORM)
      form.setFieldsValue({ activitySignUpType: AVTIVITY_SIGNUP_PLATFORM })
    }
    focus$.emit(option)
  }

  useEffect(() => {
    if (isEdit) {
      setActivitySignUpType(AVTIVITY_SIGNUP_MERCHANTREG)
      form.setFieldsValue({ activitySignUpType: AVTIVITY_SIGNUP_MERCHANTREG })
    }
  }, [isEdit])

  return (
    <CardLayout id="basicInfoLayout" title="基本信息" bodyStyle={{ paddingBottom: '0px' }}>
      <Row gutter={[48, 24]}>
        <Col span={12}>
          <Form.Item label="活动名称" name="activityName" rules={[{ required: true, message: '请输入活动名称' }]}>
            <Input maxLength={30} placeholder="最长60字符，30个汉字" />
          </Form.Item>
          <Form.Item label="活动类型" name="activityType" rules={[{ required: true, message: '请输入活动名称' }]}>
            <Select placeholder="请选择活动类型" onChange={handleChange} disabled={isEdit}>
              {!isEmpty(avtivityTypes) &&
                avtivityTypes.map((item) => (
                  <Option key={'ACTIVITY_TYPE' + item.value} value={item.value}>
                    {item.lable}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="activitySignUpType"
            label={
              <Tooltip placement="top" title={text}>
                活动参与类型
                <QuestionCircleOutlined style={{ marginLeft: '5px' }} />
              </Tooltip>
            }
            rules={[{ required: true, message: '请输入活动名称' }]}
          >
            <Radio.Group disabled>
              <Radio value={AVTIVITY_SIGNUP_MERCHANTREG}>商家报名活动</Radio>
              <Radio value={AVTIVITY_SIGNUP_PLATFORM}>平台自建活动</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="活动时间" style={{ margin: 0 }} required>
            <Space style={{ display: 'flex' }} align="baseline">
              <Form.Item
                name="startTime"
                validateFirst
                dependencies={['signUpStartTime', 'endTime', 'signUpEndTime']}
                rules={[
                  {
                    required: true,
                    message: '请选择活动开始时间',
                  },
                  ({ getFieldValue }) => ({
                    validator: (_rule, value) => {
                      const _endTime = getFieldValue('endTime')
                      const _signUpStartTime = getFieldValue('signUpStartTime')
                      const _signUpEndTime = getFieldValue('signUpEndTime')
                      if (_endTime && !moment(value).isBefore(_endTime)) {
                        return Promise.reject(new Error('活动开始时间必须小于活动结束时间'))
                      }
                      if (_signUpStartTime && !moment(value).isAfter(_signUpStartTime)) {
                        return Promise.reject(new Error('活动开始时间必须大于报名开始时间'))
                      }
                      if (_signUpEndTime && !moment(value).isAfter(_signUpEndTime)) {
                        return Promise.reject(new Error('活动开始时间必须大于报名结束时间'))
                      }
                      return Promise.resolve()
                    },
                  }),
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
                validateFirst
                dependencies={['signUpStartTime', 'startTime', 'signUpEndTime']}
                rules={[
                  {
                    required: true,
                    message: '请选择活动结束时间',
                  },
                  ({ getFieldValue }) => ({
                    validator: (_rule, value) => {
                      const _startTime = getFieldValue('startTime')
                      const _signUpStartTime = getFieldValue('signUpStartTime')
                      const _signUpEndTime = getFieldValue('signUpEndTime')
                      if (_startTime && !moment(value).isAfter(_startTime)) {
                        return Promise.reject(new Error('活动结束时间必须大于活动开始时间'))
                      }
                      if (_signUpStartTime && !moment(value).isAfter(_signUpStartTime)) {
                        return Promise.reject(new Error('活动结束时间必须大于报名开始时间'))
                      }
                      if (_signUpEndTime && !moment(value).isAfter(_signUpEndTime)) {
                        return Promise.reject(new Error('活动结束时间必须大于报名结束时间'))
                      }
                      if (!moment(value).isAfter(moment(new Date()))) {
                        return Promise.reject(new Error('活动结束时间必须大于当前时间'))
                      }
                      return Promise.resolve()
                    },
                  }),
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
          {activitySignUpType === AVTIVITY_SIGNUP_MERCHANTREG && (
            <Form.Item label="要求报名时间" style={{ margin: 0 }} required={true}>
              <Space style={{ display: 'flex' }} align="baseline">
                <Form.Item
                  name="signUpStartTime"
                  validateFirst
                  dependencies={['endTime', 'startTime', 'signUpEndTime']}
                  rules={[
                    {
                      required: true,
                      message: '请选择报名开始时间',
                    },
                    ({ getFieldValue }) => ({
                      validator: (_rule, value) => {
                        const _startTime = getFieldValue('startTime')
                        const _endTime = getFieldValue('endTime')
                        const _signUpEndTime = getFieldValue('signUpEndTime')
                        if (_startTime && !moment(value).isBefore(_startTime)) {
                          return Promise.reject(new Error('报名开始时间必须小于活动开始时间'))
                        }
                        if (_endTime && !moment(value).isBefore(_endTime)) {
                          return Promise.reject(new Error('报名开始时间必须小于活动结束时间'))
                        }
                        if (_signUpEndTime && !moment(value).isBefore(_signUpEndTime)) {
                          return Promise.reject(new Error('报名开始时间必须小于报名结束时间'))
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    showTime
                    showNow={false}
                    allowClear
                    disabledDate={(current) => startTimeDisabled(current, 'signUpEndTime')}
                  />
                </Form.Item>
                ~
                <Form.Item
                  name="signUpEndTime"
                  validateFirst
                  dependencies={['endTime', 'startTime', 'signUpStartTime']}
                  rules={[
                    {
                      required: true,
                      message: '请选择报名结束时间！',
                    },
                    ({ getFieldValue }) => ({
                      validator: (_rule, value) => {
                        const _startTime = getFieldValue('startTime')
                        const _endTime = getFieldValue('endTime')
                        const _signUpStartTime = getFieldValue('signUpStartTime')
                        if (_startTime && !moment(value).isBefore(_startTime)) {
                          return Promise.reject(new Error('报名结束时间必须小于活动开始时间'))
                        }
                        if (_endTime && !moment(value).isBefore(_endTime)) {
                          return Promise.reject(new Error('报名结束时间必须小于活动结束时间'))
                        }
                        if (_signUpStartTime && !moment(value).isAfter(_signUpStartTime)) {
                          return Promise.reject(new Error('报名结束时间必须大于报名开始时间'))
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    showTime
                    showNow={false}
                    allowClear
                    disabledDate={(current) => endTimeDisabled(current, 'signUpStartTime')}
                  />
                </Form.Item>
              </Space>
            </Form.Item>
          )}
        </Col>
      </Row>
    </CardLayout>
  )
}
export default BasicInfoLayout
