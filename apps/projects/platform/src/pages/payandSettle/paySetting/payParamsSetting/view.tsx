import React, { useEffect, useState, Fragment } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { ColumnType } from 'antd/lib/table/interface'
import { Tabs, Form, Button, Radio, Table, Space, Image, Popconfirm, Empty, Input, Typography } from 'antd'
import { Card } from '@linkseeks/ui'
import style from './index.less'
import { PlusOutlined, SaveOutlined } from '@ant-design/icons'
import ModalLayout from './components/modal'
import { isEmpty } from 'lodash'

import alipay from '@/assets/icons/alipay_icon.png'
import wechat from '@/assets/icons/wechat_icon.png'
import unionpay from '@/assets/icons/unionpay_icon.png'
import balance from '@/assets/icons/balance_icon.png'
import tonglian from '@/assets/icons/tonglian_icon.png'
import { PageHeaderWrapper } from '@apps/components'
import NumberInput from './components/number'
import { getOrderMemberPaymentParameterFind, postOrderMemberPaymentParameterCreate } from '@apps/apis'
import PayEmptyLayout from './payEmpty'
import { AuthButton } from '@apps/components'
import { encryptedByAES } from '@linkseeks/crypto'

const PIC_MAP = {
  1: alipay,
  2: wechat,
  3: unionpay,
  4: balance,
  11: wechat,
  12: alipay,
  13: tonglian,
  14: unionpay,
  15: balance,
}

const { TabPane } = Tabs

type TabLink = {
  key: string
  label: string
}[]

