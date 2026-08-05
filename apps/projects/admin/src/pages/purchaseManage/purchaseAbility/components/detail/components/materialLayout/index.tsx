import React, { useRef, useState } from 'react'
import { Card } from '@linkseeks/ui'
import { EyeAuthButton, StandardFormTable } from '@apps/components'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import DetailDrawer from '../../../detailDrawer'

export interface IPROPS {
  id?: number
  number?: number
  fetch?: () => Promise<unknown>
}

const MaterialLayout: React.FC<IPROPS> = (props: any) => {
  const { id, number, fetch } = props
  const currentRef = useRef({} as ActionType)
  const [visible, setVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any>([])

  const handleClick = (item: any) => {
    setDataSource([
      {
        linkTitle: '基本信息',
        linkContent: [
          {
            label: '物料编号',
            content: item.number,
          },
          {
            label: '物料名称',
            content: item.name,
          },
          {
            label: '规格型号',
            content: item.model,
          },
          {
            label: '品类',
            content: item.category,
          },
          {
            label: '品牌',
            content: item.brand,
          },
        ],
      },
      {
        linkTitle: '采购数量',
        linkContent: [
          {
            label: '单位',
            content: item.unit,
          },
          {
            label: '采购数量',
            content: item.purchaseCount,
          },
        ],
      },
      {
        linkTitle: '附件',
        linkContent: [
          {
            label: '附件',
            file: item.urls ? true : false,
            content: item.urls,
          },
        ],
      },
    ])
    setVisible(true)
  }
  const columns = [
    {
      title: '物料编号',
      key: 'number',
      dataIndex: 'number',
    },
    {
      title: '物料名称',
      key: 'name',
      dataIndex: 'name',
      render: (text: any, record: any) => (
        <EyeAuthButton type="button" handleClick={() => handleClick(record)}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '规格型号',
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: '品类',
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: '品牌',
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: '采购数量',
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
    },
  ]

  const fetchTableData = (params: any) => {
    return new Promise((resolve) => {
      fetch({ id, number, ...params }).then((res: any) => {
        resolve(res.data)
      })
    })
  }

  return (
    <Card id="materialLayout" title="采购物料">
      <StandardFormTable
        columns={columns}
        autoScrollX
        rowKey="id"
        actionRef={currentRef}
        request={(params: any) => fetchTableData(params)}
      />
      <DetailDrawer title="物料信息" visible={visible} dataSource={dataSource} onCalcel={() => setVisible(false)} />
    </Card>
  )
}
export default MaterialLayout
