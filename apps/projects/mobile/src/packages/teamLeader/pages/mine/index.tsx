import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Icons, Image, Text, View } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import Header from '@/components/NavBar'
import Piece from './components/piece'
import ActivityModule from '@/packages/teamLeader/components/activityModule'
import styles from './index.module.scss'
import { pxTransform, showToast, useDidShow, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import cx from 'classnames'
import {
  getOrderMobileCbgTeamLeaderHome,
  getMarketingMobileCbgTeamLeaderHome,
  getOrderMobileCbgTeamLeaderHomeGetOrderNumInfo,
  postMarketingMobileCbgTeamLeaderSignUpActivity,
  postMarketingMobileCbgTeamLeaderCancelSignUpActivity,
} from '@apps/apis'
import { formatMoney, formatMoneyInt } from '../../utils/formatter'
import Router from '@/utils/router'

const infoIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/teamleader-apply-house.png'
const sweepIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/teamleader-sweep.png'
const pendingIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/teamleader-pending.png'
const shippingIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/teamleader-shipping.png'
const finishedIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/teamleader-finished.png'
const preparingIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/teamleader-preparing.png'
const deliveringIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/teamleader-delivering.png'
const deliveredIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/teamleader-delivered.png'

// 数据中心
interface DataCenterType {
  payOrderAmount: number
  payOrderNum: number
  buyerNum: number
  commissionAmount: number
  commissionCreditedAmount: number
  commissionNotCreditedAmount: number
}
// 客户订单-团长收货单数量
interface OrderQuantityInfo {
  orderNotDeliveryNum: number
  orderDeliveryNum: number
  orderConfirmNum: number
  deliveryPreparingNum: number
  deliveryNum: number
}
// 我的报名活动
interface SignupInfo {
  pendingNum: number
  progressNum: number
  endNum: number
}

const TeamLeaderMine: React.FC<{}> = () => {
  const intl = useIntl()

  const DATE_TYPE_MAP = { day: '1', month: '2', year: '3' }
  type DateRangeKey = keyof typeof DATE_TYPE_MAP
  // 默认选择今日
  const [dateActive, setDateActive] = useState<DateRangeKey>('day')
  const [dateType, setDateType] = useState(DATE_TYPE_MAP['day'])
  const dateTabs: { key: DateRangeKey; intlId: string; defaultText: string }[] = [
    { key: 'day', intlId: 'teamLeader.jinri', defaultText: '今日' },
    { key: 'month', intlId: 'teamLeader.benyue', defaultText: '本月' },
    { key: 'year', intlId: 'teamLeader.bennian', defaultText: '本年' },
  ]

  // 存储数据中心数据
  const [dataCenter, setDataCenter] = useState<DataCenterType>()
  // 存储团长信息数据
  const [teamLeaderInfo, setTeamLeaderInfo] = useState<any>({})
  // 存储我的报名活动数据
  const [signupInfo, setSignupInfo] = useState<SignupInfo>()
  // 存储客户订单-团长收货单数量
  const [orderQuantityInfo, setOrderQuantityInfo] = useState<OrderQuantityInfo>()
  // 存储活动列表数据
  const [activityList, setActivityList] = useState<any>([])

  useEffect(() => {
    getDataCenter(dateType)
  }, [dateType])

  // useEffect(() => {
  //   getDataInfo()
  // }, [])

  useDidShow(() => {
    getDataInfo()
    getOrderQuantityInfo()
  })

  // 获取数据中心数据
  const getDataCenter = async (type: string) => {
    showLoading({
      title: intl.formatMessage({ id: 'teamLeader.jiazaizhong', defaultMessage: '加载中' }),
      mask: true,
    })
    try {
      const res = await getOrderMobileCbgTeamLeaderHome({ type })
      if (res.code === 1000) {
        const data = res.data
        setDataCenter(data)
      } else {
        showToast({
          title:
            res?.message ||
            intl.formatMessage({
              id: 'teamLeader.huoqushujuzhongxinshujusbai',
              defaultMessage: '获取数据中心数据失败',
            }),
          icon: 'none',
        })
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: 'teamLeader.huoqushujuzhongxinshujusbai',
          defaultMessage: '获取数据中心数据失败',
        }),
        icon: 'none',
      })
    } finally {
      hideLoading()
    }
  }

  // 获取活动&自提点信息数据
  const getDataInfo = async () => {
    showLoading({
      title: intl.formatMessage({ id: 'teamLeader.jiazaizhong', defaultMessage: '加载中' }),
      mask: true,
    })
    try {
      const res = await getMarketingMobileCbgTeamLeaderHome()
      if (res.code === 1000) {
        const data = res.data
        setTeamLeaderInfo(data.pickupPointInfo)
        setSignupInfo(data.signupInfo)
        setActivityList(data.activityList)
      } else {
        showToast({
          title:
            res?.message ||
            intl.formatMessage({
              id: 'teamLeader.huoqushujushibai',
              defaultMessage: '获取数据失败',
            }),
          icon: 'none',
        })
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: 'teamLeader.huoqushujushibai',
          defaultMessage: '获取数据失败',
        }),
        icon: 'none',
      })
    } finally {
      hideLoading()
    }
  }

  // 获取客户订单和团长收货单数量
  const getOrderQuantityInfo = () => {
    getOrderMobileCbgTeamLeaderHomeGetOrderNumInfo().then((res) => {
      if (res.code === 1000) {
        setOrderQuantityInfo(res.data)
      } else {
        showToast({
          title: res.message,
          icon: 'none',
        })
      }
    })
  }

  // 跳转扫码页
  const handleBarCodeScanned = () => {
    Router.navigateTo('teamLeader/scanVerify')
  }

  // 选择年月日
  const switchDateRange = (range: 'day' | 'month' | 'year') => {
    if (range === dateActive) {
      return
    }
    setDateActive(range)
    setDateType(DATE_TYPE_MAP[range])
  }

  // 数据中心交易数据查看明细
  const handleDataViewDetails = () => {
    // 跳转团购订单页
    Router.navigateTo('teamLeader/groupPurchaseOrders')
  }

  // 数据中心我的佣金查看账户余额
  const handleDataViewBalance = () => {
    // 跳转账户余额页
    Router.navigateTo('basicSetting/normalAccountDetail')
  }

  // 点击全部活动跳转活动列表
  const handleAllActivities = () => {
    Router.navigateTo('teamLeader/groupBuyList')
  }
  // 团购活动点击-跳转活动详情
  const handleActivityDetail = (activityId) => {
    Router.navigateTo('teamLeader/groupBuyDetail', { activityId })
  }
  // 团购活动点击报名或撤销
  const handleActivityAction = async (id: number, status: number) => {
    FullScreenLoading.show()
    try {
      // 报名活动状态（1：已报名）
      if (status !== 1) {
        // 报名
        const res = await postMarketingMobileCbgTeamLeaderSignUpActivity({ activityId: id })
        if (res.code === 1000) {
          showToast({
            title: res.message || intl.formatMessage({ id: 'teamLeader.baomingchenggong', defaultMessage: '报名成功' }),
            icon: 'none',
          })
          // 报名成功-手动更新activityList中对应项状态
          setActivityList((prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    signupStatus: 1,
                  }
                : item,
            ),
          )
        } else {
          showToast({
            title: res.message || intl.formatMessage({ id: 'teamLeader.baomingshibai', defaultMessage: '报名失败' }),
            icon: 'none',
          })
        }
      } else {
        // 撤销报名
        const res = await postMarketingMobileCbgTeamLeaderCancelSignUpActivity({ activityId: id })
        if (res.code === 1000) {
          showToast({
            title:
              res.message ||
              intl.formatMessage({ id: 'teamLeader.chexiaobaomingchenggong', defaultMessage: '撤销报名成功' }),
            icon: 'none',
          })
          // 撤销成功-手动更新activityList中对应项状态
          setActivityList((prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    signupStatus: 0,
                  }
                : item,
            ),
          )
        } else {
          showToast({
            title: res.message || intl.formatMessage({ id: 'teamLeader.chexiaoshibai', defaultMessage: '撤销失败' }),
            icon: 'none',
          })
        }
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: 'teamLeader.qingqiuyichangqingshaohouzaishi',
          defaultMessage: '请求异常，请稍后再试',
        }),
        icon: 'none',
      })
    } finally {
      FullScreenLoading.hide()
    }
  }

  // 跳转团长信息
  const goTeamLeader = () => {
    Router.navigateTo('teamLeader/detail', { teamLeaderInfo: JSON.stringify(teamLeaderInfo) })
  }

  return (
    <View className={styles['mine']}>
      <View className={styles['header']}>
        <View className={styles['header-top']}>
          <Header
            backIconColor="#5A2A12"
            titleColor="#FFF"
            customStyle="background: transparent"
            title={
              <Text style={{ fontSize: pxTransform(16), textAlign: 'center' }}>
                {intl.formatMessage({
                  id: 'teamLeader.tuanzhangzhongxin',
                  defaultMessage: '团长中心',
                })}
              </Text>
            }
          />
        </View>
        <View className={styles['header-bottom']}></View>
      </View>
      <View className={styles['mine-box']}>
        <View className={styles['mine-top']}>
          <View className={styles['mine-top-left']} onClick={() => goTeamLeader()}>
            <Image className={styles['mine-top-icon']} src={infoIcon} />
            <Text className={styles['mine-top-text']}>{teamLeaderInfo?.pickupPointName}</Text>
            <Icons name="ChevronRight" size={14} color="#3E3E40" />
          </View>
          {/*{!IS_WEB || (IS_WEB && isWeChat()) ? (*/}
          {/*  <Image*/}
          {/*    className={styles['mine-top-right']}*/}
          {/*    src={sweepIcon}*/}
          {/*    onClick={handleBarCodeScanned}*/}
          {/*  />*/}
          {/*) : null}*/}
          <Image className={styles['mine-top-right']} src={sweepIcon} onClick={handleBarCodeScanned} />
        </View>

        <View className={styles['mine-data']}>
          <View className={styles['data-top']}>
            <Text className={styles['data-top-title']}>
              {intl.formatMessage({ id: 'teamLeader.shujuzhongxin', defaultMessage: '数据中心' })}
            </Text>
            <View className={styles['data-top-date']}>
              {dateTabs.map(({ key, intlId, defaultText }) => (
                <View
                  key={key}
                  className={dateActive === key ? styles['data-top-date-btn'] : styles['data-top-date-btn2']}
                  onClick={() => switchDateRange(key)}
                >
                  {intl.formatMessage({ id: intlId, defaultMessage: defaultText })}
                </View>
              ))}
            </View>
          </View>
          <View className={cx(styles['data-box'], styles['data-box-bottom'])}>
            <View className={styles['data-box-row']}>
              <Text className={styles['data-box-row-title']}>
                {intl.formatMessage({ id: 'teamLeader.jiaoyishuju', defaultMessage: '交易数据' })}
              </Text>
              <View className={styles['data-box-row-right']} onClick={() => handleDataViewDetails()}>
                <Text className={styles['data-box-row-text']}>
                  {intl.formatMessage({ id: 'teamLeader.chakanmingxi', defaultMessage: '查看明细' })}
                </Text>
                <Icons name="ChevronRight" size={12} color="#C8CACD" />
              </View>
            </View>
            <View className={styles['data-box-item']}>
              <View className={styles['data-box-item-view']}>
                <Text className={styles['data-box-item-text1']}>
                  {intl.formatMessage({ id: 'teamLeader.jiaoyijine', defaultMessage: '交易金额' })}
                </Text>
                <Text className={styles['data-box-item-text2']}>{formatMoney(dataCenter?.payOrderAmount)}</Text>
              </View>
              <View className={styles['data-box-item-view']}>
                <Text className={styles['data-box-item-text1']}>
                  {intl.formatMessage({ id: 'teamLeader.dingdanshuliang', defaultMessage: '订单数量' })}
                </Text>
                <Text className={styles['data-box-item-text2']}>{formatMoneyInt(dataCenter?.payOrderNum)}</Text>
              </View>
              <View className={styles['data-box-item-view']}>
                <Text className={styles['data-box-item-text1']}>
                  {intl.formatMessage({ id: 'teamLeader.xiadanrenshu', defaultMessage: '下单人数' })}
                </Text>
                <Text className={styles['data-box-item-text2']}>{formatMoneyInt(dataCenter?.buyerNum)}</Text>
              </View>
            </View>
          </View>
          <View className={styles['data-box']}>
            <View className={styles['data-box-row']}>
              <Text className={styles['data-box-row-title']}>
                {intl.formatMessage({ id: 'teamLeader.jiaoyishuju', defaultMessage: '我的佣金' })}
              </Text>
              <View className={styles['data-box-row-right']} onClick={() => handleDataViewBalance()}>
                <Text className={styles['data-box-row-text']}>
                  {intl.formatMessage({ id: 'teamLeader.zhanghuyue', defaultMessage: '账户余额' })}
                </Text>
                <Icons name="ChevronRight" size={12} color="#C8CACD" />
              </View>
            </View>
            <View className={styles['data-box-item']}>
              <View className={styles['data-box-item-view']}>
                <Text className={styles['data-box-item-text1']}>
                  {intl.formatMessage({ id: 'teamLeader.yuguyongjin', defaultMessage: '预估佣金' })}
                </Text>
                <Text className={styles['data-box-item-text2']}>{formatMoney(dataCenter?.commissionAmount)}</Text>
              </View>
              <View className={styles['data-box-item-view']}>
                <Text className={styles['data-box-item-text1']}>
                  {intl.formatMessage({ id: 'teamLeader.yiruzhangyongjin', defaultMessage: '已入账佣金' })}
                </Text>
                <Text className={styles['data-box-item-text2']}>
                  {formatMoney(dataCenter?.commissionCreditedAmount)}
                </Text>
              </View>
              <View className={styles['data-box-item-view']}>
                <Text className={styles['data-box-item-text1']}>
                  {intl.formatMessage({ id: 'teamLeader.weiruzhangyongjin', defaultMessage: '未入账佣金' })}
                </Text>
                <Text className={styles['data-box-item-text2']}>
                  {formatMoney(dataCenter?.commissionNotCreditedAmount)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Piece
          title={intl.formatMessage({ id: 'teamLeader.kehudingdan', defaultMessage: '客户订单' })}
          pieceType={'khdd'}
          items={[
            {
              type: 'pending',
              icon: pendingIcon,
              orderNumber: orderQuantityInfo?.orderNotDeliveryNum ?? 0,
              text: intl.formatMessage({ id: 'teamLeader.daifahuo', defaultMessage: '待发货' }),
            },
            {
              type: 'shipping',
              icon: shippingIcon,
              orderNumber: orderQuantityInfo?.orderDeliveryNum ?? 0,
              text: intl.formatMessage({ id: 'teamLeader.daishouhuodaiquhuo', defaultMessage: '待收货/待取货' }),
            },
            {
              type: 'finished',
              icon: finishedIcon,
              orderNumber: orderQuantityInfo?.orderConfirmNum ?? 0,
              text: intl.formatMessage({ id: 'teamLeader.yiwancheng', defaultMessage: '已完成' }),
            },
          ]}
        />

        <Piece
          title={intl.formatMessage({ id: 'teamLeader.tuanzhangshouhuodan', defaultMessage: '团长收货单' })}
          pieceType={'tzshd'}
          items={[
            {
              type: 'preparing',
              icon: preparingIcon,
              orderNumber: orderQuantityInfo?.deliveryPreparingNum ?? 0,
              text: intl.formatMessage({ id: 'teamLeader.beihuozhong', defaultMessage: '备货中' }),
            },
            {
              type: 'delivering',
              icon: deliveringIcon,
              orderNumber: orderQuantityInfo?.deliveryNum ?? 0,
              text: intl.formatMessage({ id: 'teamLeader.songhuozhong', defaultMessage: '送货中' }),
            },
            {
              type: 'delivered',
              icon: deliveredIcon,
              text: intl.formatMessage({ id: 'teamLeader.yisongda', defaultMessage: '已送达' }),
            },
          ]}
        />

        <Piece
          title={intl.formatMessage({ id: 'teamLeader.wodebaominghuodong', defaultMessage: '我的报名活动' })}
          // showMore={false}
          pieceType={'wdbmhd'}
          items={[
            {
              type: 'notStarted',
              number: signupInfo?.pendingNum ?? 0,
              text: intl.formatMessage({ id: 'teamLeader.weikaishi', defaultMessage: '未开始' }),
            },
            {
              type: 'ongoing',
              number: signupInfo?.progressNum ?? 0,
              text: intl.formatMessage({ id: 'teamLeader.jinxingzhong', defaultMessage: '进行中' }),
            },
            {
              type: 'over',
              number: signupInfo?.endNum ?? 0,
              text: intl.formatMessage({ id: 'teamLeader.yijieshu', defaultMessage: '已结束' }),
            },
          ]}
        />

        {teamLeaderInfo.status === 2 ? (
          <View className={styles['mine-activity']}>
            <View className={styles['mine-activity-top']}>
              <Text className={styles['mine-activity-top-text']}>
                {intl.formatMessage({ id: 'teamLeader.tuangouhuodong', defaultMessage: '团购活动' })}
              </Text>
              <View className={styles['mine-activity-top-right']} onClick={() => handleAllActivities()}>
                <Text className={styles['mine-activity-top-text2']}>
                  {intl.formatMessage({ id: 'teamLeader.quanbuhuodong', defaultMessage: '全部活动' })}
                </Text>
                <Icons name="ChevronRight" size={12} color="#C8CACD" />
              </View>
            </View>
            {activityList.map((item) => (
              <ActivityModule
                key={item.id}
                item={item}
                onClickDetail={(id) => handleActivityDetail(id)}
                onClickAction={(id, status) => handleActivityAction(id, status)}
              />
            ))}
          </View>
        ) : null}
      </View>

      <FullScreenLoading />
    </View>
  )
}

export default GlobalWrapper(observer(TeamLeaderMine))
