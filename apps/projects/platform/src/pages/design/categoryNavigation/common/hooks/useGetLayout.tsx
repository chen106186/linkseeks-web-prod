import React, { useEffect, useState } from 'react'
import { updatePageConfig } from '@apps/design-react'
import { cloneDeep } from 'lodash'
import { getIntl } from '@linkseeks/i18n'
import pageConfig from '../schema/pageConfig'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getCommodityAdornManageFind } from '@apps/apis'

const intl = getIntl()

function useGetLayout() {
  const [info, setInfo] = useState<any>(null)
  /** isSelf 判断自有商城 */
  const { id, isSelf } = usePageStatus()
  const [dataSourceFromRequest, setDataSourceFromRequest] = useState<any>(null)

  useEffect(() => {
    if (!id) {
      setInfo({})
      return
    }

    async function fetchData() {
      const { code, data } = await getCommodityAdornManageFind({
        adornId: id,
      })
      if (code === 1000) {
        setInfo(data || {})
      }
    }
    fetchData()
  }, [id, isSelf])

  useEffect(() => {
    if (info === null) {
      return
    }
    const dataFromRequest = {}
    const { categoryAdornContent } = info
    const { category = [] } = categoryAdornContent || {}
    const startKey = 7
    /** mock data key 对应创建的组件名 */
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
    category.forEach((_item, _index) => {
      const tabName = 'CustomizeTabs.TabItem'
      const configKey = startKey + _index
      dataFromRequest[_item.id] = _item
      tabKeys.push(configKey.toString())
      // const children = Object.keys(_item.children);
      // console.log(children);

      const children = ['secondary', 'flashSale', 'saleRanking', 'brand', 'suggestProduct']
      const tabConfig: any = {
        componentName: tabName,
        title: _item.name,
        props: {
          name: _item.name,
          id: _item.id,
          visible: _item.visible,
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
          canEdit: true,
          canDelete: false,
          canDrag: false,
          childNodes: [],
          childComponentName: grandSonCompoentMap[_child],
          childProps: {
            otherProps: {
              type: `${_child}Item`,
            },
          },
          hideAction: true,
          addBtnText: intl.formatMessage({ id: 'editor.add.childnode' }),
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

    const cloneconfig: any = cloneDeep(pageConfig)
    const nodes = [...(cloneconfig?.['4']?.childNodes || []), ...tabKeys]
    cloneconfig['4'].childNodes = nodes
    const newConfig = {
      ...cloneconfig,
      ...config,
    }
    setDataSourceFromRequest(dataFromRequest)
    updatePageConfig(newConfig)
  }, [info])

  return { info, dataSourceFromRequest }
}

export default useGetLayout
