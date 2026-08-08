/*
 * @Author: your name
 * @Date: 2021-01-18 16:40:59
 * @LastEditTime: 2022-03-31 11:38:56
 * @LastEditors: GHua
 * @Description: In User Settings Edit
 * @FilePath: /lingxi-business-paltform/src/pages/lxMall/commodityDetail/components/ProductDescription/index.tsx
 */
import React, { useState, useEffect } from 'react'
import { Anchor, BackTop } from 'antd'
import Comment from './components/Comment'
import Introduction from './components/Introduction'
import TradeRecord from './components/TradeRecord'
// import Recommand from './components/Recommand'
import { LAYOUT_TYPE, COMMODITY_TYPE } from '@/constants'
import { CommodityDetailType } from '../../view'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import styles from './index.less'

const { Link } = Anchor

interface ProductDescriptionPropsType {
  commodityDetail: CommodityDetailType
  mallInfo: any
  dataList: any
  storeId: number
  memberId: number
  layoutType: LAYOUT_TYPE
}

const ProductDescription: React.FC<ProductDescriptionPropsType> = (props) => {
  const { commodityDetail, storeId, memberId, mallInfo, layoutType } = props
  const [currentAnchor, setCurrentAnchor] = useState<string>('#introduction')
  // const [productIds, setProductIds] = useState<number[]>([])
  const [tradeRecordCount, setTradeRecordCount] = useState<number>(0)
  const [commentCount, setCommentCount] = useState<number>(0)
  const [backTopVisible, setBackTopVisible] = useState<boolean>(false)
  const intl = useIntl()
  const handleAnchorChange = (currentActiveLink: string) => {
    if (currentActiveLink) {
      setBackTopVisible(true)
      setCurrentAnchor(currentActiveLink)
    }
  }

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    if (scrollTop === 0) {
      setBackTopVisible(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  }, [])

  const showTextByPriceType = (type: COMMODITY_TYPE) => {
    switch (type) {
      case COMMODITY_TYPE.prompt:
        return intl.formatMessage({ id: 'Interested.index.OrderNow' })
      case COMMODITY_TYPE.inquiry:
        return intl.formatMessage({ id: 'commodityDetail.index.InquiryNow' })
      case COMMODITY_TYPE.integral:
        return intl.formatMessage({ id: 'Interested.index.RedeemNow' })
    }
  }

  return (
    <div className={styles.product_description} id="product_description">
      <Anchor className={styles.product_description_anchor} targetOffset={120} onChange={handleAnchorChange}>
        <Link
          className={cx(currentAnchor === '#introduction' ? 'active' : '')}
          href="#introduction"
          title={intl.formatMessage({ id: 'ProductDescription.index.ProductIntroduction' })}
        />
        <Link
          href="#trade_record"
          title={
            commodityDetail?.priceType === COMMODITY_TYPE.integral
              ? `${intl.formatMessage({ id: 'Interested.index.ExchangeRecord' })}${
                  tradeRecordCount ? `(${tradeRecordCount})` : `(0)`
                }`
              : `${intl.formatMessage({ id: 'Interested.index.TransactionRecord' })}${
                  tradeRecordCount ? `(${tradeRecordCount})` : `(0)`
                }`
          }
        />
        <Link
          href="#comment"
          title={`${intl.formatMessage({ id: 'PDtion.Comment.index.TEvaluation' })}(${
            commentCount > 999 ? '999+' : commentCount
          })`}
        />
        <BackTop
          className={cx(styles.buy_now_btn, !backTopVisible ? styles.hide : null)}
          visibilityHeight={800}
          onClick={() => setBackTopVisible(false)}
        >
          {showTextByPriceType(commodityDetail?.priceType || COMMODITY_TYPE.prompt)}
        </BackTop>
      </Anchor>
      <Introduction commodityDetail={commodityDetail} />
      <TradeRecord
        productId={commodityDetail?.id}
        storeId={storeId}
        setCount={(count: number) => setTradeRecordCount(count)}
      />
      <Comment
        productId={commodityDetail?.id}
        shopType={mallInfo?.type}
        memberId={memberId}
        layoutType={layoutType}
        setCount={(count: number) => setCommentCount(count)}
      />
    </div>
  )
}

export default ProductDescription
