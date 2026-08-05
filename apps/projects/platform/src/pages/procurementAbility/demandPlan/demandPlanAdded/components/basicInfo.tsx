import React, { useEffect } from 'react'
import { Form, Input, Typography } from 'antd'
import DatePicker from '@/components/DatePicker'
import { formatTimeString } from '@/utils'
import { isEmpty } from 'lodash'
import { getIntl } from '@linkseeks/i18n'

const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}

interface BasicInfoprops {
  currentRef: any
  fetchdata: any
  onBadge?: Function
}
const intl = getIntl()
const BasicInfo: React.FC<BasicInfoprops> = (props: any) => {
  const { currentRef, fetchdata, onBadge } = props
  const [form] = Form.useForm()

  useEffect(() => {
    currentRef.current = {
      get: () =>
        new Promise((resolve: any) => {
          form
            .validateFields()
            .then((res) => {
              resolve({
                state: true,
                name: 'basic',
                data: {
                  ...res,
                },
              })
              onBadge(0, 0)
            })
            .catch((error) => {
              if (error && error.errorFields) {
                onBadge(error.errorFields.length, 0)
              }
            })
        }),
    }
  })

  useEffect(() => {
    if (!isEmpty(fetchdata)) {
      form.setFieldsValue({
        summary: fetchdata.summary,
        startTime: moment(fetchdata.startTime),
        endTime: moment(fetchdata.endTime),
      })
    }
  }, [fetchdata])

  const handleSummary = () => {
    form.setFieldsValue({
      summary: `${form.getFieldValue('startTime').format('YYYY-MM-DD')}-${form
        .getFieldValue('endTime')
        .format('YYYY-MM-DD')}${intl.formatMessage({ id: 'home.purchaseCenter.needPlanList' })}`,
    })
  }

  return (
    <Form {...layout} form={form}>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, curValues) =>
          (prevValues.startTime && prevValues.endTime) !== (curValues.startTime && curValues.endTime)
        }
      >
        {({ getFieldValue }) => {
          return (
            getFieldValue('startTime') &&
            getFieldValue('endTime') && (
              <Form.Item
                label={intl.formatMessage({ id: 'detail.purchase.demendSummary' })}
                name="summary"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'detail.purchase.message11' }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            )
          )
        }}
      </Form.Item>
      <Form.Item required label={intl.formatMessage({ id: 'detail.purchase.demandCycle' })} style={{ marginBottom: 0 }}>
        <DatePicker startTimeName="startTime" endTimeName="endTime" onPress={handleSummary} />
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'detail.purchase.needPlanNo' })} name="needPlanNo">
        <Typography.Text>{fetchdata.needPlanNo}</Typography.Text>
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'detail.purchase.operate' })} name="department">
        <Typography.Text>{fetchdata.department}</Typography.Text>
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'detail.purchase.department' })} name="userName">
        <Typography.Text>{fetchdata.userName}</Typography.Text>
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'detail.purchase.createTime' })} name="createTime">
        <Typography.Text>{fetchdata.createTime && formatTimeString(fetchdata.createTime)}</Typography.Text>
      </Form.Item>
      <Form.Item label={intl.formatMessage({ id: 'detail.purchase.innerStatus' })} name="innerStatus">
        <Typography.Text>{fetchdata.innerStatusName}</Typography.Text>
      </Form.Item>
    </Form>
  )
}

export default BasicInfo
