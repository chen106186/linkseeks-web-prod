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
              rules={[
                { required: true, message: '请选择活动开始时间！' },
                () => ({
                  async validator(_, value) {
                    let _exVal = await form.getFieldValue('endTime')
                    if (_exVal && moment(value).isAfter(_exVal)) {
                      return Promise.reject(new Error('活动开始时间需要早于活动结束时间'))
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                allowClear
                disabledDate={(current) => {
                  const _endTime = form.getFieldValue('endTime')
                  if (_endTime) {
                    return (
                      current &&
                      (moment(current).diff(moment(_endTime), 'day') > 0 || current < moment().startOf('second'))
                    )
                  } else {
                    return current && current < moment().startOf('second')
                  }
                }}
              />
            </Form.Item>
            ~
            <Form.Item
              name="endTime"
              rules={[
                { required: true, message: '请选择活动结束时间！' },
                () => ({
                  async validator(_, value) {
                    let _exVal = await form.getFieldValue('startTime')
                    if (_exVal && moment(value).isBefore(_exVal)) {
                      return Promise.reject(new Error('活动结束时间需要晚于活动开始时间'))
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                allowClear
                disabledDate={(current) => {
                  const _startTime = form.getFieldValue('startTime')
                  if (_startTime) {
                    return current && current < moment(_startTime).startOf('second')
                  } else {
                    return current && current < moment().startOf('second')
                  }
                }}
              />
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="要求报名时间" style={{ margin: 0 }} className={style.flexBox} required>
          <Space style={{ display: 'flex' }} align="baseline">
            <Form.Item
              name="signUpStartTime"
              rules={[
                { required: true, message: '请选择要求报名时间！' },
                () => ({
                  async validator(_, value) {
                    let _exVal = await form.getFieldValue('signUpEndTime')
                    if (_exVal && moment(value).isAfter(_exVal)) {
                      return Promise.reject(new Error('要求报名时间需要早于活动结束时间'))
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                allowClear
                disabledDate={(current) => {
                  const _endTime = form.getFieldValue('signUpEndTime')
                  if (_endTime) {
                    return (
                      current &&
                      (moment(current).diff(moment(_endTime), 'day') > 0 || current < moment().startOf('second'))
                    )
                  } else {
                    return current && current < moment().startOf('second')
                  }
                }}
              />
            </Form.Item>
            ~
            <Form.Item
              name="signUpEndTime"
              rules={[
                { required: false, message: '请选择活动结束时间！' },
                () => ({
                  async validator(_, value) {
                    let _exVal = await form.getFieldValue('signUpStartTime')
                    if (_exVal && moment(value).isBefore(_exVal)) {
                      return Promise.reject(new Error('活动结束时间需要晚于要求报名时间'))
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                allowClear
                disabledDate={(current) => {
                  const _startTime = form.getFieldValue('signUpStartTime')
                  if (_startTime) {
                    return current && current < moment(_startTime).startOf('second')
                  } else {
                    return current && current < moment().startOf('second')
                  }
                }}
              />
            </Form.Item>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default ModalBox
