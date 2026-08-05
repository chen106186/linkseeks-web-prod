import React, { useEffect, useState } from 'react'
import { BrickProvider } from '@apps/design-react'
import { message } from 'antd'
import ToolBar from '@/pages/design/components/toolBar'
import DesignPanel from '@/pages/design/components/DesignPanel'
import PreviewPanel from '@/pages/design/components/PreviewPanel'
import SettingPanel from '@/pages/design/settingsPanel'
import { LAYOUT_TYPE } from '@/constants'
import {
  topBarConfig,
  headerConfig,
  mainNavConfig,
  bannerWrap,
  oneBannerConfig,
  bannerColumnWrap,
  twoBannerConfig,
  threeBannerConfig,
  mallLayoutConfig,
  InformationConfig,
  FooterConfig,
  AddComponentButton,
} from './defaultData'
import { getDefaultMenuData } from './defaultMenu'
import Loading from '@/pages/design/components/Loading'
import { usePageStatus } from '@/hooks/usePageStatus'
import { authService } from '@apps/services'
import {
  getCommodityShopDetails,
  getManageContentInformationFindAllByRecommendLabel,
  getProductShopSelfGetCustomerCategoryTree,
  getCommodityAdornManageFind,
} from '@apps/apis'
import useBrickAsync from '@/pages/design/hooks/useBrickAsync'
import { WEB_DESIGN_COMPONENT } from '@apps/design-ui'
import WebEditRight from '@/pages/design/components/webEditRight'
import { getCustomComponentTitle } from './utils'
import styles from './index.less'

interface ShopEditPropsType {
  isPreview: boolean
}

const TemplateList = ['science']

const OwnMallEdit: React.FC<ShopEditPropsType> = (props) => {
  const { isPreview = false } = props
  const { adornId, template, shopId } = usePageStatus()
  const [loading, setLoading] = useState<boolean>(true)
  const [theme, setTheme] = useState<string>('theme-ownmall-science')
  const [componentConfigs, setComponentConfigs] = useState({})
  const { memberId } = authService.getAuth() || {}
  const brickConfig = useBrickAsync()

  useEffect(() => {
    if (!TemplateList.includes(template)) {
      setTheme(`theme-ownmall-${TemplateList[0]}`)
    } else {
      setTheme(`theme-ownmall-${template}`)
    }
    getComponentsConfig()
  }, [])

  const getCategoryTree = () => {
    return new Promise((resolve) => {
      const param: any = {
        memberId,
      }

      const headers: any = {
        shopId,
      }

      getProductShopSelfGetCustomerCategoryTree(param, { headers })
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

  const fetchNewByLabel = (label: string) => {
    // 1-头条文章 2-轮播新闻 3-图片新闻 4-推荐阅读
    return new Promise((resolve, reject) => {
      getManageContentInformationFindAllByRecommendLabel({ recommendLabel: label })
        .then((res: { code: number; data: unknown }) => {
          if (res.code === 1000) {
            resolve(res.data)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
  }

  const getMemberSelfMallInfo = async () => {
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

    // 商城信息
    const mallInfo: any = await getMemberSelfMallInfo()
    // 导航栏
    if (mallInfo) {
      topBarConfig[topBarConfig.key].props.shopname = mallInfo?.name
      headerConfig[headerConfig.key].props.logoUrl = mallInfo?.logoUrl
      FooterConfig[FooterConfig.key].props.shopId = mallInfo.id
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

      for (const componentItem of sortDesignComponentList) {
        switch (componentItem.componentName) {
          // 导航
          case WEB_DESIGN_COMPONENT.OwnMainNav:
            mainNavConfig[mainNavConfig.key].props.menuData = componentItem.menuData || getDefaultMenuData()
            break
          // 内置广告
          case WEB_DESIGN_COMPONENT.OwnBanner:
            switch (componentItem.type) {
              case 1:
                oneBannerConfig[oneBannerConfig.key].props.advertList = componentItem.advertList || []
                break
              case 2:
                twoBannerConfig[twoBannerConfig.key].props.advertList = componentItem.advertList || []
                break
              case 3:
                threeBannerConfig[threeBannerConfig.key].props.advertList = componentItem.advertList || []
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
      mainNavConfig[mainNavConfig.key].props.menuData = getDefaultMenuData()
    }

    mainNavConfig[mainNavConfig.key].props.type = LAYOUT_TYPE.own
    mainNavConfig[mainNavConfig.key].props.categoryList = await getCategoryTree()

    // 行情资讯
    InformationConfig[InformationConfig.key].props.newsList = await fetchNewByLabel('4')

    mallLayoutConfig['0'].childNodes = [
      ...mallLayoutConfig['0'].childNodes,
      ...customComponentsKeys,
      AddComponentButton.key,
      InformationConfig.key,
      FooterConfig.key,
    ]

    const config = {
      ...mallLayoutConfig,
      ...topBarConfig,
      ...headerConfig,
      ...mainNavConfig,
      ...bannerWrap,
      ...oneBannerConfig,
      ...bannerColumnWrap,
      ...twoBannerConfig,
      ...threeBannerConfig,
      ...customComponentsConfig,
      ...AddComponentButton,
      ...InformationConfig,
      ...FooterConfig,
    }
    setComponentConfigs(config)
    setLoading(false)
  }

  return !loading && brickConfig ? (
    // @ts-ignore
    <BrickProvider
      config={brickConfig}
      warn={(msg: string) => {
        message.warning(msg)
      }}
    >
      <main className={styles['wrapper']}>
        <ToolBar type={isPreview ? 2 : 1} adornId={adornId} layoutType={LAYOUT_TYPE.own} showActions isWeb />
        <div className={styles['content']}>
          <div className={styles['canvas-container']}>
            {isPreview ? (
              <PreviewPanel onlyEidt theme={theme} pageConfig={componentConfigs} />
            ) : (
              <DesignPanel onlyEidt theme={theme} pageConfig={componentConfigs} />
            )}
          </div>
          <WebEditRight />
        </div>
      </main>
      {!isPreview && <SettingPanel layoutType={LAYOUT_TYPE.own} adornId={adornId} type="own" shopId={shopId} />}
    </BrickProvider>
  ) : (
    <Loading />
  )
}

export default OwnMallEdit
