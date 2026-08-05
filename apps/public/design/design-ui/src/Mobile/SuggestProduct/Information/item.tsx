import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.less'
import ImageBox from '@apps/components/src/web/ImageBox'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../../locale/types/mobile'
import { dateFormat } from '../../../utils/date'

interface InformationItemProps {
  id: number
  title: string
  imageUrl: string
  content?: string
  columnName: string
  createTime: number
  readCount: number
}

export const InformationEmpty = () => (
  <div className={styles['information-list-item']}>
    <div className={styles['information-list-item-empty']}>
      <PlusOutlined style={{ color: '#CBCACD' }} />
    </div>
  </div>
)

const InformationItem: React.FC<InformationItemProps> = (props) => {
  const { title, imageUrl, columnName, createTime, readCount } = props

  const renderComponent = (locale: MobileLocale) =>
    title || imageUrl ? (
      <div className={styles['information-list-item']}>
        <ImageBox width={120} height={80} src={imageUrl} round={2} />
        <div className={styles['information-list-item-info']}>
          <div className={styles['information-list-item-info-title']}>
            {title}
          </div>
          <div className={styles['information-list-item-info-tag']}>
            {columnName}
          </div>
          <div className={styles['information-list-item-info-bottom']}>
            <span className={styles['information-list-item-info-bottom-date']}>
              {dateFormat(createTime ? new Date(createTime) : new Date())}
            </span>
            <span className={styles['information-list-item-info-bottom-count']}>
              {readCount} {locale['mobile.browse']}
            </span>
          </div>
        </div>
      </div>
    ) : (
      <InformationEmpty />
    )

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default InformationItem
