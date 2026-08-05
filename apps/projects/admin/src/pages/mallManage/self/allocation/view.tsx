import React, { useRef, useState } from 'react'
import { PageHeaderWrapper, ModalFormTable, RecordColumns, ModalFormTableRef } from '@apps/components'
import { Card, Space, Row, Col, Input, Button, message, Form } from '@linkseeks/ui'
import { SaveIcon } from '@linkseeks/icons'
import { getMemberManagePlatformProviderPage } from '@apps/apis'
import type { GetMemberManagePlatformProviderPageResponseDetail } from '@apps/apis'
import { history } from '@linkseeks/router-manager'
import useSelfMall from '../../services/hooks/useSelfMall'
import SelfMallItem from '../../services/components/SelfMallItem'
import { allocationSelfShop } from '../../services/feature'

const SelfManage: React.FC = () => {
  const { mallList, allocatedIdList, getAllocatedIdList } = useSelfMall({ environment: '0' })
  const [selfShopModelIdList, setSelfShopModelIdList] = useState<number[]>([])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const modalRef = ModalFormTable.useTableRef()
  const [form] = Form.useForm()

  const columns: RecordColumns<GetMemberManagePlatformProviderPageResponseDetail>[] = [
    {
      dataIndex: 'memberId',
      title: 'ID',
      key: 'memberId',
    },
    {
      dataIndex: 'memberName',
      title: '会员名称/等级',
      key: 'name',
      searchField: 'Input',
      render: (_, record) => (
        <div>
          <span>{record.name}</span>
          <div>{record.levelTag}</div>
        </div>
      ),
    },
    {
      dataIndex: 'memberTypeName',
      title: '会员类型',
      key: 'memberTypeName',
    },
    {
      dataIndex: 'roleName',
      title: '会员角色',
      key: 'roleName',
    },
  ]

  const handleOk = (selectRows: Record<string, any>[]) => {
    if (!selectRows.length) {
      message.info('请选择适用会员')
      return
    }
    const selectMember = selectRows[0] as GetMemberManagePlatformProviderPageResponseDetail
    getAllocatedIdList(selectMember?.memberId, selectMember?.roleId)

    form.setFieldsValue({
      memberId: selectMember?.memberId,
      memberRoleId: selectMember?.roleId,
      memberName: selectMember?.name,
    })
    modalRef.current.setVisible(false)
  }

  const handleSelect = (id: number) => {
    if (selfShopModelIdList.includes(id)) {
      form.setFieldValue(
        'selfShopModelIdList',
        selfShopModelIdList.filter((item) => item !== id),
      )
      setSelfShopModelIdList(selfShopModelIdList.filter((item) => item !== id))
    } else {
      form.setFieldValue('selfShopModelIdList', [...selfShopModelIdList, id])
      setSelfShopModelIdList([...selfShopModelIdList, id])
    }
  }

  const handleSave = () => {
    form.validateFields().then((values) => {
      setSubmitLoading(true)
      allocationSelfShop(values)
        .then((res) => {
          history.redirect('/mallManage/self')
        })
        .finally(() => {
          setSubmitLoading(false)
        })
    })
  }

  return (
    <PageHeaderWrapper
      backDom
      extra={
        <Button loading={submitLoading} icon={<SaveIcon />} onClick={handleSave} type="primary">
          保存
        </Button>
      }
    >
      <Form form={form}>
        <Space direction="vertical" size={16}>
          <Card title="选择适用会员">
            <Form.Item name="memberId" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="memberRoleId" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="memberName"
              rules={[
                {
                  required: true,
                  message: '请选择适用会员',
                },
              ]}
            >
              <Input
                style={{ width: 420 }}
                disabled
                addonAfter={
                  <Button
                    style={{ margin: '0 -11px' }}
                    type="primary"
                    onClick={() => {
                      modalRef.current.setVisible(true)
                    }}
                  >
                    选择会员
                  </Button>
                }
              />
            </Form.Item>
          </Card>
          <Card title="分配自营商城">
            <Form.Item
              name="selfShopModelIdList"
              rules={[
                {
                  required: true,
                  message: '请选择自营商城',
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Row gutter={16}>
                {mallList.map((item, index) => (
                  <Col lg={24} xl={12} key={item.id}>
                    <SelfMallItem
                      bordered
                      selected
                      actived={selfShopModelIdList.includes(item.id)}
                      disabled={allocatedIdList.includes(item.id)}
                      mallInfo={item}
                      canEdit={false}
                      onSelect={handleSelect}
                    />
                  </Col>
                ))}
              </Row>
            </Form.Item>
          </Card>
        </Space>
      </Form>
      <ModalFormTable
        modalTitle="选择适用会员"
        actionRef={modalRef}
        request={getMemberManagePlatformProviderPage}
        columns={columns}
        isRowSelection
        rowSelectionType="radio"
        pagination={false}
        onOk={handleOk}
      />
    </PageHeaderWrapper>
  )
}

export default SelfManage
