import React from 'react'
import cx from 'classnames'
import { Button, Skeleton } from 'antd'
import { COMMODITY_SHOW_TYPE } from '@/constants'
import { LAYOUT_TYPE } from '@/types/global'
import { LinkTo } from '@/utils'
import { priceFormat, numFormat } from '@apps/utils/src/format'
import { getWebIntl } from '@/utils/locales'
import IconFont from '@/utils/iconfont'
import { CouponCommodityItemType } from './types'
import TagList from '../TagList'
import styles from './makeup.module.less'
import useLink from '@/hooks/useLink'

interface ProductItemProps {
  data: CouponCommodityItemType
  /** 展示类型  */
  type: COMMODITY_SHOW_TYPE
  layoutType: LAYOUT_TYPE
  /** 商品跳转链接 */
  path: string
  paramType?: 'match' | 'search'
  target?: '_self' | '_blank' | '_parent' | '_top'
  isStore?: boolean
  storePath?: string
  jumpType?: 'location' | 'history'
  onItemClick?: (commodityInfo: CouponCommodityItemType) => void
  hideTagList?: boolean
  /** 禁用的skuid列表 */
  disabledSkuIds?: number[]
}

const ProductMakeUpItem: React.FC<ProductItemProps> = (props) => {
  const {
    data,
    type,
    path,
    paramType,
    jumpType,
    target,
    isStore,
    storePath,
    disabledSkuIds,
    hideTagList = false,
    onItemClick,
  } = props
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  const handleAddPurchase = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (onItemClick) {
      onItemClick(data)
    }
  }

  const handleLinkClick = (e: any, link: string) => {
    e.preventDefault()
    if (data.productId) {
      LinkTo(link, jumpType !== 'history' ? 'open' : 'href')
    }
  }

  const judgeDisabled = (skuId: number) => {
    if (disabledSkuIds && disabledSkuIds.length > 0) {
      return disabledSkuIds.includes(Number(skuId))
    }
    return false
  }

  const getLink = () => {
    let link = `${isStore ? `${storePath}/${data.storeId}` : ''}${path}`
    if (paramType === 'match') {
      link += `/${data.productId}`
      if (data.skuId) {
        link += `?skuid=${data.skuId}`
      }
    } else {
      link += `?id=${data.productId}`
      if (data.skuId) {
        link += `&skuid=${data.skuId}`
      }
    }
    return linkPrefix(link)
  }

  const renderPrice = () => {
    const isFullMoneyReduce =
      Array.isArray(data.tagList) && data.tagList.some((tag: string) => tag && tag.includes('满额减'))

    switch (data.priceType) {
      // 现货价格
      case 1: {
        let minPrice = data.min
        // 满额减：列表页不直接展示减后的活动价，保持和详情页一致用原价区间
        if (!isFullMoneyReduce && data.price && data.price < data.max) {
          minPrice = data.price
        }
        if (data.activityTypeList && Array.isArray(data.activityTypeList) && data.activityTypeList.includes(7)) {
          minPrice = data.min
        }
        const minPriceFormatted = priceFormat(minPrice)
        const [minInteger, minDecimal] = minPriceFormatted.split('.')

        return (
          <div className={styles['goods_price']}>
            <span className={styles['currency']}>{translate('web.common.currencySymbol')}</span>
            <label className={styles['big']}>{minInteger}</label>
            <span className={styles['small']}>.{(minDecimal || '00').substring(0, 2)}</span>
          </div>
        )
      }
      // 价格需要询价
      case 2:
        return (
          <div className={styles['inquiry_price']}>
            <label>{translate('web.resource.mall.zaixianxunjia')}</label>
          </div>
        )
      // 积分兑换商品
      case 3:
        return (
          <div className={cx(styles['goods_price'], styles['integral'])}>
            <label>{numFormat(data.min)}</label>
            {data.min !== data.max && (
              <>
                <i>-</i>
                <label>{numFormat(data.max)}</label>
              </>
            )}
          </div>
        )
      default:
        break
    }
  }

  const renderComponent = () => {
    const link = getLink()
    switch (type) {
      case COMMODITY_SHOW_TYPE.gird:
        return (
          <div
            className={cx(
              styles['commodity_list_makeup_item'],
              styles['row'],
              onItemClick && styles['hover'],
              hideTagList && styles['hideTagList'],
            )}
          >
            <a href={link} onClick={(e) => handleLinkClick(e, link)} target={target} rel="noreferrer">
              <div className={styles['goods_img']}>
                {data.mainPic ? (
                  <img src={data.mainPic} alt={data.productName} />
                ) : (
                  <Skeleton.Image style={{ width: 227, height: 227 }} />
                )}
              </div>
              <div className={styles['info_box']}>
                <div className={styles['goods_name']} dangerouslySetInnerHTML={{ __html: data.productName }} />
                <div className={styles['goods_price_wrap']}>{renderPrice()}</div>
                {!hideTagList && <TagList tagList={data.tagList ? data.tagList : []} />}
              </div>
              <div className={styles['makeup_item_hover_box']}>
                <div className={styles['makeup_item_hover_body']}>
                  <div className={styles['makeup_item_btn_box']}>
                    <Button
                      disabled={judgeDisabled(data.skuId)}
                      block
                      onClick={handleAddPurchase}
                      icon={<IconFont type="icon-add_cart" style={{ fontSize: 16 }} />}
                      type="primary"
                      className={styles['makeup_item_btn']}
                    >
                      {translate('web.resource.mall.jiarujinhuodan')}
                    </Button>
                  </div>
                </div>
              </div>
            </a>
          </div>
        )
      case COMMODITY_SHOW_TYPE.list:
        return (
          <div className={cx(styles['commodity_list_makeup_item'], styles['column'])}>
            <div className={styles['goods_img']}>
              {data.mainPic ? (
                <img src={data.mainPic} alt={data.productName} />
              ) : (
                <Skeleton.Image style={{ width: 80, height: 80 }} />
              )}
            </div>
            <div className={styles['commodity_info_name']}>
              <a onClick={(e) => handleLinkClick(e, link)} href={link} target={target} rel="noreferrer">
                <div className={styles['goods_name']} dangerouslySetInnerHTML={{ __html: data.productName }} />
              </a>
              {!hideTagList && <TagList tagList={data.tagList ? data.tagList : []} />}
            </div>
            <div className={styles['goods_price_wrap']}>{renderPrice()}</div>
            <div className={styles['makeup_item_column_btn_wrap']}>
              <Button
                disabled={judgeDisabled(data.skuId)}
                onClick={handleAddPurchase}
                icon={<IconFont type="icon-add_cart" style={{ fontSize: 16 }} />}
                type="primary"
                className={styles['makeup_item_btn']}
              >
                {translate('web.resource.mall.jiarujinhuodan')}
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return renderComponent()
}

ProductMakeUpItem.defaultProps = {
  type: COMMODITY_SHOW_TYPE.gird,
  path: '',
  isStore: true,
  storePath: '/shop',
  paramType: 'match',
  target: '_blank',
  jumpType: 'location',
}

export default ProductMakeUpItem
