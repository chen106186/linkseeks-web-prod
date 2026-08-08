import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import { Space } from 'antd'
import { getWebIntl } from '@apps/locales'
import CustomizeTag from '../../Mobile/CustomizeTag'
import { RecommentCommodityItemType } from '../../constants/commodity'
import { getPrefixUrl, openLink } from '../../utils'
import { reloadRecommendDataSourceFn } from '../../utils/dataSource'
import styles from './index.module.less'
import { numFormat, priceFormat } from '@apps/utils/src/format'

interface IProps {
  className?: string
  showType?: 'normal' | 'marketing'
  /** 显示标题 */
  showTitle?: boolean
  /** 标题 */
  title: string
  /** 上下边距 */
  verticalMargin?: number
  commodityList: RecommentCommodityItemType[]
  linkdisable?: boolean
  isStore?: boolean
  /** 重新请求数据源 */
  reloadDataSource?: boolean
  reloadParam?: any
}

const VerticalCommodity: React.FC<IProps> = (props) => {
  const {
    title,
    commodityList,
    className,
    showType = 'normal',
    showTitle = true,
    linkdisable = false,
    verticalMargin = 0,
    isStore = false,
    reloadDataSource = false,
    reloadParam,
    ...others
  } = props
  const translate = getWebIntl()
  const [dataSource, setDataSource] = useState<RecommentCommodityItemType[]>(
    commodityList || [],
  )

  useEffect(() => {
    if (!reloadDataSource) {
      setDataSource(commodityList || [])
    }
  }, [commodityList])

  useEffect(() => {
    const reload = () => {
      reloadRecommendDataSourceFn(reloadParam, showType, dataSource).then(
        (result) => {
          console.log(result, 'result1234')
          setDataSource(result)
        },
      )
    }
    if (reloadDataSource) {
      reload()
    }
  }, [])

  const getCommodityDetailLink = (
    commodityInfo: RecommentCommodityItemType,
  ) => {
    const skuLink = commodityInfo.skuId ? `?skuId=${commodityInfo.skuId}` : ''
    if (isStore) {
      return commodityInfo.storeId
        ? `/shop/${commodityInfo.storeId}/${
            commodityInfo.groupPurchase ? 'group' : 'commodity'
          }/detail/${commodityInfo.commodityId}${skuLink}`
        : `/${commodityInfo.groupPurchase ? 'group' : 'commodity'}/detail/${
            commodityInfo.commodityId
          }${skuLink}`
    } else {
      return `${getPrefixUrl()}/${
        commodityInfo.groupPurchase ? 'group' : 'commodity'
      }/detail/${commodityInfo.commodityId}${skuLink}`
    }
  }

  const renderPrice = (commodityItem: RecommentCommodityItemType) => {
    const isFullMoneyReduce =
      Array.isArray(commodityItem.tagList) &&
      commodityItem.tagList.some((tag: string) => tag && tag.includes('满额减'))
    console.log(commodityItem, 'commodityItemcommodityItem', isFullMoneyReduce)
    switch (commodityItem.priceType) {
      // 现货价格
      case 1: {
        let minPrice = commodityItem.min

        // 满额减：列表页不直接展示减后的活动价，保持和详情页一致用原价区间
        if (
          !isFullMoneyReduce &&
          commodityItem.price &&
          commodityItem.max &&
          Number(commodityItem.price) < commodityItem.max
        ) {
          minPrice = Number(commodityItem.price)
          console.log(111111, minPrice)
        }

        if (
          commodityItem.activityTypeList &&
          Array.isArray(commodityItem.activityTypeList) &&
          commodityItem.activityTypeList.includes(7)
        ) {
          minPrice = commodityItem.min
          console.log(2222222, minPrice)
        }

        // 如果价格数据无效，返回 null 避免显示 undefined
        if (minPrice === undefined || minPrice === null) {
          return null
        }

        console.log(minPrice, 'minPrice22222')

        const minPriceStr = priceFormat(minPrice)
        console.log(minPriceStr, 'minPriceStr')
        const [minInteger, minDecimal] = minPriceStr.split('.')

        console.log(minInteger, 'minDecimal')

        return (
          <div className={styles['goods_price_wrap']}>
            <div className={styles['goods_price']}>
              <span className={styles['currency']}>
                {translate('web.common.currencySymbol')}
              </span>
              <label className={styles['big']}>{minInteger}</label>
              <span className={styles['small']}>
                .{(minDecimal || '00').substring(0, 2)}
              </span>
            </div>
          </div>
        )
      }
      // 价格需要询价
      case 2:
        return (
          <div className={styles['goods_price_wrap']}>
            <div className={styles['inquiry_price']}>
              <label>{translate('web.resource.mall.zaixianxunjia')}</label>
            </div>
          </div>
        )
      // 积分兑换商品
      case 3:
        return (
          <div className={styles['goods_price_wrap']}>
            <div className={cx(styles['goods_price'], styles['integral'])}>
              <label>{commodityItem.min}</label>
              {commodityItem.min !== commodityItem.max && (
                <>
                  <i>-</i>
                  <label>{commodityItem.max}</label>
                </>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={cx(styles['commodity-list-wrap'], className)}
      style={{
        marginTop: verticalMargin,
        marginBottom: verticalMargin,
      }}
      {...others}
    >
      {showTitle && (
        <div className={styles['commodity-list-title']}>{title}</div>
      )}
      <div className={styles['commodity-list']}>
        {dataSource &&
          dataSource.map((commodityItem) => (
            <div
              key={commodityItem.id}
              className={styles['commodity-list-item']}
              onClick={() =>
                openLink(
                  getCommodityDetailLink(commodityItem),
                  linkdisable,
                  '_blank',
                )
              }
            >
              <ImageBox width={227} height={227} src={commodityItem.mainPic} />
              {commodityItem.minOrder === 0 ||
                (commodityItem.stockCount === 0 && (
                  <div className={styles['mask-box']}>补货中</div>
                ))}

              <div className={styles['commodity-list-item-main']}>
                <div className={styles['commodity-list-item-name']}>
                  {commodityItem.name}
                </div>
                {commodityItem.tags && commodityItem.tags.length > 0 && (
                  <div className={styles['commodity-list-item-tags']}>
                    <Space size={4}>
                      {commodityItem.tags.map((tag, index) => (
                        <CustomizeTag
                          key={`tag-${index}`}
                          mode={index === 0 ? 'doubleColor' : 'monotone'}
                        >
                          {tag}
                        </CustomizeTag>
                      ))}
                    </Space>
                  </div>
                )}
                {renderPrice(commodityItem)}
                <div className={styles['commodity-list-item-sold']}>
                  <span>
                    {translate('web.resource.mall.yiqiang')}{' '}
                    {commodityItem.sold || 0}
                    {commodityItem.unitName}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default VerticalCommodity
