import React, { useRef } from 'react'
import { Dropdown, Menu, Space, Popconfirm, Modal } from 'antd'
import { AuthButton, PageHeaderWrapper, StandardFormTable, EyeAuthButton } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import { tagColorStyle, ANNOUNCE_COLUMN_TYPE, transfer2Options } from '../utils/utils'
import { formatTimeString } from '@/utils'

import {
  getManageContentNoticePage,
  postManageContentNoticeDelete,
  postManageContentNoticeUpdateStatus,
} from '@apps/apis'
import useColumns from './hooks/useColumns'

const ALL = [{ label: '栏目（全部）', value: 0 }]
const COLUMNSOPTIONS = ALL.concat(transfer2Options(ANNOUNCE_COLUMN_TYPE))

const Announcements: React.FC = () => {
  const ref = useRef({} as ActionType)
  const { columnOptions } = useColumns()
  // 修改状态
  const handleUpdateStatus = (id, status) => {
    // 该方法是上下架 所以 enableStatus 无用，随意传
    postManageContentNoticeUpdateStatus({ id: id, shelfStatus: status, enableStatus: 0 }).then(() => {
      ref.current.reload()
    })
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确定要执行这个操作？',
      onOk: () => {
        postManageContentNoticeDelete({ id: id }).then(() => {
          ref.current.reload()
        })
      },
    })
  }

  const fetchData = async (params: any) => {
    const { sourceDate, ...rest } = params
    const payload = { ...rest }

    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      payload.startTime = formatTimeString(+startDate)
      payload.endTime = formatTimeString(+endDate)
    }
    const res = await getManageContentNoticePage(params)
    return res.data
  }

  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'id',
      fixed: 'left',
      width: 60,
    },
    {
      title: '栏目',
      key: 'columnType',
      searchField: {
        type: 'Select',
        valueEnum: columnOptions,
      },
      render: (text) => {
        return <div>{ANNOUNCE_COLUMN_TYPE[text]}</div>
      },
    },
    {
      title: '标题',
      key: 'title',
      searchField: {
        main: true,
        title: '标题名称',
      },
      render: (text: string, record: any) => (
        <EyeAuthButton url={`/contentManage/announcements/detail?id=${record.id}&preview=1`}>{text}</EyeAuthButton>
      ),
    },
    {
      title: '发布时间',
      key: 'createTime',
      searchField: {
        type: 'DateSelect',
        name: 'sourceDate',
      },
      render: (text) => formatTimeString(text),
    },
    {
      title: '状态',
      key: 'status',
      searchField: {
        type: 'Select',
        valueEnum: [
          { label: '状态（全部）', value: '0' },
          { label: '待上架', value: '1' },
          { label: '已上架', value: '2' },
          { label: '已下架', value: '3' },
        ],
      },
      render: (text, record) => {
        const STATUSMAP = {
          '1': '待上架',
          '2': '已上架',
          '3': '已下架',
        }
        return <span style={{ ...tagColorStyle[record.status], padding: '3px 5px' }}>{STATUSMAP[record.status]}</span>
      },
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (val, record) => {
        const status = ['', '上架', '下架', '上架']
        const canModify = [1, 3]
        const menu = (
          <Menu>
            <AuthButton type="custom" code="edit">
              <Menu.Item>
                <Link to={`/contentManage/announcements/detail?id=${record.id}`}>编辑</Link>
              </Menu.Item>
            </AuthButton>
            <AuthButton type="custom" code="delete">
              <Menu.Item onClick={() => handleDelete(record.id)}>
                <a>删除</a>
              </Menu.Item>
            </AuthButton>
          </Menu>
        )
        return (
          <Space>
            {/* 这里反向操作， 上架的对应的是下架， 待上架，下架对应的是上架 */}
            <AuthButton type="custom" code="status">
              <Popconfirm
                title="确定要执行这个操作吗"
                onConfirm={() => handleUpdateStatus(record.id, status[record.status] == '上架' ? 2 : 3)}
                okText="是"
                cancelText="否"
              >
                <a href="#">{status[record.status]}</a>
              </Popconfirm>
            </AuthButton>
            {/* // 只有待上架， 已下架架才有 修改和删除 */}
            {canModify.includes(record.status) ? (
              <Dropdown overlay={menu}>
                <a>
                  更多 <DownOutlined />
                </a>
              </Dropdown>
            ) : null}
          </Space>
        )
      },
    },
  ]

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
              history.push(`/contentManage/announcements/add`)
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default Announcements
