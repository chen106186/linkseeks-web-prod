import React, { useState, useEffect, useMemo } from 'react'
import Recommend from '@/components/Recommend'
import { Pagination } from 'antd'
import { getManageContentInformationPageByColumnLabel, getManageMemberInformationPageByColumnLabel } from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useParams } from 'react-router-dom'
import { useGlobalConext } from '@/context/globalProvider'
import HelmetProvider from '@/context/helmetProvider'
import InfoListContent from './infoListContent'
import styles from './index.module.less'

const Index: React.FC = () => {
  const { mallInfo } = useGlobalConext()
  const { id } = useParams()
  const [infoListList, setInfoListList] = useState<any>([])
  const [infoTitle, setInfoTitle] = useState<any>()
  const [current, setCurrent] = useState<any>('1')
  const [pageSize, setPageSize] = useState<any>('10')
  const [totalCount, setTotalCount] = useState<any>('10')
  const translate = getWebIntl()

  const fnGetInfoList = () => {
    const data: any = {
      id: id,
      current: current,
      pageSize: pageSize,
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    }
    const requestApi = mallInfo?.isMemberOperate
      ? getManageMemberInformationPageByColumnLabel
      : getManageContentInformationPageByColumnLabel
    requestApi(data).then((res) => {
      setInfoListList(res.data.data)
      setInfoTitle(res.data.data[0]?.columnName || translate('web.resource.mall.meirihangqing'))
      setTotalCount(res.data.totalCount)
    })
  }

  const fnChangePagintion = (page: any, pageSize: any) => {
    setCurrent(page)
    setPageSize(pageSize)
  }

  useEffect(() => {
    fnGetInfoList()
  }, [current])

  const seoState = useMemo(() => {
    return {
      title: translate('web.resource.mall.zixunliebiao'),
      keyword: translate('web.resource.mall.zixunliebiao'),
      description: translate('web.resource.mall.zixunliebiao'),
    }
  }, [])

  return (
    <HelmetProvider {...seoState}>
      <div className={styles['list-main']}>
        <div className={styles['search-tips']}>
          {translate('web.resource.mall.nindeweizhi')}：{translate('web.resource.mall.hangqingshouye')} &gt; {infoTitle}
        </div>
        <div className={styles['search-content-warp']}>
          <div className={styles['search-content-left']}>
            <div style={{ backgroundColor: '#ffffff' }}>
              <InfoListContent
                infoTitle={infoTitle}
                infoListList={infoListList}
                memberId={mallInfo?.memberId}
              ></InfoListContent>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Pagination
                hideOnSinglePage={true}
                showSizeChanger={false}
                showQuickJumper
                total={totalCount}
                onChange={fnChangePagintion}
              />
            </div>
          </div>
          <div className={styles['search-content-right']}>
            <Recommend />
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default Index
