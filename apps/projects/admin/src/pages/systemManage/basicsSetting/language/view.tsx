import React, { ReactNode, useRef } from 'react'
import { Button, Popconfirm } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { PlayCircleOutlined } from '@ant-design/icons'
import { getCommodityLanguageGetLanguagePage, postCommodityLanguageUpdateStatus } from '@apps/apis'

const fetchData = async (params: any) => {
  const res = await getCommodityLanguageGetLanguagePage(params, { ctlType: 'none' })
  return res.data ? res.data : []
}

const SetLanguage: React.FC = () => {
  const ref = useRef({} as ActionType)

  const confirm = (id: number, state: number) => {
    const newState = state ? false : true
    postCommodityLanguageUpdateStatus({ id, status: newState }).then(() => {
      ref.current.reload()
    })
  }

  const cancel = () => {
    console.log('cancel')
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '语言ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '语言名称',
      dataIndex: 'name',
      key: 'name',
      className: 'commonPickColor',
      searchField: 'Input',
    },
    {
      title: '语言代码',
      dataIndex: 'nameEn',
      key: 'nameEn',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      fixed: 'right',
      render: (text: any, record: any) => {
        let component: ReactNode = null
        component = (
          <Popconfirm
            title={`确认要把当前语言从${record.status ? '”有效”' : '”无效”'}状态改为${
              record.status ? '”无效”' : '”有效”'
            }状态？`}
            onConfirm={() => confirm(record.id, record.status)}
            onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <Button type="link" style={{ color: record.status ? '#00A98F' : 'red', paddingLeft: 0 }}>
              {record.status ? '有效' : '无效'} <PlayCircleOutlined />
            </Button>
          </Popconfirm>
        )
        return component
      },
    },
  ]

  return (
    <PageHeaderWrapper>
      <StandardFormTable actionRef={ref} columns={columns} rowKey="id" request={fetchData} autoScrollX />
    </PageHeaderWrapper>
  )
}

export default SetLanguage
