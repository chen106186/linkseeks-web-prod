import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { usePageStatus } from '@/hooks/usePageStatus'
import ReturnEle from '@/components/ReturnEle'
import { useLocation } from '@linkseeks/router-core'
import { Card, Form, Input, Button, Space, message, Popconfirm } from 'antd'
import {
  postProductUnitSaveOrUpdateUnit,
  getCommodityLanguageGetLanguageList,
  GetCommodityLanguageGetLanguageListResponseDetail,
} from '@apps/apis'
const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}
const tailLayout = {
  wrapperCol: { style: { marginLeft: '174px' } },
}

const Template: React.FC<{}> = () => {
  const [form] = Form.useForm()
  const [lodaing, setLodaing] = useState<boolean>(false)
  const { pathname } = useLocation()
  const query = usePageStatus()

  const getType = useMemo(() => {
    return pathname.split('/')[pathname.split('/').length - 1]
  }, [pathname])

  const confirmCancel = useCallback(() => {
    history.goBack()
  }, [])

  const onFinish = useCallback(
    async (values: any) => {
      let successMessage = '新增单位成功'
      if (getType !== 'add') {
        successMessage = '修改单位成功'
        values.id = query?.id
      }
      try {
        const { code, message: messageInfo } = await postProductUnitSaveOrUpdateUnit({ ...values }, { ctlType: 'none' })
        if (code === 1000) {
          message.success(successMessage)
          setLodaing(true)
          setTimeout(confirmCancel, 2000)
          return
        }
        message.error(messageInfo)
      } catch (error) {
        setLodaing(false)
      }
    },
    [getType, query],
  )

  useEffect(() => {
    try {
      const data: { name: string; englishShortName: string } = {
        name: query?.name ? decodeURIComponent(atob(query?.name as string)) : '',
        englishShortName: query?.englishShortName ? decodeURIComponent(atob(query?.englishShortName as string)) : '',
      }
      form.setFieldsValue({
        name: data.name,
        englishShortName: data.englishShortName,
      })
    } catch (error) {
      console.log(error)
    }
  }, [query])

  return (
    <PageHeaderWrapper>
      <Card>
        <Form form={form} {...layout} onFinish={onFinish}>
          <Form.Item label="单位名称" name="name" rules={[{ required: true, message: '请输入单位名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="英文简称" name="englishShortName" rules={[{ required: true, message: '请输入英文简称' }]}>
            <Input />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space size={24}>
              <Button type="primary" loading={lodaing} htmlType="submit">
                保存
              </Button>
              <Popconfirm onConfirm={confirmCancel} title="确定要执行这个操作?" okText="确定" cancelText="取消">
                <Button>取消</Button>
              </Popconfirm>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>
  )
}

export default Template
