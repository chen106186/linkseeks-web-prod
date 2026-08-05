import React, { useRef } from 'react'
import { Link, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col, Progress } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import StatusColors from '../../components/statusColors'
import { FieldTimeOutlined } from '@ant-design/icons'
import { Chart, Coordinate, Legend, View, Interval } from 'bizcharts'
// import Interval from 'bizcharts/lib/geometry/Interval'
import DataSet from '@antv/data-set'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'

// 圆形环状金额显示
const CircleChart = (props) => {
  const intl = useIntl()
  const { sumPrice = 100, alreadyPay = 10 } = props
  const { DataView } = DataSet

  const userData = [
    {
      type: intl.formatMessage({ id: 'purchaseOrder.zongjine' }),
      value: sumPrice - alreadyPay || 100,
    },
    { type: intl.formatMessage({ id: 'purchaseOrder.yizhifu' }), value: alreadyPay },
  ]

  const userDv = new DataView()
  userDv.source(userData).transform({
    type: 'percent',
    field: 'value',
    dimension: 'type',
    as: 'percent',
  })
  return (
    <Chart placeholder={false} height={40} autoFit>
      <Legend visible={false} />
      {/* 绘制图形 */}
      <View data={userDv.rows}>
        <Coordinate type="theta" innerRadius={0.75} />
        <Interval position="percent" adjust="stack" color={['type', ['#EEF0F3', '#41CC9E']]} tooltip={false} />
      </View>
    </Chart>
  )
}

// 业务hooks, 待支付订单
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const translate = useWebIntl()

  const { pathname } = useLocation()

  const payOrderColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanhao' }),
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 160,
      render: (text, record) => {
        return (
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`/orderAbility/purchaseOrder/readyPayOrder/detail?id=${record.orderId}`}
          >
            {text}
          </EyeAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanzhaiyao' }),
      dataIndex: 'digest',
      key: 'digest',
      ellipsis: true,
      render: (text, record) => (
        <>
          <div>{text}</div>
          <div>
            <FieldTimeOutlined />
            {formatTimeString(record.createTime)}
          </div>
        </>
      ),
      width: 192,
    },
    {
      title: translate('web.resource.order.versionNo'),
      key: 'versionName',
      dataIndex: 'versionName',
      width: 112,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.gongyinghuiyuan' }),
      align: 'left',
      dataIndex: 'memberName',
      key: 'memberName',
      width: 192,
    },
    {
      title: `${translate('web.resource.order.zongjine_yizhifu')}(${translate('web.common.currencySymbol')})`,
      align: 'left',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => (
        <Row justify="space-between">
          <Col>
            <div>
              <span>{intl.formatMessage({ id: 'purchaseOrder.zongjine' })}：</span>
              <span>{text}</span>
            </div>
            <div>
              <span>{intl.formatMessage({ id: 'purchaseOrder.yizhifu' })}：</span>
              <span>{record.paidAmount || 0}</span>
            </div>
          </Col>
          <Col style={{ width: 40 }}>
            <CircleChart sumPrice={text} alreadyPay={record.paidAmount} />
          </Col>
        </Row>
      ),
      width: 224,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dingdanleixing' }),
      dataIndex: 'orderTypeName',
      key: 'orderTypeName',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.waibuzhuangtai' }),

      dataIndex: 'outerStatus',
      key: 'outerStatus',
      render: (text, record) => <StatusColors status={text} type="out" text={record.outerStatusName} />,
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.neibuzhuangtai' }),
      dataIndex: 'innerStatus',
      key: 'innerStatus',
      width: 192,
      render: (text, record) => <StatusColors status={text} type="inside" text={record.innerStatusName} />,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.dangqianzhi', defaultMessage: ' 当前支付' }),
      dataIndex: 'batchNo',
      key: 'batchNo',
      width: 160,
      render: (text, record) => (
        <>
          <Row justify="space-between">
            <Col>
              {text} / {record.batchCount} {intl.formatMessage({ id: 'purchaseOrder.ci', defaultMessage: '次' })}
            </Col>
          </Row>
          <Progress percent={Number(text / record.batchCount).toFixed(2) * 100} showInfo={false} />
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.caozuo', defaultMessage: '操作' }),
      width: 160,
      dataIndex: 'ctl',
      key: 'ctl',
      fixed: 'right',
      render: (text, record) => (
        <EditAuthButton>
          <Link to={`/orderAbility/purchaseOrder/readyPayOrder/edit?id=${record.orderId}`}>
            {intl.formatMessage({ id: 'purchaseOrder.quzhifu', defaultMessage: '去支付' })}
          </Link>
        </EditAuthButton>
      ),
    },
  ]

  return {
    ref,
    columns: payOrderColumns,
  }
}
