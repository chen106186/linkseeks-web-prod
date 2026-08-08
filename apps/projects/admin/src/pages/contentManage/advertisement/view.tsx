import React, { useRef } from 'react'
import { Space, Popconfirm, message, Button } from 'antd'
import type { GetManageContentAdvertPageRequest } from '@apps/apis'
import {
  getManageContentAdvertPage,
  postManageContentAdvertDelete,
  postManageContentAdvertUpdateStatus,
} from '@apps/apis'
import { history } from '@linkseeks/router-manager'
import { EyeAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
// import moment from 'moment'
import { formatTimeString } from '@/utils'
import { PlusOutlined } from '@ant-design/icons'
import { ADVERTISE_APP_COLUMN_TYPE, ADVERTISE_WEB_COLUMN_TYPE } from '../utils/utils'
const ALL_TYPE = Object.assign({}, ADVERTISE_WEB_COLUMN_TYPE, ADVERTISE_APP_COLUMN_TYPE)

/** 待上架 */
const PENDING = 1
/** 已上架 */
const IS_UP = 2
/** 已下架 */
const IS_DOWN = 3

const STATUS = ['待上架', '已上架', '已下架']

const AllQuery: React.FC = () => {
  const ref = useRef({} as ActionType)

  const handleUp = async (id: number, status: 2 | 3) => {
    // 该方法是上下架 所以 enableStatus 无用，随意传
    const { code } = await postManageContentAdvertUpdateStatus({ id, shelfStatus: status, enableStatus: 0 })
    if (code === 1000) {
      ref.current.reload()
    }
  }

  const handleDelete = async (id: number) => {
    message.loading('正在删除，请稍等...')
    const { code } = await postManageContentAdvertDelete({ id })
    if (code === 1000) {
      ref.current.reload()
    }
  }

  const columns: RecordColumns<any>[] = [
    { title: 'ID', key: 'id', width: 60, fixed: 'left' },
    {
      title: '标题',
      key: 'title',
      searchField: {
        main: true,
      },
      fixed: 'left',
      render: (text: string, record: any) => (
        <EyeAuthButton url={`/contentManage/advertisement/detail?id=${record.id}&preview=1`}>{text}</EyeAuthButton>
      ),
    },
    {
      title: '栏目',
      key: 'columnType',
      render: (text) => {
        return <div>{ALL_TYPE[text]}</div>
      },
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
              <Button type="link" onClick={() => handleUp(record.id, record.status === IS_UP ? IS_DOWN : IS_UP)}>
                {record.status === PENDING || record.status === IS_DOWN ? '上架' : '下架'}
              </Button>
            </AuthButton>
            {record.status === PENDING ||
              (record.status === IS_DOWN && (
                <>
                  <AuthButton type="custom" code="edit">
                    <Button
                      type="link"
                      onClick={() => history.push(`/contentManage/advertisement/edit?id=${record.id}`)}
                    >
                      编辑
                    </Button>
                  </AuthButton>
                  <AuthButton type="custom" code="delete">
                    <Popconfirm
                      title="确定删除"
                      onConfirm={() => handleDelete(record.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button type="link">删除</Button>
                    </Popconfirm>
                  </AuthButton>
                </>
              ))}
          </Space>
        )
      },
    },
  ]

  const fetchData = async (params: GetManageContentAdvertPageRequest) => {
    const payload = { ...params }
    const { data, code } = await getManageContentAdvertPage(payload)
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
        searchButtons={[
          {
            key: 'add',
            children: '新建',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick() {
              history.push('/contentManage/advertisement/add')
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default AllQuery
