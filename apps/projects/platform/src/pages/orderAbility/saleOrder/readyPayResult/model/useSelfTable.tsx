import React from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Row, Col } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import StatusColors from '@/components/StatusColors'
import { FieldTimeOutlined } from '@ant-design/icons'
import { Chart, Interval, Coordinate, Legend, View } from 'bizcharts'
import DataSet from '@antv/data-set'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import {
  COLUMNS_ACTION_WIDTH,
  COLUMNS_LARGE_WIDTH,
  COLUMNS_MEDIUM_WIDTH,
  COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
  COLUMNS_SMALL_WIDTH,
} from '@/constants/table'
import { useWebIntl } from '@apps/locales'

// 圆形环状金额显示
const CircleChart = (props) => {
  const { sumPrice = 100, alreadyPay = 10 } = props
  const { DataView } = DataSet
  const intl = useIntl()
  const userData = [
    {
      type: intl.formatMessage({ id: 'saleOrder.zongjine', defaultMessage: '总金额' }),
      value: sumPrice - alreadyPay,
    },
    {
      type: intl.formatMessage({ id: 'saleOrder.yizhifu', defaultMessage: '已支付' }),
      value: alreadyPay,
    },
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

// 待支付订单
export const useSelfTable = () => {
  const intl = useIntl()
  const translate = useWebIntl()

  const { pathname } = useLocation()
  const handleConfirm = async (record) => {
    history.push(`/orderAbility/saleOrder/readyPayResult/edit?id=${record.orderId}`)
  }
  const payOrderColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanhao', defaultMessage: '订单号' }),
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: COLUMNS_MEDIUM_WIDTH,
      render: (text, record) => {
        // 查看订单, 需根据状态显示不同schema
        return (
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`/orderAbility/saleOrder/readyPayResult/detail?id=${record.orderId}`}
          >
            {text}
          </EyeAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanzhaiyao', defaultMessage: '订单摘要' }),
      align: 'left',
      dataIndex: 'digest',
      key: 'digest',
      width: COLUMNS_LARGE_WIDTH,
    },
    {
      title: translate('web.resource.order.versionNo'),
      key: 'versionName',
      dataIndex: 'versionName',
      width: COLUMNS_SMALL_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caigouhuiyuan', defaultMessage: '采购会员' }),
      align: 'left',
      dataIndex: 'memberName',
      key: 'memberName',
      width: COLUMNS_LARGE_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.xiadanshijian', defaultMessage: '下单时间' }),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => (
        <>
          <div>
            <FieldTimeOutlined />
            {formatTimeString(record.createTime)}
          </div>
        </>
      ),
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
    },
    {
      title: `${translate('web.resource.order.zongjine_yizhifu')}(${translate('web.common.currencySymbol')})`,
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => (
        <Row justify="space-between">
          <Col>
            <div>
              <span>{intl.formatMessage({ id: 'saleOrder.zongjine：', defaultMessage: '总金额：' })}</span>
              <span>{text}</span>
            </div>
            <div>
              <span>{intl.formatMessage({ id: 'saleOrder.yizhifu：', defaultMessage: '已支付：' })}</span>
              <span>{record.paidAmount || 0}</span>
            </div>
          </Col>
          <Col style={{ width: 40 }}>
            <CircleChart sumPrice={text} alreadyPay={record.paidAmount} />
          </Col>
        </Row>
      ),
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.yizhifu', defaultMessage: '已支付' }),
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      width: COLUMNS_ACTION_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.dangqianzhifu', defaultMessage: '当前支付' }),
      dataIndex: 'batchNo',
      key: 'batchNo',
      width: COLUMNS_ACTION_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.dingdanleixing', defaultMessage: '订单类型' }),
      dataIndex: 'orderTypeName',
      key: 'orderTypeName',
      width: COLUMNS_MEDIUM_WIDTH,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.waibuzhuangtai', defaultMessage: '外部状态' }),
      dataIndex: 'outerStatus',
      key: 'outerStatus',
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
      render: (text, record) => <StatusColors status={text} type="out" text={record.outerStatusName} />,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.neibuzhuangtai', defaultMessage: '内部状态' }),
      dataIndex: 'innerStatus',
      key: 'innerStatus',
      width: COLUMNS_SLIGHTLY_MEDIUM_WIDTH,
      render: (text, record) => <StatusColors status={text} type="saleInside" text={record.innerStatusName} />,
    },
    {
      title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),
      dataIndex: 'ctl',
      key: 'ctl',
      fixed: 'right',
      width: COLUMNS_ACTION_WIDTH,
      render: (text, record) => (
        <EditAuthButton>
          <Button type="link" onClick={() => handleConfirm(record)}>
            {intl.formatMessage({ id: 'saleOrder.queren', defaultMessage: '确认' })}
          </Button>
        </EditAuthButton>
      ),
    },
  ]

  return {
    columns: payOrderColumns,
  }
}
