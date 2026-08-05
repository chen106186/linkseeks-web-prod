import React, { useState, useEffect, useMemo } from 'react'
import Recommend from '@/components/Recommend'
import InfoListContent from './infoListContent'
import { Empty } from 'antd'
import { getManageContentInformationFindAllByCategory, getManageMemberInformationFindAllByCategory } from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import { useParams } from 'react-router-dom'
import HelmetProvider from '@/context/helmetProvider'
import styles from './index.module.less'

const Index: React.FC = () => {
  const { mallInfo } = useGlobalConext()
  const { id } = useParams()
  const translate = getWebIntl()
  const [contentList, setContentList] = useState<any>([])
  const [newObj, setNewObj] = useState<any>({})

  const fnGetInfoList = () => {
    const data: any = {
      id: id,
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    }
    const requestApi = mallInfo?.isMemberOperate
      ? getManageMemberInformationFindAllByCategory
      : getManageContentInformationFindAllByCategory
    requestApi(data).then((res) => {
      setContentList(res.data)
      setNewObj(res.data[0]?.list[0])
    })
  }

  useEffect(() => {
    fnGetInfoList()
  }, [])

  const seoState = useMemo(() => {
    return {
      title: translate('web.resource.mall.fenleisousuo'),
      keyword: translate('web.resource.mall.fenleisousuo'),
      description: translate('web.resource.mall.fenleisousuo'),
    }
  }, [])

  return (
    <HelmetProvider {...seoState}>
      <div className={styles['list-main']}>
        <div className={styles['search-tips']}>
          {translate('web.resource.mall.nindeweizhi')}：{translate('web.resource.mall.fenleishaixuan')}
          &gt; {newObj?.firstCategoryName || ''}
          &gt; {newObj?.secondCategoryName || ''}
          &gt; {newObj?.thirdlyCategoryName || ''}
        </div>
        <div className={styles['search-content-warp']}>
          <ul className={styles['search-content-left']}>
            {contentList.map((item: any) => {
              return (
                <li className={styles['search-content-left-item']} key={item.columnName}>
                  <InfoListContent memberId={mallInfo?.memberId} objMessage={item}></InfoListContent>
                </li>
              )
            })}
            {contentList.length == 0 && (
              <li style={{ padding: '100px 0' }}>
                <Empty description={<div>{translate('web.common.zanwushuju')}</div>} />
              </li>
            )}
          </ul>
          <div className={styles['search-content-right']}>
            <Recommend id={id} hiddenrelated={true} />
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default Index
