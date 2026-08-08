import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.less'
import ImageBox from '@apps/components/src/web/ImageBox'

interface BrandItemType {
  id: number
  name: string
  logoUrl: string
}

interface BrandItemProps {
  name: string
  image: string
  brandList: BrandItemType[]
  empty?: boolean
}

const BrandItem: React.FC<BrandItemProps> = (props) => {
  const { name, image, brandList } = props

  return name || image || brandList ? (
    <div className={styles['brand-list-item']}>
      <div className={styles['brand-list-item-header']}>
        <ImageBox width={24} height={24} round={4} src={image} />
        <span className={styles['brand-list-item-header-categoryName']}>
          {name}
        </span>
      </div>
      <div className={styles['brand-list-item-brandlist']}>
        {brandList &&
          brandList.length > 0 &&
          brandList.map((brandItem) => (
            <div
              className={styles['brand-list-item-brandlist-item']}
              key={`brand-list-item-brandlist-item-${brandItem.id}`}
            >
              <ImageBox width={80} height={32} src={brandItem.logoUrl} />
            </div>
          ))}
      </div>
    </div>
  ) : (
    <div className={styles['brand-list-item']}>
      <div className={styles['brand-list-item-empty']}>
        <PlusOutlined style={{ color: '#CBCACD' }} />
      </div>
    </div>
  )
}

export default BrandItem
