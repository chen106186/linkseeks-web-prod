import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { IS_WEB } from '@/constants'
import { View, Text, Toast, Image, ScrollView, Tabs, Icons, CountDown, Modal } from '@apps/mobile-ui'
import Search from '@/components/Search'
import Header from '@/components/NavBar'
import { checkMore } from '@/utils'
import {
  pxTransform,
  getCurrentInstance,
  hideLoading,
  useDidShow,
  previewImage,
  preload,
} from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import { THEME_COLORS } from '@/constants/theme'
import { useIntl } from '@linkseeks/i18n'
import {
  getOrderMobileBuyerPage,
  getOrderMobileBuyerDetail,
  getOrderMobileBuyerPageItems,
  getOrderMobileBuyerValidateDeliveryPage,
  getOrderMobileBuyerValidateGradeOnePage,
  getOrderMobileBuyerValidateGradeTwoPage,
  getOrderMobileBuyerValidatePayPage,
  getOrderMobileBuyerValidateReceivePage,
  getOrderMobileBuyerValidateSubmitPage,
  getOrderMobileBuyerValidateFinishPage,
  getOrderMobileBuyerValidateCancelPage,
  postOrderMobileBuyerPageDelete,
} from '@apps/apis'
import { postMarketingMobileActivityOrderOrderListGroupPurchase } from '@apps/apis'
import { postProductMobileShopPurchaseSavePurchaseBatch } from '@apps/apis'
import Loading from '@/components/Loading'
import { SHOP_PROPERTY } from '@/constants/const/shop'
import FilterModal from './components/FilterModal'
import CommodityCard from './components/CommodityCard'
import CancelOrder from '../../components/mycommodityDetails/CancelOrder'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'
import { useSafeArea } from '@apps/mobile-services'
const choice = getOssUrlPath('/miniprogram/assets/images/choice.png')
const PAGE_SIZE = 8

