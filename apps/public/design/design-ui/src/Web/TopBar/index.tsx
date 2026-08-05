import React from 'react'
import { EnvironmentOutlined } from '@ant-design/icons'
import cx from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { GlobalLocale } from '../../locale/types/global'

interface LinkItem {
  link: string
  name: string
}

interface TopBarPropsType {
  langComponent?: React.ReactNode
  shopname?: string
  city?: string
  /**
   * 禁止跳转
   */
  linkdisable?: boolean
  linkList?: LinkItem[]
}

const TopBar: React.FC<TopBarPropsType> = (props) => {
  const renderComponent = (locale: GlobalLocale) => {
    const defaultLinkList = [
      {
        link: '/user/login',
        name: locale['topbar.login'],
      },
      {
        link: '/user/register',
        name: locale['topbar.register'],
      },
      {
        link: '/home',
        name: locale['topbar.member.center'],
      },
      {
        link: '/',
        name: locale['topbar.message'],
      },
      {
        link: '/',
        name: locale['topbar.customer.service'],
      },
    ]

    const {
      langComponent,
      shopname = '',
      city = '',
      linkList = defaultLinkList,
    } = props
    console.log(linkList, 'linkList')

    return (
      <div className={styles['topbar']}>
        <div className={styles['topbar_container']}>
          <ul className={cx(styles['topbar_menu'], styles['left'])}>
            <li
              className={cx(styles['topbar_menu_item'], styles['pad_left_0'])}
            >
              <span>{shopname}</span>
            </li>
            <li className={styles['topbar_menu_item']}>
              <EnvironmentOutlined className={styles.icon} />
              <span>{city}</span>
            </li>
          </ul>
          <ul className={cx(styles['topbar_menu'], styles['right'])}>
            {linkList.map((item, index) => (
              <li
                className={styles['topbar_menu_item']}
                key={`topbar_menu_item_${index}`}
              >
                <span>{item.name}</span>
              </li>
            ))}
            {langComponent && (
              <li className={cx(styles['topbar_menu_item'], styles['nopad'])}>
                {langComponent}
              </li>
            )}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="global">{renderComponent}</LocaleReceiver>
  )
}

export default TopBar
