import React, { useEffect, useRef, useState } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { getOssUrlPath } from '@apps/constants'
import { Image, Icons, View, Text, Button, Toast, Modal } from '@apps/mobile-ui'
import Rating from '@/components/Rating'
import { Equity } from '../MemberPower/index'
import ShopCreditInfo from '@/components/ShopCreditInfo'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import { THEME_COLORS } from '@/constants/theme'
import { ShopInfoType } from '@/store/templateStore/model'
import { useIntl } from '@linkseeks/i18n'
import {
  getCommodityMobileStoreMobileFindByMemberIdAndRoleId,
  getMemberMobileInfoApplyDepositDetail,
  postCommodityMobileStoreMobileCollect,
  postMemberMobileInfoApply,
} from '@apps/apis'
import { getMemberMobileInfoApplyRights } from '@apps/apis'
import styles from './index.module.scss'

interface MemberApplyComponentProps {
  shopInfo:
    | ShopInfoType
    | {
        memberId: number
        roleId: number
      }
  applyState: any
  noShop?: boolean
  updateApplyState: () => void
}
let showRes: any = null
const MemberApplyComponent = ({ shopInfo, applyState, noShop, updateApplyState }: MemberApplyComponentProps) => {
  const {
    userStore: { userInfo, shopAndSite, refreshUserInfo },
  } = useStores()
  const [toggle, setToggle] = useState(false) // 控制显示弹出
  const [modalText, setModalText] = useState<string>('')
  const [modalLeftText, setModalLeftText] = useState('')
  const [modalRightText, setModalRightText] = useState('')
  const [isCollected, setIsCollected] = useState(false)
  const collectLoading = useRef<boolean>(false)
  const [shopInfoTop, setShopInfoTop] = useState<any>(userInfo)
  const [powerInfoEquity, setPowerInfoEquity] = useState<any[]>([])
  const submitState = useRef<boolean>(true)
  const intl = useIntl()

  /* 进入调用 */
  const getMemberIdAndRoleId = () => {
    const param: any = {
      memberId: shopInfo?.memberId,
      roleId: shopInfo?.roleId,
    }
    getCommodityMobileStoreMobileFindByMemberIdAndRoleId(param).then((res) => {
      if (res.code === 1000) {
        setIsCollected(res.data.collectStatus)
        setShopInfoTop(res.data)
      }
    })
  }
  const getApplyRights = () => {
    const param: any = {
      upperMemberId: shopInfo?.memberId,
      upperRoleId: shopInfo?.roleId,
    }
    getMemberMobileInfoApplyRights(param).then((res) => {
      if (res.code === 1000) {
        setPowerInfoEquity(res.data)
      }
    })
  }
  useEffect(() => {
    if (!shopAndSite?.isSelf) {
      getMemberIdAndRoleId()
    }
    getApplyRights()
  }, [])
  /* 跳转申请页面 */
  const applyBecomeMember = () => {
    // 先查看是否入库资料
    const params: any = {
      upperMemberId: shopInfo?.memberId,
      upperRoleId: shopInfo?.roleId,
      status: Number(applyState?.status),
    }
    getMemberMobileInfoApplyDepositDetail(params).then((res) => {
      if (res.code === 1000) {
        if (res.data && res.data.length > 0) {
          Router.navigateTo('basicSetting/memberInfoEdit', {
            isShop: true,
            myTitle: intl.formatMessage({
              id: 'member.components.apply.linkPathTitle',
              defaultMessage: '填写会员信息',
            }),
            ...params,
          })
        } else if (res.data && res.data.length === 0) {
          postMemberMobileInfoApply(params).then((applyRes) => {
            if (applyRes.code === 1000) {
              Toast.show({
                icon: 'none',
                title: intl.formatMessage({ id: 'submitSuccess_section', defaultMessage: '提交成功' }),
              })
              refreshUserInfo()
              updateApplyState?.()
            } else {
              Toast.show({ icon: 'none', title: applyRes.message })
            }
          })
        }
      }
    })
  }
  /**
   * 申请成为会员
   */
  const applyToMember = () => {
    if (applyState?.disabled) {
      return
    }
    // 判断是否登录了
    if (userInfo) {
      if (submitState.current) {
        switch (String(applyState?.status)) {
          case '0':
            applyBecomeMember()
            break
          case '1':
            setModalText(
              intl.formatMessage({
                id: 'member.components.apply.state_1',
                defaultMessage: '您的账号还在审核中，请等待审核通过后再进行操作',
              }),
            )
            setModalLeftText(
              intl.formatMessage({ id: 'member.components.apply.modal_cancelBtnText', defaultMessage: '取消' }),
            )
            setModalRightText(
              intl.formatMessage({ id: 'member.components.apply.modal_confirmBtnText', defaultMessage: '确定' }),
            )
            setToggle(true)
            break
          case '3':
            setModalText(
              `${intl.formatMessage({
                id: 'member.components.apply.state_3',
                defaultMessage: '您的账号审核不通过，不通过原因',
              })}：${applyState.msg}`,
            )
            setModalLeftText(
              intl.formatMessage({ id: 'member.components.apply.modal_cancelBtnText', defaultMessage: '取消' }),
            )
            setModalRightText(
              intl.formatMessage({ id: 'member.components.apply.modal_submitBtnText', defaultMessage: '重新提交' }),
            )
            setToggle(true)
            break
          default:
            applyBecomeMember()
            break
        }
      }
    } else {
      setModalLeftText(
        intl.formatMessage({ id: 'member.components.apply.modal_registerBtnText', defaultMessage: '注册账号' }),
      )
      setModalRightText(
        intl.formatMessage({ id: 'member.components.apply.modal_loginBtnText', defaultMessage: '登录' }),
      )
      setModalText(
        intl.formatMessage({
          id: 'member.components.apply.modal_defaultContent',
          defaultMessage: '成为本店会员需先登录账号，如果未注册账号请先注册成功后再申请',
        }),
      )
      setToggle(true)
    }
  }

  /* 弹窗事件 */
  const handeConfirm = () => {
    if (userInfo) {
      if (String(applyState?.status) !== '1') {
        applyBecomeMember()
      }
      setToggle(false)
    } else {
      setToggle(false)
      Router.navigateTo('user/login')
    }
  }

  const handleModalCancel = () => {
    if (userInfo) {
      setToggle(false)
    } else {
      setToggle(false)
      Router.navigateTo('user/register')
    }
  }
  /* 收藏 */
  const handleCollect = () => {
    if (collectLoading.current) {
      return
    }
    const param: any = {
      id: shopInfoTop?.id,
      status: !isCollected,
    }
    postCommodityMobileStoreMobileCollect(param)
      .then((res) => {
        if (res.code === 1000) {
          if (showRes) {
            Toast.hide(showRes)
          }
          showRes = Toast.show({
            title: !isCollected
              ? intl.formatMessage({ id: 'member.components.apply_collect_success', defaultMessage: '收藏成功' })
              : intl.formatMessage({
                  id: 'member.components.apply_cancel_collect_success',
                  defaultMessage: '取消收藏成功',
                }),
          })
          setIsCollected(!isCollected)
          // DeviceEventEmitter.emit("collectShopChange");
        } else {
          Toast.show({ icon: 'none', title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }) })
        }
        collectLoading.current = false
      })
      .catch(() => {
        collectLoading.current = false
      })
  }
  /* 会员服务 */
  const handleJump = async () => {
    Router.navigateTo('basicSetting/webView', {
      columnType: '3',
      isMember: true,
      memberId: shopInfo?.memberId,
      roleId: shopInfo?.roleId,
    })
  }

  return (
    <View className={styles['member-scroll-body']}>
      <View className={styles['shop-info-container']}>
        <View className={styles['shop-info']}>
          <View
            className={styles['shop-name-line']}
            onClick={() => Router.navigateTo('shop/shopAbout', { shopInfo, type: 'shop' })}
          >
            {noShop && (
              <Image
                src={String(shopInfoTop.logo)}
                style={{
                  width: pxTransform(40),
                  height: pxTransform(40),
                  borderRadius: pxTransform(20),
                  marginRight: pxTransform(8),
                }}
              />
            )}
            <Text className={styles['shop-name']}>{shopInfoTop?.name}</Text>
            {!noShop && <Icons name="ChevronRight" size={14} color={THEME_COLORS.title} />}
          </View>
          {!noShop && (
            <View style={{ marginTop: pxTransform(4) }}>
              <View style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <ShopCreditInfo
                  creditPoint={shopInfoTop?.creditPoint || 0}
                  registerYears={shopInfoTop?.registerYears || 0}
                />
                <Rating
                  style={{ display: 'flex', marginLeft: pxTransform(10) }}
                  size={12}
                  betweenSize={1}
                  // disabled
                  count={5}
                  defaultValue={shopInfoTop?.avgTradeCommentStar || 0}
                />
              </View>
            </View>
          )}
        </View>
        {!noShop && (
          <View className={styles['collect-style']} onClick={handleCollect}>
            <Icons name={isCollected ? 'StarFill' : 'Star'} size={12} color={isCollected ? THEME_COLORS.primary : THEME_COLORS.title} />
            <Text
              style={{
                fontSize: pxTransform(10),
                marginLeft: pxTransform(4),
                color: isCollected ? THEME_COLORS.primary : THEME_COLORS.title,
              }}
            >
              {intl.formatMessage({ id: 'member.components.apply_collect', defaultMessage: '收藏' })}
            </Text>
          </View>
        )}
      </View>
      <View className={styles['body-img']}>
        <Image
          src={getOssUrlPath(`/Images/banner_1.png`)}
          style={{ width: '100%', height: pxTransform(140), borderRadius: pxTransform(8) }}
        />
        <View className={styles['register-btn']} onClick={() => applyToMember()}>
          <Text className={styles['register-btn-text']}>{applyState?.value}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Text className={styles['agreement-tip']}>
            {intl.formatMessage({ id: 'member.components.apply_agreement_tip', defaultMessage: '确定授权即同意' })}
          </Text>
          <Text className={styles['agreement-text']} onClick={handleJump}>
            《{intl.formatMessage({ id: 'member.components.apply_agreement_name', defaultMessage: '会员服务协议' })}》
          </Text>
        </View>
      </View>
      {powerInfoEquity && powerInfoEquity.length > 0 && (
        <Equity
          powerInfoEquity={powerInfoEquity}
          cardTitle=""
          centerTitle={intl.formatMessage({
            id: 'member.components.apply_powerInfoEquity_title',
            defaultMessage: '入会享特权',
          })}
          isRow
        />
      )}
      <Modal
        isOpened={toggle}
        onConfirm={handeConfirm}
        onCancel={handleModalCancel}
        cancelText={modalLeftText}
        confirmText={modalRightText}
        content={modalText}
        className={styles['member-model']}
      />
    </View>
  )
}

export default MemberApplyComponent
