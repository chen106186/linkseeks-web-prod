/**
 * 订单能力 - 送货计划协同 - 待确认送货计划
 * @author: Gavin
 * @description:
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
import { deliveryPlanCollaborationAwaitSchema } from './schema'
import { godBtoa, TagStatus } from '../../utils'
import {
  ExternalStateColumn,
  OperationColumn,
  PlannedEndDateColumn,
  PlannedStartDateColumn,
  PlanNumberColumn,
  PlanSummaryColumn,
  PurchasingMemberColumn,
} from '../../constants/table-column'
import { getOrderDeliveryPlanVendorPage } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { useWebIntl } from '@apps/locales'
const tagStatus = new TagStatus()

const DeliveryPlanCollaborationAwait: React.FC = () => {
  const ref = useRef<any>({})
  const formActions = createFormActions()
  const { pathname } = useLocation()
  const controllerBtns = <Space></Space>
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
      [translate('web.common.queren')]: 'confirm',
      [translate('web.common.preview')]: 'detail',
    }
    const buttonGroup = {
      [translate('web.common.queren')]: true,
      [translate('web.common.preview')]: true,
    }
    const operationHandler = {
      [translate('web.common.queren')]: () =>
        history.push(
          `/orderAbility/deliveryPlanCollaboration/await/detail?ty=${godBtoa(record.orderType)}&i=${godBtoa(
            record.id,
          )}`,
        ),
      [translate('web.common.preview')]: () =>
        history.push(
          `/orderAbility/deliveryPlanCollaboration/await/detail?ty=${godBtoa(record.orderType)}&i=${godBtoa(
            record.id,
          )}`,
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
      render: (text: unknown, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/orderAbility/deliveryPlanCollaboration/await/detail?ty=${godBtoa(record.orderType)}&i=${godBtoa(
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
    { ...PurchasingMemberColumn, dataIndex: 'memberName', key: 'memberName' },
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
      getOrderDeliveryPlanVendorPage({
        ...params,
        status: 1,
      }).then((res: any) => {
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
              expressionScope={{
                controllerBtns,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'planCode', FORM_FILTER_PATH)
              }}
              schema={deliveryPlanCollaborationAwaitSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default DeliveryPlanCollaborationAwait
