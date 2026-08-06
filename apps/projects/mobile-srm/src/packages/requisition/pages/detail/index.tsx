import React, { useEffect, useState, useMemo } from 'react'
import {
  getCurrentInstance,
  useRouter,
  preload,
  setNavigationBarTitle,
  setClipboardData,
} from '@apps/mobile-services/utils/taro'
import { View, ScrollView, Text, Icons, Toast } from '@apps/mobile-ui'
import Router from '@/utils/router'
import cx from 'classnames'
import { useSafeArea } from '@apps/mobile-services'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import MellowCard from '@/components/MellowCard'
import CollapseCard from '@/components/CollapseCard'
import Cell from '@/components/Cell'
import { dateFormat } from '@/utils/date'
import { priceFormat } from '@/utils/numberFormat'
import {
  getPurchaseRequisitionSrmDetail,
  GetPurchaseRequisitionSrmDetailResponse,
  postPurchaseRequisitionSrmSubmit,
  postPurchaseRequisitionSrmSubmitAudit,
} from '@apps/apis'
import { OPREATION_MAP } from '../constants'
import RequisitionProduct from '../../components/requisitionProduct'
import UploadItem from '../../components/uploadItem'
import MaterialPopup from '../../components/materialPopup'
import styles from './index.module.scss'

