import React, { Fragment } from 'react'
import { RightOutlined, MenuOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { LAYOUT_TYPE } from '@/types/global'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface CategoryPropsType {
  layoutType?: LAYOUT_TYPE
  type?: LAYOUT_TYPE
  shopId?: number
  memberId?: number
  /** 店铺链接参数 */
  shopUrlParam?: string
  /** 品类数据 */
  categoryList?: any[]
  /** 是否可以显示隐藏 */
  canHide?: boolean
  /** 是否首页 */
  isHome?: boolean
}

const Category: React.FC<CategoryPropsType> = (props) => {
  const translate = getWebIntl()
  const { type, isHome = false, categoryList, canHide, shopUrlParam } = props
  const showCount = 6

  const getNavLink = (item: any) => {
    switch (type) {
      case LAYOUT_TYPE.shopIndex:
        return `/shopIndex/${shopUrlParam}/purchaseInquiry/${item.key}`
      default:
        return `/purchaseInquiry/${item.key}`
    }
  }

  return (
    <div className={cx(styles.category, type === LAYOUT_TYPE.shop ? styles.shop : {})}>
      {canHide && (
        <div className={cx(styles.category_type, type === LAYOUT_TYPE.own && styles['own-type'])}>
          <MenuOutlined translate={undefined} className={styles.icon} />
          <span>{translate('web.resource.mall.quanbushangpinpinlei')}</span>
        </div>
      )}
      <div
        className={cx(
          styles.category_content,
          type === LAYOUT_TYPE.shop ? styles.shop : '',
          canHide && !isHome ? styles.hide : '',
        )}
      >
        <div className={styles.category_type_panel}>
          <ul className={styles.category_nav_list}>
            {categoryList &&
              categoryList.map(
                (item, index) =>
                  index < showCount && (
                    <Fragment key={item.id}>
                      <li className={styles.category_nav_list_item}>
                        <div className={styles.category_nav_list_item_body}>
                          <div className={styles.main_category} title={item.name}>
                            {item.name}
                          </div>
                          <div className={styles.sub_category}>
                            {item.children &&
                              item.children.map(
                                (childCategory: any, childIndex: number) =>
                                  childIndex < 3 && (
                                    <a
                                      href={getNavLink(childCategory)}
                                      title={String(childCategory.name)}
                                      key={childCategory.id}
                                    >
                                      {childCategory.name}
                                    </a>
                                  ),
                              )}
                          </div>
                          <RightOutlined className={styles.right_icon} translate={undefined} />
                        </div>
                      </li>
                      <div className={styles.category_type_content}>
                        <div className={styles.category_type_list}>
                          <div className={styles.title}>{item.name}</div>
                          {item.children &&
                            item.children.map((childCategory: any) => (
                              <div className={styles.second_category_type} key={childCategory.id}>
                                <div className={styles.title}>
                                  <a href={getNavLink(childCategory)} title={String(childCategory.name)}>
                                    {childCategory.name} <RightOutlined translate={undefined} />
                                  </a>
                                </div>
                                <ul className={styles.third_category_type_list}>
                                  {childCategory.children &&
                                    childCategory.children.map((thirdChildItem: any) => (
                                      <li key={thirdChildItem.id}>
                                        <a title={String(thirdChildItem.name)} href={getNavLink(thirdChildItem)}>
                                          {thirdChildItem.name}
                                        </a>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            ))}
                        </div>
                      </div>
                    </Fragment>
                  ),
              )}
            {categoryList && categoryList.length > showCount && (
              <li className={styles.category_nav_list_item}>
                <div className={styles.category_nav_list_item_body}>
                  <a
                    title={translate('web.resource.mall.gengduofenlei')}
                    href={
                      type === LAYOUT_TYPE.shopIndex ? `/shopIndex/${shopUrlParam}/purchaseInquiry` : '/purchaseInquiry'
                    }
                  >
                    <div className={styles.main_category}>{translate('web.resource.mall.gengduofenlei')}</div>
                    <RightOutlined className={styles.right_icon} translate={undefined} />
                  </a>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

Category.defaultProps = {
  canHide: false,
}

export default Category