const MyCommodityList: React.FC = () => {
  const intl = useIntl()
  const { Index }: any = getCurrentInstance()?.router?.params
  const [activeKey, setActiveKey] = useState<number>(isNaN(+Index) ? 0 : +Index)
  const [keyword, setKeyword] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false) // 显示模态框
  const [hasMore, setHasMore] = useState(true)
  const [cancelOrderVisible, setCancelOrderVisible] = useState(false)
  const [searchCriteria, setSearchCriteria] = useState<any>({})
  const [orderItem, setOrderItem] = useState({})
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<any>([]) // 数据集合
  const [toggle, setToggle] = useState<boolean>(false)
  const [deleteItem, setDeleteItem] = useState<any>()
  // 物流选择弹窗相关状态
  const [showLogisticsModal, setShowLogisticsModal] = useState(false)
  const [logisticsList, setLogisticsList] = useState<any[]>([])
  const [currentOrderData, setCurrentOrderData] = useState<any>({})
  const [currentActionType, setCurrentActionType] = useState<'certificate' | 'trace' | ''>('')
  const isPreviewingRef = useRef(false) // 标记是否正在预览图片，避免触发onShow刷新
  const { safeBottomHeight } = useSafeArea()
  const {
    userStore: { shopAndSite, userInfo },
  } = useStores()
  const pageRef = useRef<number>(1)
  const [status, setStatus] = useState({
    externalState: [],
    internalState: [],
    orderType: [
      {
        id: 0,
        phoneLength: null,
        text: intl.formatMessage({
          id: 'order.quanbu',
          defaultMessage: '全部',
        }),
      },
      {
        id: 1,
        phoneLength: null,
        text: intl.formatMessage({
          id: 'order.tuangoudingdan',
          defaultMessage: '团购订单',
        }),
      },
      {
        id: 2,
        phoneLength: null,
        text: intl.formatMessage({
          id: 'order.xianhuodingdan',
          defaultMessage: '现货订单',
        }),
      },
    ],
  })

  const _renderTabItems = useMemo(() => {
    const _tabItemList: any[] = [
      {
        title: intl.formatMessage({
          id: 'order.quanbu',
          defaultMessage: '全部',
        }),
      },
      {
        title: intl.formatMessage({
          id: 'order.daifukuan',
          defaultMessage: '待付款',
        }),
      },
      {
        title: intl.formatMessage({
          id: 'order.daifahuo',
          defaultMessage: '待发货',
        }),
      },
      {
        title: intl.formatMessage({
          id: 'order.daishouhuodaiquhuo',
          defaultMessage: '待收货/待取货',
        }),
      },
      {
        title: intl.formatMessage({
          id: 'order.yiwancheng',
          defaultMessage: '已完成',
        }),
      },
      {
        title: intl.formatMessage({
          id: 'order.yiquxiao',
          defaultMessage: '已取消',
        }),
      },
    ]
    _tabItemList.forEach((item, key) => (item.key = key))
    if (shopAndSite?.property === SHOP_PROPERTY.CUSTOMER_SELF_SUPPORT) {
      _tabItemList.splice(1, 3)
    }
    return _tabItemList
  }, [])

  const tabKey = useMemo(() => _renderTabItems[activeKey]?.key, [_renderTabItems, activeKey])

  /* 获取内部外部状态 */
  const buyer = () => {
    getOrderMobileBuyerPageItems().then((res: any) => {
      if (res.code === 1000) {
        const obj: any = {
          ...status,
          externalState: res.data.outerStatus,
          internalState: res.data.innerStatus,
        }
        setStatus(obj)
      }
    })
  }

  /* 请求数据 */
  const GetData = (index: number, data?: any) => {
    const api = [
      getOrderMobileBuyerPage,
      getOrderMobileBuyerValidatePayPage,
      getOrderMobileBuyerValidateDeliveryPage,
      getOrderMobileBuyerValidateReceivePage,
      getOrderMobileBuyerValidateFinishPage,
      getOrderMobileBuyerValidateCancelPage,
    ]
    return new Promise((resolve, reject) => {
      const param: any = {
        current: `${pageRef.current}`,
        pageSize: `${PAGE_SIZE}`,
        ...data,
      }
      const fn: any = api[index]
      setLoading(true)
      fn(param)
        .then((res: any) => {
          if (res.code === 1000) {
            setHasMore(checkMore(pageRef.current, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount))
            const List = res.data.data
            const id: any = []
            if (!index || index === 5) {
              List.forEach((element: any) => {
                if (element?.groupId > 0 || element?.promotionStatus == 1 || element?.promotionStatus === 2) {
                  id.push(element.orderId)
                }
              })
              const dataSource = List
              if (id.length === 0) {
                resolve(dataSource)
              } else {
                postMarketingMobileActivityOrderOrderListGroupPurchase({
                  ids: id,
                }).then((resj: any) => {
                  if (resj.code === 1000) {
                    if (resj.data) {
                      resj.data.forEach((element: any) => {
                        const item = element
                        List.forEach((j: any) => {
                          const items = j
                          if (item.orderId === items.orderId) {
                            items.countdown = element
                          } else {
                            items.countdown = {}
                          }
                        })
                      })
                      resolve(dataSource)
                    } else {
                      resolve(res.data.data)
                    }
                  }
                })
              }
            } else {
              resolve(res.data.data)
            }
            hideLoading({})
          } else {
            reject()
          }
          setLoading(false)
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }

  /* 头部点击事件 */
  const handleTabClick = (index: number) => {
    setActiveKey(index)
    setList([])
    pageRef.current = 1
    GetData(_renderTabItems[index].key)
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }

  useDidShow(() => {
    // 如果正在预览图片，不刷新列表
    if (isPreviewingRef.current) {
      isPreviewingRef.current = false
      return
    }
    setList([])
    pageRef.current = 1
    let i = isNaN(+Index) ? 0 : +Index
    setActiveKey(_renderTabItems?.findIndex((item) => item?.key === i))
    GetData(i)
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
    buyer()
  })

  /* 选着搜索条件 */
  const onSelect = (data: any) => {
    setList([])
    pageRef.current = 1
    setKeyword(data.keyword)
    setSearchCriteria(data)
    GetData(tabKey, data)
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }

  const handleSearchSubmit = (value: string) => {
    setList([])
    pageRef.current = 1
    GetData(tabKey, {
      keyword: value,
    })
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }

  /* 列表按钮级操作事件 */
  const orderCancel = (data: any) => {
    setOrderItem(data)
    setCancelOrderVisible(!cancelOrderVisible)
  }

  /* 再次购买 */
  const BuyAgain = async (item: any) => {
    const List: any = []
    item.products.find((key: any) => {
      if (key.priceType != 4) {
        List.push({
          id: key.productId,
          commoditySkuId: key.skuId,
          count: key.quantity,
        })
      }
    })
    const headers = {
      shopId: shopAndSite?.id,
    }
    const res = await postProductMobileShopPurchaseSavePurchaseBatch(
      {
        purchaseBatchList: List,
      },
      {
        headers,
      },
    )
    if (res.code === 1000) {
      Toast.show({
        title: intl.formatMessage({
          id: 'order.jiarugouwuchechenggong',
          defaultMessage: '加入购物车成功',
        }),
      })
      setTimeout(() => {
        Router.redirectTo('order/Purchase', {
          hasTab: true,
        })
      }, 2000)
    } else {
      Toast.show({
        title: intl.formatMessage({
          id: `${res.code}`,
          defaultMessage: res.message,
        }),
      })
    }
  }

  // 删除订单
  const deleteOrder = () => {
    const { orderId } = deleteItem
    if (!loading) {
      setLoading(true)
      postOrderMobileBuyerPageDelete({
        orderId,
      }).then((resDelete) => {
        setToggle(false)
        setLoading(false)
        if (resDelete.code === 1000) {
          setList([])
          GetData(tabKey)
            .then((res) => {
              setList(res)
              Toast.show({
                title: intl.formatMessage({
                  id: 'order.delmsg',
                  defaultMessage: '删除成功',
                }),
              })
            })
            .catch(() => {})
        }
      })
    }
  }

  const CountDom = (countdown: any, promotionStatus: number) => {
    const down = countdown
    let secKillEndTime = 0
    const currentTimestamp = new Date().valueOf()
    let num: any
    if (down) {
      secKillEndTime = Math.ceil((down.endTime - currentTimestamp) / 1000)
      num = down.num
    }
    return (
      <View style={{ flexDirection: 'row' }}>
        <CountDown count={secKillEndTime}>
          {(time, formatTime) => {
            const { formatTimeString } = formatTime
            const [hour, minute, second] = formatTimeString.split(':')
            return (
              <View className={styles['countDown']}>
                {time > 0 && (
                  <View className={styles['countDownTitle']}>
                    {intl.formatMessage({ id: 'order.haicha', defaultMessage: '还差' })}
                    <Text className={styles['countDownTitle']} style={{ color: 'red' }}>
                      {`${num}${intl.formatMessage({ id: 'order.ren', defaultMessage: '人' })}`}
                    </Text>
                    {intl.formatMessage({ id: 'order.pincheng', defaultMessage: '拼成' })}
                  </View>
                )}
                <View className={styles['time']}>
                  {(time > 0 && (
                    <>
                      <Text className={styles['timeUnit']}>
                        {intl.formatMessage({ id: 'order.shengyu', defaultMessage: '剩余' })}
                      </Text>
                      <Text className={styles['timeUnit']}>{hour}</Text>
                      <Text className={styles['splitCode']}>:</Text>
                      <Text className={styles['timeUnit']}>{minute}</Text>
                      <Text className={styles['splitCode']}>:</Text>
                      <Text className={styles['timeUnit']}>{second}</Text>
                    </>
                  )) || (
                    <Text className={styles['countDownTitle']}>
                      {promotionStatus === 3 ? '拼团失败' : promotionStatus == 4 ? '拼团成功' : ''}
                    </Text>
                  )}
                </View>
              </View>
            )
          }}
        </CountDown>
      </View>
    )
  }

  const actStyle = {
    background: THEME_COLORS.primarySoft,
    color: THEME_COLORS.primary,
  }
  const marginLeftStyle = {
    marginLeft: pxTransform(10),
  }

  const navigateToOrderDetail = (data: any) => {
    Router.navigateTo('order/mycommodityDetails', {
      categoryIndex: tabKey,
      orderId: data.orderId,
      showAfterSales: data.showAfterSales,
      showCancel: data.showCancel,
      showSubmit: Number(tabKey) === 3 ? true : data.showSubmit,
    })
  }

  // 使用页面内隐藏 Canvas 绘制文字
  const drawTextOnImageInMiniProgram = (
    imageUrl: string,
    userName: string,
    name: string,
    deliverTime: string,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      // 先下载图片
      wx.downloadFile({
        url: imageUrl,
        success: (downloadRes) => {
          if (downloadRes.statusCode === 200) {
            // 获取图片信息
            wx.getImageInfo({
              src: downloadRes.tempFilePath,
              success: (imgInfo) => {
                const imgWidth = imgInfo.width
                const imgHeight = imgInfo.height

                // 保持图片原始宽高比，宽度统一为750
                const canvasWidth = 750
                const canvasHeight = (imgHeight / imgWidth) * 750
                const scale = canvasWidth / 750 // 基于750宽度设计稿计算缩放比例

                // 使用旧版 Canvas API
                const ctx = wx.createCanvasContext('certificateCanvas')

                // 按比例绘制图片
                ctx.drawImage(downloadRes.tempFilePath, 0, 0, canvasWidth, canvasHeight)

                // 处理日期
                const deliverDate = deliverTime ? new Date(deliverTime) : new Date()
                const year = deliverDate.getFullYear().toString()
                const month = (deliverDate.getMonth() + 1).toString()
                const day = deliverDate.getDate().toString()

                // 绘制文字
                const fontSize = Math.round(22 * scale)
                const rightX = canvasWidth - Math.round(160 * scale)

                ctx.setFontSize(fontSize)
                ctx.setFillStyle('#333333')
                ctx.fillText(name || '', Math.round(250 * scale), Math.round(260 * scale))
                ctx.setTextAlign('right')
                ctx.fillText(userName || '', rightX - Math.round(320 * scale), Math.round(325 * scale))

                ctx.setFontSize(Math.round(20 * scale))
                ctx.setFillStyle('#000000')
                const bottomY = canvasHeight - Math.round(145 * scale)
                ctx.fillText(`签发日期：${year}年${month}月${day}日`, rightX + Math.round(30 * scale), bottomY)

                // 绘制完成，使用 draw 回调确保绘制完毕
                ctx.draw(false, () => {
                  // iOS 需要额外延迟确保渲染完成
                  setTimeout(() => {
                    wx.canvasToTempFilePath({
                      canvasId: 'certificateCanvas',
                      fileType: 'png',
                      quality: 1,
                      width: canvasWidth,
                      height: canvasHeight,
                      success: (tempRes) => {
                        resolve(tempRes.tempFilePath)
                      },
                      fail: (err) => {
                        console.error('Canvas 导出失败:', err)
                        reject(err)
                      },
                    })
                  }, 500)
                })
              },
              fail: (err) => {
                console.error('获取图片信息失败:', err)
                reject(err)
              },
            })
          } else {
            reject(new Error('下载图片失败'))
          }
        },
        fail: (err) => {
          console.error('下载图片失败:', err)
          reject(err)
        },
      })
    })
  }

  // 生成证书图片（统一处理 Toast 和预览标志）
  const generateCertificate = (adoptionCertificatePic: string, userName: string, name: string, deliverTime: string) => {
    Toast.show({ title: '正在生成证书...', icon: 'loading', duration: 0 })
    drawTextOnImageInMiniProgram(adoptionCertificatePic, userName, name, deliverTime)
      .then((imagePath) => {
        isPreviewingRef.current = true
        previewImage({ urls: [imagePath] })
        setTimeout(() => {
          isPreviewingRef.current = false
        }, 500)
      })
      .catch((err) => {
        console.error('生成证书失败：', err)
        if (adoptionCertificatePic) {
          Toast.show({ title: err, icon: 'none' })
          isPreviewingRef.current = true
          previewImage({ urls: [adoptionCertificatePic] })
          setTimeout(() => {
            isPreviewingRef.current = false
          }, 500)
        } else {
          Toast.show({ title: '生成证书失败', icon: 'none' })
        }
      })
  }

  // 处理查看证书点击
  const handleCertificateClick = (data: any) => {
    const { orderId, adoptionCertificatePic } = data
    getOrderMobileBuyerDetail({ orderId })
      .then((res) => {
        if (res.code === 1000) {
          const logisticsData = res.data.logisticsList || res.data.deliveries || []
          if (logisticsData.length > 1) {
            setLogisticsList(logisticsData)
            setCurrentOrderData(data)
            setCurrentActionType('certificate')
            setShowLogisticsModal(true)
          } else {
            const logistics = logisticsData[0] || {}
            const userName = userInfo?.userName || ''
            const name = logistics.logisticsNo || ''
            const deliverTime = logistics.deliveryTime || logistics.deliverTime || ''
            generateCertificate(adoptionCertificatePic, userName, name, deliverTime)
          }
        } else {
          if (adoptionCertificatePic) {
            isPreviewingRef.current = true
            previewImage({ urls: [adoptionCertificatePic] })
            setTimeout(() => {
              isPreviewingRef.current = false
            }, 500)
          }
        }
      })
      .catch(() => {
        if (adoptionCertificatePic) {
          isPreviewingRef.current = true
          previewImage({ urls: [adoptionCertificatePic] })
          setTimeout(() => {
            isPreviewingRef.current = false
          }, 500)
        }
      })
  }

  // 处理查看溯源点击
  const handleTraceClick = (data: any) => {
    const { orderId, adoptionTraceUrl } = data
    getOrderMobileBuyerDetail({ orderId })
      .then((res) => {
        if (res.code === 1000) {
          const logisticsData = res.data.logisticsList || res.data.deliveries || []
          if (logisticsData.length > 1) {
            setLogisticsList(logisticsData)
            setCurrentOrderData(data)
            setCurrentActionType('trace')
            setShowLogisticsModal(true)
          } else {
            const logistics = logisticsData[0] || {}
            const logisticsNo = logistics.logisticsNo || ''
            preload('params', { url: adoptionTraceUrl + logisticsNo })
            Router.navigateTo('basicSetting/webInfo')
          }
        }
      })
      .catch(() => {
        console.error('获取物流信息失败')
      })
  }

  // 处理物流选择
  const handleLogisticsSelect = (logistics: any) => {
    setShowLogisticsModal(false)
    if (currentActionType === 'certificate') {
      const userName = userInfo?.userName || ''
      const name = logistics.logisticsNo || ''
      const deliverTime = logistics.deliveryTime || logistics.deliverTime || ''
      const adoptionCertificatePic = currentOrderData.adoptionCertificatePic || ''
      if (adoptionCertificatePic) {
        generateCertificate(adoptionCertificatePic, userName, name, deliverTime)
      }
    } else if (currentActionType === 'trace') {
      const logisticsNo = logistics.logisticsNo || ''
      const adoptionTraceUrl = currentOrderData.adoptionTraceUrl || ''
      if (adoptionTraceUrl) {
        preload('params', { url: adoptionTraceUrl + logisticsNo })
        Router.navigateTo('basicSetting/webInfo')
      }
    }
  }

  // 点击按钮
  const backBtn = (data: any) => {
    const {
      pickupPointName,
      showCancel,
      showAfterSales,
      showComment,
      showGradeOne,
      showGradeTwo,
      showPay,
      showConfirmReception,
      showReceive,
      countdown,
      showInvite,
      showModifyDeliverTime,
      promotionStatus,
      showDelete,
      showBuyAgain,
      showApplyInvoice,
      orderId,
      adoptionCertificatePic,
      adoptionTraceUrl,
    } = data

    switch (tabKey) {
      case 0:
      case 3:
      case 4:
      case 5:
        return (
          <View className={cx(styles['backBtn'], styles['my-flex'])}>
            {showInvite && CountDom(countdown, promotionStatus)}
            <View className={styles['flex']} style="flex-wrap:wrap;">
              {(showReceive || showComment) && adoptionCertificatePic && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...actStyle, ...marginLeftStyle }}
                  onClick={() => handleCertificateClick(data)}
                >
                  查看证书
                </View>
              )}
              {(showReceive || showComment) && adoptionTraceUrl && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...actStyle, ...marginLeftStyle }}
                  onClick={() => handleTraceClick(data)}
                >
                  我的权益
                </View>
              )}
              {showModifyDeliverTime && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...marginLeftStyle }}
                  onClick={() => navigateToOrderDetail(data)}
                >
                  {intl.formatMessage({ id: 'order.xiugaipeisongshijian', defaultMessage: '修改配送时间' })}
                </View>
              )}
              {showDelete && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...marginLeftStyle }}
                  onClick={() => {
                    setDeleteItem(data)
                    setToggle(true)
                  }}
                >
                  {intl.formatMessage({ id: 'order.detail.del', defaultMessage: '删除订单' })}
                </View>
              )}
              {showReceive && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...actStyle, ...marginLeftStyle }}
                  onClick={() => navigateToOrderDetail(data)}
                >
                  {!pickupPointName
                    ? intl.formatMessage({ id: 'order.querenshouhuo', defaultMessage: '确认收货' })
                    : intl.formatMessage({ id: 'order.querentihou', defaultMessage: '确认提货' })}
                </View>
              )}
              {showPay && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...actStyle, ...marginLeftStyle }}
                  onClick={() => navigateToOrderDetail(data)}
                >
                  {intl.formatMessage({ id: 'order.zhifu', defaultMessage: '支付' })}
                </View>
              )}
              {showGradeTwo && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...actStyle, ...marginLeftStyle }}
                  onClick={() => navigateToOrderDetail(data)}
                >
                  {intl.formatMessage({ id: 'order.shenhe', defaultMessage: '审核' })}
                </View>
              )}
              {showGradeOne && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...actStyle, ...marginLeftStyle }}
                  onClick={() => navigateToOrderDetail(data)}
                >
                  {intl.formatMessage({ id: 'order.shenhe', defaultMessage: '审核' })}
                </View>
              )}
              {showComment && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...marginLeftStyle }}
                  onClick={() => Router.navigateTo('extra/evaluatingManage')}
                >
                  {intl.formatMessage({ id: 'order.pingjia', defaultMessage: '评价' })}
                </View>
              )}
              {showApplyInvoice && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...actStyle, ...marginLeftStyle }}
                  onClick={() => Router.navigateTo('basicSetting/invoiceList', { orderId: orderId })}
                >
                  申请发票
                </View>
              )}
              {showAfterSales && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...marginLeftStyle }}
                  onClick={() =>
                    Router.navigateTo('afterService/afterTodo/applyAs', {
                      orderId: data.orderId,
                      orderMode: data.orderMode,
                      storeLogo: data.storeLogo,
                      storeName: data.storeName,
                    })
                  }
                >
                  {intl.formatMessage({ id: 'order.shenqingshouhou', defaultMessage: '申请售后' })}
                </View>
              )}
              {showBuyAgain && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...actStyle, ...marginLeftStyle }}
                  onClick={() => BuyAgain(data)}
                >
                  {intl.formatMessage({ id: 'order.zaicigoumai', defaultMessage: '再次购买' })}
                </View>
              )}
              {showConfirmReception && (
                <View className={styles['backBtnText']} style={{ ...actStyle, ...marginLeftStyle }}>
                  审核采购收货单
                </View>
              )}
              {showCancel && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...marginLeftStyle }}
                  onClick={() => orderCancel(data)}
                >
                  {' '}
                  {intl.formatMessage({ id: 'order.quxiaodingdan', defaultMessage: '取消订单' })}
                </View>
              )}
              {showInvite && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...actStyle, ...marginLeftStyle }}
                  onClick={() => navigateToOrderDetail(data)}
                >
                  {' '}
                  {intl.formatMessage({ id: 'order.yaoqinghaoyoupintuan', defaultMessage: '邀请好友拼团' })}
                </View>
              )}
            </View>
          </View>
        )
      case 1:
        return (
          <View className={styles['backBtn']}>
            {showApplyInvoice && (
              <View
                className={styles['backBtnText']}
                style={{ ...actStyle, ...marginLeftStyle }}
                onClick={() => Router.navigateTo('basicSetting/invoiceList', { orderId: orderId })}
              >
                申请发票
              </View>
            )}
            {showCancel && (
              <View className={styles['backBtnText']} style={{ ...marginLeftStyle }} onClick={() => orderCancel(data)}>
                {' '}
                {intl.formatMessage({ id: 'order.quxiaodingdan', defaultMessage: '取消订单' })}
              </View>
            )}
            <View
              className={styles['backBtnText']}
              style={{ ...actStyle, ...marginLeftStyle }}
              onClick={() => navigateToOrderDetail(data)}
            >
              {' '}
              {intl.formatMessage({ id: 'order.quzhifu', defaultMessage: '去支付' })}
            </View>
          </View>
        )
      case 2:
        return (
          <View className={cx(styles['backBtn'], styles['my-flex'])}>
            <View className={styles['flex']}>
              {showAfterSales && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...marginLeftStyle }}
                  onClick={() =>
                    Router.navigateTo('afterService/afterTodo/applyAs', {
                      orderId: data.orderId,
                      orderMode: data.orderMode,
                    })
                  }
                >
                  {intl.formatMessage({ id: 'order.shenqingshouhou', defaultMessage: '申请售后' })}
                </View>
              )}
              {showInvite && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...actStyle, ...marginLeftStyle }}
                  onClick={() => navigateToOrderDetail(data)}
                >
                  {' '}
                  {intl.formatMessage({ id: 'order.yaoqinghaoyoupintuan', defaultMessage: '邀请好友拼团' })}
                </View>
              )}
              {showInvite && CountDom(countdown, promotionStatus)}
              {showApplyInvoice && (
                <View
                  className={styles['backBtnText']}
                  style={{ ...actStyle, ...marginLeftStyle }}
                  onClick={() => Router.navigateTo('basicSetting/invoiceList', { orderId: orderId })}
                >
                  申请发票
                </View>
              )}
            </View>
          </View>
        )
      default:
        break
    }
  }

  const handleLoadMore = () => {
    if (loading || !hasMore) return
    pageRef.current += 1
    GetData(tabKey, searchCriteria)
      .then((res) => {
        setList(list.concat(res))
      })
      .catch(() => {})
  }

  const renderItem = ({ item }: { item: any }) => (
    <CommodityCard Item={item} back={backBtn(item)} categoryIndex={tabKey} />
  )

  const onConfirm = () => {
    setList([])
    pageRef.current = 1
    GetData(tabKey)
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }

  const searchPlaceholder: string = useMemo(() => {
    let p = intl.formatMessage({
      id: 'order.shangpinmingchenggongyingshang',
      defaultMessage: '商品名称/供应商/订单编号',
    })
    if (shopAndSite?.property === SHOP_PROPERTY.CUSTOMER_SELF_SUPPORT) {
      p = p.replace('供应商', '商家')
    }
    return p
  }, [shopAndSite])

  return (
    <View
      className={styles['page-wrap']}
      style={
        safeBottomHeight
          ? {
              paddingBottom: `${safeBottomHeight}PX`,
            }
          : {}
      }
    >
      {/* 隐藏的 Canvas 用于绘制证书 */}
      <canvas
        canvasId="certificateCanvas"
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '750px',
          height: '1000px',
        }}
      />

      <Header
        title={
          <Text
            style={{
              lineHeight: pxTransform(60),
              fontSize: pxTransform(14),
              textAlign: 'center',
              color: '#000',
            }}
          >
            {intl.formatMessage({ id: 'order.wodedingdan', defaultMessage: '我的订单' })}
          </Text>
        }
        customRenderLeft={
          <View style={{ flex: 2 }}>
            <Icons
              name="ChevronLeft"
              size={24}
              color="#000"
              onClick={() => Router.reLaunch('extra/mine', { hasTab: 'true' })}
            />
          </View>
        }
      />
      <View className={styles['page-wrap-Search']}>
        <Search
          value={keyword}
          placeholder={searchPlaceholder}
          onChange={(value) => {
            setKeyword(value)
            setSearchCriteria({ ...searchCriteria, keyword: value })
          }}
          onClear={handleSearchSubmit}
          onSearch={handleSearchSubmit}
          customClassName={styles['page-wrap-Search-key']}
          innerBackground={THEME_COLORS.surface}
          shape="round"
          clearable
          showAction
          customAction={
            <View className={styles['page-wrap-Search-button']} onClick={() => handleSearchSubmit(keyword)}>
              {intl.formatMessage({ id: 'order.sousuo', defaultMessage: '搜索' })}
            </View>
          }
        />
        <Image src={choice} onClick={() => setVisible(true)} />
      </View>
      <Tabs
        current={activeKey}
        tabList={_renderTabItems}
        onClick={handleTabClick}
        hideUnderLine
        scroll
        activeColor="#000"
      />
      <View className={styles['scrollView']}>
        <ScrollView
          data={list}
          keyExtractor={(item) => item.orderId}
          renderItem={renderItem}
          horizontal={false}
          listFooterComponent={<Loading loading={loading} noMore={!hasMore} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={50}
          style={{ overflow: !IS_WEB ? 'hidden' : '' }}
          className={styles['flatList']}
        />
      </View>
      <FilterModal
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={onSelect}
        externalState={status.externalState}
        internalState={status.internalState}
        orderType={status.orderType}
        searchValue={keyword}
      />
      <CancelOrder
        onHandleClose={() => setCancelOrderVisible(false)}
        onConfirm={onConfirm}
        cancelOrderVisible={cancelOrderVisible}
        orderItem={orderItem}
      />
      {/* 物流选择弹窗（只显示单号，弹窗宽度缩小） */}
      <Modal
        isOpened={showLogisticsModal}
        onCancel={() => setShowLogisticsModal(false)}
        cancelText="取消"
        confirmText=""
        className={styles['logistics-modal']}
      >
        <View className={styles['logistics-list']}>
          <Text className={styles['logistics-title']}>请选择物流单号</Text>
          {logisticsList.map((logistics: any, index: number) => (
            <View key={index} className={styles['logistics-item']} onClick={() => handleLogisticsSelect(logistics)}>
              <Text className={styles['logistics-no']}>{logistics.logisticsNo}</Text>
              <Icons name="ChevronRight" size={18} color="#999" />
            </View>
          ))}
        </View>
      </Modal>
      <Modal
        title={intl.formatMessage({ id: 'order.querenshanchugaidingdang', defaultMessage: '确认删除该订单？' })}
        isOpened={toggle}
        onConfirm={deleteOrder}
        onCancel={() => setToggle(false)}
        cancelText={intl.formatMessage({ id: 'mine.quxiao', defaultMessage: '取消' })}
        confirmText={intl.formatMessage({ id: 'order.querenshanchu', defaultMessage: '确认删除' })}
        className={styles['delete-model']}
      />
    </View>
  )
}

export default GlobalWrapper(MyCommodityList)
