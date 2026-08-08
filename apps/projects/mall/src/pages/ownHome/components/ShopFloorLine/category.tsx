import React from 'react'
import classNames from 'classnames'
import { CaretRightOutlined } from '@ant-design/icons'
import { LinkTo } from '@/utils'
import styles from './index.module.less'

interface CategoryItemType {
  /**
   * 品类ID
   */
  categoryId: number
  /**
   * 品类名称
   */
  categoryName: string
  /**
   * 是否选择 1.是 0.否
   */
  selectStatus: number
}

interface CategoryProps {
  className?: string
  prefixCls?: string
  linkUrl?: string
  linkdisable?: boolean
  /**
   * 品类广告图
   */
  categoryAdvertPicUrl: string
  /**
   * 二级分类
   */
  categoryList: CategoryItemType[]
}

const Category: React.FC<CategoryProps> = (props) => {
  const { className, linkUrl, linkdisable, categoryAdvertPicUrl, categoryList, ...others } = props

  const renderComponent = () => {
    const classString = classNames(styles['lingxi-shop-floor-line-category'], className)

    return (
      <section className={classString} {...others}>
        <img className={styles['floor-line-category-banner']} src={categoryAdvertPicUrl} />
        <div className={styles.recommend_category_list}>
          {categoryList &&
            categoryList.map((item) => (
              <div
                className={classNames(styles.recommend_category_list_item, !linkdisable ? styles.link : '')}
                key={item.categoryId}
                onClick={() => LinkTo(`${linkUrl}_c${item.categoryId}`)}
              >
                <div className={styles.recommend_category_list_item_body}>
                  <span className={styles.text}>{item.categoryName}</span>
                  <CaretRightOutlined className={styles.icon} translate={undefined} />
                </div>
              </div>
            ))}
        </div>
      </section>
    )
  }

  return renderComponent()
}

export default Category
