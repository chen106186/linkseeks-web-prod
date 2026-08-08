import React, { Fragment, useEffect, useRef, useState } from 'react'
import { SchemaForm, Submit, FormButtonGroup, createFormActions, FormEffectHooks } from '@apps/formily'
import { Card, Select, Input, Checkbox, Button, Popconfirm, Table, message, Col, Row, Image } from 'antd'
import { BraftEditor, ImageBox, PageHeaderWrapper, type RecordColumns, StandardFormTable } from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { getMarketingPlatformCbgTeamLeaderGet, postMarketingPlatformCbgTeamLeaderExamine } from '@apps/apis'
import { formatTimeString } from '@/utils'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { SaveOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { Form, Modal, Radio, Space } from '@linkseeks/ui'
const { TextArea } = Input

const CbgTeamLeaderDetail = () => {
  const intl = useIntl()
  const ref = useRef({} as ActionType)
  const { id, preview } = usePageStatus()
  const [loading, setLoading] = useState<boolean>(false)
  const [checkStatus, setCheckStatus] = useState<number>(1)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [showAuditBtn, setShowAuditBtn] = useState<boolean>(false)
  const [leaderData, setLeaderData] = useState<any>({})
  const [checkForm] = Form.useForm()

  useEffect(() => {
    getMarketingPlatformCbgTeamLeaderGet({
      id: id,
    }).then((res) => {
      if (res.code !== 1000) {
        message.warning('加载失败')
      }
      const data = res.data
      setLeaderData(data)
      if (data.status === 1) {
        setShowAuditBtn(true)
      }
    })
  }, [])

  const handleStatusChange = (value: any) => {
    setCheckStatus(value.target.value)
  }

  const handleVerifyModal = (record) => {
    checkForm.resetFields()
    checkForm.setFieldsValue({
      id: id,
    })
    setVisibleModal(true)
  }

  const handleOK = () => {
    checkForm.validateFields().then((values) => {
      postMarketingPlatformCbgTeamLeaderExamine({ ...values }).then((res) => {
        if (res.code === 1000) {
          setVisibleModal(false)
          history.replace('/marketingManage/communityGroupBuying/teamLeader')
        }
        setConfirmLoading(false)
      })
      setConfirmLoading(true)
    })
  }

  const handleCancel = () => {
    checkForm.resetFields()
    setVisibleModal(false)
  }

  return (
    <div>
      <PageHeaderWrapper
        title={showAuditBtn ? '审核团长信息' : '查看团长信息'}
        extra={
          showAuditBtn && (
            <Button loading={loading} icon={<SaveOutlined />} type="primary" onClick={handleVerifyModal}>
              提交审核
            </Button>
          )
        }
      >
        <Space direction="vertical" size="middle">
          <Card title="团长信息">
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal" disabled={true}>
              <Form.Item label="团长名称">
                <Input value={leaderData.name} />
              </Form.Item>
              <Form.Item label="团长手机">
                <Input value={leaderData.phone} />
              </Form.Item>
              <Form.Item label="身份证照片">
                <Row gutter={16}>
                  <Col span={6}>
                    <Image width={200} src={leaderData.idPhoto} />
                  </Col>
                  <Col span={6}>
                    <Image width={200} src={leaderData.idPhotoBack} />
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item label="家庭地址">
                <Input
                  value={
                    leaderData.homeProvince +
                    '/' +
                    leaderData.homeCity +
                    '/' +
                    leaderData.homeArea +
                    '/' +
                    leaderData.homeStreet
                  }
                />
              </Form.Item>
              <Form.Item label="家庭详细地址">
                <Input value={leaderData.homeAddress} />
              </Form.Item>
            </Form>
          </Card>
          <Card title="自提点信息">
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal" disabled={true}>
              <Form.Item label="自提点名称">
                <Input value={leaderData.pickupPointName} />
              </Form.Item>
              <Form.Item label="自提点地址">
                <Input
                  value={
                    leaderData.pickupPointProvince +
                    '/' +
                    leaderData.pickupPointCity +
                    '/' +
                    leaderData.pickupPointArea +
                    '/' +
                    leaderData.pickupPointStreet
                  }
                />
              </Form.Item>
              <Form.Item label="自提点详细地址">
                <Input value={leaderData.pickupPointAddress} />
              </Form.Item>
            </Form>
          </Card>
        </Space>

        <Modal
          title="审核团长信息"
          visible={visibleModal}
          onOk={handleOK}
          onCancel={handleCancel}
          confirmLoading={confirmLoading}
        >
          <Form layout="vertical" form={checkForm}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="isPass"
              label=""
              rules={[
                {
                  required: true,
                  message: '请选择审核状态',
                },
              ]}
              initialValue={1}
            >
              <Radio.Group onChange={handleStatusChange}>
                <Radio value={1}>审核通过</Radio>
                <Radio value={0}>审核不通过</Radio>
              </Radio.Group>
            </Form.Item>
            {checkStatus === 0 && (
              <Form.Item
                name="opinion"
                label={'审核不通过原因'}
                rules={[
                  {
                    required: true,
                    message: '请填写原因',
                  },
                ]}
              >
                <TextArea rows={3} placeholder="请填写原因" />
              </Form.Item>
            )}
          </Form>
        </Modal>
      </PageHeaderWrapper>
    </div>
  )
}

export default CbgTeamLeaderDetail
