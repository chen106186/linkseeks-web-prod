/*
 * @Author: ghua
 * @Date: 2021-01-14 17:03:08
 * @Last Modified by: ghua
 * @Last Modified time: 2021-01-15 17:47:38
 * @Description app店铺主页装修
 */
import React, { useEffect, useState } from 'react'
import {
  BrickProvider,
  PAGECONFIG_PROPS_KEYS,
  PageConfigType,
  resolveMappingPageConfig,
  updatePageConfig,
} from '@apps/design-react'
import { Helmet } from 'react-helmet'
import { useIntl } from '@linkseeks/i18n'
import { isEmpty } from 'lodash'
import { usePageStatus } from '@/hooks/usePageStatus'
import brickConfig from '@/pages/design/configs'
import ToolBar from '@/pages/design/components/toolBar'
import MobileDesignPanel from '@/pages/design/components/MobileDesignPanel'
import MobileClientEditLeft from '@/pages/design/components/mobileClientEditLeft'
import * as MarketingConfigs from './marketing_config'
import Loading from '@/pages/design/components/Loading'
import MobileSettingPanel from '@/pages/design/mobileSettingPanel'
import { getCommodityAdornManageFind, getCommodityWebStoreWebMemberShopMain } from '@apps/apis'
import { rootConfig, defaultDesign } from './config'
import styles from './index.less'
import { MOBILE_DESIGN_COMPONENT } from '@apps/design-ui'
import { MARKETING_COMPONENTS_TYPE } from '@apps/design-ui/src/constants/marketing'
import {
  getComponentAddBtnText,
  getComponentTitle,
  getMarketingCardTitle,
} from '@/pages/mallAbility/ownMallManager/ownMallConfigure/design/mobile/utils'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'

interface ShopPreviewPropsType {
  isPreview: boolean
}

const TemplateList = ['science']

