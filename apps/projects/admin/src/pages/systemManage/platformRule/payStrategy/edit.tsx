import React, { useEffect, useState } from 'react'
import { Card, Tabs, Form, Button, message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { usePrompt, useLocation } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import BasicInfo from './components/basicInfo'
import Member from './components/member'
import { SaveOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getOrderPlatformPaymentDetail,
  postOrderPlatformPaymentCreate,
  postOrderPlatformPaymentUpdate,
} from '@apps/apis'

const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}
const { TabPane } = Tabs

const PaymentConfigLayout = () => {
  const { paymentId } = usePageStatus()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [loading, setLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState<boolean>(false)
  const [form] = Form.useForm()
  usePrompt({ when: unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  const handleSubmit = () => {
    form.validateFields().then((res) => {
      const payTypes = res.payTypes
        .filter((item) => item.payChannels && item.payChannels.length > 0)
        .map((item) => {
          return {
            payType: item.payType,
            fundMode: item.fundMode,
            payChannels: item.payChannels,
          }
        })
      if (payTypes.length === 0) {
        message.error('至少选择其中一种支付渠道下的支付方式')
        return
      }

      const params: any = {
        name: res.name,
        allMembers: res.allMembers,
        payTypes,
      }
      if (res.members) {
        params.members = res.members
      }
      paymentId && (params.paymentId = paymentId)

      const fetchApi = paymentId ? postOrderPlatformPaymentUpdate : postOrderPlatformPaymentCreate
      setLoading(true)
      fetchApi(params).then((res) => {
        if (res.code !== 1000) {
          setLoading(false)
          return
        }
        setUnsaved(false)
        setLoading(false)
        setTimeout(() => {
          history.goBack()
        }, 200)
      })
    })
  }

  const rowCtl = (ctl) => {
    form.setFieldsValue({
      members: ctl,
    })
  }

  useEffect(() => {
    if (paymentId) {
      getOrderPlatformPaymentDetail({ paymentId }).then((res) => {
        if (res.code !== 1000) {
          return
        }
        form.setFieldsValue({
          ...res.data,
        })
      })
    } else {
      form.setFieldsValue({
        allMembers: true,
      })
    }
  }, [])

  return (
    <PageHeaderWrapper
      extra={
        <Button loading={loading} type="primary" onClick={handleSubmit} icon={<SaveOutlined />}>
          保存
        </Button>
      }
    >
      <Card>
        <Form
          form={form}
          {...layout}
          onValuesChange={() => {
            if (!unsaved) {
              setUnsaved(true)
            }
          }}
        >
          <Tabs>
            <TabPane tab="基本信息" key={1} forceRender>
              <BasicInfo />
            </TabPane>
            <TabPane tab="适用会员" key={2} forceRender>
              <Member paymentId={paymentId} rowCtl={rowCtl} />
            </TabPane>
          </Tabs>
        </Form>
      </Card>
    </PageHeaderWrapper>
  )
}
export default PaymentConfigLayout
