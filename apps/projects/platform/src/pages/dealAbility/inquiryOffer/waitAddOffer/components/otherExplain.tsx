import React, { useCallback, useEffect, useState } from 'react'
import { Row, Col, Form, Input, InputNumber, Select, Button } from 'antd'
import { Card } from '@linkseeks/ui'
import { LinkOutlined } from '@ant-design/icons'
import TableModal from '@/pages/transaction/components/tableModal'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getMemberManageUsersPage } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { getTelCodeOptions } from '@apps/services'

interface OtherExplainLayoutProps {
  /** 获取联系人 */
  getContacts?: (e) => void
}
const intl = getIntl()
const OtherExplainLayout: React.FC<OtherExplainLayoutProps> = (props: any) => {
  const { getContacts } = props
  const [visible, setVisible] = useState<boolean>(false)
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

  const fetchTelCode = async () => {
    setTelCode(await getTelCodeOptions())
  }

  const toggle = (flag: boolean) => {
    setVisible(flag)
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

  const handleConfirm = (selectRowKeys: string[] | number[], selectRowRecord: any) => {
    const target = selectRowRecord[0]
    getContacts(target)
    toggle(false)
  }
  return (
    <Card id="otherExplainLayout" title={intl.formatMessage({ id: 'dealAbility.qitashuoming' })}>
      <Row gutter={[48, 24]}>
        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'dealAbility.zuixiaoqiding' })}
            name="minimumOrder"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'dealAbility.qingshuruzuixiaoqidingshu' }),
              },
              {
                pattern: /^\d+(\.\d{1,3})?$/,
                message: intl.formatMessage({ id: 'dealAbility.zuixiaoqidingshuxiaoshudian' }),
              },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'dealAbility.baojialianxiren' })}
            name="contactName"
            rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingxuanzebaojialianxiren' }) }]}
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
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.jiaofushuoming' })} name="deliveryInstructions">
            <Input.TextArea
              maxLength={50}
              autoSize
              placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
            />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.fukuanshuoming' })} name="paymentType">
            <Input.TextArea
              maxLength={50}
              autoSize
              placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
            />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.shuifeishuoming' })} name="taxes">
            <Input.TextArea
              maxLength={50}
              autoSize
              placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.wuliushuoming' })} name="logistics">
            <Input.TextArea
              maxLength={50}
              autoSize
              placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
            />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.baozhuangshuoming' })} name="packRequire">
            <Input.TextArea
              maxLength={50}
              autoSize
              placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
            />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ id: 'dealAbility.qitashuoming' })} name="otherRequire">
            <Input.TextArea
              maxLength={50}
              autoSize
              placeholder={intl.formatMessage({ id: 'dealAbility.zuichang100gezifu50ge' })}
            />
          </Form.Item>
        </Col>
      </Row>
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
    </Card>
  )
}

export default OtherExplainLayout
