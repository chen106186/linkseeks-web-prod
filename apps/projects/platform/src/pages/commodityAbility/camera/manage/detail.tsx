import React, { useRef, useState, useEffect } from 'react'
import { Tooltip, Button, Form, Card, Row, Col, Input, Modal, Tag, message, Select } from '@linkseeks/ui'
import { SaveIcon } from '@linkseeks/icons'
import { ColumnType } from 'antd/lib/table/interface'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import ModalTable from '@/components/ModalTable'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { omit } from '@/utils'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import styles from './index.less'
import { postCommodityWebCameraAdd, postCommodityWebCameraUpdate } from '@apps/apis'

const AddCamera: React.FC<{}> = () => {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const { id, pageStatus, name, deviceSerial, channelNo, appKey, appSecret, apiBase, tokenUrl, remark } =
    usePageStatus()
  const [cameraForm] = Form.useForm()
  const { run } = useHttpRequest<any>((id ? postCommodityWebCameraUpdate : postCommodityWebCameraAdd) as any)
  const isEdit = pageStatus !== PageStatus.PREVIEW

  const titleRender = (title) => {
    if (title === PageStatus.PREVIEW) {
      return '查看摄像头'
    }
    if (title === PageStatus.ADD) {
      return '新增摄像头'
    }
    if (title === PageStatus.EDIT) {
      return '编辑摄像头'
    }
    return ''
  }

  useEffect(() => {
    if (id) {
      cameraForm.setFieldsValue({
        name: name || '',
        deviceSerial: deviceSerial || '',
        channelNo: channelNo ? Number(channelNo) : 1,
        appKey: appKey || '',
        appSecret: appSecret || '',
        apiBase: apiBase || 'https://open.ys7.com',
        tokenUrl: tokenUrl || 'https://open.ys7.com/api/lapp/token/get',
        remark: remark || '',
      })
    }
  }, [])

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const handleSubmit = () => {
    cameraForm
      .validateFields()
      .then(async (values) => {
        const params = id
          ? {
              ...values,
              id: Number(id),
            }
          : values

        try {
          setSubmitLoading(true)
          const { code, message: msg } = await run(params)
          if (code === 1000) {
            setTimeout(() => {
              history.goBack(-1)
            }, 300)
          }
          setSubmitLoading(false)
        } catch (error) {
          setSubmitLoading(false)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <PageHeaderWrapper
      title={titleRender(pageStatus)}
      extra={
        isEdit && (
          <Button
            className={styles['save-icon']}
            icon={<SaveIcon size={16} />}
            type="primary"
            onClick={handleSubmit}
            loading={submitLoading}
          >
            保存
          </Button>
        )
      }
    >
      <Card title="基本信息">
        <Form form={cameraForm} disabled={!isEdit} {...layout}>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                label="摄像头名称"
                name="name"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: '请输入摄像头名称',
                  },
                ]}
              >
                <Input placeholder="请输入摄像头名称/备注" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={24}>
              <Form.Item
                label="设备序列号"
                name="deviceSerial"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: '请输入设备序列号',
                  },
                ]}
              >
                <Input placeholder="设备序列号（萤石云唯一标识）" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item label="通道号" name="channelNo" labelAlign="left" initialValue={1}>
                <Input placeholder="默认1" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={24}>
              <Form.Item
                label="萤石云应用Key"
                name="appKey"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: '请输入萤石云应用Key',
                  },
                ]}
              >
                <Input placeholder="萤石云应用Key（设备级绑定）" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                label="萤石云应用Secret"
                name="appSecret"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: '请输入萤石云应用Secret',
                  },
                ]}
              >
                <Input placeholder="萤石云应用Secret" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={24}>
              <Form.Item label="API网关地址" name="apiBase" labelAlign="left" initialValue="https://open.ys7.com">
                <Input placeholder="https://open.ys7.com" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={120}>
            <Col xl={12} lg={24}>
              <Form.Item
                label="Token端点地址"
                name="tokenUrl"
                labelAlign="left"
                initialValue="https://open.ys7.com/api/lapp/token/get"
              >
                <Input placeholder="https://open.ys7.com/api/lapp/token/get" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={120}>
            <Col xl={24} lg={24}>
              <Form.Item label="备注" name="remark" labelAlign="left" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                <Input.TextArea placeholder="备注（选填）" rows={3} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </PageHeaderWrapper>
  )
}

export default AddCamera
