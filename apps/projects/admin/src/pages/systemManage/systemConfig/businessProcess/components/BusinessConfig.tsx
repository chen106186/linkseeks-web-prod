import { Button, Table, Space } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { getEngineProcessRuleConfigGetRuleEngineSelectType } from '@apps/apis'
import CreateDrawer, { HandleType } from './CreateDrawer'
import { BUSINESS_FIELD_TYPE } from '../const'

interface DeliveryGoodTableModalProps {
  onChange?: (value) => void
  disabled?: boolean
  value?: any
  title?: string
}

function BusinessConfig(props: DeliveryGoodTableModalProps) {
  const { onChange, value, disabled } = props
  const [tableData, setTableData] = useState<any>([])
  const [contentTypeMap, setContentTypeMap] = useState<Record<string, string>>()

  const fetchContentType = async () => {
    const res = await getEngineProcessRuleConfigGetRuleEngineSelectType()
    if (res.code === 1000 && res.data.length > 0) {
      const result: Record<string, string> = {}
      for (const item of res.data) {
        result[item.key] = item.value
      }
      setContentTypeMap(result)
    }
  }

  useEffect(() => {
    fetchContentType()
  }, [])
  const ref = useRef<HandleType>()

  const handleSubmit = useCallback(
    (record) => {
      const newTableData = [...tableData]
      const i = newTableData.findIndex((item) => item.recordId === record.recordId)
      if (i === -1) {
        newTableData.push(record)
      } else {
        newTableData[i] = record
      }
      setTableData(newTableData)
      onChange?.(newTableData)
    },
    [tableData],
  )

  const onDelete = (recordId) => {
    const newTableData = [...tableData]
    const i = newTableData.findIndex((item) => item.recordId === recordId)
    newTableData.splice(i, 1)
    setTableData(newTableData)
    onChange?.(!newTableData.length ? undefined : newTableData)
  }

  const columns: any[] = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: '数据库字段编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '业务字段名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '业务字段类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => BUSINESS_FIELD_TYPE[text],
    },
    {
      title: '选择弹窗',
      dataIndex: 'selectContent',
      key: 'selectContent',
      render: (text) => (contentTypeMap ? contentTypeMap[text] : ''),
    },
    {
      title: '弹窗字段编码',
      dataIndex: 'codeAlias',
      key: 'codeAlias',
    },
    {
      title: '业务字段描述',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      width: 150,
      render: (record: any) => {
        return (
          <Space size={16}>
            <a
              onClick={() => {
                ref?.current?.show(true, record)
              }}
            >
              编辑
            </a>
            <a
              onClick={() => {
                onDelete(record.recordId)
              }}
            >
              删除
            </a>
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    if (value) {
      setTableData(value)
    }
  }, [value])

  return (
    <>
      {!disabled && (
        <div style={{ marginBottom: 16 }}>
          <Button
            onClick={() => {
              ref?.current?.show(true)
            }}
            icon={<PlusOutlined />}
            style={{
              width: '100%',
              backgroundColor: '#FAFBFC',
              borderStyle: 'dashed',
            }}
          >
            新增
          </Button>
        </div>
      )}

      <Table rowKey="recordId" columns={columns} dataSource={tableData} pagination={false} />

      <CreateDrawer ref={ref} onOk={handleSubmit} tableData={tableData} />
    </>
  )
}

export default BusinessConfig
