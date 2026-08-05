import React, { useRef, useCallback, useEffect } from 'react'
import { StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { Space, Button, Typography, Drawer } from 'antd'
import { priceFormat } from '@/utils/numberFomat'

const { Text } = Typography

const QuotationDetailsDrawer: React.FC = (props: any) => {
  const { visible, onClose, schemaType, effects, fetch, quotationDetailsId, number } = props
  const tableRef = useRef({} as ActionType)
  useEffect(() => {
    tableRef.current?.reload && tableRef.current?.reload()
  }, [quotationDetailsId])
  const columns: RecordColumns<any>[] = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'id',
      key: 'id',
      render: (t, r, i) => ++i,
    },
    {
      title: '物料编号/摘要',
      key: 'number',
      dataIndex: 'number',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{text}</Text>
          <Text type="secondary">{record.details}</Text>
        </Space>
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
      title: '采购数量/单位',
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{text}</Text>
          <Text type="secondary">{record.unit}</Text>
        </Space>
      ),
    },
    {
      title: '含税/税率',
      key: 'isTax',
      dataIndex: 'isTax',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <Text type="secondary">{text === 1 ? '是' : '否'}</Text>
          <Text type="secondary">{record.taxRate}%</Text>
        </Space>
      ),
    },
    {
      title: '单价(含税)',
      key: 'unitPrice',
      dataIndex: 'unitPrice',
      render: (text: any) => `¥${priceFormat(text)}`,
    },
    {
      title: '金额（含税）',
      key: 'price',
      dataIndex: 'price',
      render: (text: any) => `¥${priceFormat(text)}`,
    },
  ]

  /** 列表数据 */
  const fetchData = useCallback(
    (params?: any) => {
      return new Promise((resolve, reject) => {
        visible &&
          fetch({ id: quotationDetailsId, number: number, ...params }).then((res) => {
            resolve(res.data)
          })
      })
    },
    [quotationDetailsId, number],
  )

  // 搜索
  const search = (values: any) => {
    tableRef.current.reload(values)
  }

  return (
    <Drawer
      title="报价明细"
      width={1000}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={onClose} type="primary">
            确认
          </Button>
        </div>
      }
    >
      <StandardFormTable
        columns={columns}
        autoScrollX
        rowKey="id"
        actionRef={tableRef}
        request={(params: any) => fetchData(params)}
      />
    </Drawer>
  )
}
export default QuotationDetailsDrawer
