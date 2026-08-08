import React, { useRef, useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { Button, Row, Col, message } from 'antd'
import { createFormActions, registerVirtualBox, useFormSpy } from '@apps/formily'
import { SaveOutlined, PlusOutlined, LinkOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import { mergeAllSchemas } from './schema'
import {
  useEditHideField,
  useOrderDeliverTimeEffect,
  useOrderFormInitEffect,
  useProductTableChangeForPay,
} from './effects'
import { procurementProcessField, procurementRenderField, procurmentRenderInit } from './constant'
import ProductModalTable from './components/productModalTable'
import CirculationRecord from '../circulationRecord'
import SelectAddress from '../../components/AddressSelectList'
import SelectContract from './components/selectContract'
import TheInvoiceList from './components/theInvoiceList'
import { usePaymentInfo } from './model/usePaymentInfo'
import { useProductTable } from './model/useProductTable'
import styled from 'styled-components'
import { useUpdate } from '@linkseeks/hooks'
import { help } from '@/pages/transaction/common'
import { fetchOrderApi } from './apis'
import MemberModalTable from './components/memberModalTable'
import { FormDetailContext } from '@/formSchema/context'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import FormDetailHeader from '@/components/FormDetailHeader'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import {
  getLogisticsReceiverAddressGet,
  getLogisticsSelectListMemberShipperAddress,
  postLogisticsFreightTemplateCalFreightPrice,
} from '@apps/apis'
import { getOrderBuyerCreateDetail, postOrderBuyerCreatePurchase, postOrderBuyerCreatePurchaseUpdate } from '@apps/apis'
import { getProductSelectGetWarehouse } from '@apps/apis'
import { fectchShopListsSource } from '@/utils/type'
import moment from 'moment'

export interface AgentOrderDetailProps {}

const RowStyle = styled((props) => (
  <Row style={{ marginTop: 12 }} justify="end" {...props}>
    {props.children}
  </Row>
))`
  .ant-col {
    text-align: center;
  }
  .ant-col div {
    margin-bottom: 12px;
  }
`

const addSchemaAction = createFormActions()

// 总计金额联动框
export const MoneyTotalBox = registerVirtualBox('moneyTotalBox', () => {
  const intl = useIntl()
  const { form } = useFormSpy({ selector: [['onFieldValueChange', 'products']], reducer: (v) => v })
  const data = form.getFieldValue('products')
  const receiverAddressId = form.getFieldValue('deliveryAddresId')
  const sum = data.reduce((prev, next) => (prev * 100 + (next.money || 0) * 100) / 100, 0)
  const [freePrice, setFreePrice] = useState<number>(0)
  const { pageStatus } = usePageStatus()

  useEffect(() => {
    if (sum + freePrice) {
      const v = sum + freePrice
      form.notify('sumPrice', v)
      addSchemaAction.setFieldValue('sumPrice', v)
      addSchemaAction.setFieldValue('freight', freePrice)
    }
  }, [sum, freePrice, form])

  useEffect(() => {
    // 存在商品 并且有选择收货地址，则开始计算运费(有物流和运费模板的商品)，此外 送货地址变动也要重新计算
    if (data && data.length > 0 && receiverAddressId) {
      // 筛选配送方式为物流的商品并且使用了运费模板
      let logsiticsDataMaps = []
      // 新增和编辑取不同的字段
      if (pageStatus === PageStatus.ADD) {
        logsiticsDataMaps = data.filter((v) => v.logistics && v.logistics.useTemplate && v.logistics.deliveryType === 1)
      } else if (pageStatus === PageStatus.EDIT) {
        logsiticsDataMaps = data.filter((v) => v.logistics && v.deliveryType === 1)
      }
      if (logsiticsDataMaps.length > 0) {
        postLogisticsFreightTemplateCalFreightPrice(
          {
            orderProductList: logsiticsDataMaps.map((v) => ({
              templateId: v.logistics.templateId || v.logisticsTemplateId,
              weight: v.logistics.weight || v.weight,
              count: v?.purchaseCount || 0,
            })),
            receiverAddressId: typeof receiverAddressId === 'object' ? receiverAddressId.id : receiverAddressId,
          },
          { ttl: 10 * 1000, useCache: true, ctlType: 'none' },
        ).then((res) => {
          if (res.code === 1000) {
            setFreePrice(res.data)
          }
        })
      } else {
        setFreePrice(Number(data[0]?.freight) || 0)
      }
    }
  }, [data, receiverAddressId])

  return (
    <RowStyle>
      <Col span={2}>
        <div>{intl.formatMessage({ id: 'purchaseOrder.orderCollect.title1' })}</div>
        <div>{`${sum.toFixed(2)}`}</div>
      </Col>
      <Col span={2}>
        <div>{intl.formatMessage({ id: 'purchaseOrder.orderCollect.title2' })}</div>
        <div>{`${freePrice.toFixed(2)}`}</div>
      </Col>
      <Col span={2}>
        <div>{intl.formatMessage({ id: 'purchaseOrder.orderCollect.title3' })}</div>
        <div>{`${(sum + freePrice).toFixed(2)}`}</div>
      </Col>
    </RowStyle>
  )
})

/** 现货采购订单 下单 */
const AgentOrderDetail: React.FC<AgentOrderDetailProps> = () => {
  const intl = useIntl()
  const shopDataRef = useRef<any>({})
  const memberRef = useRef<any>({})
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const update = useUpdate()
  const productSumPriceRef = useRef<any>(0)
  const { pageStatus, id, modelType } = usePageStatus()
  const [initFormSchema] = useState<any>(() => ({ ...mergeAllSchemas }))
  const [initFormValue, setInitFormValue] = useState<any>(() => {
    let resultState = {}
    if (modelType) {
      resultState = {
        orderMode: parseInt(modelType),
      }
    }
    return resultState
  })
  const [warehouseOptions, setWarehouseOptions] = useState<any>([])

  const { formContext } = useFormDetail()

  const [products, setProducts] = useState<any>([])
  const [paymentColumns, paymentComponents, paymentSave] = usePaymentInfo(
    addSchemaAction,
    pageStatus === PageStatus.ADD ? addSchemaAction.getFieldValue('products') : products,
  )
  // 订单商品
  const {
    productAddButton,
    selectedIds,
    searchSelectMaps,
    productTableRef,
    productRef,
    productColumns,
    productComponents,
    ...sectionProps
  } = useProductTable(addSchemaAction)

  // 页面进入时， 当前所处的下单模式
  useEffect(() => {
    if (id) {
      setFormLoading(true)
      getOrderBuyerCreateDetail({
        orderId: `${id}`,
      }).then((res) => {
        const { data } = res
        const _orderProductRequests = procurementRenderField(data)
        setProducts(_orderProductRequests)
        const renderFiels = procurmentRenderInit(data)
        setInitFormValue({ ...renderFiels })
        intiMallOption(data?.vendorMemberId, data?.vendorRoleId, data?.shopId)
        initOrderMode()
        setTimeout(() => {
          addSchemaAction.setFieldValue('products', _orderProductRequests)
          if (renderFiels?.timeLine) {
            addSchemaAction.setFieldValue('timeLine', renderFiels.timeLine)
          }
        }, 1000)
        setFormLoading(false)
      })
    }

    if (modelType) {
      shopDataRef.current.orderMode = parseInt(modelType)
    }
  }, [id, modelType])

  const handleSubmit = async (value) => {
    try {
      let fnResult = null
      // 新增订单/编辑订单
      const params = {
        ...value,
        warehouseName: warehouseOptions?.find((item) => item.id === value.warehouseId)?.name,
      }
      delete params.product
      if (formContext.innerFormErrors) {
        throw new Error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error1' }))
      }
      // 校验是否选择支付渠道/支付比例
      if (params.payments?.length) {
        const judgementByPay =
          params.payments?.length &&
          params.payments.map((item) => {
            if (item.payChannel && item.payType) {
              return true
            } else {
              return false
            }
          })
        if (!judgementByPay || judgementByPay.includes(false)) {
          throw new Error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error2' }))
        }
        const totalRatio = params.payments.reduce((a, b) => a + Number(b.payRate || 0), 0)
        const judgementByRatio =
          params.payments?.length &&
          params.payments.map((item) => {
            if (Number(item.payRate) > 0 && Number(item.payRate) <= 100 && totalRatio === 100) {
              return true
            } else {
              return false
            }
          })
        if (!judgementByRatio || judgementByRatio.includes(false)) {
          throw new Error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error3' }))
        }
      }

      // 校验采购数量
      const judgementByCount =
        params.products?.length &&
        params.products.map((item) => {
          if (item.purchaseCount) {
            return true
          } else {
            return false
          }
        })
      if (!judgementByCount || judgementByCount.includes(false)) {
        throw new Error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error4' }))
      }

      // 使用发票即校验发票id
      if (params.hasInvoice && !params.theInvoiceId) {
        throw new Error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error5' }))
      }

      setBtnLoading(true)

      /** 字段转换 */
      // 取供应商默认的发货地址
      const { data: deliveryAddress } = await getLogisticsSelectListMemberShipperAddress({
        memberId: params.vendorMemberId,
        roleId: params.vendorRoleId,
      })
      params.products = params.products.map((item) => {
        const address = deliveryAddress[0]
        return {
          ...item,
          addressId: address?.id || null,
          address: address?.fullAddress || null,
          receiver: address?.shipperName || null,
          phone: address?.phone || null,
        }
      })

      // 发票数据字段转换
      if (params.hasInvoice) {
        params.invoice = {
          invoiceId: params.theInvoiceId.id,
          invoiceKind: params.theInvoiceId.kind,
          invoiceType: params.theInvoiceId.type,
          title: params.theInvoiceId.invoiceTitle,
          taxNo: params.theInvoiceId.taxNo,
          bank: params.theInvoiceId.bankOfDeposit,
          account: params.theInvoiceId.account,
          address: params.theInvoiceId.address,
          phone: params.theInvoiceId.tel,
          defaultInvoice: !!params.theInvoiceId.isDefault,
        }
      }
      // 送货地址数据字段转换拼接 查询省市区冗余
      if (params?.deliveryAddresId) {
        const { data: addressDetail } = await getLogisticsReceiverAddressGet({
          id: params.deliveryAddresId?.id || params.deliveryAddresId,
        })
        params.consignee = {
          // deliverDate: params.deliverDate,
          consigneeId: addressDetail.id,
          consignee: addressDetail.receiverName,
          provinceCode: addressDetail.provinceCode,
          cityCode: addressDetail.cityCode,
          districtCode: addressDetail.districtCode,
          streetCode: addressDetail.streetCode,
          address: addressDetail.address,
          postalCode: addressDetail.postalCode,
          countryCode: addressDetail.areaCode,
          phone: addressDetail.phone,
          telephone: addressDetail.tel,
          defaultConsignee: !!addressDetail.isDefault,
        }
      }

      // 组合配送时间字段
      if (params?.timeLine) {
        params.deliverDate = `${moment(params.deliverDate).format('YYYY-MM-DD')} ${params.timeLine}`
      } else {
        params.deliverDate = params.deliverDate
      }

      // 其他需求
      params.requirement = {
        pack: params.pack,
        remark: params.remark,
      }

      const _params = procurementProcessField(params)

      const shops = addSchemaAction.getFieldState('shopId').props.enum || []
      const shop = shops.filter((item) => item.value === params.shopId)[0]
      params.shopType = shop.type
      params.shopEnvironment = shop.environment
      params.shopName = shop.label

      if (id) {
        fnResult = await postOrderBuyerCreatePurchaseUpdate({ ..._params, orderId: id })
      } else {
        fnResult = await postOrderBuyerCreatePurchase(_params)
      }
      if (fnResult.code === 1000) {
        setTimeout(() => {
          history.push('/orderAbility/purchaseOrder/readyAddCashOrder')
        }, 1000)
      } else {
        setBtnLoading(false)
      }
    } catch (error) {
      setBtnLoading(false)
      console.log(error)
      return error?.message && message.error(error.message)
    }
  }

  // 选择会员弹窗
  const handleOrderMember = () => {
    memberRef.current.setVisible(true)
  }

  const orderMember =
    pageStatus === PageStatus.ADD ? (
      <div className="connectBtn" onClick={handleOrderMember}>
        <LinkOutlined style={{ marginRight: 4 }} />
        {intl.formatMessage({ id: 'purchaseOrder.orderCollect.button1' })}
      </div>
    ) : null
  // @todo 未实现金额合计
  const couponAddButton = (
    <Button onClick={() => productRef.current.setVisible(true)} block type="default" style={{ margin: '24px auto' }}>
      {intl.formatMessage({ id: 'purchaseOrder.orderCollect.button2' })}
    </Button>
  )

  // 新增收货地址
  const addNewAddress = (
    <Button block icon={<PlusOutlined />}>
      {intl.formatMessage({ id: 'purchaseOrder.orderCollect.button3' })}
    </Button>
  )

  const paymentEditColumns = paymentColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record, index) => ({
        record,
        editable: addSchemaAction.getFormState().editable === false ? false : col.editable,
        colIndex: index,
        dataIndex: col.dataIndex,
        title: col.title,
        formItem: col.formItem,
        formItemProps: col.formItemProps,
        forceEdit: col.forceEdit,
        handleSave: paymentSave,
        handleChange: (_record, value = 100) => {
          const payPrice = ((value / 100) * productSumPriceRef.current).toFixed(2)
          const newData = [...addSchemaAction.getFieldValue('payments')]
          const item = newData[index]
          newData.splice(index, 1, {
            ...item,
            payPrice,
          })
          addSchemaAction.setFieldValue('payments', newData)
        },
      }),
    }
  })

  const providerValue = {
    // detailData: initFormValue,
    schemaActions: addSchemaAction,
    formContext,
  }

  // 获取下单仓库
  const fetchWarehouseOptions = async () => {
    const { data } = await getProductSelectGetWarehouse()
    setWarehouseOptions(data)
    return data
  }

  const intiMallOption = async (memberId, roleId, shopId?: number) => {
    const data = await fectchShopListsSource({
      environment: 1,
      isMemberType: true,
      memberId,
      roleId,
    })

    if (data && data.length > 0) {
      if (shopId) {
        const shopItem = data.find((item) => item.id === shopId)
        if (shopItem) {
        }
      }
      addSchemaAction.setFieldState('shopId', (prevState) => {
        prevState.props.enum = data.map((item) => ({
          ...item,
          label: item.name,
          value: item.id,
        }))
      })
    }
  }

  const initOrderMode = async () => {
    const data = await fetchOrderApi.getOrderModeOrderType({
      shopType: 1,
    })
    addSchemaAction.setFieldState('orderMode', (prevstate) => {
      prevstate.props.enum = data.map((item) => ({
        ...item,
        label: item.orderModeName,
        value: item.orderMode,
      }))
    })
  }

  return (
    <div>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={
            id ? intl.formatMessage({ id: 'purchaseOrder.edit' }) : intl.formatMessage({ id: 'purchaseOrder.add' })
          }
          schema={initFormSchema}
          extraRight={[
            // <AuthButton type="custom" code="save">
            <Button
              key="1"
              onClick={() => addSchemaAction.submit()}
              loading={btnLoading}
              type="primary"
              icon={<SaveOutlined />}
            >
              {intl.formatMessage({ id: 'purchaseOrder.save' })}
            </Button>,
            // </AuthButton>,
          ]}
        />
        <FormDetailWrapper>
          <NiceForm
            loading={formLoading}
            previewPlaceholder=" "
            value={initFormValue}
            actions={addSchemaAction}
            schema={initFormSchema}
            onSubmit={handleSubmit}
            components={{
              SelectAddress,
              TheInvoiceList,
              SelectContract,
            }}
            onValuesChange={(changedValues, values) => {
              console.log(changedValues, 'changedValues')
            }}
            effects={($, ctx) => {
              useAsyncSelect('warehouseId', fetchWarehouseOptions, ['name', 'id'])

              $('onFormMount').subscribe(() => {
                if (id) {
                  ctx.setFieldState('shopId', (state) => {
                    state.editable = false
                  })
                }
              })
              useOrderFormInitEffect(ctx)
              useEditHideField()
              // 商品信息的改动 驱动支付信息变化
              useProductTableChangeForPay(ctx, update)

              // 供应商变动查询商城列表
              $('onFieldValueChange', 'vendorMemberId').subscribe(async (state) => {
                const role = ctx.getFieldValue('vendorRoleId')
                intiMallOption(state.value, role)
                // const data = await fectchShopListsSource({
                //   environment: 1,
                //   isMemberType: true,
                //   memberId: state.value,
                //   roleId: role,
                // })
                // ctx.setFieldState('shopId', (prevState) => {
                //   prevState.props.enum = data.map((item) => ({
                //     ...item,
                //     label: item.name,
                //     value: item.id,
                //   }))
                // })
              })

              // 监听商品总价的变更, 支付比例计算
              $('sumPrice').subscribe((payload) => {
                const payment = addSchemaAction.getFieldValue('payments')
                if (payment?.length) {
                  addSchemaAction.setFieldValue(
                    'payments',
                    payment.map((item) => ({
                      ...item,
                      payPrice: ((payload * Number(item.payRate)) / 100).toFixed(2),
                    })),
                  )
                }
                productSumPriceRef.current = payload
              })

              // 新增下并且不是采购跳转 切换商城 清空受影响的字段
              $('onFieldValueChange', 'shopId').subscribe(async (state) => {
                // 初始化 配送时间段处理
                useOrderDeliverTimeEffect(ctx, state.value)
                if (!id) {
                  const data = await fetchOrderApi.getOrderModeOrderType({
                    shopType: 1,
                  })
                  ctx.setFieldState('orderMode', (prevstate) => {
                    prevstate.props.enum = data.map((item) => ({
                      ...item,
                      label: item.orderModeName,
                      value: item.orderMode,
                    }))
                  })
                  ctx.setFieldValue('orderMode', data.orderMode)
                  ctx.setFieldValue('orderModeName', data.orderModeName)
                  ctx.setFieldValue('type', data.orderTypeName)
                  ctx.reset({
                    validate: false,
                    selector: '*(products,payments)',
                  })
                }
              })

              $('onFieldValueChange', 'orderMode').subscribe((state) => {
                const { value } = state
                const options = state.props.enum
                const mode = options.find((i) => i.orderMode === value)
                if (mode) {
                  ctx.setFieldValue('type', mode.orderTypeName)
                }
              })

              // $('onFieldValueChange', 'warehouseId').subscribe(state => {
              //   // 设置仓库名称
              //   ctx.setFieldValue('warehouseName', warehouseOptions?.find((item) => item.id ===  state.value)?.name)
              // })

              // 注入表单完成进度
              formContext.useAttachmentChangeForContext(ctx)
              // 注入锚点标题数量同步
              formContext.useAnchorCountChangeForContext(ctx, ['products'])
            }}
            expressionScope={{
              orderMember,
              paymentColumns: paymentEditColumns,
              paymentComponents,
              productColumns,
              productAddButton,
              productComponents,
              couponAddButton,
              addNewAddress,
              CirculationRecord: <CirculationRecord />,
              help,
            }}
          />
        </FormDetailWrapper>
      </FormDetailContext.Provider>
      <ProductModalTable
        selectedIds={selectedIds}
        searchSelectMaps={searchSelectMaps}
        tableRef={productTableRef}
        currentRef={productRef}
        schemaAction={addSchemaAction}
        sectionProps={sectionProps}
      />
      <MemberModalTable currentRef={memberRef} productRef={productRef} schemaAction={addSchemaAction} />
    </div>
  )
}

AgentOrderDetail.defaultProps = {}

export default AgentOrderDetail
