import React, { useCallback, useState, useContext, useEffect } from 'react'
import { Row, Col, Form, Input, Button, Typography } from 'antd'
import { Context } from '@/pages/transaction/components/detailLayout/components/context'
import { LinkOutlined } from '@ant-design/icons'
import { Card } from '@linkseeks/ui'
import style from './index.less'
import TableModal from '@/pages/transaction/components/tableModal'
import { formatTimeString } from '@/utils'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { isEmpty } from 'lodash'
import { getTradeCorrespondingInquiryNumber } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
interface BasicInfoLayoutProps {
  /** 获取询价单 */
  getInquiryInfo: (e) => void
  /** 是否可修改 */
  isEdit?: boolean
  /** 询价单信息 */
  inq?: any
}
const intl = getIntl()
const BasicInfoLayout: React.FC<BasicInfoLayoutProps> = (props: any) => {
  const { getInquiryInfo, isEdit, inq } = props
  const context = useContext(Context)
  const [visible, setVisible] = useState<boolean>(false)
  const [inquiry, setInquiry] = useState<any>({})

  const columns: any = [
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiadanhao' }),
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiadanzhaiyao' }),
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.xunjiahuiyuan' }),
      dataIndex: 'memberName',
      key: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.danjushijian' }),
      dataIndex: 'documentTime',
      key: 'documentTime',
      render: (text: any, record: any) => formatTimeString(text),
    },
  ]

  const handleFetchData = useCallback((params: any) => {
    return new Promise((resolve) => {
      getTradeCorrespondingInquiryNumber({ ...params })
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

  const handleSubmit = (selectRowKeys: string[] | number[], selectRowRecord: any) => {
    const target = selectRowRecord[0]
    getInquiryInfo(target)
    setInquiry(target)
    toggle(false)
  }

  const hanleGoOrderInfo = () => {
    if (inquiry.inquiryListId) {
      history.open(`/dealAbility/inquiryOffer/inquirySearch/inquiry/preview?id=${inquiry.inquiryListId}`)
    }
  }

  useEffect(() => {
    if (!isEmpty(inq)) {
      setInquiry(inq)
    }
  }, [inq])

  console.log(context, 96)

  return (
    <Card id="basicInfoLayout" title={intl.formatMessage({ id: 'dealAbility.jibenxinxi' })}>
      <Row gutter={[48, 24]}>
        <Col span={12} className={style.searchColor}>
          <Form.Item
            label={intl.formatMessage({ id: 'dealAbility.baojiadanzhaiyao' })}
            name="details"
            rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingshurubaojiadanzhaiyao' }) }]}
          >
            <Input maxLength={30} placeholder={intl.formatMessage({ id: 'dealAbility.zuichang60zifu30gehan' })} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'dealAbility.duiyingxunjiadanhao' })}
            name="inquiryListNo"
            rules={[{ required: true, message: intl.formatMessage({ id: 'dealAbility.qingxuanzeduiyingxunjiadan' }) }]}
          >
            <Input.Search
              onClick={hanleGoOrderInfo}
              readOnly
              onSearch={() => toggle(true)}
              enterButton={
                <Button disabled={isEdit} style={{ height: '31.19px' }} icon={<LinkOutlined />}>
                  {intl.formatMessage({ id: 'dealAbility.xuanze' })}
                </Button>
              }
            />
          </Form.Item>
        </Col>
        <Col span={12} className={style.searchColor}>
          <Form.Item style={{ marginBottom: '0px' }} label={intl.formatMessage({ id: 'dealAbility.xunjiahuiyuan' })}>
            <Typography.Text>
              {context.inquiryListMemberName ? context.inquiryListMemberName : context.memberName}
            </Typography.Text>
          </Form.Item>
          <Form.Item
            style={{ marginBottom: '0px' }}
            label={intl.formatMessage({ id: 'dealAbility.baojiajiezhishijian' })}
          >
            <Typography.Text>{context.quotationAsTime && formatTimeString(context.quotationAsTime)}</Typography.Text>
          </Form.Item>
          <Form.Item style={{ marginBottom: '0px' }} label={intl.formatMessage({ id: 'dealAbility.danjushijian' })}>
            <Typography.Text>{context.voucherTime && formatTimeString(context.voucherTime)}</Typography.Text>
          </Form.Item>
        </Col>
      </Row>
      <TableModal
        modalType="Drawer"
        visible={visible}
        title={intl.formatMessage({ id: 'dealAbility.xuanzexunjiadan' })}
        mode="radio"
        tableProps={{
          rowKey: 'orderId',
        }}
        customKey="orderId"
        fetchData={handleFetchData}
        onClose={() => toggle(false)}
        onOk={handleSubmit}
        columns={columns}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'inquiryListNo', FORM_FILTER_PATH)
        }}
        schema={{
          type: 'object',
          properties: {
            megalayout: {
              type: 'object',
              'x-component': 'mega-layout',
              properties: {
                inquiryListNo: {
                  type: 'string',
                  'x-component': 'Search',
                  'x-mega-props': {},
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'dealAbility.xunjiadanhao' }),
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
                    memberName: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'dealAbility.xunjiahuiyuan' }),
                      },
                    },
                    details: {
                      type: 'string',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'dealAbility.xunjiadanzhaiyao' }),
                      },
                    },
                    '[startDocumentsTime,endDocumentsTime]': {
                      type: 'string',
                      'x-component': 'dateSelect',
                      'x-component-props': {
                        placeholder: intl.formatMessage({ id: 'dealAbility.danjushijianquanbu' }),
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

export default BasicInfoLayout
