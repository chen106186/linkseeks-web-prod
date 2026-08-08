import React, { useRef, useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { Button, Card, Row, Col, message } from 'antd'
import { createFormActions, registerVirtualBox, useFormSpy } from '@apps/formily'
import { SaveOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import { mergeAllSchemas, payInfo, orderMaterial, orderProduct } from './schema'
import {
  useModelTypeChange,
  useEditHideField,
  useOrderFormInitEffect,
  useProductTableChangeForPay,
  useOrderUpdateChangeOther,
} from './effects'
import { orderCombination, orderTypeLabelMap, procurementProcessField, procurementRenderField } from './constant'
import { OrderModalType } from '@/constants/order'
import ProductModalTable from './components/productModalTable'
import MemberModalTable from './components/memberModalTable'
import InquiryModalTable from './components/inquiryModalTable'
import DemandModalTable from './components/demandModalTable'
import CirculationRecord from '../circulationRecord'
import SelectAddress from '../../components/AddressSelectList'
import SelectContract from './components/selectContract'
import TheInvoiceList from './components/theInvoiceList'
import moment from 'moment'
import { usePaymentInfo } from './model/usePaymentInfo'
import { useProductTable } from './model/useProductTable'
import styled from 'styled-components'
import { useUpdate } from '@linkseeks/hooks'
import { formatTimeString, omit, findLastIndexFlowState } from '@/utils'
import { changeRouterTitleByStatus } from '@/pages/orderAbility/utils'
import { getCookie, removeCookie } from '@/utils/cookie'
import { ReadyAddOrderDetailContext } from '../../context'
import AuditProcess from '@/components/AuditProcess'
import styles from './index.less'
import SimpleElectronModal from './components/simpleElectronModal'
import { fetchOrderApi } from './apis'
import MergeOrderModalTable from './components/mergeOrderModalTable'
import { useMaterialTable } from './model/useMaterialTable'
import ContractModalTable from './components/contractModalTable'
import MaterialModalTable from './components/materialModalTable'
import { help } from '@/pages/transaction/common'
import { getLogisticsSelectListMemberShipperAddress, postLogisticsFreightTemplateCalFreightPrice } from '@apps/apis'
import { getWebIntl } from '@apps/locales'

export interface PurchaseOrderDetailProps {}
const translate = getWebIntl()
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
export const MoneyTotalBox = registerVirtualBox('moneyTotalBox', (props) => {
  const intl = useIntl()
  const { form } = useFormSpy({ selector: [['onFieldValueChange', 'orderProductRequests']], reducer: (v) => v })
  const data = form.getFieldValue('orderProductRequests')
  const receiverAddressId = form.getFieldValue('deliveryAddresId')
  const orderModel = form.getFieldValue('orderModel')
  const sum = data.reduce((prev, next) => (prev * 100 + (next.money || 0) * 100) / 100, 0)
  const [freePrice, setFreePrice] = useState<number>(0)

  useEffect(() => {
    if (sum + freePrice) {
      form.notify('sumPrice', sum + freePrice)
    }
  }, [sum, freePrice])

  useEffect(() => {
    // 存在商品 并且有选择收货地址，则开始计算运费，此外 送货地址变动也要重新计算
    // @合同下单 无需运费 折扣
    if (data && data.length > 0 && receiverAddressId && orderModel < OrderModalType.PURCHASE_ENQUIRY_CONTRACT_ORDER) {
      // 筛选配送方式为物流的商品并且使用了运费模板
      const logsiticsDataMaps = data.filter(
        (v) => v.logistics && v.logistics.useTemplate && v.logistics.deliveryType === 1,
      )
      if (logsiticsDataMaps.length > 0) {
        postLogisticsFreightTemplateCalFreightPrice(
          {
            orderProductList: logsiticsDataMaps.map((v) => ({
              templateId: v.logistics.templateId,
              weight: v.logistics.weight,
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
        setFreePrice(0)
      }
    }
  }, [data, receiverAddressId])

  return (
    <RowStyle>
      <Col span={2}>
        <div>{translate('web.resource.order.hejijine')}</div>
        <div>{`${translate('web.common.currencySymbol')}${sum.toFixed(2)}`}</div>
      </Col>
      <Col span={2}>
        <div>{translate('web.resource.order.yunfei')}</div>
        <div>{`${translate('web.common.currencySymbol')}${freePrice.toFixed(2)}`}</div>
      </Col>
      <Col span={2}>
        <div>{translate('web.resource.order.zongjijine')}</div>
        <div>{`${translate('web.common.currencySymbol')}${(sum + freePrice).toFixed(2)}`}</div>
      </Col>
    </RowStyle>
  )
})

/** 此文件模块 包含orderCollect文件夹备用 暂不起作用 */
// 采购订单详情页. 包含新增和编辑
const PurchaseOrderDetail: React.FC<PurchaseOrderDetailProps> = (props) => {
  const shopDataRef = useRef<any>({})
  const memberRef = useRef<any>({})
  const inquiryRef = useRef<any>({})
  const demandRef = useRef<any>({})
  const contractRef = useRef<any>({})
  const mergeRef = useRef<any>({})
  const contractOrderRef = useRef<any>({}) // 合同下单选采购合同
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const update = useUpdate()
  // const [productSumPrice, setProductSumPrice] = useState<number>(0)
  const productSumPriceRef = useRef<any>(0)
  const { pageStatus, id, page_type = '0', modelType, spam_id, lastTypeParams } = usePageStatus()
  const [initFormSchema, setInitFormSchema] = useState<any>(() => ({ ...mergeAllSchemas[page_type] }))
  const [initFormValue, setInitFormValue] = useState<any>(() => {
    let resultState = {}
    if (modelType) {
      resultState = {
        orderModel: parseInt(modelType),
      }
    }
    // 订单数据
    if (spam_id) {
      const item = getCookie(spam_id) // JSON.parse(window.sessionStorage.getItem(spam_id))
      if (item) {
        console.log(item)
      }
    }
    return resultState
  })
  const [paymentColumns, paymentComponents, paymentSave] = usePaymentInfo(
    addSchemaAction,
    addSchemaAction.getFieldValue('supplyMembersId'),
    addSchemaAction.getFieldValue('supplyMembersRoleId'),
    pageStatus === PageStatus.ADD
      ? addSchemaAction.getFieldValue('orderProductRequests')
      : initFormValue.orderProductRequests,
  )
  // 订单商品
  const { productAddButton, productRef, productColumns, productComponents, ...sectionProps } = useProductTable(
    addSchemaAction,
    mergeRef,
  )
  // 订单物料
  const { materialAddButton, materialRef, materialColumns, materialComponents, ...surplusProps } =
    useMaterialTable(addSchemaAction)

  let timerSignature = null
  // 页面进入时， 当前所处的下单模式
  useEffect(() => {
    if (id) {
      setFormLoading(true)
      // // @ts-ignore
      // getOrderProcurementOrderDetails({
      //   id
      // }).then(res => {
      //   const { data } = res
      //   const _orderProductRequests = data.orderModel > 30 ? procurementRenderField(data.orderProductRequests)  : data.orderProductRequests
      //   setInitFormValue({
      //     ...data,
      //     // 判断是否合同下单
      //     orderProductRequests: [],
      //     deliveryTime: formatTimeString(data.deliveryTime)
      //   })
      //   setTimeout(() => {
      //     addSchemaAction.setFieldValue('orderProductRequests', _orderProductRequests)
      //   }, 1000)
      //   setFormLoading(false)
      // })
    }

    if (modelType) {
      shopDataRef.current.orderModel = parseInt(modelType)
    }
    // 订单数据
    if (spam_id) {
      const item = getCookie(spam_id)
      if (item) {
        shopDataRef.current = Object.assign({}, shopDataRef.current, item)
      }
    }

    return () => {
      clearInterval(timerSignature)
      timerSignature = null
    }
  }, [])

  const handleSubmit = async (value) => {
    const _orderProductRequests = JSON.parse(JSON.stringify(value.orderProductRequests))
    const processEnum = value['processEnum']
    const usingElectronicContracts = value['usingElectronicContracts']
    const signatureLogId = value['signatureLogId']
    const electronicContractId = value['electronicContractId']
    if (processEnum === 24 && usingElectronicContracts && !signatureLogId) {
      setBtnLoading(true)
      // 监听 是否完成签合同 提交订单
      timerSignature = setInterval(() => {
        const __signatureLogId = addSchemaAction.getFieldValue('signatureLogId')
        if (__signatureLogId) {
          clearInterval(timerSignature)
          timerSignature = null
          addSchemaAction.submit()
        }
      }, 1000)
      // 生成并签署合同
      if (electronicContractId) {
        fetchOrderApi
          .createContract({
            contractTemplateId: electronicContractId,
            memberId: value['supplyMembersId'],
            roleId: value['supplyMembersRoleId'],
            quotationNo: value['quotationNo'],
            orderProductRequests: _orderProductRequests.map((v) => {
              // v.price = 1
              v.price = v.price
              v.isMemberPrice = Number(v.isMemberPrice)
              v.memberPrice = v.memberPrice
              v.imgUrl = v.mainPic ? v.mainPic : v.imgUrl
              v.minOrder = v.minOrder
              v.channelProductId = v?.channelProductId || v?.commodityUnitPriceAndPicId
              return v
            }),
            orderModel: value['orderModel'],
            deliveryAddresId: value['deliveryAddresId']['id'],
          })
          .then((_data) => {
            // setBtnLoading(false)
            if (_data?.contractName) {
              addSchemaAction.setFieldState('usingElectronicContracts', (state) => {
                state.props['x-component-props'].contract = { contractTemplateId: electronicContractId, ..._data }
              })
              addSchemaAction.setFieldValue('electronicContractName', _data?.contractName)
              contractRef.current.setVisible(true)
            }
          })
      }
      return
    }

    try {
      let fnResult = null
      // 可做新增/修改的判断
      // if (lastTypeParams === 'add') {
      // } else if (lastTypeParams === 'edit') {
      // }
      switch (page_type) {
        case '0': {
          // 新增订单/编辑订单
          const params = {
            ...value,
            deliveryTime: moment(value.deliveryTime).valueOf(),
            // 没用的字段
            orderProductRequests: _orderProductRequests.map((v) => {
              v.price = v.money / v.purchaseCount / v.memberPrice
              v.isMemberPrice = Number(v.isMemberPrice) || 0
              v.memberPrice = v.memberPrice
              v.imgUrl = v.mainPic ? v.mainPic : v.imgUrl
              v.minOrder = v.minOrder
              v.channelProductId = v?.channelProductId || v?.commodityUnitPriceAndPicId
              return v
            }),
            needTheInvoice: value.needTheInvoice ? 1 : 0,
            // 冗余交付信息
            deliveryAddresId: value.deliveryAddresId.id || value.deliveryAddresId,
            ...omit(value.deliveryAddresId, ['id']),
            // 冗余发票信息
            theInvoiceId: value.theInvoiceId ? value.theInvoiceId.id : undefined,
          }
          // 校验是否选择支付渠道/支付比例
          // @合同下单 无需支付信息
          if (value['orderModel'] < OrderModalType.PURCHASE_ENQUIRY_CONTRACT_ORDER) {
            const judgementByPay =
              params.paymentInformationResponses?.length &&
              params.paymentInformationResponses.map((item) => {
                if (item.channel && item.payWay) {
                  return true
                } else {
                  return false
                }
              })
            if (!judgementByPay || judgementByPay.includes(false)) {
              throw new Error('请选择支付方式或支付渠道')
            }
            const totalRatio = params.paymentInformationResponses.reduce((a, b) => a + Number(b.payRatio || 0), 0)
            const judgementByRatio =
              params.paymentInformationResponses?.length &&
              params.paymentInformationResponses.map((item) => {
                if (Number(item.payRatio) > 0 && Number(item.payRatio) <= 100 && totalRatio === 100) {
                  return true
                } else {
                  return false
                }
              })
            if (!judgementByRatio || judgementByRatio.includes(false)) {
              throw new Error('请正确填写支付比例')
            }
          } else {
            // // @合同下单 取供应商默认的发货地址
            const { data: deliveryAddress } = await getLogisticsSelectListMemberShipperAddress({
              memberId: params.supplyMembersId,
              roleId: params.supplyMembersRoleId,
            })
            params.orderProductRequests = params.orderProductRequests.map((item) => {
              // const address = deliveryAddress.filter(item => item.isDefault)[0]
              const address = deliveryAddress[0]
              const logistics: any = {
                deliveryType: item.logistics,
                sendAddress: address.id,
                render: address,
              }
              return {
                ...item,
                logistics,
              }
            })
          }
          // 校验采购数量
          const judgementByCount =
            params.orderProductRequests?.length &&
            params.orderProductRequests.map((item) => {
              if (item.purchaseCount) {
                return true
              } else {
                return false
              }
            })
          if (!judgementByCount || judgementByCount.includes(false)) {
            throw new Error('请填写商品采购数量')
          }
          // 使用发票即校验发票id
          if (params.needTheInvoice && !params.theInvoiceId) {
            throw new Error('请新增或选择需要使用的发票')
          }
          // logistics render字段字符串化
          params.orderProductRequests = params.orderProductRequests.map((item) => {
            const logistics: any = {
              ...item.logistics,
              render: JSON.stringify(
                typeof item.logistics.render === 'object'
                  ? item.logistics.render
                  : item.logistics?.render
                  ? item.logistics.render.replace(/\"/g, '')
                  : {},
              ),
            }
            return {
              ...item,
              logistics,
            }
          })
          setBtnLoading(true)
          delete params.type

          // if(id) {
          //   fnResult = await postOrderProcurementOrderUpdate({...params, id})
          // } else if(params.orderModel === 9) {
          //   fnResult = await postOrderProcurementOrderAddMerge({
          //     ...params,
          //     ordeProducts: addSchemaAction.getFieldValue("ordeProducts")
          //   })
          // } else if(params.orderModel > 30) { // 判断是否合同下单
          //   const _params = procurementProcessField(params)
          //   const _ = _params.quotationNo
          //   _params.quotationNo = _params.contractNo
          //   _params.contractNo = _
          //   fnResult = await postOrderPurchaseContractAdd(_params)
          // } else {
          //   fnResult = await postOrderProcurementOrderAddReinsurancePolicy(params)
          // }
          break
        }
      }
      // if (fnResult.code === 1000) {
      //   // 跳转至待新增列表
      //   removeCookie(spam_id, { path: '/', domain: TOP_DOMAIN })
      //   // window.sessionStorage.removeItem(spam_id)
      //   setTimeout(() => {
      //     history.push("/orderAbility/purchaseOrder/readyAddOrder")
      //   }, 1000)
      // } else {
      //   setBtnLoading(false)
      // }
    } catch (error) {
      setBtnLoading(false)
      error?.message && message.error(error.message)
      console.log(error)
    }
  }

  // 唤起报价单弹窗
  const handleOrderNo = async () => {
    // @todo 未完整实现功能, 缺少商品接口
    // 询价报价单, 合并订单需要唤起询价弹窗
    if (!addSchemaAction.getFieldValue('shopId')) {
      return message.error('请先选择适应商城')
    }
    const orderModel = addSchemaAction.getFieldValue('orderModel')
    if (orderModel === OrderModalType.INQUIRY_QUOTATION_ORDER) {
      inquiryRef.current.setVisible(true)
    } else {
      demandRef.current.setVisible(true)
    }
  }
  // 选择会员弹窗
  const handleOrderMember = () => {
    if (!addSchemaAction.getFieldValue('shopId')) {
      return message.error('请先选择适应商城')
    }
    memberRef.current.setVisible(true)
  }

  // 选择合同
  const handleOrderContract = () => {
    if (!addSchemaAction.getFieldValue('shopId')) {
      return message.error('请先选择适应商城')
    }
    contractOrderRef.current.setVisible(true)
  }

  const orderNoPrice = pageStatus !== PageStatus.PREVIEW && (
    <div className="connectBtn" onClick={handleOrderNo}>
      <LinkOutlined style={{ marginRight: 4 }} />
      选择
    </div>
  )
  const orderMember = pageStatus !== PageStatus.PREVIEW && (
    <div className="connectBtn" onClick={handleOrderMember}>
      <LinkOutlined style={{ marginRight: 4 }} />
      选择
    </div>
  )
  const orderContract = pageStatus !== PageStatus.PREVIEW && (
    <div className="connectBtn" onClick={handleOrderContract}>
      <LinkOutlined style={{ marginRight: 4 }} />
      选择
    </div>
  )

  // @todo 未实现金额合计
  const couponAddButton = (
    <Button onClick={() => productRef.current.setVisible(true)} block type="default" style={{ margin: '24px auto' }}>
      选择优惠券
    </Button>
  )

  // 新增收货地址
  const addNewAddress = (
    <Button block icon={<PlusOutlined />}>
      新增收货地址
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
        handleChange: (record, value = 100) => {
          const payPrice = ((value / 100) * productSumPriceRef.current).toFixed(2)
          const newData = [...addSchemaAction.getFieldValue('paymentInformationResponses')]
          const item = newData[index]
          newData.splice(index, 1, {
            ...item,
            payPrice,
          })
          addSchemaAction.setFieldValue('paymentInformationResponses', newData)
        },
      }),
    }
  })

  const providerValue = {
    detailData: initFormValue,
    schemaActions: addSchemaAction,
    // productSumPrice,
    // setProductSumPrice
  }

  // 显示采购下单合同栏目
  const showContractColumn = () => {
    // 移除支付信息栏 订单商品栏 添加订单物料
    setInitFormSchema(() => {
      const origin = { ...initFormSchema }
      delete origin.properties.NO_SUBMIT_TABS.properties.payInfo
      delete origin.properties.NO_SUBMIT_TABS.properties.orderProduct
      origin.properties.NO_SUBMIT_TABS.properties.orderMaterial = orderMaterial
      return origin
    })
  }

  // 移除采购合同下单栏目 恢复原有
  const removeContractColumn = () => {
    // 移除订单物料 添加支付信息栏 订单商品栏
    setInitFormSchema(() => {
      const origin = { ...initFormSchema }
      origin.properties.NO_SUBMIT_TABS.properties.payInfo = payInfo
      origin.properties.NO_SUBMIT_TABS.properties.orderProduct = orderProduct
      delete origin.properties.NO_SUBMIT_TABS.properties.orderMaterial
      return origin
    })
  }

  return (
    <PageHeaderWrapper
      title={changeRouterTitleByStatus()}
      extra={[
        <Button
          key="1"
          onClick={() => addSchemaAction.submit()}
          loading={btnLoading}
          type="primary"
          icon={<SaveOutlined />}
        >
          保存
        </Button>,
      ]}
    >
      <ReadyAddOrderDetailContext.Provider value={providerValue}>
        {pageStatus !== PageStatus.ADD && initFormValue && initFormValue.externalWorkflowFlowRecordLogResponses && (
          <AuditProcess
            customTitleKey="operationalProcess"
            customKey="state"
            outerVerifyCurrent={findLastIndexFlowState(initFormValue.externalWorkflowFlowRecordLogResponses)}
            innerVerifyCurrent={findLastIndexFlowState(initFormValue.interiorWorkflowFlowRecordLogResponses)}
            outerVerifySteps={
              initFormValue.externalWorkflowFlowRecordLogResponses
                ? initFormValue.externalWorkflowFlowRecordLogResponses.map((item) => ({
                    ...item,
                    status: item.isExecute ? 'finish' : 'wait',
                  }))
                : []
            }
            innerVerifySteps={
              initFormValue.interiorWorkflowFlowRecordLogResponses
                ? initFormValue.interiorWorkflowFlowRecordLogResponses.map((item) => ({
                    ...item,
                    status: item.isExecute ? 'finish' : 'wait',
                  }))
                : []
            }
          ></AuditProcess>
        )}
        <Card className={styles.orderCollectCard} style={{ marginTop: 24 }}>
          <NiceForm
            loading={formLoading}
            previewPlaceholder=" "
            // editable={pageStatus !== PageStatus.PREVIEW}
            value={initFormValue}
            actions={addSchemaAction}
            // schema={mergeAllSchemas[page_type]}
            schema={initFormSchema}
            onSubmit={handleSubmit}
            components={{
              SelectAddress,
              TheInvoiceList,
              SelectContract,
            }}
            effects={($, ctx) => {
              $('onFormMount').subscribe(() => {
                if (id || modelType) {
                  ctx.setFieldState('orderModel', (state) => {
                    state.editable = false
                    // state.props["x-component-props"] = {
                    //   disabled: true
                    // }
                  })
                }
              })
              // 监听商品总价的变更, 此处逻辑需优化
              $('sumPrice').subscribe((payload) => {
                const payment = addSchemaAction.getFieldValue('paymentInformationResponses')
                const oldData = payment ? [...payment] : []
                if (oldData && oldData.length > 0) {
                  const newData = oldData.map((v) => {
                    v.payPrice = ((v.payRatio / 100) * payload).toFixed(2)
                    return v
                  })
                  addSchemaAction.setFieldValue('paymentInformationResponses', newData)
                }
                // setProductSumPrice(payload)
                productSumPriceRef.current = payload
              })
              $('onFieldInputChange', 'orderModel').subscribe((state) => {
                const { editable, value } = state
                // 处理商城类型选项 报价单文案 支付信息栏隐藏
                if (value) {
                  const enumList = ctx.getFieldState('shopId').props.enum
                  if (value <= 9 || value > 30) {
                    ctx.setFieldState('shopId', (state) => {
                      state.visible = true
                      state.props.enum = enumList.filter((item) => item.type === 1 && item.environment === 1)
                    })
                  }
                  if (value === 11) {
                    ctx.setFieldState('shopId', (state) => {
                      state.visible = true
                      state.props.enum = enumList.filter((item) => item.type === 3 && item.environment === 1)
                    })
                  }
                  if (value === 13) {
                    ctx.setFieldState('shopId', (state) => {
                      state.visible = true
                      state.props.enum = enumList.filter((item) => item.type === 4 && item.environment === 1)
                    })
                  }
                  // 判断合同下单
                  if (value > 30) {
                    ctx.setFieldState('quotationNo', (state) => {
                      state.props.title = orderTypeLabelMap()[value]
                      state.visible = true
                    })
                    ctx.setFieldState('needTheInvoice', (state) => {
                      state.visible = false
                    })
                    showContractColumn()
                  } else {
                    ctx.setFieldState('quotationNo', (state) => {
                      state.props.title = '对应报价单号'
                    })
                    ctx.setFieldState('payInfo', (state) => {
                      state.visible = true
                    })
                    removeContractColumn()
                  }
                }

                // 手动切换过下单模式, 需重置受下单模式影响的字段
                if (editable) {
                  ctx.reset({
                    validate: false,
                    selector: '*(quotationNo,supplyMembersName,supplyMembersId,orderProductRequests,orderThe)',
                  })
                  // 清空弹窗所选的值
                  productRef.current.rowSelectionCtl.setSelectRow([])
                  productRef.current.rowSelectionCtl.setSelectedRowKeys([])
                  memberRef.current.rowSelectionCtl.setSelectRow([])
                  memberRef.current.rowSelectionCtl.setSelectedRowKeys([])
                  inquiryRef.current.rowSelectionCtl.setSelectRow([])
                  inquiryRef.current.rowSelectionCtl.setSelectedRowKeys([])
                  demandRef.current.rowSelectionCtl.setSelectRow([])
                  demandRef.current.rowSelectionCtl.setSelectedRowKeys([])
                }
              })
              useOrderFormInitEffect(ctx)
              useModelTypeChange((state) => {
                const { value, editable } = state
                // 报价单的值 等同于是否填写过报价单
                // @tofix 此处模式变动 table前缀按钮无法显示
                const quotationOrderValue = ctx.getFieldValue('quotationNo')
                if (
                  value === OrderModalType.PURCHASE_ENQUIRY_CONTRACT_ORDER ||
                  value === OrderModalType.PURCHASE_BIDDING_CONTRACT_ORDER ||
                  value === OrderModalType.PURCHASE_TENDER_CONTRACT_ORDER
                ) {
                  // 判断合同下单
                  setTimeout(() => {
                    addSchemaAction.setFieldState('orderProductRequests', (productState) => {
                      productState.props['x-component-props'] = {
                        ...productState.props['x-component-props'],
                        prefix: editable && pageStatus === PageStatus.ADD ? materialAddButton : '',
                      }
                    })
                  }, 500)
                  showContractColumn()
                } else {
                  // setTimeout(() => {
                  addSchemaAction.setFieldState('orderProductRequests', (productState) => {
                    productState.props['x-component-props'] = {
                      ...productState.props['x-component-props'],
                      prefix: '',
                    }
                  })
                  // }, 500)
                  removeContractColumn()
                }
                // 选择某种类型时， 需显示对应的订单类型
                ctx.setFieldValue('type', orderTypeLabelMap()[value])
              })
              useEditHideField()
              // 商品信息的改动 驱动支付信息变化
              useProductTableChangeForPay(ctx, update)

              // 编辑 地址和发票信息变动 触发订单更新
              useOrderUpdateChangeOther(ctx)

              // 合并订单模式下 只选择供应会员 出现选择商品按钮
              $('onFieldValueChange', 'supplyMembersName').subscribe((state) => {
                const quotationOrderValue = ctx.getFieldValue('quotationNo')
                const modelType = ctx.getFieldValue('orderModel')
                if (state.value && !quotationOrderValue && modelType === OrderModalType['CONSOLIDATED_ORDER']) {
                  addSchemaAction.setFieldState('orderProductRequests', (productState) => {
                    productState.props['x-component-props'] = {
                      ...productState.props['x-component-props'],
                      prefix: pageStatus === PageStatus.ADD ? productAddButton : '',
                    }
                  })
                }
              })
              $('onFieldValueChange', 'quotationNo').subscribe((state) => {
                const modelType = ctx.getFieldValue('orderModel')
                if (state.value && modelType === OrderModalType['CONSOLIDATED_ORDER']) {
                  addSchemaAction.setFieldState('orderProductRequests', (productState) => {
                    productState.props['x-component-props'] = {
                      ...productState.props['x-component-props'],
                      prefix: '',
                    }
                  })
                }
              })
            }}
            expressionScope={{
              orderNoPrice,
              orderMember,
              orderContract,
              paymentColumns: paymentEditColumns,
              paymentComponents,
              productColumns,
              productAddButton,
              productComponents,
              materialColumns,
              materialAddButton,
              materialComponents,
              // productAfter: afterFix,
              couponAddButton,
              orderCombination,
              addNewAddress,
              CirculationRecord: <CirculationRecord />,
              handleQuotation: (value) => !!value,
              help,
            }}
          />
        </Card>
        <ProductModalTable
          currentRef={productRef}
          schemaAction={addSchemaAction}
          sectionProps={sectionProps}
          forceRender
        />
        <MemberModalTable currentRef={memberRef} productRef={productRef} schemaAction={addSchemaAction} />
        {/* 询价报价单弹窗 */}
        <InquiryModalTable currentRef={inquiryRef} schemaAction={addSchemaAction} />

        {/* 需求报价单弹窗 */}
        <DemandModalTable currentRef={demandRef} schemaAction={addSchemaAction} />

        {/* 简单流程签合同弹窗 */}
        <SimpleElectronModal currentRef={contractRef} schemaAction={addSchemaAction} />

        {/* 选择待合并订单弹窗 */}
        <MergeOrderModalTable
          title="选择待合并订单"
          currentRef={mergeRef}
          schemaAction={addSchemaAction}
          handleUpdate={update}
        />

        {/* 选择合同下单 */}
        <ContractModalTable currentRef={contractOrderRef} schemaAction={addSchemaAction} />

        {/* @todo 选择采购物料 */}
        <MaterialModalTable currentRef={materialRef} schemaAction={addSchemaAction} sectionProps={surplusProps} />
      </ReadyAddOrderDetailContext.Provider>
    </PageHeaderWrapper>
  )
}

PurchaseOrderDetail.defaultProps = {}

export default PurchaseOrderDetail
