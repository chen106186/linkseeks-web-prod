import React, { useState } from 'react'
import { Tabs, Button } from 'antd'

import level1 from '@/assets/icons/the_first.png'
// import level2 from '@/assets/icons/the_second.png';
// import level3 from '@/assets/icons/the_third.png';
import { priceFormat } from '@/utils/numberFomat'

import TriangleTag from '../triangleTag'
import RankRow from '../rankRow'

import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'

const { TabPane } = Tabs

const intl = getIntl()
interface RankItemDetail {
  dynamic: any
  queryPriceDynamics: any
  signupMembers: any
}

interface RankItemProps {
  onTabChange: (key: string) => void
  detail: RankItemDetail
}

const RankItem: React.FC<RankItemProps> = (props: any) => {
  const { onTabChange, detail } = props
  const { queryPriceDynamics = [], signupMembers = [], dynamic = {} } = detail
  const [showMoreQuery, setShowMoreQuery] = useState<boolean>(false)
  const [showMoreSign, setShowMoreSign] = useState<boolean>(false)

  const queryPriceDynamicsData = showMoreQuery ? [...queryPriceDynamics].splice(0, 10) : queryPriceDynamics
  const signupMembersData = showMoreSign ? [...signupMembers].splice(0, 10) : signupMembers

  return (
    <div className={styles.rank}>
      <div className={styles.rankHeader}>
        <h5>{intl.formatMessage({ id: 'detail.purchase.rankHeader' })}</h5>
        <div className={styles.rankHeaderBox}>
          <img src={level1} alt={`排名1`} />
          <h4>
            <div style={{ display: 'inline-block', position: 'relative', left: '-3%', top: '-5%' }}>
              {dynamic?.memberName && (
                <TriangleTag
                  text={intl.formatMessage({ id: 'detail.purchase.minPrice1' })}
                  wrapStyle={{ backgroundColor: '#EA8000' }}
                  bgcolor="#EA8000"
                  direction="right"
                />
              )}
            </div>
            {dynamic?.memberName}
          </h4>
          <div className={styles.rankHeaderBoxInfo}>
            <div className={styles.rankHeaderBoxInfoChild}>
              {intl.formatMessage({ id: 'detail.purchase.nowMinPrice1' })}：
              <span>
                {dynamic?.minPrice
                  ? `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(dynamic?.minPrice)}`
                  : '-'}
              </span>
            </div>
            <div className={styles.rankHeaderBoxInfoChild}>
              {intl.formatMessage({ id: 'detail.purchase.allowPurchaseCount1' })}：<span>{dynamic?.count ?? '-'}</span>
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultActiveKey="1" onChange={onTabChange}>
        <TabPane tab={intl.formatMessage({ id: 'detail.purchase.offerRank' })} key="1">
          {queryPriceDynamicsData?.map((item) => (
            <RankRow detail={item} key={`queryPriceDynamicsData_${item.id}`} />
          ))}
          {queryPriceDynamics.length > 10 && !showMoreQuery && (
            <Button
              type="link"
              block
              onClick={() => {
                setShowMoreQuery(true)
              }}
            >
              {intl.formatMessage({ id: 'table.purchase.showMore' })}
            </Button>
          )}
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'table.purchase.inviteMemberName' })} key="2">
          {signupMembersData?.map((item) => (
            <RankRow detail={item} key={`signupMembersData_${item.id}`} rowType={2} />
          ))}
          {signupMembers.length > 10 && !showMoreSign && (
            <Button
              type="link"
              block
              onClick={() => {
                setShowMoreSign(true)
              }}
            >
              {intl.formatMessage({ id: 'table.purchase.showMore' })}
            </Button>
          )}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default RankItem
