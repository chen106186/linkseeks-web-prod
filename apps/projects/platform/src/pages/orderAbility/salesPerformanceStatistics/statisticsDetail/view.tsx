import React, { useState, useEffect } from 'react'
import { Row, Col, Spin } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { PageHeaderWrapper } from '@apps/components'
import AvatarWrap from '@/components/AvatarWrap'
import { getMemberAbilitySalesChannelInformation } from '@apps/apis'
import BasicInfo from './components/basicInfo'
import StatisticsList from './components/statisticsList'

const MemberFrozen: React.FC<{}> = () => {
  const { id, time } = usePageStatus()
  const [memberInfo, setMemberInfo] = useState<any>({
    name: '',
    title: '',
    position: '',
    roleName: '',
    countryCode: '',
    phone: '',
  })
  const [infoLoading, setInfoLoaading] = useState(false)
  const intl = useIntl()

  const getBasicInfo = () => {
    if (!id) {
      return
    }
    setInfoLoaading(true)
    getMemberAbilitySalesChannelInformation({
      userId: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          setMemberInfo(res.data)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoaading(false)
      })
  }

  useEffect(() => {
    getBasicInfo()
  }, [])

  const anchorsArr = [
    {
      key: 'basicInfo',
      label: intl.formatMessage({ id: 'salesPerformanceStatistics.basicInfo' }),
    },
    {
      key: 'membershipStatistics',
      label: intl.formatMessage({
        id: 'salesPerformanceStatistics.membershipStatistics',
      }),
    },
    {
      key: 'CommodityStatistics',
      label: intl.formatMessage({
        id: 'salesPerformanceStatistics.CommodityStatistics',
      }),
    },
  ].filter(Boolean)

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        title={
          <AvatarWrap
            info={{
              name: memberInfo?.name,
            }}
          />
        }
        items={anchorsArr}
      >
        <Row gutter={[16, 16]}>
          {/* 基本信息 */}
          <Col span={24}>
            <div id="basicInfo">
              <BasicInfo dataSource={memberInfo} />
            </div>
          </Col>

          {/* 查看下级会员统计信息 */}
          <Col span={24}>
            <div id="membershipStatistics">
              <StatisticsList id={Number(id)} time={time} searchType="membership" />
            </div>
          </Col>

          {/* 查看商品统计信息 */}
          <Col span={24}>
            <div id="CommodityStatistics">
              <StatisticsList id={Number(id)} time={time} searchType="commodity" />
            </div>
          </Col>
        </Row>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default MemberFrozen
