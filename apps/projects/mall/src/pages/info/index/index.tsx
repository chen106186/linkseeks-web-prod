import React, { useState, useEffect, useMemo } from 'react'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import { Spin } from 'antd'
import { getManageContentInformationInformationColumn, getManageMemberInformationInformationColumn } from '@apps/apis'
import HelmetProvider from '@/context/helmetProvider'
import { useLoaderData } from 'react-router-dom'
import { InfoHomeLoaderReturn } from '@/loaders/infoHomeLoader'
import { LAYOUT_TYPE } from '@/types/global'
import Banner from './components/Banner'
import Quotation from './components/Quotation'
import Market from './components/Market'
import Hotspot from './components/Hotspot'
import styles from './index.module.less'

const Index: React.FC = () => {
  const { seoInfo, ownInfo } = useLoaderData() as InfoHomeLoaderReturn
  const translate = getWebIntl()
  const { mallInfo, layoutType } = useGlobalConext()
  const [hotspotList, setHotspotList] = useState<any>([])
  const [load, setLoad] = useState(true)

  const fnGetHotspot = () => {
    setLoad(true)
    const requestApi = mallInfo?.isMemberOperate
      ? getManageMemberInformationInformationColumn
      : getManageContentInformationInformationColumn
    requestApi({ memberId: mallInfo?.memberId, roleId: mallInfo?.memberRoleId } as any).then((res) => {
      setHotspotList(res.data)
      setLoad(false)
    })
  }

  useEffect(() => {
    fnGetHotspot()
  }, [])

  const seoState = useMemo(() => {
    if (layoutType === LAYOUT_TYPE.own) {
      if (ownInfo && ownInfo.informationUs) {
        return {
          title: ownInfo.informationUs.title,
          description: ownInfo.informationUs.description,
          keyword: ownInfo.informationUs.keywords,
        }
      }
    } else {
      if (seoInfo && seoInfo.title) {
        return {
          title: seoInfo.title,
          description: seoInfo.description,
          keyword: seoInfo.keywords,
        }
      }
    }

    return {
      title: translate('web.resource.mall.nav-info'),
      keyword: translate('web.resource.mall.nav-info'),
      description: translate('web.resource.mall.nav-info'),
    }
  }, [])

  return (
    <HelmetProvider {...seoState}>
      <div className={styles['main']}>
        <Spin tip={translate('web.common.loading') + '...'} spinning={load}>
          <Banner></Banner>
          <Quotation></Quotation>
          <Market></Market>
          {hotspotList.map((item: any) => {
            return (
              <Hotspot
                key={item.columnId}
                hotspotTitle={item.columnName}
                arrList={item.list}
                hotspotId={item.columnId}
              />
            )
          })}
        </Spin>
      </div>
    </HelmetProvider>
  )
}

export default Index
