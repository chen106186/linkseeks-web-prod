import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import { getPurchasePurchaseNoticeList } from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import PublicityList from './List'
import styles from './index.module.less'

const { TabPane } = Tabs

const Publicity = () => {
  const { mallInfo } = useGlobalConext()
  const [noticeList, setNoticeList] = useState<any>([])
  const translate = getWebIntl()
  const [loading, setLoading] = useState<boolean>(true)

  /**
   * 获取采购竞价列表
   */
  const fnGetPurchaseList = (type: string) => {
    let data = {
      current: '1',
      pageSize: '8',
      createTime: 'ASC',
      type: type,
    }
    const headers: any = {
      shopId: mallInfo?.id,
    }
    setLoading(true)
    getPurchasePurchaseNoticeList(data, { headers })
      .then((res: any) => {
        setNoticeList(res.data.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const callback = (type: string) => {
    if (type == '0') {
      fnGetPurchaseList('')
    } else {
      fnGetPurchaseList(type)
    }
  }

  useEffect(() => {
    fnGetPurchaseList('')
  }, [])

  return (
    <Tabs defaultActiveKey="0" onChange={callback} className={styles['publicity-warp']}>
      <TabPane tab={translate('web.resource.mall.quanbugongshi')} key="0">
        <PublicityList loading={loading} noticeList={noticeList} />
      </TabPane>
      <TabPane tab={translate('web.resource.mall.xunjiagongshi')} key="1">
        <PublicityList loading={loading} noticeList={noticeList} />
      </TabPane>
      <TabPane tab={translate('web.resource.mall.zhaobiaogongshi')} key="2">
        <PublicityList loading={loading} noticeList={noticeList} />
      </TabPane>
      <TabPane tab={translate('web.resource.mall.jingjiagongshi')} key="3">
        <PublicityList loading={loading} noticeList={noticeList} />
      </TabPane>
    </Tabs>
  )
}

export default Publicity
