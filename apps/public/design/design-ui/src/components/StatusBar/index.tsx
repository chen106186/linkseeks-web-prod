import React from 'react'
import cx from 'classnames'
import xinhaofullIconDefault from './icons/xinhao_full_default.svg'
import xinhaofullIconScience from './icons/xinhao_full_science.svg'
import xinhaoIconDefault from './icons/xinhao_default.svg'
import xinhaoIconScience from './icons/xinhao_science.svg'
import dianliangIconDefault from './icons/dianliang_default.svg'
import dianliangIconScience from './icons/dianliang_science.svg'
import barChartLineIconDefault from './icons/bar_chart_line_default.svg'
import barChartLineIconScience from './icons/bar_chart_line_science.svg'
import styles from './index.less'

interface StatusBarProps {
  styleTheme?: 0 | 1
}

export enum STYLE_THEME {
  /** 默认顶部导航样式 */
  default = 'default',
  /** 科技类顶部导航样式 */
  science = 'science',
}

const STYLE_THEME_LIST = {
  0: 'default',
  1: 'science',
}

const StatusBar: React.FC<StatusBarProps> = (props) => {
  const { styleTheme = 0 } = props

  const getIconUrl = (key: string) => {
    switch (key) {
      case 'icon-xinhao-full':
        switch (STYLE_THEME_LIST[styleTheme]) {
          case STYLE_THEME.default:
            return xinhaofullIconDefault
          case STYLE_THEME.science:
            return xinhaofullIconScience
          default:
            return ''
        }
      case 'icon-xinhao':
        switch (STYLE_THEME_LIST[styleTheme]) {
          case STYLE_THEME.default:
            return xinhaoIconDefault
          case STYLE_THEME.science:
            return xinhaoIconScience
          default:
            return ''
        }
      case 'icon-dianliang':
        switch (STYLE_THEME_LIST[styleTheme]) {
          case STYLE_THEME.default:
            return dianliangIconDefault
          case STYLE_THEME.science:
            return dianliangIconScience
          default:
            return ''
        }
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
    <div className={styles['lingxi-status-bar']}>
      <span
        className={cx(
          styles['lingxi-status-bar-time'],
          styles[STYLE_THEME_LIST[styleTheme]],
        )}
      >
        9:41
      </span>
      <div className={styles['lingxi-status-bar-right']}>
        <img
          className={styles['lingxi-status-bar-right-icon']}
          alt="icon-xinhao-full"
          src={getIconUrl('icon-xinhao-full')}
        />
        <img
          className={styles['lingxi-status-bar-right-icon']}
          alt="icon-xinhao"
          src={getIconUrl('icon-xinhao')}
        />
        <img
          className={styles['lingxi-status-bar-right-icon']}
          alt="icon-dianliang"
          src={getIconUrl('icon-dianliang')}
        />
      </div>
    </div>
  )
}

export default StatusBar
