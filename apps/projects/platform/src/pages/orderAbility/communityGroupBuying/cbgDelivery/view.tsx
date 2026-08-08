/** 社区团购发货管理查询 */
import React, { Fragment, useState, useRef } from 'react'
import { PageHeaderWrapper, StandardFormTable, AuthButton, Editor } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import {
  getOrderCommunityGroupBuyingExport,
  getOrderCommunityGroupBuyingExportOrder,
  getOrderCommunityGroupBuyingPage,
  postOrderCommunityGroupBuyingCreate,
} from '@apps/apis'
import { Radio, Space } from '@linkseeks/ui'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import {
  Button,
  Cascader,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Spin,
  Table,
  Modal,
} from 'antd'
import { exportFile } from '@apps/utils'
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const LinkData = [
  { key: '0', label: '未配货' },
  { key: '1', label: '配货中' },
  { key: '2', label: '配送中' },
  { key: '3', label: '已送达' },
]

const CbgDelivery: React.FC = () => {
  const ref0 = useRef({} as ActionType)
  const ref1 = useRef({} as ActionType)
  const ref2 = useRef({} as ActionType)
  const ref3 = useRef({} as ActionType)
  const [tabLink, setTabLink] = useState<any[]>(LinkData)
  const [activeKey, setActiveKey] = useState<number>(0)

  const onTabChange = (key) => {
    setActiveKey(parseInt(key))
    if (key === '0') {
      ref0.current.reload()
    } else if (key === '1') {
      ref1.current.reload()
    } else if (key === '1') {
      ref2.current.reload()
    } else {
      ref3.current.reload()
    }
  }

  const handleBatchCreate = () => {
    if (!ref0.current?.getSelectionItems()?.length) {
      message.warning('未选择任何自提点')
      return
    }
    const teamLeaderOrderList = []
    ref0.current?.getSelectionItems().forEach((teamLeader) => {
      teamLeaderOrderList.push({
        cbgTeamLeaderId: teamLeader.cbgTeamLeaderId,
        totalQuantity: teamLeader.totalQuantity,
      })
    })
    const postData = {
      teamLeaderOrderList: teamLeaderOrderList,
    }
    Modal.confirm({
      title: '批量创建发货单',
      content: '是否确认创建发货单',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        postOrderCommunityGroupBuyingCreate(postData).then((res) => {
          if (res.code === 1000) {
            ref0.current.reload()
          }
        })
      },
    })
  }

  const handleCreate = (record) => {
    const postData = {
      teamLeaderOrderList: [
        {
          cbgTeamLeaderId: record.cbgTeamLeaderId,
          totalQuantity: record.totalQuantity,
        },
      ],
    }
    postOrderCommunityGroupBuyingCreate(postData).then((res) => {
      if (res.code === 1000) {
        ref0.current.reload()
      }
    })
  }

  const handleBatchExport = async () => {
    const selected = ref0.current?.getSelectionItems()
    if (!selected?.length) {
      message.warning('未选择任何自提点')
      return
    }

    for (const teamLeader of selected) {
      handleExport(teamLeader)
      await sleep(500)
    }
  }

  const handleExport = (record) => {
    const postData = {
      cbgTeamLeaderId: record.cbgTeamLeaderId,
      totalQuantity: record.totalQuantity,
    }
    exportFile(getOrderCommunityGroupBuyingExport, postData)
  }

  const handleExportOrder = (record) => {
    const postData = {
      deliveryId: record.deliveryId,
    }
    exportFile(getOrderCommunityGroupBuyingExportOrder, postData)
  }

  const columns0: RecordColumns<any>[] = [
    {
      title: '所属自提点',
      key: 'keyword',
      dataIndex: 'keyword',
      searchField: {
        main: true,
      },
      render: (_text, record) => <>{record.cbgPickupPointName}</>,
    },
    {
      title: '自提点收货信息',
      key: 'address',
      dataIndex: 'address',
      searchField: 'Input',
      render: (_text, record) => (
        <>{record.cbgTeamLeaderName + ' ' + record.cbgTeamLeaderPhone + ' ' + record.pickupPointAddress}</>
      ),
    },
    {
      title: '应发件数',
      key: 'totalQuantity',
      dataIndex: 'totalQuantity',
      render: (_text, record) => <>{record.totalQuantity}</>,
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (_text, record) => (
        <Space>
          <AuthButton type="custom" code="export">
            <Popconfirm title="确定要导出清单吗？" okText="是" cancelText="否" onConfirm={() => handleExport(record)}>
              <a>导出清单</a>
            </Popconfirm>
          </AuthButton>
          <AuthButton type="custom" code="create">
            <Popconfirm
              title="确定要导出创建发货单吗？"
              okText="是"
              cancelText="否"
              onConfirm={() => handleCreate(record)}
            >
              <a>创建发货单</a>
            </Popconfirm>
          </AuthButton>
        </Space>
      ),
    },
  ]

  const columns1: RecordColumns<any>[] = [
    {
      title: '发货单号',
      key: 'deliveryNo',
      dataIndex: 'deliveryNo',
      searchField: 'Input',
    },
    {
      title: '配货日期',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (_text, record) => <>{formatTimeString(record.createTime, 'YYYY-MM-DD HH:mm')}</>,
    },
    {
      title: '所属自提点',
      key: 'keyword',
      dataIndex: 'keyword',
      searchField: 'Input',
      render: (_text, record) => <>{record.cbgPickupPointName}</>,
    },
    {
      title: '自提点收货信息',
      key: 'address',
      dataIndex: 'address',
      render: (_text, record) => (
        <>{record.cbgTeamLeaderName + ' ' + record.cbgTeamLeaderPhone + ' ' + record.pickupPointAddress}</>
      ),
    },
    {
      title: '应发件数',
      key: 'totalQuantity',
      dataIndex: 'totalQuantity',
      render: (_text, record) => <>{record.totalQuantity}</>,
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (_text, record) => (
        <Space>
          <AuthButton type="custom" code="detail">
            <Link to={`/orderAbility/communityGroupBuying/cbgDelivery/detail?id=${record.deliveryId}`}>确认配送</Link>
          </AuthButton>
        </Space>
      ),
    },
  ]

  const columns2: RecordColumns<any>[] = [
    {
      title: '发货单号',
      key: 'deliveryNo',
      dataIndex: 'deliveryNo',
      searchField: 'Input',
    },
    {
      title: '配货日期',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (_text, record) => <>{formatTimeString(record.createTime, 'YYYY-MM-DD HH:mm')}</>,
    },
    {
      title: '发货日期',
      key: 'deliveryTime',
      dataIndex: 'deliveryTime',
      render: (_text, record) => <>{formatTimeString(record.deliveryTime, 'YYYY-MM-DD HH:mm')}</>,
    },
    {
      title: '送达日期',
      key: 'receiptTime',
      dataIndex: 'receiptTime',
      render: (_text, record) => <>{formatTimeString(record.receiptTime, 'YYYY-MM-DD HH:mm')}</>,
    },
    {
      title: '所属自提点',
      key: 'keyword',
      dataIndex: 'keyword',
      searchField: 'Input',
      render: (_text, record) => <>{record.cbgPickupPointName}</>,
    },
    {
      title: '自提点收货信息',
      key: 'pickupPointAddress',
      dataIndex: 'pickupPointAddress',
      render: (_text, record) => (
        <>{record.cbgTeamLeaderName + ' ' + record.cbgTeamLeaderPhone + ' ' + record.pickupPointAddress}</>
      ),
    },
    {
      title: '应发件数',
      key: 'totalQuantity',
      dataIndex: 'totalQuantity',
      render: (_text, record) => <>{record.totalQuantity}</>,
    },
    {
      title: '签收件数',
      key: 'totalReceived',
      dataIndex: 'totalReceived',
      render: (_text, record) => <>{record.totalReceived}</>,
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (_text, record) => (
        <Space>
          <AuthButton type="custom" code="export">
            <Popconfirm
              title="确定要打印收货单吗？"
              okText="是"
              cancelText="否"
              onConfirm={() => handleExportOrder(record)}
            >
              <a>打印收货单</a>
            </Popconfirm>
          </AuthButton>
        </Space>
      ),
    },
  ]

  const fetchData = async (params: any) => {
    const { ...arg } = params
    const payload = { ...arg }

    console.log('payload', payload)
    console.log('activeKey', activeKey)

    return new Promise((resolve) => {
      getOrderCommunityGroupBuyingPage({ ...payload, status: activeKey }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  return (
    <PageHeaderWrapper isTabs items={tabLink} onTabChange={(key) => onTabChange(key)}>
      {activeKey === 0 && (
        <StandardFormTable
          columns={columns0}
          autoScrollX
          request={(params) => fetchData(params)}
          rowKey="cbgTeamLeaderId"
          actionRef={ref0}
          isRowSelection
          searchButtons={[
            {
              children: '创建发货单',
              type: 'primary',
              onClick() {
                handleBatchCreate()
              },
              key: 'create',
            },
            {
              children: '导出商品清单',
              type: 'primary',
              onClick() {
                if (!ref0.current?.getSelectionItems()?.length) {
                  message.warning('未选择任何自提点')
                  return
                }
                Modal.confirm({
                  title: '批量导出商品清单',
                  content: '是否确认导出商品清单',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => {
                    handleBatchExport()
                  },
                })
              },
              key: 'export',
            },
          ]}
        />
      )}
      {activeKey === 1 && (
        <StandardFormTable
          columns={columns1}
          autoScrollX
          request={(params) => fetchData(params)}
          rowKey="deliveryId"
          actionRef={ref1}
          isRowSelection
        />
      )}
      {activeKey === 2 && (
        <StandardFormTable
          columns={columns2}
          autoScrollX
          request={(params) => fetchData(params)}
          rowKey="deliveryId"
          actionRef={ref2}
          isRowSelection
        />
      )}
      {activeKey === 3 && (
        <StandardFormTable
          columns={columns2}
          autoScrollX
          request={(params) => fetchData(params)}
          rowKey="deliveryId"
          actionRef={ref3}
          isRowSelection
        />
      )}
    </PageHeaderWrapper>
  )
}
export default CbgDelivery
