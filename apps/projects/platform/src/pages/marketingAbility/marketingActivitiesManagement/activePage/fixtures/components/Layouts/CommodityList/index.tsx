import React, { useState } from 'react'
import cx from 'classnames'
import { Commodity } from '@apps/design-ui'
import { Tabs } from 'antd'
import { LeftOutlined, PlusOutlined, RightOutlined, TagOutlined } from '@ant-design/icons'
import { omit } from 'lodash'
import Tabbar from './tabbar'
import TabFooter from './tabFooter'
import MealHeader from './mealHeader'
import styles from './index.less'
import SwapCoupon from './swapCoupon'
import SwapProduct from './swapProduct'
import { priceFormat } from '@/utils/numberFomat'
import { getIntl } from '@linkseeks/i18n'
import type { GetMarketingAdornActivityGoodsAdornResponse } from '@apps/apis'
import Price from '../../Price'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
const { TabPane } = Tabs
interface Iprops extends GetMarketingAdornActivityGoodsAdornResponse {
  className: string
  children: React.ReactNode
  title: string
  theme: 0 | 1 | 2
  visible: boolean
}

const CommodityList: React.FC<Iprops> & {
  Item: typeof CommodityItem
  CommodityTab: typeof CommodityTab
  WebCommodityTab: typeof WebCommodityTab
  SwapCoupon: typeof SwapCoupon
  SwapProduct: typeof SwapProduct
} = (props: Iprops) => {
  const { children, className, title, theme, visible = true, ...other } = props
  const classNameStr = cx(styles.recommand, className, { [styles.hide]: !visible })

  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver } = other as any

  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }
  const render2Columns = () => {
    return (
      <div className={styles.twoColumns}>
        {React.Children.map(children, (_child: any) => {
          if (_child === null) {
            return null
          }
          return React.cloneElement(_child, {
            ...(_child?.props || {}),
            customizeClassName: styles.commodityItem,
            mode: 'vertical',
          })
        })}
      </div>
    )
  }

  const renderGroup = () => {
    return (
      <div>
        {React.Children.map(children, (_child: any) => {
          if (_child === null) {
            return null
          }
          return React.cloneElement(_child, { ..._child.props })
        })}
      </div>
    )
  }

  const renderComponent = () => {
    if (theme === 1) {
      return render2Columns()
    }
    if (theme === 2) {
      return renderGroup()
    }
    return children
  }

  return (
    <div className={classNameStr} {...divProps}>
      <span className={styles.title}>{title}</span>
      <div className={styles.container}>{renderComponent()}</div>
    </div>
  )
}

interface Iprops {
  className: string
  customizeClassName: string
}

