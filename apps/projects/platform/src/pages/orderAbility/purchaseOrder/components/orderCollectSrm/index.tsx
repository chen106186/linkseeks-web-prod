/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-param-reassign */
import { useRef, useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { Button, Row, Col, message } from 'antd'
import { createFormActions, registerVirtualBox, useFormSpy } from '@apps/formily'
import { SaveOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import { mergeAllSchemas } from './schema'
import {
  useModelTypeChange,
  useContractChange,
  useEditHideField,
  useOrderFormInitEffect,
  useProductTableChangeForPay,
} from './effects'
import { orderCombination, orderTypeLabelMap, procurementRenderField, procurmentRenderInit } from './constant'
import CirculationRecord from '../circulationRecord'
import SelectAddress from '../../components/AddressSelectList'
import TheInvoiceList from './components/theInvoiceList'
import styled from 'styled-components'
import { useUpdate } from '@linkseeks/hooks'
import { help } from '@/pages/transaction/common'
import styles from './index.less'
import { useMaterialTable } from './model/useMaterialTable'
import { convertOrderMaterialData, convertOrderMaterialDataSource } from './utils'
import ContractModalTable from './components/contractModalTable'
import MaterialModalTable from './components/materialModalTable'
import type { RequisitionModalTableRef } from './components/requisitionModalTable'
import RequisitionModalTable from './components/requisitionModalTable'
import type { OrderMaterialsConfirmValue, OrderMaterialsDrawerRef } from './components/orderMaterialsDrawer'
import OrderMaterialsDrawer from './components/orderMaterialsDrawer'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { OrderModalType } from '@/constants/order'
import { FormDetailContext } from '@/formSchema/context'
import FormDetailHeader from '@/components/FormDetailHeader'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import {
  getOrderBuyerCreateDetail,
  getOrderBuyerCreatePageItems,
  postOrderBuyerCreateSrm,
  postOrderBuyerCreateSrmUpdate,
  postOrderBuyerChangeSrm,
} from '@apps/apis'
import { getLogisticsReceiverAddressGet, getLogisticsSelectListMemberShipperAddress } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import type { PostOrderMaterialData } from './interface'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import AddChangeCard from '@/pages/transaction/components/addChangeCard'
import { getPaymentInfoFn, schemasFn } from '../../componentSchema'
import useVersion from '@/hooks/useVersion'
import { formatTimeString } from '@/utils'
// import { postContractFeignGetTheLastContract } from '@apps/apis'

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

// 获取下单模式
const fetchOrderMode = async () => {
  const { data } = await getOrderBuyerCreatePageItems()
  const { orderModes } = data
  return orderModes.filter((item) => item.id !== OrderModalType.INQUIRY_QUOTATION_ORDER)
}

// 总计金额联动框
export const MoneyTotalBox = registerVirtualBox('moneyTotalBox', () => {
  const { form } = useFormSpy({ selector: [['onFieldValueChange', 'products']], reducer: (v) => v })
  const data = form.getFieldValue('products')
  const sum = data.reduce((prev, next) => (prev * 100 + (next.amount || 0) * 100) / 100, 0)
  const [freePrice] = useState<number>(0)
  const intl = useIntl()

  useEffect(() => {
    if (sum + freePrice) {
      form.notify('sumPrice', sum + freePrice)
    }
  }, [sum, freePrice, form])

  return (
    <RowStyle>
      <Col span={2}>
        <div>{intl.formatMessage({ id: 'purchaseOrder.orderCollect.title1' })}</div>
        <div>{`${sum.toFixed(2)}`}</div>
      </Col>
      <Col span={2}>
        <div>{intl.formatMessage({ id: 'purchaseOrder.orderCollect.title3' })}</div>
        <div>{`${(sum + freePrice).toFixed(2)}`}</div>
      </Col>
    </RowStyle>
  )
})

/** 采购订单SRM下单 有选择采购合同和显示物料 */
const PurchaseOrderDetail = () => {
  const shopDataRef = useRef<any>({})
  const intl = useIntl()
  const contractOrderRef = useRef<any>({}) // 合同下单选采购合同
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const update = useUpdate()
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
  const [formContextBo, setFormContextBo] = useState<any>(null)
  const [visibleOrderMaterialsDrawer, setVisibleOrderMaterialsDrawer] = useState(false)
  const { TabList, showSubmit, versionContext, handleChangeVersion } = useVersion({
    id,
    formContext: { data: formContextBo },
  })
  const [contractValue, setContractValue] = useState<any>()
  const { formContext } = useFormDetail()
  const requisitionRef = useRef<RequisitionModalTableRef | null>(null) // 关联请购单
  const orderMaterialsDrawerRef = useRef<OrderMaterialsDrawerRef | null>(null)

  const { getListPay } = getPaymentInfoFn()
  const { templateDescription, beforeUpload, showBtn, getList, sub } = schemasFn(addSchemaAction, intl)

  const handleVisibleOrderMaterialsDrawer = (flag?: boolean) => {
    setVisibleOrderMaterialsDrawer(!!flag)
  }

  // 同步删除抽屉选中项
  const handleDeleteOrderMaterialsRecord = (record: PostOrderMaterialData) => {
    orderMaterialsDrawerRef.current?.deleteItem(record)
  }

  // 订单物料
  const {
    materialAddButton,
    materialRef,
    materialColumns,
    materialComponents,
    expandedRowRender,
    expandIcon,
    rowExpandable,
    ...surplusProps
  } = useMaterialTable(
    addSchemaAction,
    addSchemaAction.getFieldValue('orderMode'),
    null,
    () => handleVisibleOrderMaterialsDrawer(true),
    handleDeleteOrderMaterialsRecord,
  )
  const { materialColumns: materialColumnsByRequisition } = useMaterialTable(
    addSchemaAction,
    OrderModalType.PURCHASE_REQUISITION_CONTRACT_ORDER,
    requisitionRef,
    () => handleVisibleOrderMaterialsDrawer(true),
    handleDeleteOrderMaterialsRecord,
  )

  let timerSignature = null
  useEffect(() => {
    if (id) {
      setFormLoading(true)
      getOrderBuyerCreateDetail({ orderId: `${id}` }).then((res) => {
        const { data }: any = res
        const _orderProductRequests = procurementRenderField(data)
        // TODO 不允许调用内部接口，暂时注释
        // postContractFeignGetTheLastContract({ contractId: data.contract?.contractId }, { ctlType: 'none' }).then(
        //   (resolve) => {
        //     if (resolve.code !== 1000) {
        //       message.error(resolve?.message)
        //       return
        //     }
        //     data.contract = { ...resolve?.data }
        //   },
        // )
        setTimeout(() => {
          setContractValue(data?.contract)
          setInitFormValue(() => procurmentRenderInit(data, _orderProductRequests))
        }, 500)
        // 初始订单物料抽屉勾选项
        orderMaterialsDrawerRef.current?.initCheckedKeys(
          convertOrderMaterialDataSource(res.data.product.products as any),
        )
        setFormContextBo(data)
        setFormLoading(false)
      })
    }
    if (modelType) {
      shopDataRef.current.orderMode = parseInt(modelType)
    }
    return () => {
      clearInterval(timerSignature)
      timerSignature = null
    }
  }, [versionContext])

  const handleSubmit = async (value) => {
    try {
      let fnResult = null
      // 新增订单/编辑订单
      const params = { ...value }
      // 校验订单物料
      if (!params.products?.length) {
        setTimeout(() => setVisibleOrderMaterialsDrawer(true), 500)
        return message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error7' }))
      }
      // 校验采购数量
      const judgementByCount =
        params.products?.length &&
        params.products.map((item) => {
          if (item.quantity) {
            return true
          } else {
            return false
          }
        })
      if (!judgementByCount || judgementByCount.includes(false)) {
        return message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error4' }))
      }
      // 使用发票即校验发票id
      if (params.hasInvoice && !params.theInvoiceId) {
        return message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error5' }))
      }
      sub(params)
      setBtnLoading(true)

      /** 字段转换 */
      // 合同下单 取供应商默认的发货地址
      const { data: deliveryAddress } = await getLogisticsSelectListMemberShipperAddress({
        memberId: params.vendorMemberId,
        roleId: params.vendorRoleId,
      })
      params.products = params.products.map((item) => {
        const address = deliveryAddress[0]
        return {
          ...item,
          quotedSpec: item.relevanceProductType,
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

      // 合同数据字段转换
      if (pageStatus === PageStatus.ADD || params?.contract?.id) {
        params.contract = {
          contractId: params.contract.id,
          contractNo: params.contract.contractNo,
          digest: params.contract.contractAbstract,
          effectDate: params.contract.startTime,
          expireDate: params.contract.endTime,
          partB: params.contract.partyBName,
          contractType: params.contract.sourceType,
          leftAmount: params.contract.freeAmount,
          receiptNo: params.contract.sourceNo,
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
      }

      // 其他需求
      params.requirement = {
        pack: params.pack,
        remark: params.remark,
      }
      if (pageStatus === PageStatus.VARIATION) {
        delete params?.consignee?.deliverDate
        const paramChange = {
          digest: params?.digest,
          deliverDate: params?.deliverDate,
          consignee: params?.consignee,
          hasInvoice: params?.hasInvoice,
          invoice: params?.invoice,
          contract: params?.contract,
          products: params?.products,
          currencyType: params?.currencyType,
          paymentType: params?.paymentType,
          requirement: {
            pack: params?.pack,
            remark: params?.remark,
          },
          contractText: params?.contractText,
        }
        fnResult = await postOrderBuyerChangeSrm({ ...paramChange, orderId: +id }, { ctlType: 'none' })
      } else {
        if (id) {
          fnResult = await postOrderBuyerCreateSrmUpdate({ ...params, orderId: id })
        } else {
          fnResult = await postOrderBuyerCreateSrm(params)
        }
      }
      // const _params = procurementProcessField(params)
      if (fnResult.code === 1000) {
        setTimeout(() => {
          history.push('/orderAbility/purchaseOrder/readyAddSrmOrder')
        }, 1000)
      } else {
        if (pageStatus === PageStatus.VARIATION) {
          message.error(fnResult.message)
          setBtnLoading(false)
          return
        }
        setBtnLoading(false)
      }
    } catch (error) {
      setBtnLoading(false)
      console.log(error)

      if (error?.code !== 1102) {
        return error?.message && message.error(error.message)
      }
    }
  }

  // 选择合同
  const handleOrderContract = () => {
    contractOrderRef.current.setVisible(true)
  }

  const handleOrderMaterialsConfirm = (value: OrderMaterialsConfirmValue) => {
    const productDataValue = addSchemaAction.getFieldValue('products')
    // const contractValue = addSchemaAction.getFieldValue('contract')
    let mergeArr = []

    value.forEach((item) => {
      const entity = productDataValue.find((material) => material.id === item.id)
      if (entity) {
        mergeArr.push({
          ...entity,
          ...convertOrderMaterialData(item),
        })
      } else {
        mergeArr.push({ ...convertOrderMaterialData(item) })
      }
    })
    mergeArr = mergeArr.map((item) => ({
      ...item,
      // 兼容之前订单物料数据
      logistics: 1,
      memberId: contractValue.partyBMemberId,
      memberRoleId: contractValue.partyBRoleId,
      amount: +(item.price * item.quantity).toFixed(2), // 这里应该会出现计算不准的问题
    }))
    addSchemaAction.setFieldValue('products', mergeArr)
  }

  const orderContract = pageStatus === PageStatus.ADD && (
    <div className="connectBtn" onClick={handleOrderContract}>
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

  const providerValue = {
    // detailData: initFormValue,
    schemaActions: addSchemaAction,
    formContext,
  }

  const getPopupPaymentContainer = () => document.getElementById('paymentInfo')

  // const contractValue = addSchemaAction.getFieldValue('contract')
  const orderModeValue = addSchemaAction.getFieldValue('orderMode')

  return (
    <div>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={`${id ? (pageStatus === PageStatus.VARIATION ? '变更' : '编辑') : '新增'}合同采购订单`}
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
                useAsyncSelect('orderMode', fetchOrderMode, ['text', 'id'])
                getListPay()
                $('onFormMount').subscribe(() => {
                  if (id || modelType) {
                    ctx.setFieldState('orderMode', (state) => {
                      state.editable = false
                    })
                  }
                  showBtn($)
                })
                getList()
                useOrderFormInitEffect(ctx)
                useModelTypeChange((state) => {
                  const { value, editable } = state
                  // 选择某种类型时， 需显示对应的订单类型
                  ctx.setFieldValue('type', orderTypeLabelMap[value])
                  addSchemaAction.setFieldState('products', (productState) => {
                    if (productState.value && productState.value.length) {
                      productState.value = [] // 切换下单模式时，清空“订单物料”原有数据
                    }
                    const columns =
                      value === OrderModalType.PURCHASE_REQUISITION_CONTRACT_ORDER
                        ? materialColumnsByRequisition
                        : materialColumns
                    productState.props['x-component-props'] = {
                      ...productState.props['x-component-props'],
                      columns,
                      scroll: {
                        x: columns.reduce((total, current) => (total += current.width), 0),
                      },
                      prefix: editable && pageStatus === PageStatus.ADD ? materialAddButton : '',
                    }
                  })
                  // 清空合同相关的数据
                  addSchemaAction.setFieldValue('contractNo', undefined)
                  addSchemaAction.setFieldValue('vendorMemberName', '')
                  addSchemaAction.setFieldValue('vendorMemberId', '')
                  addSchemaAction.setFieldValue('vendorRoleId', '')
                  orderMaterialsDrawerRef.current?.deleteAll()
                })
                // 选择完对应合同
                useContractChange(({ value }) => {
                  if (value?.CurrencyType) {
                    // 若合同有币别，默认填入到 付款信息
                    addSchemaAction.setFieldValue('currencyType', value.CurrencyType)
                  }
                  orderMaterialsDrawerRef.current?.deleteAll()
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
                orderContract,
                materialColumns,
                materialColumnsByRequisition,
                materialAddButton,
                materialComponents,
                expandable: {
                  expandedRowRender,
                  expandIcon,
                  rowExpandable,
                  expandedRowClassName: () => styles['order-materials-expanded-row'],
                },
                orderCombination,
                addNewAddress,
                CirculationRecord: <CirculationRecord />,
                templateDescription,
                beforeUpload,
                help,
                getPopupPaymentContainer,
              }}
            />
          )}
        </FormDetailWrapper>
      </FormDetailContext.Provider>
      {/* 选择合同下单 */}
      <ContractModalTable
        currentRef={contractOrderRef}
        schemaAction={addSchemaAction}
        setContractValue={(value) => setContractValue(value)}
      />
      {/* 选择采购物料 */}
      <MaterialModalTable currentRef={materialRef} schemaAction={addSchemaAction} sectionProps={surplusProps} />
      {/* 查看关联请购单 */}
      <RequisitionModalTable ref={requisitionRef} schemaAction={addSchemaAction} />

      {/* 选择采购物料抽屉 */}
      <OrderMaterialsDrawer
        visible={visibleOrderMaterialsDrawer}
        onClose={() => handleVisibleOrderMaterialsDrawer(false)}
        contractId={contractValue?.id || contractValue?.contractId || 0}
        orderMode={orderModeValue || 0}
        value={[]}
        onConfirm={handleOrderMaterialsConfirm}
        ref={orderMaterialsDrawerRef}
      />
    </div>
  )
}

PurchaseOrderDetail.defaultProps = {}

export default PurchaseOrderDetail
