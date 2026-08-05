import React, { useRef } from 'react'
import { Space, Tag } from 'antd'
import { EditAuthButton, StandardFormTable, PageHeaderWrapper } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { getManageAppVersionPage } from '@apps/apis'

const getWord = (str: string) => {
  return str.replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '')
}

const AppVersionList: React.FC = () => {
  const ref = useRef({} as ActionType)
  const columns: RecordColumns<any>[] = [
    { title: '版本号', key: 'version' },
    {
      title: '升级类型',
      key: 'type',
      render: (text, record) => {
        return record.type === 1 ? <Tag color="red">强制更新</Tag> : <Tag color="gold">非强制更新</Tag>
      },
    },
    {
      title: '升级内容',
      key: 'content',
      render: (text, record) => {
        return <div style={{ width: '300px', maxHeight: '80px', overflow: 'hidden' }}>{getWord(record.content)}</div>
      },
    },
    {
      title: '发布时间',
      key: 'releaseTime',
      searchField: {
        type: 'DateRange',
        name: ['startDate', 'endDate'],
        placeholder: ['发布开始时间', '发布结束时间'],
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record, index) => {
        return (
          <Space>
            <EditAuthButton>
              {index === 0 && (
                <Link to={`/systemManage/basicBusinessManage/appVersion/edit?id=${record.id}`}>修改</Link>
              )}
            </EditAuthButton>
            <Link to={`/systemManage/basicBusinessManage/appVersion/detail?id=${record.id}&preview=1`}>查看</Link>
          </Space>
        )
      },
    },
  ]

  const fetchData = async (params) => {
    const { data, code } = await getManageAppVersionPage(params)
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
        actionRef={ref}
        columns={columns}
        rowKey="id"
        request={fetchData}
        autoScrollX
        searchButtons={[
          {
            key: 'add',
            type: 'primary',
            icon: <PlusOutlined />,
            children: '新建',
            onClick() {
              history.push('/systemManage/basicBusinessManage/appVersion/add')
            },
          },
        ]}
      />
    </PageHeaderWrapper>
  )
}

export default AppVersionList
