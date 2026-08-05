/* eslint-disable no-case-declarations */
import React, { useEffect, useState } from 'react'
import { BrickProvider } from '@apps/design-react'
import { PROPS_SETTING_TYPES, updatePageConfig } from '@apps/design-core'
import { message } from 'antd'
import { LAYOUT_TYPE } from '@/constants'
import {
  getCommodityAdornWebPlatformFind,
  getCommodityWebCategoryWebFindEnterpriseCategoryTree,
  getPurchasePurchaseInquirySearchSourceList,
  getPurchaseInviteTenderGetInviteTenderListByEnterpriseWeb,
  getPurchaseBiddingSearchSourceList,
  getManageContentInformationFindByIdIn,
  getCommodityShopMainPortalInfo,
  getCommodityAdornManageFind,
} from '@apps/apis'
import { formatTimeString } from '@/utils'
import { isEmpty } from 'lodash'
import { usePageStatus } from '@/hooks/usePageStatus'
import { NavItemType, getDefaultConfig, getMenuData } from './utils'
import { DesingConfigItemType } from './types'
import { platformIndexConfig, mallLayoutConfig, FooterConfig } from './defaultData'
import PlatformToolBar from '@/pages/pageCustomized/components/toolBar/platform'
import Loading from '@/pages/pageCustomized/components/Loading'
import config from '@/pages/pageCustomized/configs'
import SettingPanel from '@/pages/pageCustomized/settingsPanel'
import DesignPanel from '@/pages/pageCustomized/components/DesignPanel'
import DesignPreview from '@/pages/pageCustomized/components/DesignPreview'
import styles from './index.less'
import { MallUrl, getEnterpriseMall, getMallUrlMap } from '../../services/feature'

interface MallEditPropsType {
  isPreview: boolean
}

const TemplateList = ['science']

