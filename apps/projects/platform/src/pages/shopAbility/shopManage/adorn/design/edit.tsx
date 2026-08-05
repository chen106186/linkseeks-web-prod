import React, { useEffect, useState } from 'react'
import { BrickProvider } from '@apps/design-react'
import { message } from 'antd'
import ToolBar from '@/pages/design/components/toolBar'
import DesignPanel from '@/pages/design/components/DesignPanel'
import PreviewPanel from '@/pages/design/components/PreviewPanel'
import SettingPanel from '@/pages/design/settingsPanel'
import { usePageStatus } from '@/hooks/usePageStatus'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import { getCommodityWebStoreWebMemberShopMain, getCommodityShopDetails, getCommodityAdornManageFind } from '@apps/apis'
import { getCustomComponentTitle } from '@/pages/mallAbility/ownMallManager/ownMallConfigure/design/utils'
import Loading from '@/pages/design/components/Loading'
import { WEB_DESIGN_COMPONENT } from '@apps/design-ui'
import useBrickAsync from '@/pages/design/hooks/useBrickAsync'
import WebEditRight from '@/pages/design/components/webEditRight'
import {
  topBarConfig,
  headerConfig,
  mainNavConfig,
  mallLayoutConfig,
  FooterConfig,
  AddComponentButton,
} from './defaultData'
import { menuData } from './defaultMenu'
import styles from './index.less'

interface ShopEditPropsType {
  isPreview: boolean
}

const TemplateList = ['science']

const ShopEdit: React.FC<ShopEditPropsType> = (props) => {
  const { isPreview = false } = props
  const { adornId, template, shopId, storeId } = usePageStatus()
  const [loading, setLoading] = useState<boolean>(true)
  const [theme, setTheme] = useState<string>('theme-shop-science')
  const [componentConfigs, setComponentConfigs] = useState({})
  const brickConfig = useBrickAsync()

  useEffect(() => {
    if (!TemplateList.includes(template)) {
      setTheme(`theme-shop-${TemplateList[0]}`)
    } else {
      setTheme(`theme-shop-${template}`)
    }
    getComponentsConfig()
  }, [])

  /**
   * 获取店铺信息
   */
  const fetchShopInfo = (shopId: number) => {
    return new Promise((resolve) => {
      const param: any = {
        storeId,
        shopId,
      }
      getCommodityWebStoreWebMemberShopMain(param)
        .then((res) => {
          if (res.code === 1000) {
            if (res.code === 1000) {
              resolve(res.data)
            }
          }
        })
        .catch(() => {
          resolve(undefined)
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

    mainNavConfig[mainNavConfig.key].props.type = LAYOUT_TYPE.shop

    //店铺信息
    const webMallInfo = await fetchMallInfo()

    if (webMallInfo) {
      const shopInfo: any = await fetchShopInfo(webMallInfo.id)
      headerConfig[headerConfig.key].props.shopInfo = shopInfo
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

      for (const componentItem of sortDesignComponentList) {
        switch (componentItem.componentName) {
          // 导航
          case WEB_DESIGN_COMPONENT.MainNav:
            mainNavConfig[mainNavConfig.key].props.menuData = componentItem.menuData || menuData
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
          default:
            break
        }
      }
    } else {
      // 导航栏
      mainNavConfig[mainNavConfig.key].props.menuData = menuData
    }

    mallLayoutConfig['0'].childNodes = [
      ...mallLayoutConfig['0'].childNodes,
      ...customComponentsKeys,
      AddComponentButton.key,
      FooterConfig.key,
    ]

    const config = {
      ...mallLayoutConfig,
      ...topBarConfig,
      ...headerConfig,
      ...mainNavConfig,
      ...customComponentsConfig,
      ...AddComponentButton,
      ...FooterConfig,
    }
    setComponentConfigs(config)
    setLoading(false)
  }

  return !loading && brickConfig ? (
    <BrickProvider
      config={brickConfig}
      warn={(msg: string) => {
        message.warning(msg)
      }}
    >
      <main className={styles['wrapper']}>
        <ToolBar type={isPreview ? 2 : 1} showActions isWeb layoutType={LAYOUT_TYPE.shop} />
        <div className={styles['content']}>
          <div className={styles['canvas-container']}>
            {isPreview ? (
              <PreviewPanel onlyEidt theme={theme} pageConfig={componentConfigs} />
            ) : (
              <DesignPanel onlyEidt theme={theme} pageConfig={componentConfigs} />
            )}
            <WebEditRight />
          </div>
        </div>
      </main>
      {!isPreview && <SettingPanel layoutType={LAYOUT_TYPE.shop} adornId={adornId} type="shop" shopId={shopId} />}
    </BrickProvider>
  ) : (
    <Loading />
  )
}

export default ShopEdit
