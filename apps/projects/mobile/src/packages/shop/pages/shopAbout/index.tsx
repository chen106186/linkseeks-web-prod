import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: Crayon
 * @Date: 2021-10-27 18:05:51
 * @LastEditTime: 2021-11-17 17:46:52
 * @LastEditors: Crayon
 * @Description:
 * @FilePath: \lingxi-mobile\src\packages\shop\pages\shopAbout\index.tsx
 */
import React, { useEffect, useState, useRef } from 'react'
import {
  getSystemInfoSync,
  setNavigationBarTitle,
  makePhoneCall,
  pxTransform,
  useRouter,
  showToast,
} from '@apps/mobile-services/utils/taro'
import { IS_WEB } from '@/constants'
import { View, Text, Icons, Toast, Image, ScrollView, ActionSheet, Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import ShopCreditInfo from '@/components/ShopCreditInfo'
import ImageBox from '@/components/ImageBox'
import Rating from '@/components/Rating'
// import { GlobalConfig } from "@/constants/global"
import { useStores } from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import {
  getCommodityMobileMemberSelfMobileMemberSelfMain,
  getCommodityMobileStoreMobileMemberShopMain,
  postCommodityMobileStoreMobileCollect,
} from '@apps/apis'
import { getMemberMobileBusinessDetailTag } from '@apps/apis'
import {
  getProductMobileShopSelfGetCustomerCategoryTree,
  getProductMobileShopStoreGetCustomerCategoryTree,
} from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { useCustomerService } from '@apps/services/customerService/useCustomerService'
import { useToggle } from '@linkseeks/hooks'
import CustomerServiceList from '@/components/CustomerServiceList'
const addressIcon = getOssUrlPath('/miniprogram/assets/images/address_icon.png')
const collectIcon = getOssUrlPath('/miniprogram/assets/images/collect_icon.png')
const collectedIcon = getOssUrlPath('/miniprogram/assets/images/collect_icon.svg')
const homeIcon = getOssUrlPath('/miniprogram/assets/images/home_icon.svg')
const kefuIcon = getOssUrlPath('/miniprogram/assets/images/kefu_icon.svg')
const phoneIcon = getOssUrlPath('/miniprogram/assets/images/phone_icon.png')
const renzhengIcon = getOssUrlPath('/miniprogram/assets/images/renzheng.png')
export interface ClassifyItem {
  /**
   * id
   */
  id: string
  /**
   * 父级id
   */
  parentId: string
  /**
   * 分类名称
   */
  name: string
  /**
   * logo
   */
  imageUrl: string
  /**
   * 是否选中
   */
  checked: boolean
  /**
   * 子分类
   */
  children?: ClassifyItem[]
}

// const { customerServiceInfo } = GlobalConfig.global
const customerServiceInfo = {}
let showRes: any = null
const About = () => {
  const { windowHeight, screenHeight } = getSystemInfoSync()
  const router = useRouter<{
    shopId: string
  }>()
  const {
    params: { shopId },
  } = router
  const {
    userStore: { shopAndSite },
    templateStore: { shopInfo: businessInfo, selfInfo },
  } = useStores()
  const { customerInfo } = useCustomerService()
  const type: string = shopAndSite?.isSelf ? 'own' : ''
  const [serviceVisible, toggleServiceVisible] = useToggle(false)
  const [collectStatus, setCollectStatus] = useState<boolean>(false)
  const [introduceVisible, setIntroduceVisible] = useState<boolean>(false)
  const [firstCategory, setFirstCategory] = useState<ClassifyItem[]>()
  const [memberBusinessDetail, setMemberBusinessDetail] = useState<any>()
  const [shopInfo, setShopInfo] = useState<any>(
    shopAndSite?.isSelf
      ? {
          ...selfInfo,
          memberId: shopAndSite?.memberId,
          logo: shopAndSite?.logoUrl,
          name: shopAndSite?.name,
          roleId: shopAndSite.memberRoleId,
        }
      : (businessInfo as any),
  )
  const safeBottom = getSystemInfoSync()?.safeArea?.bottom || 0
  const safePadding = IS_WEB ? 0 : screenHeight - safeBottom
  const collectLoading = useRef<boolean>(false)
  useEffect(() => {
    if (!shopAndSite?.isSelf) {
      if (!businessInfo && shopId) {
        getCommodityMobileStoreMobileMemberShopMain({
          shopId: String(shopAndSite?.id),
          storeId: shopId,
        }).then((res) => {
          if (res.code === 1000 && res.data) {
            setShopInfo(res.data)
            setCollectStatus(res.data.collectStatus)
          }
        })
      }
    } else {
      if (!selfInfo) {
        getCommodityMobileMemberSelfMobileMemberSelfMain({
          shopId: String(shopAndSite?.id),
          memberId: String(shopAndSite?.memberId),
        }).then((res) => {
          if (res.code === 1000 && res.data) {
            setShopInfo(res.data)
          }
        })
      }
    }
  }, [businessInfo, selfInfo])
  const intl = useIntl()
  usePageInit()
  useEffect(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'shop_about_navigationBarTitleText' }) })
    setCollectStatus(shopInfo?.collectStatus || false)
  }, [])
  const handleCollect = () => {
    if (collectLoading.current) {
      return
    }
    const param: any = {
      id: shopInfo?.id,
      status: !collectStatus,
    }
    collectLoading.current = true
    postCommodityMobileStoreMobileCollect(param)
      .then((res) => {
        if (res.code === 1000) {
          if (showRes) {
            Toast.hide(showRes)
          }
          showRes = Toast.show({
            title: !collectStatus
              ? intl.formatMessage({
                  id: 'shop_home_header_collect_success',
                })
              : intl.formatMessage({
                  id: 'shop_home_header_collect_cancel',
                }),
            icon: 'none',
          })
          setCollectStatus(!collectStatus)
        }
        collectLoading.current = false
      })
      .catch(() => {
        collectLoading.current = false
      })
  }
  const getMemberBusinessDetail = () => {
    const param: any = {
      memberId: shopInfo?.memberId,
      roleId: shopInfo?.roleId,
    }
    getMemberMobileBusinessDetailTag(param).then((res) => {
      if (res.code === 1000) {
        setMemberBusinessDetail(res.data)
      }
    })
  }
  const getCategoryTree = () => {
    let getFn: any = null
    const param: any = {}
    switch (type) {
      case 'own':
        param.memberId = shopInfo?.memberId
        getFn = getProductMobileShopSelfGetCustomerCategoryTree
        break
      default:
        param.storeId = String(shopInfo?.id)
        getFn = getProductMobileShopStoreGetCustomerCategoryTree
        break
    }
    if (getFn) {
      getFn(param).then((res) => {
        if (res.code === 1000) {
          setFirstCategory(res.data as unknown as ClassifyItem[])
        }
      })
    }
  }
  useEffect(() => {
    if (shopInfo) {
      getCategoryTree()
      getMemberBusinessDetail()
    }
  }, [shopInfo])
  const handleCallPhone = (phoneNumber: string | undefined) => {
    if (phoneNumber) {
      makePhoneCall({
        phoneNumber,
      })
    }
  }
  const renderBottom = () => {
    if (type === 'own') {
      return (
        <View
          className={styles['bottomBox']}
          style={{
            paddingBottom: safePadding ? `${safePadding}px` : '0px',
          }}
        >
          {customerServiceInfo?.id && (
            <View className={styles['iconBoxWrap']}>
              <Button
                className={styles['buttonBox']}
                onClick={toggleServiceVisible}
                // openType='contact'
                // sessionFrom={sessionFrom}
              >
                <View className={styles['iconBox']}>
                  <Image
                    style={{
                      width: pxTransform(24),
                      height: pxTransform(24),
                    }}
                    src={kefuIcon}
                  />
                  <Text className={styles['iconBoxText']}>
                    {intl.formatMessage({
                      id: 'shop_about_btn_customer_service',
                    })}
                  </Text>
                </View>
              </Button>
            </View>
          )}
          <View className={styles['registerBtn']} onClick={() => Router.reLaunch('extra/mall/own')}>
            <Text className={styles['registerBtnText']}>
              {intl.formatMessage({
                id: 'shop_about_btn_enterMall',
              })}
            </Text>
          </View>
        </View>
      )
    }
    return (
      <View
        className={styles['bottomBox']}
        style={{
          paddingBottom: safePadding ? `${safePadding}px` : '0px',
        }}
      >
        <View className={styles['iconBoxWrap']}>
          <View className={styles['iconBox']} onClick={handleCollect}>
            <Image
              style={{
                width: pxTransform(20),
                height: pxTransform(20),
              }}
              src={collectStatus ? collectedIcon : collectIcon}
            />
            <Text className={styles['iconBoxText']}>
              {collectStatus
                ? intl.formatMessage({
                    id: 'shop_home_header_collected_btn',
                  })
                : intl.formatMessage({
                    id: 'shop_home_header_collect_btn',
                  })}
            </Text>
          </View>
        </View>
        {customerInfo && (
          <View className={styles['iconBoxWrap']}>
            <Button className={styles['buttonBox']} onClick={toggleServiceVisible}>
              <View className={styles['iconBox']}>
                <Image
                  style={{
                    width: pxTransform(24),
                    height: pxTransform(24),
                  }}
                  src={kefuIcon}
                />
                <Text className={styles['iconBoxText']}>
                  {intl.formatMessage({
                    id: 'shop_about_btn_customer_service',
                  })}
                </Text>
              </View>
            </Button>
          </View>
        )}
        <View className={styles['registerBtn']} onClick={() => Router.navigateBack()}>
          <Text className={styles['registerBtnText']}>
            {intl.formatMessage({
              id: 'shop_about_btn_enterStore',
            })}
          </Text>
        </View>
      </View>
    )
  }
  const handleCategodyLink = (item: any) => {
    Router.navigateTo('commodityMerge/stocksSourcing/index', {
      id: ['own'].includes(type) ? shopInfo?.memberId : shopInfo?.id,
      categoryId: item.id,
      categoryName: item.name,
      type,
    })
  }
  return (
    <View className={styles['aboutContainer']}>
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        {/** 厂房照片 */}
        {shopInfo?.workshopPics && (
          <ScrollView
            className={styles['workshopPics']}
            scrollX
            horizontal
            data={shopInfo.workshopPics}
            renderItem={({ item: picItem }) => (
              <View className={styles['workshopPicsItem']} key={picItem}>
                <ImageBox
                  width={pxTransform(256)}
                  height={pxTransform(174)}
                  borderRadius={pxTransform(8)}
                  source={picItem || ''}
                  lazyLoad
                  canPreview
                />
              </View>
            )}
          />
        )}
        {/** 联系信息 */}
        <View className={styles['shopInfoCard']}>
          <View className={styles['shopInfoContainer']}>
            <Image
              style={{
                width: pxTransform(40),
                height: pxTransform(40),
                borderRadius: '50%',
                marginRight: pxTransform(16),
              }}
              src={shopInfo?.logo || ''}
            />
            <View className={styles['shopInfo']}>
              <View className={styles['shopNameLine']}>
                <Text className={styles['shopName']}>{shopInfo?.name || shopInfo?.memberName}</Text>
              </View>
              {type !== 'own' ? (
                <View
                  style={{
                    display: 'flex',
                  }}
                >
                  <View
                    style={{
                      display: 'flex',
                      flex: 1,
                      alignItems: 'center',
                    }}
                  >
                    <ShopCreditInfo
                      creditPoint={shopInfo?.creditPoint || 0}
                      registerYears={shopInfo?.registerYears || 0}
                    />
                  </View>
                  <View className={styles['startWrap']}>
                    <View className={styles['startGrade']}>{shopInfo?.avgTradeCommentStar || 0}</View>
                    <Rating
                      style={{
                        display: 'flex',
                      }}
                      size={16}
                      betweenSize={1}
                      count={5}
                      defaultValue={shopInfo?.avgTradeCommentStar || 0}
                      itemStyle={{
                        display: 'flex',
                      }}
                    />
                  </View>
                </View>
              ) : (
                <View className={styles['ownTag']}>
                  <Text className={styles['ownTagText']}>
                    {intl.formatMessage({
                      id: 'shop_about_tag_platform',
                      defaultMessage: '平台自营',
                    })}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {shopInfo?.phone && (
            <View
              className={`${styles.cardLine} ${styles.bottomBorder}`}
              onClick={() => handleCallPhone(shopInfo?.phone)}
            >
              <Image
                style={{
                  width: pxTransform(16),
                  height: pxTransform(16),
                }}
                src={phoneIcon}
              />
              <Text className={styles['cardLineText']}>{shopInfo?.phone}</Text>
              <Icons size={8} name="ChevronRight" color="#909399" />
            </View>
          )}
          {shopInfo?.address && (
            <View
              className={styles['cardLine']}
              // onClick={handleNavigationLocation}
            >
              <Image
                style={{
                  width: pxTransform(16),
                  height: pxTransform(16),
                }}
                src={addressIcon}
              />
              <Text className={styles['cardLineText']}>{shopInfo?.address}</Text>
              {/* <Icons size={8} name='ChevronRight' color='#909399' /> */}
            </View>
          )}
        </View>
        {/** 经营品类 */}
        {firstCategory && (
          <View className={styles['shopInfoCard']}>
            <View className={styles['cardTitleBox']}>
              <Text className={styles['cardTitle']}>
                {intl.formatMessage({
                  id: 'shop_about_main_category',
                })}
              </Text>
            </View>
            <ScrollView
              scrollX
              horizontal
              data={firstCategory}
              renderItem={({ item }) => (
                <View
                  className={styles['categoryItem']}
                  key={`categoryItem${item.id}`}
                  onClick={() => handleCategodyLink(item)}
                >
                  <Image
                    style={{
                      width: pxTransform(72),
                      height: pxTransform(72),
                      borderRadius: pxTransform(8),
                    }}
                    src={item.imageUrl}
                    lazyLoad
                  />
                  <Text className={styles['categoryName']}>{item.name}</Text>
                </View>
              )}
            />
          </View>
        )}
        {/** 实力档案 */}
        <View className={styles['strengthCardWrap']}>
          <View className={styles['strengthCardHeader']}>
            <Text className={styles['strengthCardHeaderText']}>
              {intl.formatMessage({
                id: 'shop_about_strength_title',
                defaultMessage: '实力档案 ',
              })}
            </Text>
            <View className={styles['strengthCardHeaderRight']}>
              <Image
                style={{
                  width: pxTransform(16),
                  height: pxTransform(16),
                  marginRight: pxTransform(4),
                }}
                src={renzhengIcon}
              />
              <Text className={styles['strengthCardHeaderRightText']}>
                {intl.formatMessage({
                  id: 'shop_about_strength_platform_auth',
                  defaultMessage: '平台认证 ',
                })}
              </Text>
            </View>
          </View>
          <View className={styles['strengthCardBody']}>
            <View className={styles['strengthCardTitleBox']}>
              {intl.formatMessage({
                id: 'shop_about_strength_card_title',
                defaultMessage: '公司信息',
              })}
            </View>
            <View className={styles['strengthCardDescription']}>
              <View className={styles['strengthCardLabel']}>
                {intl.formatMessage({
                  id: 'shop_about_strength_card_title',
                  defaultMessage: '公司名称',
                })}
                :
              </View>
              <View className={styles['strengthCardBrief']}>{memberBusinessDetail?.name}</View>
            </View>
            <View className={styles['strengthCardDescription']}>
              <View className={styles['strengthCardLabel']}>
                {intl.formatMessage({
                  id: 'shop_about_strength_card_legalPersonName',
                  defaultMessage: '企业法人',
                })}
                :
              </View>
              <View className={styles['strengthCardBrief']}>{memberBusinessDetail?.legalPersonName}</View>
            </View>
            <View className={styles['strengthCardDescription']}>
              <View className={styles['strengthCardLabel']}>
                {intl.formatMessage({
                  id: 'shop_about_strength_card_registeredCapital',
                  defaultMessage: '注册资本',
                })}
                :
              </View>
              <View className={styles['strengthCardBrief']}>{memberBusinessDetail?.registeredCapital}</View>
            </View>
            <View className={styles['strengthCardDescription']}>
              <View className={styles['strengthCardLabel']}>
                {intl.formatMessage({
                  id: 'shop_about_strength_card_establishmentDate',
                  defaultMessage: '成立时间',
                })}
                :
              </View>
              <View className={styles['strengthCardBrief']}>{memberBusinessDetail?.establishmentDate}</View>
            </View>
            <View className={styles['strengthCardDescription']}>
              <View className={styles['strengthCardLabel']}>
                {intl.formatMessage({
                  id: 'shop_about_strength_card_unifiedCreditCode',
                  defaultMessage: '统一信用代码',
                })}
                :
              </View>
              <View className={styles['strengthCardBrief']}>{memberBusinessDetail?.unifiedCreditCode}</View>
            </View>
            <View className={styles['strengthCardDescription']} onClick={() => setIntroduceVisible(true)}>
              <View className={styles['strengthCardLabel']}>
                {intl.formatMessage({
                  id: 'shop_about_strength_card_describe',
                  defaultMessage: '企业介绍',
                })}
                :
              </View>
              <View className={styles['strengthCardBrief']}>
                <Text className={styles['text-line-2']}>{shopInfo?.describe}</Text>
                <Icons className={styles['text-icon']} size={12} name="ChevronRight" color="#909399" />
              </View>
            </View>
            <View className={styles['strengthCardSplit']} />
            <View className={styles['strengthCardTitleBox']}>
              {intl.formatMessage({
                id: 'shop_about_strength_card_honor',
                defaultMessage: '荣誉资质',
              })}
            </View>
            {/** 荣誉资质照片 */}
            {shopInfo?.honorPics && (
              <ScrollView
                scrollX
                horizontal
                data={shopInfo?.honorPics}
                renderItem={({ item }) => (
                  <View className={styles['honorPicsItem']} key={item}>
                    <ImageBox
                      width={pxTransform(104)}
                      height={pxTransform(68)}
                      source={item || ''}
                      lazyLoad
                      canPreview
                    />
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {renderBottom()}

      <ActionSheet
        title={intl.formatMessage({
          id: 'shop_about_strength_card_describe',
          defaultMessage: '企业介绍',
        })}
        isOpened={introduceVisible}
        onClose={() => setIntroduceVisible(false)}
      >
        <ScrollView
          style={{
            height: pxTransform(windowHeight / 2),
          }}
        >
          <View className={styles['introduceBox']}>
            <Text className={styles['introduceText']}>{shopInfo?.describe}</Text>
          </View>
        </ScrollView>
      </ActionSheet>
      <CustomerServiceList visible={serviceVisible} onClose={toggleServiceVisible} memberId={shopInfo?.memberId} />
    </View>
  )
}
export default GlobalWrapper(About)
