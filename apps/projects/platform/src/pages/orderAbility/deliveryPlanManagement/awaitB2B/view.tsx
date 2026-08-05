/**
 * 订单能力 -- 待提交送货计划 B2B
 * @author: Gavin
 * @description: 与SRM内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card, Modal, Space, Tag } from 'antd'
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table'
import TableOperation from '@/components/TableOperation'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { deliveryPlanManagementAwaitB2BSchema } from './schema'
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
import { formatTimeString } from '@/utils'
import { getOrderDeliveryPlanBuyerPage, postOrderDeliveryPlanDelete, postOrderDeliveryPlanSubmit } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'

// 外部状态1-待提交 2-已确认
const STATUS = 2
// 订单类型1-B2B 2-SRM
const ORDER_TYPE = 1
const tagStatus = new TagStatus()

const DeliveryPlanManagementAwaitB2B: React.FC = () => {
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

  const handleDelete = (id: number) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: <span>{translate('web.common.confirmDelete')}</span>,
      okText: translate('web.common.queren'),
      cancelText: translate('web.common.cancel'),
      onOk() {
        postOrderDeliveryPlanDelete({ id }).then((res: any) => {
          if (res.code === 1000) ref.current.reloadCurrent()
        })
      },
      onCancel() {},
    })
  }

  const handleSubmit = (id: number) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: <span>{translate('web.common.confirmSubmit')}</span>,
      okText: translate('web.common.queren'),
      cancelText: translate('web.common.cancel'),
      onOk() {
        postOrderDeliveryPlanSubmit({ id }).then((res: any) => {
          if (res.code === 1000) ref.current.reloadCurrent()
        })
      },
      onCancel() {},
    })
  }

  const controllerBtns = (
    <Space>
      <AddAuthButton>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push(`/orderAbility/deliveryPlanManagement/awaitB2B/add`)}
        >
          {translate('web.common.add')}
        </Button>
      </AddAuthButton>
    </Space>
  )
  const renderOptionButton = (record: any) => {
    const btnAuthOfOperationTextMap = {
      [translate('web.common.submit')]: 'submit',
      [translate('web.common.edit')]: 'edit',
      [translate('web.common.delete')]: 'delete',
      [translate('web.common.preview')]: 'detail',
    }
    const buttonGroup = {
      [translate('web.common.submit')]: record.status <= 1,
      [translate('web.common.edit')]: record.status === 1 || record.status === 3,
      [translate('web.common.delete')]: record.status <= 1,
      [translate('web.common.preview')]: true,
    }
    const operationHandler = {
      [translate('web.common.submit')]: () => handleSubmit(record.id),
      [translate('web.common.edit')]: () =>
        history.push(`/orderAbility/deliveryPlanManagement/awaitB2B/edit?i=${godBtoa(record.id)}`),
      [translate('web.common.delete')]: () => handleDelete(record.id),
      [translate('web.common.preview')]: () =>
        history.push(`/orderAbility/deliveryPlanManagement/awaitB2B/detail?i=${godBtoa(record.id)}`),
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
      render: (text: unknown, record: any) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/orderAbility/deliveryPlanManagement/awaitB2B/detail?i=${godBtoa(record.id)}`}
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
      align: 'center',
      render: (record) => renderOptionButton(record),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getOrderDeliveryPlanBuyerPage({
        ...params,
        status: STATUS,
        orderType: ORDER_TYPE,
      }).then((res) => {
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
                useStateFilterSearchLinkageEffect($, actions, 'planNo', FORM_FILTER_PATH)
              }}
              schema={deliveryPlanManagementAwaitB2BSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default DeliveryPlanManagementAwaitB2B
