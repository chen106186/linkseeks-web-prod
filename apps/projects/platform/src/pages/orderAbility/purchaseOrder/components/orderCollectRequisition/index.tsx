import React, { useRef, useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { Button, Row, Col, message } from 'antd'
import { createFormActions, registerVirtualBox, useFormSpy } from '@apps/formily'
import { SaveOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import { orderAddSchema } from './schema'
import { useModelTypeChange, useEditHideField, useOrderFormInitEffect, useProductTableChangeForPay } from './effects'
import { orderTypeLabelMap, procurementProcessField, procurementRenderField, procurmentRenderInit } from './constant'
import CirculationRecord from '../circulationRecord'
import SelectAddress from '../../components/AddressSelectList'
import TheInvoiceList from './components/theInvoiceList'
import styled from 'styled-components'
import { useUpdate } from '@linkseeks/hooks'
import { help } from '@/pages/transaction/common'
import { useMaterialTable } from './model/useMaterialTable'
import ContractModalTable from './components/contractModalTable'
import MaterialModalTable from './components/materialModalTable'
import MemberModalTable from './components/memberModalTable'
import FormDetailHeader from '@/components/FormDetailHeader'
import { FormDetailContext } from '@/formSchema/context'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import { formatTimeString } from '@/utils'
import {
  getOrderBuyerCreateDetail,
  postOrderBuyerChangeRequisition,
  postOrderBuyerCreateRequisition,
  postOrderBuyerUpdateRequisition,
} from '@apps/apis'
import { getPurchaseRequisitionTransferPurchaseDetail } from '@apps/apis'
import { getLogisticsReceiverAddressGet, getLogisticsSelectListMemberShipperAddress } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import AddChangeCard from '@/pages/transaction/components/addChangeCard'
import { getPaymentInfoFn, schemasFn } from '../../componentSchema'
import useVersion from '@/hooks/useVersion'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getProductSelectGetWarehouse } from '@apps/apis'

export interface AddRequisitionOrderProps {}

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
  const sum = data.reduce((prev, next) => (prev * 100 + (next.amount || 0) * 100) / 100, 0)
  const [freePrice] = useState<number>(0)

  useEffect(() => {
    if (sum + freePrice) {
      form.notify('sumPrice', sum + freePrice)
    }
  }, [sum, freePrice])

  return (
    <RowStyle>
      <Col span={2}>
        <div>{intl.formatMessage({ id: 'purchaseOrder.orderCollect.title1' })}</div>
        <div>{`${sum.toFixed(2)}`}</div>
      </Col>
    </RowStyle>
  )
})

