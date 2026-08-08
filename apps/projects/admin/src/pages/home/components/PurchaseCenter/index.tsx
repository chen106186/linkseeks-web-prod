import {
  getReportPlatformHomeGetPurchaseList,
  GetReportPlatformHomeGetPurchaseListResponse,
  // getReportPlatformHomeGetPurchaseTally,
  // GetReportPlatformHomeGetPurchaseTallyResponse,
} from '@apps/apis'
import { RightOutlined } from '@ant-design/icons'
import { Col, Row, Card, List } from 'antd'
import React, { useMemo } from 'react'
import { Link } from '@linkseeks/router-core'
import useViewRequest from '../../common/hooks/useViewRequest'
import OrderStatistics from '../Order/statisticsChart'
import styles from './index.less'

// TODO
const PurchaseCenter = () => {
  const { loading, responseData, ref } = useViewRequest<any, any>(() => {}, {})
  const {
    loading: orderStatisticsLoading,
    responseData: orderStatisticsData,
    ref: orderStatisticsRef,
  } = useViewRequest<GetReportPlatformHomeGetPurchaseListResponse, any>(getReportPlatformHomeGetPurchaseList, {})

  const PURCHASE_TALLY_LINKS = {
    待审核采购竞价: '/purchaseManage/purchaseBid/examineSearch',
  }

  return (
    <Row gutter={[24, 12]} style={{ display: 'flex', flexDirection: 'row' }} ref={ref}>
      <Col xxl={6} xl={24} lg={24} md={24} sm={24} xs={24} style={{ display: 'flex', flexDirection: 'column' }}>
        <Card
          headStyle={{ borderBottom: 'none' }}
          title={'待处理采购'}
          bordered={false}
          style={{ height: '100%' }}
          loading={loading}
        >
          <List itemLayout="horizontal" className={styles.sideListBox}>
            {responseData?.todoList.map((row) => {
              return (
                <List.Item
                  key={row.name}
                  actions={[
                    <Link to={PURCHASE_TALLY_LINKS[row?.name]}>
                      查看&nbsp;
                      <RightOutlined />
                    </Link>,
                  ]}
                >
                  <List.Item.Meta title={row.count.toString()} description={row.name} />
                </List.Item>
              )
            })}
          </List>
        </Card>
      </Col>
      <Col xxl={18} xl={24} lg={24} ref={orderStatisticsRef}>
        <OrderStatistics height={158} orderData={orderStatisticsData} loading={orderStatisticsLoading} />
      </Col>
    </Row>
  )
}

export default PurchaseCenter
