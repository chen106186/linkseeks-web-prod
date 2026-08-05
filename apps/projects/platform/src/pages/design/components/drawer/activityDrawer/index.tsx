import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { Drawer, Button, message, Space, Typography } from 'antd'
import { PlayCircleOutlined, PoweroffOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import StatusTag from '@/components/StatusTag'
import { getMarketingWebActivityPageListAdorn } from '@apps/apis'
import { StandardFormTable } from '@apps/components'

interface ActivityDrawerProps {
  visible: boolean
  onClose: () => void
  onConfirm?: (record) => void
  selectId?: string
  activityType?: 1 | 2 // 类型: 1.平台 2.商家
}

const ActivityDrawer: React.FC<ActivityDrawerProps> = (props: ActivityDrawerProps) => {
  const { visible, onClose, onConfirm, selectId, activityType = 2 } = props
  const { shopId, environment }: any = usePageStatus()
  const tableRef = StandardFormTable.useTableRef()

  const intl = useIntl()

  useEffect(() => {
    if (tableRef && tableRef.current && visible) {
      tableRef.current.setSelectionKeys(selectId ? [selectId] : [])
    }
  }, [selectId, visible])

  const columns = StandardFormTable.createColumns([
    {
      title: intl.formatMessage({ id: 'editor.drawer.activity.columns.name' }),
      dataIndex: 'name',
      key: 'name',
      searchField: {
        main: true,
        placeholder: intl.formatMessage({ id: 'common.text.search' }),
      },
      render: (text: any, record: any) => (
        <Space direction="horizontal" style={{ width: 300 }}>
          <img src={record.templatePicUrl} style={{ width: 40, height: 40, borderRadius: 4 }} />
          <Space direction="vertical" style={{ width: 300 }}>
            {text}
            <Typography.Text type="secondary">ID:{record.id}</Typography.Text>
          </Space>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'editor.drawer.activity.columns.startTime' }),
      dataIndex: 'startTime',
      key: 'startTime',
      searchField: {
        type: 'DateRange',
        name: ['startTime', 'endTime'],
        placeholder: [
          intl.formatMessage({ id: 'common.form.startTime.placeholder' }),
          intl.formatMessage({ id: 'common.form.endTime.placeholder' }),
        ],
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
      title: intl.formatMessage({ id: 'editor.drawer.activity.columns.memberName' }),
      dataIndex: 'memberName',
      key: 'memberName',
      render: (text: any, record: any) => (
        <Space direction="vertical">
          <StatusTag
            title={
              record.type === 1
                ? intl.formatMessage({ id: 'common.text.platform' })
                : intl.formatMessage({ id: 'common.text.business' })
            }
            type={record.type === 1 ? 'success' : 'primary'}
          />
          {record.type === 2 && <Typography.Text type="secondary">{text}</Typography.Text>}
        </Space>
      ),
    },
  ])

  const _onConfirm = () => {
    const selectedRows = tableRef.current.getSelectionItems()
    if (selectedRows.length > 0) {
      onConfirm?.(selectedRows[0])
    } else {
      message.warning(intl.formatMessage({ id: 'common.tip.select.required' }))
    }
  }

  const fetchTableData = async (params: any) => {
    const _params = { ...params, environment, type: activityType, shopId }
    const { data } = await getMarketingWebActivityPageListAdorn(_params)
    return data
  }

  const drawerStyle = { background: '#FAFBFC' }

  return (
    <Drawer
      headerStyle={drawerStyle}
      bodyStyle={drawerStyle}
      footerStyle={drawerStyle}
      width={1200}
      title={intl.formatMessage({ id: 'editor.drawer.activity.title' })}
      open={visible}
      onClose={onClose}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'common.button.cancel' })}
          </Button>
          <Button onClick={_onConfirm} type="primary">
            {intl.formatMessage({ id: 'common.button.confirm' })}
          </Button>
        </div>
      }
    >
      <StandardFormTable
        actionRef={tableRef}
        request={(params) => fetchTableData(params)}
        columns={columns}
        isRowSelection
        rowSelectionType="radio"
      />
    </Drawer>
  )
}

export default ActivityDrawer
