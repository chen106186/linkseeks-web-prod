import React, { useRef, useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { Button, Row, Col, message } from 'antd'
import { createFormActions, FormEffectHooks, registerVirtualBox, useFormSpy } from '@apps/formily'
import { SaveOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import { orderAddSchema } from './schema'
import type { JumpFormValueType } from './effects'
import {
  useModelTypeChange,
  useEditHideField,
  useProductTableChangeForPay,
  useOrderDeliverTimeEffect,
  useProductAddress,
  useInvoiceList,
} from './effects'
import {
  filterProductDataById,
  orderCombination,
  orderTypeLabelMap,
  procurementProcessField,
  procurementRenderField,
  procurmentRenderInit,
} from './constant'
import { OrderModalType } from '@/constants/order'
import InquiryModalTable from './components/inquiryModalTable'
import CirculationRecord from '../circulationRecord'
import SelectAddress from '../AddressSelectList'
import SelectContract from './components/selectContract'
import TheInvoiceList from './components/theInvoiceList'
import { usePaymentInfo } from './model/usePaymentInfo'
import { useProductTable } from './model/useProductTable'
import styled from 'styled-components'
import { useUpdate } from '@linkseeks/hooks'
import { help } from '@/pages/transaction/common'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { fetchOrderApi } from './apis'
import { fectchShopListsSource } from '@/utils/type'
import { FormDetailContext } from '@/formSchema/context'
import FormDetailHeader from '@/components/FormDetailHeader'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import {
  getOrderBuyerCreateDetail,
  getOrderBuyerCreatePageItems,
  postOrderBuyerCreateB2b,
  postOrderBuyerCreateB2bUpdate,
} from '@apps/apis'
import {
  getLogisticsReceiverAddressGet,
  getLogisticsSelectListMemberShipperAddress,
  postLogisticsFreightTemplateCalFreightPrice,
} from '@apps/apis'
import { getTradeNotarizeEnquiryProductQuotationDetails } from '@apps/apis'
import { getProductSelectGetWarehouse } from '@apps/apis'
import { getWebIntl } from '@apps/locales'

export interface PurchaseOrderDetailProps {}

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
const translate = getWebIntl()
// 获取下单模式
const fetchOrderMode = async () => {
  const { data } = await getOrderBuyerCreatePageItems()
  const { orderModes } = data
  return orderModes
}

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
  }, [sum, freePrice])

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
        <div>{`${translate('web.common.currencySymbol')}${sum.toFixed(2)}`}</div>
      </Col>
      <Col span={2}>
        <div>{intl.formatMessage({ id: 'purchaseOrder.orderCollect.title2' })}</div>
        <div>{`${translate('web.common.currencySymbol')}${freePrice.toFixed(2)}`}</div>
      </Col>
      <Col span={2}>
        <div>{intl.formatMessage({ id: 'purchaseOrder.orderCollect.title3' })}</div>
        <div>{`${translate('web.common.currencySymbol')}${(sum + freePrice).toFixed(2)}`}</div>
      </Col>
    </RowStyle>
  )
})

