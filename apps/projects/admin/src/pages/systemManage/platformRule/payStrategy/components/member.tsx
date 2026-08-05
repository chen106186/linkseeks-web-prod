import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Form, Radio, Table, Button } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { ModalFormTable, ModalFormTableRef } from '@apps/components'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { PlusOutlined } from '@ant-design/icons'
import LevelBrand from '@/components/LevelBrand'
import { getMemberManageAllProviderPage } from '@apps/apis'
import { getOrderPlatformPaymentMemberPage } from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'

interface Iprops {
  rowCtl: (e) => void
  /** ID */
  paymentId?: number
}

const MemberInfo: React.FC<Iprops> = (props: any) => {
  const { rowCtl, paymentId } = props
  const [dataSource, setDataSource] = useState<any>([])
  const modalRef = ModalFormTable.useTableRef()
  const selectData = useSelectOptions()

  /** 删除会员 */
  const handleDelect = (id) => {
    const data = [...dataSource]
    const source = data.filter((item) => item.memberId !== id)
    setDataSource(source)
    rowCtl(source)
  }

  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      key: 'memberId',
      dataIndex: 'memberId',
    },
    {
      title: '会员名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '会员类型',
      key: 'memberTypeName',
      dataIndex: 'memberTypeName',
    },
    {
      title: '会员角色',
      key: 'roleName',
      dataIndex: 'roleName',
    },
    {
      title: '会员等级',
      key: 'levelTag',
      dataIndex: 'levelTag',
    },
    {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      render: (_text, record) => (
        <Button type="link" onClick={() => handleDelect(record.memberId)}>
          删除
        </Button>
      ),
    },
  ]
  const columnsSetProduct: RecordColumns<any>[] = [
    {
      dataIndex: 'memberRoleId',
      title: 'MRID',
      key: 'memberRoleId',
      className: 'commonHide',
    },
    {
      dataIndex: 'memberId',
      title: 'ID',
      key: 'memberId',
    },
    {
      dataIndex: 'name',
      title: '会员名称',
      key: 'name',
      searchField: {
        main: true,
      },
    },
    {
      dataIndex: 'memberTypeName',
      title: '会员类型',
      key: 'memberTypeName',
      searchField: {
        type: 'Select',
        name: 'memberType',
      },
    },
    {
      dataIndex: 'roleName',
      title: '会员角色',
      key: 'roleName',
      searchField: {
        type: 'Select',
        name: 'roleId',
      },
    },
    {
      dataIndex: 'levelTag',
      title: '会员等级',
      key: 'levelTag',
      searchField: {
        type: 'Select',
        name: 'level',
      },
      render: (text, record) => <LevelBrand level={record.level} />,
    },
  ]

  const fetchMembersList = async (params) => {
    const res = await getMemberManageAllProviderPage(params)
    const { data } = res
    const _data = data.data.map((item) => ({ ...item, memberRoleId: item.memberId + '_' + item.roleId }))
    return { totalCount: data.totalCount, data: _data }
  }

  const handleOkAddMember = () => {
    modalRef.current.setVisible(false)
    setDataSource(modalRef.current.getSelectionItems())
    rowCtl(
      modalRef.current.getSelectionItems().map((item) => {
        return {
          memberId: item.memberId,
          roleId: item.roleId,
        }
      }),
    )
  }

  useEffect(() => {
    if (paymentId) {
      getOrderPlatformPaymentMemberPage({ paymentId, pageSize: '999', current: '1', name: '' }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        const { data } = res.data
        modalRef.current.setSelectionKeys(data.map((v) => v.memberId))
        modalRef.current.setSelectionItems(data)
        rowCtl(data)
        setDataSource(data)
      })
    }
  }, [paymentId])

  return (
    <Fragment>
      <Form.Item label="适用会员" name="allMembers">
        <Radio.Group>
          <Radio value={true}>所有会员共享(默认)</Radio>
          <Radio value={false}>指定会员</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.allMembers !== currentValues.allMembers}
      >
        {({ getFieldValue }) =>
          !getFieldValue('allMembers') && (
            <Form.Item name="members" wrapperCol={{ span: 24 }}>
              <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                style={{ marginBottom: '24px' }}
                onClick={() => modalRef.current.setVisible(true)}
              >
                选择会员
              </Button>
              <Table
                pagination={{
                  size: 'small',
                }}
                rowKey={(record) => record.memberId}
                columns={columns}
                dataSource={dataSource}
              />
            </Form.Item>
          )
        }
      </Form.Item>
      <ModalFormTable
        modalTitle="选择适用会员"
        actionRef={modalRef}
        request={fetchMembersList}
        columns={columnsSetProduct}
        isRowSelection
        rowSelectionType="checkbox"
        rowKey="memberId"
        pagination={false}
        onOk={handleOkAddMember}
        searchSelectMaps={selectData}
      />
    </Fragment>
  )
}
export default MemberInfo
