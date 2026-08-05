import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import cs from 'classnames'
import { createActions, useSelector } from '@apps/design-react'
import { cloneDeep } from 'lodash'
import styles from './index.less'
import { getMarketingAdornActivityGoodsAdorn, getMarketingAdornGoodsListAdorn } from '@apps/apis'
import { getProductCommodityTemplateGetBrandList } from '@apps/apis'

const { TabPane } = Tabs

interface Iprops {
  defaultActiveKey: string
  children: React.ReactElement
}

const CustomizeTabs: React.FC<Iprops> & { TabItem: typeof TabItem } = (props: Iprops) => {
  const { children } = props
  const { pageConfig, shopId, selectedInfo } = useSelector(['pageConfig', 'shopId', 'selectedInfo'])
  const [activeKey, setActiveKey] = useState<string>('2')
  const [hasRequestTabKey, setHasRequestTabKey] = useState<string[]>([])

  // const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, getOperateState, className, ...rest} = props as any;
  // /** guaidLine 属性 */
  // const divProps = {
  //   onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver
  // };

  useEffect(() => {
    // const matches = activeKey.match(/id_(.*)\/\.\$(\d+)/);
    if (selectedInfo === null) {
      return
    }
    const { domTreeKeys } = selectedInfo
    if (domTreeKeys.length < 3) {
      return
    }
    const activeTabKeyID = domTreeKeys[2]
    const props = pageConfig[activeTabKeyID].props
    const formatTabKey = `id_${props.id}/.$${activeTabKeyID}`
    onChange(formatTabKey)
  }, [selectedInfo])

  const getActivityProduct = async (ids: number[]) => {
    if (ids.length === 0) {
      return null
    }
    return getMarketingAdornActivityGoodsAdorn({ ids: ids as any })
  }

  /** @toReview获取商品详情和获取品牌，传递复杂类型用get请求不太合理 */
  const getProduct = async (ids: number[]) => {
    if (ids?.length === 0) {
      return null
    }
    return getMarketingAdornGoodsListAdorn({
      idInList: ids ? ids.join(',') : ('' as any),
      shopId: shopId,
      current: 1,
      pageSize: ids.length,
    } as any)
  }

  const getBrand = async (ids: number[]) => {
    if (ids?.length === 0) {
      return null
    }
    const postData = {
      idInList: ids,
      shopId: shopId,
      current: 1,
      pageSize: ids.length,
    }
    return getProductCommodityTemplateGetBrandList(postData as any)
  }

  /** 并行请求 */
  const getAnyData = async (postData: any) => {
    const mapToAsync = {
      saleRanking: getProduct,
      suggestProduct: getProduct,
      flashSale: getActivityProduct,
      brand: getBrand,
    }
    const sorted = ['flashSale', 'saleRanking', 'brand', 'suggestProduct']
    const queue = sorted.map((_item) => {
      return mapToAsync[_item](postData?.[_item] || [])
    })
    const result = await Promise.all(queue)
    const dataSourceRes = {}
    sorted.forEach((_item, index) => {
      if (_item === 'flashSale') {
        dataSourceRes[_item] = result[index]?.data || []
        return
      }
      dataSourceRes[_item] = result[index]?.data?.data || []
    })
    return dataSourceRes
  }

  const node = React.Children.map(children, (_item, index) => {
    if (_item === null) {
      return null
    }
    const cloneNode = React.cloneElement(_item)
    return (
      <TabPane
        tab={_item.props.name}
        key={`id_${_item.props?.id?.toString()}`}
        disabled={_item.props.disabled || false}
      >
        {/* <div {...divProps}>
          { cloneNode }
        </div> */}
        {cloneNode}
      </TabPane>
    )
  })

  const createPostData = (domKey: string) => {
    const pattern = new RegExp(`${domKey}-\\d+`)

    const dataSourceMap = new Map()
    const postData = {}
    const map = new Map()
    Object.keys(pageConfig)
      .filter((_item) => pattern.test(_item))
      .map((_item) => {
        const { props, type } = pageConfig[_item]
        map.set(type, _item)
        dataSourceMap[_item] = props?.data
        if (['flashSale', 'brand'].includes(type)) {
          postData[type] = props?.data
        } else if (['saleRanking', 'suggestProduct'].includes(type)) {
          postData[type] = props?.data?.map((_row) => _row.id)
        }
      })
    return {
      postData,
      dataSourceMap,
      domKeyMap2Type: map,
    }
    // console.log("pageConfig", pageConfig);
  }

  const wrapClass = cs(styles.wrap)

  /**
   * 这里说明一下，当修改tab的时候，请求借口，重新构建pageConfig, 创建 DOMkEY 下面子节点
   * @param activeKey
   */
  const onChange = async (activeKey: string) => {
    const matches = activeKey.match(/id_(.*)\/\.\$(\d+)/)
    if (matches?.[1] === 'undefined' || hasRequestTabKey.includes(activeKey)) {
      createActions({
        type: 'onChangeTabKey',
        payload: { activeKey: matches?.[1] === 'undefined' ? null : matches?.[1], domKey: matches?.[2] },
      })
      setActiveKey(activeKey)
      return
    }

    const { postData, dataSourceMap, domKeyMap2Type } = createPostData(matches![2])
    const resultData: any = await getAnyData(postData)
    const concatActiveKey = hasRequestTabKey.concat(activeKey)
    setHasRequestTabKey(concatActiveKey)
    const finalData = {}
    const keyToValue = {
      suggestProduct: 'label',
      saleRanking: 'sale',
    }
    const componentName = {
      secondary: 'SecondaryNavigation.Item',
      saleRanking: 'SimpleCommodityList.Item',
      flashSale: 'SimpleCommodityList.Item',
      brand: 'CategoryList.Item',
      suggestProduct: 'Product',
    }
    const secondaryData = dataSourceMap[domKeyMap2Type.get('secondary')] || []
    const resultDataWithSecondary = {
      secondary: secondaryData,
      ...resultData,
    }
    const cloneDeepPageConfig = cloneDeep(pageConfig)
    console.log(cloneDeepPageConfig)
    Object.keys(resultDataWithSecondary).forEach((_item) => {
      const parentKey = domKeyMap2Type.get(_item)
      if (!parentKey) {
        return
      }
      if (_item === 'saleRanking' || _item === 'suggestProduct') {
        resultDataWithSecondary[_item]?.forEach((_row, _rowKey) => {
          finalData[`${parentKey}-${_rowKey + 1}`] = {
            componentName: componentName[_item],
            title: _row.name,
            props: {
              ..._row,
              [keyToValue[_item]]: dataSourceMap[parentKey]?.[_rowKey]?.[keyToValue[_item]],
            },
            otherProps: {
              type: `${_item}Item`,
            },
            childNodes: [],
          }
          cloneDeepPageConfig[parentKey].childNodes.push(`${parentKey}-${_rowKey + 1}`)
        })
      } else {
        resultDataWithSecondary[_item]?.forEach((_row, _rowKey) => {
          finalData[`${parentKey}-${_rowKey + 1}`] = {
            componentName: componentName[_item],
            title: _row.name,
            props: _row,
            otherProps: {
              type: `${_item}Item`,
            },
            childNodes: [],
          }
          cloneDeepPageConfig[parentKey].childNodes.push(`${parentKey}-${_rowKey + 1}`)
        })
      }
    })
    const newConfigData = {
      ...cloneDeepPageConfig,
      ...finalData,
    }
    createActions({
      type: 'onChangeTabKey',
      payload: {
        activeKey: matches?.[1] === 'undefined' ? null : matches?.[1],
        domKey: matches?.[2],
        pageConfig: newConfigData,
        hasRequestTabKey: concatActiveKey,
      },
    })
    setActiveKey(activeKey)
  }

  return (
    <div className={wrapClass}>
      <Tabs onChange={onChange} activeKey={activeKey} tabBarStyle={{ background: '#fff', padding: '0 12px' }}>
        {node}
      </Tabs>
    </div>
  )
}

const TabItem = (props) => {
  const { children } = props
  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, getOperateState, className } = props as any
  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
    className,
  }
  return (
    <div {...divProps} style={{ padding: '8px' }}>
      {/* <SecondaryNavigation></SecondaryNavigation> */}
      {children}
    </div>
  )
}

CustomizeTabs.TabItem = TabItem

export default CustomizeTabs
