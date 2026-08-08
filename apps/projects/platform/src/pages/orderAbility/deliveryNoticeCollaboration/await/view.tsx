/**
 * 订单能力 - 送货通知单协同 - 待确定送货通知单
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
import { deliveryNoticeCollaborationAwaitSchema } from './schema'
import { getOrderDeliveryNoticeOrderBuyerPage, postOrderDeliveryNoticeOrderConfirm } from '@apps/apis'
import { TAG_STATUS_COLOR, STATUS, STATUS_NAME } from '../../constants/deliveryNotice'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'

const DeliveryNoticeCollaborationAwait: React.FC = () => {
  const ref = useRef<any>({})
  const formActions = createFormActions()
  const translate = useWebIntl()
  const controllerBtns = <Space></Space>
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
      [translate('web.common.queren')]: () => {
        history.push(`/orderAbility/deliveryNoticeCollaboration/await/detail?id=${record.id}&type=CONFIRM`)
      },
      [translate('web.common.preview')]: () => {
        history.push(`/orderAbility/deliveryNoticeCollaboration/await/detail?id=${record.id}`)
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
      render: (text: any, record: any) => (
        <EyeAuthButton url={`/orderAbility/deliveryNoticeCollaboration/await/detail?id=${record.id}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    { title: translate('web.resource.order.tongzhidanzhaiyao'), dataIndex: 'digest', key: 'digest' },
    { title: translate('web.resource.logistics.songhuoriqi'), dataIndex: 'deliveryTime', key: 'deliveryTime' },
    { title: translate('web.resource.member.gongyinghuiyuan'), dataIndex: 'memberName', key: 'memberName' },
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
      getOrderDeliveryNoticeOrderBuyerPage({
        ...params,
        status: STATUS.WAIT_CONFIRM,
      }).then(({ code, data }) => {
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
              schema={deliveryNoticeCollaborationAwaitSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default DeliveryNoticeCollaborationAwait
