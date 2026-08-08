import React, { useEffect, useState, Fragment } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { ColumnType } from 'antd/lib/table/interface'
import { Tabs, Form, Button, Radio, Table, Space, Image, Popconfirm, Typography, Tag, message } from 'antd'
import { Card } from '@linkseeks/ui'
import style from './index.less'
import { PlusOutlined, SaveOutlined } from '@ant-design/icons'
import ModalLayout from './components/modal'
import { isEmpty } from 'lodash'
import { encryptedByAES } from '@linkseeks/crypto'
import alipay from '@/assets/icons/alipay_icon.png'
import wechat from '@/assets/icons/wechat_icon.png'
import unionpay from '@/assets/icons/unionpay_icon.png'
import balance from '@/assets/icons/balance_icon.png'
import tonglian from '@/assets/icons/tonglian_icon.png'
import {
  getOrderPlatformPaymentParameterFind,
  postOrderPlatformPaymentParameterCreate,
  getOrderPlatformPaymentMemberCommonParameterList,
  postOrderPlatformPaymentMemberCommonParameterCreate,
} from '@apps/apis'
import ParameterLayout from './components/parameter'
import {
  LINE_UP_PAY,
  LINE_UP_ALIPAY,
  LINE_UP_WEHCATPAY,
  UNIVERSAL_PAY,
  UNIVERSAL_PAY_WECHAT,
  UNIVERSAL_PAY_ALIPAY,
  UNIVERSAL_PAY_QUICK,
  UNIVERSAL_PAY_UNION,
  UNIVERSAL_PAY_BALANCE,
  CONSTRUCTION_PAY,
  CONSTRUCTION_B2BPAY,
  CONSTRUCTION_NUMBER_RMBPAY,
  LINE_UP_KEY_PATH,
  UNIVERSAL_KEY_PATH,
} from '@/constants/const/payment'
import { history } from '@linkseeks/router-manager'

const PIC_MAP = {
  1: alipay,
  2: wechat,
  3: unionpay,
  4: balance,
  11: wechat,
  12: alipay,
  13: tonglian,
  14: unionpay,
  /** 默认图标 */
  15: balance,
}

const { TabPane } = Tabs

type TabLink = {
  key: string
  label: string
}[]

const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
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
  /** key  */
  key?: string
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

type payTypeList = {
  /** 支付类型 */
  payType: number
  /** 支付方式 */
  payChannel: number[]
}

