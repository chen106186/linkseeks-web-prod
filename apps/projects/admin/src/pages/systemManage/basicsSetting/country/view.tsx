import React, { ReactNode, useRef } from 'react'
import { Button, Popconfirm } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { PlayCircleOutlined } from '@ant-design/icons'
import { getCommodityCountryAreaGetCountryAreaList, postCommodityCountryAreaUpdateStatus } from '@apps/apis'

const fetchData = async (params: any) => {
  const res = await getCommodityCountryAreaGetCountryAreaList(params, { ctlType: 'none' })
  return res.data ? res.data : []
}

const SetNation: React.FC = () => {
  const ref = useRef({} as ActionType)

  const columns: RecordColumns<any>[] = [
    {
      title: '国家地区id',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
    },
    {
      title: '国家地区代码',
      dataIndex: 'code',
      key: 'code',
      searchField: {
        main: true,
      },
    },
    {
      title: '国家地区名称',
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
      title: '电话代码',
      dataIndex: 'telCode',
      key: 'telCode',
    },
    {
      title: '手机号位数',
      dataIndex: 'telLength',
      key: 'telLength',
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
            title={`确认要把当前国家地区从${record.status ? '”有效”' : '”无效”'}状态改为${
              record.status ? '”无效”' : '”有效”'
            }状态？`}
            onConfirm={() => confirm(record.id, record)}
            onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <Button
              type="link"
              onClick={() => handleModify(record)}
              style={{ color: record.status ? '#00A98F' : 'red', paddingLeft: 0 }}
            >
              {record.status ? '有效' : '无效'} <PlayCircleOutlined />
            </Button>
          </Popconfirm>
        )
        return component
      },
    },
  ]

  const confirm = (id: number, record: any) => {
    postCommodityCountryAreaUpdateStatus({
      id,
      status: record.status ? false : true,
    }).then(() => {
      ref.current.reload()
    })
  }

  const cancel = () => {
    console.log('cancel')
  }

  const handleModify = (record: object) => {
    // 通过传入的params字符串判断是修改那种类型的数据
    console.log('执行状态修改', record)
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable actionRef={ref} columns={columns} rowKey="id" request={fetchData} autoScrollX />
    </PageHeaderWrapper>
  )
}

export default SetNation
