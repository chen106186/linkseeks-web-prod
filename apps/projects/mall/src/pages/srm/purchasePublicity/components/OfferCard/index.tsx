/**
 * 采购公示
 */
import React from 'react'
import IconFont from '@/utils/iconfont'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface Props {
  cardContent?: string
  cardCompany?: string
  cardData?: string
  id?: string
  inShop?: boolean
  type?: number
}

const OfferCard: React.FC<Props> = (props) => {
  const { cardContent = '-', id = 1, type = 1 } = props
  const translate = getWebIntl()

  const fnGetIcon = () => {
    switch (type) {
      case 1:
        return <IconFont type="icon-xunjia" className={styles['operation-icon']} />
      case 2:
        return <IconFont type="icon-zhaobiao" className={styles['operation-icon']} />
      case 3:
        return <IconFont type="icon-jingjia" className={styles['operation-icon']} />
    }
  }

  return (
    <ul className={styles['procurement-main']}>
      <li className={styles['procurement-left']}>
        <div className={styles['procurement-identification']}>{fnGetIcon()}</div>

        <div className={styles['procurement-content']}>{cardContent}</div>
      </li>
      <li className={styles['procurement-right']}>
        <div className={styles['procurement-btn']}>{translate('web.resource.mall.chakanxiangqing')}</div>
        <a href={`/publicityDetail/${id}`} className="all-jump"></a>
      </li>
    </ul>
  )
}

export default OfferCard
