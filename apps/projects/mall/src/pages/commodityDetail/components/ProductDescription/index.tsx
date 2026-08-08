import React, { useState, useEffect } from 'react'
import { Anchor, BackTop } from 'antd'
import { COMMODITY_TYPE } from '@/constants'
import { LAYOUT_TYPE, MallInfoType } from '@/types/global'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import { GetProductShopStoreGetCommodityDetailResponse } from '@apps/apis'
import Comment from './components/Comment'
import Introduction from './components/Introduction'
import TradeRecord from './components/TradeRecord'
import Recommand from './components/Recommand'
import styles from './index.module.less'
import { useGlobalConext } from '@/context/globalProvider'
import { CurrentSkuItemType } from '../../types'

const { Link } = Anchor

interface ProductDescriptionPropsType {
  commodityDetail: GetProductShopStoreGetCommodityDetailResponse
  dataList: any
  memberId?: number
  currentSku?: CurrentSkuItemType
}

const ProductDescription: React.FC<ProductDescriptionPropsType> = (props) => {
  const translate = getWebIntl()
  const { commodityDetail, currentSku } = props
  const { layoutType, mallInfo } = useGlobalConext()
  const [currentAnchor, setCurrentAnchor] = useState<string>('#introduction')
  const [tradeRecordCount, setTradeRecordCount] = useState<number>(0)
  const [commentCount, setCommentCount] = useState<number>(0)
  const [backTopVisible, setBackTopVisible] = useState<boolean>(false)
  console.log(currentSku, 'currentSku')
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

  return (
    <div className={styles.product_description} id="product_description">
      <Anchor className={styles.product_description_anchor} targetOffset={120} onChange={handleAnchorChange}>
        <Link
          className={cx(currentAnchor === '#introduction' ? 'active' : '')}
          href="#introduction"
          title={translate('web.resource.mall.chanpinjianjie')}
        />
        <Link
          href="#trade_record"
          title={
            commodityDetail?.priceType === COMMODITY_TYPE.integral
              ? `${translate('web.resource.mall.duihuanjilu')}${tradeRecordCount ? `(${tradeRecordCount})` : `(0)`}`
              : `${translate('web.resource.mall.jiaoyijilu')}${tradeRecordCount ? `(${tradeRecordCount})` : `(0)`}`
          }
        />
        <Link
          href="#comment"
          title={`${translate('web.resource.mall.jiaoyipingjia')}(${commentCount > 999 ? '999+' : commentCount})`}
        />
      </Anchor>
      <Introduction commodityDetail={commodityDetail} currentSku={currentSku} />
      <TradeRecord
        productId={commodityDetail?.id}
        mallId={mallInfo?.id}
        setCount={(count: number) => setTradeRecordCount(count)}
      />
      <Comment
        productId={commodityDetail?.id}
        shopType={mallInfo?.type}
        layoutType={layoutType}
        setCount={(count: number) => setCommentCount(count)}
      />
      <Recommand {...props} />
    </div>
  )
}

export default ProductDescription
