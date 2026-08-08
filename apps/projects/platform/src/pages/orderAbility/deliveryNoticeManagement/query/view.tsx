/**
 * 订单能力 - 送货通知单管理 - 送货通知单查询
 * @author: Gavin
 * @description:
 */
import React, { useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card, message, Space, Tag } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table'
import TableOperation from '@/components/TableOperation'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { deliveryNoticeManagementQuerySchema } from './schema'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { getOrderDeliveryNoticeOrderVendorPage, getOrderDeliveryNoticeOrderCreateDeliveryOrder } from '@apps/apis'
import { TAG_STATUS_COLOR, STATUS, STATUS_NAME } from '../../constants/deliveryNotice'
import ToVoidModal, { HandleType } from './components/ToVoidModal'
import { useWebIntl } from '@apps/locales'

const DeliveryNoticeManagementQuery: React.FC = () => {
  const intl = useIntl()

  const ref = useRef<any>({})
  const toVoidModalRef = useRef<HandleType>()
  const formActions = createFormActions()

  const translate = useWebIntl()
  const controllerBtns = <Space></Space>
  const renderOptionButton = (r: any) => {
    const btnAuthOfOperationTextMap = {
      [translate('web.resource.order.shengchengsonghuodan')]: 'add',
      [translate('web.common.biangeng')]: 'edit',
      [translate('web.common.zuofei')]: 'void',
      [translate('web.common.preview')]: 'detail',
    }
    const buttonGroup = {
      [translate('web.resource.order.shengchengsonghuodan')]: [STATUS.HAD_CONFIRM].includes(r.status),
      [translate('web.common.biangeng')]: [STATUS.HAD_CONFIRM].includes(r.status),
      [translate('web.common.zuofei')]: [STATUS.WAIT_CONFIRM, STATUS.WAIT_REVISE, STATUS.HAD_CONFIRM].includes(
        r.status,
      ),
      [translate('web.common.preview')]: true,
    }
    const operationHandler = {
      [translate('web.resource.order.shengchengsonghuodan')]: async () => {
        const { code, message: msg } = await getOrderDeliveryNoticeOrderCreateDeliveryOrder({ id: r.id })
        if (code === 1000) {
          history.push(`/orderAbility/deliveryNoticeManagement/query/add?id=${r.id}`)
        } else {
          msg && message.warning(msg)
        }
      },
      [translate('web.common.biangeng')]: () => {
        const target = r.orderType === 2 ? 'awaitSRM' : 'awaitB2B'
        history.push(`/orderAbility/deliveryNoticeManagement/${target}/edit?id=${r.id}`)
      },
      [translate('web.common.zuofei')]: () => {
        toVoidModalRef.current.show(true, r.id)
      },
      [translate('web.common.preview')]: () => {
        history.push(`/orderAbility/deliveryNoticeManagement/query/detail?id=${r.id}`)
      },
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
      title: translate('web.resource.order.tongzhidanhao'),
      dataIndex: 'noticeNo',
      key: 'noticeNo',
      width: 160,
      render: (text: unknown, record: any) => (
        <EyeAuthButton url={`/orderAbility/deliveryNoticeManagement/query/detail?id=${record.id}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    { title: translate('web.resource.order.tongzhidanzhaiyao'), dataIndex: 'digest', key: 'digest' },
    { title: translate('web.resource.logistics.songhuoriqi'), dataIndex: 'deliveryTime', key: 'deliveryTime' },
    { title: translate('web.resource.order.caigouhuiyuan'), dataIndex: 'memberName', key: 'memberName' },
    { title: translate('web.resource.member.danjushijian'), dataIndex: 'createTime', key: 'createTime' },
    {
      title: translate('web.common.waibuzhuangtai'),
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: any) => (
        <Tag color={TAG_STATUS_COLOR[text]?.color}>
          <span style={{ color: TAG_STATUS_COLOR[text]?.fontColor }}>{STATUS_NAME[text]}</span>
        </Tag>
      ),
    },
    {
      title: translate('web.common.control'),
      dataIndex: '',
      key: 'x',
      align: 'center',
      render: (record) => renderOptionButton(record),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getOrderDeliveryNoticeOrderVendorPage(params).then(({ code, data }) => {
        if (code === 1000) {
          resolve(data)
        }
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
                useStateFilterSearchLinkageEffect($, actions, 'noticeNo', FORM_FILTER_PATH)
              }}
              schema={deliveryNoticeManagementQuerySchema}
            />
          }
        />
      </Card>

      <ToVoidModal ref={toVoidModalRef} onOk={() => ref.current.reloadCurrent()} />
    </PageHeaderWrapper>
  )
}

export default DeliveryNoticeManagementQuery
