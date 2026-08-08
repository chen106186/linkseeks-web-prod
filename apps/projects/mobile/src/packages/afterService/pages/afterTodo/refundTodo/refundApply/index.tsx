import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import {
  getCurrentInstance,
  showToast,
  showLoading,
  hideLoading,
  pxTransform,
  preload,
  getEnv,
} from '@apps/mobile-services/utils/taro'
import { View, TextArea, Text, Switch, Button, ImagePicker } from '@apps/mobile-ui'
import { ImagePickerFilesItem } from '@/types/global'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import { themeLayout } from '@/constants/theme'
import { priceFormat } from '@/utils/numberFormat'
import { limitByte } from '@/utils'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import uploadFileRequest from '@/utils/uploadFileRequest'
import { getOrderMobileCommonAfterSalePaymentFind } from '@apps/apis'
import { postAftersalesMobileReturnGoodsSaveByConsumer } from '@apps/apis'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { useIntl } from '@linkseeks/i18n'
import useAfterServiceConst from '@/packages/afterService/hooks/useAfterServiceConst'
import { isMaterialOrder } from '../../../../utils'
import { DataSourceItem } from '../components/RefundProducts'
import { Values } from '../refundPrSubmit/refundEditProducts'
import { AsProductsItemType } from '../../components/AsProducts'
import ReasonPopup from '../../components/ReasonPopup'
import AsProductsPro, { AsDataItem } from '../../components/AsProductsPro'
import RefundWay, { Values as AddressValue } from '../../../afterRecords/refundRecords/components/RefundWay'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const MAX_UPLOAD = 4
import { requestSubscribeMessage } from '@tarojs/taro'
import { IS_WEB } from '@/constants'
interface ReturnOrderInfo {
  /**
   * 供应商会员id
   */
  supplierMemberId: number
  /**
   * 供应商角色id
   */
  supplierRoleId: number
  /**
   * 供应商名称
   */
  supplierName: string
  /**
   * 售后工作流枚举key
   */
  processKey: string
  /**
   * 订单类型
   */
  orderType: number
  /**
   * 店铺id
   */
  shopId: number
  /**
   * 店铺logo
   */
  logo: string
  storeLogo: string
  storeName: string
}
interface RouteParams {
  /**
   * 数据id
   */
  orderInfo: ReturnOrderInfo
  /**
   * 基础数据
   */
  basicData: AsProductsItemType[]
}
const RefundApply: React.FC<{}> = () => {
  const params = getCurrentInstance().preloadData as RouteParams
  const { orderInfo, basicData = [] } = params
  const [allReturn, setAllReturn] = useState(true)
  const [products, setProducts] = useState<AsDataItem[]>([])
  const [returnReason, setReturnReason] = useState('')
  const [visibleReasonPopup, setVisibleReasonPopup] = useState(false)
  const [otherReason, setOtherReason] = useState('')
  const [refundAddress, setRefundAddress] = useState<any>({
    address: {
      id: 0,
      fullAddress: '',
      isDefault: false,
      phone: '',
      postalCode: 0,
      shipperName: '',
      tel: 0,
    },
    deliveryType: 0,
  })
  const [fileList, setFileList] = useState<ImagePickerFilesItem[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { safeBottomHeight } = useSafeArea()
  const intl = useIntl()
  usePageInit()
  const { OTHER_REASON_KEY } = useAfterServiceConst()
  let timer: NodeJS.Timeout | null = null
  const getPaymentInfo = () => {
    if (!basicData || !basicData.length) {
      return
    }
    const first = basicData[0]
    getOrderMobileCommonAfterSalePaymentFind({
      orderId: `${first.orderId}`,
    }).then((res) => {
      if (res.code === 1000) {
        const newProducts: AsDataItem[] = basicData.map((item) => {
          const payList = res.data
            ? res.data.map((payItem) => ({
                payId: payItem.paymentId,
                payCount: payItem.batchNo,
                payNode: payItem.payNode,
                payRatio: payItem.payRate * 100,
                payAmount: payItem.payAmount,
                payWay: payItem.payType,
                payWayName: payItem.payTypeName,
                channel: payItem.payChannel,
                channelName: payItem.payChannelName,
                refundAmount: payItem.payTime!
                  ? +(item.remaining! * (item.purchasePrice as number) * ((payItem.payRate * 100) / 100)).toFixed(2)
                  : 0,
                payTime: payItem.payTime,
                payRuleId: payItem.fundMode,
                externalState: 3,
                // 这个状态写死了，因为现在只有付款了才会出现这条支付信息
                transactionPayId: payItem.tradeNo, // 微信 或 其他第三方支付返回的 code，原路退款需要
              }))
            : []
          return {
            ...item,
            skuId: item.skuId!,
            orderRecordId: item.orderRecordId!,
            orderId: item.orderId || 0,
            orderNo: item.orderNo!,
            productId: item.productId!,
            category: item.category!,
            purchaseCount: item.purchaseCount!,
            asCount: item.remaining!,
            asAmount: isMaterialOrder(orderInfo.orderType)
              ? item.remaining! * item.purchasePrice!
              : payList && payList.length
              ? payList.reduce((pre, now) => now.refundAmount + pre, 0)
              : 0,
            purchasePrice: item.purchasePrice || 0,
            checked: true,
            payList,
          }
        })
        setProducts(newProducts)
      }
    })
  }
  useEffect(() => {
    getPaymentInfo()
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])
  const handleAllReturnChange = (value: boolean) => {
    const newDate = products.map((item) => {
      return {
        ...item,
        asCount: value ? item.remaining : item.asCount,
      }
    })
    setProducts(newDate)
    setAllReturn(value)
  }
  const handleProductsSubmit = (value: Values) => {
    setProducts(
      value.products.map(({ returnCount, refundAmount, ...rest }) => ({
        asCount: returnCount,
        asAmount: refundAmount,
        ...rest,
      })),
    )
  }
  const handleAsProductsChange = (value: AsDataItem[]) => {
    setProducts(value)
  }
  const handleJumpRefundEditProducts = () => {
    const dataSource: DataSourceItem[] = products.map(({ asCount, asAmount, ...rest }) => ({
      ...rest,
      returnCount: +asCount,
      refundAmount: asAmount,
    }))
    preload({
      ...params,
      // 防止被覆盖
      dataSource,
      orderType: orderInfo.orderType,
      onSubmit: handleProductsSubmit,
      isAdd: true,
    })
    Router.navigateTo('afterService/afterTodo/refundPrSubmit/refundEditProducts')
  }
  const handleVisibleReasonPopup = (flag?: boolean) => {
    setVisibleReasonPopup(!!flag)
  }
  const handleReasonChange = (value: string) => {
    setReturnReason(value)
  }
  const handleOtherReasonChange = (text: string) => {
    setOtherReason(text)
  }
  const handleAddressChange = (value: AddressValue) => {
    setRefundAddress(value)
  }
  const handleFileListChange = async (value: ImagePickerFilesItem[]) => {
    showLoading()
    const filtered = value.filter((item) => !fileList.find((file) => file.url === item.url))
    if (filtered.length) {
      const uploadResult = await uploadFileRequest(
        filtered.map((item) => ({
          ...item,
          path: item.url,
        })),
      )
      if (uploadResult.every((item) => item.url)) {
        setFileList([
          ...filtered.map((item, index) => ({
            ...item,
            response: uploadResult[index],
          })),
          ...fileList,
        ])
      }
      hideLoading()
      return
    }
    setFileList(value)
    hideLoading()
  }

  // 未完善的数据项
  const imperfect = products.filter((item) => !item.asCount)
  const handleSubmit = async () => {
    if (imperfect.length) {
      showToast({
        title: intl.formatMessage({
          id: 'refundTodo.refundApply.quantity.required',
          defaultMessage: '请填写退货数量信息',
        }),
        icon: 'none',
      })
      return
    }
    if (!returnReason && returnReason !== OTHER_REASON_KEY) {
      showToast({
        title: intl.formatMessage({
          id: 'refundTodo.refundApply.returnReason.required',
          defaultMessage: '请输入退货原因',
        }),
        icon: 'none',
      })
      return
    }
    if (returnReason === OTHER_REASON_KEY && !otherReason) {
      showToast({
        title: intl.formatMessage({
          id: 'refundTodo.refundApply.otherReason.required',
          defaultMessage: '请输入其他原因',
        }),
        icon: 'none',
      })
      return
    }
    // 校验字符长度
    if (returnReason === OTHER_REASON_KEY && otherReason) {
      const message = limitByte(otherReason, {
        maxByte: 1000,
      })
      if (message) {
        showToast({
          title: message,
          icon: 'none',
        })
        return
      }
    }
    if (refundAddress.deliveryType !== DELIVERY_TYPE_ENUM.NO_DELIVERY && !refundAddress.address.id) {
      showToast({
        title: intl.formatMessage({
          id: 'refundTodo.refundApply.refundAddress.required',
          defaultMessage: '请选择退货地址',
        }),
        icon: 'none',
      })
      return
    }

    if (!IS_WEB) {
      await requestSubscribeMessage({
        tmplIds: ['UKQ2Aw81Af_CyNE9HpT8apmFcR-b6IYEjzYTH8f13xo'],
        entityIds: [],
      }).catch(() => {})
    }

    setSubmitLoading(true)
    const payload = {
      returnId: 0,
      // 新增
      supplierMemberId: orderInfo.supplierMemberId,
      supplierRoleId: orderInfo.supplierRoleId,
      supplierMemberName: orderInfo.supplierName,
      applyAbstract: intl.formatMessage({
        id: `refundTodo.refundApply.applyAbstract-${getEnv()}`,
        defaultMessage: '小程序售后退货申请单',
      }),
      // 暂时写死
      returnGoodsAddress: {
        deliveryType: refundAddress.deliveryType,
        sendId: refundAddress.address.id,
        sendAddress: refundAddress.address.fullAddress,
        sendUserName: refundAddress.address.shipperName,
        sendUserTel: refundAddress.address.phone,
      },
      proofFileList: fileList.map((item) => ({
        fileName: item.response.name,
        filePath: item.response.url,
      })),
      returnGoodsList: products.map(
        ({ payList, isHasTax, taxRate, asCount, asAmount, checked, processKey, remaining, ...rest }) => ({
          isHasTax: isHasTax!,
          taxRate: taxRate!,
          returnCount: +asCount,
          returnReason: returnReason !== OTHER_REASON_KEY ? returnReason : otherReason,
          ...rest,
        }),
      ),
      taskTypeKey: orderInfo.processKey,
      orderType: orderInfo.orderType,
      returnReason: returnReason !== OTHER_REASON_KEY ? returnReason : otherReason,
      shopId: orderInfo.shopId,
      shopLogo: orderInfo.storeLogo || orderInfo.logo,
      shopName: orderInfo.storeName || orderInfo.supplierName,
    }
    postAftersalesMobileReturnGoodsSaveByConsumer(payload)
      .then((res) => {
        if (res.code === 1000) {
          showToast({
            title: intl.formatMessage({
              id: 'refundTodo.refundApply.submit.success',
              defaultMessage: '退货单提交成功',
            }),
            icon: 'none',
          })
          timer = setTimeout(() => {
            Router.navigateBack({
              delta: 2,
            })
            setSubmitLoading(false)
          }, 1000)
        }
        if (res.code !== 1000 && res.message) {
          showToast({
            title: intl.formatMessage({
              id: `${res.code}`,
              defaultMessage: res.message,
            }),
            icon: 'none',
          })
          setSubmitLoading(false)
        }
      })
      .catch(() => {
        setSubmitLoading(false)
      })
  }
  const refundAmount = products.reduce((prev, curr) => prev + curr.asAmount!, 0) || '0.00'
  return (
    <PageLayout
      renderHeader={
        <NavBar
          title={intl.formatMessage({
            id: 'refundTodo.refundApply.nav',
            defaultMessage: '退货',
          })}
        />
      }
    >
      <View className={styles['refund-apply']}>
        <AsProductsPro
          title={intl.formatMessage({
            id: 'refundTodo.refundApply.products',
            defaultMessage: '退货商品',
          })}
          afterType={1}
          orderType={orderInfo.orderType}
          dataSource={products}
          onSubmit={handleAsProductsChange}
        />
        {products.length > 1 ? (
          <MellowCard
            style={{
              marginTop: pxTransform(themeLayout['padding-xs']),
            }}
            bodyStyle={{
              padding: 0,
            }}
          >
            <Cell>
              <Cell.Item
                title={intl.formatMessage({
                  id: 'refundTodo.refundApply.allRefund',
                  defaultMessage: '全部退货',
                })}
                value={<Switch checked={allReturn} onChange={handleAllReturnChange} />}
                customHeadStyle={{
                  paddingTop: pxTransform(themeLayout['padding-s']),
                  paddingBottom: pxTransform(themeLayout['padding-s']),
                }}
              />
            </Cell>
          </MellowCard>
        ) : null}
        {!allReturn && products.length > 1 ? (
          <MellowCard
            style={{
              marginTop: pxTransform(themeLayout['padding-xs']),
            }}
            bodyStyle={{
              padding: 0,
            }}
          >
            <Cell>
              <Cell.Item
                title={intl.formatMessage({
                  id: 'refundTodo.refundApply.quantity',
                  defaultMessage: '退货数量',
                })}
                value={
                  imperfect.length
                    ? intl.formatMessage({
                        id: 'refundTodo.refundApply.quantity.placeholder',
                        defaultMessage: '请选择',
                      })
                    : intl.formatMessage({
                        id: 'refundTodo.refundApply.quantity.placeholder.ok',
                        defaultMessage: '已填写',
                      })
                }
                onPress={handleJumpRefundEditProducts}
                hasArrow
                clickable
              />
            </Cell>
          </MellowCard>
        ) : null}
        <MellowCard
          style={{
            marginTop: pxTransform(themeLayout['padding-xs']),
          }}
          bodyStyle={{
            padding: 0,
          }}
        >
          <Cell>
            <Cell.Item
              title={intl.formatMessage({
                id: 'refundTodo.refundApply.refundAmount',
                defaultMessage: '退货总额',
              })}
              value={
                <Text className={styles['refund-apply-refundAmount']}>{`${intl.formatMessage({
                  id: 'currency',
                  defaultMessage: '￥',
                })} ${priceFormat(refundAmount)}`}</Text>
              }
            />
          </Cell>
        </MellowCard>
        <MellowCard
          style={{
            marginTop: pxTransform(themeLayout['padding-xs']),
          }}
          bodyStyle={{
            padding: 0,
          }}
        >
          <Cell>
            <Cell.Item
              title={intl.formatMessage({
                id: 'refundTodo.refundApply.returnReason',
                defaultMessage: '退货原因',
              })}
              value={
                !returnReason
                  ? intl.formatMessage({
                      id: 'refundTodo.refundApply.returnReason.placeholder.sub',
                      defaultMessage: '请选择',
                    })
                  : returnReason
              }
              onPress={() => handleVisibleReasonPopup(true)}
              label={
                returnReason === OTHER_REASON_KEY ? (
                  <View onClick={(e) => e.stopPropagation()}>
                    <TextArea
                      count={false}
                      className={styles['refund-apply-reason']}
                      placeholderClass={styles['refund-apply-placeholderClass']}
                      placeholder={intl.formatMessage({
                        id: 'refundTodo.refundApply.returnReason.placeholder',
                        defaultMessage: '点击输入其他原因',
                      })}
                      value={otherReason}
                      onChange={handleOtherReasonChange}
                    />
                  </View>
                ) : null
              }
              hasArrow
              clickable
            />
          </Cell>
        </MellowCard>
        <RefundWay
          title={intl.formatMessage({
            id: 'refundTodo.refundApply.refundAddress',
            defaultMessage: '退货方式',
          })}
          customStyle={{
            marginTop: pxTransform(themeLayout['padding-xs']),
          }}
          value={refundAddress}
          onChange={handleAddressChange}
          isDefaultAddress
          isEdit
        />
        <MellowCard
          style={{
            marginTop: pxTransform(themeLayout['padding-xs']),
          }}
          bodyStyle={{
            padding: 0,
          }}
        >
          <Cell>
            <Cell.Item
              title={intl.formatMessage({
                id: 'refundTodo.refundApply.fileList',
                defaultMessage: '附件',
              })}
              label={
                <>
                  <ImagePicker
                    files={fileList}
                    count={MAX_UPLOAD - fileList.length}
                    showAddBtn={fileList.length < MAX_UPLOAD}
                    onChange={handleFileListChange}
                    multiple
                    max={MAX_UPLOAD}
                  />
                </>
              }
            />
          </Cell>
        </MellowCard>
        <ReasonPopup
          afterType={1}
          visible={visibleReasonPopup}
          onClose={() => handleVisibleReasonPopup(false)}
          onChange={handleReasonChange}
        />
        <View
          className={styles['refund-apply-actions']}
          style={{
            paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
          }}
        >
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={submitLoading}
            customStyle={{
              borderRadius: pxTransform(8),
            }}
          >
            {intl.formatMessage({
              id: 'refundTodo.refundApply.submit',
              defaultMessage: '提交退货单',
            })}
          </Button>
        </View>
      </View>
    </PageLayout>
  )
}
export default GlobalWrapper(RefundApply)
