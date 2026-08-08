import React, { useEffect, useState } from 'react'
import { Modal, Form, Space, DatePicker, Input, InputNumber, Button, Select, Row, Col } from 'antd'
import moment from 'moment'
import style from './index.less'
import { isEmpty } from 'lodash'
import { postMarketingSocialDistributionLevelSave, postMarketingSocialDistributionLevelUpdate } from '@apps/apis'

interface ModalBoxProps {
  /** 参数 */
  params?: any
  /** 类型 */
  type?: 'radio' | 'date' | 'datePicker'
  /** 弹窗类型 */
  modalType?: string
  /** 是否添加 */
  isAdd?: boolean
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

const ModalBox: React.FC<ModalBoxProps> = ({ isAdd, params, visible, onCancel, onConfirm }) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [data, setData] = useState<any>({})

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      let commissionRate = values.commissionRate || 0
      commissionRate = (commissionRate / 100).toFixed(2)
      let directCommissionRate = values.directCommissionRate || 0
      directCommissionRate = (directCommissionRate / 100).toFixed(2)
      const param = {
        id: null,
        commissionRate: commissionRate,
        directCommissionRate: directCommissionRate,
        level: values.level,
        levelName: values.levelName,
        minimumEarningsAmount: values.minimumEarningsAmount,
        minimumInviteCount: values.minimumInviteCount,
        minimumPerformanceAmount: values.minimumPerformanceAmount,
      }
      if (!isAdd) {
        param.id = params.id
      }
      setConfirmLoading(true)
      const serviceActions = isAdd
        ? postMarketingSocialDistributionLevelSave
        : postMarketingSocialDistributionLevelUpdate
      await serviceActions(param)
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
    form.resetFields()
    if (!isEmpty(params)) {
      let commissionRate = params.commissionRate || 0
      commissionRate = parseInt(commissionRate * 100)
      let directCommissionRate = params.directCommissionRate || 0
      directCommissionRate = parseInt(directCommissionRate * 100)
      form.setFieldsValue({
        commissionRate: commissionRate,
        directCommissionRate: directCommissionRate,
        id: params.id,
        level: params.level,
        levelName: params.levelName,
        minimumEarningsAmount: params.minimumEarningsAmount,
        minimumInviteCount: params.minimumInviteCount,
        minimumPerformanceAmount: params.minimumPerformanceAmount,
      })
      setData(params)
    }
  }, [params])

  return (
    <Modal
      width={600}
      title={isAdd ? '添加等级' : '编辑等级'}
      visible={visible}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} layout="horizontal">
        <Form.Item name="levelName" label="分销员等级名称" required>
          <Input />
        </Form.Item>
        <Form.Item name="level" label="等级值" required>
          <Select>
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
            <Select.Option value="3">3</Select.Option>
            <Select.Option value="4">4</Select.Option>
            <Select.Option value="5">5</Select.Option>
            <Select.Option value="6">6</Select.Option>
            <Select.Option value="7">7</Select.Option>
            <Select.Option value="8">8</Select.Option>
            <Select.Option value="9">9</Select.Option>
            <Select.Option value="10">10</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="升级规则" required>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <span>业绩金额达到</span>
              <Form.Item
                name="minimumPerformanceAmount"
                rules={[{ required: true, message: '请输入业绩金额' }]}
                noStyle
              >
                <InputNumber min={0} size="small" placeholder="业绩金额" style={{ width: 160 }} />
              </Form.Item>
              <span style={{ marginLeft: 8 }}>元</span>
            </Col>
            <Col span={24}>
              <span>到账收益金额达到</span>
              <Form.Item name="minimumEarningsAmount" rules={[{ required: true, message: '请输入到账金额' }]} noStyle>
                <InputNumber min={0} size="small" placeholder="到账收益金额" style={{ width: 160 }} />
              </Form.Item>
              <span style={{ marginLeft: 8 }}>元</span>
            </Col>
            <Col span={24}>
              <span>邀请人数达到</span>
              <Form.Item name="minimumInviteCount" rules={[{ required: true, message: '请输入邀请人数' }]} noStyle>
                <InputNumber min={0} size="small" placeholder="邀请人数" style={{ width: 160 }} />
              </Form.Item>
              <span style={{ marginLeft: 8 }}>个</span>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item name="directCommissionRate" label="直接佣金比例" required>
          <InputNumber addonAfter="%" />
        </Form.Item>
        <Form.Item name="commissionRate" label="佣金提成比例" required>
          <InputNumber addonAfter="%" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default ModalBox
