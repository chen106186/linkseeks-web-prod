import { useRef, useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { Button, Row, Col, message } from 'antd'
import { createFormActions, registerVirtualBox, useFormSpy } from '@apps/formily'
import { SaveOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import { orderAddSchema } from './schema'
import {
  useModelTypeChange,
  useEditHideField,
  useOrderFormInitEffect,
  useProductTableChangeForPay,
  useProductAddress,
} from './effects'
import { orderTypeLabelMap, procurementProcessField, procurementRenderField, procurmentRenderInit } from './constant'
import CirculationRecord from '../circulationRecord'
import SelectAddress from '../../components/AddressSelectList'
import TheInvoiceList from './components/theInvoiceList'
import styled from 'styled-components'
import { useUpdate } from '@linkseeks/hooks'
import { help } from '@/pages/transaction/common'
import { useMaterialTable } from './model/useMaterialTable'
import MaterialModalTable from './components/materialModalTable'
import MemberModalTable from './components/memberModalTable'
import FormDetailHeader from '@/components/FormDetailHeader'
import { FormDetailContext } from '@/formSchema/context'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import { getOrderBuyerCreateDetail, postOrderBuyerChangeMateriel } from '@apps/apis'
import { getLogisticsReceiverAddressGet, getLogisticsSelectListMemberShipperAddress } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { postOrderBuyerCreateMateriel, postOrderBuyerUpdateMateriel } from '@apps/apis'
import { fetchOrderApi } from './apis'
import './index.less'
import ChangeButtonCard from '@/pages/orderAbility/assets/effect/changButton'
import AddChangeCard from '@/pages/transaction/components/addChangeCard'
import useVersion from '@/hooks/useVersion'
import { formatTimeString } from '@/utils'
import { schemasFn } from '../../componentSchema'

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
  const data = form.getFieldValue('products') || []
  const sum = data.reduce((prev, next) => (prev * 100 + (next.amount || 0) * 100) / 100, 0)
  const [freePrice] = useState<number>(0)

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
    </RowStyle>
  )
})

