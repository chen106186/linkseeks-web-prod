import React from 'react'
import { Skeleton } from 'antd'
import { useHistory } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import { COMMODITY_TYPE, LAYOUT_TYPE } from '@/constants'
import { numFormat, priceFormat } from '@/utils/numberFomat'
import IconFont from '@/utils/iconfont'
import { COMMODITY_SHOW_TYPE } from '../../constants'
import TagList from '../TagList'
import ShopCredit from '../ShopCredit'
import { CommodityItemType } from './types'
import './index.less'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
interface ProductItemProps {
  data: CommodityItemType
  /** 展示类型  */
  type: COMMODITY_SHOW_TYPE
  layoutType: LAYOUT_TYPE
  /** 商品跳转链接 */
  path: string
  paramType?: 'match' | 'search'
  target?: '_self' | '_blank' | '_parent' | '_top'
  isStore?: boolean
  storePath?: string
  isMro?: boolean
  jumpType?: 'location' | 'history'
}

const ProductItem: React.FC<ProductItemProps> = (props) => {
  const { data, type, layoutType, path, isStore, target, paramType, storePath, isMro, jumpType } = props
  const history = useHistory()
  const intl = useIntl()

  const _returnCommodityAttributeList = (data: any[], limit: number = 5) => {
    let _list: any[] = []
    for (let i = 0; i < limit; i++) {
      if (!data[i]) break
      _list.push(data[i])
    }
    return _list
  }

  const renderPrice = () => {
    switch (data.priceType) {
      // 现货价格
      case 1:
        return (
          <div className="goods_price">
            <span>{translate('web.common.currencySymbol')}</span>
            <label>{priceFormat(data.min)}</label>
            {data.min !== data.max && (
              <>
                <i>-</i>
                <span>{translate('web.common.currencySymbol')}</span>
                <label>{priceFormat(data.max)}</label>
              </>
            )}
          </div>
        )
      // 价格需要询价
      case 2:
        return (
          <div className="inquiry_price">
            <label>{intl.formatMessage({ id: 'shopList.list.OnlineInquiry' })}</label>
          </div>
        )
      // 积分兑换商品
      case 3:
        break
      default:
        break
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
      paramType === 'match' ? `/${data.id}` : `?id=${data.id}`
    }`
    if (isMro) {
      return (
        <div className={cx('commodity_list_item', 'column')}>
          <div className="goods_img">
            {data.mainPic ? (
              <img src={data.mainPic} alt={data.name} />
            ) : (
              <Skeleton.Image style={{ width: 120, height: 120 }} />
            )}
          </div>
          <div className="shop_info_mro">
            <div className="info_title">
              <a
                className="info_title"
                href={link}
                onClick={(e) => handleLinkClick(e, link)}
                target={target}
                rel="noreferrer"
              >
                <div dangerouslySetInnerHTML={{ __html: data.name }} />
              </a>
            </div>
            <div className="info_row">
              <span className="info_row_label">{intl.formatMessage({ id: 'commodity.list.deal' })}：</span>
              <span className="info_row_text">{numFormat(data.sold) || 0}</span>
            </div>
            {data?.brand?.name && (
              <div className="info_row">
                <span className="info_row_label">{intl.formatMessage({ id: 'enquiryGoods.brand' })}：</span>
                <span className="info_row_text">{data?.brand?.name}</span>
              </div>
            )}
            <div className="info_row">
              <span className="info_row_label">{intl.formatMessage({ id: 'productList.item.shop' })}：</span>
              <span className="info_row_text">{data.memberName}</span>
            </div>
          </div>
          <div className="shop_info_mro">
            {data.commodityAttributeList.length > 0 &&
              _returnCommodityAttributeList(data.commodityAttributeList).map((item: any) => (
                <div className="info_row">
                  {item.customerAttribute.name}：
                  {item.customerAttributeValueList.map((child: any) => child.value).join(' / ')}
                </div>
              ))}
          </div>
          <div className="price_info_mro">
            {data.priceType === 1 ? (
              <div className="price_info_wrap">
                <span className="price_unit">{translate('web.common.currencySymbol')}</span>
                <span className="price">{priceFormat(data.min)}</span>
                <span>/{data.unitName}</span>
              </div>
            ) : (
              <div className="inquiry_price">
                <label>{intl.formatMessage({ id: 'shopList.list.OnlineInquiry' })}</label>
              </div>
            )}
          </div>
          <div className="commodity_detail_btn">
            <a href={link} onClick={(e) => handleLinkClick(e, link)} target={target} rel="noreferrer">
              {intl.formatMessage({ id: 'commodity.list.viewDetails' })}
            </a>
          </div>
        </div>
      )
    }
    switch (type) {
      case COMMODITY_SHOW_TYPE.gird:
        return (
          <div className={cx('commodity_list_item', 'row')}>
            <a href={link} onClick={(e) => handleLinkClick(e, link)} target={target} rel="noreferrer">
              <div className="goods_img">
                {data.mainPic ? (
                  <img src={data.mainPic} alt={data.name} />
                ) : (
                  <Skeleton.Image style={{ width: 220, height: 220 }} />
                )}
              </div>
              <div className="info_box">
                {renderPrice()}
                <div className="goods_name" dangerouslySetInnerHTML={{ __html: data.name }} />
                <div className="count">
                  {numFormat(data.sold) || 0} {intl.formatMessage({ id: 'commodity.list.deal' })}
                </div>
                {data.priceType === COMMODITY_TYPE.prompt && <TagList tagList={data.tagList ? data.tagList : []} />}
                {layoutType === LAYOUT_TYPE.mall && (
                  <div className="company_info">
                    <IconFont type="icon-store" className="credit_icon" />
                    <div className="shop_name">{data.memberName}</div>
                    <IconFont type="icon-im_logo" className="im_logo" />
                  </div>
                )}
              </div>
            </a>
          </div>
        )
      case COMMODITY_SHOW_TYPE.list:
        return (
          <div className={cx('commodity_list_item', 'column')}>
            <div className="goods_img">
              {data.mainPic ? (
                <img src={data.mainPic} alt={data.name} />
              ) : (
                <Skeleton.Image style={{ width: 120, height: 120 }} />
              )}
            </div>
            <div className="info_box">
              <div className="commodity_info">
                <div className="commodity_info_name">
                  <a href={link} onClick={(e) => handleLinkClick(e, link)} target={target} rel="noreferrer">
                    <div dangerouslySetInnerHTML={{ __html: data.name }} />
                  </a>
                </div>
                <div className="commodity_info_slogan">{data.slogan}</div>
                <div className="commodity_info_sellingPoint">
                  {data.sellingPoint &&
                    data.sellingPoint.map((sellItem) => (
                      <div className="commodity_info_sellingPoint_item" key={sellItem}>
                        {sellItem}
                      </div>
                    ))}
                </div>
              </div>
              <TagList tagList={data.tagList ? data.tagList : []} />
              <div className="price_info">
                {data.priceType === 1 ? (
                  <>
                    <div className="price_info_wrap">
                      <span className="price_unit">{translate('web.common.currencySymbol')}</span>
                      <span>{priceFormat(data.min)}</span>
                      <span className="price_info_unit">/{data.unitName}</span>
                    </div>
                    <div className="count">
                      {numFormat(data.sold) || 0}
                      {intl.formatMessage({ id: 'commodity.list.Closed' })}
                    </div>
                  </>
                ) : (
                  <div className="inquiry_price">
                    <label>{intl.formatMessage({ id: 'shopList.list.OnlineInquiry' })}</label>
                  </div>
                )}
              </div>
            </div>
            <div className="shop_info">
              <div className="company_info">
                <IconFont type="icon-store" className="credit_icon" />
                <div className="shop_name">{data.memberName}</div>
              </div>
              <div className="credit">
                <ShopCredit creditPoint={data.creditScore || 0} />
                <IconFont type="icon-im_logo" className="im_logo" />
              </div>
            </div>
            <div className="commodity_detail_btn">
              <a href={link} onClick={(e) => handleLinkClick(e, link)} target={target} rel="noreferrer">
                {intl.formatMessage({ id: 'commodity.list.viewDetails' })}
              </a>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return renderComponent()
}

ProductItem.defaultProps = {
  type: COMMODITY_SHOW_TYPE.gird,
  path: '',
  isStore: true,
  storePath: '/shop',
  paramType: 'match',
  target: '_blank',
  jumpType: 'location',
}

export default ProductItem