/** 采购订单B2B下单 没有合同没有物料 */
const PurchaseOrderDetail: React.FC<PurchaseOrderDetailProps> = () => {
  const intl = useIntl()
  const shopDataRef = useRef<any>({})
  const memberRef = useRef<any>({})
  const inquiryRef = useRef<any>({})
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const update = useUpdate()
  const productSumPriceRef = useRef<any>(0)
  const { pageStatus, id, modelType, quotationId = null } = usePageStatus()
  const [initFormValue, setInitFormValue] = useState<any>(() => {
    let resultState = {}
    if (modelType) {
      resultState = {
        orderMode: parseInt(modelType),
      }
    }
    return resultState
  })
  const jumpFormValueRef = useRef<JumpFormValueType | null>()
  const [warehouseOptions, setWarehouseOptions] = useState<any>([])

  const { formContext } = useFormDetail()

  const [products, setProducts] = useState<any>([])
  const [paymentColumns, paymentComponents, paymentSave] = usePaymentInfo(
    addSchemaAction,
    pageStatus === PageStatus.ADD ? addSchemaAction.getFieldValue('products') : products,
  )
  // 订单商品
  const { productColumns, productComponents } = useProductTable(addSchemaAction)

  const getJumpQuoteProducts = async () => {
    // 查询询价单详情
    const { code, data: quotationData } = await getTradeNotarizeEnquiryProductQuotationDetails({
      id: quotationId,
    })
    if (code === 1000) {
      const { quotationNo, details, shopId, supplyMembersName, supplyMembersId, supplyMembersRoleId, inquiryListId } =
        quotationData
      jumpFormValueRef.current = {
        shopId,
        vendorMemberId: supplyMembersId,
        vendorRoleId: supplyMembersRoleId,
      }
      addSchemaAction.setFieldValue('quoteId', quotationId)
      addSchemaAction.setFieldValue('quoteNo', quotationNo)
      addSchemaAction.setFieldValue('shopId', shopId)
      addSchemaAction.setFieldValue('digest', details)
      addSchemaAction.setFieldValue('vendorMemberName', supplyMembersName)
      addSchemaAction.setFieldValue('vendorMemberId', supplyMembersId)
      addSchemaAction.setFieldValue('vendorRoleId', supplyMembersRoleId)
      // 查询商品
      const data = await fetchOrderApi.getProductListByQuotationOrderId({
        id: inquiryListId,
      })
      const newData = data.map((v: any) => {
        v.orderMode = modelType
        v.shopId = shopId
        // b2b询价下单 定价类型必定为2
        v.priceType = 2
        return v
      })
      addSchemaAction.setFieldValue('products', await filterProductDataById([], newData))
    }
  }

  // 页面进入时， 当前所处的下单模式
  useEffect(() => {
    if (id) {
      setFormLoading(true)
      getOrderBuyerCreateDetail({
        orderId: id as string,
      }).then((res) => {
        const { data } = res
        jumpFormValueRef.current = {
          shopId: data.shopId,
          vendorMemberId: data.vendorMemberId,
          vendorRoleId: data.vendorRoleId,
        }
        const _orderProductRequests = procurementRenderField(data)
        setProducts(_orderProductRequests)
        setInitFormValue(() => procurmentRenderInit(data))
        setTimeout(() => {
          addSchemaAction.setFieldValue('products', _orderProductRequests)
        }, 1000)
        setFormLoading(false)
      })
    }

    if (modelType) {
      shopDataRef.current.orderMode = parseInt(modelType)
    }

    // 参数存在quotationId 说明是报价跳转
    if (quotationId) {
      getJumpQuoteProducts()
    }
  }, [])

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
      // 校验配送区域范围
      const { commodityAreaList, isAllArea } = value.products[0]
      const { provinceCode, cityCode, districtCode } = value.deliveryAddresId
      if (!isAllArea && commodityAreaList?.length > 0) {
        const ressult = commodityAreaList.some((item) => {
          if (item.provinceCode === provinceCode && item.isAllCity) {
            // 省内配送
            return true
          } else if (
            item.provinceCode === provinceCode &&
            !item.isAllCity &&
            item.cityCode === cityCode &&
            item.isAllRegion
          ) {
            // 省内市际配送
            return true
          }
          if (
            item.provinceCode === provinceCode &&
            !item.isAllCity &&
            item.cityCode === cityCode &&
            !item.isAllRegion &&
            item.regionCode === districtCode
          ) {
            // 省内市际区域配送
            return true
          } else {
            return false
          }
        })
        if (!ressult) {
          throw new Error('当前订单不在配送范围内')
        }
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
          addressId: address.id || null,
          address: address.fullAddress || null,
          receiver: address.shipperName || null,
          phone: address.phone || null,
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

      // 交付地址数据字段转换拼接 查询省市区冗余
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
        params.deliverDate = `${params.deliverDate} ${params.timeLine}`
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
        fnResult = await postOrderBuyerCreateB2bUpdate({ ..._params, orderId: id })
      } else {
        fnResult = await postOrderBuyerCreateB2b(_params)
      }
      if (fnResult.code === 1000) {
        setTimeout(() => {
          history.push('/orderAbility/purchaseOrder/readyAddB2bOrder')
        }, 1000)
      } else {
        setBtnLoading(false)
      }
    } catch (error) {
      setBtnLoading(false)
      message.error(error.message)
      console.log(error)
    }
  }

  // 唤起报价单弹窗
  const handleOrderNo = async () => {
    // if(!addSchemaAction.getFieldValue('shopId')) {
    //   return message.error('请先选择适应商城')
    // }
    inquiryRef.current.setVisible(true)
  }

  // 选择会员弹窗
  const handleOrderMember = () => {
    if (!addSchemaAction.getFieldValue('shopId')) {
      return message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error6' }))
    }
    memberRef.current.setVisible(true)
  }

  const orderNoPrice = pageStatus === PageStatus.ADD && (
    <div className="connectBtn" onClick={handleOrderNo}>
      <LinkOutlined style={{ marginRight: 4 }} />
      {intl.formatMessage({ id: 'purchaseOrder.orderCollect.button1' })}
    </div>
  )
  const orderMember = pageStatus !== PageStatus.PREVIEW && (
    <div className="connectBtn" onClick={handleOrderMember}>
      <LinkOutlined style={{ marginRight: 4 }} />
      {intl.formatMessage({ id: 'purchaseOrder.orderCollect.button1' })}
    </div>
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
        handleChange: (_, value = 100) => {
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

  return (
    <div>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={
            id ? intl.formatMessage({ id: 'purchaseOrder.edit' }) : intl.formatMessage({ id: 'purchaseOrder.add' })
          }
          schema={orderAddSchema}
          extraRight={[
            <Button
              key="1"
              onClick={() => addSchemaAction.submit()}
              loading={btnLoading}
              type="primary"
              icon={<SaveOutlined />}
            >
              {intl.formatMessage({ id: 'purchaseOrder.save' })}
            </Button>,
          ]}
        />
        <FormDetailWrapper>
          <NiceForm
            loading={formLoading}
            previewPlaceholder=" "
            value={initFormValue}
            actions={addSchemaAction}
            schema={orderAddSchema}
            onSubmit={handleSubmit}
            components={{
              SelectAddress,
              TheInvoiceList,
              SelectContract,
            }}
            effects={($, ctx) => {
              useAsyncSelect('orderMode', fetchOrderMode, ['text', 'id'])
              useAsyncSelect('warehouseId', fetchWarehouseOptions, ['name', 'id'])
              $('onFormMount').subscribe(async () => {
                // const data = await fectchShopListsSource()
                // if(data && data.length) {
                //   ctx.setFieldState('shopId', state => {
                //     state.props.enum = data.map(item => ({
                //       label: item.name,
                //       value: item.id,
                //       type: item.type,
                //       environment: item.environment,
                //     }))
                //   })
                // }
                if (id || modelType) {
                  ctx.setFieldState('orderMode', (state) => {
                    state.editable = false
                  })
                }
                if (id) {
                  ctx.setFieldState('shopId', (state) => {
                    state.editable = false
                  })
                }
              })
              // 供应商变动查询商城列表
              $('onFieldValueChange', 'vendorMemberId').subscribe(async (state) => {
                const role = ctx.getFieldValue('vendorRoleId') || jumpFormValueRef.current.vendorRoleId
                const data = await fectchShopListsSource({
                  // environment: 1,
                  isMemberType: true,
                  memberId: state.value,
                  roleId: role,
                })
                ctx.setFieldState('shopId', (prevState) => {
                  prevState.props.enum = data.map((item) => ({
                    ...item,
                    label: item.name,
                    value: item.id,
                  }))
                })
              })
              $('onFieldInputChange', 'orderMode').subscribe((state) => {
                const { value } = state
                // 处理商城类型选项 报价单文案 支付信息栏隐藏
                if (value) {
                  const enumList = ctx.getFieldState('shopId').props.enum
                  ctx.setFieldState('shopId', (shopIdState) => {
                    shopIdState.visible = true
                    shopIdState.props.enum = enumList.filter((item) => item.type === 1 && item.environment === 1)
                  })
                }
              })
              // useOrderFormInitEffect(ctx)
              FormEffectHooks.onFieldValueChange$('hasInvoice').subscribe((state) => {
                if (state.value) {
                  useInvoiceList(ctx)
                }
              })
              useModelTypeChange((state) => {
                const { value } = state
                // 选择某种类型时， 需显示对应的订单类型
                ctx.setFieldValue('type', orderTypeLabelMap[value])
              })
              useEditHideField()
              // 商品信息的改动 驱动支付信息变化
              useProductTableChangeForPay(ctx, update)

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

              $('onFieldValueChange', 'quoteNo').subscribe((state) => {
                const orderModeType = ctx.getFieldValue('orderMode')
                useProductAddress(ctx)
                if (state.value && orderModeType === OrderModalType.CONSOLIDATED_ORDER) {
                  addSchemaAction.setFieldState('products', (productState) => {
                    productState.props['x-component-props'] = {
                      ...productState.props['x-component-props'],
                      prefix: '',
                    }
                  })
                }
              })

              $('onFieldValueChange', 'shopId').subscribe((state) => {
                // 初始化 配送时间段处理
                useOrderDeliverTimeEffect(ctx, state.value, jumpFormValueRef.current)
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
              orderNoPrice,
              orderMember,
              paymentColumns: paymentEditColumns,
              paymentComponents,
              productColumns,
              productComponents,
              orderCombination,
              addNewAddress,
              CirculationRecord: <CirculationRecord />,
              help,
            }}
          />
        </FormDetailWrapper>
      </FormDetailContext.Provider>
      {/* 询价报价单弹窗 */}
      <InquiryModalTable currentRef={inquiryRef} schemaAction={addSchemaAction} />
    </div>
  )
}

PurchaseOrderDetail.defaultProps = {}

export default PurchaseOrderDetail
