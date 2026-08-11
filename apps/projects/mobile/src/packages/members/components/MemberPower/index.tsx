import React, { useState, useEffect, useMemo } from 'react'
import { ScrollView, Progress } from '@tarojs/components'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { getOssUrlPath } from '@apps/constants'
import { View, Image, Text, Icons, Toast, Modal } from '@apps/mobile-ui'
import Statistic from '@/components/Statistic'
import { useIntl } from '@linkseeks/i18n'
import Grid from '@/components/Grid'
import MellowCard from '@/components/MellowCard'
import Router from '@/utils/router'
import Header from '@/components/NavBar'
import useStores from '@/store/useStores'
import { getMemberMobileInfoDetailLevelRightBasic, getMemberMobileInfoShopLevelRightBasic } from '@apps/apis'
import { getMarketingMobileCouponDetailCount } from '@apps/apis'
import { getCommodityMobileStoreMobileFindByMemberIdAndRoleId } from '@apps/apis'
import { getPayMobileAssetAccountGetUserAssetAccount } from '@apps/apis'
import { getOrderMobileCommonBalanceTypeFind } from '@apps/apis'
import styles from './index.module.scss'

const Copper1 = getOssUrlPath('/Images/memberLevel-copper-1.png')
const Copper2 = getOssUrlPath('/Images/memberLevel-copper-2.png')
const Copper3 = getOssUrlPath('/Images/memberLevel-copper-3.png')
const Copper4 = getOssUrlPath('/Images/memberLevel-copper-4.png')
const Copper5 = getOssUrlPath('/Images/memberLevel-copper-5.png')

const BgImg1 = getOssUrlPath('/Images/memberLevel-Icom-1.png')
const BgImg2 = getOssUrlPath('/Images/memberLevel-Icom-2.png')
const BgImg3 = getOssUrlPath('/Images/memberLevel-Icom-3.png')
const BgImg4 = getOssUrlPath('/Images/memberLevel-Icom-4.png')
const BgImg5 = getOssUrlPath('/Images/memberLevel-Icom-5.png')

const BgColorImg1 = getOssUrlPath('/Images/bg_color_1.png')
const BgColorImg2 = getOssUrlPath('/Images/bg_color_2.png')
const BgColorImg3 = getOssUrlPath('/Images/bg_color_3.png')
const BgColorImg4 = getOssUrlPath('/Images/bg_color_4.png')
const BgColorImg5 = getOssUrlPath('/Images/bg_color_5.png')

const PowerNewImg1 = getOssUrlPath('/Images/power-new-1.png')
const PowerNewImg2 = getOssUrlPath('/Images/power-new-2.png')
const PowerNewImg3 = getOssUrlPath('/Images/power-new-3.png')
const PowerGrayImg1 = getOssUrlPath('/Images/power-gray-big-1.png')
const PowerGrayImg2 = getOssUrlPath('/Images/power-gray-big-2.png')
const PowerGrayImg3 = getOssUrlPath('/Images/power-gray-big-3.png')

const COPPER_MAP: { [key: number]: any } = {
  1: Copper1,
  2: Copper2,
  3: Copper3,
  4: Copper4,
  5: Copper5,
}

const BG_IMG_MAP: { [key: number]: any } = {
  1: BgImg1,
  2: BgImg2,
  3: BgImg3,
  4: BgImg4,
  5: BgImg5,
}
const BG_COLOR_IMG_MAP: { [key: number]: any } = {
  1: BgColorImg1,
  2: BgColorImg2,
  3: BgColorImg3,
  4: BgColorImg4,
  5: BgColorImg5,
}
const BG_GRADIENT_MAP: { [key: number]: any } = {
  1: ['#D9978A', '#91564A'],
  2: ['#789ECF', '#4365A2'],
  3: ['#C9A75F', '#9A6900'],
  4: ['#9CA4D5', '#55586C'],
  5: ['#585860', '#24242A'],
}

const COLOR_MAP: { [key: number]: any } = {
  1: '#91564A',
  2: '#3360AD',
  3: '#946903',
  4: '#55586C',
  5: '#F4D9A5',
}

