import React, { Fragment, useEffect, useState } from 'react'
import { PageHeaderWrapper, LanguageArrayFormTable, SingleCardUpload, LineTitle } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getManageParameterManageGetPlatformParameter,
  postManageParameterManageUpdate,
  getManageParameterManageParameterValueEnum,
} from '@apps/apis'
import { Validator } from '@apps/validator'
import { InputNumber, Card, Form, Input, Button, Space, Popconfirm, message, Select } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import './index.less'

const layout: any = {
  colon: false,
  labelCol: { style: { width: '174px' } },
  wrapperCol: { span: 9 },
  labelAlign: 'left',
}
const tailLayout = {
  wrapperCol: { style: { marginLeft: '174px' } },
}

interface OptionItem {
  label: string
  value: string
}

const Template: React.FC<{}> = () => {
  const translate = useWebIntl()
  const [form] = Form.useForm()
  const query = usePageStatus()
  const [mallOptions, setMallOptions] = useState<OptionItem[]>()
  // A09 表示是移动端默认商城配置
  const isMobileConfig = query?.code && query?.code === 'A09'
  const validator = new Validator()
  const [singleCardUploadReloadKey, setSingleCardUploadReloadKey] = useState<number>(Date.now())
  const getMallOptions = () => {
    getManageParameterManageParameterValueEnum({ code: 'A09' }).then((res) => {
      if (res.code === 1000 && res.data) {
        const list = res.data.map((item) => ({
          label: item.parameterValueShowName,
          value: item.parameterValue,
        }))
        if (query.parameterValue) {
          const current = list.find((item) => item.label === query.parameterValue)

          if (current) {
            form.setFieldsValue({
              parameterValue: current.value,
            })
          }
        }
        setMallOptions(list)
      }
    })
  }

  useEffect(() => {
    if (isMobileConfig) {
      getMallOptions()
    } else {
      if (query.parameterValue && query.code) {
        if (query.code !== 'A11') {
          form.setFieldsValue({
            parameterValue: query.parameterValue,
          })
        } else {
          const parameterValue = JSON.parse(query.parameterValue)
          if (parameterValue && Array.isArray(parameterValue.value)) {
            form.setFieldsValue({
              parameterValue: parameterValue.value,
              url: parameterValue.url || '',
            })
          }
        }
      }
      if (query.code === 'A12') {
        getManageParameterManageGetPlatformParameter({ code: 'A12' }).then((res) => {
          if (res.code === 1000 && res.data && res.data.parameterValue) {
            try {
              const parameterValue = JSON.parse(res.data.parameterValue)
              if (parameterValue) {
                form.resetFields()
                form.setFieldsValue({
                  logo: parameterValue.logo || '',
                  appName: parameterValue.appName,
                  title: parameterValue.title,
                  slogen: parameterValue.slogen,
                  welcomeCall: parameterValue.welcomeCall,
                  welcome: parameterValue.welcome,
                })
              }
            } catch (error) {
              console.log(error)
            }
          }
        })
      }
    }
  }, [isMobileConfig])

  const onFinish = (values: any) => {
    values.id = query.id
    if (values.id === '5' && !/^([0,1])$/.test(values.parameterValue)) {
      return message.error(translate('web.resource.systemManage.canshuzhijinweilinghuoyi'))
    }

    if (query.code === 'A11') {
      values.parameterValue = JSON.stringify({
        value: values.parameterValue,
        url: values.url || '',
      })
    }

    if (query.code === 'A12') {
      values.parameterValue = JSON.stringify({
        logo: values.logo || '',
        appName: values.appName,
        title: values.title,
        slogen: values.slogen,
        welcomeCall: values.welcomeCall,
        welcome: values.welcome,
      })
    }
    postManageParameterManageUpdate({
      id: values.id,
      parameterValue: values.parameterValue,
    }).then((res) => {
      if (res.code === 1000) {
        history.goBack()
      }
    })
  }
  const confirmCancel = () => {
    history.goBack()
  }
  const renderFormByCode = () => {
    switch (query?.code) {
      case 'A01':
      case 'A02':
      case 'A03':
      case 'A04':
        const props = {
          A01: {
            defaultValue: 3,
            min: 0.01,
            max: 720,
          },
          A02: {
            defaultValue: 100,
            min: 0.01,
            max: 100000,
          },
          A03: {
            defaultValue: 0,
            min: 0.01,
            max: 100,
          },
          A04: {
            defaultValue: 30,
            min: 0.01,
            max: 60,
          },
        }
        return (
          <Form.Item
            label={translate('web.resource.systemManage.canshuzhi')}
            name="parameterValue"
            rules={[
              {
                required: true,
                message: `${translate('web.common.qingshuru')}${translate('web.resource.systemManage.canshuzhi')}`,
              },
              {
                validator: (rule, value, callback) => {
                  const attr = props[query?.code]
                  const s =
                    query?.code == 'A03' ? translate('web.resource.systemManage.liangweixiaoshu') : '正数且小数最多两位'
                  // translate('web.common.zhenshu')
                  const messageText = `${translate('web.resource.systemManage.bitianshuruzhi')}${s}，${translate(
                    'web.resource.systemManage.shuruqujian',
                  )}[${attr.min},${attr.max}]，${translate('web.resource.systemManage.morenzhi')}：${attr.defaultValue}`

                  if (!value) return callback(messageText)

                  if (query?.code == 'A03') {
                    const decimalPart = value.toString().split('.')[1]
                    if (decimalPart && decimalPart.length > 2) {
                      return callback(messageText)
                    }
                  } else {
                    if (!/^\d+(\.\d{1,2})?$/.test(value)) return callback(messageText)
                  }
                  if (value < attr.min || value >= attr.max) {
                    return callback(messageText)
                  }
                  return callback()
                },
              },
            ]}
          >
            <InputNumber controls={false} />
          </Form.Item>
        )
      case 'A07':
        return (
          <Form.Item
            label={translate('web.resource.systemManage.canshuzhi')}
            name="parameterValue"
            rules={[
              {
                required: true,
                message: `${translate('web.common.qingshuru')}${translate('web.resource.systemManage.canshuzhi')}`,
              },
            ]}
          >
            <Select
              options={[
                {
                  label: translate('web.resource.systemManage.wuxushenhe'),
                  value: '1',
                },
                {
                  label: translate('web.resource.systemManage.xushenhe'),
                  value: '0',
                },
              ]}
            />
          </Form.Item>
        )
      case 'A09':
        return (
          <Form.Item
            label={translate('web.resource.systemManage.canshuzhi')}
            name="parameterValue"
            rules={[
              {
                required: true,
                message: `${translate('web.common.qingshuru')}${translate('web.resource.systemManage.canshuzhi')}`,
              },
            ]}
          >
            <Select options={mallOptions} />
          </Form.Item>
        )
      case 'A10':
        return (
          <Fragment>
            <Form.Item name="parameterValue" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label={translate('web.resource.systemManage.canshuzhi')}
              dependencies={['parameterValue']}
              rules={[
                {
                  required: true,
                  message: `${translate('web.common.qingshuru')}${translate('web.resource.systemManage.canshuzhi')}`,
                },
              ]}
            >
              {({ getFieldValue }) => (
                <div className="upload-box">
                  <SingleCardUpload
                    key={singleCardUploadReloadKey}
                    value={getFieldValue('parameterValue')}
                    onChange={(url) => {
                      form.setFieldValue('parameterValue', url)
                      setSingleCardUploadReloadKey(Date.now())
                    }}
                  />
                  {
                    <div className="size-require">
                      <p>
                        {translate('web.resource.systemManage.zhichijpgpngjpeg')}，
                        <br />
                        {translate('web.resource.systemManage.zuidabuchaoguo')} 5M，
                        <br />
                        {translate('web.resource.systemManage.chicun')}：145x50
                      </p>
                    </div>
                  }
                </div>
              )}
            </Form.Item>
          </Fragment>
        )
      case 'A11':
        return (
          <Fragment>
            <Form.Item
              label={translate('web.resource.systemManage.canshuzhi')}
              name="parameterValue"
              wrapperCol={{
                span: 16,
              }}
              required
              rules={[validator.validateLanguageRequired({ required: true, length: 200 })]}
            >
              <LanguageArrayFormTable maxLength={200} />
            </Form.Item>
            <Form.Item
              label={'备案跳转地址'}
              name="url"
              rules={[
                {
                  pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                  message: '请输入有效的URL链接',
                },
              ]}
            >
              <Input maxLength={200} />
            </Form.Item>
          </Fragment>
        )
      case 'A12':
        return (
          <Space direction="vertical" size={16}>
            <LineTitle>移动端品牌 LOGO</LineTitle>
            <Form.Item name="logo" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label={'品牌Logo'}
              dependencies={['logo']}
              rules={[
                {
                  required: true,
                  message: `${translate('web.common.qingshuru')}${translate('web.resource.systemManage.canshuzhi')}`,
                },
              ]}
            >
              {({ getFieldValue }) => (
                <div className="upload-box">
                  <SingleCardUpload
                    key={singleCardUploadReloadKey}
                    value={getFieldValue('logo')}
                    maxSize={5}
                    onChange={(url) => {
                      form.setFieldValue('logo', url)
                      setSingleCardUploadReloadKey(Date.now())
                    }}
                  />
                  {
                    <div className="size-require">
                      <p>
                        {translate('web.resource.systemManage.zhichijpgpngjpeg')}，
                        <br />
                        {translate('web.resource.systemManage.zuidabuchaoguo')} 5M，
                        <br />
                        {translate('web.resource.systemManage.chicun')}：50x50
                      </p>
                    </div>
                  }
                </div>
              )}
            </Form.Item>
            <LineTitle>启动页</LineTitle>
            <Form.Item
              label={'启动页名称'}
              name="appName"
              wrapperCol={{
                span: 16,
              }}
              required
              rules={[validator.validateLanguageRequired({ required: true, length: 200 })]}
            >
              <LanguageArrayFormTable maxLength={30} />
            </Form.Item>
            <Form.Item
              label={'标题'}
              name="title"
              wrapperCol={{
                span: 16,
              }}
              required
              rules={[validator.validateLanguageRequired({ required: true, length: 200 })]}
            >
              <LanguageArrayFormTable maxLength={50} />
            </Form.Item>
            <Form.Item
              label={'标语'}
              name="slogen"
              wrapperCol={{
                span: 16,
              }}
              required
              rules={[validator.validateLanguageRequired({ required: true, length: 200 })]}
            >
              <LanguageArrayFormTable maxLength={100} />
            </Form.Item>
            <LineTitle>登录页</LineTitle>
            <Form.Item
              label={'欢迎语称呼'}
              name="welcomeCall"
              wrapperCol={{
                span: 16,
              }}
              required
              rules={[validator.validateLanguageRequired({ required: true, length: 200 })]}
            >
              <LanguageArrayFormTable maxLength={50} />
            </Form.Item>
            <Form.Item
              label={'欢迎语'}
              name="welcome"
              wrapperCol={{
                span: 16,
              }}
              required
              rules={[validator.validateLanguageRequired({ required: true, length: 200 })]}
            >
              <LanguageArrayFormTable maxLength={50} />
            </Form.Item>
          </Space>
        )
      default:
        return (
          <Form.Item
            label={translate('web.resource.systemManage.canshuzhi')}
            name="parameterValue"
            rules={[
              {
                required: true,
                message: `${translate('web.common.qingshuru')}${translate('web.resource.systemManage.canshuzhi')}`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        )
    }
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <Form {...layout} form={form} onFinish={onFinish}>
          {renderFormByCode()}
          <Form.Item {...tailLayout}>
            <Space size={24}>
              <Button type="primary" htmlType="submit">
                {translate('web.common.save')}
              </Button>
              <Popconfirm
                onConfirm={confirmCancel}
                title={translate('web.resource.systemManage.quedingyaozhixingzheigecaozuo')}
                okText={translate('web.common.confirm')}
                cancelText={translate('web.common.cancel')}
              >
                <Button>{translate('web.common.cancel')}</Button>
              </Popconfirm>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>
  )
}

export default Template