const layout: any = {
  colon: false,
  labelCol: { style: { width: '230px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

type parameters = {
  /**支付参数枚举值 */
  code?: number
  /** 支付参数 */
  value?: string
  /** remark */
  remark?: string
}

type channels = {
  payType?: number
  payChannel?: number
  /** 支付参数列表 */
  parameters?: parameters[]
}
type FindProps = {
  /** 支付类型 */
  payType?: number
  /** 支付渠道及参数设置列表 */
  channels?: channels[]
}

const PaySettingLayout = () => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const [visible, setVisible] = useState<boolean>(false)
  const [tabLink, setTabLink] = useState<TabLink>([])
  const [parameterFind, setParameterFind] = useState<any[]>([])
  const [payChannel, setPayChannel] = useState<string>('')
  const [parameters, setParameters] = useState<FindProps[]>([]) // 提交的数据
  const [channel, setChannel] = useState<number[]>([]) // 已勾选配置的支付渠道枚举值
  const [value, setValue] = useState<parameters>({})
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [editIndex, setEditIndex] = useState<number>(0)
  const [empty, setEmpty] = useState<boolean>(false)

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.paySetting.columns.key' }),
      key: 'key',
      dataIndex: 'key',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.paySetting.columns.value' }),
      key: 'value',
      dataIndex: 'value',
      width: '50%',
      ellipsis: true,
      render: (text, record) => (
        <>
          {record.code === 14 && (
            <Typography.Link href={text} target="_blank">
              {text}
            </Typography.Link>
          )}
          {record.code !== 14 && <>{text}</>}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.paySetting.columns.remark' }),
      key: 'remark',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.paySetting.columns.options' }),
      key: 'options',
      dataIndex: 'options',
      render: (_: any, record: any, index: number) => (
        <>
          <Button type="link" onClick={() => handleEdit(record, index)} disabled={payChannel === '1'}>
            {intl.formatMessage({ id: 'payandSettle.paySetting.columns.options.button.1' })}
          </Button>
          <Popconfirm
            disabled={payChannel === '1'}
            title={intl.formatMessage({ id: 'payandSettle.paySetting.columns.options.button.2.popconfirm.title' })}
            onConfirm={() => handleDelete(index)}
            okText={intl.formatMessage({ id: 'payandSettle.paySetting.columns.options.button.2.popconfirm.okText' })}
            cancelText={intl.formatMessage({
              id: 'payandSettle.paySetting.columns.options.button.2.popconfirm.cancelText',
            })}
          >
            <Button type="link" disabled={payChannel === '1'}>
              {intl.formatMessage({ id: 'payandSettle.paySetting.columns.options.button.2' })}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  useEffect(() => {
    getOrderMemberPaymentParameterFind().then((res) => {
      if (res.code !== 1000) {
        setEmpty(true)
        return
      }
      const { data } = res
      if (data === null) {
        setEmpty(true)
        return
      }
      setTabLink(
        data.map((item) => {
          return {
            key: `tabLink_${item.payType}`,
            label: item.payTypeName,
          }
        }),
      )
      /** 组合数据 */
      const params: FindProps[] = []
      const _channel: number[] = []
      data.forEach((item) => {
        const _obj: FindProps = {}
        _obj.payType = item.payType
        _obj.channels = item.channels.map((_item) => {
          return {
            payChannel: _item.payChannel,
            parameters: _item.parameters,
          }
        })

        if (!isEmpty(item.payChannels)) {
          item.payChannels.forEach((_item) => {
            _channel.push(_item)
            form.setFieldsValue({
              [`payChannel_${_item}`]: _item,
            })
          })
        }
        params.push(_obj)
      })
      if (data[0] && data[0].channels && data[0].channels.length > 0) {
        setPayChannel(String(data[0].channels[0].payChannel))
      }
      setChannel(_channel)
      setParameters(params)
      setParameterFind(data)
    })
  }, [])

  const handleSubmit = async () => {
    const params: FindProps[] = []
    parameters.forEach((item: any) => {
      const _obj: FindProps = {}
      const _channel = item.channels.filter((_item) => channel.indexOf(_item.payChannel) !== -1)
      if (!isEmpty(_channel)) {
        _obj.payType = item.payType
        _obj.channels = _channel.map((_item) => {
          if (!isEmpty(_item.parameters)) {
            return {
              payChannel: _item.payChannel,
              parameters: _item.parameters.map((m) => ({
                ...m,
                value: m.valueEncrypted ? m.valueEncrypted : encryptedByAES(m.value),
              })),
            }
          } else {
            return {
              payChannel: _item.payChannel,
            }
          }
        })
      }
      if (!isEmpty(_obj)) {
        params.push(_obj)
      }
    })
    await postOrderMemberPaymentParameterCreate({ parameters: params as any }).then((res) => {
      if (res.code !== 1000) {
        return
      }
    })
  }

  /** 点击radio的事件 */
  const handleRadioChang = (e: any, _payType_: number) => {
    const { value } = e.target
    if (typeof value === 'string') {
      setChannel(channel.filter((item) => item !== Number(value.split('_')[1])))
    } else {
      setChannel([...channel, value])
    }
  }

  const toggle = (id: string) => {
    setPayChannel(id)
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }
  /** 新增支付参数 */
  const handleConfirm = (format) => {
    const _parameters = [...parameters]
    _parameters.forEach((item: any) => {
      const _channels = [...item.channels]
      _channels.forEach((_item) => {
        if (_item.payChannel === Number(payChannel)) {
          if (isEdit) {
            _item.parameters[editIndex] = format
          } else {
            _item.parameters.push(format)
          }
        }
      })
    })
    setIsEdit(false)
    setParameters(_parameters)
    setVisible(false)
  }
  /** 删除支付参数 */
  const handleDelete = (index) => {
    const _parameters = [...parameters]
    _parameters.forEach((item: any) => {
      const _channels = [...item.channels]
      _channels.forEach((_item) => {
        if (_item.payChannel === Number(payChannel)) {
          _item.parameters.splice(index, 1)
        }
      })
    })
    setParameters(_parameters)
  }
  /** 编辑支付参数 */
  const handleEdit = (record, index) => {
    setValue(record)
    setEditIndex(index)
    setIsEdit(true)
    setVisible(true)
  }

  const dataSource = (payType, _payChannel) => {
    let _parameters: any = []
    parameters.forEach((item) => {
      if (item.payType === payType) {
        _parameters = item.channels?.filter((_item) => _item.payChannel === _payChannel)[0].parameters
      }
    })
    return [..._parameters]
  }

  const handleInputChange = (e, code, payType, _index) => {
    const _parameters = [...parameters]
    _parameters.forEach((item) => {
      if (item.payType === payType) {
        if (item.channels && item.channels.length > 0 && item.channels[0].parameters) {
          item.channels[0].parameters[_index] = { code, value: e, remark: '' }
        }
      }
    })
    setParameters(_parameters)
  }

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({ id: 'payandSettle.paySetting.detail' })}
      items={tabLink}
      extra={
        <AuthButton type="custom" code="save">
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit}>
            {intl.formatMessage({ id: 'payandSettle.paySetting.effect' })}
          </Button>
        </AuthButton>
      }
    >
      <Fragment>
        {!empty && (
          <Form {...layout} form={form} style={{ display: 'flex' }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {parameterFind.map((item, index) => (
                <Card id={`tabLink_${item.payType}`} title={item.payTypeName} key={`tabLink_${item.payType}`}>
                  <div className={style.tabsLayout}>
                    {item.payType === 1 && (
                      <Tabs onChange={(key) => setPayChannel(key)}>
                        {item.channels.map((_item, _index) => (
                          <TabPane
                            tab={
                              <Space>
                                <Image preview={false} width={16} height={16} src={PIC_MAP[_item.payChannel]} />
                                {_item.payChannelName}
                              </Space>
                            }
                            key={_item.payChannel}
                            forceRender
                          >
                            <Form.Item
                              label={`${intl.formatMessage({ id: 'payandSettle.paySetting.label' })}${
                                _item.payChannelName
                              }`}
                              name={`payChannel_${_item.payChannel}`}
                              initialValue={`_${_item.payChannel}`}
                            >
                              <Radio.Group
                                size="small"
                                buttonStyle="solid"
                                onChange={(e) => handleRadioChang(e, item.payType)}
                              >
                                <Radio.Button value={_item.payChannel}>
                                  {intl.formatMessage({ id: 'payandSettle.paySetting.radio.1' })}
                                </Radio.Button>
                                <Radio.Button value={`_${_item.payChannel}`}>
                                  {intl.formatMessage({ id: 'payandSettle.paySetting.radio.2' })}
                                </Radio.Button>
                              </Radio.Group>
                            </Form.Item>
                            <Form.Item
                              noStyle
                              shouldUpdate={(prevValues, currentValues) =>
                                prevValues[`payChannel_${_item.payChannel}`] !==
                                currentValues[`payChannel_${_item.payChannel}`]
                              }
                            >
                              {({ getFieldValue }) =>
                                (getFieldValue(`payChannel_${_item.payChannel}`) === 1 ||
                                  getFieldValue(`payChannel_${_item.payChannel}`) === 2) && (
                                  <Fragment>
                                    <div className={style.anchor}>{`${_item.payChannelName}${intl.formatMessage({
                                      id: 'payandSettle.paySetting.parameters',
                                    })}`}</div>
                                    <Form.Item
                                      wrapperCol={{ span: 24 }}
                                      name={[`payChannel_${_item.payChannel}`, 'parameters']}
                                    >
                                      <Table
                                        rowKey={(_record: any, index: any) => `table${index + 1}`}
                                        columns={columns}
                                        dataSource={dataSource(item.payType, _item.payChannel)}
                                        pagination={false}
                                      />
                                      <Button
                                        type="dashed"
                                        block
                                        icon={<PlusOutlined />}
                                        style={{ marginBottom: '24px' }}
                                        onClick={() => toggle(_item.payChannel)}
                                        disabled={getFieldValue(`payChannel_${_item.payChannel}`) === 1}
                                      >
                                        {intl.formatMessage({ id: 'payandSettle.paySetting.parameters.button' })}
                                      </Button>
                                    </Form.Item>
                                  </Fragment>
                                )
                              }
                            </Form.Item>
                          </TabPane>
                        ))}
                      </Tabs>
                    )}
                    {item.payType === 6 && (
                      <Tabs onChange={(key) => setPayChannel(key)}>
                        {item.channels.map((_item, _index) => (
                          <TabPane
                            tab={
                              <Space>
                                <Image preview={false} width={16} height={16} src={PIC_MAP[_item.payChannel]} />
                                {_item.payChannelName}
                              </Space>
                            }
                            key={_item.payChannel}
                            forceRender
                          >
                            <Form.Item
                              label={`${intl.formatMessage({ id: 'payandSettle.paySetting.label' })}${
                                _item.payChannelName
                              }`}
                              name={`payChannel_${_item.payChannel}`}
                              initialValue={`_${_item.payChannel}`}
                            >
                              <Radio.Group
                                size="small"
                                buttonStyle="solid"
                                onChange={(e) => handleRadioChang(e, item.payType)}
                              >
                                <Radio.Button value={_item.payChannel}>
                                  {intl.formatMessage({ id: 'payandSettle.paySetting.radio.1' })}
                                </Radio.Button>
                                <Radio.Button value={`_${_item.payChannel}`}>
                                  {intl.formatMessage({ id: 'payandSettle.paySetting.radio.2' })}
                                </Radio.Button>
                              </Radio.Group>
                            </Form.Item>
                          </TabPane>
                        ))}
                      </Tabs>
                    )}
                    {item.payType !== 1 && item.payType !== 3 && item.payType !== 6 && (
                      <Fragment>
                        {item.channels.map((_item, _index) => (
                          <Fragment key={_item.payChannel}>
                            <Form.Item
                              label={_item.payChannelName}
                              name={`payChannel_${_item.payChannel}`}
                              initialValue={`_${_item.payChannel}`}
                            >
                              <Radio.Group
                                size="small"
                                buttonStyle="solid"
                                onChange={(e) => handleRadioChang(e, item.payType)}
                              >
                                <Radio.Button value={_item.payChannel}>
                                  {intl.formatMessage({ id: 'payandSettle.paySetting.radio.1' })}
                                </Radio.Button>
                                <Radio.Button value={`_${_item.payChannel}`}>
                                  {intl.formatMessage({ id: 'payandSettle.paySetting.radio.2' })}
                                </Radio.Button>
                              </Radio.Group>
                            </Form.Item>
                          </Fragment>
                        ))}
                      </Fragment>
                    )}
                    {item.payType === 3 && (
                      <Fragment>
                        {item.channels.map((_item, _index) => (
                          <Fragment key={_item.payChannel}>
                            <Form.Item
                              label={_item.payChannelName}
                              name={`payChannel_${_item.payChannel}`}
                              initialValue={`_${_item.payChannel}`}
                            >
                              <Radio.Group
                                size="small"
                                buttonStyle="solid"
                                onChange={(e) => handleRadioChang(e, item.payType)}
                              >
                                <Radio.Button value={_item.payChannel}>
                                  {intl.formatMessage({ id: 'payandSettle.paySetting.radio.1' })}
                                </Radio.Button>
                                <Radio.Button value={`_${_item.payChannel}`}>
                                  {intl.formatMessage({ id: 'payandSettle.paySetting.radio.2' })}
                                </Radio.Button>
                              </Radio.Group>
                            </Form.Item>
                            <Form.Item
                              noStyle
                              shouldUpdate={(prevValues, currentValues) =>
                                prevValues[`payChannel_${_item.payChannel}`] !==
                                currentValues[`payChannel_${_item.payChannel}`]
                              }
                            >
                              {({ getFieldValue }) =>
                                getFieldValue(`payChannel_${_item.payChannel}`) === 6 && (
                                  <Fragment>
                                    <Form.Item label={intl.formatMessage({ id: 'payandSettle.paySetting.label.2' })}>
                                      <Space direction="vertical" style={{ width: '100%' }}>
                                        {intl.formatMessage({ id: 'payandSettle.paySetting.label.2.1' })}
                                        <NumberInput
                                          onChange={(e) => handleInputChange(e, 30, item.payType, 0)}
                                          addonAfter={intl.formatMessage({
                                            id: 'payandSettle.paySetting.label.2.1.addonAfter',
                                          })}
                                          pattern={/^(\-)?\d+(\.(\d){0,2})?$/}
                                          fieldValue={_item.parameters[0]?.value}
                                        />
                                        {intl.formatMessage({ id: 'payandSettle.paySetting.label.2.2' })}
                                        <NumberInput
                                          onChange={(e) => handleInputChange(e, 31, item.payType, 1)}
                                          addonAfter={intl.formatMessage({
                                            id: 'payandSettle.paySetting.label.2.2.addonAfter',
                                          })}
                                          pattern={/^[1-9]\d*$/}
                                          fieldValue={_item.parameters[1]?.value}
                                        />
                                        {intl.formatMessage({ id: 'payandSettle.paySetting.label.2.3' })}
                                        <NumberInput
                                          onChange={(e) => handleInputChange(e, 32, item.payType, 2)}
                                          addonAfter="%"
                                          pattern={/^-?\d*(\.\d*)?$/}
                                          fieldValue={_item.parameters[2]?.value}
                                        />
                                      </Space>
                                    </Form.Item>
                                  </Fragment>
                                )
                              }
                            </Form.Item>
                          </Fragment>
                        ))}
                      </Fragment>
                    )}
                  </div>
                </Card>
              ))}
            </Space>
          </Form>
        )}
        {empty && (
          <Card>
            {/* <Empty
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                  imageStyle={{
                    height: 60,
                  }}
                  description={
                    <span>
                      平台还未配置您的支付方式，请联系平台客服
                    </span>
                  }
                /> */}
            <PayEmptyLayout />
          </Card>
        )}

        <ModalLayout
          value={value}
          visible={visible}
          payChannel={payChannel}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </Fragment>
    </PageHeaderWrapper>
  )
}
export default PaySettingLayout
