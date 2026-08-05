import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-12 16:23:24
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-26 15:19:24
 * @Description: 新增换货申请单
 */
import React, { useState, useEffect } from 'react'
import {
  getCurrentInstance,
  preload,
  showToast,
  showLoading,
  hideLoading,
  pxTransform,
  getEnv,
} from '@apps/mobile-services/utils/taro'
import { View, TextArea, Switch, Button, ImagePicker } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import { ImagePickerFilesItem } from '@/types/global'
import { limitByte } from '@/utils'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import uploadFileRequest from '@/utils/uploadFileRequest'
import { postAftersalesMobileReplaceGoodsSaveByConsumer } from '@apps/apis'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import useAfterServiceConst from '@/packages/afterService/hooks/useAfterServiceConst'
import ReasonPopup from '../../../afterTodo/components/ReasonPopup'
import RefundWay, { Values as AddressValue } from '../../../afterRecords/refundRecords/components/RefundWay'
import ExchangeAddress, {
  Values as ExchangeAddressValue,
} from '../../../afterRecords/exchangeRecords/components/ExchangeAddress'
import { AsProductsItemType } from '../../components/AsProducts'
import AsProductsPro, { AsDataItem } from '../../components/AsProductsPro'
import { DataSourceItem } from '../components/ExchangeProducts'
import { Values } from '../exchangePrSubmit/exchangeEditProducts'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { useMobileIntl } from '@apps/locales'
const MAX_UPLOAD = 4
import { requestSubscribeMessage } from '@tarojs/taro'
import { IS_WEB } from '@/constants'
interface OrderInfo {
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
  orderInfo: OrderInfo
  /**
   * 基础数据
   */
  basicData: AsProductsItemType[]
}
const ExchangeApply: React.FC = () => {
  const params = getCurrentInstance().preloadData as RouteParams
  const { orderInfo, basicData = [] } = params
  const [allReturn, setAllReturn] = useState(true)
  const [products, setProducts] = useState<AsDataItem[]>(
    basicData.map((item) => ({
      ...item,
      skuId: item.skuId!,
      orderRecordId: item.orderRecordId!,
      orderId: item.orderId || 0,
      orderNo: item.orderNo!,
      productId: item.productId!,
      category: item.category!,
      purchaseCount: item.purchaseCount!,
      asCount: item.remaining!,
      purchasePrice: item.purchasePrice || 0,
      checked: true,
    })),
  )
  const [returnReason, setReturnReason] = useState('')
  const [visibleReasonPopup, setVisibleReasonPopup] = useState(false)
  const [otherReason, setOtherReason] = useState('')
  const [refundAddress, setRefundAddress] = useState<AddressValue>({
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
  const [exchangeAddress, setExchangeAddress] = useState<ExchangeAddressValue>({
    address: {
      id: 0,
      fullAddress: '',
      isDefault: false,
      phone: '',
      postalCode: 0,
      receiverName: '',
      tel: 0,
    },
  })
  const [fileList, setFileList] = useState<ImagePickerFilesItem[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { safeBottomHeight } = useSafeArea()
  const { OTHER_REASON_KEY } = useAfterServiceConst()
  const translate = useMobileIntl()
  const intl = useIntl()
  usePageInit()
  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout | null = null
  useEffect(
    () => () => {
      if (timer) {
        clearTimeout(timer)
      }
    },
    [],
  )
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
      value.products.map(({ replaceCount, ...rest }) => ({
        asCount: replaceCount,
        ...rest,
      })),
    )
  }
  const handleAsProductsChange = (value: AsDataItem[]) => {
    setProducts(value)
  }
  const handleJumpExchangeEditProducts = () => {
    const dataSource: DataSourceItem[] = products.map(({ asCount, ...rest }) => ({
      ...rest,
      replaceCount: +asCount,
      orderType: orderInfo.orderType,
    }))
    preload({
      ...params,
      // 防止被覆盖
      dataSource,
      onSubmit: handleProductsSubmit,
      isAdd: true,
    })
    Router.navigateTo('afterService/afterTodo/exchangePrSubmit/exchangeEditProducts')
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
  const handleExchangeAddressChange = (value: ExchangeAddressValue) => {
    setExchangeAddress(value)
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
      if (uploadResult.every((item) => item.status === 'done')) {
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
          id: 'exchangeTodo.exchangeApply.quantity.required',
          defaultMessage: '请填写换货数量信息',
        }),
        icon: 'none',
      })
      return
    }
    if (!returnReason && returnReason !== OTHER_REASON_KEY) {
      showToast({
        title: translate('mobile.resource.order.qingxuanzehuanhuoyuanyin'),
        icon: 'none',
      })
      return
    }
    if (returnReason === OTHER_REASON_KEY && !otherReason) {
      showToast({
        title: intl.formatMessage({
          id: 'exchangeTodo.exchangeApply.reason.other.required',
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
        title: translate('mobile.resource.order.qingxuanzehuanhuofangshi'),
        icon: 'none',
      })
      return
    }
    if (!exchangeAddress.address.id) {
      showToast({
        title: translate('mobile.resource.order.qingxuanzehuanhuoshouhuodizhi'),
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
      replaceId: 0,
      // 新增
      supplierMemberId: orderInfo.supplierMemberId,
      supplierRoleId: orderInfo.supplierRoleId,
      supplierMemberName: orderInfo.supplierName,
      applyAbstract: intl.formatMessage({
        id: `exchangeTodo.exchangeApply.applyAbstract-${getEnv()}`,
        defaultMessage: '小程序售后换货申请单',
      }),
      replaceGoodsAddress: {
        receiveId: exchangeAddress.address.id,
        receiveAddress: exchangeAddress.address.fullAddress,
        receiveUserName: exchangeAddress.address.receiverName,
        receiveUserTel: exchangeAddress.address.phone,
      },
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
      replaceGoodsList: products.map(({ isHasTax, taxRate, asCount, asAmount, remaining, ...rest }) => ({
        ...rest,
        isHasTax: isHasTax!,
        taxRate: taxRate!,
        replaceCount: +asCount,
        isNeedReturn: 1,
        purchaseAmount: +(+asCount * rest.purchasePrice).toFixed(2), // 最后提交计算
      })),
      taskTypeKey: orderInfo.processKey,
      orderType: orderInfo.orderType,
      replaceReason: returnReason !== OTHER_REASON_KEY ? returnReason : otherReason,
      shopId: orderInfo.shopId,
      shopLogo: orderInfo.storeLogo || orderInfo.logo,
      shopName: orderInfo.storeName || orderInfo.supplierName,
    }
    postAftersalesMobileReplaceGoodsSaveByConsumer(payload)
      .then((res) => {
        if (res.code === 1000) {
          showToast({
            title: intl.formatMessage({
              id: 'exchangeTodo.exchangeApply.submit.success',
              defaultMessage: '换货单提交成功',
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
  return (
    <PageLayout
      renderHeader={
        <NavBar
          title={intl.formatMessage({
            id: 'exchangeTodo.exchangeApply.nav',
            defaultMessage: '换货',
          })}
        />
      }
    >
      <View className={styles['exchange-apply']}>
        {/* <AsProducts
          title="换货商品"
          dataSource={products}
         /> */}
        <AsProductsPro
          title={intl.formatMessage({
            id: 'exchangeTodo.exchangeApply.products',
            defaultMessage: '换货商品',
          })}
          afterType={2}
          orderType={orderInfo.orderType}
          dataSource={products}
          onSubmit={handleAsProductsChange}
        />
        {products.length > 1 ? (
          <MellowCard
            style={{
              marginTop: pxTransform(themeLayout['margin-xs']),
            }}
            bodyStyle={{
              padding: 0,
            }}
          >
            <Cell>
              <Cell.Item
                title={intl.formatMessage({
                  id: 'exchangeTodo.exchangeApply.all',
                  defaultMessage: '全部换货',
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
              marginTop: pxTransform(themeLayout['margin-xs']),
            }}
            bodyStyle={{
              padding: 0,
            }}
          >
            <Cell>
              <Cell.Item
                title={intl.formatMessage({
                  id: 'exchangeTodo.exchangeApply.quantity',
                  defaultMessage: '换货数量',
                })}
                value={
                  imperfect.length
                    ? intl.formatMessage({
                        id: 'exchangeTodo.exchangeApply.quantity.required.sub',
                        defaultMessage: '请选择',
                      })
                    : intl.formatMessage({
                        id: 'exchangeTodo.exchangeApply.quantity.placeholder',
                        defaultMessage: '已填写',
                      })
                }
                onPress={handleJumpExchangeEditProducts}
                hasArrow
                clickable
              />
            </Cell>
          </MellowCard>
        ) : null}
        <MellowCard
          style={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
          bodyStyle={{
            padding: 0,
          }}
        >
          <Cell>
            <Cell.Item
              title={intl.formatMessage({
                id: 'exchangeTodo.exchangeApply.reason',
                defaultMessage: '换货原因',
              })}
              value={
                !returnReason
                  ? intl.formatMessage({
                      id: 'exchangeTodo.exchangeApply.reason.required.sub',
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
                      className={styles['exchange-apply-reason']}
                      placeholderClass={styles['exchange-apply-placeholderClass']}
                      placeholder={intl.formatMessage({
                        id: 'exchangeTodo.exchangeApply.reason.other.placeholder',
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
            id: 'exchangeTodo.exchangeApply.refundAddress',
            defaultMessage: '换货方式',
          })}
          customStyle={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
          value={refundAddress}
          onChange={handleAddressChange}
          isDefaultAddress
          isEdit
        />
        <ExchangeAddress
          customStyle={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
          value={exchangeAddress}
          onChange={handleExchangeAddressChange}
          showTitle={false}
          isEdit
        />
        <MellowCard
          style={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
          bodyStyle={{
            padding: 0,
          }}
        >
          <Cell>
            <Cell.Item
              title={intl.formatMessage({
                id: 'exchangeTodo.exchangeApply.fileList',
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
          afterType={2}
          visible={visibleReasonPopup}
          onClose={() => handleVisibleReasonPopup(false)}
          onChange={handleReasonChange}
        />
        <View
          className={styles['exchange-apply-actions']}
          style={{
            paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : themeLayout['padding-xs'],
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
              id: 'exchangeTodo.exchangeApply.submit',
              defaultMessage: '提交换货单',
            })}
          </Button>
        </View>
      </View>
    </PageLayout>
  )
}
export default GlobalWrapper(ExchangeApply)
