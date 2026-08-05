import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import {
  getManageContentInformationFindAllByRecommendLabel,
  getManageMemberInformationFindAllByRecommendLabel,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import { integrationTime } from '@/utils'
import useLink from '@/hooks/useLink'
import styles from './index.module.less'

const { TabPane } = Tabs

const MarketLeft: React.FC = () => {
  const [marketList, setMarketList] = useState<any>([])
  const { mallInfo } = useGlobalConext()
  const { linkPrefix } = useLink()
  const translate = getWebIntl()

  const fnGetMarket = () => {
    const data: any = {
      recommendLabel: '5',
      memberId: mallInfo?.memberId,
      roleId: mallInfo?.memberRoleId,
    }
    const requestApi = mallInfo?.isMemberOperate
      ? getManageMemberInformationFindAllByRecommendLabel
      : getManageContentInformationFindAllByRecommendLabel
    requestApi(data).then((res) => {
      setMarketList(res.data)
    })
  }
  useEffect(() => {
    fnGetMarket()
  }, [])

  return (
    <div className={styles['market-left-warp']}>
      <Tabs defaultActiveKey="1">
        <TabPane tab={<div style={{ fontSize: '20px' }}>{translate('web.resource.mall.hangqingtuijian')}</div>} key="1">
          <ul className={styles['market-left-content-warp']}>
            {marketList.map((item: any) => {
              return (
                <li className={styles['market-left-content']} key={item.id + 'nav'}>
                  <span className={styles['title-hover']}>{item.columnName}</span>
                  <span className={styles['left-time']}>{integrationTime(item.createTime, 'MD')}</span>
                  <a href={linkPrefix(`/info/infoDetail/${item.id}`)} className="all-jump"></a>
                </li>
              )
            })}
          </ul>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default MarketLeft
