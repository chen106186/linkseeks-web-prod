/**
 * @Description 最近访问
 */
import React from 'react'
import { history } from '@linkseeks/router-manager'
import { recentVisitLocalStorage } from '@linkseeks/storage'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

const RecentlyVisited: React.FC = () => {
  const recentVisit = recentVisitLocalStorage.getItem()
  const translate = useWebIntl()
  const handleJump = (url: string) => {
    history.push(url)
  }

  return (
    <MellowCard
      title={<div className={styles['recently-title']}>{translate('web.resource.srmHome.zuijinfangwen')}</div>}
      fullHeight
    >
      <div className={styles['recently-list']}>
        {Object.keys(recentVisit).map((item) => {
          const menuName = item.split('.')
          const length = menuName.length
          return (
            item && (
              <div key={item} className={styles['recently-list-item']}>
                <div className={styles['recently-list-item-content']} onClick={() => handleJump(recentVisit[item])}>
                  {menuName[length - 1]}
                </div>
              </div>
            )
          )
        })}
      </div>
    </MellowCard>
  )
}

export default RecentlyVisited
