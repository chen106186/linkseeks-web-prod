import React, { useMemo } from 'react'
import cx from 'classnames'
import ProductItem from './item'
import ProductMakeUpItem from './makeUpItem'
import { CommodityItemType, CouponCommodityItemType } from './types'
import './index.less'
import { COMMODITY_SHOW_TYPE } from '../../constants'
import { LAYOUT_TYPE } from '@/constants'

interface ProductListProps {
  dataSource: CommodityItemType[] | CouponCommodityItemType[]
  /** 展示类型  */
  type: COMMODITY_SHOW_TYPE
  layoutType: LAYOUT_TYPE
  onItemClick?: (commodityInfo: CouponCommodityItemType) => void
  isMro?: boolean
  isStore?: boolean
  storePath?: string
  /** 商品跳转链接 */
  path: string
  paramType?: 'match' | 'search'
  target?: '_self' | '_blank' | '_parent' | '_top'
  jumpType?: 'location' | 'history'
}

interface IProps {
  Item: typeof ProductItem
  MakeUpItem: typeof ProductMakeUpItem
}

const ProductList: React.FC<ProductListProps> & IProps = (props) => {
  const { type, dataSource, layoutType, onItemClick, isMro, path, isStore, storePath, paramType, target, jumpType } =
    props

  const _returnContainerClassName = () => {
    if (isMro) {
      return 'column'
    } else {
      return type === COMMODITY_SHOW_TYPE.list ? 'column' : 'row'
    }
  }

  return useMemo(
    () => (
      <div
        className={cx(
          'commodity_list',
          _returnContainerClassName(),
          layoutType === LAYOUT_TYPE.makeUpList && 'makeUpList',
        )}
      >
        {dataSource &&
          dataSource.length > 0 &&
          dataSource.map((dataItem: any) => {
            if (layoutType === LAYOUT_TYPE.makeUpList) {
              return (
                <ProductMakeUpItem
                  key={`product_makeup_item_${dataItem.skuId || dataItem.id}`}
                  type={type}
                  data={dataItem}
                  layoutType={layoutType}
                  path={path}
                  isStore={isStore}
                  storePath={storePath}
                  target={target}
                  paramType={paramType}
                  jumpType={jumpType}
                  onItemClick={onItemClick}
                />
              )
            } else {
              return (
                <ProductItem
                  key={`product_item_${dataItem.id}`}
                  type={type}
                  data={dataItem}
                  layoutType={layoutType}
                  isMro={isMro}
                  path={path}
                  isStore={isStore}
                  storePath={storePath}
                  target={target}
                  paramType={paramType}
                  jumpType={jumpType}
                />
              )
            }
          })}
      </div>
    ),
    [dataSource, type, layoutType],
  )
}

ProductList.Item = ProductItem
ProductList.MakeUpItem = ProductMakeUpItem

ProductList.defaultProps = {
  type: COMMODITY_SHOW_TYPE.gird,
  isMro: false,
  paramType: 'match',
  target: '_blank',
  jumpType: 'location',
}

export default ProductList
