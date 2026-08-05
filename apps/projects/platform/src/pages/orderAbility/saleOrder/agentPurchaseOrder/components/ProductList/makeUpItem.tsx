import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import { Button, Skeleton } from 'antd'
import { useHistory } from '@linkseeks/router-core'
import IconFont from '@/utils/iconfont'
import { CouponCommodityItemType } from './types'
import { COMMODITY_SHOW_TYPE } from '../../constants'
import { LAYOUT_TYPE } from '@/constants'
import TagList from '../TagList'
import './makeup.less'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
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
}

const ProductMakeUpItem: React.FC<ProductItemProps> = (props) => {
  const { data, type, path, paramType, jumpType, target, isStore, storePath, onItemClick } = props
  const history = useHistory()
  const intl = useIntl()

  const handleAddPurchase = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (onItemClick) {
      onItemClick(data)
    }
  }

  const handleLinkClick = (e: any, link: string) => {
    if (jumpType === 'history') {
      e.preventDefault()
      history.push(link)
    }
  }

  const renderComponent = () => {
    const link = `${isStore ? `${storePath}/${data.memberId}_${data.memberRoleId}` : ''}${path}${
      paramType === 'match' ? `/${data.productId}` : `?id=${data.productId}`
    }`
    switch (type) {
      case COMMODITY_SHOW_TYPE.gird:
        return (
          <div className={cx('commodity_list_makeup_item', 'row')}>
            <a href={link} onClick={(e) => handleLinkClick(e, link)} target={target} rel="noreferrer">
              <div className="goods_img">
                {data.mainPic ? (
                  <img src={data.mainPic} alt={data.productName} />
                ) : (
                  <Skeleton.Image style={{ width: 227, height: 227 }} />
                )}
              </div>
              <div className="info_box">
                <div className="goods_name" dangerouslySetInnerHTML={{ __html: data.productName }} />
                <div className="goods_price_wrap">
                  <div className="goods_activity_price">
                    <i>{translate('web.common.currencySymbol')}</i>
                    <span>{data.price}</span>
                    <label>/{data.unitName}</label>
                  </div>
                </div>
                <TagList tagList={data.tagList ? data.tagList : []} />
              </div>
              <div className="makeup_item_hover_box">
                <div className="makeup_item_hover_body">
                  <div className="makeup_item_btn_box">
                    <Button
                      block
                      onClick={handleAddPurchase}
                      icon={<IconFont type="icon-add_cart" style={{ fontSize: 16 }} />}
                      type="primary"
                      className="makeup_item_btn"
                    >
                      {intl.formatMessage({ id: 'mall.btn.add.cart' })}
                    </Button>
                  </div>
                </div>
              </div>
            </a>
          </div>
        )
      case COMMODITY_SHOW_TYPE.list:
        return (
          <div className={cx('commodity_list_makeup_item', 'column')}>
            <div className="goods_img">
              {data.mainPic ? (
                <img src={data.mainPic} alt={data.productName} />
              ) : (
                <Skeleton.Image style={{ width: 80, height: 80 }} />
              )}
            </div>
            <div className="commodity_info_name">
              <a onClick={(e) => handleLinkClick(e, link)} href={link} target={target} rel="noreferrer">
                <div dangerouslySetInnerHTML={{ __html: data.productName }} />
              </a>
              <TagList tagList={data.tagList ? data.tagList : []} />
            </div>
            <div className="goods_price_wrap">
              <div className="goods_activity_price">
                <i>{translate('web.common.currencySymbol')}</i>
                <span>{data.price}</span>
                <label>/{data.unitName}</label>
              </div>
            </div>
            <div className="makeup_item_column_btn_wrap">
              <Button
                onClick={handleAddPurchase}
                icon={<IconFont type="icon-add_cart" style={{ fontSize: 16 }} />}
                type="primary"
                className="makeup_item_btn"
              >
                {intl.formatMessage({ id: 'mall.btn.add.cart' })}
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
