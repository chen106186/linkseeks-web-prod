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
import { View, TextArea, Switch, Button, ImagePicker } from '@apps/mobile-ui'
import { ImagePickerFilesItem } from '@/types/global'
import { useIntl } from '@linkseeks/i18n'
import { themeLayout } from '@/constants/theme'
import { limitByte } from '@/utils'
import Router from '@/utils/router'
import { useSafeArea } from '@apps/mobile-services'
import uploadFileRequest from '@/utils/uploadFileRequest'
import { postAftersalesMobileRepairGoodsSaveByConsumer } from '@apps/apis'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import useAfterServiceConst from '@/packages/afterService/hooks/useAfterServiceConst'
import { Values } from '../repairPrSubmit/repairEditProducts'
import { DataSourceItem } from '../components/RepairProducts'
import { AsProductsItemType } from '../../components/AsProducts'
import ReasonPopup from '../../components/ReasonPopup'
import AsProductsPro, { AsDataItem } from '../../components/AsProductsPro'
import RepairAddress, { AddressValue } from '../../../afterRecords/repairRecords/components/RepairAddress'
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
const RepairApply: React.FC<{}> = () => {
  const params = getCurrentInstance().preloadData as RouteParams
  const { orderInfo, basicData = [] } = params
  const [allReturn, setAllReturn] = useState(true)
  const [products, setProducts] = useState<AsDataItem[]>(
    basicData.map((item) => ({
      ...item,
      orderRecordId: item.orderRecordId!,
      orderId: item.orderId || 0,
      orderNo: item.orderNo!,
      productId: item.productId!,
      category: item.category!,
      purchaseCount: item.purchaseCount!,
      asCount: item.remaining,
      asAmount: 0,
      purchasePrice: item.purchasePrice || 0,
      checked: true,
    })),
  )
  const [returnReason, setReturnReason] = useState('')
  const [visibleReasonPopup, setVisibleReasonPopup] = useState(false)
  const [otherReason, setOtherReason] = useState('')
  const [repairAddress, setRepairAddress] = useState<AddressValue>({
    id: 0,
    fullAddress: '',
    isDefault: false,
    phone: '',
    postalCode: 0,
    receiverName: '',
    tel: 0,
  })
  const [fileList, setFileList] = useState<ImagePickerFilesItem[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { safeBottomHeight } = useSafeArea()
  const intl = useIntl()
  usePageInit()
  const { OTHER_REASON_KEY } = useAfterServiceConst()
  let timer: NodeJS.Timeout | null = null
  useEffect(() => {
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
      value.products.map(({ repairCount, ...rest }) => ({
        asCount: repairCount,
        ...rest,
      })),
    )
  }
  const handleAsProductsChange = (value: AsDataItem[]) => {
    setProducts(value)
  }
  const handleJumpRepairEditProducts = () => {
    const dataSource: DataSourceItem[] = products.map(({ asCount, ...rest }) => ({
      ...rest,
      repairCount: +asCount,
    }))
    preload({
      ...params,
      // 防止被覆盖
      dataSource,
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
    setRepairAddress(value)
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
          id: 'repairTodo.repairApply.quantity.required',
          defaultMessage: '请填写维修数量信息',
        }),
        icon: 'none',
      })
      return
    }
    if (!returnReason && returnReason !== OTHER_REASON_KEY) {
      showToast({
        title: intl.formatMessage({
          id: 'repairTodo.repairApply.returnReason.required',
          defaultMessage: '请输入维修原因',
        }),
        icon: 'none',
      })
      return
    }
    if (returnReason === OTHER_REASON_KEY && !otherReason) {
      showToast({
        title: intl.formatMessage({
          id: 'repairTodo.repairApply.otherReason.required',
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
    if (!repairAddress.id) {
      showToast({
        title: intl.formatMessage({
          id: 'repairTodo.repairApply.repairAddress.required',
          defaultMessage: '请选择维修地址',
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
      repairId: 0,
      // 新增
      supplierMemberId: orderInfo.supplierMemberId,
      supplierRoleId: orderInfo.supplierRoleId,
      supplierName: orderInfo.supplierName,
      applyAbstract: intl.formatMessage({
        id: `repairTodo.repairApply.applyAbstract-${getEnv()}`,
        defaultMessage: '小程序售后维修申请单',
      }),
      repairAddress: JSON.stringify(repairAddress),
      proofFileList: fileList.map((item) => ({
        fileName: item.response.name,
        filePath: item.response.url,
      })),
      repairGoodsList: products.map(({ isHasTax, taxRate, asCount, asAmount, remaining, ...rest }) => ({
        isHasTax: isHasTax!,
        taxRate: taxRate!,
        repairCount: +asCount,
        ...rest,
      })),
      orderType: orderInfo.orderType,
      repaireReason: returnReason !== OTHER_REASON_KEY ? returnReason : otherReason,
      shopId: orderInfo.shopId,
      shopLogo: orderInfo.storeLogo || orderInfo.logo,
      shopName: orderInfo.storeName || orderInfo.supplierName,
    }
    postAftersalesMobileRepairGoodsSaveByConsumer(payload)
      .then((res) => {
        if (res.code === 1000) {
          showToast({
            title: intl.formatMessage({
              id: 'repairTodo.repairApply.submit.success',
              defaultMessage: '维修单提交成功',
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
            id: 'repairTodo.repairApply.nav',
            defaultMessage: '维修',
          })}
        />
      }
    >
      <View className={styles['repair-apply']}>
        <AsProductsPro
          title={intl.formatMessage({
            id: 'repairTodo.repairApply.products',
            defaultMessage: '维修商品',
          })}
          afterType={3}
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
                  id: 'repairTodo.repairApply.all',
                  defaultMessage: '全部维修',
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
                  id: 'repairTodo.repairApply.quantity',
                  defaultMessage: '维修数量',
                })}
                value={
                  imperfect.length
                    ? intl.formatMessage({
                        id: 'repairTodo.repairApply.quantity.placeholder',
                        defaultMessage: '请选择',
                      })
                    : intl.formatMessage({
                        id: 'repairTodo.repairApply.quantity.ok',
                        defaultMessage: '已填写',
                      })
                }
                onPress={handleJumpRepairEditProducts}
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
                id: 'repairTodo.repairApply.returnReason',
                defaultMessage: '维修原因',
              })}
              value={
                !returnReason
                  ? intl.formatMessage({
                      id: 'repairTodo.repairApply.returnReason.placeholder',
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
                      className={styles['repair-apply-reason']}
                      placeholderClass={styles['repair-apply-placeholderClass']}
                      placeholder={intl.formatMessage({
                        id: 'repairTodo.repairApply.otherReason.placeholder',
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
        <RepairAddress
          customStyle={{
            marginTop: pxTransform(themeLayout['margin-xs']),
          }}
          address={repairAddress}
          onChange={handleAddressChange}
          showTitle={false}
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
                id: 'repairTodo.repairApply.fileList',
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
          afterType={3}
          visible={visibleReasonPopup}
          onClose={() => handleVisibleReasonPopup(false)}
          onChange={handleReasonChange}
        />
        <View
          className={styles['repair-apply-actions']}
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
              id: 'repairTodo.repairApply.submit',
              defaultMessage: '提交维修单',
            })}
          </Button>
        </View>
      </View>
    </PageLayout>
  )
}
export default GlobalWrapper(RepairApply)
