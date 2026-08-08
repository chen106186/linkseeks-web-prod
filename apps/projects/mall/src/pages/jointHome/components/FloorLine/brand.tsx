import React from 'react'
import { ConfigConsumer } from '../Generator'
import cx from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import { openLink } from '@/utils'
import styles from './index.module.less'

interface BrandItemType {
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

export class Brand extends React.Component<BrandProps, {}> {
  renderComponent = () => {
    const { className, brandList, linkdisable = false, linkUrl, ...others } = this.props
    const classString = cx(styles['lingxi-floor-line-brand'], className)

    return (
      <section className={classString} {...others}>
        <div className={styles.brand_list}>
          {brandList &&
            brandList.map((item) => (
              <div className={cx(styles.brand_list_item)} key={`brand_list_item_${item.brandId}`}>
                <div
                  className={cx(styles.brand_img_box, !linkdisable ? styles.link : '')}
                  onClick={() => openLink(`${linkUrl}_b${item.brandId}`, linkdisable)}
                >
                  <ImageBox width={120} height={60} src={item.brandLogo} alt={item.brandName} />
                </div>
              </div>
            ))}
        </div>
      </section>
    )
  }

  render() {
    return <ConfigConsumer>{this.renderComponent}</ConfigConsumer>
  }
}
