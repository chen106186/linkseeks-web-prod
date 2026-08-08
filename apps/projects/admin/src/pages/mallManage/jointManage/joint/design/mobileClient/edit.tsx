import React, { useEffect, useState } from 'react'
import { BrickProvider, resolveMappingPageConfig } from '@apps/design-react'
import { PAGECONFIG_PROPS_KEYS, PageConfigType, updatePageConfig } from '@apps/design-core'
import { message } from 'antd'
import moment from 'moment'
import { cloneDeep, isEmpty } from 'lodash'
import { usePageStatus } from '@/hooks/usePageStatus'

import { getCommodityAdornManageFind } from '@apps/apis'
import { getProductCommodityTemplateGetFirstCategoryListByMemberId } from '@apps/apis'
import {
  getMarketingAdornActivityGoodsAdorn,
  getMarketingAdornGoodsListAdorn,
  postMarketingCouponPlatformActivityPageSelectDetail,
} from '@apps/apis'
import { priceFormat } from '@/utils/numberFomat'
import MobileDesignPanel from './mobileDesignPanel'
import { defaultDesign, rootConfig } from './config'
import ToolBar from '@/pages/pageCustomized/components/toolBar'
import MobileClientEditLeft from '@/pages/pageCustomized/components/mobileClientEditLeft'
import Loading from '@/pages/pageCustomized/components/Loading'
import config from '@/pages/pageCustomized/configs'
import MobileSettingPanel from '@/pages/pageCustomized/mobileSettingPanel'
import styles from './index.less'
import { MARKETING_COMPONENTS_TYPE, MOBILE_DESIGN_COMPONENT } from '@apps/design-ui'
import { getComponentAddBtnText, getComponentTitle, getMarketingCardTitle } from '../mobile/utils'

interface ShopPreviewPropsType {
  isPreview: boolean
}

const TemplateList = ['science']

const mobileClientEdit: React.FC<ShopPreviewPropsType> = (props) => {
  const { isPreview = false } = props
  const { adornId, template, environment, shopId } = usePageStatus()
  const [loading, setLoading] = useState<boolean>(true)
  const [theme, setTheme] = useState<string>('theme-mall-science')
  const [temPlateConfig, setTemPlateConfig] = useState<any>()
  const headers = {
    environment,
  }

  useEffect(() => {
    if (!TemplateList.includes(template)) {
      setTheme(`theme-mall-${TemplateList[0]}`)
    } else {
      setTheme(`theme-mall-${template}`)
    }
    getComponentsConfig()
  }, [])

  /**
   * 获取app企业商城装修信息
   */
  const getAppEnterpriseConfig = (): Promise<any> => {
    return new Promise((resolve) => {
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

  const getFirstCategoryList = () => {
    return new Promise((resolve) => {
      getProductCommodityTemplateGetFirstCategoryListByMemberId({ shopId: String(shopId) })
        .then((res) => {
          if (res.code === 1000 && res.data) {
            const list = res.data.map((item) => {
              return {
                label: item.name,
                value: item.id,
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

  const normalizeComponentProps = (data: Record<string, any>, componentName: MOBILE_DESIGN_COMPONENT) => {
    switch (componentName) {
      case MOBILE_DESIGN_COMPONENT.HeaderNav:
        return {
          ...data,
          categoryList: '${categoryList}',
        }

      default:
        return data
    }
  }

  const getComponentsConfig = async () => {
    try {
      const appConfig: any = await getAppEnterpriseConfig()

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
          MOBILE_DESIGN_COMPONENT.HeaderNav,
          MOBILE_DESIGN_COMPONENT.Banner,
          MOBILE_DESIGN_COMPONENT.CouponsModal,
          MOBILE_DESIGN_COMPONENT.MarketingCard,
          MOBILE_DESIGN_COMPONENT.MobileNavCard,
          MOBILE_DESIGN_COMPONENT.ShowCaseBanner,
          MOBILE_DESIGN_COMPONENT.SuggestProduct,
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

            customComponentsConfig[String(useKey)] = {
              title: isMarketing
                ? getMarketingCardTitle(componentItem.props.type)
                : componentItem.componentName === MOBILE_DESIGN_COMPONENT.SuggestProduct
                ? '推荐商品'
                : getComponentTitle(componentItem.componentName as MOBILE_DESIGN_COMPONENT),
              componentName: componentItem.componentName,
              ...propsKeyOjb,
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
        categoryList: await getFirstCategoryList(),
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
      setLoading(false)
      updatePageConfig(resolveMappingPageConfig(finalConfig, allState))
    } catch (error) {
      console.log(error)
    }
  }

  const getPageTitle = () => {
    switch (Number(environment)) {
      case 2:
        return 'H5首页'
      case 3:
        return '小程序首页'
      case 4:
        return 'APP首页'
      default:
        return '首页'
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
        <ToolBar
          type={isPreview ? 2 : 1}
          title={getPageTitle()}
          saveType={2}
          showActions={true}
          adornId={adornId}
          appConfig={temPlateConfig}
        />
        <div className={styles['content']}>
          {!isPreview && <MobileClientEditLeft />}
          <div className={styles['app-wrapper']}>
            <div className={styles['app-canvas-container']}>
              <MobileDesignPanel isPreview={isPreview} theme={theme} onlyEidt />
            </div>
          </div>
          {!isPreview && <MobileSettingPanel shopId={shopId} property={2} environment={Number(environment)} />}
        </div>
      </div>
    </BrickProvider>
  ) : (
    <Loading />
  )
}

export default mobileClientEdit
