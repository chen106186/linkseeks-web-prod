import GlobalWrapper from '@/components/GlobalWrapper'
import { getIntl, useIntl } from '@linkseeks/i18n'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image, Icons, ScrollView } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { DISTRIBUTION_INVITATION_CODE, USER_INFO } from '@/constants/storage'
import {
  pxTransform,
  showToast,
  showLoading,
  hideLoading,
  useRouter,
  getStorageSync,
  useShareAppMessage,
} from '@apps/mobile-services/utils/taro'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import { removeAsyncStorage } from '@apps/mobile-services/utils/storage'
import styles from './index.module.scss'
import cx from 'classnames'
import {
  getMarketingMobileSocialDistributionStaffCheck,
  postMarketingMobileSocialDistributionStaffJoin,
} from '@apps/apis'
import useGetShareQRCodes from '../../hooks/useGetShareQRCodes'
import Progress from '@/components/Progress'
import NavBar from '@/components/NavBar'
import Taro from '@tarojs/taro'
import ShareModal from '@/packages/distribution/components/ShareModal/invitationShare'

const applyBgImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/dis-apply-bg.png'
const addShopImg = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/addshop-img.png'
const downloadIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/download-icon.png'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      poster: any
    }
  }
}
const DistributionApply = () => {
  const intl = useIntl()
  // 接收路由参数
  const routerInfo = useRouter() || {}
  const params = routerInfo.params || {}
  const [applyInfo, setApplyInfo] = useState<any>(null)
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [isChangeAdd, setIsChangeAdd] = useState(false)
  const [imgBgSrc, setImgBgSrc] = useState('')
  const [imgCodeSrc, setImgCodeSrc] = useState('')
  const [inviterAccount, setInviterAccount] = useState('')
  const [invitationCode, setInvitationCode] = useState('')
  const posterRef = useRef()
  const [downloadTrigger, setDownloadTrigger] = useState(0)
  const canvasWidth = 400
  const canvasHeight = 564

  // 页面初始化
  useEffect(() => {
    const init = async () => {
      // 获取缓存中账户信息
      const userInfoStr = getStorageSync(USER_INFO)
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        // 邀请人账号
        setInviterAccount(userInfo.account)
      }
      // 邀请码
      const invitationCode = await getStorageSync(DISTRIBUTION_INVITATION_CODE)
      if (invitationCode) {
        setInvitationCode(invitationCode)
      }
      getApplyInfo()
    }
    init()
  }, [params])

  // 获取分享二维码自动触发hook
  const pages = [
    {
      key: 'shop',
      pagePath: 'packages/distribution/pages/addShop/index',
      // 传邀请人账号,商城属性,是否为自营商城
      getScene: ({ account }) => `a=${account}`,
      requiredParams: ['account'] as const,
    },
  ]
  const ready = !!inviterAccount
  const { qrMap, qrLoading } = useGetShareQRCodes({
    ...(ready ? { account: inviterAccount } : {}),
    pages,
  })

  const getApplyInfo = async () => {
    showLoading({
      title: intl.formatMessage({ id: 'distribution.jiazaizhong', defaultMessage: '加载中' }),
      mask: true,
    })
    try {
      // 查看缓存中是否存在用户信息
      const userInfo = await getStorageSync(USER_INFO)
      if (!userInfo || Object.keys(userInfo).length === 0) {
        return
      }
      // 已登录
      const res = await getMarketingMobileSocialDistributionStaffCheck()
      if (res.code === 1000) {
        const data = res.data
        const info = {
          ifStaff: data.ifStaff,
          ifMember: data.ifMember,
          showApplicationEntry: data.showApplicationEntry,
          applicationConditions: data.applicationConditions,
          requiredOrderAmount: data.requiredOrderAmount,
          requiredOrderAmountCompleted: data.requiredOrderAmountCompleted,
          requiredSuccessfulInviteCount: data.requiredSuccessfulInviteCount,
          requiredSuccessfulInviteCountCompleted: data.requiredSuccessfulInviteCountCompleted,
          ruleDescription: data.ruleDescription,
          status: data.status,
          showName: data.showName,
        }
        setApplyInfo(info)
      }
    } catch (error) {
      showToast({
        title: intl.formatMessage({
          id: 'distribution.huoqushujushibai',
          defaultMessage: '获取数据失败',
        }),
        icon: 'none',
      })
    } finally {
      hideLoading()
    }
  }

  const tagStyle = {
    video: 'width: 100%;',
  }

  // 计算进度条百分比
  const percentCount = (() => {
    if (!applyInfo) return 0
    if (applyInfo.applicationConditions === 0) {
      // 已消费金额
      const done = Number(applyInfo.requiredOrderAmountCompleted)
      // 总需消费金额
      const total = Number(applyInfo.requiredOrderAmount)
      return total ? Math.min(100, Math.round((done / total) * 100)) : 0
    } else {
      // 已邀请人数
      const done = Number(applyInfo.requiredSuccessfulInviteCountCompleted)
      // 总需邀请人数
      const total = Number(applyInfo.requiredSuccessfulInviteCount)
      return total ? Math.min(100, Math.round((done / total) * 100)) : 0
    }
  })()

  // 判断条件二是否已完成
  const isFinished = () => {
    if (!applyInfo) return false
    if (applyInfo.ifStaff) return true
    if (applyInfo.applicationConditions === 0) {
      return Number(applyInfo.requiredOrderAmountCompleted) >= Number(applyInfo.requiredOrderAmount)
    } else {
      return Number(applyInfo.requiredSuccessfulInviteCountCompleted) >= Number(applyInfo.requiredSuccessfulInviteCount)
    }
  }

  // 条件一去完成-跳转注册页
  const toRegister = () => {
    Router.navigateTo('user/register')
  }
  // 条件二去完成-跳转商城首页
  const toAccomplish = () => {
    // applicationConditions 申请条件 0-商城消费 1-邀请注册
    if (applyInfo.applicationConditions === 0) {
      Router.navigateTo('extra/mall/client')
    } else {
      setImgBgSrc(addShopImg)
      setImgCodeSrc(qrMap.shop)
      setShareModalVisible(true)
    }
  }

  // 分享页面
  // 微信分享
  useShareAppMessage((res) => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '邀您加入商城',
        path: `/packages/distribution/pages/addShop/index?a=${inviterAccount}`,
      }
    }
    return {}
  })

  const actions = [
    {
      title: intl.formatMessage({
        id: 'distribution.components.shareModa.share.baocuntupian',
        defaultMessage: '保存图片',
      }),
      img: downloadIcon,
      key: 'bctp' as const,
    },
    {
      title: intl.formatMessage({
        id: 'commodityMerge.stocksSourcing.components.shareModal.share.wechat',
        defaultMessage: '微信',
      }),
      img: 'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/Images/wechat.png',
      key: 'wechat' as const,
    },
  ]

  // 保存图片
  const handleSaveImage = () => {
    Taro.getSetting({
      success(res) {
        const hasPermission = res.authSetting['scope.writePhotosAlbum']
        if (hasPermission) {
          // 已授权
          setDownloadTrigger((prev) => prev + 1)
        } else {
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 已授权
              setDownloadTrigger((prev) => prev + 1)
            },
          })
        }
      },
    })
  }

  const handlePosterSuccess = (e) => {
    const tempFilePath = e.detail
    console.log('海报生成成功', tempFilePath)
    Taro.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: () => {
        Taro.showToast({ title: '保存成功', icon: 'success' })
      },
      fail: (err) => {
        console.error('保存失败', err)
        Taro.showToast({ title: '保存失败', icon: 'error' })
      },
    })
  }

  // 立即加入分销
  const addDistribution = async () => {
    if (isChangeAdd) {
      return
    }
    if (applyInfo.ifStaff && applyInfo.status !== 1) {
      showToast({
        title: intl.formatMessage({
          id: 'distribution.fenxiaojinyonglianxiguanliyuan',
          defaultMessage: '该分销员已禁用，请联系管理员',
        }),
        icon: 'none',
      })
      setTimeout(() => {
        Router.navigateTo('extra/mine')
      }, 800)
      return
    }
    // 已是分销员并且未禁用状态
    if (applyInfo.ifStaff && applyInfo.status === 1) {
      Router.reLaunch('distribution/mine')
      return
    }
    // 条件一：是否是会员
    const conditionOne = applyInfo.ifMember
    // 条件二：是否完成邀请或消费
    const conditionTwo = isFinished()
    // 非被邀请人 才需要校验条件二
    const needCheckConditionTwo = !invitationCode

    if (!conditionOne) {
      showToast({
        title: intl.formatMessage({
          id: 'apply.nindangqianbumanzuofenxiaotiaojian',
          defaultMessage: '您当前不满足成为分销员条件',
        }),
        icon: 'none',
      })
      return
    }

    // 如果不是被邀请人，再判断是否完成邀请或消费
    if (needCheckConditionTwo) {
      if (!conditionTwo) {
        showToast({
          title: intl.formatMessage({
            id: 'apply.nindangqianbumanzuofenxiaotiaojian',
            defaultMessage: '您当前不满足成为分销员条件',
          }),
          icon: 'none',
        })
        return
      }
    }

    // 防止重复点击
    setIsChangeAdd(true)
    FullScreenLoading.show()
    try {
      const params: any = {}
      // 存在邀请码加入分销参数需携带
      if (invitationCode) {
        params.invitationCode = invitationCode
      }
      const res = await postMarketingMobileSocialDistributionStaffJoin(params)
      if (res.code === 1000) {
        showToast({
          title: res.message,
          icon: 'none',
        })
        // 请求成为分销员成功，存在邀请码的，删除邀请码缓存
        if (invitationCode) {
          removeAsyncStorage(DISTRIBUTION_INVITATION_CODE)
        }

        setTimeout(() => {
          Router.navigateTo('distribution/mine')
        }, 500)
      } else {
        showToast({
          title: res.message,
          icon: 'none',
        })
      }
    } finally {
      setIsChangeAdd(false)
      FullScreenLoading.hide()
    }
  }

  if (!applyInfo) {
    return null
  }

  // 加入分销条件一
  const renderConditionOneItem = () => {
    return (
      <View className={styles['condition']}>
        <View>
          <View>
            <Text style={{ marginRight: pxTransform(2) }}>
              {intl.formatMessage({ id: 'apply.tiaojianyi', defaultMessage: '条件一' })}
            </Text>
            {intl.formatMessage({ id: 'apply.zhuceshangchengzhanghu', defaultMessage: '注册商城账户' })}
          </View>
          <View className={styles['condition-desc']}>
            {intl.formatMessage({ id: 'apply.jiaruchengweishangchengyonghu', defaultMessage: '加入成为商城用户' })}
          </View>
        </View>
        {applyInfo?.ifMember ? (
          <View className={styles['finish']}>
            {intl.formatMessage({ id: 'apply.yiwancheng', defaultMessage: '已完成' })}
          </View>
        ) : (
          <View className={styles['unfinish']} onClick={() => toRegister()}>
            {intl.formatMessage({ id: 'apply.quwancheng', defaultMessage: '去完成' })}
          </View>
        )}
      </View>
    )
  }

  // 加入分销条件二
  const renderConditionTwoItem = () => {
    return (
      <View className={styles['condition']}>
        <View>
          <View>
            <Text style={{ marginRight: pxTransform(2) }}>
              {intl.formatMessage({ id: 'apply.tiaojianer', defaultMessage: '条件二' })}
            </Text>
            {applyInfo?.applicationConditions === 0 ? (
              // 累计消费
              <>
                {intl.formatMessage({ id: 'apply.leijixiaofeijine', defaultMessage: '累计消费金额' })}
                {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                {applyInfo?.requiredOrderAmount}
              </>
            ) : (
              // 累计邀请
              <>
                {intl.formatMessage({ id: 'apply.leijiyaoqingyonghu', defaultMessage: '累计邀请用户' })}
                {applyInfo?.requiredSuccessfulInviteCount}
                {intl.formatMessage({ id: 'apply.ren', defaultMessage: '人' })}
              </>
            )}
          </View>
          <View style={{ marginTop: pxTransform(8) }}>
            <Progress
              strokeColor="#00A98F"
              trailColor="rgba(0, 169, 143, 0.3)"
              strokeWidth={6}
              percent={percentCount}
              customRenderText={
                <View className={styles['progress-container']}>
                  <Text className={styles['progress-remain']}>
                    {/* 已完成数 */}
                    {applyInfo?.applicationConditions === 0
                      ? applyInfo?.requiredOrderAmountCompleted
                      : applyInfo?.requiredSuccessfulInviteCountCompleted}
                  </Text>
                  <Text>
                    {/* 需完成总数 */}/
                    {applyInfo?.applicationConditions === 0
                      ? applyInfo?.requiredOrderAmount
                      : applyInfo?.requiredSuccessfulInviteCount}
                  </Text>
                </View>
              }
            />
          </View>
        </View>
        <View>
          {isFinished() ? (
            <View className={styles['finish']}>
              {intl.formatMessage({ id: 'apply.yiwancheng', defaultMessage: '已完成' })}
            </View>
          ) : (
            <View className={styles['unfinish']} onClick={() => toAccomplish()}>
              {intl.formatMessage({ id: 'apply.quwancheng', defaultMessage: '去完成' })}
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <View className={styles['page']}>
      <View className={styles.bgImgBox}>
        <Image src={applyBgImg} mode="aspectFit" className={styles.img}></Image>
      </View>

      <View className={styles['contains']}>
        <NavBar
          customRenderLeft={
            <View style={{ flex: 1 }}>
              <Icons name="ChevronLeft" size={24} color="#fff" onClick={() => Router.navigateBack()} />
            </View>
          }
          customClassName={styles['nav-bar']}
        />

        <View className={styles['header-info']}>
          <View className={styles['header-info-title']}>
            {intl.formatMessage({ id: 'apply.chengwei', defaultMessage: '成为' })}
            {applyInfo?.showName}
          </View>
          <View>
            {intl.formatMessage({
              id: 'apply.zhulishangchangtuiguangfulifanxianduoduo',
              defaultMessage: '助力商场推广 福利返现多多',
            })}
          </View>
        </View>
        <View className={styles['box']}>
          <View className={styles['box-header']}>
            <View className={styles['box-header-icon']}></View>
            <Text>
              {intl.formatMessage({ id: 'apply.shenqing', defaultMessage: '申请' })}
              {applyInfo?.showName}
            </Text>
          </View>
          {/* 加入分销条件一 */}
          {renderConditionOneItem()}
          {/* 加入分销条件二 */}
          {/* 被邀请用户不展示条件二(邀请码不为空) */}
          {!invitationCode && renderConditionTwoItem()}
        </View>

        <View className={styles['box']} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <View className={styles['box-header']}>
            <View className={styles['box-header-icon']}></View>
            <Text>{intl.formatMessage({ id: 'apply.fenxiaoguize', defaultMessage: '分销规则' })}</Text>
          </View>
          <ScrollView scrollY className={styles['box-container']}>
            <parser html={applyInfo?.ruleDescription} tag-style={tagStyle} />
          </ScrollView>
        </View>

        <View className={styles['footer-view']}>
          <View onClick={() => addDistribution()} className={styles['add-btn']}>
            <Text>
              {!applyInfo.ifStaff
                ? `${intl.formatMessage({ id: 'apply.lijijiaru', defaultMessage: '立即加入' })}${
                    applyInfo?.showName || ''
                  }`
                : `${intl.formatMessage({ id: 'apply.ninyishi', defaultMessage: '您已是' })}${
                    applyInfo?.showName || ''
                  }`}
            </Text>
            {/*intl.formatMessage({ id: 'apply.ninyishifenxiaoyuan', defaultMessage: '您已是分销员' })*/}
          </View>
        </View>
      </View>

      <FullScreenLoading />

      {/* 分享modal */}
      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        bgImgSrc={imgBgSrc}
        codeImgSrc={imgCodeSrc}
        onSaveImage={handleSaveImage}
      />

      <poster
        ref={posterRef}
        width={canvasWidth}
        height={canvasHeight}
        backgroundUrl={imgBgSrc}
        qrCodeUrl={imgCodeSrc}
        downloadTrigger={downloadTrigger}
        drawType={'draw'}
        onSuccess={handlePosterSuccess}
      />
    </View>
  )
}

export default GlobalWrapper(DistributionApply)
