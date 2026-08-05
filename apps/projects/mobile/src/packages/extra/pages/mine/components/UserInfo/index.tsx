import React, { useEffect, useState } from 'react'
import { View, Text, Image, Toast, Input } from '@apps/mobile-ui'
import Popup from '@/components/Popup'
import { isWeChat } from '@/utils'
import { IS_WEB } from '@/constants'
import {
  getSupportMobileMessageUnreadCount,
  postMemberMobileBusinessLogoAdd,
  postMemberMobileBusinessDetailAdd,
} from '@apps/apis'
import { scanCode, pxTransform, showLoading, hideLoading, useDidShow } from '@apps/mobile-services/utils/taro'
import { userInfoType } from '@/store/userStore/model'
import useStores from '@/store/useStores'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import Grid from '@/components/Grid'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { getUrlParams } from '@/utils'
import styles from './index.module.scss'
import uploadFileRequest from '@/utils/uploadFileRequest'
import { getOssUrlPath } from '@apps/constants'

const finish = getOssUrlPath('/miniprogram/assets/images/Checked.svg')
const edit = getOssUrlPath('/miniprogram/assets/edit.png')
const logo = getOssUrlPath('/miniprogram/assets/images/default_logo.png')
const rightIcon = getOssUrlPath('/miniprogram/assets/images/rightIcon.svg')
const message = getOssUrlPath('/miniprogram/assets/images/message.svg')
const code = getOssUrlPath('/miniprogram/assets/images/code.svg')

type titleProps = {
  id: string
  defaultMessage: string
}

type collectionDataType = {
  collection: {
    title: titleProps
    count: number
  }
  footprint: {
    title: titleProps
    count: number
  }
  commodity: {
    title: titleProps
    count: Number
  }
  card: {
    title: titleProps
    count: Number
  }
}

/** 订单类型 */
type OrderScanCode = {
  path: string
  orderId: string
  buyerMemberId: string
  buyerroleId: string
}

/** 扫描二维码，登录 */
type LoginCodeParams = {
  authCode: string
  codeSign: string
}

/** 拼团 */
type GroupPurchaseType = {
  commodityId: string
  teamId: string
  shopId: string
  skuId?: string
  shopType: string
}

/** 商品详情 */
type CommodityType = {
  priceType: 1 | 2 | 3
  commodityId: string
  shopId: string
}

type ParamsTypes = OrderScanCode & LoginCodeParams & GroupPurchaseType & CommodityType

interface Iprops {
  userInfo: userInfoType | null
  collectionData: collectionDataType
  isSelf: boolean
  setUserInfo: (data: any) => void
}

const scanCodeFunc = async (
  options: Omit<Taro.scanCode.Option, 'fail' | 'success'>,
): Promise<Taro.scanCode.SuccessCallbackResult> => {
  return new Promise((resolve, reject) => {
    scanCode({
      ...options,
      success: (res: Taro.scanCode.SuccessCallbackResult) => {
        resolve(res)
      },
      fail: (res: TaroGeneral.CallbackResult) => {
        reject(res)
      },
    })
  })
}