const RequisitionDetail: React.FC = () => {
  const params = getCurrentInstance().preloadData as any
  const { id, pageStatus, refresh, isAudit = true } = params
  const { safeBottomHeight } = useSafeArea()
  const [dataSoucre, setDataSoucre] = useState<GetPurchaseRequisitionSrmDetailResponse>()
  const [showMore, setShowMore] = useState<boolean>(false)
  const [materialVisible, setMaterialVisible] = useState<boolean>(false)
  const [materialData, setMaterialData] = useState<any>({})
  const [barTitle, setBarTitle] = useState<string>('')

  /* 头部标题 */
  const scrollView = (evt) => {
    const contentOffsetY: number = evt.detail.scrollTop
    if (Math.round(contentOffsetY) >= 45) {
      setNavigationBarTitle({ title: dataSoucre?.innerStatusName || '' })
      setBarTitle(dataSoucre?.innerStatusName || '')
    } else {
      setNavigationBarTitle({ title: '' })
      setBarTitle('')
    }
  }

  const clipboard = (dataText: any) => {
    setClipboardData({
      data: dataText,
      success: () => {
        Toast.show({ title: '内容复制成功', icon: 'none' })
      },
    })
  }

  const getDetailData = () => {
    getPurchaseRequisitionSrmDetail({ id } as any).then((res) => {
      if (res.code !== 1000) {
        Toast.show({ title: res.message, icon: 'none' })
        return
      }
      setDataSoucre(res.data)
    })
  }

  useEffect(() => {
    getDetailData()
  }, [])

  const _submitBtnText = useMemo(() => {
    switch (dataSoucre?.innerStatus) {
      case 1:
        return isAudit ? '提交审核' : '修改请购单'
      case 2:
        return '审核通过'
      case 4:
        return '审核通过'
      case 6:
        return '提交'
      case 7:
        if (Number(dataSoucre?.product?.transferQuantity) === 0) {
          return '取消'
        } else if (
          Number(dataSoucre?.product?.transferQuantity) !== 0 &&
          Number(dataSoucre?.product?.transferQuantity) < Number(dataSoucre?.product?.quantity)
        ) {
          return '中止'
        }
        break
    }
  }, [dataSoucre])

  const _operation = useMemo(() => {
    switch (dataSoucre?.innerStatus) {
      case 2:
        return OPREATION_MAP.audit1
      case 4:
        return OPREATION_MAP.audit2
      case 7:
        if (Number(dataSoucre?.product?.transferQuantity) === 0) {
          return OPREATION_MAP.cancel
        } else if (
          Number(dataSoucre?.product?.transferQuantity) !== 0 &&
          Number(dataSoucre?.product?.transferQuantity) < Number(dataSoucre?.product?.quantity)
        ) {
          return OPREATION_MAP.pause
        }
        break
    }
  }, [dataSoucre])

  const _returnTitle = (flag?: boolean) => {
    switch (dataSoucre?.innerStatus) {
      case 2:
      case 4:
        return flag ? '审核不通过原因' : '审核通过原因'
      case 7:
        if (Number(dataSoucre?.product?.transferQuantity) === 0) {
          return '取消原因'
        } else if (
          Number(dataSoucre?.product?.transferQuantity) !== 0 &&
          Number(dataSoucre?.product?.transferQuantity) < Number(dataSoucre?.product?.quantity)
        ) {
          return '中止原因'
        }
        break
    }
  }

  const _returnReasonPlaceholder = (flag?: boolean) => {
    switch (dataSoucre?.innerStatus) {
      case 2:
      case 4:
        return flag ? '点击输入不通过的原因' : '点击输入通过的原因'
      case 7:
        if (Number(dataSoucre?.product?.transferQuantity) === 0) {
          return '点击输入取消的原因'
        } else if (
          Number(dataSoucre?.product?.transferQuantity) !== 0 &&
          Number(dataSoucre?.product?.transferQuantity) < Number(dataSoucre?.product?.quantity)
        ) {
          return '点击输入中止的原因'
        }
        break
    }
  }

  const _productList = useMemo(() => {
    const _list = dataSoucre?.product?.products
    if (_list) {
      let _toList = showMore ? dataSoucre?.product?.products : []
      if (!showMore) {
        for (let i = 0; i < 3; i++) {
          if (_list[i]) {
            _toList.push(_list[i])
          } else {
            break
          }
        }
      }
      return _toList
    }
    return []
  }, [dataSoucre, showMore])

  const handleStatusLayout = () => {
    if (!dataSoucre?.innerSteps) return
    const index = dataSoucre?.innerSteps?.findIndex((item) => item.step == dataSoucre?.currentInnerStep)
    const list = dataSoucre?.innerSteps?.map((item, _index) => ({
      ...item,
      isExecute: dataSoucre?.innerStatus == 7 || item.step < dataSoucre?.currentInnerStep,
      lineFlag: dataSoucre?.innerStatus == 7 || _index < index - 1,
    }))
    preload({
      ...params,
      interiorRequisitionFormStateResponses: list,
      interiorInquiryListLogResponses: dataSoucre?.innerHistories,
    })
    Router.navigateTo('root/statusLayout')
  }

  const handleAuditLayout = (flag?: boolean) => {
    if (dataSoucre?.innerStatus === 1) {
      const type = isAudit ? 'submit' : 'edit'
      onHandleData(type)
    } else if (dataSoucre?.innerStatus === 6) {
      const _fn = postPurchaseRequisitionSrmSubmit
      _fn({ id: dataSoucre?.requisitionId }).then((res) => {
        if (res.code === 1000) {
          Router.navigateBack({
            success: () => {
              refresh()
            },
          })
        }
      })
    } else {
      const _params: any = {
        id: dataSoucre?.requisitionId,
        reasonPlacehoder: _returnReasonPlaceholder(flag),
        title: _returnTitle(flag),
        operation: _operation,
        refresh,
        value: (dataSoucre?.innerStatus == 2 || dataSoucre?.innerStatus == 4) && !flag ? '同意' : '',
      }
      ;(dataSoucre?.innerStatus === 2 || dataSoucre?.innerStatus === 4) && (_params.agree = flag ? 0 : 1)
      preload(_params)
      Router.navigateTo('requisition/requisitionAudit')
    }
  }

  const handleShowMore = () => {
    setShowMore(!showMore)
  }

  const handleShowMaterial = (item: any) => {
    setMaterialData(item)
    setMaterialVisible(true)
  }

  const onHandleData = (type: string) => {
    if (type == 'edit') {
      preload({
        refresh: () => {
          getDetailData()
        },
      })
      Router.navigateTo('requisition/requisitionCreate', { requisitionId: id })
    } else {
      postPurchaseRequisitionSrmSubmitAudit({ id: dataSoucre?.requisitionId }).then((res) => {
        if (res.code === 1000) {
          Toast.show({ title: res.message, icon: 'none' })
          setTimeout(() => {
            Router.navigateBack({
              success: () => {
                refresh()
              },
            })
          }, 1000)
        }
      })
    }
  }

  return (
    <View className={styles['container']}>
      <PageLayout
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        renderHeader={
          <>
            <NavBar title={barTitle} titleColor="#fff" customStyle={'backgroundColor: #00A98F;'} backIconColor="#fff" />
          </>
        }
      >
        <View
          className={cx(
            styles['scrollView-outer'],
            !(
              pageStatus === 'OPERATION' &&
              Number(dataSoucre?.product?.transferQuantity) < Number(dataSoucre?.product?.quantity)
            )
              ? styles['paddingBottomHide']
              : '',
          )}
        >
          <ScrollView onScroll={scrollView} className={styles['scrollView']}>
            <View className={styles['scrollView-box']}>
              <View className={styles['scrollView-box-status']}>
                <View className={styles['scrollView-box-status-line']} onClick={() => handleStatusLayout()}>
                  <Text className={styles['scrollView-box-status-line-text']}>{dataSoucre?.innerStatusName}</Text>
                  {dataSoucre?.innerSteps && <Icons name="ChevronRight" size={14} color="#FFFFFF" />}
                </View>
              </View>
              {/* 内容 */}
              <View className={styles['scrollView-box-content']}>
                <View className={styles['productInfo']}>
                  <View className={styles['productInfoTitle']}>
                    <View className={styles['docLine']} />
                    <Text className={styles['productName']}>{dataSoucre?.digest}</Text>
                  </View>
                  <View className={styles['productInfoNo']}>
                    <Text className={styles['productNo']}>{dataSoucre?.requisitionNo}</Text>
                    <View>
                      <Text onClick={() => clipboard(dataSoucre?.requisitionNo)} className={styles['textCopyStyle']}>
                        复制
                      </Text>
                    </View>
                  </View>
                </View>
                {/* 基本信息 */}
                <CollapseCard title="基本信息" className={styles['customStyle']} customContentStyle={{ padding: 0 }}>
                  <Cell>
                    <Cell.Item
                      title="请购单号"
                      value={
                        <View className={styles['customStyle-box']}>
                          <Text className={styles['customStyle-value']}>{dataSoucre?.requisitionNo}</Text>
                          <Icons
                            className={styles.copy_icon}
                            name="Copy"
                            size={12}
                            color="#91959B"
                            onClick={() => clipboard(dataSoucre?.requisitionNo)}
                          />
                        </View>
                      }
                    />
                    <Cell.Item title="请购部门" value={dataSoucre?.department} />
                    <Cell.Item title="请购人" value={dataSoucre?.requisitioner} />
                    <Cell.Item title="请购用途" value={dataSoucre?.purpose} />
                    <Cell.Item title="供应会员" value={dataSoucre?.vendorMemberName} />
                    <Cell.Item title="创建人" value={dataSoucre?.creator} />
                    <Cell.Item title="单据时间" value={dataSoucre?.createTime} />
                  </Cell>
                </CollapseCard>
                {/* 请购物料 */}
                <CollapseCard title="请购物料" className={styles['customStyle']} customContentStyle={{ padding: 0 }}>
                  {_productList.map((item, index) => (
                    <RequisitionProduct data={item} key={item.productId * index} onClick={handleShowMaterial} />
                  ))}
                  {dataSoucre?.product?.products && dataSoucre?.product?.products.length > 3 && (
                    <View className={styles['productItem-showMore']} onClick={handleShowMore}>
                      <Text className={styles['productItem-showMore-text']}>{showMore ? '收起' : '展开更多'}</Text>
                    </View>
                  )}
                  <View className={styles.total}>
                    <Text className={styles['product-row']}>
                      预估总金额：
                      <Text className={styles['product-row-amount']}>¥{dataSoucre?.product?.productAmount}</Text>
                    </Text>
                    <Text className={styles['product-row']}>
                      总计数量：<Text className={styles.product_total_amount}>{dataSoucre?.product?.quantity}</Text>
                    </Text>
                  </View>
                </CollapseCard>
                {/* 送货/交期 */}
                <CollapseCard title="送货/交期" className={styles['customStyle']} customContentStyle={{ padding: 0 }}>
                  <Cell>
                    <Cell.Item title="预交时间" value={dataSoucre?.advanceDeliveryDate} />
                    <Cell.Item title="配送方式" value={dataSoucre?.deliveryMethodName} />
                    {dataSoucre?.deliveryMethod !== 3 && (
                      <Cell.Item title="客户配送方式" value={dataSoucre?.deliveryTypeName} />
                    )}
                    {dataSoucre?.deliveryType === 1 && (
                      <Cell.Item title="送货地址" value={dataSoucre?.deliveryAddress} />
                    )}
                  </Cell>
                </CollapseCard>
                {/* 附件 */}
                <CollapseCard title="附件" className={styles['customStyle']} customContentStyle={{ padding: 0 }}>
                  {dataSoucre?.attachments &&
                    dataSoucre?.attachments.map((item, index) => <UploadItem data={item} key={index * 1} />)}
                </CollapseCard>
              </View>
            </View>
          </ScrollView>
          {pageStatus === 'OPERATION' &&
            Number(dataSoucre?.product?.transferQuantity) < Number(dataSoucre?.product?.quantity) && (
              <View
                className={styles['scrollView-outer-fixButton']}
                style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
              >
                <View className={styles['scrollView-outer-fixButton-btnBox']}>
                  {(dataSoucre?.innerStatus === 2 || dataSoucre?.innerStatus === 4) && (
                    <View
                      className={cx(
                        styles['scrollView-outer-fixButton-btnBox-btn'],
                        styles['scrollView-outer-fixButton-btnBox-btn__cancel'],
                      )}
                      onClick={() => {
                        handleAuditLayout(true)
                      }}
                    >
                      <Text
                        className={cx(
                          styles['scrollView-outer-fixButton-btnBox-btn-text'],
                          styles['scrollView-outer-fixButton-btnBox-btn__cancel-text'],
                        )}
                      >
                        审核不通过
                      </Text>
                    </View>
                  )}
                  <View
                    className={styles['scrollView-outer-fixButton-btnBox-btn']}
                    onClick={() => {
                      handleAuditLayout()
                    }}
                  >
                    <Text className={styles['scrollView-outer-fixButton-btnBox-btn-text']}>{_submitBtnText}</Text>
                  </View>
                </View>
              </View>
            )}
        </View>
      </PageLayout>
      <MaterialPopup
        visible={materialVisible}
        onClose={() => {
          setMaterialVisible(false)
        }}
        materialData={materialData}
      />
    </View>
  )
}
export default RequisitionDetail
