import React from 'react'
import classNames from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import styles from './index.less'

interface BannerProps {
  className?: string
  advertList: any[]
}

const Banner: React.FC<BannerProps> = (props) => {
  const { className, advertList, ...others } = props
  const purchaseClassString = classNames(styles['lingxi-purchase'], className)

  return (
    <div className={purchaseClassString} {...others}>
      {advertList &&
        advertList.length > 0 &&
        advertList.map(
          (item: any, index: number) =>
            index === 0 && (
              <ImageBox
                key={`purchase_${index}`}
                width={340}
                height={100}
                src={item.imgUrl}
              />
            ),
        )}
    </div>
  )
}

export default Banner