const UserInfo: React.FC<Iprops> = (props: Iprops) => {
  const { collectionData, isSelf, setUserInfo } = props
  const keysSortedDesc = ['collection', 'footprint', 'commodity', 'card']
  const [visible, setVisible] = useState(false)
  const [nickName, setNickName] = useState('')
  const [keysSorted, setKeysSortedDesc] = useState(keysSortedDesc)
  const intl = useIntl()
  const { jmpProductDetailGroup } = useProductDetailJump()
  const [unReadCount, setUnReadCount] = useState<number>(0)
  const {
    userStore: { userInfo },
  } = useStores()
  const handleUpdateNickNme = async () => {
    const { code } = await postMemberMobileBusinessDetailAdd({
      memberName: nickName,
    })
    hideLoading()
    if (code === 1000) {
      setVisible(false)
      setUserInfo({
        ...userInfo,
        userName: nickName,
      })
    }
  }
  useDidShow(() => {
    const getUnReadCount = () => {
      getSupportMobileMessageUnreadCount().then((res) => {
        if (res.code === 1000 && res.data) {
          const count =
            res.data.afterSaleUnread +
            res.data.capitalUnread +
            res.data.marketingUnread +
            res.data.noticeUnread +
            res.data.purchaseUnread +
            res.data.systemUnread +
            res.data.tradeUnread
          setUnReadCount(count)
        }
      })
    }
    if (userInfo) {
      getUnReadCount()
    }
  })

  /* 没有登录显示 */
  const head = () => {
    if (userInfo) {
      return (
        <View className={styles['userInfo-company']}>
          {visible ? (
            <Input
              type="nickname"
              focus={true}
              className={styles['userInfo-input']}
              onChange={(val: string) => setNickName(val)}
              value={nickName}
            />
          ) : (
            <View className={styles['userInfo-loginOrRegister']}>{userInfo?.userName}</View>
          )}
          {visible ? (
            <Image src={finish} className={styles['userInfo-svg']} onClick={handleUpdateNickNme} />
          ) : (
            <Image
              src={edit}
              className={styles['userInfo-svg']}
              onClick={() => {
                setNickName(userInfo?.userName)
                setVisible(true)
              }}
            />
          )}

          {/* <Popup key="skuPopup" visible={visible} onClose={handleClosePopup} closeable>
            <View className={styles['popup']}>
              <Input
                type="text"
                className={styles['form-input']}
                placeholderClass={styles['form-input-placeholder']}
                onChange={(val: string) => setNickName(val)}
                value={nickName}
              />
            </View>
          </Popup> */}
        </View>
      )
    }
    return (
      <View onClick={() => console.log('跳转登录！')}>
        <Text className={styles['userInfo-loginOrRegister']} onClick={() => Router.navigateTo('user/login')}>
          {intl.formatMessage({ id: 'mine.denglu', defaultMessage: '登录' })}
        </Text>
        <Text className={styles['userInfo-loginOrRegister']}>/</Text>
        <Text className={styles['userInfo-loginOrRegister']} onClick={() => Router.navigateTo('user/register')}>
          {intl.formatMessage({ id: 'mine.zhuce', defaultMessage: '注册' })}
        </Text>
      </View>
    )
  }

  const handleJump = (item: 'commodity' | 'shop' | 'collection') => {
    const map = {
      collection: 'members/collection',
      footprint: 'basicSetting/footprint',
      commodity: 'members/myCoupon',
      card: 'members/card',
      // shop: '',
    }
    Router.navigateTo(map[item])
  }

  const handleBarCodeScanned = async () => {
    try {
      const { result } = await scanCodeFunc({})
      const params = getUrlParams<ParamsTypes>(result)
      if (params?.codeSign === 'login') {
        Router.navigateTo('user/scanLoginConfirm', { code: params.authCode })
        return
      }
      /** 拼团， 因为包含commodityId， 跟跳商品详情冲突了，所以优先级比较高 */
      if (params?.teamId) {
        jmpProductDetailGroup({
          commodityId: params?.commodityId,
          skuId: params?.skuId,
          h5ShopId: params.shopId,
          h5TeamId: params.teamId,
        })
        return
      }
      Toast.show({
        title: intl.formatMessage({ id: 'mine.benpingtaizanbuzhichigai', defaultMessage: '本平台暂不支持该二维码' }),
        icon: 'none',
      })
    } catch (e) {
      console.log(e)
      // Toast.show({ title: '本平台暂不支持该二维码', icon: 'none' })
    }
  }

  const handleChange = async (value: any[]) => {
    const item = value[0]
    // @tofix api
    const { data, code } = await postMemberMobileBusinessLogoAdd({
      logo: item.url,
    })
    hideLoading()
    if (code === 1000) {
      setUserInfo({
        ...userInfo,
        logo: item.url,
      })
    }
  }

  const uplaodFile = async ({ detail }) => {
    showLoading()
    const uploadResult = await uploadFileRequest([
      { fileName: detail.avatarUrl.split('/')[detail.avatarUrl.split('/').length - 1], path: detail.avatarUrl },
    ])
    if (uploadResult.length > 0) {
      handleChange(uploadResult)
    }
    return uploadResult
  }

  return (
    <View className={styles['userInfo']}>
      <View className={styles['userInfo-body']}>
        {userInfo ? (
          <button className={styles['userInfo-avatar']} openType="chooseAvatar" onChooseAvatar={uplaodFile}>
            <View className={styles['userInfo-avatar']}>
              <Image src={userInfo?.logo ? userInfo.logo : logo} className={styles['userInfo-img']} />
            </View>
          </button>
        ) : (
          <View className={styles['userInfo-avatar']}>
            <Image src={logo} className={styles['userInfo-img']} />
          </View>
        )}
        <View className={styles['userInfo-restContainer']}>
          <View className={styles['userInfo-section']}>{head()}</View>
          {(userInfo && (
            <>
              {!IS_WEB || (IS_WEB && isWeChat()) ? (
                <Image
                  src={code}
                  onClick={handleBarCodeScanned}
                  className={styles['userInfo-svg']}
                  style={{ marginRight: pxTransform(10) }}
                />
              ) : null}
              <Image
                src={rightIcon}
                onClick={() => Router.navigateTo('basicSetting/accountSettings')}
                className={styles['userInfo-svg']}
                style={{ marginRight: pxTransform(10) }}
              />
              <View className={styles['icon-wrap']}>
                {unReadCount > 0 && <View className={styles['unread-dot']}></View>}
                <Image
                  src={message}
                  onClick={() => Router.navigateTo('basicSetting/message')}
                  className={styles['userInfo-msg-svg']}
                />
              </View>
            </>
          )) ||
            null}
        </View>
      </View>
      <View className={styles['userInfo-footer']}>
        <Grid column={keysSorted.length}>
          {keysSorted.map(
            (item: any) =>
              (item !== 'card' || (item === 'card' && !isSelf)) && (
                <Grid.Item
                  key={item}
                  style={{ flex: 1 }}
                  contentStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
                >
                  <View className={styles['userInfo-item']} onClick={() => handleJump(item as any)}>
                    <Text className={styles['userInfo-count']}>
                      {collectionData ? (collectionData[item as keyof collectionDataType].count as any) : '0'}
                    </Text>
                    <Text className={styles['userInfo-title']}>
                      {collectionData
                        ? intl.formatMessage(collectionData[item as keyof collectionDataType].title)
                        : '0'}
                    </Text>
                  </View>
                </Grid.Item>
              ),
          )}
        </Grid>
      </View>
    </View>
  )
}
export default UserInfo
