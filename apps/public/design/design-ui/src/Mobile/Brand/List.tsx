import React from 'react'
import cx from 'classnames'
import { PlusOutlined } from '@ant-design/icons'
import styles from './styles.less'
import ImageBox from '@apps/components/src/web/ImageBox'

interface BrandItemType {
  id: number
  name: string
  logoUrl: string
}

interface BrandListProps {
  brandList: BrandItemType[]
  className?: string
}

const BrandList: React.FC<BrandListProps> = (props) => {
  const { brandList, className, ...others } = props

  return (
    <div className={cx(styles['lingxi-brand-list'], className)} {...others}>
      {brandList && brandList.length > 0 ? (
        brandList.map((item) => (
          <div className={styles['lingxi-brand-list-item']} key={item.id}>
            <ImageBox width={96} height={34} src={item.logoUrl} />
          </div>
        ))
      ) : (
        <div className={styles['lingxi-brand-empty']}>
          <PlusOutlined />
        </div>
      )}
    </div>
  )
}

export default BrandList
