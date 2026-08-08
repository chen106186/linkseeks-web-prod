import React, { useRef, useState } from 'react'
import { PageHeaderWrapper, ModalFormTable, StandardFormTable } from '@apps/components'
import { Button, Card, Space } from '@linkseeks/ui'
import { Col, Form, Input, message, Row, Select } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useWebIntl } from '@apps/locales'
import {
  postOrderCollectiveCreatePurchase,
  postOrderCollectiveCreatePurchaseUpdate,
  postOrderCollectiveCreateBidding,
  // postOrderCollectiveCreateBiddingUpdate,
  getPurchasePurchaseInquiryList,
  getPurchaseBiddingList,
  getPurchaseQuotedPriceGetQuotedList,
  getPurchaseOnlineBiddingGetQuotedList,
} from '@apps/apis'
import { history } from '@linkseeks/router-manager'
import Invoice from './components/invoice'
import OrderProducts from './components/orderProducts'
import Payment from './components/payment'
import Address from './components/address'
import Other from './components/other'
import useSourcingOrder from './hooks'
import { OrderProvider, useOrder } from './orderProvider'
import { inquiryColumns, inquiryBidColumns, quoteColumns, biddingColumns } from './constants/columns'
import moment from 'moment'
import { usePageStatus } from '@/hooks/usePageStatus'

/** 询价报价 */
export const INQUIRY_SOURCE_TYPE = 23
/** 采购竞价 */
export const BIDDING_SOURCE_TYPE = 24

