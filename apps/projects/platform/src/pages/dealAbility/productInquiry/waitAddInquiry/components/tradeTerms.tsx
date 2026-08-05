import React, { useCallback, useState, useEffect } from 'react'
import { Row, Col, Form, Input, DatePicker, Select, Button } from 'antd'
import { Card } from '@linkseeks/ui'
import moment from 'moment'
import { LinkOutlined } from '@ant-design/icons'
import TableModal from '@/pages/transaction/components/tableModal'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import AddressSelect from '@/components/AddressSelect'
import style from './index.less'
import { isEmpty } from 'lodash'
import { getMemberManageUsersPage } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { getTelCodeOptions } from '@apps/services'
const intl = getIntl()
const disabledDate = (current) => {
  return current && current < moment().startOf('day')
}

interface TradeTermsLayoutProps {
  /** 获取地址详情 */
  getFullAddress?: (e) => void
  /** 获取联系人 */
  getContacts?: (e) => void
  /** 回显数据 */
  fullAddress?: any
  /** 二次询价 */
  isEdit?: boolean
  /** 二次询价地址显示 */
  isDefault?: boolean
}

const TradeTermsLayout: React.FC<TradeTermsLayoutProps> = (props: any) => {
  const { getFullAddress, getContacts, fullAddress, isEdit, isDefault } = props
  const [visible, setVisible] = useState<boolean>(false)
  const [address, setaddress] = useState<any>({})
  const [telCode, setTelCode] = useState<any>([])
  const handleFetchData = useCallback((params: any) => {
    return new Promise((resolve) => {
      getMemberManageUsersPage({ ...params })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          resolve(res.data)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }, [])

  const toggle = (flag: boolean) => {
    setVisible(flag)
  }

  // 获取手机code
  const fetchTelCode = async () => {
    setTelCode(await getTelCodeOptions())
  }

  const columns: any = [
    {
      title: intl.formatMessage({ id: 'dealAbility.xuhao' }),
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.yonghuxingming' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.shoujihao' }),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.suoshujigou' }),
      dataIndex: 'orgName',
      key: 'orgName',
    },
  ]

  const handleConfirm = (_selectRowKeys: string[] | number[], selectRowRecord: any) => {
    const target = selectRowRecord[0]
    getContacts(target)
    toggle(false)
  }

  useEffect(() => {
    getMemberManageUsersPage({ current: '1', pageSize: '10' })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { data } = res.data
        getContacts(data[0])
      })
      .catch((error) => {
        console.warn(error)
      })
    fetchTelCode()
  }, [])

  useEffect(() => {
    if (!isEmpty(fullAddress)) {
      setaddress({
        id: fullAddress.fullAddressId,
      })
      console.log(fullAddress)
    }
  }, [fullAddress])

  console.log(isEdit, 10086)

  return (
    <Card id="tradeTermsLayout" title={intl.formatMessage({ id: 'dealAbility.jiaoyitiaojian' })}>
      <Row gutter={[48, 24]}>
        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'dealAbility.jiaofuriqi' })}
            dependencies={['quotationAsTime']}
            name="deliveryTime"
            rules={[
              { required: true, message: intl.formatMessage({ id: 'dealAbility.qingxuanzejiaofuriqi' }) },
              ({ getFieldValue }) => ({
                validator: (_rule, value) => {
                  const _startTime = getFieldValue('quotationAsTime')
                  if (_startTime && !moment(value).isAfter(_startTime)) {
                    return Promise.reject(new Error(`${intl.formatMessage({ id: 'dealAbility.dayubaojiajiezhi' })}`))
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <DatePicker style={{ width: '100%' }} disabledDate={disabledDate} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            required
            label={intl.formatMessage({ id: 'dealAbility.jiaofudizhi' })}
            className={style.address_style}
          >
            <AddressSelect
              echo={isDefault}
              value={isDefault ? fullAddress.fullAddress : address}
              isDefaultAddress
              addressType={1}
              disabled={false}
              onChange={getFullAddress}
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'dealAbility.baojiajiezhishijian' })}
            name="quotationAsTime"
            dependencies={['deliveryTime']}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'dealAbility.qingxuanzebaojiajiezhishi' }) },
              ({ getFieldValue }) => ({
                validator: (_rule, value) => {
                  const _startTime = getFieldValue('deliveryTime')
                  if (_startTime && !moment(value).isBefore(_startTime)) {
                    return Promise.reject(new Error(`${intl.formatMessage({ id: 'dealAbility.xiaoyujiaofushijian' })}`))
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <DatePicker style={{ width: '100%' }} disabledDate={disabledDate} showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'dealAbility.xunjialianxiren' })}
            name="contactName"
            rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingxuanzexunjialianxiren' }) }]}
          >
            <Input.Search
              onSearch={() => toggle(true)}
              readOnly
              enterButton={
                <Button style={{ height: '31.19px' }} icon={<LinkOutlined />}>
                  {intl.formatMessage({ id: 'dealAbility.xuanze' })}
                </Button>
              }
            />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'dealAbility.lianxirendianhua' })}
            required
            style={{ marginBottom: '0px' }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="phoneCode"
                  rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingxuanze' }) }]}
                  initialValue={telCode[0]}
                >
                  <Select>
                    {telCode.map((item) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="contactPhone"
                  rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingxuanze' }) }]}
                >
                  <Input type="number" maxLength={11} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.fukuanfangshi' })} name="paymentType">
            <Input.TextArea
              maxLength={50}
              autoSize
              placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.baojiayaoqiu' })} name="offer">
            <Input.TextArea
              maxLength={50}
              autoSize
              placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
            />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.shuifeiyaoqiu' })} name="taxes">
            <Input.TextArea
              maxLength={50}
              autoSize
              placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
            />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.wuliuyaoqiu' })} name="logistics">
            <Input.TextArea
              maxLength={50}
              autoSize
              placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
            />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.baozhuangyaoqiu' })} name="packRequire">
            <Input.TextArea
              maxLength={50}
              autoSize
              placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
            />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.qitayaoqiu' })} name="otherRequire">
            <Input.TextArea
              maxLength={50}
              autoSize
              placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
            />
          </Form.Item>
        </Col>
      </Row>
      {/* 选择用户 */}
      <TableModal
        modalType="Drawer"
        visible={visible}
        title={intl.formatMessage({ id: 'dealAbility.xuanzeyonghu' })}
        mode="radio"
        tableProps={{
          rowKey: 'userId',
        }}
        customKey="userId"
        fetchData={handleFetchData}
        onClose={() => toggle(false)}
        onOk={handleConfirm}
        columns={columns}
        effects={($, actions) => {
          actions.reset()
          useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
        }}
        schema={{
          type: 'object',
          properties: {
            megalayout: {
              type: 'object',
              'x-component': 'mega-layout',
              properties: {
                name: {
                  type: 'string',
                  'x-component': 'Search',
                  'x-mega-props': {},
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'dealAbility.yonghuxingming' }),
                    align: 'flex-left',
                  },
                },
              },
            },
            [FORM_FILTER_PATH]: {
              type: 'object',
              'x-component': 'flex-layout',
              'x-component-props': {
                rowStyle: {
                  justifyContent: 'flex-start',
                  flexWrap: 'nowrap',
                },
                colStyle: {
                  //改变间隔
                  marginRight: 20,
                },
              },
              properties: {
                PRO_LAYOUT: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-mega-props': {
                    span: 5,
                  },
                  'x-component-props': {
                    inline: true,
                  },
                  properties: {
                    orgName: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'dealAbility.suoshujigou' }),
                      },
                    },
                  },
                },
                sumbit: {
                  'x-component': 'Submit',
                  'x-mega-props': {
                    span: 1,
                  },
                  'x-component-props': {
                    children: intl.formatMessage({ id: 'dealAbility.chaxun' }),
                  },
                },
              },
            },
          },
        }}
      />
      {/* 地址管理 */}
    </Card>
  )
}

export default TradeTermsLayout
