import React, { useState } from 'react'
import cx from 'classnames'
import { Tabs } from 'antd'
import { getWebIntl } from '@/utils/locales'
import omit from 'lodash/omit'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import MealHeader from './mealHeader'
import Tabbar from './tabbar'
import type { CommodityData } from '.'
import styles from './mealCommodity.module.less'

interface MealCommodityProps extends CommodityData {
  onClick?: (data: CommodityData) => void
}

const { TabPane } = Tabs

const MealCommodity: React.FC<MealCommodityProps> = (props) => {
  const { productName, productImgUrl, unit, hasSold, price, memberId, roleId, goodsSubsidiaryGroupList, onClick } =
    props
  const [activeKey, setActiveKey] = useState<string>('1')
  const [offSetLeft, setOffSetLeft] = useState<number>(0)
  const ITEM_WIDTH = 120 + 16
  const translate = getWebIntl()

  const handleClick = () => {
    const commodityData = omit(props, 'onClick')
    onClick?.(commodityData)
  }

  const handleItemClick = (data: { memberId: number; roleId: number; productId: number; skuId: number }) => {
    onClick?.(data as CommodityData)
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

  return (
    <div className={cx(styles.meal_comodity)}>
      <div className={styles.mainCommodity}>
        <MealHeader
          title={translate('web.resource.mall.zuhetaocan')}
          subContent={translate('web.resource.mall.gongjizutaocan', { count: goodsSubsidiaryGroupList.length })}
          onClick={handleClick}
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
              <TabPane key={_item.groupNo.toString()} tab={`${translate('web.resource.mall.taocan')}${_index + 1}`}>
                <div>
                  <div className={styles.meal_price_wrap}>
                    <span>
                      {translate('web.resource.mall.gongcountjianshangpin', {
                        count: goodsSubsidiaryGroupDetailsList.length + 1,
                      })}
                    </span>
                    <div className={styles.price_space}>
                      <span>{translate('web.resource.mall.taocanjia')}</span>
                      <span className={styles.meal_price}>¥{groupPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className={styles['hot-commodity']} onClick={handleClick}>
                    <img src={productImgUrl} />
                    <div className={styles['hot-commodity-info']}>
                      <div className={styles['hot-commodity-info-name']}>{productName}</div>
                      <div className={styles['commodity-info-hasSold']}>
                        {translate('web.resource.mall.yiqiang')}
                        {`${hasSold || 0}${unit}`}
                      </div>
                      <div className={styles['hot-commodity-info-price']}>
                        <div className={styles.originalPrice}>
                          <span className={styles.currency}>{translate('web.common.currencySymbol')}</span>
                          <span>{price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.mealGroupPaneWray}>
                    {goodsSubsidiaryGroupDetailsList && goodsSubsidiaryGroupDetailsList.length > 4 && (
                      <div className={cx(styles.arrowButton, styles.prev)} onClick={(e) => handlePrev(e)}>
                        <LeftOutlined />
                      </div>
                    )}
                    <div className={cx(styles.groupPane, styles.meal)} style={{ left: offSetLeft }}>
                      {goodsSubsidiaryGroupDetailsList?.map((_row) => {
                        return (
                          <div
                            className={cx(styles.groupCommodityItem, styles.meal)}
                            key={_row.productId}
                            onClick={() =>
                              handleItemClick({
                                memberId,
                                roleId,
                                productId: _row.productId,
                                skuId: _row.skuId,
                              })
                            }
                          >
                            <div className={styles.commodity}>
                              <img className={styles['commodity-image']} src={_row.productImgUrl} />
                              <div className={styles['commodity-info']}>
                                <div className={styles['commodity-info-name']}>{_row.productName}</div>
                                <div className={styles['commodity-info-price']}>
                                  <div className={styles.originalPrice}>
                                    <span className={styles.currency}>{translate('web.common.currencySymbol')}</span>
                                    <span>{_row.price}</span>
                                  </div>
                                  <span className={styles['commodity-info-num']}>x{_row.num || 1}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {goodsSubsidiaryGroupDetailsList && goodsSubsidiaryGroupDetailsList.length > 4 && (
                      <div
                        className={cx(styles.arrowButton, styles.next)}
                        onClick={(e) => handleNext(e, goodsSubsidiaryGroupDetailsList.length)}
                      >
                        <RightOutlined />
                      </div>
                    )}
                  </div>
                </div>
              </TabPane>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}

export default MealCommodity
