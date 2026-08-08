import React, { useState, useRef, useEffect } from 'react'
import { Form, Radio, Button, Table } from 'antd'
import { Card } from '@linkseeks/ui'
import { PlusSquareOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table'
import { isEmpty } from 'lodash'
import { ModalFormTable, ModalFormTableRef } from '@apps/components'
import { postMemberManagePlatformMarketingInvitePage } from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'

interface ApplyMemberLayoutProps {
  /** getInviteList */
  getInviteList?: (e: any) => void
  /** 数据回显 */
  dataView?: {
    /** 会员列表数据 */
    inviteList?: any[]
    /** 选择会员 */
    inviteType?: number
  }
}

const ApplyMemberLayout: React.FC<ApplyMemberLayoutProps> = (props: any) => {
  const { getInviteList, dataView } = props
  const [inviteType, setInviteType] = useState<number>(1)
  const [dataSource, SetDataSource] = useState<any>([])
  const modalRef = ModalFormTable.useTableRef()
  const selectData = useSelectOptions()

  /** 删除 */
  const handleDelete = (key) => {
    const newData = [...dataSource]
    const data = newData.filter((item) => item.memberId !== key)
    SetDataSource(data)
    getInviteList(data)
  }
  const columns: ColumnType<any>[] = [
    {
      title: '会员ID',
      key: 'memberId',
      dataIndex: 'memberId',
    },
    {
      title: '会员名称',
      key: 'memberName',
      dataIndex: 'memberName',
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
      key: 'levelName',
      dataIndex: 'levelName',
    },
    {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      render: (_text, record) => (
        <Button type="link" onClick={() => handleDelete(record.memberId)}>
          删除
        </Button>
      ),
    },
  ]

  const handleOnChange = (e) => {
    setInviteType(e.target.value)
  }

  const toggle = (flag: boolean) => {
    modalRef.current.setVisible(flag)
  }

  const handleFetchData = (params: any) => {
    return new Promise((resolve) => {
      postMemberManagePlatformMarketingInvitePage({ ...params }, { ctlType: 'none' })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          const { data } = res
          resolve({
            totalCount: data.totalCount,
            data: data.data.map((item) => {
              return {
                id: item.id,
                memberId: item.memberId,
                memberName: item.name,
                memberTypeName: item.memberTypeName,
                roleId: item.roleId,
                roleName: item.roleName,
                level: item.level,
                levelName: item.levelTag,
              }
            }),
          })
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }

  const handleOk = (selectRowRecord: any) => {
    SetDataSource(selectRowRecord)
    getInviteList(selectRowRecord)
    toggle(false)
  }

  useEffect(() => {
    if (!isEmpty(dataView)) {
      setInviteType(dataView.inviteType)
      SetDataSource(dataView.inviteList)
    }
  }, [dataView])

  return (
    <Card id="applyMemberLayout" title="适用会员">
      <Form.Item name="inviteType" label="选择会员" rules={[{ required: true, message: '请选择适用会员' }]}>
        <Radio.Group onChange={handleOnChange}>
          <Radio value={1}>所有会员共享(默认)</Radio>
          <Radio value={0}>指定会员</Radio>
        </Radio.Group>
      </Form.Item>
      {!inviteType && (
        <Form.Item name="inviteList" rules={[{ required: true, message: '请选择适用会员' }]}>
          <Button
            type="dashed"
            block
            icon={<PlusSquareOutlined />}
            style={{ marginBottom: '24px' }}
            onClick={() => toggle(true)}
          >
            选择
          </Button>
          <Table rowKey={(record) => record.memberId} columns={columns} dataSource={dataSource} />
        </Form.Item>
      )}
      <ModalFormTable
        modalType="Drawer"
        modalTitle="选择会员"
        actionRef={modalRef}
        request={handleFetchData}
        getCheckboxProps={(record) => {
          return {
            disabled: dataSource.map((item) => item.memberId).includes(record.memberId),
          }
        }}
        columns={[
          {
            title: '会员ID',
            key: 'memberId',
            dataIndex: 'memberId',
          },
          {
            title: '会员名称',
            key: 'memberName',
            dataIndex: 'memberName',
            searchField: {
              main: true,
              type: 'Input',
              name: 'name',
            },
          },
          {
            title: '会员类型',
            key: 'memberTypeName',
            dataIndex: 'memberTypeName',
            searchField: {
              type: 'Select',
              name: 'memberType',
            },
          },
          {
            title: '会员角色',
            key: 'roleName',
            dataIndex: 'roleName',
            searchField: {
              type: 'Select',
              name: 'roleId',
            },
          },
          {
            title: '会员等级',
            key: 'levelName',
            dataIndex: 'levelName',
            searchField: {
              type: 'Select',
              name: 'level',
            },
          },
        ]}
        isRowSelection
        rowSelectionType="checkbox"
        rowKey="id"
        pagination={false}
        onOk={handleOk}
        width={900}
        searchSelectMaps={selectData}
      />
    </Card>
  )
}
export default ApplyMemberLayout
