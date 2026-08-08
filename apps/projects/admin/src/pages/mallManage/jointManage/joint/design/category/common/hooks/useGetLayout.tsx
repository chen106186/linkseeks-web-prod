import { useEffect, useState } from 'react'
import { updatePageConfig } from '@apps/design-react'
import { cloneDeep } from 'lodash'
import pageConfig from '../schema/pageConfig'
import { getCommodityAdornManageFind } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'

function useGetLayout() {
  const [info, setInfo] = useState<any>(null)
  const { id } = usePageStatus()
  const [dataSourceFromRequest, setDataSourceFromRequest] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      const { code, data } = await getCommodityAdornManageFind({
        adornId: id,
      })
      if (code === 1000) {
        setInfo(data)
      }
    }
    fetchData()
  }, [])
  useEffect(() => {
    if (info === null) {
      return
    }
    const dataFromRequest = {}
    const { categoryAdornContent } = info
    const { category = [] } = categoryAdornContent || {}
    const startKey = 7
    /** data key 对应创建的组件名, 放在Layout 下 */
    const componentMap = {
      secondary: 'SecondaryNavigation',
      flashSale: 'SimpleCommodityList',
      saleRanking: 'SimpleCommodityList',
      brand: 'CategoryList',
      suggestProduct: 'ProductContainer',
    }

    const grandSonCompoentMap = {
      secondary: 'SecondaryNavigation.Item',
      flashSale: 'SimpleCommodityList.Item',
      saleRanking: 'SimpleCommodityList.Item',
      brand: 'CategoryList.Item',
      suggestProduct: 'Product',
    }

    let config = {}
    const tabKeys: string[] = []
    category.filter(Boolean).forEach((_item, _index) => {
      const tabName = 'CustomizeTabs.TabItem'
      const configKey = startKey + _index
      dataFromRequest[_item.id] = _item
      tabKeys.push(configKey.toString())

      /** [{ name: 'secondary', sort: 1 }] */
      const withSortedChildren = Object.keys(_item.children).map((_typeName: string) => {
        const { sort } = _item.children[_typeName]
        return {
          name: _typeName,
          sort: sort,
        }
      })
      // const children = ['secondary', 'flashSale', 'saleRanking', 'brand', 'suggestProduct'];
      const children = withSortedChildren.sort((a, b) => a.sort - b.sort).map((_sortItem) => _sortItem.name)

      const tabConfig: any = {
        componentName: tabName,
        title: _item.name,
        props: {
          name: _item.name,
          id: _item.id,
          // visible: _item.visible,
        },
        otherProps: {
          type: 'tabItem',
        },
        childNodes: [],
      }
      const tabChild = {}
      children.forEach((_child, _childKey) => {
        const tabChildKey = `${configKey}-${_childKey + 1}`
        const componentName = componentMap[_child]
        const { children, ...rest } = _item.children[_child]
        const childConfig = {
          componentName: componentName,
          title: _item.children[_child]?.title || `${configKey}-${_childKey + 1}`,
          props: { ...rest, status: rest?.status ?? true, data: children },
          childNodes: [],
          childComponentName: grandSonCompoentMap[_child],
          childProps: {
            otherProps: {
              type: `${_child}Item`,
            },
            childNodes: [],
          },
          hideAction: true,
          canDelete: false,
          addBtnText: '添加子节点',
          type: _child,
          otherProps: {
            type: _child,
          },
        }
        tabChild[tabChildKey] = childConfig
      })
      tabConfig.childNodes = Object.keys(tabChild)
      config[configKey] = tabConfig
      config = {
        ...config,
        ...tabChild,
      }
    })

    const cloneconfig = cloneDeep(pageConfig)
    const nodes = [...(cloneconfig?.['4']?.childNodes || []), ...tabKeys]
    cloneconfig['4'].childNodes = nodes
    const newConfig = {
      ...cloneconfig,
      ...config,
    }
    console.log('fuck', newConfig)

    setDataSourceFromRequest(dataFromRequest)
    updatePageConfig(newConfig)
  }, [info])

  return { info, dataSourceFromRequest }
}

export default useGetLayout
