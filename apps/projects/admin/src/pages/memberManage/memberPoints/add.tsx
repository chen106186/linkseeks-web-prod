import React, { useEffect, useMemo, useState } from 'react'
import { ModalFormTable, RecordColumns, PageHeaderWrapper } from '@apps/components'
import { Button, Card, RadioGroup, Radio } from '@linkseeks/ui'
import { Form, Input, InputNumber, Table, Space, message, Modal } from 'antd'
import { Validator } from '@apps/validator'
import { PlusIcon } from '@linkseeks/icons'
import { getMemberMemberPointsSelectMemberPage, postMemberMemberPointsBatchAdd } from '@apps/apis'
import { history } from '@linkseeks/router-manager'
import { encryptedByAES } from '@linkseeks/crypto'
import useSelectOptions from './hooks/useSelectOptions'

interface MemberItemType {
  memberRelationId: number
  subMemberId: number
  subMemberName: string
  subAccount: string
  subRoleName: string
}

const TableFormItem: React.FC<{ value?: MemberItemType[]; onChange?: (value: MemberItemType[]) => void }> = ({
  value,
  onChange,
}) => {
  const handleDelete = (record: MemberItemType) => {
    console.log(onChange, value, 'onChange')
    if (onChange && value) {
      onChange(value?.filter((item) => item.memberRelationId !== record.memberRelationId))
    }
  }

  const selectColumns = useMemo(() => {
    return [
      {
        title: '会员ID',
        key: 'subMemberId',
        dataIndex: 'subMemberId',
      },
      {
        title: '会员名称',
        key: 'subMemberName',
        dataIndex: 'subMemberName',
        searchField: {
          main: true,
          type: 'Input',
        },
      },
      {
        title: '会员登录账号',
        key: 'subAccount',
        dataIndex: 'subAccount',
      },
      {
        title: '会员角色',
        key: 'subRoleName',
        dataIndex: 'subRoleName',
        searchField: {
          type: 'Select',
          name: 'subRoleId',
        },
      },
      {
        title: '操作',
        key: 'options',
        dataIndex: 'options',
        render: (_, record) => (
          <Button type="link" onClick={() => handleDelete(record)}>
            移除
          </Button>
        ),
      },
    ]
  }, [value])

  return <Table columns={selectColumns} rowKey="memberRelationId" pagination={false} dataSource={value || []} />
}

const addMemberPoints: React.FC = () => {
  const [form] = Form.useForm()
  const [pwdForm] = Form.useForm()
  const [pwdModalVisible, setPwdModalVisible] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const validator = new Validator()
  const selectData = useSelectOptions()
  const modalRef = ModalFormTable.useTableRef()

  const handleSelectMember = () => {
    const list = modalRef.current?.getSelectionItems()
    if (list && list.length > 0) {
      form.setFieldValue('members', list)
      modalRef.current.setSelectionKeys([])
      modalRef.current.setSelectionItems([])
      modalRef.current.reload()
      modalRef.current.setVisible(false)
    } else {
      message.info('请选择一条记录')
    }
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setPwdModalVisible(true)
    })
  }

  const handleSave = () => {
    pwdForm.validateFields().then((values) => {
      const formValues = form.getFieldsValue()
      const params = {
        password: encryptedByAES(values.password),
        ...formValues,
      }
      setConfirmLoading(true)
      postMemberMemberPointsBatchAdd(params, { ctlType: 'none' })
        .then((res) => {
          if (res.code === 1000) {
            message.success('操作成功')
            setPwdModalVisible(false)
            history.goBack()
          } else {
            pwdForm.setFields([
              {
                name: 'password',
                errors: [res.message],
              },
            ])
          }
        })
        .finally(() => {
          setConfirmLoading(false)
        })
    })
  }

  return (
    <PageHeaderWrapper
      extra={
        <Button type="primary" onClick={handleSubmit}>
          提交
        </Button>
      }
    >
      <Form
        form={form}
        labelAlign="left"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 12,
        }}
      >
        <Space direction="vertical" style={{ display: 'flex' }} size={16}>
          <Card>
            <Form.Item label={'发放/扣减会员积分'} required>
              <Form.Item name="pointsType" initialValue={1}>
                <RadioGroup>
                  <Radio value={1}>增加</Radio>
                  <Radio value={0}>减少</Radio>
                </RadioGroup>
              </Form.Item>
              <Form.Item
                name="points"
                rules={[
                  {
                    required: true,
                    message: '请输入',
                  },
                  validator.validateNumber({ min: 1, max: 99999 }),
                ]}
              >
                <InputNumber precision={0} style={{ width: 260 }} />
              </Form.Item>
            </Form.Item>
            <Form.Item
              name="remark"
              label={'备注'}
              tooltip={'备注内容会在积分权益获取/使用记录中显示'}
              rules={[validator.validateTextLength({ length: 60 })]}
            >
              <Input.TextArea rows={6} />
            </Form.Item>
          </Card>
          <Card title={'选择会员'}>
            <Form.Item noStyle>
              <Button
                type="secondary"
                icon={<PlusIcon />}
                onClick={() => {
                  const selectMembers = form.getFieldValue('members') as MemberItemType[]
                  if (selectMembers && selectMembers.length > 0) {
                    modalRef.current.setSelectionKeys(selectMembers.map((item) => item.memberRelationId))
                    modalRef.current.setSelectionItems(selectMembers)
                  } else {
                    modalRef.current.setSelectionKeys([])
                    modalRef.current.setSelectionItems([])
                    modalRef.current.reload()
                  }
                  modalRef.current.setVisible(true)
                }}
              >
                添加
              </Button>
              <Form.Item
                wrapperCol={{ span: 24 }}
                style={{ marginTop: 12 }}
                name="members"
                rules={[
                  {
                    required: true,
                    message: '请选择会员',
                  },
                ]}
              >
                <TableFormItem />
              </Form.Item>
            </Form.Item>
          </Card>
        </Space>
      </Form>
      <ModalFormTable
        modalTitle="选择适用会员"
        width={800}
        rowKey="memberRelationId"
        actionRef={modalRef}
        request={getMemberMemberPointsSelectMemberPage}
        columns={[
          {
            title: '会员ID',
            key: 'subMemberId',
            dataIndex: 'subMemberId',
          },
          {
            title: '会员名称',
            key: 'subMemberName',
            dataIndex: 'subMemberName',
            searchField: {
              main: true,
              type: 'Input',
            },
          },
          {
            title: '会员登录账号',
            key: 'subAccount',
            dataIndex: 'subAccount',
          },
          {
            title: '会员角色',
            key: 'subRoleName',
            dataIndex: 'subRoleName',
            searchField: {
              type: 'Select',
              name: 'subRoleId',
            },
          },
        ]}
        isRowSelection
        searchSelectMaps={selectData}
        rowSelectionType="checkbox"
        pagination={false}
        onOk={handleSelectMember}
      />
      <Modal
        title={'校验'}
        centered
        open={pwdModalVisible}
        onOk={handleSave}
        maskClosable
        onCancel={() => setPwdModalVisible(false)}
        confirmLoading={confirmLoading}
      >
        <Form form={pwdForm} layout="vertical">
          <div style={{ color: '#797979', marginBottom: 16 }}>该操作属于敏感操作，需校验您的登录密码</div>
          <Form.Item
            name="password"
            label={'请输入您的登录密码'}
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default addMemberPoints
