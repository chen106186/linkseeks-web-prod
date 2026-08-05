import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Drawer, Button, Form, Input, Table } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'
import { postSettlementBusinessApplyAmountFindCanApplyAmountRos } from '@apps/apis'
import StatusTag from '@/components/StatusTag'
import { getIntl } from '@linkseeks/i18n'

interface WriteOffDrawerProps {
  visible: boolean
  record: any
  editAble?: boolean
  onClose?: () => void
  onOk?: (rows: any[]) => void
}
const intl = getIntl()
const reg = /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{0,3}$)/

const WriteOffDrawer: React.FC<WriteOffDrawerProps> = (props: WriteOffDrawerProps) => {
  const { visible, record, editAble = false, onClose, onOk } = props
  const ref = useRef<any>({})
  const [tabelSource, setTabelSource] = useState<any>([])
  const [form] = Form.useForm()

  useEffect(() => {
    if (editAble && visible) {
      form.resetFields()
    }
  }, [editAble, visible])

  const loadingTableData = async (params) => {
    const _params = { ...params }
    _params.pageSize = editAble ? 100000 : _params.pageSize
    _params.billId = record.billId
    _params.sourceContractId = record.sourceContractId
    _params.taxRate = record.taxRate
    _params.notQueryDetailId = 0
    const { data } = await postSettlementBusinessApplyAmountFindCanApplyAmountRos(_params)
    setTabelSource(data.data)
    return data
  }

  const _changeNumbers = (record: any, value: any) => {
    let _val = value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')
    let _dataSource = [...tabelSource]
    const _i = _dataSource.findIndex((item) => item.id === record.id)
    let _item = { ..._dataSource[_i] }
    _item.writeOffAmount = _item.currentMoney = Number(_val)
    _dataSource[_i] = _item
    setTabelSource(_dataSource)
  }

  const _handleOk = () => {
    if (editAble) {
      form.validateFields().then((formRes) => {
        onOk?.(tabelSource)
      })
    } else {
      onClose?.()
    }
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'balance.components.writeOffDrawer.columns.applyNo' }),
      key: 'applyNo',
      dataIndex: 'applyNo',
    },
    {
      title: intl.formatMessage({ id: 'balance.components.writeOffDrawer.columns.applyAbstract' }),
      key: 'applyAbstract',
      dataIndex: 'applyAbstract',
    },
    {
      title: intl.formatMessage({ id: 'balance.components.writeOffDrawer.columns.applyTypeName' }),
      key: 'applyTypeName',
      dataIndex: 'applyTypeName',
    },
    {
      title: intl.formatMessage({ id: 'balance.components.writeOffDrawer.columns.applyRowBillNo' }),
      key: 'applyRowBillNo',
      dataIndex: 'applyRowBillNo',
    },
    {
      title: intl.formatMessage({ id: 'balance.components.writeOffDrawer.columns.applyRowBillAbstract' }),
      key: 'applyRowBillAbstract',
      dataIndex: 'applyRowBillAbstract',
    },
    {
      title: intl.formatMessage({ id: 'balance.components.writeOffDrawer.columns.applyBillDate' }),
      key: 'applyBillDate',
      dataIndex: 'applyBillDate',
      render: (text: any, record: any) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'balance.components.writeOffDrawer.columns.applyStatusName' }),
      key: 'applyStatusName',
      dataIndex: 'applyStatusName',
      render: (text: any, record: any) => <StatusTag type="primary" title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'balance.hanshuishuil' }),
      key: 'applyRowBillTaxRate',
      dataIndex: 'applyRowBillTaxRate',
      width: 100,
      render: (text: any) => {
        return text > 0 ? `是/${text}%` : '否'
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.components.writeOffDrawer.columns.applyRowPayment' }),
      key: 'applyRowPayment',
      dataIndex: 'applyRowPayment',
    },
    {
      title: intl.formatMessage({ id: 'balance.components.writeOffDrawer.columns.writeOffAmount' }),
      key: 'writeOffAmount',
      dataIndex: 'writeOffAmount',
      render: (text: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({ id: 'balance.components.writeOffDrawer.columns.canWriteAmount' }),
      key: 'canWriteAmount',
      dataIndex: 'canWriteAmount',
      render: (text: any, record: any) => `${intl.formatMessage({ id: 'common.money' })} ${priceFormat(text)}`,
    },
  ]

  const editColumns: ColumnType<any>[] = columns.concat([
    {
      title: intl.formatMessage({ id: 'balance.components.writeOffDrawer.editColumns.currentMoney' }),
      key: 'currentMoney',
      dataIndex: 'currentMoney',
      render: (text: any, record: any) => (
        <Form.Item
          name={`currentMoney_${record.id}_${record.applyRowId}`}
          style={{ margin: 0 }}
          rules={[
            {
              validator: (_, value) => {
                if (!value && value !== 0) {
                  return Promise.resolve()
                }
                if (!reg.test(value)) {
                  return Promise.reject(
                    new Error(
                      intl.formatMessage({ id: 'balance.components.writeOffDrawer.editColumns.currentMoney.rule.1' }),
                    ),
                  )
                }
                return value > record.canWriteAmount
                  ? Promise.reject(
                      new Error(
                        intl.formatMessage({ id: 'balance.components.writeOffDrawer.editColumns.currentMoney.rule.2' }),
                      ),
                    )
                  : Promise.resolve()
              },
            },
          ]}
        >
          <Input
            type="number"
            addonBefore={intl.formatMessage({ id: 'common.money' })}
            max={record.canWriteAmount}
            value={record.canWriteAmount}
            onChange={(e) => {
              _changeNumbers(record, e.target.value)
            }}
          />
        </Form.Item>
      ),
    },
  ])

  const _key = useMemo(() => record.billId, [record])

  return (
    <Drawer
      title={intl.formatMessage({ id: 'balance.components.writeOffDrawer.title' })}
      placement={'right'}
      onClose={onClose}
      visible={visible}
      key={_key}
      width={'80%'}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'balance.quxiao' })}
          </Button>
          <Button onClick={_handleOk} type="primary">
            {intl.formatMessage({ id: 'balance.components.writeOffDrawer.ok' })}
          </Button>
        </div>
      }
    >
      <Form form={form}>
        {editAble ? (
          <StandardTable
            keepAlive={false}
            fetchTableData={(params) => loadingTableData(params)}
            columns={editAble ? editColumns : columns}
            currentRef={ref}
            tableProps={{ pagination: !editAble }}
            rowKey="id"
          />
        ) : (
          <Table dataSource={record.writeOffRecords} columns={columns} pagination={false} />
        )}
      </Form>
    </Drawer>
  )
}

export default WriteOffDrawer
