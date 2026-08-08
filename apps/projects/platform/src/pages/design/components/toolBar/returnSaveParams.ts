import { PageConfigType, ROOT, ChildNodesType, PAGECONFIG_PROPS_KEYS } from '@apps/design-core'
import { MOBILE_DESIGN_COMPONENT } from '@apps/design-ui'
import { get, isEmpty } from 'lodash'

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

/**
 * 处理店铺装修数据
 * @param adornId
 * @param pageConfig
 */
export const paramsShop = (adornId: number, shopId: number, storeId: number, pageConfig: PageConfigType) => {
  let _params: any = {
    adornId,
    shopId,
    storeId,
    adornContent: {
      marketing: [],
    },
    categoryAdornContent: {},
  }

  const _root: any = pageConfig[ROOT].childNodes || []
  _root.forEach((childKey) => {
    let propsData: any = undefined
    let childNodes: ChildNodesType | undefined = undefined
    let tempProps: any = undefined
    switch (childKey) {
      case '1':
        propsData = get(pageConfig, ['1', 'props']) || {}
        if (propsData.backdrop) {
          _params.adornContent.header = {
            style: 0,
            status: true,
            details: {
              backdrop: propsData.backdrop || '',
            },
          }
        }
        break
      case '2':
        propsData = get(pageConfig, ['2', 'props']) || {}
        childNodes = get(pageConfig, ['2', 'childNodes']) || {}
        _params.adornContent.navList = {
          style: 0,
          status: propsData.status,
          details: [],
        }
        if (childNodes && Array.isArray(childNodes) && childNodes.length > 0) {
          for (let key in childNodes) {
            tempProps = pageConfig[childNodes[key]]?.props || {}
            !isEmpty(tempProps) &&
              _params.adornContent.navList.details.push({
                id: tempProps.id,
                name: tempProps.name,
                type: tempProps.type,
                url: tempProps.url,
                icon: tempProps.icon,
              })
          }
        }
        break
      case '4':
        propsData = get(pageConfig, ['4', 'props']) || {}
        childNodes = get(pageConfig, ['4', 'childNodes']) || {}
        _params.adornContent.advert = {
          style: propsData.styleTheme || 0,
          status: true,
          details: [],
        }
        if (childNodes && Array.isArray(childNodes) && childNodes.length > 0) {
          for (let key in childNodes) {
            tempProps = pageConfig[childNodes[key]]?.props || {}
            !isEmpty(tempProps) &&
              _params.adornContent.advert.details.push({
                id: tempProps.id,
                name: tempProps.name,
                type: tempProps.type,
                img: tempProps.img,
              })
          }
        }
        break
      case '6':
        propsData = get(pageConfig, ['6', 'props']) || {}
        childNodes = get(pageConfig, ['6', 'childNodes']) || {}
        _params.adornContent.commodity = {
          style: 0,
          status: true,
          details: [],
        }
        if (childNodes && Array.isArray(childNodes) && childNodes.length > 0) {
          for (let key in childNodes) {
            tempProps = pageConfig[childNodes[key]]?.props || {}
            !isEmpty(tempProps) &&
              _params.adornContent.commodity.details.push({
                title: tempProps.title,
                categoryId: tempProps.categoryId,
                idList: tempProps.idList,
                manageWay: tempProps.manageWay,
                num: tempProps.num,
              })
          }
        }
        break
      case '11-1': {
        _params.adornContent.marketing.push({
          marketingName: 'specialOffer',
          sort: 1,
          style: 0,
          status: true,
          details: {
            title: pageConfig['11-1-1']?.props?.title,
            explain: pageConfig['11-1-1']?.props?.explain,
            icon: pageConfig['11-1-1']?.props?.icon,
            id: [],
            tags: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'specialOffer'
        })
        if (pageConfig['11-1-2'].childNodes?.length) {
          const _list = pageConfig['11-1-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-2-1']?.props?.title,
            explain: pageConfig['11-2-1']?.props?.explain,
            icon: pageConfig['11-2-1']?.props?.icon,
            id: [],
            tags: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'plummet'
        })
        if (pageConfig['11-2-2'].childNodes?.length) {
          const _list = pageConfig['11-2-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-3-1']?.props?.title,
            explain: pageConfig['11-3-1']?.props?.explain,
            icon: pageConfig['11-3-1']?.props?.icon,
            id: [],
            tags: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'fullQuantitySub'
        })
        if (pageConfig['11-3-2'].childNodes?.length) {
          const _list = pageConfig['11-3-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-4-1']?.props?.title,
            explain: pageConfig['11-4-1']?.props?.explain,
            icon: pageConfig['11-4-1']?.props?.icon,
            id: [],
            tags: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'discount'
        })
        if (pageConfig['11-4-2'].childNodes?.length) {
          const _list = pageConfig['11-4-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-5-1']?.props?.title,
            explain: pageConfig['11-5-1']?.props?.explain,
            icon: pageConfig['11-5-1']?.props?.icon,
            id: [],
            tags: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'fullQuantityDiscount'
        })
        if (pageConfig['11-5-2'].childNodes?.length) {
          const _list = pageConfig['11-5-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-6-1']?.props?.title,
            explain: pageConfig['11-6-1']?.props?.explain,
            icon: pageConfig['11-6-1']?.props?.icon,
            id: [],
            tags: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'fullMoneySub'
        })
        if (pageConfig['11-6-2'].childNodes?.length) {
          const _list = pageConfig['11-6-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-7-1']?.props?.title,
            explain: pageConfig['11-7-1']?.props?.explain,
            icon: pageConfig['11-7-1']?.props?.icon,
            tags: [],
            id: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'fullMoneyDiscount'
        })
        if (pageConfig['11-7-2'].childNodes?.length) {
          const _list = pageConfig['11-7-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-8-1']?.props?.title,
            explain: pageConfig['11-8-1']?.props?.explain,
            icon: pageConfig['11-8-1']?.props?.icon,
            tags: [],
            id: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'giveProduct'
        })
        if (pageConfig['11-8-2'].childNodes?.length) {
          const _list = pageConfig['11-8-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-9-1']?.props?.title,
            explain: pageConfig['11-9-1']?.props?.explain,
            icon: pageConfig['11-9-1']?.props?.icon,
            tags: [],
            id: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'giveCoupon'
        })
        if (pageConfig['11-9-2'].childNodes?.length) {
          const _list = pageConfig['11-9-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-10-1']?.props?.title,
            explain: pageConfig['11-10-1']?.props?.explain,
            icon: pageConfig['11-10-1']?.props?.icon,
            tags: [],
            id: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'morePiece'
        })
        if (pageConfig['11-10-2'].childNodes?.length) {
          const _list = pageConfig['11-10-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-11-1']?.props?.title,
            explain: pageConfig['11-11-1']?.props?.explain,
            icon: pageConfig['11-11-1']?.props?.icon,
            tags: [],
            id: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'combination'
        })
        if (pageConfig['11-11-2'].childNodes?.length) {
          const _list = pageConfig['11-11-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-12-1']?.props?.title,
            explain: pageConfig['11-12-1']?.props?.explain,
            icon: pageConfig['11-12-1']?.props?.icon,
            id: [],
            tags: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'secKill'
        })
        if (pageConfig['11-12-2'].childNodes?.length) {
          const _list = pageConfig['11-12-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-14-1']?.props?.title,
            explain: pageConfig['11-14-1']?.props?.explain,
            icon: pageConfig['11-14-1']?.props?.icon,
            id: [],
            tags: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'fullSwap'
        })
        if (pageConfig['11-14-2'].childNodes?.length) {
          const _list = pageConfig['11-14-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-13-1']?.props?.title,
            explain: pageConfig['11-13-1']?.props?.explain,
            icon: pageConfig['11-13-1']?.props?.icon,
            tags: [],
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
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
          }
        }
        break
      }
      case '11-15': {
        _params.adornContent.marketing.push({
          marketingName: 'buySwap',
          sort: 1,
          style: 0,
          status: true,
          details: {
            title: pageConfig['11-15-1']?.props?.title,
            explain: pageConfig['11-15-1']?.props?.explain,
            icon: pageConfig['11-15-1']?.props?.icon,
            tags: [],
            id: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'buySwap'
        })
        if (pageConfig['11-15-2'].childNodes?.length) {
          const _list = pageConfig['11-15-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-16-1']?.props?.title,
            explain: pageConfig['11-16-1']?.props?.explain,
            icon: pageConfig['11-16-1']?.props?.icon,
            tags: [],
            id: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'preSale'
        })
        if (pageConfig['11-16-2'].childNodes?.length) {
          const _list = pageConfig['11-16-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-17-1']?.props?.title,
            explain: pageConfig['11-17-1']?.props?.explain,
            icon: pageConfig['11-17-1']?.props?.icon,
            tags: [],
            id: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'attempt'
        })
        if (pageConfig['11-17-2'].childNodes?.length) {
          const _list = pageConfig['11-17-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
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
          status: true,
          details: {
            title: pageConfig['11-18-1']?.props?.title,
            explain: pageConfig['11-18-1']?.props?.explain,
            icon: pageConfig['11-18-1']?.props?.icon,
            id: pageConfig['11-18-1']?.props?.id,
            tags: pageConfig['11-18-1']?.props?.tags || [],
          },
        })
        break
      }
      case '11-19': {
        _params.adornContent.marketing.push({
          marketingName: 'bargain',
          sort: 1,
          style: 0,
          status: true,
          details: {
            title: pageConfig['11-19-1']?.props?.title,
            explain: pageConfig['11-19-1']?.props?.explain,
            icon: pageConfig['11-19-1']?.props?.icon,
            tags: [],
            id: [],
          },
        })
        const _index = _params.adornContent.marketing.findIndex((item) => {
          return item.marketingName === 'bargain'
        })
        if (pageConfig['11-19-2'].childNodes?.length) {
          const _list = pageConfig['11-19-2'].childNodes
          for (const key in _list) {
            _params.adornContent.marketing[_index].details.tags.push({
              id: pageConfig[_list[key]]?.props?.id,
              tags: pageConfig[_list[key]]?.props?.tags || [],
            })
            _params.adornContent.marketing[_index].details.id.push(pageConfig[_list[key]]?.props?.id)
          }
        }
        break
      }
      case '13':
        _params.adornContent.coupon = {
          sort: 1,
          style: 0,
          status: true,
          details: {
            title: pageConfig['13']?.props?.title,
            id: [],
          },
        }
        if (pageConfig['13'].childNodes?.length) {
          const _list = pageConfig['13'].childNodes
          for (const key in _list) {
            if (pageConfig[_list[key]]?.props?.id) {
              _params.adornContent.coupon.details.id.push({
                id: pageConfig[_list[key]]?.props?.id,
                belongType: pageConfig[_list[key]]?.props?.belongType,
              })
            }
          }
        }
        break
      // 底部导航
      case '9':
        propsData = get(pageConfig, ['9', 'props']) || {}
        childNodes = get(pageConfig, ['9', 'childNodes']) || {}
        _params.adornContent.bottom = {
          style: propsData.styleTheme || 0,
          status: true,
          details: [],
        }
        if (childNodes && Array.isArray(childNodes) && childNodes.length > 0) {
          for (let key in childNodes) {
            tempProps = pageConfig[childNodes[key]]?.props || {}
            !isEmpty(tempProps) &&
              _params.adornContent.bottom.details.push({
                defaultIcon: tempProps.defaultIcon,
                selectIcon: tempProps.selectIcon,
                name: tempProps.name,
                type: tempProps.type,
              })
          }
        }
        break
    }
  })
  return _params
}

