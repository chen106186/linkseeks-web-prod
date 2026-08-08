import React, { useRef, useState } from 'react'
import { Space, Popconfirm, message } from 'antd'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { COLUMN_CATEGORY } from '@/constants/const/content'
import { EyeAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
// import moment from 'moment'
import { formatTimeString } from '@/utils'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import {
  getManageContentInformationPage,
  postManageContentInformationBatch,
  postManageContentInformationDelete,
  postManageContentInformationUpdateStatus,
} from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'

/** 批量删除 */
const IS_DELETE = 1
/** 批量上架 */
const IS_UP = 2
/** 批量下架 */
const IS_DOWN = 3

const STATUS = ['待上架', '已上架', '已下架']

const AllQuery: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()
  const [batchSumbitLoading, setBatchSubmitLoading] = useState<boolean>(false)

  const columns: RecordColumns<any>[] = [
    { title: 'ID', key: 'id', fixed: 'left', width: 60 },
    {
      title: '栏目分类',
      key: 'type',
      render: (text) => COLUMN_CATEGORY[text],
    },
    {
      title: '栏目',
      key: 'columnName',
      searchField: {
        name: 'columnId',
        type: 'Select',
      },
    },
    {
      title: '标题',
      key: 'title',
      searchField: {
        main: true,
      },
      render: (text: string, record: any) => (
        <EyeAuthButton url={`/contentManage/information/detail?id=${record.id}&preview=1`}>{text}</EyeAuthButton>
      ),
    },
    { title: '分类', key: 'categoryName' },
    { title: '推荐标签', key: 'labelNames' },
    {
      title: '排序',
      key: 'sort',
      sorter: (a, b) => a.sort - b.sort,
    },
    {
      title: '行情资讯标签',
      key: 'newsName',
    },
    {
      title: '发布时间',
      key: 'createTime',
      searchField: {
        type: 'DateRange',
        title: '发布时间',
        name: ['startTime', 'endTime'],
        placeholder: ['开始时间', '结束时间'],
      },
      sorter: (a, b) => a.createTime - b.createTime,
      render: (text) => formatTimeString(text),
    },
    {
      title: '状态',
      key: 'status',
      searchField: {
        type: 'Select',
        valueEnum: [
          { label: '全部', value: '0' },
          { label: '待上架', value: '1' },
          { label: '已上架', value: '2' },
          { label: '已下架', value: '3' },
        ],
      },
      render: (value, record) => {
        return <a>{STATUS[record.status - 1]}</a>
      },
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (value, record) => {
        return (
          <Space>
            <AuthButton type="custom" code="status">
              <a
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                onClick={() => handleUp(record.id, record.status === 2 ? 3 : 2)}
              >
                {record.status === 1 || record.status === 3 ? '上架' : '下架'}
              </a>
            </AuthButton>
            <AuthButton type="custom" code="edit">
              {
                // 待上架 或 已下架 可以修改
                (record.status === 1 || record.status === 3) && (
                  <Link to={`/contentManage/information/detail?id=${record.id}`}>修改</Link>
                )
              }
            </AuthButton>
            <AuthButton type="custom" code="delete">
              {record.status === 1 || record.status === 3 ? (
                <Popconfirm
                  title="确定删除"
                  // eslint-disable-next-line @typescript-eslint/no-use-before-define
                  onConfirm={() => handleDelete(record.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <a>删除</a>
                </Popconfirm>
              ) : null}
            </AuthButton>
          </Space>
        )
      },
    },
  ]

  const handleUp = async (id: number, status: 2 | 3) => {
    // 该方法是上下架 所以 enableStatus 无用，随意传
    const { code } = await postManageContentInformationUpdateStatus({
      id,
      shelfStatus: status,
      enableStatus: 0,
    })
    if (code === 1000) {
      ref.current.reload()
    }
  }

  const handleDelete = async (id: number) => {
    message.loading('正在删除，请稍等...')
    const { code } = await postManageContentInformationDelete({ id })
    if (code === 1000) {
      ref.current.reload()
    }
  }

  const handleBatchAction = async (type: 1 | 2 | 3) => {
    const selectedRowKeys = ref.current.selectionKeys
    if (selectedRowKeys?.length > 0) {
      setBatchSubmitLoading(true)
      try {
        const { code } = await postManageContentInformationBatch({ ids: selectedRowKeys, type })
        if (code === 1000) {
          ref.current.reload()
        }
      } finally {
        setBatchSubmitLoading(false)
      }
    }
  }

  const fetchData = async (params) => {
    const payload = { ...params }
    const { data, code } = await getManageContentInformationPage(payload)
    if (code === 1000) {
      return data
    }
    return {
      totalCount: 0,
      data: [],
    }
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        isRowSelection
        searchSelectMaps={selectData}
        searchButtons={[
          {
            key: 'add',
            children: '新建',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick() {
              history.push(`/contentManage/information/add`)
            },
          },
          {
            key: 'groundingBatch',
            children: '批量上架',
            loading: batchSumbitLoading,
            onClick() {
              handleBatchAction(IS_UP)
            },
          },
          {
            key: 'OffBatch',
            children: '批量下架',
            loading: batchSumbitLoading,
            onClick() {
              handleBatchAction(IS_DOWN)
            },
          },
          {
            key: 'deleteBatch',
            onClick: () => {
              handleBatchAction(IS_DELETE)
            },
            children: '批量删除',
            more: true,
            icon: <DeleteOutlined />,
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default AllQuery
