import React, { useState, useEffect } from 'react'
import {
  Button,
  Row,
  Col,
  Switch,
  Drawer,
  Card,
  InputNumber,
  Form,
  Space,
  TimePicker,
  message,
  Checkbox,
  Input,
} from 'antd'
import defaultLogo from '@/assets/imgs/default_logo.jpg'
import { PageHeaderWrapper } from '@apps/components'
import MellowCard from '@/components/MellowCard'
import cx from 'classnames'
import styles from './index.less'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { configSourceData, IConfigSource } from './constant'
import { fectchShopListsSource } from '@/utils/type'
import moment from 'moment'
import {
  getOrderParamConfigExpressFeeGet,
  getOrderParamConfigScoreGet,
  getOrderParamGetAppointmentDay,
  getOrderParamGetDeliveryTime,
  getOrderParamGetReceiverDay,
  getOrderSocialDistributionParamGet,
  postOrderParamConfigExpressFeeUpdate,
  postOrderParamConfigScoreUpdate,
  postOrderParamUpdateAppointmentDay,
  postOrderParamUpdateDeliveryTime,
  postOrderParamUpdateReceiverDay,
  postOrderSocialDistributionParamUpdate,
  getProductFreightSpaceConfigGetFreightSpaceConfig,
  postProductFreightSpaceConfigSaveFreightSpaceConfig,
} from '@apps/apis'
import {
  getProductPricePriceCurveSetGetPriceCurveSetList,
  postProductPricePriceCurveSetSavePriceCurveSet,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { CheckButtonGroup, CheckButton } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'

/** 商品价格曲线 */
const PRICELINE_TYPE = 1

/** 自动确认收货 */
const AUTORECEIVE_TYPE = 2

/** 送货预约时长 */
const FORCASTTIME_TYPE = 3

/** 配送时间段 */
const TIMELINE_TYPE = 4

/** 积分抵扣订单金额 */
const INTEGRAL_TYPE = 5

/** 满额包邮 */
const LOGISTICS_TYPE = 6

/** 分销设置 */
const SOCIAL_DISTRIBUTION = 7

/** 仓位库存配置 */
const INVENTORY_TYPE = 8

const ParameterSetting: React.FC<{}> = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const [configSource, setConfigSource] = useState<IConfigSource[]>([...configSourceData])
  const [shopLists, setShopLists] = useState<any>([])
  const [priceLineVisible, setPriceLineVisible] = useState(false)
  const [autoReceiveVisible, setAutoReceiveVisible] = useState(false)
  const [forcastTimeVisible, setForcastTimeVisible] = useState(false)
  const [expressTimeVisible, setExpressTimeVisible] = useState(false)
  const [integralVisible, setIntegralVisible] = useState(false)
  const [logisticsVisible, setLogisticsVisible] = useState(false)
  const [socialDistributionVisible, setSocialDistributionVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [inventoryVisible, setInventoryVisible] = useState<boolean>(false)

  useEffect(() => {
    fectchShopListsSource({ isMemberType: true }).then((data) => {
      setShopLists(() =>
        data.map((item) => ({
          environment: item.environment,
          id: item.id,
          shopId: item.id,
          name: item.name,
          type: item.type,
          logoUrl: item.logoUrl,
          // 初始状态和天数为0
          status: 0,
          days: null,
          // 配送时间段
          paramList: [
            // startTime: '',
            // endTime: '',
          ],
        })),
      )
    })
  }, [])

  useEffect(() => {
    let fn = null
    if (autoReceiveVisible) {
      // 自动确认收货
      fn = getOrderParamGetReceiverDay
    } else if (forcastTimeVisible) {
      // 预约时长
      fn = getOrderParamGetAppointmentDay
    } else if (expressTimeVisible) {
      fn = getOrderParamGetDeliveryTime
    } else if (priceLineVisible) {
      fn = getProductPricePriceCurveSetGetPriceCurveSetList
    }
    fn &&
      fn().then((res) => {
        const { code, data } = res
        if (code === 1000) {
          setShopLists(() =>
            [...shopLists].map((item) => {
              const filterData = data.filter((_item) => _item.shopId === item.shopId)
              if (filterData.length) {
                return {
                  ...item,
                  ...filterData[0],
                  paramList: expressTimeVisible
                    ? filterData[0]['paramList'].map((param) => {
                        return {
                          timeRange: [
                            param.startTime ? moment(param.startTime, 'HH:mm:ss') : null,
                            param.endTime ? moment(param.endTime, 'HH:mm:ss') : null,
                          ],
                        }
                      })
                    : [],
                }
              } else {
                return {
                  ...item,
                  days: null,
                  status: 0,
                }
              }
            }),
          )
        }
      })
  }, [autoReceiveVisible, forcastTimeVisible, expressTimeVisible, priceLineVisible])

  const fetchGet = async (type) => {
    let getApiFn: any
    switch (type) {
      case INTEGRAL_TYPE:
        getApiFn = getOrderParamConfigScoreGet
        break
      case LOGISTICS_TYPE:
        getApiFn = getOrderParamConfigExpressFeeGet
        break
      case INVENTORY_TYPE:
        getApiFn = getProductFreightSpaceConfigGetFreightSpaceConfig
        break
      default:
        break
    }

    form.resetFields()
    if (!getApiFn) return
    await getApiFn().then((res) => {
      if (res.code !== 1000) {
        message.error(res.message)
        return
      }
      form.setFieldsValue({ ...res.data })
    })
  }
  const fetchSocialDistributionParamGet = async () => {
    form.resetFields()
    await getOrderSocialDistributionParamGet().then((res) => {
      if (res.code !== 1000) {
        message.error(res.message)
        return
      }
      let rate = res.data.rate || 0
      let status = res.data.status || 0
      rate = rate * 100
      const values = {
        rate: rate,
        status: status,
      }
      form.setFieldsValue({ ...values })
    })
  }

  const handleVisibleModalType = (id) => {
    if (id === PRICELINE_TYPE) {
      setPriceLineVisible(true)
    } else if (id === AUTORECEIVE_TYPE) {
      setAutoReceiveVisible(true)
    } else if (id === FORCASTTIME_TYPE) {
      setForcastTimeVisible(true)
    } else if (id === TIMELINE_TYPE) {
      setExpressTimeVisible(true)
    } else if (id === INTEGRAL_TYPE) {
      fetchGet(INTEGRAL_TYPE)
      setIntegralVisible(true)
    } else if (id === LOGISTICS_TYPE) {
      fetchGet(LOGISTICS_TYPE)
      setLogisticsVisible(true)
    } else if (id === SOCIAL_DISTRIBUTION) {
      fetchSocialDistributionParamGet()
      setSocialDistributionVisible(true)
    } else if (id === INVENTORY_TYPE) {
      fetchGet(INVENTORY_TYPE)
      setInventoryVisible(true)
    }
  }

  const handleSwitch = (type) => {
    setConfigSource(() => {
      return type === 'all' ? [...configSourceData] : [...configSourceData].filter((item) => item.type === type)
    })
  }

  // const onChangeShowSetBtn = (value, index) => {
  //   setConfigSource(() => {
  //     return [...configSource].map(item => ({
  //       ...item,
  //       isSettting: item.id === index ? value : item.isSettting
  //     }))
  //   })
  // }

  const onChangeReceiveStatus = (value, index) => {
    setShopLists(() =>
      [...shopLists].map((item) => {
        if (item.id === index) {
          return {
            ...item,
            status: +value,
          }
        } else {
          return { ...item }
        }
      }),
    )
  }

  const onChangeReceiveDays = (value, index) => {
    setShopLists(() =>
      [...shopLists].map((item) => {
        if (item.id === index) {
          return {
            ...item,
            days: value,
          }
        } else {
          return { ...item }
        }
      }),
    )
  }

  const onValuesChange = (changeValue, values, index) => {
    console.log(changeValue, values, index)
    setShopLists(() =>
      [...shopLists].map((item) => {
        if (item.id === index) {
          return {
            ...item,
            paramList: values.deadLine?.length
              ? values.deadLine.map((v) => {
                  if (v?.timeRange) {
                    const time = v.timeRange
                    return {
                      startTime: moment(time[0]).format('HH:mm'),
                      endTime: moment(time[1]).format('HH:mm'),
                    }
                  }
                })
              : [],
          }
        } else {
          return { ...item }
        }
      }),
    )
  }

  const handleSubmit = async (type?) => {
    try {
      let codeNumber = null
      setConfirmLoading(true)
      if (type === 'autoReceive') {
        const { code } = await postOrderParamUpdateReceiverDay([...shopLists].filter((item) => item.days))
        codeNumber = code
      } else if (type === 'forcastTime') {
        const { code } = await postOrderParamUpdateAppointmentDay([...shopLists].filter((item) => item.days))
        codeNumber = code
      } else if (type === 'timeLine') {
        // 过滤开启不设置时间段的null值
        const params = [...shopLists]
        const _prams = params.map((item) => {
          const _paramList = item.paramList.filter(Boolean)
          return {
            ...item,
            paramList: _paramList.map((_item) => {
              if (_item?.timeRange) {
                const time = _item.timeRange // 转换后端返回值
                return {
                  startTime: moment(time[0]).format('HH:mm'),
                  endTime: moment(time[1]).format('HH:mm'),
                }
              } else {
                return _item
              }
            }),
          }
        })

        // 判断时间段是否重复
        _prams.forEach((item) => {
          if (item.paramList?.length) {
            const timeString = item.paramList.map((_item) => `${_item.startTime}-${_item.endTime}`)
            if (new Set(timeString).size !== timeString.length) {
              throw new Error(intl.formatMessage({ id: 'systemSetting.parameterSetting.DoNotConfigureRepeatPeriods' }))
            }
          }
        })

        const { code } = await postOrderParamUpdateDeliveryTime(_prams)
        codeNumber = code
      } else if (type === 'priceLine') {
        const { code } = await postProductPricePriceCurveSetSavePriceCurveSet({ priceCurveSetList: [...shopLists] })
        codeNumber = code
      }
      setConfirmLoading(false)
      if (codeNumber === 1000) {
        setAutoReceiveVisible(false)
        setForcastTimeVisible(false)
        setExpressTimeVisible(false)
        setPriceLineVisible(false)
      }
      setConfirmLoading(false)
    } catch (error) {
      setConfirmLoading(false)
      setExpressTimeVisible(false)
      message.error(error.message)
    }
  }

  const handleSocialDistributionSubmit = () => {
    setConfirmLoading(true)
    form
      .validateFields()
      .then((fields) => {
        postOrderSocialDistributionParamUpdate({
          ...fields,
          status: Number(fields.status),
          rate: Number(fields.rate / 100).toFixed(2),
        }).then((res) => {
          if (res.code !== 1000) {
            message.error(res.message)
            setConfirmLoading(false)
            return
          }
          setSocialDistributionVisible(false)
          setConfirmLoading(false)
        })
      })
      .catch(() => {
        setConfirmLoading(false)
      })
  }

  /** 积分抵扣订单金额 | 满额包邮 */
  const layout: any = {
    colon: false,
    labelCol: { style: { width: '144px' } },
    labelAlign: 'left',
  }
  const [form] = Form.useForm()
  const handleSubmit1 = (type) => {
    const getApiFn = type === INTEGRAL_TYPE ? postOrderParamConfigScoreUpdate : postOrderParamConfigExpressFeeUpdate
    setConfirmLoading(true)
    form
      .validateFields()
      .then((fields) => {
        getApiFn({ ...fields, status: Number(fields.status) }).then((res) => {
          if (res.code !== 1000) {
            message.error(res.message)
            setConfirmLoading(false)
            return
          }
          setIntegralVisible(false)
          setLogisticsVisible(false)
          setConfirmLoading(false)
        })
      })
      .catch(() => {
        setConfirmLoading(false)
      })
  }

  const handleInventorySubmit = () => {
    form.validateFields().then((fields) => {
      postProductFreightSpaceConfigSaveFreightSpaceConfig({ ...fields })
        .then((res) => {
          if (res.code === 1000) {
            setInventoryVisible(false)
          }
        })
        .finally(() => {
          setConfirmLoading(false)
        })
    })
  }

  return (
    <PageHeaderWrapper>
      <Row gutter={16}>
        <Col span={4}>
          <MellowCard title={intl.formatMessage({ id: 'systemSetting.parameterSetting.type' })} fullHeight>
            <div className={styles.rightBtnWrap}>
              <Button onClick={() => handleSwitch('all')}>
                {intl.formatMessage({ id: 'systemSetting.parameterSetting.all' })}
              </Button>
              <Button onClick={() => handleSwitch('commodity')}>
                {intl.formatMessage({ id: 'systemSetting.parameterSetting.commodityRelated' })}
              </Button>
              <Button onClick={() => handleSwitch('order')}>
                {intl.formatMessage({ id: 'systemSetting.parameterSetting.orderRelated' })}
              </Button>
              <Button onClick={() => handleSwitch('integral')}>
                {intl.formatMessage({ id: 'systemSetting.jifenxiangguan', defaultMessage: '积分相关' })}
              </Button>
              <Button onClick={() => handleSwitch('logistics')}>
                {intl.formatMessage({ id: 'systemSetting.yunfeixiangguan', defaultMessage: '运费相关' })}
              </Button>
              <Button onClick={() => handleSwitch('socialDistribution')}>
                {intl.formatMessage({ id: 'systemSetting.socialDistribution', defaultMessage: '分销相关' })}
              </Button>
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
                  <AuthButton type="custom" code="setup">
                    {item.isSettting ? (
                      <a onClick={() => handleVisibleModalType(item.id)}>
                        {intl.formatMessage({ id: 'systemSetting.parameterSetting.setApplicableMall' })}
                      </a>
                    ) : (
                      <a onClick={() => handleVisibleModalType(item.id)}>
                        {intl.formatMessage({ id: 'systemSetting.shezhicanshu', defaultMessage: '设置参数' })}
                      </a>
                    )}
                  </AuthButton>
                  {/* <Switch defaultChecked={item.isSettting} onChange={(v) => onChangeShowSetBtn(v, item.id)} /> */}
                </div>
              </div>
            </MellowCard>
          ))}
        </Col>
      </Row>
      {/* 价格曲线设置抽屉 */}
      <Drawer
        title={intl.formatMessage({ id: 'systemSetting.parameterSetting.ApplicableMall' })}
        width={600}
        onClose={() => setPriceLineVisible(false)}
        open={priceLineVisible}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setPriceLineVisible(false)} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'common.button.cancel' })}
            </Button>
            <Button type="primary" onClick={() => handleSubmit('priceLine')} loading={confirmLoading}>
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </div>
        }
      >
        <div className={styles.drawerBody}>
          {shopLists.map((item) => (
            <Card style={{ marginBottom: 16 }} key={item.id}>
              <div className={styles.cardMain}>
                <p>
                  <img src={item.logoUrl || defaultLogo} alt={item.name} />
                  <span>{item.name}</span>
                </p>
                <Switch
                  defaultChecked={item.status}
                  checked={item.status}
                  onChange={(v) => onChangeReceiveStatus(v, item.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      </Drawer>
      {/* 自动确认收货 */}
      <Drawer
        title={intl.formatMessage({ id: 'systemSetting.parameterSetting.ApplicableMall' })}
        width={600}
        onClose={() => setAutoReceiveVisible(false)}
        open={autoReceiveVisible}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setAutoReceiveVisible(false)} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'common.button.cancel' })}
            </Button>
            <Button type="primary" onClick={() => handleSubmit('autoReceive')} loading={confirmLoading}>
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </div>
        }
      >
        <div className={styles.drawerBody}>
          {shopLists.map((item) => (
            <Card style={{ marginBottom: 16 }} key={item.id}>
              <div className={cx(styles.cardMain, styles.cardBodyMain)}>
                <p>
                  <img src={item.logoUrl || defaultLogo} alt={item.name} />
                  <span>{item.name}</span>
                </p>
                <Switch
                  defaultChecked={!!item.status}
                  checked={!!item.status}
                  onChange={(v) => onChangeReceiveStatus(v, item.id)}
                />
              </div>
              {!!item.status ? (
                <p className={styles.receiveDay}>
                  <span>{intl.formatMessage({ id: 'systemSetting.parameterSetting.DaysOfReceipt' })}：</span>
                  <InputNumber onChange={(v) => onChangeReceiveDays(v, item.id)} value={item.days} />
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      </Drawer>
      {/* 送货预约时长 */}
      <Drawer
        title={intl.formatMessage({ id: 'systemSetting.parameterSetting.ApplicableMall' })}
        width={600}
        onClose={() => setForcastTimeVisible(false)}
        open={forcastTimeVisible}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setForcastTimeVisible(false)} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'common.button.cancel' })}
            </Button>
            <Button type="primary" onClick={() => handleSubmit('forcastTime')} loading={confirmLoading}>
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </div>
        }
      >
        <div className={styles.drawerBody}>
          {shopLists.map((item) => (
            <Card style={{ marginBottom: 16 }} key={item.id}>
              <div className={cx(styles.cardMain, styles.cardBodyMain)}>
                <p>
                  <img src={item.logoUrl || defaultLogo} alt={item.name} />
                  <span>{item.name}</span>
                </p>
                <Switch
                  defaultChecked={!!item.status}
                  checked={!!item.status}
                  onChange={(v) => onChangeReceiveStatus(v, item.id)}
                />
              </div>
              {!!item.status ? (
                <p className={styles.receiveDay}>
                  <span>{intl.formatMessage({ id: 'systemSetting.parameterSetting.orderTime' })}：</span>
                  <InputNumber onChange={(v) => onChangeReceiveDays(v, item.id)} value={item.days} />
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      </Drawer>
      {/* 配送时间段 */}
      <Drawer
        title={intl.formatMessage({ id: 'systemSetting.parameterSetting.ApplicableMall' })}
        width={600}
        onClose={() => setExpressTimeVisible(false)}
        open={expressTimeVisible}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setExpressTimeVisible(false)} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'common.button.cancel' })}
            </Button>
            <Button type="primary" onClick={() => handleSubmit('timeLine')} loading={confirmLoading}>
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </div>
        }
      >
        <div className={styles.drawerBody}>
          {shopLists.map((item) => (
            <Card style={{ marginBottom: 16 }} key={item.id}>
              <div className={cx(styles.cardMain, styles.cardBodyMain)}>
                <p>
                  <img src={item.logoUrl || defaultLogo} alt={item.name} />
                  <span>{item.name}</span>
                </p>
                <Switch
                  defaultChecked={!!item.status}
                  checked={!!item.status}
                  onChange={(v) => onChangeReceiveStatus(v, item.id)}
                />
              </div>
              {!!item.status ? (
                <div className={styles.deadLine}>
                  <Form
                    name="express_time_line_form"
                    autoComplete="off"
                    onValuesChange={(c, v) => onValuesChange(c, v, item.id)}
                    initialValues={{ deadLine: item.paramList }}
                  >
                    <Form.List name="deadLine">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <Space
                              key={key}
                              style={{ display: 'flex', marginBottom: 8, width: '100%' }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, 'timeRange']}
                                fieldKey={[fieldKey, 'timeRange']}
                                rules={[
                                  {
                                    required: true,
                                    message: intl.formatMessage({
                                      id: 'systemSetting.qingxuanzeshijianduan',
                                      defaultMessage: '请选择时间段',
                                    }),
                                  },
                                ]}
                              >
                                <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
                              </Form.Item>
                              <Button onClick={() => remove(name)} icon={<MinusOutlined />} />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              {intl.formatMessage({ id: 'systemSetting.parameterSetting.add' })}
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Form>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      </Drawer>
      {/* 设置下单时积分可抵扣的订单金额 */}
      <Drawer
        title={intl.formatMessage({ id: 'systemSetting.jifendikoudingdanjine', defaultMessage: '积分抵扣订单金额' })}
        width={800}
        onClose={() => setIntegralVisible(false)}
        visible={integralVisible}
        destroyOnClose
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setIntegralVisible(false)} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'common.button.cancel' })}
            </Button>
            <Button type="primary" onClick={() => handleSubmit1(INTEGRAL_TYPE)} loading={confirmLoading}>
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </div>
        }
      >
        {integralVisible && (
          <div className={styles.drawerBody}>
            <Form form={form} {...layout}>
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({
                  id: 'systemSetting.jifendikoudingdanjine',
                  defaultMessage: '积分抵扣订单金额',
                })}
                tooltip={intl.formatMessage({
                  id: 'systemSetting.shezhixiadanshijifenke',
                  defaultMessage: '设置下单时积分可抵扣的订单金额',
                })}
                colon={false}
              >
                <Space direction="vertical">
                  <Form.Item style={{ margin: 0 }} name="status" valuePropName="checked">
                    <Checkbox>
                      {intl.formatMessage({
                        id: 'systemSetting.qiyongjifendikoudingdan',
                        defaultMessage: '启用积分抵扣订单金额。可在下单时使用设置的积分抵扣订单金额。',
                      })}
                    </Checkbox>
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('status') && (
                        <>
                          <Form.Item
                            label={intl.formatMessage({
                              id: 'systemSetting.dangedingdanyunxushiyong',
                              defaultMessage: '单个订单允许使用积分上限',
                            })}
                            name="userScoreLimit"
                            rules={[
                              {
                                required: true,
                                message: intl.formatMessage({
                                  id: 'systemSetting.qingshurudangedingdanyun',
                                  defaultMessage: '请输入单个订单允许使用积分上限',
                                }),
                              },
                              {
                                pattern: /^[1-9]\d*$/,
                                message: intl.formatMessage({
                                  id: 'systemSetting.jifenshangxianzhengshuxingbi',
                                  defaultMessage: '积分上限整数型必须大于0',
                                }),
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Space>
                            <Form.Item
                              label={intl.formatMessage({
                                id: 'systemSetting.jifendikoujinebili1',
                                defaultMessage: '积分抵扣金额比例',
                              })}
                              name="deductionRate"
                              rules={[
                                {
                                  required: true,
                                  message: intl.formatMessage({
                                    id: 'systemSetting.qingshurujifendikoujin',
                                    defaultMessage: '请输入积分抵扣金额比例',
                                  }),
                                },
                                {
                                  pattern: /^10*$/,
                                  message: intl.formatMessage({
                                    id: 'systemSetting.jifendikoujinebili',
                                    defaultMessage: '积分抵扣金额比例整数型必须大于0且是10的n次方',
                                  }),
                                },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                            <div style={{ marginBottom: '24px', color: '#909399' }}>
                              {intl.formatMessage({
                                id: 'systemSetting.jifendikou',
                                defaultMessage: '积分可抵扣：￥1.00元',
                              })}
                            </div>
                          </Space>
                        </>
                      )
                    }
                  </Form.Item>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Drawer>
      {/* 设置订单满多少金额免运费 */}
      <Drawer
        title={intl.formatMessage({ id: 'systemSetting.manebaoyou', defaultMessage: '满额包邮' })}
        width={800}
        onClose={() => setLogisticsVisible(false)}
        open={logisticsVisible}
        destroyOnClose
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setLogisticsVisible(false)} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'common.button.cancel' })}
            </Button>
            <Button type="primary" onClick={() => handleSubmit1(LOGISTICS_TYPE)} loading={confirmLoading}>
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </div>
        }
      >
        {logisticsVisible && (
          <div className={styles.drawerBody}>
            <Form form={form} {...layout}>
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'systemSetting.manebaoyou', defaultMessage: '满额包邮' })}
                tooltip={intl.formatMessage({
                  id: 'systemSetting.shezhidingdanmanduoshaojin',
                  defaultMessage: '设置订单满多少金额免运费',
                })}
                colon={false}
              >
                <Space direction="vertical">
                  <Form.Item style={{ margin: 0 }} name="status" valuePropName="checked">
                    <Checkbox>
                      {intl.formatMessage({
                        id: 'systemSetting.qiyongmanebaoyouke',
                        defaultMessage: '启用满额包邮。可在下单时达到设置的订单金额后免运费',
                      })}
                    </Checkbox>
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('status') && (
                        <Space>
                          <Form.Item
                            label={intl.formatMessage({
                              id: 'systemSetting.dingdanjineman',
                              defaultMessage: '订单金额满',
                            })}
                            name="orderAmount"
                            rules={[
                              {
                                required: true,
                                message: intl.formatMessage({
                                  id: 'systemSetting.qingshurudingdanjineman',
                                  defaultMessage: '请输入订单金额满',
                                }),
                              },
                              {
                                pattern: /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/,
                                message: intl.formatMessage({
                                  id: 'systemSetting.dingdanjinemanbixuda',
                                  defaultMessage: '订单金额满必须大于0,最多保留2位小数',
                                }),
                              },
                            ]}
                          >
                            <Input addonBefore={intl.formatMessage({ id: 'common.money', defaultMessage: '￥' })} />
                          </Form.Item>
                          <div style={{ marginBottom: '24px', color: '#909399' }}>
                            {intl.formatMessage({ id: 'systemSetting.yuanmianyunfei', defaultMessage: '元免运费' })}
                          </div>
                        </Space>
                      )
                    }
                  </Form.Item>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Drawer>
      {/* 分销设置 */}
      <Drawer
        title={intl.formatMessage({ id: 'systemSetting.socialDistribution', defaultMessage: '分销设置' })}
        width={800}
        onClose={() => setSocialDistributionVisible(false)}
        visible={socialDistributionVisible}
        destroyOnClose
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setSocialDistributionVisible(false)} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'common.button.cancel' })}
            </Button>
            <Button type="primary" onClick={() => handleSocialDistributionSubmit()} loading={confirmLoading}>
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </div>
        }
      >
        {socialDistributionVisible && (
          <div className={styles.drawerBody}>
            <Form form={form} {...layout}>
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="status"
                valuePropName="checked"
                label={intl.formatMessage({
                  id: 'systemSetting.shifouqiyongshangpinfenxiao',
                  defaultMessage: '是否启用商品分销',
                })}
                tooltip={intl.formatMessage({
                  id: 'systemSetting.shezhimorenfenxiaobili',
                  defaultMessage: '开启或关闭分销设置，设置默认分销比例',
                })}
                colon={false}
              >
                <Switch />
              </Form.Item>
              <Form.Item
                name="rate"
                label={intl.formatMessage({ id: 'systemSetting.morenfenxiaobili', defaultMessage: '默认分销比例' })}
              >
                <InputNumber
                  defaultValue={100}
                  min={0}
                  max={100}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value!.replace('%', '')}
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Drawer>
      {/* 默认仓位库存配置 */}
      <Drawer
        title={translate('web.resource.system.shezhimorencangweikucun')}
        width={580}
        onClose={() => setInventoryVisible(false)}
        open={inventoryVisible}
        destroyOnClose
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => setInventoryVisible(false)} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'common.button.cancel' })}
            </Button>
            <Button type="primary" onClick={() => handleInventorySubmit()} loading={confirmLoading}>
              {intl.formatMessage({ id: 'common.button.confirm' })}
            </Button>
          </div>
        }
      >
        <div className={styles.drawerBody}>
          <div className={styles.inventoryTip}>{translate('web.resource.system.inventroyTip')}</div>
          <Form
            form={form}
            {...layout}
            wrapperCol={{
              style: {
                textAlign: 'right', // 标签右对齐
                justifyContent: 'flex-end',
              },
            }}
          >
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label={translate('web.resource.system.shifouqiyong')}
              name="status"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label={translate('web.resource.system.morencangweikucun')}
              name="inventory"
              rules={[
                {
                  required: true,
                  message: translate('web.common.qingshuru'),
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label={translate('web.resource.system.morenshiyongshangcheng')}
              name="shopId"
              rules={[
                {
                  required: true,
                  message: translate('web.common.qingxuanze'),
                },
              ]}
            >
              <CheckButtonGroup>
                {shopLists.map((item) => (
                  <CheckButton value={item.id}>{item.name}</CheckButton>
                ))}
              </CheckButtonGroup>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </PageHeaderWrapper>
  )
}

export default ParameterSetting
