import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import {
  getManageContentInformationLatest,
  getManageContentInformationMaximumCollect,
  getManageContentInformationMaximumRead,
  getManageMemberInformationLatest,
  getManageMemberInformationMaximumCollect,
  getManageMemberInformationMaximumRead,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import QuotationItem from '../QuotationItem'
import styles from './index.module.less'

const { TabPane } = Tabs

const Quotation: React.FC = () => {
  const { mallInfo } = useGlobalConext()
  const [releaseList, setReleaseList] = useState<Array<any>>([])
  const [readList, setReadList] = useState<Array<any>>([])
  const [collectionList, setCollectionList] = useState<Array<any>>([])
  const translate = getWebIntl()
  /**
   * 获取最新发布数据
   */
  const fnGetNewRelease = () => {
    const requestApi = mallInfo?.isMemberOperate ? getManageMemberInformationLatest : getManageContentInformationLatest
    requestApi({
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    } as any).then((res) => {
      setReleaseList(res.data)
    })
  }
  /**
   * 获取最多阅读数据
   */
  const fnGetMaxRead = () => {
    const requestApi = mallInfo?.isMemberOperate
      ? getManageMemberInformationMaximumRead
      : getManageContentInformationMaximumRead
    requestApi({
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    } as any).then((res) => {
      setReadList(res.data)
    })
  }

  /**
   * 获取最多收藏数据
   */
  const fnGetMaxCollection = () => {
    const requestApi = mallInfo?.isMemberOperate
      ? getManageMemberInformationMaximumCollect
      : getManageContentInformationMaximumCollect
    requestApi({
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    } as any).then((res) => {
      setCollectionList(res.data)
    })
  }

  useEffect(() => {
    fnGetNewRelease() // 获取最新发布数据
    fnGetMaxRead() // 获取最多阅读数据
    fnGetMaxCollection() // 获取最多收藏数据
  }, [])

  return (
    <div className={styles['quotation-main']}>
      <Tabs defaultActiveKey="1">
        <TabPane key="1" tab={<div style={{ fontSize: '20px' }}>{translate('web.resource.mall.zuixinfabu')}</div>}>
          <QuotationItem
            arrList={releaseList}
            title="title"
            time="createTime"
            columnName="columnName"
            frequency="readCount"
          />
        </TabPane>
        <TabPane tab={<div style={{ fontSize: '20px' }}>{translate('web.resource.mall.zuiduoyuedu')}</div>} key="2">
          <QuotationItem arrList={readList} title="title" columnName="columnName" frequency="readCount" />
        </TabPane>
        <TabPane tab={<div style={{ fontSize: '20px' }}>{translate('web.resource.mall.zuiduoshoucang')}</div>} key="3">
          <QuotationItem arrList={collectionList} title="title" columnName="columnName" collectCount="collectCount" />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Quotation
