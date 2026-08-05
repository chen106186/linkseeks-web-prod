import React, { useRef, useState } from 'react'
import { Drawer, Button, message } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { createFormActions } from '@apps/formily'
import { postMemberManageLowerProviderPage } from '@apps/apis'
import Submit from '@/components/NiceForm/components/Submit'
import NiceForm from '@/components/NiceForm'
import { getIntl } from '@linkseeks/i18n'

interface MemberDrawerProps {
  visible: boolean
  onClose?: () => void
  onOk?: (record: any) => void
}
const intl = getIntl()
const formActions = createFormActions()

const MemberDrawer: React.FC<MemberDrawerProps> = (props: MemberDrawerProps) => {
  const { visible, onClose, onOk } = props
  const ref = useRef<any>({})
  const [selectedRow, setSelectedRow] = useState<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  const loadingTableData = async (params) => {
    const _params = { ...params }
    const { data } = await postMemberManageLowerProviderPage(_params)
    message.destroy()
    return data
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.memberDrawer.columns.memberId' }),
      key: 'memberId',
      dataIndex: 'memberId',
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.memberDrawer.columns.name' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.memberDrawer.columns.memberTypeName' }),
      key: 'memberTypeName',
      dataIndex: 'memberTypeName',
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.memberDrawer.columns.roleName' }),
      key: 'roleName',
      dataIndex: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'balance.businessRequestFunds.components.memberDrawer.columns.levelTag' }),
      key: 'levelTag',
      dataIndex: 'levelTag',
    },
  ]

  const handleSelectChange = (record, selected, selectedRow, nativeEvent) => {
    setSelectedRowKeys([record.id])
    setSelectedRow(record)
  }

  const _onOk = () => {
    if (!selectedRow?.memberId) {
      message.error(intl.formatMessage({ id: 'balance.businessRequestFunds.components.memberDrawer.message' }))
      return
    }
    onOk?.(selectedRow)
  }

  return (
    <Drawer
      title={intl.formatMessage({ id: 'balance.businessRequestFunds.components.memberDrawer.title' })}
      placement={'right'}
      onClose={onClose}
      visible={visible}
      key={'right'}
      width={'50%'}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'balance.quxiao' })}
          </Button>
          <Button onClick={_onOk} type="primary">
            {intl.formatMessage({ id: 'balance.businessRequestFunds.components.memberDrawer.ok' })}
          </Button>
        </div>
      }
    >
      <StandardTable
        keepAlive={false}
        fetchTableData={(params) => loadingTableData(params)}
        columns={columns}
        currentRef={ref}
        rowKey="id"
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedRowKeys,
          onSelect: handleSelectChange,
        }}
        controlRender={
          <NiceForm
            actions={formActions}
            onSubmit={(values) => ref.current.reload(values)}
            schema={{
              type: 'object',
              properties: {
                mageLayout: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-component-props': {
                    grid: true,
                  },
                  properties: {
                    name: {
                      type: 'string',
                      'x-component': 'Search',
                      'x-component-props': {
                        placeholder: intl.formatMessage({
                          id: 'balance.businessRequestFunds.components.memberDrawer.schema.name',
                        }),
                        advanced: false,
                        align: 'flex-start',
                        allowClear: true,
                      },
                    },
                  },
                },
              },
            }}
            components={{
              Submit,
            }}
          />
        }
      />
    </Drawer>
  )
}

export default MemberDrawer
