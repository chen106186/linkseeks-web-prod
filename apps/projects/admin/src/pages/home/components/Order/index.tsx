import {
  getReportPlatformHomeGetOrderList,
  GetReportPlatformHomeGetOrderListResponse,
  getOrderReportGetPlatformOrder,
  GetOrderReportGetPlatformOrderResponse,
  getAftersalesReportGetPlatformAfterSales,
  GetAftersalesReportGetPlatformAfterSalesResponse,
} from '@apps/apis'
import React, { useMemo } from 'react'
import useViewRequest from '../../common/hooks/useViewRequest'
import { Row, Col, Card, List } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { Link } from '@linkseeks/router-core'
import OrderStatistics from './statisticsChart'
import styles from './index.less'

const OrderContainer = () => {
  const {
    loading: orderLoading,
    responseData: orderResponseData,
    ref,
  } = useViewRequest<GetOrderReportGetPlatformOrderResponse, any>(getOrderReportGetPlatformOrder, {})
  const {
    loading: afterSalesLoading,
    responseData: afterSalesResponseData,
    ref: afterSalesRef,
  } = useViewRequest<GetAftersalesReportGetPlatformAfterSalesResponse, any>(
    getAftersalesReportGetPlatformAfterSales,
    {},
  )
  const {
    loading: orderStatisticsLoading,
    responseData: orderStatisticsData,
    ref: orderStatisticsRef,
  } = useViewRequest<GetReportPlatformHomeGetOrderListResponse, any>(getReportPlatformHomeGetOrderList, {})

  const loading = useMemo(() => orderLoading && afterSalesLoading, [orderLoading, afterSalesLoading])

  const responseData = useMemo(() => {
    return Object.assign({}, orderResponseData, afterSalesResponseData)
  }, [orderResponseData, afterSalesResponseData])

  const renderLoading = () => {
    return [1, 2, 3].map((_item) => {
      return (
        <Col xxl={24} xl={12} lg={12} md={24} sm={24} xs={24} key={_item}>
          <Card loading={true} />
        </Col>
      )
    })
  }

  // const SALE_TALLY_LINKS = {
  //   待确认支付结果订单: '/orderManage/readyConfirmPayList',
  //   待退款: '/afterManage/returnManage/returnPrReturn',
  // }

  const renderChild = () => {
    return (
      responseData &&
      Object.keys(responseData).map((item, key) => {
        const _item = responseData[item]
        return (
          <Col xxl={24} xl={12} lg={12} md={24} sm={24} xs={24} key={item}>
            <Card
              headStyle={{ borderBottom: 'none' }}
              title={item === 'pendingAfterSale' ? '待处理售后' : '待处理交易'}
              bordered={false}
              style={{ height: '100%' }}
              className={key == 1 ? styles.lastCard : ''}
            >
              <List itemLayout="horizontal" className={styles.sideListBox}>
                <List.Item
                  key={_item.name}
                  actions={[
                    <Link to={_item.link}>
                      查看&nbsp;
                      <RightOutlined />
                    </Link>,
                  ]}
                >
                  <List.Item.Meta title={_item.count.toString()} description={_item.name} />
                </List.Item>
              </List>
            </Card>
          </Col>
        )
      })
    )
  }

  return (
    <Row gutter={[24, 12]} style={{ display: 'flex', flexDirection: 'row' }} ref={ref}>
      <Col
        xxl={6}
        xl={24}
        lg={24}
        md={24}
        sm={24}
        xs={24}
        style={{ display: 'flex', flexDirection: 'column' }}
        ref={afterSalesRef}
      >
        <Row style={{ height: '100%' }} gutter={[24, 12]}>
          {(loading && renderLoading()) || renderChild()}
        </Row>
      </Col>
      <Col xxl={18} xl={24} lg={24} ref={orderStatisticsRef}>
        <OrderStatistics orderData={orderStatisticsData} loading={orderStatisticsLoading} title="销售订单统计" />
      </Col>
    </Row>
  )
}

export default OrderContainer
