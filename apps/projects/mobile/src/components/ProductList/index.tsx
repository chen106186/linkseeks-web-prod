/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-11 17:20:41
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-22 15:39:57
 * @Description: 商品列表
 */
import React, { useEffect, useState } from 'react'
import { View } from '@apps/mobile-ui'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import classNames from 'classnames'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import ProductListItem, { ProductItem } from './Item'
import SwitchButton, { DEFAULT_TYPE, switchEvents } from './components/SwitchButton'
import './index.scss'

interface ProductListProps {
  /**
   * 数据源
   */
  dataSource: ProductItem[]
  /**
   * 点击商品列表
   */
  onClickItem?: (item: ProductItem) => void
  /**
   * 点击采购商触发
   */
  onClickSupplier?: (item: ProductItem) => void
  /**
   * 类型，可选 default | larger
   */
  type?: 'default' | 'larger'
}

const ProductList: React.FC<ProductListProps> & { Item: typeof ProductListItem; SwitchButton: typeof SwitchButton } = (
  props: ProductListProps,
) => {
  const { dataSource = [], onClickItem, onClickSupplier, type } = props
  const [listType, setListType] = useState<any>(DEFAULT_TYPE)
  const { jmpProductDetail, jmpProductDetailGroup } = useProductDetailJump()
  const {
    userStore: { shopAndSite },
  } = useStores()
  const isLarger = listType === 'larger'

  useEffect(() => {
    if ('type' in props) {
      setListType(type)
    }
  }, [type])

  useEffect(() => {
    switchEvents.on('onSwitchTypeChange', (value) => {
      if (!('type' in props)) {
        setListType(value)
      }
    })

    return () => {
      switchEvents.off('onSwitchTypeChange')
    }
  }, [])

  const handleClickItem = (item: ProductItem) => {
    if (onClickItem) {
      onClickItem(item)
    } else {
      if (item.groupPurchase) {
        jmpProductDetailGroup({ commodityId: item.id })
      } else if (item.activityTypeList?.includes(17)) {
        Router.navigateTo('communityGroupBuy/list', { goodsId: item.id })
      } else {
        if (item.priceType) {
          jmpProductDetail(item.priceType as number, { commodityId: item.id })
        }
      }
    }
  }

  const handleClickSupplier = (item: ProductItem) => {
    if (onClickSupplier) {
      onClickSupplier(item)
    } else {
      // todo: 这里需要判断一下当前商城是否是渠道商城，是渠道商城 id 要取 memberId
      Router.navigateTo('shop/home', { id: item.storeId })
    }
  }

  return (
    <View
      className={classNames('productList', {
        productList__larger: isLarger,
      })}
    >
      {dataSource.map((item) => (
        <ProductListItem
          key={item.id}
          data={item}
          onClickItem={handleClickItem}
          onClickSupplier={handleClickSupplier}
          type={listType}
          showSupplierInfo={!shopAndSite?.isSelf}
        />
      ))}
    </View>
  )
}

ProductList.Item = ProductListItem
ProductList.SwitchButton = SwitchButton

ProductList.defaultProps = {
  onClickItem: undefined,
  onClickSupplier: undefined,
}

export default ProductList
