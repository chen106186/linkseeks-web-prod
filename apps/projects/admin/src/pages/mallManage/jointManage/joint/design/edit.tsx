import React, { useEffect, useState } from 'react'
import { BrickProvider } from '@apps/design-react'
import { message } from 'antd'
import {
  getCommodityAdornManageFind,
  getManageContentInformationFindAllByRecommendLabel,
  getOrderCommonShopProductHistoryPage,
  getTradeInquiryGetShopInquiryList,
} from '@apps/apis'
import {
  getCommodityWebCategoryWebFindEnterpriseCategoryTree,
  getCommodityShopDetails,
  getProductCommodityGetCommodityStock,
} from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import ToolBar from '@/pages/pageCustomized/components/toolBar'
import DesignPanel from '@/pages/pageCustomized/components/DesignPanel'
import DesignPreview from '@/pages/pageCustomized/components/DesignPreview'
import SettingPanel from '@/pages/pageCustomized/settingsPanel'
import config from '@/pages/pageCustomized/configs'
import Loading from '@/pages/pageCustomized/components/Loading'
import { WEB_DESIGN_COMPONENT } from '@apps/design-ui'
import WebEditRight from '@/pages/pageCustomized/components/webEditRight'
import {
  topBarConfig,
  headerConfig,
  mainNavConfig,
  bannerContainer,
  quickNavConfigWrap,
  categoryConfig,
  bannerWrap,
  quickNavConfig,
  bannerAdvertConfig,
  interactAdvertConfig,
  navAdvertConfig,
  mallLayoutConfig,
  FindMoreConfig,
  InformationConfig,
  FooterConfig,
  AddComponentButton,
} from './defaultData'
import { getMenuData } from './defaultMenu'
import { getCustomComponentTitle } from './utils'
import styles from './index.less'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'

interface MallEditPropsType {
  isPreview: boolean
}

const TemplateList = ['science']