const MallEdit: React.FC<MallEditPropsType> = (props) => {
  const { isPreview = false } = props
  const { id, template } = usePageStatus()
  const [loading, setLoading] = useState<boolean>(true)
  const [theme, setTheme] = useState<string>('theme-mall-science')
  const [componentConfigs, setComponentConfigs] = useState({})
  const [designConfig, setDesignConfig] = useState<DesingConfigItemType[]>([])
  const [mallMap, setMallMap] = useState<MallUrl>()

  useEffect(() => {
    if (!TemplateList.includes(template)) {
      setTheme(`theme-mall-${TemplateList[0]}`)
    } else {
      setTheme(`theme-mall-${template}`)
    }
    getMallUrlMap().then((res) => {
      setMallMap(res)
    })
  }, [])

  useEffect(() => {
    if (mallMap) {
      getPlatformConfig()
    }
  }, [mallMap])

  /**
   * 获取平台首页装修信息
   */
  const getPlatformConfig = () => {
    const param: any = {
      adornId: id,
    }

    getCommodityAdornWebPlatformFind(param)
      .then(async (res) => {
        if (res.code === 1000 && res.data) {
          const config = res.data.map((item) => {
            // 替换导航数据
            if (item.name === 'navList') {
              return {
                ...item,
                content: getMenuData((item.content || []) as unknown as NavItemType[], mallMap),
              }
            }
            return item
          })
          setDesignConfig(config)
        } else {
          setDesignConfig(getDefaultConfig(mallMap))
        }
      })
      .catch(async () => {
        setDesignConfig(getDefaultConfig(mallMap))
      })
  }

  /**
   * 获取装修装修信息
   */
  const getDesignConfig = (): Promise<Record<string, any>> => {
    return new Promise((resolve, reject) => {
      const param: any = {
        adornId: id,
      }
      getCommodityAdornManageFind(param)
        .then((res) => {
          if (res.code === 1000 && res.data) {
            resolve(res.data.adornContent)
          } else {
            resolve({})
          }
        })
        .catch((eror) => {
          reject(eror)
        })
    })
  }

  useEffect(() => {
    if (designConfig) {
      getComponentsConfig()
    }
  }, [designConfig])

  /**
   * 获取商品品类树
   */
  const getCategoryTree = () => {
    return new Promise(async (resolve) => {
      const defaultMallInfo = await getEnterpriseMall()
      const param: any = {
        adornId: id,
      }
      const headers: any = {
        shopId: defaultMallInfo?.id,
      }
      getCommodityWebCategoryWebFindEnterpriseCategoryTree(param, {
        headers,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  /**
   * 获取采购询价
   * @returns
   */
  const getInquiryList = () => {
    return new Promise((resolve) => {
      const param: any = {
        current: 1,
        pageSize: 6,
        overdue: 1,
      }
      const headers: any = {
        shopId: mallMap?.srmItem?.id,
      }
      getPurchasePurchaseInquirySearchSourceList(param, { headers })
        .then((res) => {
          if (res.code === 1000) {
            let list: any[] = res.data.data
            list = list.map((item) => {
              return {
                id: item.id,
                details: item.details,
                type: 1,
                count: item.count,
                deliveryTimeStr: formatTimeString(item.deliveryTime, 'YYYY-MM-DD'),
                createTimeStr: formatTimeString(item.createTime),
                memberName: item.memberName,
                memberRoleId: item.memberRoleId,
                days: item.days,
                hours: item.hours,
                minutes: item.minutes,
              }
            })
            resolve(list)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  /**
   * 获取采购招标
   * @returns
   */
  const getInviteTenderList = () => {
    return new Promise((resolve) => {
      const param: any = {
        current: 1,
        pageSize: 6,
        overdue: true,
      }
      const headers: any = {
        shopId: mallMap?.srmItem?.id,
      }
      getPurchaseInviteTenderGetInviteTenderListByEnterpriseWeb(param, { headers })
        .then((res) => {
          if (res.code === 1000) {
            let list: any[] = res.data.data || []
            list = list.map((item) => {
              return {
                id: item.id,
                details: item.projectName,
                type: 2,
                count: item.inviteTenderMaterielCount,
                deliveryTimeStr: formatTimeString(item.hopeDate, 'YYYY-MM-DD'),
                createTimeStr: formatTimeString(item.createTime),
                memberName: item.memberName,
                days: item.days,
                hours: item.hours,
                minutes: item.minutes,
              }
            })
            resolve(list)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  /**
   * 获取采购竞价
   * @returns
   */
  const getBiddingList = () => {
    return new Promise((resolve) => {
      const param: any = {
        current: 1,
        pageSize: 6,
        overdue: 1,
      }
      getPurchaseBiddingSearchSourceList(param)
        .then((res) => {
          if (res.code === 1000) {
            let list: any[] = res.data.data
            list = list.map((item) => {
              return {
                id: item.id,
                details: item.details,
                type: 3,
                count: item.count,
                deliveryTimeStr: formatTimeString(item.deliveryTime, 'YYYY-MM-DD'),
                createTimeStr: formatTimeString(item.createTime),
                memberName: item.memberName,
                days: item.days,
                hours: item.hours,
                minutes: item.minutes,
              }
            })
            resolve(list)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  /**
   * 根据id集合获取资讯列表
   */
  const getInformationByIds = (idList: number[]) => {
    return new Promise((resolve) => {
      if (!idList || (idList && idList.length === 0)) {
        resolve([])
        return
      }
      const params: any = {
        idList: idList.join(','),
      }
      getManageContentInformationFindByIdIn(params).then((res) => {
        const { code, data } = res
        if (code === 1000) {
          resolve(data)
        } else {
          resolve([])
        }
      })
    })
  }

  const getMainPortalInfo = async () => {
    try {
      const res = await getCommodityShopMainPortalInfo()
      if (res.code === 1000 && res.data) {
        return res.data
      }
      return undefined
    } catch (error) {
      return undefined
    }
  }

  const getComponentsConfig = async () => {
    // const designConfig = await getDesignConfig()

    // await getPurchaseNoticeList(0);
    // 获取平台首页装修信息
    if (!isEmpty(designConfig)) {
      const portalInfo = await getMainPortalInfo()
      const topBarConfig = {
        key: '2',
        '2': {
          componentName: 'TopBar',
          props: {
            shopname: '',
          },
        },
      }

      const headerConfig = {
        key: '3',
        '3': {
          componentName: 'Header',
          props: {
            logoUrl: '',
            type: LAYOUT_TYPE.platform,
          },
        },
      }

      if (portalInfo) {
        // 平台首页显示站点logo
        headerConfig[headerConfig.key].props.logoUrl = portalInfo.logoUrl
        topBarConfig[topBarConfig.key].props.shopname = portalInfo.name
      }

      if (mallMap?.mallItem) {
        FooterConfig[FooterConfig.key].props.shopId = mallMap?.mallItem.id
      }

      const mainNavConfig = {
        key: '4',
        '4': {
          componentName: 'MallMainNav',
          componentType: PROPS_SETTING_TYPES.mallNav,
          props: {
            type: LAYOUT_TYPE.platform,
          },
        },
      }

      const bannerContainer = {
        key: '5',
        '5': {
          componentName: 'View',
          props: {
            style: {
              position: 'relative',
              display: 'flex',
              paddingTop: '16px',
              width: '1200px',
              margin: '0 auto',
            },
          },
          childNodes: ['6', '7', '12'],
        },
      }

      const categoryConfig = {
        key: '6',
        '6': {
          componentName: 'Category',
          props: {
            categoryList: [],
            canHide: false,
          },
        },
      }

      const bannerWrap = {
        key: '7',
        '7': {
          componentName: 'View',
          props: {
            style: {
              flex: 1,
              padding: '0 16px',
            },
          },
          childNodes: ['8', '11'],
        },
      }

      const bannerHorizontal = {
        key: '8',
        '8': {
          componentName: 'View',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
            },
          },
          childNodes: ['9', '10'],
        },
      }

      const bannerAdvertConfig = {
        key: '9',
        '9': {
          componentName: 'PlatformAdvert',
          componentType: PROPS_SETTING_TYPES.platformAdvert,
          props: {
            type: 'banner',
            linkdisable: true,
            advertList: [],
          },
        },
      }

      const bannerRightAdvertConfig = {
        key: '10',
        '10': {
          componentName: 'PlatformAdvert',
          componentType: PROPS_SETTING_TYPES.platformAdvert,
          props: {
            type: 'bannerRight',
            linkdisable: true,
            advertList: [],
          },
        },
      }

      const bannerBottomAdvertConfig = {
        key: '11',
        '11': {
          componentName: 'PlatformAdvert',
          componentType: PROPS_SETTING_TYPES.platformAdvert,
          props: {
            type: 'bannerBottom',
            linkdisable: true,
            advertList: [],
          },
        },
      }

      const quickNavConfigWrap = {
        key: '12',
        '12': {
          componentName: 'PlatformQuickNav',
          componentType: PROPS_SETTING_TYPES.platformQuickNav,
          props: {},
        },
      }

      categoryConfig[categoryConfig.key].props.categoryList = await getCategoryTree()
      const fixKeys = ['navList', 'bannerAdvert', 'bannerRightAdvert', 'banneBottomrAdvert', 'fastVisit']
      const fixedConfig = designConfig.filter((item) => fixKeys.includes(item.name))
      const flowConfig = designConfig
        .filter((item) => !fixKeys.includes(item.name))
        .sort((a) => (a.name === 'goods' ? -1 : 1))

      for (const fixedItem of fixedConfig) {
        switch (fixedItem.name) {
          // 导航
          case 'navList':
            mainNavConfig[mainNavConfig.key].props.menuData = fixedItem.content || []
            break
          // 轮播图广告
          case 'bannerAdvert':
            bannerAdvertConfig[bannerAdvertConfig.key].props.advertList = fixedItem.content || []
            break
          // 轮播图右侧广告
          case 'bannerRightAdvert':
            bannerRightAdvertConfig[bannerRightAdvertConfig.key].props.advertList = fixedItem.content || []
            break
          // 轮播图底部广告
          case 'banneBottomrAdvert':
            bannerBottomAdvertConfig[bannerBottomAdvertConfig.key].props.advertList = fixedItem.content || []
            break
          // 快捷导航
          case 'fastVisit':
            quickNavConfigWrap[quickNavConfigWrap.key].props.sellQuickNavList = fixedItem.content.sellerBOList || []
            quickNavConfigWrap[quickNavConfigWrap.key].props.buyQuickNavList = fixedItem.content.buyerBOList || []
            quickNavConfigWrap[quickNavConfigWrap.key].props.quickNavList = fixedItem.content.fastFunctionBOList || []
            break
          default:
            break
        }
      }

      let flowConfigInfo: any = {}
      const flowConfigKeysList: string[] = []
      let configKey = 13
      for (const flowItem of flowConfig) {
        switch (flowItem.name) {
          case 'goods':
            if (flowItem.content && flowItem.content.length > 0) {
              for (const goodsItem of flowItem.content) {
                flowConfigKeysList.push(String(configKey))
                flowConfigInfo = Object.assign(flowConfigInfo, {
                  key: String(configKey),
                  [String(configKey)]: {
                    componentName: 'PlatformGoods',
                    componentType: PROPS_SETTING_TYPES.platformGoods,
                    componentTitle: '商品推荐',
                    props: {
                      dataInfo: goodsItem || {},
                    },
                  },
                })
                configKey += 1
              }
            }
            if (!isPreview) {
              flowConfigInfo = Object.assign(flowConfigInfo, {
                [String(99)]: {
                  componentName: 'PlatformAddGoodsItem',
                  props: {},
                },
              })
            }
            console.log(flowConfigInfo, 'flowConfigInfo')
            flowConfigKeysList.push(String(99))
            break
          case 'brand':
            configKey += 1
            flowConfigInfo = Object.assign(flowConfigInfo, {
              key: String(configKey),
              [String(configKey)]: {
                componentName: 'PlatformBrand',
                componentType: PROPS_SETTING_TYPES.platformBrand,
                componentTitle: '品牌馆',
                props: {
                  dataList: flowItem.content || [],
                },
              },
            })
            flowConfigKeysList.push(String(configKey))
            break
          case 'merchant':
            configKey += 1
            flowConfigInfo = Object.assign(flowConfigInfo, {
              key: String(configKey),
              [String(configKey)]: {
                componentName: 'PlatformMerchant',
                componentType: PROPS_SETTING_TYPES.platformMechant,
                componentTitle: '实力商家',
                props: {
                  dataList: flowItem.content || [],
                },
              },
            })
            flowConfigKeysList.push(String(configKey))
            break
          case 'marketInformation':
            configKey += 1
            let informationInfo = {}
            if (flowItem.content && flowItem.content.information) {
              const allIdList = flowItem.content.information.allIdList
              const bazaarIdList = flowItem.content.information.bazaarIdList
              const hotIdList = flowItem.content.information.hotIdList
              const allList: any = await getInformationByIds(allIdList)
              const bazaarList: any = await getInformationByIds(bazaarIdList)
              const hotList: any = await getInformationByIds(hotIdList)

              informationInfo = {
                allList,
                allIdList: allList.map((item) => item.id),
                bazaarList,
                bazaarIdList: bazaarList.map((item) => item.id),
                hotList,
                hotIdList: hotList.map((item) => item.id),
              }
            }

            flowConfigInfo = Object.assign(flowConfigInfo, {
              key: String(configKey),
              [String(configKey)]: {
                componentName: 'PlatformInformation',
                componentType: PROPS_SETTING_TYPES.platformInformation,
                componentTitle: '行情资讯',
                props: {
                  marketList: flowItem.content.marketList || [],
                  information: informationInfo,
                },
              },
            })
            flowConfigKeysList.push(String(configKey))
            break
          case 'middleAdvert':
            configKey += 1
            flowConfigInfo = Object.assign(flowConfigInfo, {
              key: String(configKey),
              [String(configKey)]: {
                componentName: 'PlatformAdvert',
                componentType: PROPS_SETTING_TYPES.platformAdvert,
                props: {
                  type: 'floorBanner',
                  linkdisable: true,
                  advertList: flowItem.content || [],
                },
              },
            })
            flowConfigKeysList.push(String(configKey))
            break
          case 'purchase':
            const inquiryList: any = await getInquiryList()
            const tenderList: any = await getInviteTenderList()
            const biddingList: any = await getBiddingList()
            let allList: any[] = []
            if (inquiryList.length >= 2) {
              const tempList = inquiryList.slice(0, 2)
              allList = [...allList, ...tempList]
            }
            if (tenderList.length >= 2) {
              const tempList = tenderList.slice(0, 2)
              allList = [...allList, ...tempList]
            }
            if (biddingList.length >= 2) {
              const tempList = biddingList.slice(0, 2)
              allList = [...allList, ...tempList]
            }
            configKey += 1
            flowConfigInfo = Object.assign(flowConfigInfo, {
              key: String(configKey),
              [String(configKey)]: {
                componentName: 'PlatformPurchase',
                componentTitle: '名企采购',
                props: {
                  allList,
                  inquiryList,
                  tenderList,
                  biddingList,
                  // getPurchaseNoticeList
                },
                childNodes: [String(configKey + 1)],
              },
            })
            flowConfigKeysList.push(String(configKey))
            configKey += 1
            flowConfigInfo = Object.assign(flowConfigInfo, {
              key: String(configKey),
              [String(configKey)]: {
                componentName: 'PlatformPurchase.Banner',
                componentType: PROPS_SETTING_TYPES.platformPurchaseAdvert,
                props: {
                  advertList: flowItem.content || [],
                },
              },
            })
            break
          case 'logistics':
            configKey += 1
            flowConfigInfo = Object.assign(flowConfigInfo, {
              key: String(configKey),
              [String(configKey)]: {
                componentName: 'PlatformLogistics',
                componentType: PROPS_SETTING_TYPES.platformLogistics,
                componentTitle: '物流服务',
                props: {
                  dataInfo: flowItem.content || {},
                },
              },
            })
            flowConfigKeysList.push(String(configKey))
            break
          case 'process':
            configKey += 1
            flowConfigInfo = Object.assign(flowConfigInfo, {
              key: String(configKey),
              [String(configKey)]: {
                componentName: 'PlatformProcess',
                componentType: PROPS_SETTING_TYPES.platformProcess,
                componentTitle: '加工服务',
                props: {
                  dataInfo: flowItem.content || {},
                },
              },
            })
            flowConfigKeysList.push(String(configKey))
            break
          case 'platform':
            configKey += 1
            flowConfigInfo = Object.assign(flowConfigInfo, {
              key: String(configKey),
              [String(configKey)]: {
                componentName: 'PlatformService',
                componentType: PROPS_SETTING_TYPES.platformService,
                componentTitle: '平台服务',
                props: {
                  dataList: flowItem.content || [],
                },
              },
            })
            flowConfigKeysList.push(String(configKey))
            break
          case 'bottomAdvert':
            configKey += 1
            flowConfigInfo = Object.assign(flowConfigInfo, {
              key: String(configKey),
              [String(configKey)]: {
                componentName: 'PlatformAdvert',
                componentType: PROPS_SETTING_TYPES.platformAdvert,
                componentTitle: '底部广告',
                props: {
                  type: 'service',
                  linkdisable: true,
                  advertList: flowItem.content || [],
                },
              },
            })
            flowConfigKeysList.push(String(configKey))
            break
          default:
            break
        }
      }

      platformIndexConfig[platformIndexConfig.key].childNodes = ['2', '3', '4', '5', ...flowConfigKeysList]

      mallLayoutConfig['0'].childNodes = [...mallLayoutConfig['0'].childNodes, FooterConfig.key]
      const config = {
        ...mallLayoutConfig,
        ...platformIndexConfig,
        ...topBarConfig,
        ...headerConfig,
        ...mainNavConfig,
        ...bannerContainer,
        ...categoryConfig,
        ...bannerWrap,
        ...bannerHorizontal,
        ...bannerAdvertConfig,
        ...bannerRightAdvertConfig,
        ...bannerBottomAdvertConfig,
        ...quickNavConfigWrap,
        ...flowConfigInfo,
        ...FooterConfig,
      }
      // console.log(config)
      setComponentConfigs(config)
      setLoading(false)
      updatePageConfig(config)
    }
  }

  return !loading ? (
    <BrickProvider
      config={config}
      warn={(msg: string) => {
        message.warning(msg)
      }}
    >
      <div className={styles['wrapper']}>
        <div className={styles.toolbar}>
          <PlatformToolBar adornId={id} type={isPreview ? 2 : 1} />
        </div>
        <div className={styles['content']}>
          <div className={styles['canvas-container']}>
            {isPreview ? (
              <DesignPreview theme={theme} pageConfig={componentConfigs} />
            ) : (
              <DesignPanel onlyEidt theme={theme} pageConfig={componentConfigs} />
            )}
          </div>
        </div>
      </div>
      {!isPreview && <SettingPanel adornId={id} />}
    </BrickProvider>
  ) : (
    <Loading />
  )
}

export default MallEdit
