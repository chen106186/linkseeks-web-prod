import React from 'react'
import classNames from 'classnames'
import { RightOutlined } from '@ant-design/icons'
import { getWebIntl } from '@/utils/locales'
import { openLink } from '@/utils'
import styles from './index.module.less'

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
    linkdisable = false,
    linkUrl,
    subLinkUrl,
    ...others
  } = props
  const classString = classNames(styles['lingxi-floor-line-category'], className)
  const translate = getWebIntl()

  return (
    <section className={classString} {...others}>
      <img className={styles['floor-line-category-banner']} src={categoryAdvertPicUrl} />
      <div className={styles['recommend_category_list']}>
        {secondCategoryList &&
          secondCategoryList.map((item) => (
            <div className={styles['recommend_category_list_item']} key={item.categoryId}>
              <a
                title={item.categoryName}
                href={`${subLinkUrl}_c${item.categoryId}`}
                className={!linkdisable ? styles.link : ''}
              >
                <div className={styles['recommend_category_list_item_body']}>
                  <span className={styles['text']}>{item.categoryName}</span>
                  <RightOutlined translate={undefined} className={styles['icon']} />
                </div>
              </a>
            </div>
          ))}
        {secondCategoryList && secondCategoryList.length > 0 && (
          <div className={styles['recommend_category_list_item']}>
            <span onClick={() => openLink(linkUrl, linkdisable)} className={!linkdisable ? styles.link : ''}>
              <div className={styles['recommend_category_list_item_body']}>
                <span className={styles.text}>{translate('web.common.more')}</span>
                <RightOutlined translate={undefined} className={styles.icon} />
              </div>
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

export default Category
