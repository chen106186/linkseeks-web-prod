import React, { Fragment } from 'react'
import { RightOutlined, MenuOutlined } from '@ant-design/icons'
import cx from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import ImageBox from '@apps/components/src/web/ImageBox'
import { CategoryLocale } from '../../locale/types/category'

interface CategoryPropsType {
  categoryList?: any[]
}

const ChannelCategory: React.FC<CategoryPropsType> = (props) => {
  const { categoryList } = props

  const renderComponent = (locale: CategoryLocale) => {
    return (
      <div className={styles.category}>
        <div className={cx(styles.category_content)}>
          <div className={styles.category_type_panel}>
            <div className={styles.category_type}>
              <MenuOutlined className={styles.icon} />
              <span>{locale['title']}</span>
            </div>
            <ul className={styles.category_nav_list}>
              {categoryList &&
                categoryList.map(
                  (item, index) =>
                    index < 5 && (
                      <Fragment key={item.id}>
                        <li className={styles.category_nav_list_item}>
                          <div className={styles.category_nav_list_item_body}>
                            <div className={styles.main_category}>
                              {item.title}
                            </div>
                            <div className={styles.sub_category}>
                              {item.children &&
                                item.children.map(
                                  (childCategory: any, childIndex: number) =>
                                    childIndex < 3 && (
                                      <span key={childCategory.id}>
                                        {childCategory.title}
                                      </span>
                                    ),
                                )}
                            </div>
                            <RightOutlined className={styles.right_icon} />
                          </div>
                        </li>
                        <div className={styles.category_type_content}>
                          <div className={styles.category_type_list}>
                            <div className={styles.title}>{item.title}</div>
                            {item.children &&
                              item.children.map((childCategory: any) => (
                                <div
                                  className={styles.second_category_type}
                                  key={childCategory.id}
                                >
                                  <div className={styles.title}>
                                    <span>
                                      {childCategory.title} <RightOutlined />
                                    </span>
                                  </div>
                                  <ul
                                    className={styles.third_category_type_list}
                                  >
                                    {childCategory.children &&
                                      childCategory.children.map(
                                        (thirdChildItem: any) => (
                                          <li key={thirdChildItem.id}>
                                            <span>{thirdChildItem.title}</span>
                                          </li>
                                        ),
                                      )}
                                  </ul>
                                </div>
                              ))}
                          </div>
                          <div className={styles.category_type_right_wrap}>
                            <div className={styles.category_advert}>
                              {item.brandList &&
                                item.brandList.length > 0 &&
                                item.brandList.map(
                                  (brandItem: any, brandIndex: number) =>
                                    brandIndex < 4 && (
                                      <div
                                        key={`category_advert_item_${brandIndex}`}
                                        className={styles.category_advert_item}
                                      >
                                        <span>
                                          <ImageBox
                                            width={120}
                                            height={60}
                                            src={
                                              brandItem.brandLogo ||
                                              brandItem.logoUrl
                                            }
                                          />
                                        </span>
                                      </div>
                                    ),
                                )}
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    ),
                )}
              {categoryList && categoryList.length > 5 && (
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

export default ChannelCategory
