import React, { useMemo } from 'react'
import styles from './index.less'
import menu_zh from '@/locales/zh-CN/menu'
import { Tooltip } from 'antd'
import { Link, getCurrentRouter } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { recentVisitLocalStorage } from '@linkseeks/storage'
import { authService } from '@apps/services'
interface Iprops {}

const RecentVisit: React.FC<Iprops> = () => {
  const intl = useIntl()
  const recentVisit = recentVisitLocalStorage.getItem()
  const authList = useMemo(() => authService.getAuthList(), [])

  return (
    <div className={styles.recentVisit}>
      <div className={styles.header}>
        <div className={styles.title}>{intl.formatMessage({ id: 'home.recentVisit.title' })}</div>
      </div>
      <div className={styles.body}>
        {Object.keys(recentVisit).map((item) => {
          const url = recentVisit[item]
          const currentRouter = getCurrentRouter(url)
          const menuName = item.split('.')
          const length = menuName.length
          const name = currentRouter?.title || menuName[length - 1]
          return (
            item && (
              <Tooltip key={item} placement="top" title={name}>
                <div className={styles.item}>
                  <Link key={item} to={recentVisit[item]}>
                    {name}
                  </Link>
                </div>
              </Tooltip>
            )
          )
        })}
      </div>
    </div>
  )
}

export default RecentVisit
