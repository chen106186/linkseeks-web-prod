import { PageConfigType, ROOT, PAGECONFIG_PROPS_KEYS } from '@apps/design-core'
import { MOBILE_DESIGN_COMPONENT } from '@apps/design-ui'

const getChildrenConfig = (nodes: string[], pageConfig: PageConfigType) => {
  const list: Array<Record<string, any>> = []
  if (nodes && Array.isArray(nodes) && nodes.length > 0) {
    for (let key in nodes) {
      const childConfig = { ...pageConfig[nodes[key]] }
      const { props, childNodes } = childConfig
      const newProps = childConfig?.props ? { ...props } : {}

      const deletePropsAttr = ['pageConfig', 'selectedKey', 'property', 'shopId']
      const deleteChildConfigAttr = ['key', 'childNodes']

      for (const propsAtrItemKey of deletePropsAttr) {
        if (newProps[propsAtrItemKey]) {
          delete newProps[propsAtrItemKey]
        }
      }

      for (const childConfigItemKey of deleteChildConfigAttr) {
        if (childConfig[childConfigItemKey]) {
          delete childConfig[childConfigItemKey]
        }
      }

      list.push({
        ...childConfig,
        props: newProps,
        children: Array.isArray(childNodes) && childNodes.length > 0 ? getChildrenConfig(childNodes, pageConfig) : [],
      })
    }
  }
  return list
}

