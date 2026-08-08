import React, { useContext, useState } from 'react'
import style from './index.less'
import { Tabs, Row, Col } from 'antd'
import { OrderDetailContext } from '../../context'
import MellowCard from '@/components/MellowCard'
import StatusColors from '../../../components/StatusColors'
import { formatTimeString } from '@/utils'
import themeConfig from '@apps/config/lingxi.theme.config'

export interface OrderPayTabsProps {}

const TabPane = Tabs.TabPane

const TabHeader = ({ dataSource }) => {
  const { setPayResultType, payResultVisible } = useContext(OrderDetailContext)

  return (
    <div>
      <Row justify="space-between" style={{ minWidth: 216 }}>
        <Col>
          <div className={style.fontGray}>支付比例</div>
          <div className={style.bignumber}>{dataSource.payRate}%</div>
        </Col>
        <Col>
          <StatusColors status={dataSource.outerStatusName} text={dataSource.outerStatusName} type="payOut" />
        </Col>
      </Row>
      <Row justify="space-between" align="middle" style={{ width: '100%' }}>
        <Col className={style.smallnumber}>￥{dataSource.payAmount || 0}</Col>
        <Col>
          {dataSource.showView && (
            <a
              onClick={() => {
                setPayResultType('preview')
                payResultVisible.current.setVisible(true)
              }}
            >
              查看
            </a>
          )}
        </Col>
      </Row>
    </div>
  )
}

// 支付方式
const payTextList = ['积分支付', '线上支付', '线下支付', '授信支付', '货到付款']
// 支付渠道
const payChannel = ['积分支付', '支付宝', '微信', '银联', '余额支付', '线下支付线上确认', '授信额度支付', '货到付款']

const OrderPayTabs: React.FC<OrderPayTabsProps> = (props) => {
  const { data } = useContext(OrderDetailContext)
  const [payList, setPaylist] = useState<any[]>([])

  // 简单流程为24
  const processEnum = data.processEnum

  const payments = data.payments.sort((a, b) => a.batchNo - b.batchNo)

  return (
    <Row gutter={24} style={{ marginTop: themeConfig['@margin-md'] }}>
      <Col span={processEnum === 24 ? 12 : 24}>
        <MellowCard bordered={false} fullHeight>
          {/* <Row gutter={24}> */}
          <Tabs defaultActiveKey="1">
            {payments.length &&
              payments.map((v) => (
                <TabPane key={v.paymentId} tab={<TabHeader dataSource={v} />}>
                  <Row>
                    <Col className={style.fontGray} span={4}>
                      支付环节:{' '}
                    </Col>
                    <Col>{v.payNode}</Col>
                  </Row>
                  <Row>
                    <Col className={style.fontGray} span={4}>
                      支付方式:{' '}
                    </Col>
                    <Col>{v.payTypeName}</Col>
                  </Row>
                  <Row>
                    <Col className={style.fontGray} span={4}>
                      支付渠道:{' '}
                    </Col>
                    <Col>{v.payChannelName}</Col>
                  </Row>
                </TabPane>
              ))}
          </Tabs>
          {/* </Row> */}
        </MellowCard>
      </Col>
      {processEnum === 24 && data && (
        <Col span={12}>
          <MellowCard title="发货信息" fullHeight>
            {data.name && (
              <Row className={style['card-list']}>
                <Col span={6}>
                  <p>发货地址: </p>
                </Col>
                <Col>
                  <p>{data.name}</p>
                </Col>
              </Row>
            )}
            {data?.deliverTime && (
              <Row className={style['card-list']}>
                <Col span={6}>
                  <p>发货时间: </p>
                </Col>
                <Col>
                  <p>{data?.deliverTime && formatTimeString(data.deliverTime, 'YYYY-MM-DD')}</p>
                </Col>
              </Row>
            )}
            {data.deliverNo && (
              <Row className={style['card-list']}>
                <Col span={6}>
                  <p>物流单号: </p>
                </Col>
                <Col>
                  <p>
                    <a href={`https://www.kuaidi100.com/chaxun?nu=${data.deliverNo}`} target="_blank">
                      {data.deliverNo}
                    </a>
                  </p>
                </Col>
              </Row>
            )}
            {data.logisticsCompany && (
              <Row className={style['card-list']}>
                <Col span={6}>
                  <p>物流公司: </p>
                </Col>
                <Col>
                  <p>{data.logisticsCompany}</p>
                </Col>
              </Row>
            )}
          </MellowCard>
        </Col>
      )}
    </Row>
  )
}

OrderPayTabs.defaultProps = {}

export default OrderPayTabs
