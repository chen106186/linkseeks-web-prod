import React, { useCallback, useRef, useEffect } from 'react'
import { Button, Table, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ModalFormTable, ModalFormTableRef } from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import PopconfirmBtn from '@/components/PopconfirmBtn'
import { _operation } from '../../constant/columns'
import useSelectOptions from './services/hooks/useSelectOptions'

interface DeliveryGoodTableModalProps {
  onChange?: (value) => void
  disabled?: boolean
  value?: any
  fetchMemberApi: Function
  showAdvancedFilter?: boolean
}

const SelectMemberTable: React.FC<DeliveryGoodTableModalProps> = (props: DeliveryGoodTableModalProps) => {
  const { onChange, value, fetchMemberApi, disabled = false, showAdvancedFilter = true } = props
  const modalRef = ModalFormTable.useTableRef()
  const selectData = useSelectOptions()

  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'memberId',
      key: 'memberId',
    },
    {
      title: '会员名称',
      dataIndex: 'name',
      key: 'name',
      searchField: {
        main: true,
      },
    },
    {
      title: '会员类型',
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
      searchField: showAdvancedFilter
        ? {
            type: 'Select',
            name: 'memberType',
          }
        : undefined,
    },
    {
      title: '会员角色',
      dataIndex: 'roleName',
      key: 'roleName',
      searchField: showAdvancedFilter
        ? {
            type: 'Select',
            name: 'roleId',
          }
        : undefined,
    },
    {
      title: '会员等级',
      dataIndex: 'levelTag',
      key: 'levelTag',
      searchField: showAdvancedFilter
        ? {
            type: 'Select',
            name: 'level',
          }
        : undefined,
    },
  ]

  const confirm = (records) => {
    const newMember = value.filter((_item) => _item.mrId !== records.mrId)
    onChange?.(newMember)
  }

  const columnFunc = useCallback(() => {
    const params = [...columns]
    !disabled &&
      params.push({
        ..._operation,
        render: (_text, record) => <PopconfirmBtn onConfirm={() => confirm(record)}>删除</PopconfirmBtn>,
      })
    return params
  }, [value])

  const handleFetchData = useCallback((params: any) => {
    return new Promise((resolve) => {
      fetchMemberApi({ ...params })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          let data = {
            data: res.data.data.map((_item) => {
              return {
                ..._item,
                mrId: `${_item.memberId}_${_item.roleId}`,
              }
            }),
            totalCount: res.data.totalCount,
          }
          resolve(data)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }, [])

  const handleConfirm = (selectedRows: { [key: string]: any }[]) => {
    onChange?.(selectedRows)
    modalRef.current.setVisible(false)
  }

  useEffect(() => {
    if (value && value.length > 0) {
      modalRef.current?.setSelectionKeys(value.map((v) => v['mrId']))
    }
  }, [value])

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        {!disabled && (
          <Button
            block
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => modalRef?.current?.setVisible(true)}
            style={{ backgroundColor: '#FAFBFC' }}
          >
            选择会员
          </Button>
        )}
        <Table rowKey="mrId" columns={columnFunc()} dataSource={value} pagination={false} />
      </Space>

      <ModalFormTable
        modalType="Drawer"
        modalTitle="选择适用会员"
        actionRef={modalRef}
        request={handleFetchData}
        columns={columns}
        isRowSelection
        rowSelectionType="checkbox"
        rowKey="mrId"
        pagination={false}
        onOk={handleConfirm}
        width={900}
        searchSelectMaps={selectData}
      />
    </>
  )
}

export default SelectMemberTable
