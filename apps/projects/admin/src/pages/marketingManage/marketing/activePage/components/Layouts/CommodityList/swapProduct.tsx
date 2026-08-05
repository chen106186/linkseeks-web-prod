import React, { useState } from 'react'
import { omit } from 'lodash'
import { Commodity, Progress, CustomizeTag } from '@apps/design-ui'
import { PlusOutlined, TagOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'
import cs from 'classnames'
import styles from './swapProduct.less'
import Tabbar from './tabbar'
import TabFooter from './tabFooter'

const { TabPane } = Tabs

const SwapProduct = (props) => {
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

  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, getOperateState } = other as any

  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }
  const handleTabChange = (key: string) => {
    setActiveKey(key)
  }
  const { productName, productImgUrl, price, goodsSubsidiaryGroupList, giveType } = restProps
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
            tags={['赠商品']}
            buyBtn={false}
          />
        </div>
        <div className={styles.tab}>
          <Tabs
            activeKey={activeKey}
            renderTabBar={(tabProps) => <Tabbar tabProps={tabProps} onChange={handleTabChange} />}
          >
            {goodsSubsidiaryGroupList?.map((_item, _index) => {
              const { groupNo, limitValue, goodsSubsidiaryGroupDetailsList } = _item
              return (
                <TabPane key={_item.groupNo.toString()} tab={`满${limitValue}${unit}赠送`}>
                  <div className={styles.groupPane}>
                    {goodsSubsidiaryGroupDetailsList?.map((_row, _key) => {
                      return (
                        <div className={styles.giftItem} key={_key}>
                          <div className={styles.giftImage}>
                            <img src={_row.productImgUrl} />
                            <div className={styles.num}>x{_row.num}</div>
                          </div>
                          <CustomizeTag>原价{`${_row.price}`}元</CustomizeTag>
                        </div>
                      )
                    })}
                  </div>
                  <TabFooter discountPrice={60} originalPrice={50} />
                </TabPane>
              )
            })}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default SwapProduct
