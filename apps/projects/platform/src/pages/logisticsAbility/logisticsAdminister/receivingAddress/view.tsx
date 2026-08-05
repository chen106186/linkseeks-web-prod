import React, { useRef, useState } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Button, Row, Col, Space, Popconfirm, Switch, message } from 'antd'
import Table from '@/components/TableLayout'
import { ColumnType } from 'antd/lib/table/interface'
import { LOGISTICSADMINISTERSCHEMA } from '../schema'
import { PlusOutlined } from '@ant-design/icons'
import { getLogisticsReceiverAddressPage, postLogisticsReceiverAddressDelete } from '@apps/apis'
import { AuthButton, PageHeaderWrapper, StandardFormTable, useTableRef, AddressContainer } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import { BLOCK_STATUS, useBlockStatus } from '@apps/services'
import { AddressManageModal, ADDRESS_TYPE } from '@apps/components'
const intl = getIntl()

const ReceivingAddress = () => {
  const translate = useWebIntl()
  const tableRef = useTableRef()

  const actionRef = AddressManageModal.useRef({ type: ADDRESS_TYPE.RECEIVING })
  const actionHandle = AddressManageModal.useHandle({ actionRef })
  const columns: any[] = [
    {
      title: translate('web.resource.logistics.shouhuorenxingming'),
      key: 'receiverName',
      dataIndex: 'receiverName',
    },
    {
      title: translate('web.resource.logistics.shouhuodizhi'),
      key: 'fullAddress',
      dataIndex: 'fullAddress',
    },
    {
      title: translate('web.resource.logistics.youbian'),
      key: 'postalCode',
      dataIndex: 'postalCode',
    },
    {
      title: translate('web.resource.logistics.shoujihaoma'),
      key: 'phone',
      dataIndex: 'phone',
    },
    {
      title: translate('web.common.telNumber'),
      key: 'tel',
      dataIndex: 'tel',
    },
    {
      title: translate('web.resource.logistics.shifoumoren'),
      key: 'isDefault',
      dataIndex: 'isDefault',
      render: (text) => <Switch disabled checked={text === 1} />,
    },
    {
      title: translate('web.resource.logistics.shifoumendiandizhi'),
      key: 'isStore',
      dataIndex: 'isStore',
      render: (text) => <>{text === 1 ? translate('web.common.shi') : translate('web.common.fou')}</>,
    },
    {
      title: translate('web.resource.logistics.suoshumendian'),
      key: 'storeName',
      dataIndex: 'storeName',
    },
    {
      title: translate('web.common.control'),
      key: 'operate',
      dataIndex: 'operate',
      render: (_text, data) => (
        <>
          {data.isStore !== 1 && (
            <>
              <AuthButton type="edit" code="edit">
                <Button type="link" onClick={() => handleEdit(data)}>
                  {translate('web.common.edit')}
                </Button>
              </AuthButton>

              <AuthButton type="custom" code="del">
                <Popconfirm
                  title={translate('web.common.quedingshangchu')}
                  okText={translate('web.common.shi')}
                  cancelText={translate('web.common.fou')}
                  onConfirm={() => handleDelete(data.id)}
                >
                  <Button type="link">{translate('web.common.delete')}</Button>
                </Popconfirm>
              </AuthButton>
            </>
          )}
        </>
      ),
    },
  ]

  const handleAdd = () => {
    actionRef.toggle(BLOCK_STATUS.ADD)
  }

  const handleDelete = async (id: any) => {
    await actionHandle.handleDelete({ id })
    tableRef.current.reload()
  }

  const handleEdit = async (record: any) => {
    const data = await actionHandle.getAddressDetail({ id: record.id })
    if (data) {
      actionRef.toggle(BLOCK_STATUS.EDIT, data)
    } else {
      message.error('http error')
    }
  }

  const handleSubmitCallback = (value: any) => {
    if (value) {
      tableRef.current.reload()
    }
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        request={getLogisticsReceiverAddressPage}
        actionRef={tableRef}
        searchButtons={[
          {
            key: 'add',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: handleAdd,
            children: translate('web.common.add'),
          },
        ]}
      />

      <AddressManageModal actionRef={actionRef} onSubmit={handleSubmitCallback} />
    </PageHeaderWrapper>
  )
}
export default ReceivingAddress