/**
 * 处理渠道装修数据
 * @param adornId
 * @param pageConfig
 */
export const paramsOwnMall = (adornId: number, shopId: number, pageConfig: PageConfigType, templateInfo: any) => {
  let _params: any = {
    adornId,
    shopId,
    adornContent: {
      marketing: [],
    },
    categoryAdornContent: templateInfo?.categoryAdornContent || {},
  }

  const _root: any = pageConfig[ROOT].childNodes || []
  _root.forEach((childKey) => {
    let propsData: any = undefined
    let childNodes: ChildNodesType | undefined = undefined
    let tempProps: any = undefined
    switch (childKey) {
      case '3':
        propsData = get(pageConfig, ['3', 'props']) || {}
        childNodes = get(pageConfig, ['3', 'childNodes']) || {}
        _params.adornContent.advert = {
          style: propsData.styleTheme || 0,
          status: true,
          details: [],
        }
        if (childNodes && Array.isArray(childNodes) && childNodes.length > 0) {
          for (let key in childNodes) {
            tempProps = pageConfig[childNodes[key]]?.props || {}
            !isEmpty(tempProps) &&
              _params.adornContent.advert.details.push({
                id: tempProps.id,
                name: tempProps.name,
                type: tempProps.type,
                img: tempProps.img,
              })
          }
        }
        break
      case '5':
        propsData = get(pageConfig, ['5', 'props']) || {}
        childNodes = get(pageConfig, ['5', 'childNodes']) || {}
        _params.adornContent.navList = {
          style: 0,
          status: propsData.status,
          details: [],
        }
        if (childNodes && Array.isArray(childNodes) && childNodes.length > 0) {
          for (let key in childNodes) {
            tempProps = pageConfig[childNodes[key]]?.props || {}
            !isEmpty(tempProps) &&
              _params.adornContent.navList.details.push({
                id: tempProps.id,
                name: tempProps.name,
                type: tempProps.type,
                url: tempProps.url,
                icon: tempProps.icon,
              })
          }
        }
        break
      case '16':
        propsData = get(pageConfig, ['16', 'props']) || {}
        const headerPropsData = get(pageConfig, ['17', 'props']) || {}
        const brandListPropsData = get(pageConfig, ['18', 'props']) || {}
        _params.adornContent.brand = {
          style: 0,
          status: propsData.status,
          details: {
            title: headerPropsData?.title,
            explain: headerPropsData?.explain,
            ids: brandListPropsData?.brandIds,
          },
        }
        break
      case '12':
        _params.adornContent.suggestProduct = {
          sort: 1,
          style: 0,
          status: true,
          details: [],
        }
        if (pageConfig['12'].childNodes?.length) {
          const _list = pageConfig['12'].childNodes
          for (const key in pageConfig['12'].childNodes) {
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
                if (pageConfig[_childList[keys]].props.id) {
                  _customize.push({
                    id: pageConfig[_childList[keys]].props.id,
                    tags: pageConfig[_childList[keys]].props.tags || [],
                  })
                }
              }
              _obj.customize = _customize
            }
            _params.adornContent.suggestProduct.details.push(_obj)
          }
        }
        break
      case '11-1': {
        _params.adornContent.marketing.push({
          marketingName: 'specialOffer',
          sort: 1,
          style: 0,
          status: true,
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
        if (pageConfig['11-1-2']?.childNodes?.length) {
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
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
          status: true,
          details: {
            title: pageConfig['11-18-1']?.props?.title,
            explain: pageConfig['11-18-1']?.props?.explain,
            icon: pageConfig['11-18-1']?.props?.icon,
            id: pageConfig['11-18-1']?.props?.id,
            tags: pageConfig['11-18-1']?.props?.tags || [],
          },
        })
        break
      }
      case '11-19': {
        _params.adornContent.marketing.push({
          marketingName: 'bargain',
          sort: 1,
          style: 0,
          status: true,
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
      case '13':
        _params.adornContent.coupon = {
          sort: 1,
          style: 0,
          status: true,
          details: {
            title: pageConfig['13']?.props?.title,
            id: [],
          },
        }
        if (pageConfig['13'].childNodes?.length) {
          const _list = pageConfig['13'].childNodes
          for (const key in _list) {
            if (pageConfig[_list[key]]?.props?.id) {
              _params.adornContent.coupon.details.id.push({
                id: pageConfig[_list[key]]?.props?.id,
                belongType: pageConfig[_list[key]]?.props?.belongType,
              })
            }
          }
        }
        break
      // 底部导航
      case '14':
        propsData = get(pageConfig, ['14', 'props']) || {}
        childNodes = get(pageConfig, ['14', 'childNodes']) || {}
        _params.adornContent.bottom = {
          style: propsData.styleTheme || 0,
          status: true,
          details: [],
        }
        if (childNodes && Array.isArray(childNodes) && childNodes.length > 0) {
          for (let key in childNodes) {
            tempProps = pageConfig[childNodes[key]]?.props || {}
            !isEmpty(tempProps) &&
              _params.adornContent.bottom.details.push({
                defaultIcon: tempProps.defaultIcon,
                selectIcon: tempProps.selectIcon,
                name: tempProps.name,
                type: tempProps.type,
              })
          }
        }
        break
    }
  })
  return _params
}

/**
 * 处理移动端装修数据
 * @param adornId
 * @param pageConfig
 */
export const getMobileDesignParam = (pageConfig: PageConfigType, adornId: number, shopId: number, storeId?: number) => {
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
      case MOBILE_DESIGN_COMPONENT.ChannelHeaderNav:
        adornContent[MOBILE_DESIGN_COMPONENT.ChannelHeaderNav] = {
          ...mergeProps,
          sort: 0,
          children: getChildrenConfig(childNodes, pageConfig),
        }
        break
      case MOBILE_DESIGN_COMPONENT.MobileShopHeader:
        adornContent[MOBILE_DESIGN_COMPONENT.MobileShopHeader] = {
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
      case MOBILE_DESIGN_COMPONENT.MobileBrand:
        adornContent[MOBILE_DESIGN_COMPONENT.MobileBrand] = {
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
          sort: 997,
          children: getChildrenConfig(childNodes, pageConfig),
        }
        break
      case MOBILE_DESIGN_COMPONENT.MobileShopCommodity:
        adornContent[MOBILE_DESIGN_COMPONENT.MobileShopCommodity] = {
          ...mergeProps,
          sort,
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

  return {
    adornId,
    shopId,
    storeId,
    adornContent,
  }
}
