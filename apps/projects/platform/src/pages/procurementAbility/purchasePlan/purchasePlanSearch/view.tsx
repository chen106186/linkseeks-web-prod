import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import Table from '../../components/table'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Button, Badge, Space, Typography } from 'antd'
import { OFFTER_INTERNALSTATE_COLOR } from '../../constants'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { getPurchasePurchasePlanAllList, getPurchasePurchasePlanInner } from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const { Text } = Typography

const intl = getIntl()

const PurchasePlanSearch = () => {
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchasePlanNo1' }),
      key: 'purchasePlanNo',
      dataIndex: 'purchasePlanNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/purchasePlan/purchasePlanSearch/detail?id=${record.id}&preview=true`}
            >
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
          <Text>{record.summary}</Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.startTime' }),
      key: 'startTime',
      dataIndex: 'startTime',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text>
            <PlayCircleOutlined style={{ marginRight: 5 }} />
            {formatTimeString(text, 'YYYY-MM-DD')}
          </Text>
          <Text>
            <PoweroffOutlined style={{ marginRight: 5 }} />
            {formatTimeString(record.endTime, 'YYYY-MM-DD')}
          </Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.department' }),
      key: 'department',
      dataIndex: 'department',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.userName' }),
      key: 'userName',
      dataIndex: 'userName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.createTime' }),
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text: any, record: any) => <Text>{formatTimeString(text, 'YYYY-MM-DD')}</Text>,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
      key: 'innerStatus',
      dataIndex: 'innerStatus',
      render: (text: any, record: any) => (
        <Badge status={OFFTER_INTERNALSTATE_COLOR[text]} text={record.innerStatusName} />
      ),
    },
  ]

  return (
    <Table
      schemaType="PURCHASEPLANSERCH_SECHEMA"
      columns={columns}
      effects="purchasePlanNo"
      fetch={getPurchasePurchasePlanAllList}
      interiorStatusFetch={getPurchasePurchasePlanInner}
    />
  )
}
export default PurchasePlanSearch
