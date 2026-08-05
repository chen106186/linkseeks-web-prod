import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import Table from '../../components/table'
import { ColumnType } from 'antd/lib/table/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { formatTimeString } from '@/utils'
import { Badge, Space, Typography } from 'antd'
import { OFFTER_INTERNALSTATE_COLOR } from '../../constants'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { getPurchaseNeedPlanAllList, getPurchaseNeedPlanInner } from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const { Text } = Typography
const intl = getIntl()
const DemandPlanSearch = () => {
  console.log('待新增采购需求单')
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.purchasePlanNo' }),
      key: 'needPlanNo',
      dataIndex: 'needPlanNo',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <DetailAuthButton>
            <EyeAuthButton
              type={AuthUrl('detail') ? 'link' : 'button'}
              url={`/procurementAbility/demandPlan/demandPlanSearch/detail?id=${record.id}&preview=true`}
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
      title: intl.formatMessage({ id: 'detail.purchase.operate' }),
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
      schemaType="DEMANDPLANSERCH_SECHEMA"
      columns={columns}
      effects="needPlanNo"
      fetch={getPurchaseNeedPlanAllList}
      interiorStatusFetch={getPurchaseNeedPlanInner}
    />
  )
}
export default DemandPlanSearch