const SourcingOrderForm: React.FC = () => {
  const { id } = usePageStatus()
  const { productsRef, form, sourceType, setSourceType, warehouseOptions } = useOrder()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const modalRef = useRef<any>()
  const quoteModalRef = useRef<any>()
  const translate = useWebIntl()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setConfirmLoading(true)
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
        postOrderCollectiveCreatePurchaseUpdate({ ...payload, orderId: id })
          .then((res) => {
            if (res.code === 1000) {
              history.goBack()
            }
          })
          .finally(() => {
            setConfirmLoading(false)
          })
      } else {
        ;(sourceType === INQUIRY_SOURCE_TYPE ? postOrderCollectiveCreatePurchase : postOrderCollectiveCreateBidding)(
          payload,
        )
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
    if (sourceType === INQUIRY_SOURCE_TYPE) {
      const { data } = await getPurchasePurchaseInquiryList({
        ...params,
        interiorState: 99,
      })
      return data
    } else {
      const { data } = await getPurchaseBiddingList({
        ...params,
        interiorState: 99,
      })
      return data
    }
  }

  const fetchQuoteDate = async (params) => {
    if (sourceType === INQUIRY_SOURCE_TYPE) {
      const inquiryNo = form.getFieldValue('inquiryNo')
      if (inquiryNo) {
        const { data } = await getPurchaseQuotedPriceGetQuotedList({
          ...params,
          purchaseInquiryNo: inquiryNo,
        })
        return data
      }
    } else {
      const biddingNo = form.getFieldValue('inquiryNo')
      if (biddingNo) {
        const { data } = await getPurchaseOnlineBiddingGetQuotedList({
          ...params,
          biddingNo: biddingNo,
        })
        return data
      }
    }
  }

  const handleModalConfirm = (selectedRows: Record<string, any>[]) => {
    if (selectedRows.length === 0) {
      message.info(translate('web.common.selectOneRequest'))
      return
    }
    form.setFieldsValue({
      inquiryId: selectedRows[0].id,
      inquiryNo: sourceType === INQUIRY_SOURCE_TYPE ? selectedRows[0].purchaseInquiryNo : selectedRows[0].biddingNo,
    })

    modalRef?.current?.setVisible(false)
  }

  const handleQuoteModalConfirm = (selectedRows: Record<string, any>[]) => {
    if (selectedRows.length === 0) {
      message.info(translate('web.common.selectOneRequest'))
      return
    }

    form.setFieldsValue({
      quoteNo: sourceType === INQUIRY_SOURCE_TYPE ? selectedRows[0].quotedPriceNo : selectedRows[0].biddingQuoteNo,
      quoteId: sourceType === INQUIRY_SOURCE_TYPE ? selectedRows[0].id : selectedRows[0].biddingQuoteId,
      vendorMemberName: selectedRows[0].createMemberName,
      vendorRoleId: selectedRows[0].createMemberRoleId,
      vendorMemberId: selectedRows[0].createMemberId,
      digest: sourceType === INQUIRY_SOURCE_TYPE ? selectedRows[0].quotedDetails : selectedRows[0].biddingDetails,
    })

    quoteModalRef?.current?.setVisible(false)
    // 需要清空订单商品
    form.setFieldValue('products', [])
    productsRef.current.reload()
  }

  return (
    <PageHeaderWrapper
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
                <Form.Item label={translate('web.resource.order.xiadanmoshi')}>
                  <span>{translate('web.resource.order.jicaixiadan')}</span>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="orderType" initialValue={4} hidden>
                  <Input />
                </Form.Item>
                <Form.Item label={translate('web.resource.order.dingdanleixing')}>
                  <span>{translate('web.resource.order.jicaidingdan')}</span>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  initialValue={INQUIRY_SOURCE_TYPE}
                  name="orderMode"
                  label={translate('web.resource.order.laiyuandanju')}
                >
                  <Select
                    options={[
                      {
                        label: translate('web.resource.order.xunjiabaojiadan'),
                        value: INQUIRY_SOURCE_TYPE,
                      },
                      {
                        label: translate('web.resource.order.caigoujingjiadan'),
                        value: BIDDING_SOURCE_TYPE,
                      },
                    ]}
                    onChange={() => {
                      form.setFieldsValue({
                        inquiryId: '',
                        inquiryNo: '',
                        quoteId: '',
                        quoteNo: '',
                        vendorMemberName: '',
                        vendorRoleId: '',
                        vendorMemberId: '',
                        digest: '',
                      })
                    }}
                  />
                </Form.Item>
              </Col>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, curValues) => prevValues.sourceType !== curValues.sourceType}
                dependencies={['orderMode']}
              >
                {({ getFieldValue }) => {
                  const sourceType = getFieldValue('orderMode')

                  return (
                    <>
                      <Col span={12}>
                        <Form.Item name={'inquiryId'} hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label={
                            sourceType === BIDDING_SOURCE_TYPE
                              ? translate('web.resource.order.xuanzejingjiadan')
                              : translate('web.resource.order.xuanzexunjiadan')
                          }
                          name={'inquiryNo'}
                        >
                          <Input
                            disabled
                            addonAfter={
                              <span
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setSourceType(sourceType)
                                  modalRef?.current?.setVisible(true)
                                  modalRef.current?.reload()
                                }}
                              >
                                {translate('web.common.select')}
                              </span>
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name={'quoteId'} hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item label={translate('web.resource.order.xuanzebaojiadan')} name={'quoteNo'}>
                          <Input
                            disabled
                            addonAfter={
                              <span
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  const inquiryId = form.getFieldValue('inquiryId')
                                  if (!inquiryId) {
                                    message.warning(
                                      sourceType === INQUIRY_SOURCE_TYPE
                                        ? translate('web.resource.order.qingxuanzexunjiaxuqiudan')
                                        : translate('web.resource.order.qingxuanzejingjiaxuqiudan'),
                                    )
                                    return
                                  }
                                  quoteModalRef?.current?.setVisible(true)
                                  quoteModalRef?.current?.reload()
                                }}
                              >
                                {translate('web.common.select')}
                              </span>
                            }
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )
                }}
              </Form.Item>

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
              <OrderProducts sourceType={sourceType} />
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
          title:
            sourceType === INQUIRY_SOURCE_TYPE
              ? translate('web.resource.order.xuanzecaigouxunjiadan')
              : translate('web.resource.order.xuanzecaigoujingjiadan'),
        }}
        width={660}
        request={fetchDate}
        columns={sourceType === INQUIRY_SOURCE_TYPE ? inquiryColumns : inquiryBidColumns}
        actionRef={modalRef}
        isRowSelection
        rowSelectionType="radio"
        onOk={handleModalConfirm}
        getCheckboxProps={(record) => ({
          disabled: record.id === form.getFieldValue('inquiryId'),
        })}
      />
      <ModalFormTable
        modalProps={{
          title:
            sourceType === INQUIRY_SOURCE_TYPE
              ? translate('web.resource.order.xuanzexunjiabaojiadan')
              : translate('web.resource.order.xuanzecaigoujingjiadan'),
        }}
        width={760}
        request={fetchQuoteDate}
        columns={sourceType === INQUIRY_SOURCE_TYPE ? quoteColumns : biddingColumns}
        actionRef={quoteModalRef}
        isRowSelection
        rowSelectionType="radio"
        onOk={handleQuoteModalConfirm}
        getCheckboxProps={(record) => ({
          disabled:
            sourceType === INQUIRY_SOURCE_TYPE
              ? record.id === form.getFieldValue('quoteId')
              : record.biddingQuoteId === form.getFieldValue('quoteId'),
        })}
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
