import React from 'react'
import classNames from 'classnames'
import { RightOutlined } from '@ant-design/icons'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { FloorLineLocale } from '../../locale/types/floorline'
import { openLink } from '../../utils'
import emptyImg from './images/floor_category.svg'

interface SecondCategoryItemType {
  /**
   * 二级品类ID
   */
  categoryId: number
  /**
   * 二级品类名称
   */
  categoryName: string
}

interface CategoryProps {
  className?: string
  prefixCls?: string
  linkdisable?: boolean
  /**
   * 品类广告图
   */
  categoryAdvertPicUrl: string
  /**
   * 二级分类
   */
  secondCategoryList: SecondCategoryItemType[]
  linkUrl: string
  subLinkUrl?: string
}

const Category: React.FC<CategoryProps> = (props) => {
  const {
    className,
    categoryAdvertPicUrl,
    secondCategoryList,
    linkdisable = true,
    linkUrl,
    subLinkUrl,
    ...others
  } = props
  const classString = classNames(
    styles['lingxi-floor-line-category'],
    className,
  )

  const renderComponent = (locale: FloorLineLocale) => {
    return (
      <section className={classString} {...others}>
        <img
          className={styles['floor-line-category-banner']}
          src={categoryAdvertPicUrl || emptyImg}
        />
        <div className={styles['recommend_category_list']}>
          {secondCategoryList &&
            secondCategoryList.map((item: any) => (
              <div
                className={styles['recommend_category_list_item']}
                key={item.categoryId}
              >
                <span
                  title={item.categoryName}
                  onClick={() =>
                    openLink(`${subLinkUrl}_c${item.categoryId}`, linkdisable)
                  }
                  className={!linkdisable ? styles.link : ''}
                >
                  <div className={styles['recommend_category_list_item_body']}>
                    <span className={styles['text']}>{item.categoryName}</span>
                    <RightOutlined className={styles['icon']} />
                  </div>
                </span>
              </div>
            ))}
          {secondCategoryList && secondCategoryList.length > 0 && (
            <div className={styles['recommend_category_list_item']}>
              <span
                onClick={() => openLink(linkUrl, linkdisable)}
                className={!linkdisable ? styles.link : ''}
              >
                <div className={styles['recommend_category_list_item_body']}>
                  <span className={styles.text}>{locale['more.btn']}</span>
                  <RightOutlined className={styles.icon} />
                </div>
              </span>
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <LocaleReceiver componentName="FloorLine">{renderComponent}</LocaleReceiver>
  )
}

export default Category
