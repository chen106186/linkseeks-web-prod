import React from 'react'
import cx from 'classnames'
import { Skeleton } from 'antd'
import { COMMODITY_SHOW_TYPE, COMMODITY_TYPE } from '@/constants'
import { LAYOUT_TYPE } from '@/types/global'
import { LinkTo } from '@/utils'
import { numFormat, priceFormat } from '@apps/utils/src/format'
import IconFont from '@/utils/iconfont'
import { getWebIntl } from '@/utils/locales'
import ShopCredit from '../ShopCredit'
import { CommodityItemType } from './types'
import TagList from '../TagList'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'

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
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  const _returnCommodityAttributeList = (data: any[], limit: number = 5) => {
    let _list: any[] = []
    for (let i = 0; i < limit; i++) {
      if (!data[i]) break
      _list.push(data[i])
    }
    return _list
  }

  const renderPrice = () => {
    const isFullMoneyReduce =
      Array.isArray(data.tagList) && data.tagList.some((tag: string) => tag && tag.includes('满额减'))

    switch (data.priceType) {
      // 现货价格
      case 1:
        let minPrice = data.min
        // 满额减：列表页不直接展示减后的活动价，保持和详情页一致用原价区间
        if (!isFullMoneyReduce && data.preferentialPrice && data.preferentialPrice < data.max) {
          minPrice = data.preferentialPrice
        }
        if (data.activityTypeList && Array.isArray(data.activityTypeList) && data.activityTypeList.includes(7)) {
          minPrice = data.min
        }

        const minPriceFormatted = priceFormat(minPrice)
        const [minInteger, minDecimal] = minPriceFormatted.split('.')
        const maxPriceFormatted = priceFormat(data.max)
        const [maxInteger, maxDecimal] = maxPriceFormatted.split('.')

        return (
          <div className={styles['goods_price']}>
            <span className={styles['currency']}>{translate('web.common.currencySymbol')}</span>
            <label className={styles['big']}>{minInteger}</label>
            <span className={styles['small']}>.{(minDecimal || '00').substring(0, 2)}</span>
          </div>
        )
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

  const handleLinkClick = (e: any, link: string) => {
    if (jumpType === 'history') {
      e.preventDefault()
      LinkTo(link)
    }
  }

  const renderComponent = () => {
    const link = linkPrefix(
      `${isStore ? `${storePath}/${data.storeId}` : ''}${data.groupPurchase ? '/group/detail' : path}${
        paramType === 'match' ? `/${data.id}` : `?id=${data.id}`
      }`,
    )
    if (isMro) {
      return (
        <div className={cx(styles['commodity_list_item'], styles['column'])}>
          <div className={styles['goods_img']}>
            {data.mainPic ? (
              <img src={data.mainPic} alt={data.name} />
            ) : (
              <Skeleton.Image style={{ width: 120, height: 120 }} />
            )}
            {data.minOrder === 0 || (data.stockCount === 0 && <div className={styles['mask-box']}>补货中</div>)}
          </div>

          <div className={styles['shop_info_mro']}>
            <div>
              <a
                className={cx(styles['info_title'], data.tagList && data.tagList.length > 0 && styles['one-line'])}
                href={link}
                onClick={(e) => handleLinkClick(e, link)}
                target={target}
                rel="noreferrer"
              >
                <div dangerouslySetInnerHTML={{ __html: data.name }} />
              </a>
            </div>
            {data.tagList && data.tagList.length > 0 && (
              <div className="info_row">
                {data.priceType === COMMODITY_TYPE.prompt && data.tagList && data.tagList.length > 0 && (
                  <TagList tagList={data.tagList} style={{ marginBottom: 8 }} />
                )}
              </div>
            )}
            <div className={styles['info_row']}>
              <span className={styles['info_row_label']}>{translate('web.resource.mall.chengjiao')}：</span>
              <span className={styles['info_row_text']}>{numFormat(data.sold) || 0}</span>
            </div>
            {data?.brand?.name && (
              <div className={styles['info_row']}>
                <span className={styles['info_row_label']}>{translate('web.resource.mall.brand')}：</span>
                <span className={styles['info_row_text']}>{data?.brand?.name}</span>
              </div>
            )}
            <div className={styles['info_row']}>
              <span className={styles['info_row_label']}>{translate('web.resource.mall.shangjia')}：</span>
              <span className={styles['info_row_text']}>{data.storeName || data.memberName}</span>
            </div>
          </div>
          <div className={styles['shop_info_mro']}>
            {data.commodityAttributeList &&
              data.commodityAttributeList.length > 0 &&
              _returnCommodityAttributeList(data.commodityAttributeList).map((item: any) => (
                <div className={styles['info_row']} key={item.id}>
                  {item.customerAttribute.name}：
                  {item.customerAttributeValueList.map((child: any) => child.value).join(' / ')}
                </div>
              ))}
          </div>
          <div className={styles['price_info_mro']}>
            {data.priceType === 1 ? (
              <div className={styles['price_info_wrap']}>
                <span className={styles['price_unit']}>{translate('web.common.currencySymbol')}</span>
                <span className={styles['price']}>{priceFormat(data.min)}</span>
                <span>/{data.unitName}</span>
              </div>
            ) : (
              <div className={styles['inquiry_price']}>
                <label>{translate('web.resource.mall.zaixianxunjia')}</label>
              </div>
            )}
          </div>
          <div className={styles['commodity_detail_btn']}>
            <a href={link} onClick={(e) => handleLinkClick(e, link)} target={target} rel="noreferrer">
              {translate('web.resource.mall.chakanxiangqing')}
            </a>
          </div>
        </div>
      )
    }
    switch (type) {
      case COMMODITY_SHOW_TYPE.gird:
        return (
          <div className={cx(styles['commodity_list_item'], styles['row'])}>
            <a href={link} onClick={(e) => handleLinkClick(e, link)} target={target} rel="noreferrer">
              <div className={styles['goods_img']}>
                {data.mainPic ? (
                  <img src={data.mainPic} alt={data.name} />
                ) : (
                  <Skeleton.Image style={{ width: 220, height: 220 }} />
                )}
                {data.minOrder === 0 || (data.stockCount === 0 && <div className={styles['mask-box']}>补货中</div>)}
              </div>
              <div className={styles['info_box']}>
                {renderPrice()}
                <div className={styles['goods_name']} dangerouslySetInnerHTML={{ __html: data.name }} />
                {data.priceType === 3 ? (
                  <div className={styles['count']}>
                    {translate('web.resource.mall.kucun')}：{numFormat(data.stockCount)}
                    {data.unitName}
                  </div>
                ) : (
                  <div className={styles['count']}>
                    {numFormat(data.sold) || 0} {translate('web.resource.mall.chengjiao')}
                  </div>
                )}
                {data.priceType === COMMODITY_TYPE.prompt && data.tagList && data.tagList.length > 0 && (
                  <TagList tagList={data.tagList ? data.tagList : []} style={{ marginBottom: 8 }} />
                )}
                {layoutType === LAYOUT_TYPE.joint && (
                  <div className={styles['company_info']}>
                    <IconFont type="icon-store" className={styles['credit_icon']} />
                    <div className={styles['shop_name']}>{data.storeName || data.memberName}</div>
                    {/* <IconFont type="icon-im_logo" className={styles['im_logo']} /> */}
                  </div>
                )}
              </div>
            </a>
          </div>
        )
      case COMMODITY_SHOW_TYPE.list:
        return (
          <div className={cx(styles['commodity_list_item'], styles['column'])}>
            <div className={styles['goods_img']}>
              {data.mainPic ? (
                <img src={data.mainPic} alt={data.name} />
              ) : (
                <Skeleton.Image style={{ width: 120, height: 120 }} />
              )}
            </div>
            {data.minOrder === 0 || (data.stockCount === 0 && <div className={styles['mask-box']}>补货中</div>)}

            <div className={styles['info_box']}>
              <div className={styles['commodity_info']}>
                <div className={styles['commodity_info_name']}>
                  <a href={link} onClick={(e) => handleLinkClick(e, link)} target={target} rel="noreferrer">
                    <div dangerouslySetInnerHTML={{ __html: data.name }} />
                  </a>
                </div>
                <div className={styles['commodity_info_slogan']}>{data.slogan}</div>
                <div className={styles['commodity_info_sellingPoint']}>
                  {data.sellingPoint &&
                    data.sellingPoint.map((sellItem) => (
                      <div className={styles['commodity_info_sellingPoint_item']} key={sellItem}>
                        {sellItem}
                      </div>
                    ))}
                </div>
              </div>
              <TagList tagList={data.tagList ? data.tagList : []} style={{ marginTop: 8 }} />
              <div className={styles['price_info']}>
                {data.priceType === 1 ? (
                  <>
                    <div className={styles['price_info_wrap']}>
                      <span className={styles['price_unit']}>{translate('web.common.currencySymbol')}</span>
                      <span>{priceFormat(data.preferentialPrice || data.min)}</span>
                      <span className={styles['price_info_unit']}>/{data.unitName}</span>
                    </div>
                    <div className={styles['count']}>
                      {numFormat(data.sold) || 0}
                      {translate('web.resource.mall.yichengjiao')}
                    </div>
                  </>
                ) : (
                  <div className={styles['inquiry_price']}>
                    <label>{translate('web.resource.mall.zaixianxunjia')}</label>
                  </div>
                )}
              </div>
            </div>
            <div className={styles['shop_info']}>
              {isStore && (
                <div className={styles['company_info']}>
                  <IconFont type="icon-store" className={styles['credit_icon']} />
                  <div className={styles['shop_name']}>{data.storeName || data.memberName}</div>
                </div>
              )}
              {layoutType !== LAYOUT_TYPE.own && (
                <div className={styles['credit']}>
                  <ShopCredit creditPoint={data.creditScore || 0} />
                </div>
              )}
            </div>
            <div className={styles['commodity_detail_btn']}>
              <a href={link} onClick={(e) => handleLinkClick(e, link)} target={target} rel="noreferrer">
                {translate('web.resource.mall.chakanxiangqing')}
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