export const paramsClient = (adornId: any, shopId: number, pageConfig: any, appConfig: any) => {
  const _params: any = {
    adornId,
    shopId,
    adornContent: {
      marketing: [],
    },
    categoryAdornContent: appConfig?.categoryAdornContent ?? {},
  }
  const _root: any = pageConfig['0'].childNodes
  _root?.forEach((item) => {
    if (item != '1') {
      switch (item) {
        case '2': {
          _params.adornContent.marketing.push({
            marketingName: 'advert',
            sort: 1,
            style: 0,
            visible: true,
            details: [],
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'advert'
          })
          if (pageConfig['2'].childNodes?.length) {
            const _list = pageConfig['2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.push({
                id: pageConfig[_list[key]]?.props?.id,
                img: pageConfig[_list[key]]?.props?.img,
                name: pageConfig[_list[key]]?.props?.name,
                type: pageConfig[_list[key]]?.props?.type,
              })
            }
          }
          break
        }
        case '3': {
          _params.adornContent.marketing.push({
            marketingName: 'category',
            sort: 1,
            style: 0,
            visible: pageConfig['3'].props.visible,
            details: [],
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'category'
          })
          if (pageConfig['3'].childNodes?.length) {
            const _list = pageConfig['3'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.push({
                id: pageConfig[_list[key]]?.props?.id,
                icon: pageConfig[_list[key]]?.props?.icon,
                name: pageConfig[_list[key]]?.props?.name,
                type: pageConfig[_list[key]]?.props?.type,
                url: pageConfig[_list[key]]?.props?.url,
              })
            }
          }
          break
        }
        case '11-1': {
          _params.adornContent.marketing.push({
            marketingName: 'specialOffer',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-1-1']?.props?.title,
              explain: pageConfig['11-1-1']?.props?.explain,
              icon: pageConfig['11-1-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'specialOffer'
          })
          if (pageConfig['11-1-2'].childNodes?.length) {
            const _list = pageConfig['11-1-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-2': {
          _params.adornContent.marketing.push({
            marketingName: 'plummet',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-2-1']?.props?.title,
              explain: pageConfig['11-2-1']?.props?.explain,
              icon: pageConfig['11-2-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'plummet'
          })
          if (pageConfig['11-2-2'].childNodes?.length) {
            const _list = pageConfig['11-2-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-3': {
          _params.adornContent.marketing.push({
            marketingName: 'fullQuantitySub',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-3-1']?.props?.title,
              explain: pageConfig['11-3-1']?.props?.explain,
              icon: pageConfig['11-3-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'fullQuantitySub'
          })
          if (pageConfig['11-3-2'].childNodes?.length) {
            const _list = pageConfig['11-3-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-4': {
          _params.adornContent.marketing.push({
            marketingName: 'discount',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-4-1']?.props?.title,
              explain: pageConfig['11-4-1']?.props?.explain,
              icon: pageConfig['11-4-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'discount'
          })
          if (pageConfig['11-4-2'].childNodes?.length) {
            const _list = pageConfig['11-4-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-5': {
          _params.adornContent.marketing.push({
            marketingName: 'fullQuantityDiscount',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-5-1']?.props?.title,
              explain: pageConfig['11-5-1']?.props?.explain,
              icon: pageConfig['11-5-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'fullQuantityDiscount'
          })
          if (pageConfig['11-5-2'].childNodes?.length) {
            const _list = pageConfig['11-5-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-6': {
          _params.adornContent.marketing.push({
            marketingName: 'fullMoneySub',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-6-1']?.props?.title,
              explain: pageConfig['11-6-1']?.props?.explain,
              icon: pageConfig['11-6-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'fullMoneySub'
          })
          if (pageConfig['11-6-2'].childNodes?.length) {
            const _list = pageConfig['11-6-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-7': {
          _params.adornContent.marketing.push({
            marketingName: 'fullMoneyDiscount',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-7-1']?.props?.title,
              explain: pageConfig['11-7-1']?.props?.explain,
              icon: pageConfig['11-7-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'fullMoneyDiscount'
          })
          if (pageConfig['11-7-2'].childNodes?.length) {
            const _list = pageConfig['11-7-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-8': {
          _params.adornContent.marketing.push({
            marketingName: 'giveProduct',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-8-1']?.props?.title,
              explain: pageConfig['11-8-1']?.props?.explain,
              icon: pageConfig['11-8-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'giveProduct'
          })
          if (pageConfig['11-8-2'].childNodes?.length) {
            const _list = pageConfig['11-8-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-9': {
          _params.adornContent.marketing.push({
            marketingName: 'giveCoupon',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-9-1']?.props?.title,
              explain: pageConfig['11-9-1']?.props?.explain,
              icon: pageConfig['11-9-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'giveCoupon'
          })
          if (pageConfig['11-9-2'].childNodes?.length) {
            const _list = pageConfig['11-9-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-10': {
          _params.adornContent.marketing.push({
            marketingName: 'morePiece',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-10-1']?.props?.title,
              explain: pageConfig['11-10-1']?.props?.explain,
              icon: pageConfig['11-10-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'morePiece'
          })
          if (pageConfig['11-10-2'].childNodes?.length) {
            const _list = pageConfig['11-10-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-11': {
          _params.adornContent.marketing.push({
            marketingName: 'combination',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-11-1']?.props?.title,
              explain: pageConfig['11-11-1']?.props?.explain,
              icon: pageConfig['11-11-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'combination'
          })
          if (pageConfig['11-11-2'].childNodes?.length) {
            const _list = pageConfig['11-11-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-12': {
          _params.adornContent.marketing.push({
            marketingName: 'secKill',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-12-1']?.props?.title,
              explain: pageConfig['11-12-1']?.props?.explain,
              icon: pageConfig['11-12-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'secKill'
          })
          if (pageConfig['11-12-2'].childNodes?.length) {
            const _list = pageConfig['11-12-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-14': {
          _params.adornContent.marketing.push({
            marketingName: 'fullSwap',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-14-1']?.props?.title,
              explain: pageConfig['11-14-1']?.props?.explain,
              icon: pageConfig['11-14-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'fullSwap'
          })
          if (pageConfig['11-14-2'].childNodes?.length) {
            const _list = pageConfig['11-14-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-13': {
          _params.adornContent.marketing.push({
            marketingName: 'groupPurchase',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-13-1']?.props?.title,
              explain: pageConfig['11-13-1']?.props?.explain,
              icon: pageConfig['11-13-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'groupPurchase'
          })
          if (pageConfig['11-13-2'].childNodes?.length) {
            const _list = pageConfig['11-13-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-15': {
          _params.adornContent.marketing.push({
            marketingName: 'buySwap',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-15-1']?.props?.title,
              explain: pageConfig['11-15-1']?.props?.explain,
              icon: pageConfig['11-15-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'buySwap'
          })
          if (pageConfig['11-15-2'].childNodes?.length) {
            const _list = pageConfig['11-15-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-16': {
          _params.adornContent.marketing.push({
            marketingName: 'preSale',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-16-1']?.props?.title,
              explain: pageConfig['11-16-1']?.props?.explain,
              icon: pageConfig['11-16-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'preSale'
          })
          if (pageConfig['11-16-2'].childNodes?.length) {
            const _list = pageConfig['11-16-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-17': {
          _params.adornContent.marketing.push({
            marketingName: 'attempt',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-17-1']?.props?.title,
              explain: pageConfig['11-17-1']?.props?.explain,
              icon: pageConfig['11-17-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'attempt'
          })
          if (pageConfig['11-17-2'].childNodes?.length) {
            const _list = pageConfig['11-17-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '11-18': {
          _params.adornContent.marketing.push({
            marketingName: 'setMeal',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-18-1']?.props?.title,
              explain: pageConfig['11-18-1']?.props?.explain,
              icon: pageConfig['11-18-1']?.props?.icon,
              id: pageConfig['11-18-1']?.props?.id,
            },
          })
          break
        }
        case '11-19': {
          _params.adornContent.marketing.push({
            marketingName: 'bargain',
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['11-19-1']?.props?.title,
              explain: pageConfig['11-19-1']?.props?.explain,
              icon: pageConfig['11-19-1']?.props?.icon,
              id: [],
            },
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'bargain'
          })
          if (pageConfig['11-19-2'].childNodes?.length) {
            const _list = pageConfig['11-19-2'].childNodes
            for (const key in _list) {
              _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
            }
          }
          break
        }
        case '10': {
          _params.adornContent.marketing.push({
            marketingName: 'suggestProduct',
            sort: 1,
            style: 0,
            visible: true,
            details: [],
          })
          const _index = _params.adornContent.marketing.findIndex((item) => {
            return item.marketingName === 'suggestProduct'
          })
          if (pageConfig['10'].childNodes?.length) {
            const _list = pageConfig['10'].childNodes
            for (const key in pageConfig['10'].childNodes) {
              const _obj: any = {
                title: pageConfig[_list[key]]?.props?.title,
                explain: pageConfig[_list[key]]?.props?.explain,
                type: pageConfig[_list[key]]?.props?.type,
                num: pageConfig[_list[key]]?.props?.num,
              }
              const _childList = pageConfig[_list[key]]?.childNodes
              if (_childList?.length) {
                const _customize: any = []
                for (const keys in _childList) {
                  _customize.push({
                    id: pageConfig[_childList[keys]].props.id,
                    tags: pageConfig[_childList[keys]].props.tags,
                  })
                }
                _obj.customize = _customize
              }
              _params.adornContent.marketing[_index].details.push(_obj)
            }
          }
          break
        }
        case '12':
          _params.adornContent.bottom = {
            sort: 1,
            style: 0,
            visible: true,
            details: [],
          }
          if (pageConfig['12'].childNodes?.length) {
            const _list = pageConfig['12'].childNodes
            for (const key in pageConfig['12'].childNodes) {
              _params.adornContent.bottom.details.push({
                defaultIcon: pageConfig[_list[key]]?.props?.defaultIcon,
                selectIcon: pageConfig[_list[key]]?.props?.selectIcon,
                name: pageConfig[_list[key]]?.props?.name,
                type: pageConfig[_list[key]]?.props?.type,
              })
            }
          }
          break
        case '13':
          _params.adornContent.coupon = {
            sort: 1,
            style: 0,
            visible: true,
            details: {
              title: pageConfig['13']?.props?.title,
              id: [],
            },
          }
          if (pageConfig['13'].childNodes?.length) {
            const _list = pageConfig['13'].childNodes
            for (const key in _list) {
              _params.adornContent.coupon.details.id.push({
                id: pageConfig[_list[key]]?.props?.id,
                belongType: pageConfig[_list[key]]?.props?.belongType,
              })
            }
          }
          break

        default:
          break
      }
    }
  })
  return _params
}

/**
 * 处理B端APP商城装修数据
 * @param adornId
 * @param pageConfig
 */
export const paramsBusiness = (adornId: number, shopId: number, pageConfig: PageConfigType) => {
  let _params: any = {
    adornId,
    shopId,
    adornContent: {},
  }

  const _root: any = pageConfig[ROOT].childNodes || []

  const sortConfig: any = []
  _root.forEach((key) => {
    sortConfig.push(pageConfig[key])
  })

  const adornContent: Record<string, any> = {}
  sortConfig.forEach((ele, childKey) => {
    const item = ele
    const sort = childKey + 1
    const { props, childNodes } = item
    const allKeys = Object.keys(item)

    const propsKeyOjb: Record<string, any> = {}

    for (const key of allKeys) {
      if (PAGECONFIG_PROPS_KEYS.includes(key)) {
        propsKeyOjb[key] = item[key]
      }
    }

    const mergeProps = {
      ...propsKeyOjb,
      props,
    }

    // 根据组件名称格式化装修数据
    switch (item.componentName as MOBILE_DESIGN_COMPONENT) {
      case MOBILE_DESIGN_COMPONENT.HeaderNav:
        adornContent[MOBILE_DESIGN_COMPONENT.HeaderNav] = {
          ...mergeProps,
          sort: 0,
          children: getChildrenConfig(childNodes, pageConfig),
        }
        break
      case MOBILE_DESIGN_COMPONENT.Banner:
        adornContent[MOBILE_DESIGN_COMPONENT.Banner] = {
          ...mergeProps,
          sort,
          children: getChildrenConfig(childNodes, pageConfig),
        }
        break
      case MOBILE_DESIGN_COMPONENT.InformationCard:
        adornContent[MOBILE_DESIGN_COMPONENT.InformationCard] = {
          ...mergeProps,
          sort,
          children: getChildrenConfig(childNodes, pageConfig),
        }
        break
      case MOBILE_DESIGN_COMPONENT.MobileNavCard:
        adornContent[MOBILE_DESIGN_COMPONENT.MobileNavCard] = {
          ...mergeProps,
          sort,
          children: getChildrenConfig(childNodes, pageConfig),
        }
        break
      case MOBILE_DESIGN_COMPONENT.RecommendShop:
        adornContent[MOBILE_DESIGN_COMPONENT.RecommendShop] = {
          ...mergeProps,
          sort,
          children: getChildrenConfig(childNodes, pageConfig),
        }
        break
      case MOBILE_DESIGN_COMPONENT.ShowCaseBanner:
        adornContent[MOBILE_DESIGN_COMPONENT.ShowCaseBanner] = {
          ...mergeProps,
          sort,
          children: getChildrenConfig(childNodes, pageConfig),
        }
        break
      case MOBILE_DESIGN_COMPONENT.SuggestProduct:
        adornContent[MOBILE_DESIGN_COMPONENT.SuggestProduct] = {
          ...mergeProps,
          sort: 998,
          children: getChildrenConfig(childNodes, pageConfig),
        }
        break
      case MOBILE_DESIGN_COMPONENT.MarketingCard:
        adornContent[`${MOBILE_DESIGN_COMPONENT.MarketingCard}-${props.type}`] = {
          ...mergeProps,
          sort,
          children: getChildrenConfig(childNodes, pageConfig),
        }
        break
      case MOBILE_DESIGN_COMPONENT.CouponsModal:
        adornContent[MOBILE_DESIGN_COMPONENT.CouponsModal] = {
          ...mergeProps,
          sort,
          children: getChildrenConfig(childNodes, pageConfig),
        }
        break
      case MOBILE_DESIGN_COMPONENT.BottomNavigation:
        adornContent[MOBILE_DESIGN_COMPONENT.BottomNavigation] = {
          ...mergeProps,
          sort: 999,
          children: getChildrenConfig(childNodes, pageConfig),
        }
        break
      default:
        break
    }
  })
  _params.adornContent = adornContent
  return _params
}
