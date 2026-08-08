import React, { useEffect, useState } from 'react'
import { Modal, Form, Space, DatePicker } from 'antd'
import moment from 'moment'
import style from './index.less'
import { isEmpty } from 'lodash'
import { postMarketingPlatformActivityUpdateTime } from '@apps/apis'

interface ModalBoxProps {
  /** 参数 */
  params?: any
  /** 类型 */
  type?: 'radio' | 'date' | 'datePicker'
  /** 弹窗类型 */
  modalType?: string
  /** 显示隐藏 */
  visible?: boolean
  /** textArea 名字 */
  textArea?: string
  /** 默认选择 */
  initialValues?: {} | any
  /** 操作接口 */
  fetchApi?: () => Promise<unknown>
  /** 取消 */
  onCancel?: () => void
  /** 确定按钮 */
  onConfirm: () => void
}

const ModalBox: React.FC<ModalBoxProps> = ({ params, visible, onCancel, onConfirm }) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [data, setData] = useState<any>({})

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const param = {
        id: data.id,
        startTime: Number(moment(values.startTime).format('x')),
        endTime: Number(moment(values.endTime).format('x')),
        signUpStartTime: Number(moment(values.signUpStartTime).format('x')),
        signUpEndTime: Number(moment(values.signUpEndTime).format('x')),
      }
      setConfirmLoading(true)
      await postMarketingPlatformActivityUpdateTime(param)
        .then((res) => {
          if (res.code !== 1000) {
            setConfirmLoading(false)
            return
          }
          setConfirmLoading(false)
          onConfirm()
        })
        .catch((err) => {})
    } catch (errInfo) {}
  }

  useEffect(() => {
    if (!isEmpty(params)) {
      form.setFieldsValue({
        startTime: moment(params.startTime),
        endTime: moment(params.endTime),
        signUpStartTime: moment(params.signUpStartTime),
        signUpEndTime: moment(params.signUpEndTime),
      })
      setData(params)
    }
  }, [params])

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

  return (
    <Modal
      width={600}
      title="修改时间"
      visible={visible}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="活动时间" style={{ margin: 0 }} className={style.flexBox} required>
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
        <Form.Item label="要求报名时间" style={{ margin: 0 }} className={style.flexBox} required>
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
      </Form>
    </Modal>
  )
}
export default ModalBox