const CommodityItem: React.FC<Iprops> = (props: Iprops) => {
  // const intl = useIntl();
  const { className, customizeClassName, ...other } = props
  const classNameStr = cx(styles.item, customizeClassName)
  const rest = omit(other, [
    'draggable',
    'getOperateState',
    'onClick',
    'onDrag',
    'onDragEnd',
    'onDragEnter',
    'onDragStart',
    'onMouseOver',
  ])

  const { onClick, onMouseOver } = other as any

  const divProps = {
    onClick,
    onMouseOver,
  }

  const {
    productName: name,
    productImgUrl: image,
    mode = 'horizontal',
    price: originalPrice,
    /** 折扣（如85折，输入85，9折输入90） */
    discount,
    // 活动价格团购价格秒杀价格单位定金砍价底价
    activityPrice,
    activityList,
    activityId,
    /** 直降价格起始价格 */
    plummetPrice,
    /** 定金抵扣单价 */
    deductionPrice,
    ...otherRestProps
  } = rest as any
  const activityLabel = activityList?.find((_item) => _item.id === activityId)
  const tags = {
    tags: otherRestProps?.label || [],
  }
  const withLabel = activityLabel && activityLabel.label ? { tags: [activityLabel.label, ...tags.tags] } : tags
  const horizontalData = {
    name,
    image,
    mode,
    buyBtnText: intl.formatMessage({ id: 'activityPage.buyNow' }),
    ...withLabel,
    originalPrice: originalPrice,
    discountPrice: activityPrice || plummetPrice || deductionPrice || originalPrice,
  }

  const verticalData = {
    name,
    image,
    mode,
    originalPrice: 0,
    discountPrice: activityPrice || plummetPrice || deductionPrice || originalPrice,
    buyBtn: false,
    ...withLabel,
    sold: 0,
  }

  const commodityProps = mode === 'horizontal' ? horizontalData : verticalData

  const renderFooter = () => {
    return (
      <div className={styles.footer}>
        <Price originalPrice={commodityProps?.originalPrice} discountPrice={commodityProps?.discountPrice} />
        <div className={styles.btn}>
          <div>{intl.formatMessage({ id: 'activityPage.buyNow' })}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={classNameStr}>
      <div {...divProps} className={className}>
        <Commodity footer={renderFooter()} {...commodityProps} />
      </div>
    </div>
  )
}

CommodityList.Item = CommodityItem

/** 套装商品 */
const CommodityTab: React.FC<any> = (props) => {
  // const intl = useIntl();
  const { isEmpty, productName, productImgUrl, price, goodsSubsidiaryGroupList } = props
  const [activeKey, setActiveKey] = useState<string>('1')

  const renderEmpty = () => {
    return (
      <div className={styles.commodityGroupEmpty}>
        <div>
          <PlusOutlined style={{ color: '#C8CACD' }} />
        </div>
      </div>
    )
  }

  const handleTabChange = (key: string) => {
    setActiveKey(key)
  }

  const renderContent = () => {
    return (
      <>
        <div className={styles.mainCommodity}>
          <Commodity
            name={productName}
            image={productImgUrl}
            mode="horizontal"
            discountPrice={price}
            tags={[
              {
                type: 'purple',
                icon: <TagOutlined />,
                name: intl.formatMessage({ id: 'activityPage.fill300remove20' }),
              },
            ]}
            buyBtn={false}
          />
        </div>
        <div className={styles.tab}>
          <Tabs
            activeKey={activeKey}
            renderTabBar={(tabProps) => <Tabbar tabProps={tabProps} onChange={handleTabChange} />}
          >
            {goodsSubsidiaryGroupList?.map((_item, _index) => {
              const { groupPrice, goodsSubsidiaryGroupDetailsList } = _item
              const allTotal = goodsSubsidiaryGroupDetailsList.reduce((sum, _current) => {
                let tempSum = sum
                return (tempSum += _current.price)
              }, 0)

              return (
                <TabPane
                  key={_item.groupNo.toString()}
                  tab={`${intl.formatMessage({ id: 'activityPage.allClothes' })}${_index + 1}`}
                >
                  <div className={styles.groupPane}>
                    {goodsSubsidiaryGroupDetailsList?.map((_row, _key) => {
                      return (
                        <div className={styles.groupCommodityItem} key={_key}>
                          <Commodity
                            name={_row.productName}
                            image={_row.productImgUrl}
                            mode="vertical"
                            footer={<div />}
                            tags={[intl.formatMessage({ id: 'activityPage.fill300remove20' })]}
                            style={{ padding: '0' }}
                          />
                        </div>
                      )
                    })}
                  </div>
                  <TabFooter discountPrice={Number(priceFormat(groupPrice))} originalPrice={allTotal + price} />
                </TabPane>
              )
            })}
          </Tabs>
        </div>
      </>
    )
  }

  return <div className={styles.commodityGroupContainer}>{isEmpty ? renderEmpty() : renderContent()}</div>
}

const CommodityGroup = (props) => {
  const { className, ...other } = props
  const restProps = omit(other, [
    'getOperateState',
    'onClick',
    'onDrag',
    'onDragEnd',
    'onDragEnter',
    'onDragStart',
    'onMouseOver',
    'draggable',
  ])
  const isEmpty = typeof restProps.productName === 'undefined'

  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver } = other as any

  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }
  return (
    <div className={className} {...divProps}>
      <CommodityTab {...restProps} isEmpty={isEmpty} />
    </div>
  )
}

