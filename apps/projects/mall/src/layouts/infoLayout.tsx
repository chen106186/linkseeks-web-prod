import React, { Fragment, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import InfoHeader from '@/components/InfoHeader'
import InfoMainNav from '@/components/InfoMainNav'
import { useGlobalConext } from '@/context/globalProvider'
import styles from './styles.module.less'

const InfoLayout: React.FC = () => {
  const { mallInfo, mallUrl } = useGlobalConext()

  useEffect(() => {
    if (!import.meta.env.SSR) {
      const body = document.getElementsByTagName('body')[0]
      body.className = `theme-mall-science`
    }
  }, [])

  const getLogo = () => {
    if (mallInfo?.isMemberOperate) {
      return mallInfo.logoUrl
    } else {
      if (mallUrl?.infoPortal) {
        return mallUrl?.infoPortal.logoUrl
      }
      return mallInfo?.logoUrl
    }
  }

  return (
    <Fragment>
      <InfoHeader logo={getLogo()} />
      <InfoMainNav />
      <div className={styles.container}>
        <Outlet />
      </div>
    </Fragment>
  )
}

export default InfoLayout
