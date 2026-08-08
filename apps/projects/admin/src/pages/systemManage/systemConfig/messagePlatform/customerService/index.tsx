import {
  getSupportCustomerServiceConfigGetConfigList,
  postSupportCustomerServiceConfigSaveOrUpdateConfig,
  postSupportCustomerServiceConfigUpdateStatus,
} from '@apps/apis'
import { StandardForm } from '@apps/components'
import { useRequestApi } from '@linkseeks/hooks'
import { Button, Card, Form, Input, message } from '@linkseeks/ui'
import { useMemo, useState } from 'react'
import styles from '../index.less'
import cx from 'classnames'
const CustomerForm = (props) => {
  const { serviceType, title, status, refresh, renderFormItem } = props
  const [customerForm] = StandardForm.useForm()
  const { loading, run } = useRequestApi(postSupportCustomerServiceConfigSaveOrUpdateConfig, {
    manual: true,
    onSuccess({ code }) {
      if (code === 1000) {
        refresh()
      }
    },
  })
  /**
   * 启用/停用客服事件
   * @param serviceType 服务商类型: 1-网易七鱼
   * @param status true: 启用；false：禁用
   */
  const handleChangeCustomerConfigStatus = async (status: boolean) => {
    if (status) {
      const values = await customerForm.validateFields()
      if (!values) {
        return
      }
    }
    postSupportCustomerServiceConfigUpdateStatus({ serviceType, status }).then((res) => {
      if (res.code === 1000) {
        refresh()
      }
    })
  }

  const handleCustomerSubmit = () => {
    customerForm.validateFields().then((values) => {
      run({
        config: values,
        serviceType,
      })
    })
  }

  return (
    <StandardForm form={customerForm} labelCol={{ span: 4 }} wrapperCol={{ span: 6 }}>
      <Card
        key={serviceType}
        title={
          <div className={styles['card-title']}>
            <span>{title}</span>
            <div className={cx(styles['card-title-status'], status ? styles.use : styles.stop)}>
              <div className={styles['card-title-status-circle']}></div>
              <span className={styles['card-title-status-text']}>{status ? '已启用' : '停用中'}</span>
            </div>
          </div>
        }
        bordered={false}
        extra={
          <>
            {status ? (
              <Button danger type="primary" onClick={() => handleChangeCustomerConfigStatus(false)}>
                停用
              </Button>
            ) : (
              <Button type="primary" onClick={() => handleChangeCustomerConfigStatus(true)}>
                启用
              </Button>
            )}

            <Button style={{ marginLeft: '10px' }} type="primary" loading={loading} onClick={handleCustomerSubmit}>
              保存
            </Button>
          </>
        }
        style={{
          marginBottom: 16,
          paddingBottom: 16,
        }}
      >
        {renderFormItem()}
      </Card>
    </StandardForm>
  )
}

const defaultCustomerConfigList: any = [
  {
    serviceType: 1,
    appKey: '',
    status: false,
  },
  {
    serviceType: 2,
    sdkAppId: '',
    sdkKey: '',
    sdkIdentifier: '',
  },
]
const CustomerService = () => {
  const { data, refresh } = useRequestApi(getSupportCustomerServiceConfigGetConfigList)

  const customerConfigList = useMemo(() => {
    if (data) {
      return defaultCustomerConfigList
        .map((defaultItem) => {
          const result = data.find((v) => v.serviceType === defaultItem.serviceType)
          return result || defaultItem
        })
        .map((v: any) => {
          if (v.serviceType === 1) {
            return {
              title: '网易七鱼客服',
              ...v,
              renderFormItem: () => (
                <>
                  <Form.Item
                    name="appKey"
                    label="AppKey"
                    initialValue={v?.config?.appKey as any}
                    rules={[
                      {
                        required: true,
                        message: '请输入企业appKey',
                      },
                    ]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                </>
              ),
            }
          }

          if (v.serviceType === 2) {
            return {
              title: '腾讯IM',
              ...v,
              renderFormItem: () => (
                <>
                  <Form.Item
                    name="sdkAppId"
                    label="sdkAppId"
                    initialValue={v?.config?.sdkAppId as any}
                    rules={[
                      {
                        required: true,
                        message: '请输入sdkAppId',
                      },
                    ]}
                  >
                    <Input placeholder="请输入sdkAppId" />
                  </Form.Item>

                  <Form.Item
                    name="sdkKey"
                    label="sdkKey"
                    initialValue={v?.config?.sdkKey as any}
                    rules={[
                      {
                        required: true,
                        message: '请输入sdkKey',
                      },
                    ]}
                  >
                    <Input placeholder="请输入sdkKey" />
                  </Form.Item>
                  <Form.Item
                    name="sdkIdentifier"
                    label="sdkIdentifier"
                    initialValue={v?.config?.sdkIdentifier as any}
                    rules={[
                      {
                        required: true,
                        message: '请输入sdkIdentifier',
                      },
                    ]}
                  >
                    <Input placeholder="请输入sdkIdentifier" />
                  </Form.Item>
                </>
              ),
            }
          }
        })
    } else {
      return []
    }
  }, [data])
  return (
    <>
      {customerConfigList.map((item) => {
        return <CustomerForm refresh={refresh} {...item} />
      })}
    </>
  )
}

export default CustomerService
