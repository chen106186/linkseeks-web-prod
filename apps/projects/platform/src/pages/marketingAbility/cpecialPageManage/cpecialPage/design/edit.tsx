import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { Helmet } from 'react-helmet'
import { useWebIntl } from '@apps/locales'
import Loading from '@/pages/design/components/Loading'
import useBrickAsync from '@/pages/design/hooks/useBrickAsync'
import ToolBar from '@/pages/design/components/toolBar'
import DesignPanel from '@/pages/design/components/DesignPanel'
import PreviewPanel from '@/pages/design/components/PreviewPanel'
import SettingPanel from '@/pages/design/settingsPanel'
import WebEditRight from '@/pages/design/components/webEditRight'
import { BrickProvider, PageConfigType } from '@apps/design-react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getCommodityShopDetails, getCommodityAdornTopicPageFind } from '@apps/apis'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import { getDefaultMenuData } from '@/pages/mallAbility/ownMallManager/ownMallConfigure/design/defaultMenu'
import { topBarConfig, headerConfig, mainNavConfig, mallLayoutConfig, FooterConfig, AddComponentButton } from './config'
import styles from './index.less'
import { WEB_DESIGN_COMPONENT } from '@apps/design-ui'
import { getCustomComponentTitle } from '@/pages/mallAbility/ownMallManager/ownMallConfigure/design/utils'

interface CpecialPageEditPropsType {
  isPreview: boolean
}

const TemplateList = ['science']

const CpecialPageEdit: React.FC<CpecialPageEditPropsType> = (props) => {
  const { isPreview = false } = props
  const [loading, setLoading] = useState<boolean>(true)
  const { adornId, template, shopId } = usePageStatus()
  const [theme, setTheme] = useState<string>('theme-ownmall-science')
  const [componentConfigs, setComponentConfigs] = useState<PageConfigType>({})
  const brickConfig = useBrickAsync()
  const translate = useWebIntl()

  useEffect(() => {
    if (!TemplateList.includes(template)) {
      setTheme(`theme-ownmall-${TemplateList[0]}`)
    } else {
      setTheme(`theme-ownmall-${template}`)
    }
    getComponentsConfig()
  }, [])

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
        id: adornId,
      }
      getCommodityAdornTopicPageFind(param)
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

    if (mallInfo) {
      topBarConfig[topBarConfig.key].props.shopname = mallInfo?.name
      headerConfig[headerConfig.key].props.logoUrl = mallInfo?.logoUrl
    }
    mainNavConfig[mainNavConfig.key].props.menuData = getDefaultMenuData()
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
          case WEB_DESIGN_COMPONENT.WrapLayout:
            mallLayoutConfig['0'].props['backgroundColor'] = componentItem.backgroundColor || '#F5F6F7'
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
    console.log(config, 'config')
    setComponentConfigs(config as unknown as PageConfigType)
    setLoading(false)
  }

  return !loading && brickConfig ? (
    <BrickProvider
      config={brickConfig}
      warn={(msg: string) => {
        message.warning(msg)
      }}
    >
      <Helmet>
        <title>{translate('web.resource.marketing.zhuantiyezhuangxiu')}</title>
      </Helmet>
      <main className={styles['wrapper']}>
        <ToolBar
          title={translate('web.resource.marketing.zhuantiye')}
          type={isPreview ? 2 : 1}
          adornId={adornId}
          layoutType={LAYOUT_TYPE.cpecialPage}
          showActions={!isPreview}
          isWeb
        />
        <div className={styles['content']}>
          <div className={styles['canvas-container']}>
            {isPreview ? (
              <PreviewPanel onlyEidt theme={theme} pageConfig={componentConfigs} />
            ) : (
              <DesignPanel onlyEidt theme={theme} pageConfig={componentConfigs} />
            )}
          </div>
          {!isPreview && <WebEditRight />}
        </div>
      </main>
      {!isPreview && <SettingPanel layoutType={LAYOUT_TYPE.cpecialPage} adornId={adornId} type="own" shopId={shopId} />}
    </BrickProvider>
  ) : (
    <Loading />
  )
}

export default CpecialPageEdit