const mobileShopTempleteEdit: React.FC<ShopPreviewPropsType> = (props) => {
  const { isPreview = false } = props
  const { adornId, template, shopId, storeId, environment } = usePageStatus()
  const [loading, setLoading] = useState<boolean>(true)
  const [theme, setTheme] = useState<string>('theme-mall-science')
  const [componentConfigs, setComponentConfigs] = useState({})
  const intl = useIntl()

  useEffect(() => {
    if (!TemplateList.includes(template)) {
      setTheme(`theme-mall-${TemplateList[0]}`)
    } else {
      setTheme(`theme-mall-${template}`)
    }
    getComponentsConfig()
  }, [])

  /**
   * 获取店铺信息
   */
  const fetchShopInfo = (shopId: number): Promise<any> => {
    return new Promise((resolve) => {
      const param: any = {
        storeId,
        shopId,
      }
      getCommodityWebStoreWebMemberShopMain(param).then((res) => {
        if (res.code === 1000) {
          if (res.code === 1000) {
            resolve(res.data)
          }
        }
      })
    })
  }

  /**
   * 获取app店铺装修信息
   */

  /**
   * 获取app装修信息
   */
  const getAppConfig = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const param: any = {
        adornId,
      }
      getCommodityAdornManageFind(param)
        .then((res) => {
          if (res.code === 1000 && res.data) {
            if (!isEmpty(res.data.adornContent)) {
              // 判断是否旧数据
              if (Object.keys(res.data.adornContent).some((key) => key[0].toUpperCase() === key[0])) {
                resolve(res.data.adornContent)
                return
              }
            }
          }
          resolve(defaultDesign)
        })
        .catch((eror) => {
          resolve(defaultDesign)
        })
    })
  }

  const normalizeComponentProps = (data: Record<string, any>, componentName: MOBILE_DESIGN_COMPONENT) => {
    switch (componentName) {
      case MOBILE_DESIGN_COMPONENT.MobileShopHeader:
        return {
          ...data,
          shopInfo: '${shopInfo}',
        }
      default:
        return data
    }
  }

  const getComponentsConfig = async () => {
    try {
      const appConfig: any = await getAppConfig()
      const shopInfo = await fetchShopInfo(shopId)
      const designComponentList: {
        componentName: string
        [key: string]: any
      }[] = []
      let componentKey: number = 100
      let marketingComponentKey = ''
      let customComponentsConfig: PageConfigType = {}
      const customComponentsKeys: string[] = []
      if (appConfig && Object.keys(appConfig).length > 0) {
        Object.keys(appConfig).forEach((key) => {
          const componentName = key.split('-')[0] as MOBILE_DESIGN_COMPONENT
          designComponentList.push({
            componentName,
            ...appConfig[key],
          })
        })
        const sortDesignComponentList = designComponentList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
        // 可用装修组件集合
        const AVAILABLE_COMPONENTS = [
          MOBILE_DESIGN_COMPONENT.MobileShopHeader,
          MOBILE_DESIGN_COMPONENT.Banner,
          MOBILE_DESIGN_COMPONENT.MobileNavCard,
          MOBILE_DESIGN_COMPONENT.MobileShopCommodity,
          MOBILE_DESIGN_COMPONENT.MarketingCard,
          MOBILE_DESIGN_COMPONENT.BottomNavigation,
          MOBILE_DESIGN_COMPONENT.CouponsModal,
        ]

        // 不可拖拽组件
        const cannotDragComponents = [
          MOBILE_DESIGN_COMPONENT.MobileShopHeader,
          MOBILE_DESIGN_COMPONENT.BottomNavigation,
        ]

        for (const componentItem of sortDesignComponentList) {
          if (AVAILABLE_COMPONENTS.includes(componentItem.componentName as MOBILE_DESIGN_COMPONENT)) {
            const isMarketing = componentItem.componentName === MOBILE_DESIGN_COMPONENT.MarketingCard
            const propsKeyOjb: Record<string, any> = {}
            const allKeys = Object.keys(componentItem)
            for (const key of allKeys) {
              if (PAGECONFIG_PROPS_KEYS.includes(key)) {
                propsKeyOjb[key] = componentItem[key]
              }
            }

            if (isMarketing) {
              marketingComponentKey = `11-${MARKETING_COMPONENTS_TYPE[componentItem.props.type]}`
              customComponentsKeys.push(marketingComponentKey)
            } else {
              customComponentsKeys.push(String(componentKey))
            }

            const addBtnText = componentItem['childComponentName']
              ? getComponentAddBtnText(componentItem.componentName as MOBILE_DESIGN_COMPONENT)
              : ''

            const useKey = isMarketing ? marketingComponentKey : String(componentKey)

            customComponentsConfig[useKey] = {
              title: isMarketing
                ? getMarketingCardTitle(componentItem.props.type)
                : getComponentTitle(componentItem.componentName as MOBILE_DESIGN_COMPONENT),
              componentName: componentItem.componentName,
              ...propsKeyOjb,
              canDrag: cannotDragComponents.includes(componentItem.componentName as MOBILE_DESIGN_COMPONENT)
                ? false
                : true,
              props: normalizeComponentProps(
                componentItem.props || {},
                componentItem.componentName as MOBILE_DESIGN_COMPONENT,
              ),
              childProps: componentItem.childProps || {},
              addBtnText,
              childNodes: [],
            }
            if (Array.isArray(componentItem.children) && componentItem.children.length > 0) {
              const secondChildNodes: string[] = []
              for (const [childIndex, childItem] of componentItem.children.entries()) {
                secondChildNodes.push(`${useKey}-${childIndex + 1}`)
                customComponentsConfig[`${useKey}-${childIndex + 1}`] = childItem

                // 目前最多3级
                if (Array.isArray(childItem.children) && childItem.children.length > 0) {
                  const thirdChildNodes: string[] = []
                  for (const [thirdChildIndex, thirdChildItem] of childItem.children.entries()) {
                    thirdChildNodes.push(`${useKey}-${childIndex + 1}-${thirdChildIndex + 1}`)
                    customComponentsConfig[`${useKey}-${childIndex + 1}-${thirdChildIndex + 1}`] = thirdChildItem

                    // 套餐五级。。
                    if (Array.isArray(thirdChildItem.children) && thirdChildItem.children.length > 0) {
                      const fourChildNodes: string[] = []
                      for (const [fourChildIndex, fourChildItem] of thirdChildItem.children.entries()) {
                        fourChildNodes.push(`${useKey}-${childIndex + 1}-${thirdChildIndex + 1}-${fourChildIndex + 1}`)
                        customComponentsConfig[
                          `${useKey}-${childIndex + 1}-${thirdChildIndex + 1}-${fourChildIndex + 1}`
                        ] = fourChildItem

                        if (Array.isArray(fourChildItem.children) && fourChildItem.children.length > 0) {
                          const fiveChildNodes: string[] = []
                          for (const [fiveChildIndex, fiveChildItem] of fourChildItem.children.entries()) {
                            fiveChildNodes.push(
                              `${useKey}-${childIndex + 1}-${thirdChildIndex + 1}-${fourChildIndex + 1}-${
                                fiveChildIndex + 1
                              }`,
                            )
                            customComponentsConfig[
                              `${useKey}-${childIndex + 1}-${thirdChildIndex + 1}-${fourChildIndex + 1}-${
                                fiveChildIndex + 1
                              }`
                            ] = fiveChildItem
                          }
                          customComponentsConfig[
                            `${useKey}-${childIndex + 1}-${thirdChildIndex + 1}-${fourChildIndex + 1}`
                          ].childNodes = fiveChildNodes
                        } else {
                          customComponentsConfig[
                            `${useKey}-${childIndex + 1}-${thirdChildIndex + 1}-${fourChildIndex + 1}`
                          ].childNodes = []
                        }
                      }
                      customComponentsConfig[`${useKey}-${childIndex + 1}-${thirdChildIndex + 1}`].childNodes =
                        fourChildNodes
                    } else {
                      customComponentsConfig[`${useKey}-${childIndex + 1}-${thirdChildIndex + 1}`].childNodes = []
                    }
                  }
                  customComponentsConfig[`${useKey}-${childIndex + 1}`].childNodes = thirdChildNodes
                } else {
                  customComponentsConfig[`${useKey}-${childIndex + 1}`].childNodes = []
                }
              }

              customComponentsConfig[String(useKey)].childNodes = secondChildNodes
            }
            if (!isMarketing) {
              componentKey = Number(componentKey) + 1
            }
          }
        }
      }

      const allState = {
        shopInfo,
      }

      let finalConfig: any = {}
      if (customComponentsConfig && Object.keys(customComponentsConfig).length > 0) {
        finalConfig = {
          '0': {
            ...rootConfig,
            childNodes: customComponentsKeys,
          },
          ...customComponentsConfig,
        }
      }

      setComponentConfigs(resolveMappingPageConfig(finalConfig, allState))
      setLoading(false)
      console.log(finalConfig, 'finalConfig')
      updatePageConfig(finalConfig)
    } catch (error) {
      console.log(error)
    }
  }

  return !loading && brickConfig ? (
    <BrickProvider config={brickConfig}>
      <Helmet>
        <title>{intl.formatMessage({ id: 'editor.shop.edit.title' })}</title>
      </Helmet>
      <main className={styles['wrapper']}>
        <ToolBar
          type={isPreview ? 2 : 1}
          title={intl.formatMessage({ id: 'editor.shop.edit.title' })}
          showActions={true}
          layoutType={LAYOUT_TYPE.shop}
          adornId={Number(adornId)}
        />
        <div className={styles['content']}>
          <MobileClientEditLeft layoutType={LAYOUT_TYPE.shop} marketConfigs={MarketingConfigs} />
          <div className={styles['app-wrapper']}>
            <div className={styles['app-canvas-container']}>
              <MobileDesignPanel isPreview={isPreview} onlyEidt theme={theme} pageConfig={componentConfigs} />
            </div>
          </div>
          {!isPreview && (
            <MobileSettingPanel shopId={shopId} layoutType={LAYOUT_TYPE.shop} environment={Number(environment)} />
          )}
        </div>
      </main>
    </BrickProvider>
  ) : (
    <Loading />
  )
}

export default mobileShopTempleteEdit
