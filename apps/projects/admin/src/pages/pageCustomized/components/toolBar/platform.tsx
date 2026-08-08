import React, { useCallback, useState } from 'react'
import { Modal, Button, message } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { postCommodityAdornWebPlatformSave } from '@apps/apis'
import { STATE_PROPS, PageConfigType, PROPS_SETTING_TYPES, ROOT } from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import { history } from '@linkseeks/router-manager'
import { usePageStatus } from '@/hooks/usePageStatus'
import { normalizeSortConfig } from './webParams'
import styles from './index.less'
import { PLATFORM_DESIGN_COMPONENT } from '@apps/design-ui'

export interface DesingConfigItemType {
  name: string
  status: boolean
  sort?: number
  content: any
}

interface ToolBarPropsType {
  type?: number
  title?: string
  showActions?: boolean
  adornId?: number
}

type SettingPanelType = {
  // selectedInfo: SelectedInfoType,
  pageConfig: PageConfigType
}

const PlatformToolBar: React.FC<ToolBarPropsType> = (props) => {
  const { type = 1, title = '平台首页' } = props
  const { id, shopId } = usePageStatus()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const { pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['pageConfig'])

  const handleGoBack = () => {
    if (type === 1) {
      Modal.confirm({
        content: '是否确认离开模板装修页面？',
        okText: '确认',
        className: styles.modal_confirm,
        cancelText: '取消',
        onOk: () => {
          history.goBack()
        },
      })
    } else {
      history.goBack()
    }
  }

  const handleSave = useCallback(() => {
    // const _root: any = pageConfig[ROOT].childNodes || []

    // const sortConfig: any = []
    // _root.forEach((key) => {
    // 	sortConfig.push(...normalizeSortConfig(pageConfig[key], pageConfig))
    // })

    // const adornContent: Record<string, any> = {}
    // sortConfig.forEach((ele, childKey) => {
    // 	const item = ele
    // 	const sort = childKey + 1
    // 	const { props } = item
    // 	// 根据组件名称格式化装修数据
    // 	switch (item.componentName) {
    // 		// 导航
    // 		case PLATFORM_DESIGN_COMPONENT.MallMainNav:
    // 			adornContent[PLATFORM_DESIGN_COMPONENT.MallMainNav] = {
    // 				...props,
    // 				sort,
    // 			}
    // 			break
    // 		case PLATFORM_DESIGN_COMPONENT.PlatformAdvert:
    // 			adornContent[`${PLATFORM_DESIGN_COMPONENT.PlatformAdvert}-${props.type}`] = {
    // 				...props,
    // 				sort,
    // 			}
    // 			break
    // 		case PLATFORM_DESIGN_COMPONENT.PlatformBrand:
    // 			adornContent[PLATFORM_DESIGN_COMPONENT.PlatformBrand] = {
    // 				...props,
    // 				sort,
    // 			}
    // 			break
    // 		case PLATFORM_DESIGN_COMPONENT.PlatformGoods:
    // 			adornContent[`${PLATFORM_DESIGN_COMPONENT.PlatformGoods}-${sort}`] = {
    // 				...props,
    // 				sort,
    // 			}
    // 			break
    // 		case PLATFORM_DESIGN_COMPONENT.PlatformInformation:
    // 			adornContent[PLATFORM_DESIGN_COMPONENT.PlatformInformation] = {
    // 				...props,
    // 				sort,
    // 			}
    // 			break
    // 		case PLATFORM_DESIGN_COMPONENT.PlatformLogistics:
    // 			adornContent[PLATFORM_DESIGN_COMPONENT.PlatformLogistics] = {
    // 				...props,
    // 				sort,
    // 			}
    // 			break
    // 		case PLATFORM_DESIGN_COMPONENT.PlatformMerchant:
    // 			adornContent[PLATFORM_DESIGN_COMPONENT.PlatformMerchant] = {
    // 				...props,
    // 				sort,
    // 			}
    // 			break
    // 		case PLATFORM_DESIGN_COMPONENT.PlatformProcess:
    // 			adornContent[PLATFORM_DESIGN_COMPONENT.PlatformProcess] = {
    // 				...props,
    // 				sort,
    // 			}
    // 			break
    // 		case PLATFORM_DESIGN_COMPONENT.PlatformPurchase:
    // 			adornContent[PLATFORM_DESIGN_COMPONENT.PlatformPurchase] = {
    // 				...props,
    // 				sort,
    // 			}
    // 			break
    // 		case PLATFORM_DESIGN_COMPONENT['PlatformPurchase.Banner']:
    // 			adornContent[PLATFORM_DESIGN_COMPONENT['PlatformPurchase.Banner']] = {
    // 				...props,
    // 				sort,
    // 			}
    // 			break
    // 		case PLATFORM_DESIGN_COMPONENT.PlatformQuickNav:
    // 			adornContent[PLATFORM_DESIGN_COMPONENT.PlatformQuickNav] = {
    // 				...props,
    // 				sort,
    // 			}
    // 			break
    // 		case PLATFORM_DESIGN_COMPONENT.PlatformService:
    // 			adornContent[PLATFORM_DESIGN_COMPONENT.PlatformService] = {
    // 				...props,
    // 				sort,
    // 			}
    // 			break
    // 		default:
    // 			break
    // 	}
    // })
    // console.log(adornContent, 'adornContent')

    let resultConfig: DesingConfigItemType[] = []
    const goodsList: DesingConfigItemType[] = []
    let goodsSort = 0
    Object.keys(pageConfig).forEach((key, index) => {
      const componentConfigsItem = pageConfig[key]
      if (componentConfigsItem.componentType) {
        switch (componentConfigsItem.componentType) {
          case PROPS_SETTING_TYPES.mallNav:
            resultConfig.push({
              name: 'navList',
              status: true,
              sort: index,
              content: componentConfigsItem.props?.menuData.map((item, index) => ({
                ...item,
                sort: index + 1,
              })),
            })
            break
          case PROPS_SETTING_TYPES.platformAdvert:
            const { type, advertList } = componentConfigsItem.props || {}
            // 'banner' | 'bannerRight' | 'bannerBottom' | 'floorBanner' | 'service'
            switch (type) {
              case 'banner':
                resultConfig.push({
                  name: 'bannerAdvert',
                  status: true,
                  sort: index,
                  content: advertList,
                })
                break
              case 'bannerRight':
                resultConfig.push({
                  name: 'bannerRightAdvert',
                  status: true,
                  sort: index,
                  content: advertList,
                })
                break
              case 'bannerBottom':
                resultConfig.push({
                  name: 'banneBottomrAdvert',
                  status: true,
                  sort: index,
                  content: advertList,
                })
                break
              case 'floorBanner':
                resultConfig.push({
                  name: 'middleAdvert',
                  status: true,
                  sort: index,
                  content: advertList,
                })
                break
              case 'service':
                resultConfig.push({
                  name: 'bottomAdvert',
                  status: true,
                  sort: index,
                  content: advertList,
                })
                break
              default:
                break
            }
            break
          case PROPS_SETTING_TYPES.platformQuickNav:
            const { sellQuickNavList, buyQuickNavList, quickNavList } = componentConfigsItem.props || {}
            resultConfig.push({
              name: 'fastVisit',
              status: true,
              sort: index,
              content: {
                sellerBOList: sellQuickNavList,
                buyerBOList: buyQuickNavList,
                fastFunctionBOList: quickNavList,
              },
            })
            break
          case PROPS_SETTING_TYPES.platformGoods:
            goodsList.push(componentConfigsItem.props?.dataInfo)
            if (resultConfig.some((item) => item.name === 'goods')) {
              resultConfig = resultConfig.map((item) => {
                if (item.name === 'goods') {
                  return {
                    ...item,
                    content: goodsList,
                  }
                }
                return item
              })
            } else {
              resultConfig.push({
                name: 'goods',
                sort: 0,
                status: true,
                content: goodsList,
              })
            }
            break
          case PROPS_SETTING_TYPES.platformBrand:
            resultConfig.push({
              name: 'brand',
              sort: index,
              status: true,
              content: componentConfigsItem.props?.dataList,
            })
            break
          case PROPS_SETTING_TYPES.platformMechant:
            resultConfig.push({
              name: 'merchant',
              sort: index,
              status: true,
              content: componentConfigsItem.props?.dataList,
            })
            break
          case PROPS_SETTING_TYPES.platformInformation:
            const { marketList, information } = componentConfigsItem.props || {}
            resultConfig.push({
              name: 'marketInformation',
              status: true,
              sort: index,
              content: {
                marketList: marketList,
                information: information,
              },
            })
            break
          case PROPS_SETTING_TYPES.platformPurchaseAdvert:
            resultConfig.push({
              name: 'purchase',
              sort: index,
              status: true,
              content: componentConfigsItem.props?.advertList,
            })
            break
          case PROPS_SETTING_TYPES.platformLogistics:
            resultConfig.push({
              name: 'logistics',
              sort: index,
              status: true,
              content: componentConfigsItem.props?.dataInfo,
            })
            break
          case PROPS_SETTING_TYPES.platformProcess:
            resultConfig.push({
              name: 'process',
              sort: index,
              status: true,
              content: componentConfigsItem.props?.dataInfo,
            })
            break
          case PROPS_SETTING_TYPES.platformService:
            resultConfig.push({
              name: 'platform',
              sort: index,
              status: true,
              content: componentConfigsItem.props?.dataList,
            })
            break
          default:
            break
        }
      }
    })

    setConfirmLoading(true)
    saveWebPlatformDesign(resultConfig)
  }, [pageConfig])

  const saveWebPlatformDesign = (configList: DesingConfigItemType[]) => {
    const param: any = {
      adornId: id,
      list: configList,
    }
    postCommodityAdornWebPlatformSave(param)
      .then((res) => {
        if (res.code === 1000) {
          message.destroy()
          message.success('保存成功')
        }
        setConfirmLoading(false)
      })
      .catch(() => {
        setConfirmLoading(false)
      })
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbar_back_btn} onClick={() => handleGoBack()}>
        <ArrowLeftOutlined />
      </div>
      <div className={styles.toolbar_title}>
        <span>{type === 1 ? '正在编辑：' : '正在预览：'}</span>
        <label>{title}</label>
      </div>
      {type == 1 && (
        <div className={styles.toolbar_actions}>
          <Button type="link" onClick={() => handleGoBack()}>
            取消
          </Button>
          <Button icon={<SaveOutlined />} loading={confirmLoading} type="primary" onClick={() => handleSave()}>
            保存
          </Button>
        </div>
      )}
    </div>
  )
}

PlatformToolBar.defaultProps = {
  type: 1,
  title: '平台首页',
  showActions: false,
}

export default PlatformToolBar
