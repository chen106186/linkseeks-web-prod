import React from 'react'
import cx from 'classnames'
import ActionItem from './actionItem'
import barChartLineIconDefault from './icons/bar_chart_line_default.svg'
import barChartLineIconScience from './icons/bar_chart_line_science.svg'
import LogoIcon from './favicon.png'
import styles from './index.less'
import StatusBar from '../../components/StatusBar'
import { MobileLocale } from '../../locale/types/mobile'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'

export interface DataItemType {
  name: string
  content: string
  visible: boolean
  type: number // 1: 我的； 2: 进货单；3: 消息；4: 搜索框
}

export interface CategoryItemType {
  value: number
  label: string
}

export enum STYLE_THEME {
  /** 默认顶部导航样式 */
  default = 'default',
  /** 科技类顶部导航样式 */
  science = 'science',
}

export interface HeaderNavPropsType {
  className?: string
  title?: string
  logo?: string
  /** 样式主题 */
  styleTheme?: 0 | 1
  // stylesThemeList?: any[],
  dataList: DataItemType[]
  categoryList?: CategoryItemType[]
}

const STYLE_THEME_LIST = {
  0: 'default',
  1: 'science',
}

export type ItemProps = {
  ActionItem: typeof ActionItem
}

const HeaderNav: React.FC<HeaderNavPropsType> & ItemProps = (props) => {
  const {
    children,
    className,
    styleTheme = 0,
    logo,
    title,
    categoryList,
    ...others
  } = props

  const renderComponent = (locale: MobileLocale) => {
    const classNameString = cx(
      styles[`lingxi-header-nav`],
      styles[STYLE_THEME_LIST[styleTheme]],
      className,
    )

    const getIconUrl = (key: string) => {
      switch (key) {
        case 'icon-bar-chart-line':
          switch (STYLE_THEME_LIST[styleTheme]) {
            case STYLE_THEME.default:
              return barChartLineIconDefault
            case STYLE_THEME.science:
              return barChartLineIconScience
            default:
              return ''
          }
        default:
          return ''
      }
    }

    return (
      <div className={classNameString} {...others}>
        <StatusBar styleTheme={styleTheme} />
        <div className={styles['lingxi-header']}>
          <div className={styles['lingxi-header-logoWrap']}>
            {/* <img
              className={styles['lingxi-header-logoWrap-logo']}
              src={logo || LogoIcon}
            /> */}
            <span className={styles['lingxi-header-logoWrap-shopName']}>
              {title}
            </span>
          </div>
          <div className={styles['lingxi-header-actions']}>
            {children &&
              React.Children.map(children, (child: any) => {
                const { props } = child
                return props.type && props.type !== 4 && props.visible
                  ? React.cloneElement(child, {
                      styleTheme,
                    })
                  : null
              })}
          </div>
        </div>
        {children &&
          React.Children.map(children, (child: any) => {
            const { props } = child
            return props.type && props.type === 4 && props.visible
              ? child
              : null
          })}
        {categoryList && (
          <div className={styles['lingxi-header-category']}>
            <div className={styles['lingxi-header-category-main']}>
              <div className={styles['lingxi-header-category-main-body']}>
                <div
                  className={cx(
                    styles['lingxi-header-category-item'],
                    styles.active,
                  )}
                >
                  {locale['mobile.home']}
                </div>
                {categoryList.map((categoryItem) => (
                  <div
                    key={`categoryItem_${categoryItem.value}`}
                    className={styles['lingxi-header-category-item']}
                  >
                    {categoryItem.label}
                  </div>
                ))}
              </div>
            </div>
            <img
              className={styles['lingxi-header-category-icon']}
              alt="icon-bar-chart-line"
              src={getIconUrl('icon-bar-chart-line')}
            />
          </div>
        )}
        {/* <div className={styles["lingxi-header-bg"]}></div> */}
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

HeaderNav.ActionItem = ActionItem

HeaderNav.defaultProps = {
  styleTheme: 0,
  title: '',
}

export default HeaderNav