const MallEdit: React.FC<MallEditPropsType> = (props) => {
  const { isPreview } = props
  const { adornId, template, shopId } = usePageStatus()
  const [loading, setLoading] = useState<boolean>(true)
  const [theme, setTheme] = useState<string>('theme-mall-science')
  const [componentConfigs, setComponentConfigs] = useState({})

  useEffect(() => {
    if (!TemplateList.includes(template)) {
      setTheme(`theme-mall-${TemplateList[0]}`)
    } else {
      setTheme(`theme-mall-${template}`)
    }
    getComponentsConfig()
  }, [])

  const fetchNewByLabel = (label: string) => {
    // 1-头条文章 2-轮播新闻 3-图片新闻 4-推荐阅读
    return new Promise((resolve, reject) => {
      getManageContentInformationFindAllByRecommendLabel({ recommendLabel: label })
        .then((res: { code: number; data: unknown }) => {
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

  /** 获取商品询价动态 */
  const fetchInquiryList = () => {
    return new Promise((resolve) => {
      const params: any = {
        current: 1,
        pageSize: 24,
        shopId,
      }
      getTradeInquiryGetShopInquiryList(params)
        .then((res: any) => {
          if (res.code === 1000) {
            resolve(res.data.data)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  /** 获取交易记录 */
  const fetchTradeList = () => {
    return new Promise((resolve) => {
      const params: any = {
        current: 1,
        pageSize: 24,
        shopId,
      }
      getOrderCommonShopProductHistoryPage(params)
        .then((res: any) => {
          if (res.code === 1000) {
            resolve(res.data.data)
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
   * 获取商品品类树
   */
  const getCategoryTree = () => {
    return new Promise((resolve) => {
      const param: any = {
        adornId,
      }
      const headers: any = {
        shopId,
      }
      getCommodityWebCategoryWebFindEnterpriseCategoryTree(param, { headers })
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

  const fetchMallInfo = async () => {
    const param: any = {
      id: shopId,
    }
    const res = await getCommodityShopDetails(param)
    if (res.code === 1000) {
      return res.data
    }
    return undefined
  }

  /**
   * 获取装修装修信息
   */
  const getDesignConfig = (): Promise<Record<string, any>> => {
    return new Promise((resolve, reject) => {
      const param: any = {
        adornId,
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

  const getComponentsConfig = async () => {
    const designConfig = await getDesignConfig()

    const webMallInfo = await fetchMallInfo()

    if (webMallInfo) {
      headerConfig[headerConfig.key].props.logoUrl = webMallInfo.logoUrl
      topBarConfig[topBarConfig.key].props.shopname = webMallInfo.name
      FooterConfig[FooterConfig.key].props.shopId = webMallInfo.id
    }

    const designComponentList: {
      componentName: string
      [key: string]: any
    }[] = []
    let customIndex = 100
    let customComponentsConfig: Record<
      string,
      {
        componentName: string
        [key: string]: any
      }
    > = {}
    const customComponentsKeys: string[] = []
    if (designConfig && Object.keys(designConfig).length > 0) {
      Object.keys(designConfig).forEach((key) => {
        const componentName = key.split('-')[0] as WEB_DESIGN_COMPONENT
        designComponentList.push({
          componentName,
          ...designConfig[key],
        })
      })
      const sortDesignComponentList = designComponentList.sort((a, b) => (b.sort > a.sort ? -1 : 1))

      // 收集所有商品ID
      let ids: any[] = []
      sortDesignComponentList.forEach((_item) => {
        if (_item.commodityList && _item.commodityList.length > 0) {
          _item.commodityList.forEach((item: any) => {
            ids.push(item.id)
          })
        }
      })
      ids = [...new Set(ids)]

      // 获取库存数据
      if (ids.length > 0 && webMallInfo?.id) {
        const res = await getProductCommodityGetCommodityStock({ idList: ids, shopId: webMallInfo.id })

        sortDesignComponentList.forEach((_item) => {
          if (_item.commodityList && _item.commodityList.length > 0) {
            _item.commodityList.forEach((item: any) => {
              const stock = res.data.find((i: any) => i.commodityId === item.commodityId)
              if (stock) {
                item.stockCount = stock.stockCount
                item.minOrder = stock.minOrder
                item.max = stock.max
                item.min = stock.min
                item.tagList = stock.tagList
              }
            })
          }
        })
      }

      for (const componentItem of sortDesignComponentList) {
        switch (componentItem.componentName) {
          // 导航
          case WEB_DESIGN_COMPONENT.MallMainNav:
            mainNavConfig[mainNavConfig.key].props.menuData = componentItem.menuData || getMenuData()
            break
          // 内置广告
          case WEB_DESIGN_COMPONENT.Advert:
            switch (componentItem.type) {
              case 'banner':
                bannerAdvertConfig[bannerAdvertConfig.key].props.advertList = componentItem.advertList || []
                break
              case 'interact':
                interactAdvertConfig[interactAdvertConfig.key].props.advertList = componentItem.advertList || []
                break
              case 'nav':
                navAdvertConfig[navAdvertConfig.key].props.advertList = componentItem.advertList || []
                break
              default:
                break
            }
            break
          // 轮播广告
          case WEB_DESIGN_COMPONENT.CarouselBanner:
          // 横向广告
          case WEB_DESIGN_COMPONENT.HorizontalBanner:
          // 空白辅助
          case WEB_DESIGN_COMPONENT.Empty:
          // 富文本
          case WEB_DESIGN_COMPONENT.RichText:
          // 商品楼层
          case WEB_DESIGN_COMPONENT.CommodityFloor:
          // 商品楼层-带店铺楼层
          case WEB_DESIGN_COMPONENT.CommodityStoreFloor:
          // 图片热区
          case WEB_DESIGN_COMPONENT.HotspotImage:
          // 优惠券推荐
          case WEB_DESIGN_COMPONENT.Coupon:
          // 商品推荐（横向）
          case WEB_DESIGN_COMPONENT.HorizontalCommodity:
          // 商品推荐（纵向）
          case WEB_DESIGN_COMPONENT.VerticalCommodity:
            customComponentsKeys.push(String(customIndex))
            customComponentsConfig[String(customIndex)] = {
              title: getCustomComponentTitle(componentItem.componentName),
              componentName: componentItem.componentName,
              firstLevel: true,
              canDrag: true,
              props: {
                canDelete: true,
                ...componentItem,
              },
            }
            customIndex += 1
            break
          // 行情资讯
          case WEB_DESIGN_COMPONENT.Information:
            InformationConfig[InformationConfig.key].props.visible = componentItem.visible
            break
          case WEB_DESIGN_COMPONENT.Footer:
            FooterConfig[FooterConfig.key].props = {
              shopId,
              linkdisable: true,
              ...componentItem,
              canDelete: false,
            }
            break
          default:
            break
        }
      }
    } else {
      mainNavConfig[mainNavConfig.key].props.menuData = getMenuData()
    }

    categoryConfig[categoryConfig.key].props.categoryList = await getCategoryTree()

    // 行情资讯
    InformationConfig[InformationConfig.key].props.newsList = await fetchNewByLabel('4')

    // 发现更多
    FindMoreConfig[FindMoreConfig.key].props.inquiryList = await fetchInquiryList()
    FindMoreConfig[FindMoreConfig.key].props.tradeList = await fetchTradeList()

    mallLayoutConfig['0'].childNodes = [
      ...mallLayoutConfig['0'].childNodes,
      ...customComponentsKeys,
      AddComponentButton.key,
      FindMoreConfig.key,
      InformationConfig.key,
      FooterConfig.key,
    ]
    const config = {
      ...mallLayoutConfig,
      ...topBarConfig,
      ...headerConfig,
      ...mainNavConfig,
      ...bannerContainer,
      ...categoryConfig,
      ...bannerWrap,
      ...quickNavConfigWrap,
      ...quickNavConfig,
      ...bannerAdvertConfig,
      ...interactAdvertConfig,
      ...navAdvertConfig,
      ...AddComponentButton,
      ...customComponentsConfig,
      ...FindMoreConfig,
      ...InformationConfig,
      ...FooterConfig,
    }
    console.log(config, 'config')
    setComponentConfigs(config)
    setLoading(false)
  }

  return !loading ? (
    <BrickProvider
      config={config}
      warn={(msg: string) => {
        message.warning(msg)
      }}
    >
      <div className={styles['wrapper']}>
        <ToolBar adornId={adornId} type={isPreview ? 2 : 1} isWeb layoutType={LAYOUT_TYPE.joint} showActions />
        <div className={styles['content']}>
          <div className={styles['canvas-container']}>
            {isPreview ? (
              <DesignPreview theme={theme} pageConfig={componentConfigs} />
            ) : (
              <DesignPanel onlyEidt theme={theme} pageConfig={componentConfigs} />
            )}
            <WebEditRight />
          </div>
        </div>
      </div>
      {!isPreview && <SettingPanel adornId={adornId} />}
    </BrickProvider>
  ) : (
    <Loading />
  )
}

export default MallEdit
