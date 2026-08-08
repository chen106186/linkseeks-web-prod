/**
 * 订单能力 -- 送货计划查询
 * @author: Gavin
 */
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { formatTimeString } from '@/utils'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Space, Tag } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table'
import TableOperation from '@/components/TableOperation'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { deliveryPlanManagementQuerySchema } from './schema'
import { godBtoa, TagStatus } from '../../utils'
import {
  ExternalStateColumn,
  OperationColumn,
  PlannedEndDateColumn,
  PlannedStartDateColumn,
  PlanNumberColumn,
  PlanSummaryColumn,
  SupplyMemberColumn,
} from '../../constants/table-column'
import { getOrderDeliveryPlanBuyerPage } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { useWebIntl } from '@apps/locales'

const tagStatus = new TagStatus()

const DeliveryPlanManagementQuery: React.FC = () => {
  const ref = useRef<any>({})
  const formActions = createFormActions()
  const { pathname } = useLocation()
  const translate = useWebIntl()

  const statusTxt = new Map([
    [1, translate('web.resource.order.daitijiao')],
    [2, translate('web.resource.order.daiqueren')],
    [3, translate('web.resource.order.daixiuding')],
    [4, translate('web.resource.order.yiqueren')],
    [5, translate('web.resource.order.yishanchu')],
  ])

  const renderOptionButton = (record: any) => {
    const btnAuthOfOperationTextMap = {
      [translate('web.common.preview')]: 'detail',
      [translate('web.common.edit')]: 'edit',
    }
    const buttonGroup = {
      [translate('web.common.preview')]: true,
      [translate('web.common.edit')]: record.status === 4,
    }
    const operationHandler = {
      [translate('web.common.preview')]: () =>
        history.push(
          `/orderAbility/deliveryPlanManagement/query/detail?ty=${godBtoa(record.orderType)}&i=${godBtoa(record.id)}`,
        ),
      [translate('web.common.edit')]: () =>
        history.push(
          `/orderAbility/deliveryPlanManagement/query/edit?ty=${godBtoa(record.orderType)}&i=${godBtoa(record.id)}`,
        ),
    }
    return (
      <TableOperation
        buttonTextFieldMap={buttonGroup}
        operationHandler={operationHandler}
        buttonPermissionsMap={btnAuthOfOperationTextMap}
      />
    )
  }
  const columns: ColumnType<unknown>[] = [
    {
      ...PlanNumberColumn,
      dataIndex: 'planNo',
      key: 'planNo',
      // width: 160,
      render: (text: string, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/orderAbility/deliveryPlanManagement/query/detail?ty=${godBtoa(record.orderType)}&i=${godBtoa(
            record.id,
          )}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    { ...PlanSummaryColumn, dataIndex: 'digest', key: 'digest' },
    {
      ...PlannedStartDateColumn,
      dataIndex: 'planStartTime',
      key: 'planStartTime',
      render: (text: string, record: any) => formatTimeString(text, 'YYYY-MM-DD'),
    },
    {
      ...PlannedEndDateColumn,
      dataIndex: 'planEndTime',
      key: 'planEndTime',
      render: (text: string, record: any) => formatTimeString(text, 'YYYY-MM-DD'),
    },
    { ...SupplyMemberColumn, dataIndex: 'memberName', key: 'memberName' },
    {
      ...ExternalStateColumn,
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: any) => {
        const styles = tagStatus.getTagStyle(record.status)
        return (
          <Tag color={styles.bgColor}>
            <span style={{ color: styles.fontColor }}>{statusTxt.get(record.status)}</span>
          </Tag>
        )
      },
    },
    {
      ...OperationColumn,
      dataIndex: '',
      key: '',
      render: (record) => renderOptionButton(record),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getOrderDeliveryPlanBuyerPage(params).then((res) => {
        resolve(res.data)
      })
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          // keepAlive={false}
          currentRef={ref}
          columns={columns}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: unknown) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'planNo', FORM_FILTER_PATH)
              }}
              schema={deliveryPlanManagementQuerySchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default DeliveryPlanManagementQuery
