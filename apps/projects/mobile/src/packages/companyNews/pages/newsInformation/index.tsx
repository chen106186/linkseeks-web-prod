import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useRef, useState } from 'react'
import { pxTransform, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { ScrollView, Image } from '@tarojs/components'
import { View, Text, Toast } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { IS_WEB } from '@/constants'
import { getDateDiff, dateFormat } from '@/utils/date'
import { numFormat } from '@/utils/numberFormat'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import DeviceEventEmitter from '@/utils/lib/DeviceEventEmitter'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import {
  getManageMobileInformationMobileDetail,
  getManageMobileMemberInformationMobileDetail,
  GetManageContentInformationFindByIdResponse,
  postManageMobileMemberInformationMobileCollect,
  postManageMobileInformationMobileCollect,
} from '@apps/apis'
import { getCommodityMobileShopMobileCheckShopMemberOperate } from '@apps/apis'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { THEME_COLORS } from '@/constants/theme'
let showRes: any = null
declare global {
  namespace JSX {
    interface IntrinsicElements {
      parser: any
    }
  }
}
const InformationDetail = () => {
  const intl = useIntl()
  const {
    userStore: { userInfo, shopAndSite },
  } = useStores()
  const { informationId } = getCurrentInstance()?.router?.params || {}
  // const contentWidth = useWindowDimensions().width;
  const [collectStatus, setCollectStatus] = useState<boolean>(false)
  const [informatioinDetail, setInformationDetail] = useState<GetManageContentInformationFindByIdResponse>()
  const rejRef = useRef<any>({})
  const tagStyle = {
    video: 'width: 100%;',
  }

  // const HOST = GlobalConfig.global.siteInfo.siteUrl

  const getInformationDetailById = () => {
    getCommodityMobileShopMobileCheckShopMemberOperate({
      shopId: String(shopAndSite?.id || ''),
    }).then((rej: { data: number }) => {
      rejRef.current = rej
      let fn
      if (rej.data === 1) {
        fn = getManageMobileMemberInformationMobileDetail
      } else {
        fn = getManageMobileInformationMobileDetail
      }
      fn({
        id: informationId as unknown as string,
      }).then((res) => {
        if (res.code === 1000) {
          setCollectStatus(res.data.collectStatus)
          setInformationDetail(res.data)
        }
      })
    })
  }
  usePageInit()
  useEffect(() => {
    if (informationId) {
      getInformationDetailById()
    }
    // setNavigationBarTitle({
    //   title: intl.formatMessage({ id: 'companyNews.zixunxiangqing', defaultMessage: '资讯详情' }),
    // })
  }, [])
  const handleCollect = () => {
    // 未登录状态
    if (!userInfo) {
      Router.navigateTo('user/login')
      return
    }
    const param: any = {
      informationId: Number(informationId),
      status: !collectStatus,
      memberId: shopAndSite?.memberId,
      roleId: shopAndSite?.memberRoleId,
    }
    let fn
    if (rejRef.current.data === 1) {
      fn = postManageMobileMemberInformationMobileCollect
    } else {
      fn = postManageMobileInformationMobileCollect
    }
    fn(param)
      .then((res) => {
        if (res.code === 1000) {
          if (showRes) {
            Toast.hide(showRes)
          }
          showRes = Toast.show({
            icon: 'none',
            title: collectStatus
              ? intl.formatMessage({
                  id: 'companyNews.quxiaoshoucangcheng',
                  defaultMessage: '取消收藏成功',
                })
              : intl.formatMessage({
                  id: 'companyNews.shoucangchenggong',
                  defaultMessage: '收藏成功',
                }),
          })
          DeviceEventEmitter.emit('collectCollectionChange')
          setCollectStatus(!collectStatus)
        } else {
          Toast.show({
            icon: 'none',
            title: intl.formatMessage({
              id: `${res.code}`,
              defaultMessage: res.message,
            }),
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return informatioinDetail ? (
    <View className={styles['news-detail-container']}>
      <ScrollView
        style={{
          flex: 1,
          paddingLeft: pxTransform(12),
          paddingRight: pxTransform(12),
          backgroundColor: '#fff',
        }}
      >
        <View className={styles['detail-panel']}>
          <View className={styles['detail-title']}>
            <Text className={styles['detail-title-text']}>{informatioinDetail.title}</Text>
          </View>
          <View className={styles['detail-date-info']}>
            <Text className={styles['create-time']}>
              {getDateDiff(dateFormat(new Date(informatioinDetail.createTime)))}
            </Text>
            <View className={styles['read-count']}>
              <View
                style={{
                  marginRight: pxTransform(17),
                  display: 'flex',
                }}
                onClick={handleCollect}
              >
                <Image
                  style={{
                    width: pxTransform(12),
                    height: pxTransform(12),
                  }}
                  src={collectStatus ? getOssUrlPath(`/Images/star-green.svg`) : getOssUrlPath(`/Images/star.svg`)}
                />
                <Text
                  style={{
                    color: collectStatus ? THEME_COLORS.primary : '#91959B',
                    marginLeft: pxTransform(5),
                  }}
                >
                  {collectStatus &&
                    intl.formatMessage({
                      id: 'companyNews.yi',
                      defaultMessage: '已',
                    })}
                  {intl.formatMessage({
                    id: 'companyNews.shoucang',
                    defaultMessage: '收藏',
                  })}
                </Text>
              </View>
              <Text>
                {intl.formatMessage({
                  id: 'companyNews.renkanguo',
                  defaultMessage: '{{data}} 人看过',
                  data: numFormat(informatioinDetail.readCount),
                })}
              </Text>
            </View>
          </View>
          <View className={styles['digest-box']}>
            <Text className={styles['digest-text']}>{informatioinDetail.digest}</Text>
          </View>
        </View>
        <View className={styles['html']}>
          {informatioinDetail?.content ? (
            IS_WEB ? (
              <View
                className={styles['taro_html']}
                dangerouslySetInnerHTML={{
                  __html: informatioinDetail?.content,
                }}
              ></View>
            ) : (
              <parser html={informatioinDetail.content} tag-style={tagStyle} />
            )
          ) : null}
        </View>
      </ScrollView>
    </View>
  ) : null
}
export default GlobalWrapper(InformationDetail)