/** 请购单采购订单下单 仅有物料 */
const AddRequisitionOrder: React.FC<AddRequisitionOrderProps> = () => {
  const { pageStatus, id, modelType, requisitionId = null } = usePageStatus()
  const { state } = useLocation()
  const _state: any = state
  const intl = useIntl()
  const shopDataRef = useRef<any>({})
  const memberRef = useRef<any>({})
  const requisitionOrderRef = useRef<any>({}) // 合同下单选采购合同
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)

  const [formContextBo, setFormContextBo] = useState<any>(null)
  const { TabList, showSubmit, versionContext, handleChangeVersion } = useVersion({
    id,
    formContext: { data: formContextBo },
  })
  const update = useUpdate()

  const [initFormSchema] = useState<any>(() => ({ ...orderAddSchema }))
  const [initFormValue, setInitFormValue] = useState<any>(() => {
    let resultState = {}
    if (modelType) {
      resultState = {
        orderMode: parseInt(modelType),
      }
    }
    return resultState
  })
  const { formContext } = useFormDetail()
  const [warehouseOptions, setWarehouseOptions] = useState<any>([])

  const { getListPay } = getPaymentInfoFn()
  const { templateDescription, beforeUpload, showBtn, getList, sub } = schemasFn(addSchemaAction, intl)

  // 订单物料
  const { materialAddButton, materialRef, materialColumns, materialComponents, ...surplusProps } =
    useMaterialTable(addSchemaAction)

  useEffect(() => {
    if (id) {
      setFormLoading(true)
      getOrderBuyerCreateDetail({ orderId: id + '' }).then((res) => {
        const { data } = res
        const _orderProductRequests = procurementRenderField(data)
        setInitFormValue(() => procurmentRenderInit(data))
        setTimeout(() => {
          addSchemaAction.setFieldValue('products', _orderProductRequests)
          addSchemaAction.setFieldValue('currencyType', data.currencyType)
          addSchemaAction.setFieldValue('paymentType', data.paymentType)
        }, 1000)
        setFormContextBo(data)
        setFormLoading(false)
      })
    }
    if (modelType) {
      shopDataRef.current.orderMode = parseInt(modelType)
    }
    // requisitionId 说明是请购单跳转
    if (requisitionId) {
      getJumpQuoteProducts()
    }
    //需求池转入
    if (_state?.demandPoolData) {
      addSchemaAction.setFieldValue('requisitionId', _state?.demandPoolData?.requisitionId)
      addSchemaAction.setFieldValue('requisitionNo', _state?.demandPoolData?.requisitionNo)
      addSchemaAction.setFieldValue('vendorMemberName', _state?.demandPoolData?.vendorMemberName)
      addSchemaAction.setFieldValue('vendorMemberId', _state?.demandPoolData?.vendorMemberId)
      addSchemaAction.setFieldValue('vendorRoleId', _state?.demandPoolData?.vendorRoleId)
      addSchemaAction.setFieldValue('deliveryAddresId', _state?.demandPoolData?.deliveryAddressId)
    }
    if (_state?.demandPoolRows) {
      const newData = _state?.demandPoolRows.map((v: any) => {
        // 默认含税
        v.tax = true
        // @ 配送方式 默认物流
        v.logistics = v.deliveryMethod
        // 冗余供应会员 用于查询自提地址
        v.memberId = _state?.demandPoolData?.vendorMemberId
        v.memberName = _state?.demandPoolData?.vendorMemberName
        v.memberRoleId = _state?.demandPoolData?.vendorRoleId
        return v
      })
      addSchemaAction.setFieldValue('products', newData)
    }
  }, [])

  const getJumpQuoteProducts = async () => {
    // 查询请购单详情
    const { code, data: requisitionData } = await getPurchaseRequisitionTransferPurchaseDetail({
      id: requisitionId,
    })
    if (code === 1000) {
      const {
        requisitionId,
        requisitionNo,
        digest,
        advanceDeliveryDate,
        vendorMemberName,
        vendorMemberId,
        vendorRoleId,
        product,
      }: any = requisitionData
      addSchemaAction.setFieldValue('requisitionId', requisitionId)
      addSchemaAction.setFieldValue('requisitionNo', requisitionNo)
      addSchemaAction.setFieldValue('deliverDate', formatTimeString(advanceDeliveryDate, 'YYYY-MM-DD HH:mm'))
      addSchemaAction.setFieldValue('digest', digest)
      addSchemaAction.setFieldValue('vendorMemberName', vendorMemberName)
      addSchemaAction.setFieldValue('vendorMemberId', vendorMemberId)
      addSchemaAction.setFieldValue('vendorRoleId', vendorRoleId)
      const newData = product.products.map((v: any) => {
        // 默认含税
        v.tax = true
        // @ 配送方式 默认物流
        v.logistics = 1
        // 冗余供应会员 用于查询自提地址
        v.memberId = vendorMemberId
        v.memberName = vendorMemberName
        v.memberRoleId = vendorRoleId
        return v
      })
      addSchemaAction.setFieldValue('products', newData)
    }
  }

  const handleSubmit = async (value) => {
    try {
      let fnResult = null
      // 新增订单/编辑订单
      const params = {
        ...value,
        warehouseName: warehouseOptions?.find((item) => item.id === value.warehouseId)?.name,
      }
      console.log(value)
      if (formContext.innerFormErrors) {
        message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error7' }))
        return
        // throw new Error(intl.formatMessage({id: 'purchaseOrder.orderCollect.error7'}))
      }
      // 校验采购数量 单价和税率
      const judgementByPrice = []
      const judgementByCount =
        params.products?.length &&
        params.products.map((item) => {
          if (item.price) {
            judgementByPrice.push(true)
          } else {
            judgementByPrice.push(false)
          }
          if (item.quantity) {
            return true
          } else {
            return false
          }
        })
      if (!judgementByCount || judgementByCount.includes(false)) {
        message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error4' }))
        return
        // throw new Error(intl.formatMessage({id: 'purchaseOrder.orderCollect.error4'}))
      }
      if (judgementByPrice.includes(false)) {
        message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error8' }))
        return
        // throw new Error(intl.formatMessage({id: 'purchaseOrder.orderCollect.error8'}))
      }
      // 使用发票即校验发票id
      if (params.hasInvoice && !params.theInvoiceId) {
        message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error5' }))
        return
        // throw new Error(intl.formatMessage({id: 'purchaseOrder.orderCollect.error5'}))
      }
      sub(params)
      setBtnLoading(true)

      // 请购单下单 取供应商默认的发货地址
      const { data: deliveryAddress } = await getLogisticsSelectListMemberShipperAddress({
        memberId: params.vendorMemberId,
        roleId: params.vendorRoleId,
      })
      params.products = params.products.map((item) => {
        const address = deliveryAddress[0]
        return {
          ...item,
          deliveryType: item.logistics,
          addressId: address?.id || null,
          address: address?.fullAddress || null,
          receiver: address?.shipperName || null,
          phone: address?.phone || null,
          expectedDelivery: item?.expectedDelivery ? formatTimeString(item?.expectedDelivery, 'YYYY-MM-DD') : null,
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
          defaultInvoice: params.theInvoiceId.isDefault,
        }
      }

      // 交付地址数据字段转换拼接 查询省市区冗余
      const { data: addressDetail, code } = await getLogisticsReceiverAddressGet(
        {
          id: params.deliveryAddresId?.id || params.deliveryAddresId,
        },
        { ctlType: 'none' },
      )
      if (code === 1000) {
        params.consignee = {
          deliverDate: params.deliverDate,
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
          defaultConsignee: addressDetail.isDefault,
        }
      } else {
        message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error9' }))
        return
        // throw new Error(intl.formatMessage({id: 'purchaseOrder.orderCollect.error9'}))
      }

      // 其他需求
      params.requirement = {
        pack: params.pack,
        remark: params.remark,
      }

      const _params = procurementProcessField(params)
      console.log(_params)
      if (pageStatus === PageStatus.VARIATION) {
        const paramChange = {
          vendorMemberId: params?.vendorMemberId,
          vendorRoleId: params?.vendorRoleId,
          vendorMemberName: params?.vendorMemberName,
          deliverDate: params?.deliverDate,
          requisitionId: params?.requisitionId,
          requisitionNo: params?.requisitionNo,
          digest: params?.digest,
          consignee: params?.consignee,
          hasInvoice: params?.hasInvoice,
          invoice: params?.invoice,
          products: params?.products,
          currencyType: params?.currencyType,
          paymentType: params?.paymentType,
          requirement: params?.requirement,
          contractText: params?.contractText,
        }

        fnResult = await postOrderBuyerChangeRequisition({ ...paramChange, orderId: +id })
      } else {
        if (id) {
          fnResult = await postOrderBuyerUpdateRequisition({ ..._params, orderId: id })
        } else {
          fnResult = await postOrderBuyerCreateRequisition(_params)
        }
      }
      if (fnResult.code === 1000) {
        setTimeout(() => {
          history.push('/orderAbility/purchaseOrder/readyAddRequisitionOrder')
        }, 1000)
      } else {
        setBtnLoading(false)
      }
    } catch (error) {
      setBtnLoading(false)
      // error?.message && message.error(error.message)
      console.log(error)
    }
  }

  // 选择请购单
  const handleOrderRequisition = () => {
    requisitionOrderRef.current.setVisible(true)
  }

  // 选择供应商
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

  const orderRequisition = pageStatus === PageStatus.ADD && (
    <div className="connectBtn" onClick={handleOrderRequisition}>
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

  // 获取下单仓库
  const fetchWarehouseOptions = async () => {
    const { data } = await getProductSelectGetWarehouse()
    setWarehouseOptions(data)
    return data
  }

  const providerValue = {
    // detailData: initFormValue,
    schemaActions: addSchemaAction,
    formContext,
  }
  const getPopupPaymentContainer = () => document.getElementById('paymentInfo')
  return (
    <div>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={
            id ? intl.formatMessage({ id: 'purchaseOrder.edit' }) : intl.formatMessage({ id: 'purchaseOrder.add' })
          }
          schema={initFormSchema}
          tabList={versionContext ? TabList : []}
          extraRight={
            <ChangeButtonCard
              formContext={{ data: formContextBo }}
              versionChange={handleChangeVersion}
              authButtonCard={
                showSubmit && (
                  // <AuthButton type="custom" code="save">
                  <Button
                    key="1"
                    onClick={() => addSchemaAction.submit()}
                    loading={btnLoading}
                    type={pageStatus === PageStatus.VARIATION ? 'default' : 'primary'}
                    icon={<SaveOutlined />}
                  >
                    {pageStatus === PageStatus.VARIATION ? '变更' : intl.formatMessage({ id: 'purchaseOrder.save' })}
                  </Button>
                  // </AuthButton>
                )
              }
            />
          }
        />
        <FormDetailWrapper>
          {versionContext ? (
            <AddChangeCard formContext={{ data: formContextBo }} versionContext={versionContext} />
          ) : (
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
              }}
              effects={($, ctx) => {
                useAsyncSelect('warehouseId', fetchWarehouseOptions, ['name', 'id'])

                $('onFormMount').subscribe(() => {
                  if (id || modelType) {
                    ctx.setFieldState('orderMode', (state) => {
                      state.editable = false
                    })
                  }
                  ctx.setFieldValue('type', intl.formatMessage({ id: 'purchaseOrder.orderCollect.requisition.type' }))
                  showBtn($)
                })
                getListPay()
                getList()
                useOrderFormInitEffect(ctx)
                useModelTypeChange((state) => {
                  const { value } = state
                  // 选择某种类型时， 需显示对应的订单类型
                  ctx.setFieldValue('type', orderTypeLabelMap[value])
                  // addSchemaAction.setFieldState('products', (productState) => {
                  //   productState.props['x-component-props'] = {
                  //     ...productState.props['x-component-props'],
                  //     prefix:
                  //       editable &&
                  //       (pageStatus === PageStatus.ADD || pageStatus === PageStatus.VARIATION)
                  //         ? materialAddButton
                  //         : '',
                  //   }
                  // })
                })
                useEditHideField()

                // 商品信息的改动 驱动支付信息变化
                useProductTableChangeForPay(ctx, update)

                // 注入表单完成进度
                formContext.useAttachmentChangeForContext(ctx)
                // 注入锚点标题数量同步
                formContext.useAnchorCountChangeForContext(ctx, ['products'])
              }}
              expressionScope={{
                orderMember,
                orderRequisition, // 选择请购单
                materialColumns,
                materialAddButton,
                materialComponents,
                addNewAddress,
                CirculationRecord: <CirculationRecord />,
                help,
                templateDescription,
                beforeUpload,
                getPopupPaymentContainer,
              }}
            />
          )}
        </FormDetailWrapper>
      </FormDetailContext.Provider>
      {/* 选择供应会员 */}
      <MemberModalTable currentRef={memberRef} productRef={materialRef} schemaAction={addSchemaAction} />
      {/* 选择请购单 */}
      <ContractModalTable currentRef={requisitionOrderRef} schemaAction={addSchemaAction} width={1200} />
      {/* 选择采购物料 */}
      <MaterialModalTable
        currentRef={materialRef}
        schemaAction={addSchemaAction}
        sectionProps={surplusProps}
        canRepeat
      />
    </div>
  )
}

AddRequisitionOrder.defaultProps = {}

export default AddRequisitionOrder