// 给个默认值，如果匹配不上的话
const DEFAULT_COLOR = '#3360AD'
const DEFAULT_BG_IMG = BgImg2
const DEFAULT_BG_COLOR_IMG = BgColorImg2
const DEFAULT_COPPER = Copper2

const RIGHTS_IMG_MAP: { [key: number]: any } = {
  1: PowerNewImg1,
  2: PowerNewImg2,
  3: PowerNewImg3,
  4: PowerGrayImg1,
  5: PowerGrayImg2,
  6: PowerGrayImg3,
}

const RIGHTS_COLOR_MAP: { [key: number]: any } = {
  1: 'red',
  2: 'blue',
  3: 'yellow',
}

interface MemberPowerProps {
  /**
   * 会员等级
   */
  // level: number;
  /**
   * 会员Id
   */
  upperMemberId: string
  /**
   * 会员角色Id
   */
  upperRoleId: string
  /** 是否为店铺会员** */
  isShop?: boolean

  needHead?: boolean
}
interface EquityProps {
  /** 标题** */
  cardTitle?: string
  /** 居中标题** */
  centerTitle?: string
  /** 是否需要说明* */
  needIllustrate?: boolean
  /** 横向/纵向* */
  isRow?: boolean
  /** 跳转到权益记录* */
  toEquityRecord?: Function
  /** *内容** */
  powerInfoEquity: {
    /**
     * 权益Id
     */
    id: number
    /**
     * 权益类型枚举：1-价格权益，2-返现权益，3-积分权益
     */
    rightTypeEnum: number
    /**
     * 权益名称
     */
    name: string
    /**
     * 权益说明
     */
    remark: string
    /**
     * 权益获取方式
     */
    acquireWay: string
    /**
     * 参数设置方式
     */
    paramWay: string
    /**
     * 参数
     */
    parameter: string
    /**
     * 状态:0-无效1-有效
     */
    status: number
  }[]
}
export const Equity: React.FC<EquityProps> = (props: EquityProps) => {
  const intl = useIntl()
  Equity.defaultProps = {
    cardTitle: intl.formatMessage({ id: 'member.components.power_equity_title', defaultMessage: '当前权益' }),
    centerTitle: '',
    needIllustrate: false,
    isRow: false,
    toEquityRecord: () => {},
  }
  const { powerInfoEquity, cardTitle, centerTitle, needIllustrate, isRow, toEquityRecord = () => {} } = props
  const RIGHTS_TEXT_MAP: { [key: number]: any } = {
    1: intl.formatMessage({ id: 'member.components.power_rightText_1', defaultMessage: '折扣' }),
    2: intl.formatMessage({ id: 'member.components.power_rightText_2', defaultMessage: '返现' }),
    3: intl.formatMessage({ id: 'member.components.power_rightText_3', defaultMessage: '积分' }),
  }
  const showDiscount = (item) => {
    let title = ''
    switch (item) {
      case 1:
        title = intl.formatMessage({
          id: 'member.components.power_equity_discount_1',
          defaultMessage: '交易一方能获得另一方的价格折扣',
        })
        break
      case 2:
        title = intl.formatMessage({
          id: 'member.components.power_equity_discount_2',
          defaultMessage: '交易一方能获得另一方的交易返现',
        })
        break
      case 3:
        title = intl.formatMessage({
          id: 'member.components.power_equity_discount_3',
          defaultMessage: '交易一方能获得另一方的积分',
        })
        break
      default:
        title = ''
    }
    Toast.show({ icon: 'none', title: title })
  }
  const renderProductItem = (item: any, index: number) => {
    // const { item } = items;
    return (
      <View className={styles['equity-body']} style={{ width: '100%' }} key={`product-${index}`}>
        <View className={styles['equity-body-left']}>
          <View className={styles['member-power-RAI-item-icon']}>
            <Image
              src={RIGHTS_IMG_MAP[item.rightTypeEnum]}
              style={{ width: pxTransform(40), height: pxTransform(40) }}
            />
          </View>
          <View className={styles['equity-body-center']}>
            <Text className={styles['member-power-integral-introduce-item-name']}>{item.name}</Text>
            <Text className={styles['member-power-integral-introduce-item-desc']} style={{ marginTop: pxTransform(0) }}>
              {item.remark}
            </Text>
          </View>
        </View>
        <View className={styles['member-power-RAI-item-desc-wrap']}>
          <Text
            className={`${styles['member-power-RAI-item-desc']} ${
              styles[`member-power-RAI-item-desc-${RIGHTS_COLOR_MAP[item.rightTypeEnum]}`]
            }`}
          >
            {item.parameter}
            {RIGHTS_TEXT_MAP[item.rightTypeEnum]}
          </Text>
        </View>
      </View>
    )
  }
  return (
    <>
      <View className={styles['member-power-RAI']} style={{ width: '100%' }}>
        <MellowCard
          title={cardTitle}
          extra={
            needIllustrate && (
              <View onClick={() => toEquityRecord()}>
                <Text style={{ fontSize: pxTransform(12), color: '#8F7564' }}>
                  {intl.formatMessage({ id: 'member.components.power_equity_extra', defaultMessage: '权益记录' })}
                  <Icons customStyle={{ marginLeft: pxTransform(6) }} name="ChevronRight" size={14} color="#8F7564" />
                </Text>
              </View>
            )
          }
          bodyStyle={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          {!!centerTitle && (
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: pxTransform(20),
              }}
            >
              <Text style={{ fontSize: pxTransform(16), color: '#1F2C3D' }}>{centerTitle}</Text>
            </View>
          )}
          {isRow && (
            <Grid border={false}>
              {powerInfoEquity.map((item) => (
                <Grid.Item
                  contentStyle={{ paddingVertical: pxTransform(0) }}
                  key={item.rightTypeEnum}
                  onClick={() => showDiscount(item.rightTypeEnum)}
                >
                  <View className={styles['member-power-RAI-item']}>
                    <View className={styles['member-power-RAI-item-icon']}>
                      <Image
                        src={
                          RIGHTS_IMG_MAP[
                            item.rightTypeEnum +
                              (centerTitle ===
                              intl.formatMessage({
                                id: 'member.components.apply_powerInfoEquity_title',
                                defaultMessage: '入会享特权',
                              })
                                ? 3
                                : 0)
                          ]
                        }
                        style={{ width: pxTransform(40), height: pxTransform(40) }}
                      />
                    </View>
                    <Text className={styles['member-power-RAI-item-name']}>{item.name}</Text>
                    <View className={styles['member-power-RAI-item-desc-wrap']}>
                      <Text className={styles['member-power-RAI-item-desc']}>
                        {item.parameter}
                        {RIGHTS_TEXT_MAP[item.rightTypeEnum]}
                      </Text>
                    </View>
                  </View>
                </Grid.Item>
              ))}
            </Grid>
          )}
          {!isRow && (
            <ScrollView scrollY>
              {powerInfoEquity?.map((item, index) => {
                return renderProductItem(item, index)
              })}
            </ScrollView>
          )}
        </MellowCard>
      </View>
    </>
  )
}
const MemberPower: React.FC<MemberPowerProps> = (props: MemberPowerProps) => {
  MemberPower.defaultProps = {
    isShop: false,
    needHead: false,
  }
  const {
    userStore: { userInfo, shopAndSite },
  } = useStores()
  const { upperMemberId, upperRoleId, isShop, needHead } = props
  const [powerInfo, setPowerInfo] = useState<any>()
  const [level, setLevel] = useState<number>(0)
  const [couponNum, setCouponNum] = useState<number>(0)
  const [shopInfo, setShopInfo] = useState<any>({})
  const [moneyInfo, setMoneyInfo] = useState<any>({})
  const [showCoupon, setShowCoupon] = useState(false)
  const [toggle, setToggle] = useState(false) // 控制显示弹出
  const intl = useIntl()

  /* 会员信息 */
  const getPowerInfo = () => {
    let api = getMemberMobileInfoDetailLevelRightBasic
    let param: any = {
      shopType: 1,
      self: shopAndSite?.isSelf ? 1 : 0,
      isSelf: shopAndSite?.isSelf,
    }

    if (shopAndSite?.isSelf) {
      param.upperMemberId = shopAndSite?.memberId
      param.upperRoleId = shopAndSite?.memberRoleId
    }

    if (isShop) {
      new Promise((resolve) => {
        api = getMemberMobileInfoShopLevelRightBasic
        param = {
          upperMemberId,
          upperRoleId,
        }
        resolve('')
      })
        .then(() => {
          const shopParam: any = {
            shopId: shopAndSite?.id || 0,
            memberId: upperMemberId,
            roleId: upperRoleId,
          }
          getMarketingMobileCouponDetailCount(shopParam).then((res) => {
            if (res.code === 1000) {
              setCouponNum(res.data.receiveCount)
            }
          })
          return shopParam
        })
        .then((shopParam) => {
          getCommodityMobileStoreMobileFindByMemberIdAndRoleId(shopParam).then((res) => {
            if (res.code === 1000) {
              setShopInfo(res.data)
            }
          })
        })
        .then(() => {
          const manyParam = {
            parentMemberId: upperMemberId,
            parentMemberRoleId: upperRoleId,
          }
          getPayMobileAssetAccountGetUserAssetAccount(manyParam).then((res) => {
            if (res.code === 1000) {
              setMoneyInfo(res.data)
            }
          })
        })
      getOrderMobileCommonBalanceTypeFind().then((res) => {
        setShowCoupon(!!res.data?.status)
      })
    }
    new Promise((resolve) => {
      api(param)
        .then((res: { code: number; data: { level: React.SetStateAction<number> } }) => {
          if (res.code === 1000) {
            setPowerInfo(res.data)
            setLevel(res.data.level)
            resolve(res.data)
          }
        })
        .catch(() => {})
        .finally(() => {
          // setLoading(false);
        })
    })
  }
  /* 权益记录 */
  const toEquityRecord = () => {
    Router.navigateTo('members/equityRecord', {
      upperMemberId,
      upperRoleId,
      isShop: isShop || '',
    })
  }
  /* 活跃分记录 */
  const toActiveRecord = () => {
    Router.navigateTo('members/activeRecord', {
      upperMemberId,
      upperRoleId,
      isShop: isShop || '',
    })
  }
  useEffect(() => {
    if (!userInfo) {
      setToggle(true)
    } else {
      getPowerInfo()
    }
  }, [upperMemberId, upperRoleId])
  const handleBack = () => {
    Router.navigateBack()
  }
  const statistic_bodyStyle = { height: '100%', justifyContent: 'space-between' }
  const PlaceholderView = <View className={styles['bg-big-parent']} />

  const currentLevel = useMemo(() => {
    return level > 5 ? 5 : level || 2
  }, [level])

  return (
    <View className={styles.memberPower}>
      <View
        style={{
          width: '100%',
          backgroundImage: `linear-gradient(to Bottom , ${BG_GRADIENT_MAP[currentLevel][0]}, ${BG_GRADIENT_MAP[currentLevel][1]})`,
        }}
      >
        {needHead && (
          <Header
            title={
              <Text
                style={{
                  lineHeight: pxTransform(60),
                  fontSize: pxTransform(16),
                  textAlign: 'center',
                  color: '#FFF',
                }}
              >
                {intl.formatMessage({ id: 'member.components.power_header_title', defaultMessage: '会员中心' })}
              </Text>
            }
            customRenderLeft={
              <View style={{ flex: 2 }} onClick={handleBack}>
                <Icons name="ChevronLeft" size={24} color="#FFF" />
              </View>
            }
            customStyle="background:rgba(0,0,0,0)"
          />
        )}
        <View style={{ display: 'flex', justifyContent: 'center' }}>
          <View className={styles['member-power-level']}>
            {powerInfo &&
              new Array(3).fill(1).map((_item, index) => {
                if ((index === 0 && level === 1) || (index === 2 && !powerInfo?.nextLevelTag)) {
                  return PlaceholderView
                }
                return (
                  <View className={styles['bg-big-parent']} key={`${_item}_${index}`}>
                    <View
                      style={{
                        background: `no-repeat url(${
                          BG_COLOR_IMG_MAP[level + index > 5 ? 5 : level - 1 + index] || DEFAULT_BG_COLOR_IMG
                        })`,
                        backgroundSize: '100%',
                        // backgroundPosition: "0 50%"
                      }}
                      className={styles['member-power-level-head-ship']}
                    >
                      <View className={styles['member-power-level-head']}>
                        <Image
                          src={BG_IMG_MAP[level + index > 5 ? 5 : level - 1 + index] || DEFAULT_BG_IMG}
                          style={{
                            width: pxTransform(80),
                            height: pxTransform(80),
                            position: 'absolute',
                            top: 0,
                            right: 0,
                          }}
                        />
                        <View className={styles['member-power-level-wrap']}>
                          <View className={styles['member-power-level-copper']}>
                            <Image
                              src={COPPER_MAP[level + index > 5 ? 5 : level - 1 + index] || DEFAULT_COPPER}
                              className={styles['member-power-level-copper']}
                            />
                          </View>
                          <Text
                            className={styles['member-power-level-name']}
                            style={{
                              color: COLOR_MAP[level + index > 5 ? 5 : level - 1 + index] || DEFAULT_COLOR,
                            }}
                          >
                            {powerInfo?.levelTag}
                          </Text>
                          <View
                            className={styles['member-power-level-icon']}
                            style={{
                              border: `0.5px solid ${
                                COLOR_MAP[level + index > 5 ? 5 : level - 1 + index] || DEFAULT_COLOR
                              }`,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: pxTransform(10),
                                color: COLOR_MAP[level + index > 5 ? 5 : level - 1 + index] || DEFAULT_COLOR,
                              }}
                            >
                              {intl.formatMessage({
                                id: 'member.components.power_current_level',
                                defaultMessage: '当前等级',
                              })}
                            </Text>
                          </View>
                        </View>
                        <View className={styles['member-power-level-score']}>
                          <View className={styles['member-power-level-score-label']}>
                            <Text
                              style={{
                                color: COLOR_MAP[level + index > 5 ? 5 : level - 1 + index] || DEFAULT_COLOR,
                              }}
                              onClick={toActiveRecord}
                            >
                              {intl.formatMessage({
                                id: 'member.components.power_current_record',
                                defaultMessage: '当前活跃分',
                              })}{' '}
                              <Icons
                                name="ChevronRight"
                                size={12}
                                color={COLOR_MAP[level + index > 5 ? 5 : level - 1 + index] || DEFAULT_COLOR}
                              />
                            </Text>
                          </View>
                          <Progress
                            percent={
                              powerInfo && powerInfo.score && powerInfo.nextScore
                                ? +(powerInfo.score / powerInfo.nextScore).toFixed(2) * 100
                                : 0
                            }
                            color={COLOR_MAP[level + index > 5 ? 5 : level - 1 + index] || DEFAULT_COLOR}
                            borderRadius={50}
                            showInfo={false}
                          />
                          <View className={styles['member-power-level-score-wrap']}>
                            <View className={styles['member-power-level-score-number']}>
                              <Text
                                style={{
                                  color: COLOR_MAP[level + index > 5 ? 5 : level - 1 + index] || DEFAULT_COLOR,
                                }}
                              >
                                {powerInfo?.score}
                                {powerInfo && powerInfo.nextScore ? `/${powerInfo.nextScore}` : ''}
                              </Text>
                            </View>
                            <View className={styles['member-power-level-score-next']}>
                              <Text
                                style={{
                                  color: COLOR_MAP[level + index > 5 ? 5 : level - 1 + index] || DEFAULT_COLOR,
                                }}
                              >
                                {powerInfo?.nextLevelTag}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
          </View>
        </View>
      </View>
      <View className={styles['member-power-level-body']}>
        <View className={styles['member-power-level-foot']}>
          <Grid column={isShop ? 3 : 2} border={false}>
            <Grid.Item>
              <Statistic
                bodyStyle={statistic_bodyStyle}
                titleStyle={{ color: '#5A2A12', marginBottom: pxTransform(16) }}
                valueStyle={{ color: '#C45124', fontSize: pxTransform(20) }}
                title={intl.formatMessage({
                  id: 'member.components.power_level_1',
                  defaultMessage: '累计返现金额(元)',
                })}
                value={
                  powerInfo && powerInfo.sumReturnMoney
                    ? Number(powerInfo.sumReturnMoney)
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0
                }
              />
            </Grid.Item>
            <Grid.Item
              onClick={() => {
                !isShop && !shopAndSite?.isSelf
                  ? Router.navigateTo('extra/integralMall', { hasBack: true })
                  : Router.navigateTo('shop/pointExchange', {
                      shopId: !shopAndSite?.isSelf ? shopInfo.id : shopAndSite?.memberId,
                      logo: powerInfo.logo,
                      memberName: shopInfo.name,
                      memberId: upperMemberId || powerInfo.upperMemberId,
                      roleId: upperRoleId || powerInfo.upperRoleId,
                    })
              }}
            >
              <Statistic
                bodyStyle={statistic_bodyStyle}
                titleStyle={{ color: '#5A2A12', marginBottom: pxTransform(16) }}
                valueStyle={{ color: '#C45124', fontSize: pxTransform(20) }}
                title={intl.formatMessage({ id: 'member.components.power_level_2', defaultMessage: '可用积分' })}
                value={
                  powerInfo && powerInfo.currentPoint
                    ? Number(powerInfo.currentPoint)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0
                }
              />
            </Grid.Item>
            {isShop && (
              <Grid.Item
                onClick={() => {
                  Router.navigateTo('members/myCoupon', {
                    mode: '1',
                    memberId: upperMemberId,
                    roleId: upperRoleId,
                    isShop: true,
                  })
                }}
              >
                <Statistic
                  bodyStyle={statistic_bodyStyle}
                  titleStyle={{ color: '#5A2A12', marginBottom: pxTransform(16) }}
                  valueStyle={{ color: '#C45124', fontSize: pxTransform(20) }}
                  title={intl.formatMessage({ id: 'member.components.power_coupon', defaultMessage: '优惠券' })}
                  value={couponNum}
                />
              </Grid.Item>
            )}
            {!isShop && (
              <View
                onClick={() => {
                  Router.navigateTo('extra/integralMall', { hasBack: true })
                }}
                style={{ position: 'absolute', right: pxTransform(12), bottom: pxTransform(16) }}
              >
                <Icons name="ChevronRight" size={14} color="#8F7564" />
              </View>
            )}
          </Grid>
        </View>
        {isShop && showCoupon && (
          <View className={`${styles['member-power-record']} ${styles['member-power-level-foot1']}`}>
            <View>
              <Text style={{ fontSize: pxTransform(12), color: '#5A2A12' }}>
                {intl.formatMessage({ id: 'member.components.power_level_3', defaultMessage: '可用余额(元)' })}
              </Text>
            </View>
            <View
              onClick={() => {
                Router.navigateTo('basicSetting/normalAccountDetail', {
                  upperMemberId,
                  upperRoleId,
                })
              }}
            >
              <Text style={{ fontSize: pxTransform(16), color: '#8F7564' }}>
                {Number(moneyInfo?.accountBalance - moneyInfo?.lockBalance || 0)
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
              <Icons name="ChevronRight" size={14} color="#8F7564" customStyle={{ marginTop: pxTransform(4) }} />
            </View>
          </View>
        )}
        <ScrollView style={{ flex: 1 }}>
          {powerInfo && <Equity powerInfoEquity={powerInfo.rights} needIllustrate toEquityRecord={toEquityRecord} />}
        </ScrollView>
      </View>
      <Modal
        title={intl.formatMessage({
          id: 'member.components.apply.modal_defaultContent',
          defaultMessage: '成为本店会员需先登录账号，如果未注册账号请先注册成功后再申请',
        })}
        isOpened={toggle}
        onConfirm={() => Router.navigateTo('user/login')}
        onCancel={() => Router.navigateTo('user/register')}
        cancelText={intl.formatMessage({
          id: 'member.components.apply.modal_registerBtnText',
          defaultMessage: '注册账号',
        })}
        confirmText={intl.formatMessage({ id: 'member.components.apply.modal_loginBtnText', defaultMessage: '登录' })}
        className={styles['member-model']}
      />
    </View>
  )
}

export default MemberPower
