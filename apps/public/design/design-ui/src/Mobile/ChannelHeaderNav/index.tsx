import React from 'react'
import cx from 'classnames'
import ActionItem from './actionItem'
import barChartLineIconDefault from './icons/bar_chart_line_default.svg'
import barChartLineIconScience from './icons/bar_chart_line_science.svg'
import arrowDownIconDefault from './icons/arrow_down_icon.svg'
import arrowDownIconScience from './icons/arrow_down_icon_science.svg'
import SearchItem from './searchItem'
import styles from './index.less'
import StatusBar from '../../components/StatusBar'
import { MobileLocale } from '../../locale/types/mobile'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'

export interface DataItemType {
  name: string
  content: string
  status: boolean
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

export interface ChannelHeaderNavPropsType {
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

const ChannelHeaderNav: React.FC<ChannelHeaderNavPropsType> & ItemProps = (
  props,
) => {
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
        case 'arrowDown':
          switch (STYLE_THEME_LIST[styleTheme]) {
            case STYLE_THEME.default:
              return arrowDownIconDefault
            case STYLE_THEME.science:
              return arrowDownIconScience
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
            <span className={styles['lingxi-header-logoWrap-shopName']}>
              {title}
            </span>
            <img src={getIconUrl('arrowDown')} />
          </div>
          <div className={styles['lingxi-header-actions']}>
            {children &&
              React.Children.map(children, (child: any) => {
                const {
                  props: { data },
                } = child
                return data.type && data.type !== 4 && data.status
                  ? React.cloneElement(child, {
                      styleTheme,
                    })
                  : null
              })}
          </div>
        </div>
        <SearchItem />
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

ChannelHeaderNav.ActionItem = ActionItem

ChannelHeaderNav.defaultProps = {
  styleTheme: 0,
  title: '',
}

export default ChannelHeaderNav
