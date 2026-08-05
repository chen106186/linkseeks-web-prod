import React from 'react'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../locale/types/mobile'
import arrowRightIcon from '../../icons/arrow-ios-right.svg'

export interface InformationCardProps {
  title: string
  visible?: boolean
}

const InformationCard: React.FC<InformationCardProps> = (props) => {
  const { title, visible = true } = props

  const renderComponent = (locale: MobileLocale) => (
    <div className={styles['information-card']}>
      <div className={styles['information-card-body']}>
        <div className={styles['information-card-label']}>
          {locale['mobile.information']}
        </div>
        <div className={styles['information-card-title']}>{title}</div>
        <div className={styles['information-card-arrow']}>
          <img src={arrowRightIcon} />
        </div>
      </div>
    </div>
  )
  return visible ? (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  ) : null
}

export default InformationCard