const PaySettingLayout = () => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState<boolean>(false)
  const [parameterVisible, setParameterVisible] = useState<boolean>(false)
  const [tabLink, setTabLink] = useState<TabLink>([])
  const [parameterFind, setParameterFind] = useState<any[]>([])
  const [payChannel, setPayChannel] = useState<string>('1')
  const [parameters, setParameters] = useState<FindProps[]>([]) // 提交的数据
  const [channel, setChannel] = useState<number[]>([]) // 已勾选配置的支付渠道枚举值
  const [value, setValue] = useState<parameters>({})
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [editIndex, setEditIndex] = useState<number>(0)

  const [parameterList, setParameterList] = useState<parameters[]>([]) // 商户支付参数列表

  /**
   * 需要配置支付参数的往[payTypeList]加！！！
   * @payType: 支付参数类型
   * @payChannel: 参数配置id
   */
  const [payTypeList] = useState<payTypeList[]>([
    {
      payType: LINE_UP_PAY,
      payChannel: [LINE_UP_ALIPAY, LINE_UP_WEHCATPAY],
    },
    {
      payType: UNIVERSAL_PAY,
      payChannel: [
        UNIVERSAL_PAY_WECHAT,
        UNIVERSAL_PAY_ALIPAY,
        UNIVERSAL_PAY_QUICK,
        UNIVERSAL_PAY_UNION,
        UNIVERSAL_PAY_BALANCE,
      ],
    },
    {
      payType: CONSTRUCTION_PAY,
      payChannel: [CONSTRUCTION_B2BPAY, CONSTRUCTION_NUMBER_RMBPAY],
    },
  ])

  const columns: ColumnType<any>[] = [
    {
      title: '参数代码',
      key: 'key',
      dataIndex: 'key',
    },
    {
      title: '参数值',
      key: 'value',
      dataIndex: 'value',
      width: '50%',
      ellipsis: true,
      render: (text, record) => (
        <>
          {(record.code === LINE_UP_KEY_PATH || record.code === UNIVERSAL_KEY_PATH) && (
            <Typography.Link href={text} target="_blank">
              {text}
            </Typography.Link>
          )}
          {record.code !== LINE_UP_KEY_PATH && record.code !== UNIVERSAL_KEY_PATH && <>{text}</>}
        </>
      ),
    },
    {
      title: '参数描述',
      key: 'remark',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'options',
      dataIndex: 'options',
      render: (_: any, record: any, index: number) => (
        <>
          <Button type="link" onClick={() => handleEdit(record, index, record.payChannel)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要执行这个操作?"
            onConfirm={() => handleDelete(index, record.payChannel)}
            okText="是"
            cancelText="否"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  const columns1: ColumnType<any>[] = [
    {
      title: '参数代码',
      key: 'key',
      dataIndex: 'key',
    },
    {
      title: '参数值',
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
      title: '参数描述',
      key: 'remark',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'options',
      dataIndex: 'options',
      render: (_: any, record: any, index: number) => (
        <>
          <Button type="link" onClick={() => handleParameterEdit(record, index)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要执行这个操作?"
            onConfirm={() => handleParameterDelete(index)}
            okText="是"
            cancelText="否"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  useEffect(() => {
    getOrderPlatformPaymentParameterFind().then((res) => {
      if (res.code !== 1000) {
        return
      }
      const { data } = res
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
            parameters: _item.parameters?.map((_item_) => {
              return {
                ..._item_,
                payChannel: _item.payChannel,
              }
            }),
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
              parameters: _item.parameters.map((_item_) => ({
                ..._item_,
                value: _item_.valueEncrypted ? _item_.valueEncrypted : encryptedByAES(_item_.value, false),
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
    await postOrderPlatformPaymentParameterCreate({ parameters: params as any }).then((res) => {
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
    setValue({})
    setPayChannel(id)
    setVisible(true)
  }

  const handleCancel = () => {
    setValue({})
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
  const handleDelete = (index, __payChannel) => {
    const _parameters = [...parameters]
    _parameters.forEach((item: any) => {
      const _channels = [...item.channels]
      _channels.forEach((_item) => {
        if (_item.payChannel === Number(__payChannel)) {
          _item.parameters.splice(index, 1)
        }
      })
    })
    setParameters(_parameters)
  }
  /** 编辑支付参数 */
  const handleEdit = (record, index, __payChannel) => {
    setPayChannel(__payChannel)
    setValue(record)
    setEditIndex(index)
    setIsEdit(true)
    setVisible(true)
  }

  const dataSource = (payType, _payChannel) => {
    let _parameters: any = []
    parameters.forEach((item: any) => {
      if (item.payType === payType) {
        _parameters = item.channels.filter((_item) => _item.payChannel === _payChannel)[0].parameters
      }
    })

    return [..._parameters]
  }

  const handleTabsChange = (activeKey) => {
    setPayChannel(activeKey)
  }

  /** 商户参数配置 - 查询会员通用支付参数配置列表 */
  const handleCommonParameterList = () => {
    if (LINE_UP_ALIPAY === Number(payChannel)) {
      getOrderPlatformPaymentMemberCommonParameterList({ payChannel }).then((res) => {
        if (res.code !== 1000) {
          message.error(res.message)
          return
        }
        setParameterList(res.data)
      })
    }
  }

  useEffect(() => {
    if (isEmpty(parameterList)) {
      handleCommonParameterList()
    }
  }, [payChannel])

  const CommonParameterCreate = (_data) => {
    postOrderPlatformPaymentMemberCommonParameterCreate(
      {
        payChannel: Number(payChannel),
        parameters: _data.map((item) => {
          return {
            code: item.code,
            value: item.valueEncrypted ? item.valueEncrypted : encryptedByAES(item.value, false),
            remark: item.remark,
          }
        }),
      },
      { ctlType: 'none' },
    ).then((res) => {
      if (res.code !== 1000) {
        message.error(res.message)
        return
      }
      setParameterVisible(false)
    })
  }

  const handleParameterConfirm = (format) => {
    const _data: any = [...parameterList]
    if (isEdit) {
      _data[editIndex] = format
    } else {
      _data.push(format)
    }
    CommonParameterCreate(_data)
    setParameterList(_data)
  }

  const handleParameterCancel = () => {
    setParameterVisible(false)
  }

  const handleParameterDelete = (_index) => {
    const _parameterList = [...parameterList]
    _parameterList.splice(_index, 1)
    setParameterList(_parameterList)
    CommonParameterCreate(_parameterList)
  }

  const handleParameterEdit = (record, index) => {
    setValue(record)
    setEditIndex(index)
    setIsEdit(true)
    setParameterVisible(true)
  }

  return (
    <PageHeaderWrapper
      title="平台支付参数配置"
      items={tabLink}
      extra={
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSubmit}>
          保存
        </Button>
      }
    >
      <Fragment>
        <Form {...layout} form={form}>
          <Space direction="vertical" size={16} style={{ display: 'flex' }}>
            {parameterFind.map((item, index) => (
              <Card id={`tabLink_${item.payType}`} title={item.payTypeName} key={`tabLink_${item.payType}`}>
                <div className={style.tabsLayout}>
                  {payTypeList
                    .filter((_item_) => _item_.payType === item.payType)
                    .map((nov, key) => (
                      <Tabs onChange={(e) => handleTabsChange(e)} key={key}>
                        {item.channels.map((_item, _index) => {
                          return (
                            <TabPane
                              tab={
                                <Space>
                                  <Image
                                    preview={false}
                                    width={16}
                                    height={16}
                                    src={PIC_MAP[_item.payChannel] ? PIC_MAP[_item.payChannel] : PIC_MAP[15]}
                                  />
                                  {_item.payChannelName}
                                </Space>
                              }
                              key={_item.payChannel}
                              forceRender
                            >
                              <Form.Item
                                label={`是否开启${_item.payChannelName}`}
                                name={`payChannel_${_item.payChannel}`}
                                initialValue={`_${_item.payChannel}`}
                              >
                                <Radio.Group
                                  size="small"
                                  buttonStyle="solid"
                                  onChange={(e) => handleRadioChang(e, item.payType)}
                                >
                                  <Radio.Button value={_item.payChannel}>是</Radio.Button>
                                  <Radio.Button value={`_${_item.payChannel}`}>否</Radio.Button>
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
                                  nov.payChannel.includes(getFieldValue(`payChannel_${_item.payChannel}`)) && (
                                    <Fragment>
                                      <div className={style.anchor}>
                                        {`${_item.payChannelName}支付参数配置`}
                                        {getFieldValue(`payChannel_${_item.payChannel}`) === 1 ? (
                                          <span className={style.tag}>平台代收模式</span>
                                        ) : null}
                                      </div>
                                      <Form.Item wrapperCol={{ span: 24 }} name={`payChannel_${_item.payChannel}`}>
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
                                        >
                                          新增参数配置
                                        </Button>
                                      </Form.Item>
                                    </Fragment>
                                  )
                                }
                              </Form.Item>
                              {_item.payChannel === LINE_UP_ALIPAY && (
                                <Form.Item
                                  noStyle
                                  shouldUpdate={(prevValues, currentValues) =>
                                    prevValues[`payChannel_${_item.payChannel}`] !==
                                    currentValues[`payChannel_${_item.payChannel}`]
                                  }
                                >
                                  {({ getFieldValue }) =>
                                    getFieldValue(`payChannel_${_item.payChannel}`) === LINE_UP_ALIPAY && (
                                      <Fragment>
                                        <div className={style.anchor}>
                                          {`${_item.payChannelName}支付参数配置`}
                                          {getFieldValue(`payChannel_${_item.payChannel}`) === LINE_UP_ALIPAY ? (
                                            <span className={style.tag}>会员直接到账模式</span>
                                          ) : null}
                                        </div>
                                        <Button
                                          style={{ marginBottom: '24px' }}
                                          onClick={() => history.open('/systemManage/platformRule/merchantPayType')}
                                        >
                                          商户参数配置
                                        </Button>
                                        <Form.Item wrapperCol={{ span: 24 }} name={`payChannel_${_item.payChannel}`}>
                                          <Table
                                            rowKey={(_record: any, index: any) => `table${index + 1}`}
                                            columns={columns1}
                                            dataSource={parameterList}
                                            pagination={false}
                                          />
                                          <Button
                                            type="dashed"
                                            block
                                            icon={<PlusOutlined />}
                                            style={{ marginBottom: '24px' }}
                                            onClick={() => setParameterVisible(true)}
                                          >
                                            新增参数配置
                                          </Button>
                                        </Form.Item>
                                      </Fragment>
                                    )
                                  }
                                </Form.Item>
                              )}
                            </TabPane>
                          )
                        })}
                      </Tabs>
                    ))}
                  {!payTypeList.map((it) => it.payType).includes(item.payType) && (
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
                              <Radio.Button value={_item.payChannel}>是</Radio.Button>
                              <Radio.Button value={`_${_item.payChannel}`}>否</Radio.Button>
                            </Radio.Group>
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
        {/* 支付参数配置 */}
        <ModalLayout
          value={value}
          visible={visible}
          payChannel={payChannel}
          onConfirm={(format) => handleConfirm(format)}
          onCancel={() => handleCancel()}
        />
        {/* 商家支付参数 */}
        <ParameterLayout
          value={value}
          visible={parameterVisible}
          payChannel={LINE_UP_ALIPAY.toString()}
          onConfirm={handleParameterConfirm}
          onCancel={handleParameterCancel}
        />
      </Fragment>
    </PageHeaderWrapper>
  )
}
export default PaySettingLayout
