import React, { useState, useRef, useEffect } from 'react'
import { Drawer, Button, Radio, message, Space, Typography } from 'antd'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMarketingWebActivityPageListAdorn } from '@apps/apis'
import { formatTimeString } from '@/utils'
import StatusTag from '@/components/StatusTag'
import defaultLogo from '@/assets/imgs/default_logo.jpg'

const options = [
  { label: '平台', value: 1 },
  { label: '商家', value: 2 },
]

interface ActivityDrawerProps {
  visible: boolean
  onClose: () => void
  onConfirm?: (record) => void
  selectId?: string
  activityType?: 1 | 2 // 类型: 1.平台 2.商家
}

const ActivityDrawer: React.FC<ActivityDrawerProps> = (props: ActivityDrawerProps) => {
  const { visible, onClose, onConfirm, selectId, activityType = 1 } = props
  const { shopId, environment } = usePageStatus()
  const [type, setType] = useState(activityType)
  const [selectedRows, setSelectedRows] = useState<any>([])
  const ref = useRef({} as ActionType)

  useEffect(() => {
    if (visible) {
      if (ref.current?.setSelectionKeys) {
        ref.current?.setSelectionKeys(selectId ? [selectId] : [])
      }
    }
  }, [selectId, visible])

  /*eslint-disable*/
  const columns: RecordColumns<any>[] = [
    {
      title: '活动信息',
      dataIndex: 'name',
      key: 'name',
      searchField: {
        main: true,
        title: 'name',
      },
      render: (text: any, record: any) => (
        <Space direction="horizontal" style={{ width: 300 }}>
          <img src={record.templatePicUrl || defaultLogo} style={{ width: 40, height: 40, borderRadius: 4 }} />
          <Space direction="vertical" style={{ width: 300 }}>
            {text}
            <Typography.Text type="secondary">ID:{record.id}</Typography.Text>
          </Space>
        </Space>
      ),
    },
    {
      title: '有效期',
      dataIndex: 'startTime',
      key: 'startTime',
      searchField: {
        name: ['startTime', 'endTime'],
        type: 'DateRange',
        placeholder: ['开始时间', '结束时间'],
      },
      render: (_: any, record: any) => (
        <>
          <div>
            <PlayCircleOutlined />
            &nbsp;{formatTimeString(record.startTime, 'YYYY-MM-DD HH:mm')}
          </div>
          <div>
            <PoweroffOutlined />
            &nbsp;{formatTimeString(record.endTime, 'YYYY-MM-DD HH:mm')}
          </div>
        </>
      ),
    },
    {
      title: '所属',
      dataIndex: 'memberName',
      key: 'memberName',
      searchField:
        type === 2
          ? {
              title: '商家名称',
              type: 'Input',
            }
          : undefined,
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <StatusTag title={record.type === 1 ? '平台' : '商家'} type={record.type === 1 ? 'success' : 'primary'} />
          {record.type === 2 && <Typography.Text type="secondary">{text}</Typography.Text>}
        </Space>
      ),
    },
  ]

  const _onConfirm = () => {
    if (ref?.current?.getSelectionItems()?.length > 0) {
      onConfirm?.(ref?.current?.getSelectionItems()[0])
    } else {
      message.warning('请选择一条记录')
    }
  }

  const _onRadioChange = (e: any) => {
    setType(e.target.value)
    ref?.current?.reload()
  }

  const fetchTableData = async (params: any) => {
    const _params = { ...params, environment, type, shopId }
    const { data } = await getMarketingWebActivityPageListAdorn(_params)
    if (ref.current.selectionKeys.length > 0 && ref.current.getSelectionItems().length === 0) {
      const list = data?.data || []
      setSelectedRows(list.filter((item) => ref.current.selectionKeys.includes(item.id)))
    }
    return data
  }

  const drawerStyle = { background: '#FAFBFC' }

  return (
    <Drawer
      headerStyle={drawerStyle}
      bodyStyle={drawerStyle}
      footerStyle={drawerStyle}
      width={1200}
      title={'选择活动'}
      open={visible}
      onClose={onClose}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={_onConfirm} type="primary">
            确定
          </Button>
        </div>
      }
    >
      <div style={{ textAlign: 'right' }}>
        <Radio.Group options={options} onChange={_onRadioChange} value={type} optionType="button" />
      </div>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchTableData(params)}
        rowKey="id"
        isRowSelection
        rowSelectionType="radio"
        actionRef={ref}
      />
    </Drawer>
  )
}

export default ActivityDrawer
