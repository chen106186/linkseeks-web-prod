import React from 'react'
import cx from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import { openLink } from '../../utils'
import emptyImg from './images/floor_brand.svg'
import styles from './index.less'

export interface BrandItemType {
  sort: number
  /**
   * 品牌ID
   */
  brandId: number
  /**
   * 品牌Logo
   */
  brandLogo: string
  brandName: string
}

interface BrandProps {
  className?: string
  prefixCls?: string
  /**
   * 禁止跳转
   */
  linkdisable?: boolean
  brandList: BrandItemType[]
  linkUrl?: string
}

const Brand: React.FC<BrandProps> = (props) => {
  const { className, brandList, linkdisable = true, linkUrl, ...others } = props
  const classString = cx(styles['lingxi-floor-line-brand'], className)

  return (
    <section className={classString} {...others}>
      <div className={styles.brand_list}>
        {brandList && brandList.length > 0 ? (
          brandList.map((item) => (
            <div
              className={cx(styles.brand_list_item)}
              key={`brand_list_item_${item.brandId}`}
            >
              <div
                className={cx(
                  styles.brand_img_box,
                  !linkdisable ? styles.link : '',
                )}
                onClick={() =>
                  openLink(`/commodity/b${item.brandId}`, linkdisable)
                }
              >
                <ImageBox
                  width={120}
                  height={60}
                  src={item.brandLogo}
                  alt={item.brandName}
                />
              </div>
            </div>
          ))
        ) : (
          <img src={emptyImg} />
        )}
      </div>
    </section>
  )
}

export default Brand