/** 新增物料订单 仅有物料 */
const AddMaterialOrder = () => {
  const intl = useIntl()
  const shopDataRef = useRef<any>({})
  const memberRef = useRef<any>({})
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const update = useUpdate()
  const { pageStatus, id, modelType } = usePageStatus()
  const [initFormSchema] = useState<any>(() => ({ ...orderAddSchema }))
  const [formContextBo, setFormContextBo] = useState<any>(null)
  const { TabList, showSubmit, versionContext, handleChangeVersion } = useVersion({
    id,
    formContext: { data: formContextBo },
  })
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

  const { templateDescription, beforeUpload, showBtn, getList, sub } = schemasFn(addSchemaAction, intl)
  // 订单物料
  const {
    materialAddButton,
    materialRef,
    materialColumns,
    materialComponents,
    visibleAddress,
    setVisibleAddress,
    ...surplusProps
  } = useMaterialTable(addSchemaAction)

  useEffect(() => {
    if (id) {
      setFormLoading(true)
      getOrderBuyerCreateDetail({ orderId: `${id}` }).then((res) => {
        const { data } = res
        if (res.code !== 1000) {
          message.error(res.message)
          return
        }
        const _orderProductRequests = procurementRenderField(data)
        const init = procurmentRenderInit(data)
        setInitFormValue(init)
        setTimeout(() => {
          addSchemaAction.setFieldValue('products', _orderProductRequests)
          const isVisibleAddress = _orderProductRequests.every((_item) => _item?.deliverType !== 1)
          setVisibleAddress(isVisibleAddress)
        }, 1000)
        setFormContextBo(data)
        setFormLoading(false)
      })
    }
    if (modelType) {
      shopDataRef.current.orderMode = parseInt(modelType)
    }
  }, [versionContext])

  const handleSubmit = async (value) => {
    try {
      let fnResult = null
      // 新增订单/编辑订单
      const params = { ...value }
      console.log(value)
      if (formContext.innerFormErrors) {
        message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error7' }))
        return
      }
      // 校验采购数量 单价和税率
      const judgementByPrice = []
      const isExample = params.orderMode === 18 // 判断物料样品下单
      const judgementByCount =
        params.products?.length &&
        params.products.map((item) => {
          const flag = isExample ? item.price : Number(item.price)
          if (flag) {
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
      }
      if (judgementByPrice.includes(false)) {
        message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error8' }))
        return
      }
      // 使用发票即校验发票id
      if (params.hasInvoice && !params.theInvoiceId) {
        message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error5' }))
        return
      }

      sub(params)
      setBtnLoading(true)

      // 物料下单 取供应商默认的发货地址
      const { data: deliveryAddress } = await getLogisticsSelectListMemberShipperAddress({
        memberId: params.vendorMemberId,
        roleId: params.vendorRoleId,
      })
      params.products = params.products.map((item) => {
        const address = deliveryAddress[0]
        return {
          ...item,
          tax: Number(item.taxRate) ? true : false,
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
      if (!visibleAddress) {
        await getLogisticsReceiverAddressGet(
          {
            id: params.deliveryAddresId?.id || params.deliveryAddresId,
          },
          { ctlType: 'none' },
        ).then((res) => {
          const { data: addressDetail, code } = res
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
              defaultConsignee: !!addressDetail.isDefault,
            }
          } else {
            message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error9' }))
            return
          }
        })
      } else {
        params.consignee = null
      }

      // 其他需求
      params.requirement = {
        pack: params.pack,
        remark: params.remark,
      }

      const _params = procurementProcessField(params)
      if (pageStatus === PageStatus.VARIATION) {
        const paramChange = {
          vendorMemberId: params?.vendorMemberId,
          vendorRoleId: params?.vendorRoleId,
          vendorMemberName: params?.vendorMemberName,
          digest: params?.digest,
          currencyType: params?.currencyType,
          paymentType: params?.paymentType,
          deliverDate: params?.deliverDate,
          consignee: params?.consignee,
          hasInvoice: params?.hasInvoice,
          invoice: params?.invoice,
          products: params?.products,
          requirement: params?.requirement,
          contractText: params?.contractText,
        }

        fnResult = await postOrderBuyerChangeMateriel({ ...paramChange, orderId: +id })
      } else {
        if (id) {
          fnResult = await postOrderBuyerUpdateMateriel({ ..._params, orderId: id })
        } else {
          fnResult = await postOrderBuyerCreateMateriel(_params)
        }
      }

      if (fnResult.code === 1000) {
        setTimeout(() => {
          history.push('/orderAbility/purchaseOrder/readyAddMaterialOrder')
        }, 1000)
      } else {
        setBtnLoading(false)
      }
    } catch (error) {
      setBtnLoading(false)
      console.log(error)
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
      </div>
    ) : null

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

  useEffect(() => {
    if (visibleAddress) {
      addSchemaAction.setFieldState('deliveryAddresId', (state) => {
        state.visible = false
      })
    } else {
      useProductAddress(addSchemaAction)
      addSchemaAction.setFieldState('deliveryAddresId', (state) => {
        state.visible = true
        state.value = formContextBo?.consignee?.consigneeId
      })
    }
  }, [visibleAddress])

  return (
    <div>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={
            id
              ? pageStatus === PageStatus.VARIATION
                ? '变更'
                : intl.formatMessage({ id: 'purchaseOrder.edit', defaultMessage: '编辑' })
              : intl.formatMessage({ id: 'purchaseOrder.add' })
          }
          schema={initFormSchema}
          tabList={versionContext ? TabList : []}
          extraRight={
            <ChangeButtonCard
              formContext={{ data: formContextBo }}
              versionChange={handleChangeVersion}
              authButtonCard={
                showSubmit && (
                  // <AuthButton type="custom" code="save" key="1">
                  <Button
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
                $('onFormMount').subscribe(() => {
                  if (id || modelType) {
                    ctx.setFieldState('orderMode', (state) => {
                      state.editable = false
                    })
                  }
                  showBtn($)
                })
                getList()
                useAsyncSelect('currencyType', fetchOrderApi.fetchCurrencyType, ['text', 'id'])
                useAsyncSelect('paymentType', fetchOrderApi.fetchPaymentType, ['text', 'id'])

                useOrderFormInitEffect(ctx)
                useModelTypeChange((state) => {
                  const { value } = state
                  // 选择某种类型时， 需显示对应的订单类型
                  ctx.setFieldValue('type', orderTypeLabelMap[value])
                  // addSchemaAction.setFieldState('products', productState => {
                  //   productState.props["x-component-props"] = {
                  //     ...productState.props["x-component-props"],
                  //     prefix: editable && pageStatus === PageStatus.ADD ? materialAddButton : '',
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
                materialColumns,
                materialAddButton,
                materialComponents,
                addNewAddress,
                CirculationRecord: <CirculationRecord />,
                help,
                getPopupPaymentContainer,
                templateDescription,
                beforeUpload,
              }}
            />
          )}
        </FormDetailWrapper>
      </FormDetailContext.Provider>
      {/* 选择供应会员 */}
      <MemberModalTable currentRef={memberRef} productRef={materialRef} schemaAction={addSchemaAction} />
      {/* 选择采购物料 */}
      <MaterialModalTable currentRef={materialRef} schemaAction={addSchemaAction} sectionProps={surplusProps} />
    </div>
  )
}

AddMaterialOrder.defaultProps = {}

export default AddMaterialOrder
