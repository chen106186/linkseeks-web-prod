import React, { useState, useEffect, useMemo } from 'react'
import Recommend from '@/components/Recommend'
import { Pagination } from 'antd'
import { getManageContentInformationSearch, getManageMemberInformationSearch } from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useLocation } from 'react-router-dom'
import { useGlobalConext } from '@/context/globalProvider'
import HelmetProvider from '@/context/helmetProvider'
import ResultLeft from './ResultLeft'
import styles from './index.module.less'

const Index: React.FC = () => {
  const { mallInfo } = useGlobalConext()
  const { search } = useLocation()

  const fnGetUrlPar = () => {
    const patchName = search || ''
    let patchNameArr = patchName.split('=')
    return decodeURIComponent(patchNameArr[patchNameArr.length - 1])
  }

  const searchText = fnGetUrlPar()
  const translate = getWebIntl()

  const [searchList, setSearchList] = useState<any>([])
  const [totalCount, setTotalCount] = useState<any>(6)
  const [current, setCurrent] = useState<any>(1)
  const [pageSize, setPageSize] = useState<any>(10)

  const fnGetSearchList = () => {
    const data: any = {
      keyword: searchText,
      current: current,
      pageSize: pageSize,
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    }
    const requestApi = mallInfo?.isMemberOperate ? getManageMemberInformationSearch : getManageContentInformationSearch
    requestApi(data).then((res) => {
      setSearchList(res.data.data)
      setTotalCount(res.data.totalCount)
    })
  }

  const fnChangePagintion = (page: number, pageSize: number) => {
    setPageSize(pageSize)
    setCurrent(page)
  }

  useEffect(() => {
    fnGetSearchList()
  }, [current, search])

  const seoState = useMemo(() => {
    return {
      title: translate('web.resource.mall.sousuojieguo'),
      keyword: translate('web.resource.mall.sousuojieguo'),
      description: translate('web.resource.mall.sousuojieguo'),
    }
  }, [])

  return (
    <HelmetProvider {...seoState}>
      <div className={styles['search-main']}>
        <div className={styles['search-tips']}>
          {translate('web.resource.mall.nindeweizhi')}：{translate('web.resource.marketing.hangqingzixun')}
          &gt;
          {translate('web.resource.mall.sousuojieguo')}
        </div>
        <div className={styles['search-content-warp']}>
          <div className={styles['search-content-left']}>
            <div style={{ backgroundColor: '#ffffff' }}>
              <ResultLeft memberId={mallInfo?.memberId} searchList={searchList} searchText={searchText}></ResultLeft>
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
