import React, { useState } from 'react'
import { omit } from 'lodash'
import { Commodity, Progress } from '@apps/design-ui'
import { PlusOutlined, TagOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'
import cs from 'classnames'
import styles from './swapCoupon.less'
import Tabbar from './tabbar'
import TabFooter from './tabFooter'

const { TabPane } = Tabs

const SwapCoupon = (props) => {
  const { className, ...other } = props
  const [activeKey, setActiveKey] = useState<string>('1')
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
  const isEmpty = typeof restProps['productName'] === 'undefined'

  const { onClick, onMouseOver, getOperateState } = other as any

  const divProps = {
    onClick,
    onMouseOver,
  }
  const handleTabChange = (key: string) => {
    setActiveKey(key)
  }
  const { productName, productImgUrl, price, giveCouponList, giveType } = restProps
  /** giveType 区分是元还是件 ，1.满额赠，单位元， 2.商品赠，单位件  */
  const unit = giveType === 1 ? '元' : '件'

  if (isEmpty) {
    return (
      <div className={cs(styles.commodityGroupEmpty, className)} {...divProps}>
        <div>
          <PlusOutlined style={{ color: '#C8CACD' }} />
        </div>
      </div>
    )
  }

  return (
    <div className={className} {...divProps}>
      <div className={styles.section}>
        <div className={styles.mainCommodity}>
          <Commodity
            name={productName}
            image={productImgUrl}
            mode="horizontal"
            discountPrice={price}
            tags={['赠优惠券']}
            buyBtn={true}
          />
        </div>
        <div className={styles.tab}>
          <Tabs
            activeKey={activeKey}
            renderTabBar={(tabProps) => <Tabbar tabProps={tabProps} onChange={handleTabChange} />}
          >
            {giveCouponList?.map((_item, _index) => {
              const { groupNo, limitValue, list } = _item
              return (
                <TabPane key={_item.groupNo.toString()} tab={`满${limitValue}${unit}获赠`}>
                  <div className={styles.groupPane}>
                    {list?.map((_row, _key) => {
                      return (
                        <div className={styles.couponItem} key={_key}>
                          <div className={styles.money}>
                            ￥<span className={styles.num}>{_row.denomination}</span>
                          </div>
                          <div className={styles.condition}>{`满${_row.useConditionMoney}可使用`}</div>
                          <div className={styles.couponType}>{_row.typeName}</div>
                        </div>
                      )
                    })}
                  </div>
                  {/* <TabFooter discountPrice={60} originalPrice={50} /> */}
                </TabPane>
              )
            })}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default SwapCoupon
