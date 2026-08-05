import React, { Fragment } from 'react'
import { RightOutlined, MenuOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { LAYOUT_TYPE } from '@/types/global'
import { getWebIntl } from '@/utils/locales'
import useLink from '@/hooks/useLink'
import styles from './index.module.less'

interface CategoryPropsType {
  CategoryStore?: any
  SiteStore?: any
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
  const { type, memberId, isHome = false, categoryList, canHide, shopUrlParam } = props
  const { linkPrefix } = useLink()

  const getNavLink = (item: any) => {
    switch (type) {
      case LAYOUT_TYPE.shop:
        return linkPrefix(`/shop/${shopUrlParam}/commodity/${item.key}`)
      case LAYOUT_TYPE.own:
        return linkPrefix(`/commodity/${item.key}`)
      default:
        return linkPrefix(`/commodity/${item.key}`)
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
                  index < 7 && (
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
            {categoryList && categoryList.length > 7 && (
              <li className={styles.category_nav_list_item}>
                <div className={styles.category_nav_list_item_body}>
                  <a
                    title={translate('web.resource.mall.gengduofenlei')}
                    href={type === LAYOUT_TYPE.shop ? `/shop/${shopUrlParam}/commodity` : '/commodity'}
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
