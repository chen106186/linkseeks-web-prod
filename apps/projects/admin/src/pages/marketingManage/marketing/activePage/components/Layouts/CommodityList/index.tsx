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
// import CombineSale from './combineSale';
import FlashSale from './flashSale'

const { TabPane } = Tabs
interface Iprops {
  className: string
  children: React.ReactNode
  title: string
  theme: 0 | 1 | 2
  /** 控制显示隐藏 */
  visible: boolean
}

const CommodityList: React.FC<Iprops> & {
  Item: typeof CommodityItem
  CommodityTab: typeof CommodityTab
  WebCommodityTab: typeof CommodityTab
  SwapCoupon: typeof SwapCoupon
  SwapProduct: typeof SwapProduct
  // CombineSale: typeof CombineSale,
  FlashSale: typeof FlashSale
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
      <div className={styles.groupWrap}>
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

  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver } = other as any

  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }

  const {
    productName: name,
    productImgUrl: image,
    mode = 'horizontal',
    price: originalPrice,
    discount,
    activityPrice,
    activityList,
    activityId,
    plummetPrice,
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
    originalPrice: originalPrice,
    discountPrice: discount || activityPrice,
    ...withLabel,
  }

  const verticalData = {
    name,
    image,
    mode,
    discountPrice: discount || activityPrice,
    buyBtn: false,
    sold: 0,
    ...withLabel,
  }

  const commodityProps = mode === 'horizontal' ? horizontalData : verticalData

  return (
    <div className={classNameStr}>
      <div {...divProps} className={className} style={{ height: '100%' }}>
        <Commodity {...commodityProps} />
      </div>
    </div>
  )
}

CommodityList.Item = CommodityItem

/** 套装商品 */
const CommodityTab: React.FC<any> = (props) => {
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
                name: '满300减20',
              },
            ]}
            buyBtn={false}
            // originalPrice={300}
          />
        </div>
        <div className={styles.tab}>
          <Tabs
            activeKey={activeKey}
            renderTabBar={(tabProps) => <Tabbar tabProps={tabProps} onChange={handleTabChange} />}
          >
            {goodsSubsidiaryGroupList?.map((_item, _index) => {
              const { groupPrice, goodsSubsidiaryGroupDetailsList } = _item
              const discountPrice = groupPrice?.toString().split('.')
              const allTotal = goodsSubsidiaryGroupDetailsList.reduce((sum: number, _current) => {
                let tempSum = sum
                return (tempSum += _current.price)
              }, 0)
              return (
                <TabPane key={_item.groupNo.toString()} tab={`套装${_index + 1}`}>
                  <div className={styles.groupPane}>
                    {goodsSubsidiaryGroupDetailsList?.map((_row) => {
                      return (
                        <div className={styles.groupCommodityItem} key={_row.productId}>
                          <Commodity
                            name={_row.productName}
                            image={_row.productImgUrl}
                            mode="vertical"
                            footer={<div />}
                            tags={['满300减20']}
                            style={{ padding: '0' }}
                          />
                        </div>
                      )
                    })}
                  </div>
                  <TabFooter discountPrice={discountPrice} originalPrice={allTotal + price} />
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
            title="组合套餐"
            subContent={`共${goodsSubsidiaryGroupList.length}组套餐`}
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
                <TabPane key={_item.groupNo.toString()} tab={`套餐${_index + 1}`}>
                  <div>
                    <div className={styles.meal_price_wrap}>
                      <span>共{goodsSubsidiaryGroupDetailsList.length + 1}件商品</span>
                      <div className={styles.price_space}>
                        <span>套餐价</span>
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
                                    <div className={styles.productImgPrice}>¥ {_row.price}</div>
                                    <div className={styles.productNum}>¥ {_row.num}</div>
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
// CommodityList.CombineSale = CombineSale;
CommodityList.FlashSale = FlashSale

export default CommodityList