/** 套装商品 */
const WebCommodityTab: React.FC<any> = (props) => {
  const { isEmpty, productName, productImgUrl, price, goodsSubsidiaryGroupList, mainColor } = props
  const [activeKey, setActiveKey] = useState<string>('1')
  const [offSetLeft, setOffSetLeft] = useState<number>(0)
  const ITEM_WIDTH = 120 + 16
  const renderEmpty = () => {
    return (
      <div className={cx(styles.commodityGroupEmpty, styles.web)}>
        <div>
          <PlusOutlined style={{ color: '#C8CACD' }} />
        </div>
      </div>
    )
  }

  const handleTabChange = (key: string) => {
    setActiveKey(key)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (offSetLeft < 0) {
      setOffSetLeft(offSetLeft + ITEM_WIDTH)
    }
  }

  const handleNext = (e: React.MouseEvent, count: number) => {
    e.stopPropagation()

    const maxDistance = (count - 4) * ITEM_WIDTH
    console.log(maxDistance, count, 'count')
    if (maxDistance > Math.abs(offSetLeft)) {
      console.log(offSetLeft - ITEM_WIDTH, 'offSetLeft')
      setOffSetLeft(offSetLeft - ITEM_WIDTH)
    }
  }

  const renderContent = () => {
    return (
      <>
        <div className={styles.mainCommodity}>
          <MealHeader
            title={intl.formatMessage({ id: 'activity.meal.title', defaultMessage: '组合套餐' })}
            subContent={intl.formatMessage({
              id: 'activity.meal.subContent',
              defaultMessage: '共{{count}}组套餐',
              count: goodsSubsidiaryGroupList.length,
            })}
            mainColor={mainColor}
          />
        </div>
        <div className={styles.tab}>
          <Tabs
            activeKey={activeKey}
            renderTabBar={(tabProps) => <Tabbar isMeal tabProps={tabProps} onChange={handleTabChange} />}
          >
            {goodsSubsidiaryGroupList?.map((_item, _index) => {
              const { groupPrice, goodsSubsidiaryGroupDetailsList } = _item
              return (
                <TabPane
                  key={_item.groupNo.toString()}
                  tab={intl.formatMessage({
                    id: 'activity.meal.tabItem',
                    defaultMessage: '套餐{{index}}',
                    index: _index + 1,
                  })}
                >
                  <div>
                    <div className={styles.meal_price_wrap}>
                      <span>
                        {intl.formatMessage({
                          id: 'activity.meal.allCount',
                          defaultMessage: '共{{count}}件商品',
                          count: goodsSubsidiaryGroupDetailsList.length + 1,
                        })}
                      </span>
                      <div className={styles.price_space}>
                        <span>
                          {intl.formatMessage({
                            id: 'activity.meal.price',
                            defaultMessage: '套餐价',
                          })}
                        </span>
                        <span className={styles.meal_price}>¥{groupPrice?.toFixed(2)}</span>
                      </div>
                    </div>
                    <Commodity
                      name={productName}
                      image={productImgUrl}
                      mode="horizontal"
                      discountPrice={price}
                      tags={[]}
                      buyBtn={false}
                      style={{ padding: '8px 0' }}
                    />
                    <div className={styles.mealGroupPaneWray}>
                      <div className={cx(styles.arrowButton, styles.prev)} onClick={(e) => handlePrev(e)}>
                        <LeftOutlined />
                      </div>
                      <div className={cx(styles.groupPane, styles.meal)} style={{ left: offSetLeft }}>
                        {goodsSubsidiaryGroupDetailsList?.map((_row) => {
                          return (
                            <div className={cx(styles.groupCommodityItem, styles.meal)} key={_row.productId}>
                              <Commodity
                                name={_row.productName}
                                image={_row.productImgUrl}
                                mode="vertical"
                                footer={
                                  <div className={styles.productBottom}>
                                    <div className={styles.productImgPrice}>
                                      {translate('web.common.currencySymbol')}
                                      {_row.price}
                                    </div>
                                    <div className={styles.productNum}>
                                      {translate('web.common.currencySymbol')}
                                      {_row.num}
                                    </div>
                                  </div>
                                }
                                style={{ padding: '0' }}
                              />
                            </div>
                          )
                        })}
                      </div>
                      <div
                        className={cx(styles.arrowButton, styles.next)}
                        onClick={(e) => handleNext(e, goodsSubsidiaryGroupDetailsList.length)}
                      >
                        <RightOutlined />
                      </div>
                    </div>
                  </div>
                </TabPane>
              )
            })}
          </Tabs>
        </div>
      </>
    )
  }

  return (
    <div className={cx(styles.commodityGroupContainer, styles.web)}>{isEmpty ? renderEmpty() : renderContent()}</div>
  )
}

const WebCommodityGroup = (props) => {
  const { className, ...other } = props
  const restProps = omit(other, [
    'getOperateState',
    'onClick',
    'onDrag',
    'onDragEnd',
    'onDragEnter',
    'onDragStart',
    'onMouseOver',
    'draggable',
  ])
  const isEmpty = typeof restProps?.productName === 'undefined'

  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver } = other as any

  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }
  return (
    <div className={cx(styles.commodity_group, className)} {...divProps}>
      <WebCommodityTab {...restProps} isEmpty={isEmpty} />
    </div>
  )
}

CommodityList.CommodityTab = CommodityGroup
CommodityList.WebCommodityTab = WebCommodityGroup

CommodityList.SwapCoupon = SwapCoupon
CommodityList.SwapProduct = SwapProduct
// CommodityList.

export default CommodityList
