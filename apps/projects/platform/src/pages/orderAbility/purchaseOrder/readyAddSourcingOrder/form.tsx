import React, { useRef, useState } from 'react'
import { PageHeaderWrapper, ModalFormTable, StandardFormTable } from '@apps/components'
import { Button, Card, Space } from '@linkseeks/ui'
import { Col, Form, Input, message, Row, Select } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useWebIntl } from '@apps/locales'
import {
  postOrderBuyerCreatePurchase,
  postOrderBuyerCreatePurchaseUpdate,
  postTradeAskPurchasePageQuote,
} from '@apps/apis'
import { history } from '@linkseeks/router-manager'
import Invoice from './components/invoice'
import OrderProducts from './components/orderProducts'
import Payment from './components/payment'
import Address from './components/address'
import Other from './components/other'
import useSourcingOrder from './hooks'
import { OrderProvider, useOrder } from './orderProvider'
import { quoteColumns } from './constants/columns'
import moment from 'moment'
import { usePageStatus } from '@/hooks/usePageStatus'

const SourcingOrderForm: React.FC = () => {
  const { id } = usePageStatus()
  const { form, warehouseOptions, getQuoteOrderInfo } = useOrder()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const modalRef = useRef<any>()
  const translate = useWebIntl()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setConfirmLoading(true)
      console.log(values, 'values')
      const payload = {
        ...values,
        deliverDate: moment(values.deliverDate).format('YYYY-MM-DD HH:mm'),
        consignee: {
          consigneeId: values.consignee?.id,
          consignee: values.consignee?.receiverName,
          provinceCode: values.consignee?.provinceCode,
          cityCode: values.consignee?.cityCode,
          districtCode: values.consignee?.districtCode,
          streetCode: values.consignee?.streetCode,
          address: values.consignee?.address,
          postalCode: values.consignee?.postalCode,
          countryCode: values.consignee?.areaCode,
          phone: values.consignee?.phone,
          telephone: values.consignee?.tel,
          defaultConsignee: values.consignee?.isDefault === 1 ? true : false,
        },
      }
      if (id) {
        postOrderBuyerCreatePurchaseUpdate({ ...payload, orderId: id })
          .then((res) => {
            if (res.code === 1000) {
              history.goBack()
            }
          })
          .finally(() => {
            setConfirmLoading(false)
          })
      } else {
        postOrderBuyerCreatePurchase(payload)
          .then((res) => {
            if (res.code === 1000) {
              history.goBack()
            }
          })
          .finally(() => {
            setConfirmLoading(false)
          })
      }
    })
  }

  const fetchDate = async (params) => {
    const { data } = await postTradeAskPurchasePageQuote(
      {
        ...params,
        innerStatus: 8,
      },
      { ctlType: 'none' },
    )
    return data
  }

  const handleModalConfirm = (selectedRows: Record<string, any>[]) => {
    if (selectedRows.length === 0) {
      message.info(translate('web.common.selectOneRequest'))
      return
    }
    getQuoteOrderInfo(selectedRows[0].id)
    modalRef?.current?.setVisible(false)
  }

  return (
    <PageHeaderWrapper
      title={translate('web.resource.order.xinzengxunyuancaigoudingdan')}
      extra={
        <Button type="primary" loading={confirmLoading} onClick={handleSubmit} icon={<SaveOutlined />}>
          {translate('web.common.save')}
        </Button>
      }
    >
      <Form
        form={form}
        style={{ width: '100%', display: 'flex' }}
        labelAlign="left"
        wrapperCol={{
          span: 16,
        }}
        labelCol={{
          span: 4,
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <Card title={translate('web.common.jibenxinxi')}>
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="orderMode" initialValue={22} hidden>
                  <Input />
                </Form.Item>
                <Form.Item label={translate('web.resource.order.xiadanmoshi')}>
                  <span>{translate('web.resource.order.xunyuanbaojiaxiadan')}</span>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={translate('web.resource.order.dingdanzhaiyao')}
                  name="digest"
                  rules={[
                    {
                      required: true,
                      message: translate('web.common.qingtianxie'),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="orderType" initialValue={20} hidden>
                  <Input />
                </Form.Item>
                <Form.Item label={translate('web.resource.order.dingdanleixing')} initialValue={20}>
                  <span>{translate('web.resource.order.xunyuancaigou')}</span>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="askPurchaseQuoteId" hidden>
                  <Input />
                </Form.Item>
                <Form.Item label={translate('web.resource.order.duiyingbaojiadan')} name="askPurchaseQuoteNo">
                  <Input
                    disabled
                    addonAfter={
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          modalRef?.current?.setVisible(true)
                        }}
                      >
                        {translate('web.common.select')}
                      </span>
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="vendorMemberId" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="vendorRoleId" hidden>
                  <Input />
                </Form.Item>
                <Form.Item label={translate('web.resource.member.gouyingshangmingchen')} name="vendorMemberName">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={translate('web.resource.order.xiadancangku')}
                  name="warehouseId"
                  tooltip={translate('web.resource.order.querenshouhuoshimorenxuanzegaicangku')}
                >
                  <Select
                    options={warehouseOptions?.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                    onChange={(value) => {
                      const selectItem = warehouseOptions?.find((item) => item.id === value)
                      if (selectItem) {
                        form.setFieldValue('warehouseName', selectItem.name)
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item name="warehouseName" hidden>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="shopId" hidden>
                  <Input disabled />
                </Form.Item>
                <Form.Item name="shopType" initialValue={1} hidden>
                  <Input disabled />
                </Form.Item>
                <Form.Item name="shopEnvironment" initialValue={1} hidden>
                  <Input disabled />
                </Form.Item>
                <Form.Item label={translate('web.resource.mall.laiyuanshangcheng')} name="shopName">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          {/* 订单商品 */}
          <Card title={translate('web.resource.order.dingdanshangpin')}>
            <Form.Item
              name="products"
              rules={[
                {
                  required: true,
                  message: translate('web.common.qingxuanze'),
                },
              ]}
              wrapperCol={{
                span: 24,
              }}
            >
              <OrderProducts />
            </Form.Item>
          </Card>
          {/* 支付信息 */}
          <Card title={translate('web.resource.order.zhifuxinxi')}>
            <Form.Item
              name="payments"
              rules={[
                {
                  required: true,
                  message: translate('web.common.qingxuanze'),
                },
              ]}
              wrapperCol={{
                span: 24,
              }}
            >
              <Payment />
            </Form.Item>
          </Card>
          {/* 送货信息 */}
          <Address />
          {/* 发票信息 */}
          <Invoice />
          {/* 其他信息 */}
          <Other />
        </Space>
      </Form>
      <ModalFormTable
        modalProps={{
          title: translate('web.resource.order.xuanzebaojiadan'),
        }}
        width={760}
        request={fetchDate}
        columns={quoteColumns}
        actionRef={modalRef}
        isRowSelection
        rowSelectionType="radio"
        onOk={handleModalConfirm}
      />
    </PageHeaderWrapper>
  )
}

export default () => {
  const initValue = useSourcingOrder()

  return (
    <OrderProvider value={initValue}>
      <SourcingOrderForm />
    </OrderProvider>
  )
}
