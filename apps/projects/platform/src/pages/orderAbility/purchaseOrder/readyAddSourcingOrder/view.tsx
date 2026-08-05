import React from 'react'
import { history } from '@linkseeks/router-manager'
import { Button, Popconfirm, Space, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { EyeAuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import {
  getOrderBuyerCreatePage,
  postOrderBuyerCreateDelete,
  postOrderBuyerCreateDeleteBatch,
  postOrderBuyerCreateSubmit,
  postOrderBuyerCreateSubmitBatch,
} from '@apps/apis'
import { AuthButton, EditAuthButton } from '@apps/components'
import { ORDER_TYPE_SOURCING_PURCHASE } from '@/constants/order'
import { authUrl } from '@apps/domains'
import { useLocation } from '@linkseeks/router-core'
import { useWebIntl } from '@apps/locales'
import StatusColors from '../components/statusColors'
import '../index.less'

const fetchTableData = async (params) => {
  params.orderType = ORDER_TYPE_SOURCING_PURCHASE
  const { data } = await getOrderBuyerCreatePage(params)
  return data
}

/**
 * 待新增寻源采购订单
 * @returns
 */
const ReadyAddSourcingOrder: React.FC = () => {
  const { run: deleteRun } = useHttpRequest(postOrderBuyerCreateDeleteBatch as any)
  const tableRef = StandardFormTable.useTableRef()
  const { run: submitRun } = useHttpRequest(postOrderBuyerCreateSubmitBatch as any)
  const { pathname } = useLocation()
  const translate = useWebIntl()

  const handleSubmit = async (id) => {
    await postOrderBuyerCreateSubmit({ orderId: id })
    tableRef.current.clearSelection()
    tableRef.current.reload()
  }

  const handleDelete = async (id) => {
    await postOrderBuyerCreateDelete({ orderId: id })
    tableRef.current.reload()
  }

  const columns = StandardFormTable.createColumns([
    {
      title: translate('web.resource.order.orderNo'),
      key: 'orderNo',
      searchField: {
        main: true,
      },
      render: (text, record) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`${pathname}/detail?id=${record.orderId}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: translate('web.resource.order.dingdanzhaiyao'),
      key: 'digest',
      searchField: 'Input',
    },
    {
      title: translate('web.resource.order.versionNo'),
      key: 'versionName',
    },
    {
      title: translate('web.resource.member.gongyinghuiyuan'),
      key: 'memberName',
      searchField: 'Input',
    },
    {
      title: translate('web.resource.order.xiadanshijian'),
      key: 'createTime',
    },
    {
      title: translate('web.resource.deal.dingdanzonge'),
      key: 'amount',
    },
    {
      title: translate('web.resource.order.dingdanleixing'),
      key: 'orderTypeName',
    },
    {
      title: translate('web.resource.afterAbility.outerStatus'),
      key: 'outerStatus',
      render: (text, record) => <StatusColors status={text} type="out" text={record.outerStatusName} />,
    },
    {
      title: translate('web.common.neibuzhuangtai'),
      key: 'innerStatus',
      render: (text, record) => <StatusColors status={text} type="inside" text={record.innerStatusName} />,
    },
    {
      title: translate('web.common.control'),
      key: 'option',
      render: (_, record) => (
        <Space>
          <AuthButton type="custom" code="submit">
            <Button type="link" onClick={() => handleSubmit(record.orderId)}>
              {translate('web.common.submit')}
            </Button>
          </AuthButton>
          <EditAuthButton>
            <Button
              type="link"
              onClick={() =>
                history.push(`/orderAbility/purchaseOrder/readyAddSourcingOrder/edit?id=${record.orderId}`)
              }
            >
              {translate('web.common.change')}
            </Button>
          </EditAuthButton>
          <AuthButton type="custom" code="delete">
            <Popconfirm
              title={translate('web.resource.order.shifoushanchugaidingdan')}
              okText={translate('web.common.shi')}
              cancelText={translate('web.common.fou')}
              onConfirm={() => handleDelete(record.orderId)}
            >
              <Button type="link">{translate('web.common.delete')}</Button>
            </Popconfirm>
          </AuthButton>
        </Space>
      ),
    },
  ])

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        actionRef={tableRef}
        columns={columns}
        isRowSelection
        rowKey="orderId"
        request={(params) => fetchTableData(params)}
        searchButtons={[
          {
            icon: <PlusOutlined />,
            children: translate('web.resource.logistics.xinjian'),
            key: 'add',
            type: 'primary',
            onClick: () => {
              history.push('/orderAbility/purchaseOrder/readyAddSourcingOrder/add')
            },
          },
          {
            key: 'batchSubmit',
            children: translate('web.resource.order.piliangtijiao'),
            onClick: async () => {
              if (tableRef.current.selectionItems.length) {
                const { code } = await submitRun(tableRef.current.selectionKeys.map((item) => ({ orderId: item })))
                if (code === 1000) {
                  tableRef.current.reload()
                  tableRef.current.clearSelection()
                }
              } else {
                message.error(translate('web.resource.order.qingxuanzedingdan'))
              }
            },
          },
          {
            key: 'batchDelete',
            children: translate('web.resource.order.piliangshanchu'),
            onClick: async () => {
              // 批量删除
              if (tableRef.current.selectionItems.length) {
                const { code } = await deleteRun(tableRef.current.selectionKeys.map((item) => ({ orderId: item })))
                if (code === 1000) {
                  tableRef.current.reload()
                  tableRef.current.clearSelection()
                }
              } else {
                message.error(translate('web.resource.order.qingxuanzedingdan'))
              }
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default ReadyAddSourcingOrder
