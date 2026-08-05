import React from 'react'
import cx from 'classnames'
import ICON_CONFIG from './iconsConfig'
import TEXT_CONFIG from './initConfig'
import styles from './index.less'
import { MobileLocale } from '../../../locale/types/mobile'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'

const ICON_CONFIGS: any = { ...ICON_CONFIG }
const TEXT_CONFIGS: any = { ...TEXT_CONFIG }

export interface HeaderProps {
  // 活动类型
  type:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
  // 填充info的数值，填充顺序从左往右
  replaceArr?: number[]
  // 自定title
  title?: React.ReactNode
  // 自定info
  explain?: React.ReactNode
  // 自定icon
  icon?: any
  // 倒计时数组[时,分,秒]
  countDown?: string[]
  className: string
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const {
    type,
    replaceArr,
    title,
    explain,
    icon,
    countDown,
    className,
    ...other
  } = props
  const classNameString = cx(styles['lingxi-marketingCard-header'], className)

  const _replaceText = (arr: any, text: string) => {
    if (arr?.length > 0) {
      let _text = text
      arr.forEach((item: number) => {
        _text = _text.replace('$', String(item))
      })
      return _text
    }
    return text
  }

  const renderComponent = (locale: MobileLocale) => {
    const TEXT_CONFIGS: any = {
      1: {
        title: locale['mobile.marketing.title.type_1'],
        info: locale['mobile.marketing.info.type_1'],
      },
      2: {
        title: locale['mobile.marketing.title.type_2'],
        info: locale['mobile.marketing.info.type_2'],
      },
      3: {
        title: locale['mobile.marketing.title.type_3'],
        info: locale['mobile.marketing.info.type_3'],
      },
      4: {
        title: locale['mobile.marketing.title.type_4'],
        info: locale['mobile.marketing.info.type_4'],
      },
      5: {
        title: locale['mobile.marketing.title.type_5'],
        info: locale['mobile.marketing.info.type_5'],
      },
      6: {
        title: locale['mobile.marketing.title.type_6'],
        info: locale['mobile.marketing.info.type_6'],
      },
      7: {
        title: locale['mobile.marketing.title.type_7'],
        info: locale['mobile.marketing.info.type_7'],
      },
      8: {
        title: locale['mobile.marketing.title.type_8'],
        info: locale['mobile.marketing.info.type_8'],
      },
      9: {
        title: locale['mobile.marketing.title.type_9'],
        info: locale['mobile.marketing.info.type_9'],
      },
      10: {
        title: locale['mobile.marketing.title.type_10'],
        info: locale['mobile.marketing.info.type_10'],
      },
      11: {
        title: locale['mobile.marketing.title.type_11'],
        info: locale['mobile.marketing.info.type_11'],
      },
      12: {
        title: locale['mobile.marketing.title.type_12'],
        info: locale['mobile.marketing.info.type_12'],
      },
      13: {
        title: locale['mobile.marketing.title.type_13'],
        info: locale['mobile.marketing.info.type_13'],
      },
      14: {
        title: locale['mobile.marketing.title.type_14'],
        info: locale['mobile.marketing.info.type_14'],
      },
      15: {
        title: locale['mobile.marketing.title.type_15'],
        info: locale['mobile.marketing.info.type_15'],
      },
      16: {
        title: locale['mobile.marketing.title.type_16'],
        info: locale['mobile.marketing.info.type_16'],
      },
      17: {
        title: locale['mobile.marketing.title.type_17'],
        info: locale['mobile.marketing.info.type_17'],
      },
      18: {
        title: locale['mobile.marketing.title.type_18'],
        info: locale['mobile.marketing.info.type_18'],
      },
      19: {
        title: locale['mobile.marketing.title.type_19'],
        info: locale['mobile.marketing.info.type_19'],
      },
    }

    const _titleText = () => {
      return title ? title : TEXT_CONFIGS[type].title
    }

    const _infoText = () => {
      return explain
        ? explain
        : replaceArr
        ? _replaceText(replaceArr, TEXT_CONFIGS[type].info)
        : TEXT_CONFIGS[type].info
    }

    const _icon = () => {
      return icon ? icon : ICON_CONFIGS[type]
    }

    return (
      <div className={classNameString} {...other}>
        <div className={styles[`lingxi-marketingCard-header-title`]}>
          <img
            src={_icon()}
            className={styles[`lingxi-marketingCard-header-title-icon`]}
          />
          {_titleText()}
          {countDown ? (
            <div
              className={styles[`lingxi-marketingCard-header-title-countDown`]}
            >
              <div
                className={
                  styles[`lingxi-marketingCard-header-title-countDown-times`]
                }
              >
                {countDown[0]}
              </div>
              :
              <div
                className={
                  styles[`lingxi-marketingCard-header-title-countDown-times`]
                }
              >
                {countDown[1]}
              </div>
              :
              <div
                className={
                  styles[`lingxi-marketingCard-header-title-countDown-times`]
                }
              >
                {countDown[2]}
              </div>
            </div>
          ) : null}
        </div>
        <h3 className={styles[`lingxi-marketingCard-header-info`]}>
          {_infoText()}
        </h3>
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default Header
