import React, { useState } from 'react'
import { Button, Row, Col, Drawer, Form, Space, Checkbox, Input, message, Switch } from 'antd'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'
import { configSourceData, IConfigSource } from './constant'
import {
  getOrderPlatformParamConfigAfterSalesValidityPeriodGet,
  getOrderPlatformParamConfigCommunityGroupBuyingGet,
  getOrderPlatformParamConfigScoreGet,
  postOrderPlatformParamConfigAfterSalesValidityPeriodUpdate,
  postOrderPlatformParamConfigCommunityGroupBuyingUpdate,
  postOrderPlatformParamConfigScoreUpdate,
} from '@apps/apis'

/** 积分抵扣订单金额 */
const INTEGRAL_TYPE = 5

const ParameterSetting: React.FC<{}> = () => {
  const [configSource, setConfigSource] = useState<IConfigSource[]>([...configSourceData])
  const [integralVisible, setIntegralVisible] = useState(false)
  const [validityVisible, setValidityVisible] = useState(false)
  const [groupBuyingVisible, setGroupBuyingVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const fetchGet = async () => {
    form.resetFields()
    await getOrderPlatformParamConfigScoreGet().then((res) => {
      if (res.code !== 1000) {
        message.error(res.message)
        return
      }
      form.setFieldsValue({ ...res.data })
    })
  }

  const fetchValidityGet = async () => {
    validityForm.resetFields()
    await getOrderPlatformParamConfigAfterSalesValidityPeriodGet().then((res) => {
      if (res.code !== 1000) {
        message.error(res.message)
        return
      }
      validityForm.setFieldsValue({ ...res.data })
    })
  }

  const fetchGroupBuyingGet = async () => {
    groupBuyingForm.resetFields()
    await getOrderPlatformParamConfigCommunityGroupBuyingGet().then((res) => {
      if (res.code !== 1000) {
        message.error(res.message)
        return
      }
      groupBuyingForm.setFieldsValue({ ...res.data })
    })
  }

  const handleVisibleModalType = (type) => {
    switch (type) {
      case 'integral':
        fetchGet()
        setIntegralVisible(true)
        break
      case 'validity':
        fetchValidityGet()
        setValidityVisible(true)
        break
      case 'groupbuying':
        fetchGroupBuyingGet()
        setGroupBuyingVisible(true)
        break
    }
  }

  const handleSwitch = (type) => {
    setConfigSource(() => {
      return type === 'all' ? [...configSourceData] : [...configSourceData].filter((item) => item.type === type)
    })
  }

  /** 积分抵扣订单金额 | 满额包邮 */
  const layout: any = {
    colon: false,
    labelCol: { style: { width: '130px' } },
    labelAlign: 'left',
  }
  const [form] = Form.useForm()
  const [validityForm] = Form.useForm()
  const [groupBuyingForm] = Form.useForm()
  const handleSubmit = () => {
    setConfirmLoading(true)
    form
      .validateFields()
      .then((fields) => {
        postOrderPlatformParamConfigScoreUpdate({ ...fields, status: Number(fields.status) }).then((res) => {
          if (res.code !== 1000) {
            message.error(res.message)
            setConfirmLoading(false)
            return
          }
          setIntegralVisible(false)
          setConfirmLoading(false)
        })
      })
      .catch(() => {
        setConfirmLoading(false)
      })
  }
  const handleValiditySubmit = () => {
    setConfirmLoading(true)
    validityForm
      .validateFields()
      .then((fields) => {
        postOrderPlatformParamConfigAfterSalesValidityPeriodUpdate({ ...fields, status: Number(fields.status) }).then(
          (res) => {
            if (res.code !== 1000) {
              message.error(res.message)
              setConfirmLoading(false)
              return
            }
            setValidityVisible(false)
            setConfirmLoading(false)
          },
        )
      })
      .catch(() => {
        setConfirmLoading(false)
      })
  }
  const handleGroupBuyingSubmit = () => {
    setConfirmLoading(true)
    groupBuyingForm
      .validateFields()
      .then((fields) => {
        postOrderPlatformParamConfigCommunityGroupBuyingUpdate({ ...fields, status: Number(fields.status) }).then(
          (res) => {
            if (res.code !== 1000) {
              message.error(res.message)
              setConfirmLoading(false)
              return
            }
            setGroupBuyingVisible(false)
            setConfirmLoading(false)
          },
        )
      })
      .catch(() => {
        setConfirmLoading(false)
      })
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={4}>
          <MellowCard title="类型" fullHeight>
            <div className={styles.rightBtnWrap}>
              <Button onClick={() => handleSwitch('all')}>全部</Button>
              <Button onClick={() => handleSwitch('integral')}>积分相关</Button>
              <Button onClick={() => handleSwitch('validity')}>售后有效期相关</Button>
              <Button onClick={() => handleSwitch('groupbuying')}>社区团购相关</Button>
            </div>
          </MellowCard>
        </Col>
        <Col span={20}>
          {configSource.map((item) => (
            <MellowCard style={{ marginBottom: 16 }} key={item.id}>
              <div className={styles.setItemWrap}>
                <div className={styles.setItemLeft}>
                  <p>
                    <img src={item.icon} alt={item.title} />
                    <span>{item.title}</span>
                  </p>
                  <p>{item.description}</p>
                </div>
                <div className={styles.setItemRight}>
                  <a onClick={() => handleVisibleModalType(item.type)}>设置参数</a>
                </div>
              </div>
            </MellowCard>
          ))}
        </Col>
      </Row>
      {/* 设置下单时积分可抵扣的订单金额 */}
      <Drawer
        title="参数设置"
        width={600}
        onClose={() => setIntegralVisible(false)}
        visible={integralVisible}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setIntegralVisible(false)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" loading={confirmLoading} onClick={() => handleSubmit()}>
              提交
            </Button>
          </div>
        }
      >
        <div className={styles.drawerBody}>
          <Form form={form} {...layout}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item label="积分抵扣订单金额" tooltip="设置下单时积分可抵扣的订单金额" colon={false}>
              <Space direction="vertical">
                <Form.Item style={{ margin: 0 }} name="status" valuePropName="checked">
                  <Checkbox>启用积分抵扣订单金额。可在下单时使用设置的积分抵扣订单金额。</Checkbox>
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
                >
                  {({ getFieldValue }) =>
                    getFieldValue('status') ? (
                      <>
                        <Form.Item
                          label="单个订单允许使用积分上限"
                          name="userScoreLimit"
                          rules={[
                            { required: true, message: '请输入单个订单允许使用积分上限' },
                            { pattern: /^[1-9]\d*$/, message: '积分上限整数型必须大于0' },
                          ]}
                        >
                          <Input maxLength={8} />
                        </Form.Item>
                        <Space>
                          <Form.Item
                            label="积分抵扣金额比例"
                            name="deductionRate"
                            rules={[
                              { required: true, message: '请输入积分抵扣金额比例' },
                              { pattern: /^10*$/, message: '积分抵扣金额比例整数型必须大于0且是10的n次方' },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <div style={{ marginBottom: '24px', color: '#909399' }}>积分可抵扣：￥1.00元</div>
                        </Space>
                      </>
                    ) : null
                  }
                </Form.Item>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
      {/* 设置售后有效期 */}
      <Drawer
        title="售后有效期"
        width={600}
        onClose={() => setValidityVisible(false)}
        visible={validityVisible}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setValidityVisible(false)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" loading={confirmLoading} onClick={() => handleValiditySubmit()}>
              提交
            </Button>
          </div>
        }
      >
        <div className={styles.drawerBody}>
          <Form form={validityForm} {...layout}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="status" label="是否启用售后有效期" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="day" label="售后有效期">
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Drawer>
      {/* 团购活动设置 */}
      <Drawer
        title="团购活动设置"
        width={600}
        onClose={() => setGroupBuyingVisible(false)}
        visible={groupBuyingVisible}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setGroupBuyingVisible(false)} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" loading={confirmLoading} onClick={() => handleGroupBuyingSubmit()}>
              提交
            </Button>
          </div>
        }
      >
        <div className={styles.drawerBody}>
          <Form form={groupBuyingForm} {...layout}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="status" label="是否开启团购活动" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </div>
  )
}

export default ParameterSetting
