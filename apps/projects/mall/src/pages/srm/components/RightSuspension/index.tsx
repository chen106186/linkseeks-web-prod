import React, { useState, useEffect } from 'react'
import { Affix, BackTop } from 'antd'
import { UpOutlined } from '@ant-design/icons'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'
import { GetCommodityWebMemberPurchaseWebMemberPurchaseMainResponse } from '@apps/apis'

interface Props {
  userInfo: any
  mallInfo: any
  isShop?: boolean
  shopInfo: GetCommodityWebMemberPurchaseWebMemberPurchaseMainResponse | undefined
}

const RightSuspension: React.FC<Props> = (props) => {
  const { userInfo, shopInfo, isShop = false } = props
  const [top] = useState(200)
  const translate = getWebIntl()
  const pathPrefix = `/shopIndex/${shopInfo?.id}`

  return (
    <div className={styles['affix-main']}>
      <div className="ant-affix-right">
        <Affix offsetTop={top} style={{ right: 0 }}>
          <ul className={styles['affix-warp']}>
            <li className={styles['icon-warp']}>
              <div className={styles['icon-text']}>{translate('web.resource.mall.quanbugongshi')}</div>
              <a href={isShop ? `${pathPrefix}/purchasePublicity` : '/purchasePublicity'} className="all-jump"></a>
            </li>
            <li className={styles['icon-warp']}>
              <div className={styles['icon-text']}>{translate('web.resource.order.caigouxunjia')}</div>
              <a href={isShop ? `${pathPrefix}/purchaseInquiry` : '/purchaseInquiry'} className="all-jump"></a>
            </li>
            <li className={styles['icon-warp']}>
              <div className={styles['icon-text']}>{translate('web.resource.order.caigouzhaobiao')}</div>
              <a href={isShop ? `${pathPrefix}/purchaseBidding` : '/purchaseBidding'} className="all-jump"></a>
            </li>
            <li className={styles['icon-warp']}>
              <div className={styles['icon-text']}>{translate('web.resource.order.caigoujingjia')}</div>
              <a href={isShop ? `${pathPrefix}/purchaseCompete` : '/purchaseCompete'} className="all-jump"></a>
            </li>
            <li>
              <BackTop>
                <div className={styles['icon-warp']} style={{ borderBottom: '0', borderTop: '1px solid #F4F5F7' }}>
                  <UpOutlined className={styles['icon-affix']} />
                </div>
              </BackTop>
            </li>
          </ul>
        </Affix>
      </div>
    </div>
  )
}

export default RightSuspension
