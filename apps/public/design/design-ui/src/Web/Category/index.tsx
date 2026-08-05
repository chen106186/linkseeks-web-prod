import React, { Fragment } from 'react'
import { MenuOutlined, RightOutlined } from '@ant-design/icons'
import cx from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { LAYOUT_TYPE } from '../constants'
import ImageBox from '@apps/components/src/web/ImageBox'
import { CategoryLocale } from '../../locale/types/category'

interface CategoryPropsType {
  CategoryStore?: any
  SiteStore?: any
  layoutType?: LAYOUT_TYPE
  type?: LAYOUT_TYPE
  shopId?: number
  shopUrlParam?: string
  categoryList: any
  canHide?: boolean
  limitCount?: number
}

const Category: React.FC<CategoryPropsType> = (props) => {
  const { type, canHide, categoryList = [], limitCount = 7 } = props

  const renderComponent = (locale: CategoryLocale) => {
    return (
      <div
        className={cx(
          styles.category,
          type === LAYOUT_TYPE.own ? styles.own : '',
        )}
      >
        {(canHide ||
          type === LAYOUT_TYPE.own ||
          type === LAYOUT_TYPE.cpecialPage) && (
          <div
            className={cx(
              styles.category_type,
              type === LAYOUT_TYPE.shop ? styles.shop : '',
            )}
          >
            <MenuOutlined className={styles.icon} />
            <span>{locale['title']}</span>
          </div>
        )}
        <div
          className={cx(
            styles.category_content,
            type === LAYOUT_TYPE.shop ? styles.shop : '',
            canHide ? styles.hide : '',
          )}
        >
          <div className={styles.category_type_panel}>
            <ul className={styles.category_nav_list}>
              {categoryList.map(
                (
                  item: {
                    id: React.Key | null | undefined
                    name: string
                    children: any[]
                    brandList: any[]
                  },
                  index: number,
                ) =>
                  index < limitCount && (
                    <Fragment key={item.id}>
                      <li
                        className={styles.category_nav_list_item}
                        key={item.id}
                      >
                        <div className={styles.category_nav_list_item_body}>
                          <div className={styles.main_category}>
                            {item.name}
                          </div>
                          <div className={styles.sub_category}>
                            {item.children.map(
                              (
                                childCategory: {
                                  id: React.Key | null | undefined
                                  name: any
                                },
                                childIndex: number,
                              ) =>
                                childIndex < 3 && (
                                  <span key={childCategory.id}>
                                    {childCategory.name}
                                  </span>
                                ),
                            )}
                          </div>
                        </div>
                        <RightOutlined className={styles.right_icon} />
                      </li>
                      <div className={styles.category_type_content}>
                        <div className={styles.category_type_list}>
                          <div className={styles.title}>{item.name}</div>
                          {item.children.map(
                            (childCategory: {
                              id: React.Key | null | undefined
                              name: any
                              children: any[]
                            }) => (
                              <div
                                className={styles.second_category_type}
                                key={childCategory.id}
                              >
                                <div className={styles.title}>
                                  <span>
                                    {childCategory.name} <RightOutlined />
                                  </span>
                                </div>
                                <ul className={styles.third_category_type_list}>
                                  {childCategory.children.map(
                                    (thirdChildItem) => (
                                      <li key={thirdChildItem.id}>
                                        <span>{thirdChildItem.name}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            ),
                          )}
                        </div>
                        <div className={styles.category_type_right_wrap}>
                          <div className={styles.category_advert}>
                            {item.brandList &&
                              item.brandList.length > 0 &&
                              item.brandList.map((brandItem) => (
                                <div
                                  key={`category_advert_item_${brandItem.category_advert_item}`}
                                  className={styles.category_advert_item}
                                >
                                  <ImageBox
                                    width={160}
                                    height={80}
                                    src={
                                      brandItem.brandLogo || brandItem.logoUrl
                                    }
                                    wrapperStyle={{ backgroundColor: '#FFF' }}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  ),
              )}
              {categoryList && categoryList.length > limitCount && (
                <li className={styles.category_nav_list_item}>
                  <div className={styles.category_nav_list_item_body}>
                    <span>
                      <div className={styles.main_category}>
                        {locale['more']}
                      </div>
                      <RightOutlined className={styles.right_icon} />
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="Category">{renderComponent}</LocaleReceiver>
  )
}

Category.defaultProps = {
  canHide: false,
}

export default Category
