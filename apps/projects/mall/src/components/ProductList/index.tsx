import React, { useMemo } from 'react'
import cx from 'classnames'
import { COMMODITY_SHOW_TYPE } from '@/constants'
import { LAYOUT_TYPE } from '@/types/global'
import ProductItem from './item'
import ProductMakeUpItem from './makeUpItem'
import { CommodityItemType, CouponCommodityItemType } from './types'
import styles from './index.module.less'

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
  /** 禁用的skuid列表 */
  disabledSkuIds?: number[]
  /** 隐藏标签 */
  hideTagList?: boolean
}

interface IProps {
  Item: typeof ProductItem
  MakeUpItem: typeof ProductMakeUpItem
}

const ProductList: React.FC<ProductListProps> & IProps = (props) => {
  const {
    type,
    dataSource,
    layoutType,
    onItemClick,
    isMro,
    path,
    isStore,
    storePath,
    paramType,
    target,
    jumpType,
    disabledSkuIds,
    hideTagList = false,
  } = props

  const _returnContainerClassName = () => {
    if (isMro) {
      return styles['column']
    } else {
      return type === COMMODITY_SHOW_TYPE.list ? styles['column'] : styles['row']
    }
  }

  return useMemo(
    () => (
      <div
        className={cx(
          styles['commodity_list'],
          _returnContainerClassName(),
          layoutType === LAYOUT_TYPE.activity && styles['makeUpList'],
        )}
      >
        {dataSource &&
          dataSource.length > 0 &&
          dataSource.map((dataItem: any) => {
            if (layoutType === LAYOUT_TYPE.activity) {
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
                  disabledSkuIds={disabledSkuIds}
                  hideTagList={hideTagList}
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
