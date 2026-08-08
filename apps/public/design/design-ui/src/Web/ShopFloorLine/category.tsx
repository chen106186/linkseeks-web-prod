import React from 'react'
import classNames from 'classnames'
import { CaretRightOutlined } from '@ant-design/icons'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { FloorLineLocale } from '../../locale/types/floorline'
import styles from './index.less'
import { openLink } from '../../utils'

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
  categoryAdvertPicUrl?: string
  /**
   * 二级分类
   */
  categoryList?: CategoryItemType[]
}

const Category: React.FC<CategoryProps> = (props) => {
  const {
    className,
    linkUrl,
    linkdisable = true,
    categoryAdvertPicUrl,
    categoryList,
    ...others
  } = props

  const renderComponent = (locale: FloorLineLocale) => {
    const classString = classNames(
      styles['lingxi-shop-floor-line-category'],
      className,
    )

    return (
      <section className={classString} {...others}>
        {categoryAdvertPicUrl && (
          <img
            className={styles['floor-line-category-banner']}
            src={categoryAdvertPicUrl}
          />
        )}
        {categoryList && categoryList?.length > 0 ? (
          <div className={styles.recommend_category_list}>
            {categoryList.map((item) => (
              <div
                className={classNames(
                  styles.recommend_category_list_item,
                  !linkdisable ? styles.link : '',
                )}
                key={item.categoryId}
                onClick={() =>
                  openLink(`${linkUrl}_c${item.categoryId}`, linkdisable)
                }
              >
                <div className={styles.recommend_category_list_item_body}>
                  <span className={styles.text}>{item.categoryName}</span>
                  <CaretRightOutlined className={styles.icon} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.recommend_category_list_null}>
            <div className={styles.recommend_category_list_null_top}>
              <span>{locale['category']}</span>
              <span>{locale['show.area']}</span>
            </div>
            <div className={styles.recommend_category_list_null_bottom}>
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        )}
      </section>
    )
  }

  return (
    <LocaleReceiver componentName="FloorLine">{renderComponent}</LocaleReceiver>
  )
}

export default Category
