import React, { ReactNode, useRef } from 'react'
import { Button, Popconfirm } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { PlayCircleOutlined } from '@ant-design/icons'
import { getCommodityCurrencyGetCurrencyList, postCommodityCurrencyUpdateStatus } from '@apps/apis'

const fetchData = async (params: any) => {
  const res = await getCommodityCurrencyGetCurrencyList(params, { ctlType: 'none' })
  return res.data ? res.data : []
}

const SetCurrency: React.FC = () => {
  const ref = useRef({} as ActionType)

  const confirm = (id: number, record: any) => {
    postCommodityCurrencyUpdateStatus({
      id,
      status: record.status ? false : true,
    }).then(() => {
      ref.current.reload()
    })
  }

  const cancel = () => {
    console.log('cancel')
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '币种ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
    },
    {
      title: '币种中文简称',
      dataIndex: 'name',
      key: 'name',
      searchField: {
        main: true,
      },
    },
    {
      title: '币种代码',
      dataIndex: 'nameEn',
      key: 'nameEn',
      className: 'commonPickColor',
      searchField: 'Input',
    },
    {
      title: '币种符号',
      dataIndex: 'symbol',
      key: 'symbol',
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
            title={`确认要把当前币种从${record.status ? '”有效”' : '”无效”'}状态改为${
              record.status ? '”无效”' : '”有效”'
            }状态？`}
            onConfirm={() => confirm(record.id, record)}
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

export default SetCurrency
