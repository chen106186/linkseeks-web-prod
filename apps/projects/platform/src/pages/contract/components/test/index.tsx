import React, { useEffect, useState } from 'react'
import { Result, Button, Form, Input, Select, Row, Col } from 'antd'
import styles from '../index.less'
import { getIntl } from '@linkseeks/i18n'
import { getTelCodeOptions } from '@apps/services'
const intl = getIntl()
interface queryProps {
  actionRef?: any
  authType: number
}
const Test: React.FC<queryProps> = (props) => {
  const { actionRef, authType } = props
  const { Option } = Select
  const [form] = Form.useForm()
  const [options, setOptions] = useState<any>([])

  // 手机号码验证
  const userPhoneRule = (rule, value) => {
    const RegExp = /^1[345678]\d{9}$/gi
    if (!value) {
      return Promise.reject(new Error(intl.formatMessage({ id: 'contract.qingshurunindeshoujihao' })))
    }
    if (!RegExp.test(value)) {
      return Promise.reject(new Error(intl.formatMessage({ id: 'contract.shoujihaomageshibuzheng' })))
    }
    return Promise.resolve()
  }

  const hadnleValidateFields = () => {
    return new Promise((resolve) => {
      form
        .validateFields()
        .then((values) => {
          const data = JSON.stringify(values)
          sessionStorage.setItem('formdata', data)
          console.log(values, 10086)
          resolve(true)
        })
        .catch((errorInfo) => {
          console.log(errorInfo)
        })
    })
  }
  useEffect(() => {
    if (actionRef) {
      const userAction = {
        validateFields: () => hadnleValidateFields(),
      }
      if (actionRef && typeof actionRef === 'function') {
        actionRef(userAction)
      }
      if (actionRef && typeof actionRef !== 'function') {
        actionRef.current = userAction
      }
    }
    getTelCodeOptions().then((data) => {
      setOptions(data)
      form.setFieldsValue({
        code: data[0],
      })
    })
  }, [])

  return (
    <div className={styles.info_wrap}>
      <div className={styles.info_item}>
        <div className={styles.info_item_con}>
          <Form form={form}>
            {authType !== 3 ? (
              <>
                <Form.Item
                  label={intl.formatMessage({ id: 'contract.gongsimingcheng' })}
                  name="orgName"
                  colon={false}
                  rules={[{ required: true, message: intl.formatMessage({ id: 'contract.qingshurujingbanren' }) }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={intl.formatMessage({ id: 'contract.tongyishehuixinyongdaima' })}
                  name="orgCode"
                  colon={false}
                  rules={[{ required: true, message: intl.formatMessage({ id: 'contract.tongyishehuixinyongdaima' }) }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={intl.formatMessage({ id: 'contract.farenxingming' })}
                  name="legalRepName"
                  colon={false}
                  rules={[{ required: true, message: intl.formatMessage({ id: 'contract.farenxingming' }) }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={intl.formatMessage({ id: 'contract.farenshoujihao' })}
                  colon={false}
                  required={true}
                  style={{ marginBottom: '0px' }}
                >
                  <Row gutter={24}>
                    <Col span={7}>
                      <Form.Item
                        style={{ width: '150px' }}
                        name="code"
                        rules={[{ required: true, message: intl.formatMessage({ id: 'contract.qingxuanzequhao' }) }]}
                      >
                        <Select style={{ width: '100%' }}>
                          {options.map((v) => (
                            <Option key={v} value={v}>
                              {v}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={17}>
                      <Form.Item
                        style={{ width: '398px' }}
                        name="legalRepMobile"
                        rules={[{ required: true, validator: userPhoneRule }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item
                  label={intl.formatMessage({ id: 'contract.farenshenfenzhenghao' })}
                  name="legalRepIdNo"
                  colon={false}
                  rules={[
                    { required: true, message: intl.formatMessage({ id: 'contract.qingshurushenfenzhenghaoma' }) },
                  ]}
                >
                  <Input />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  label={intl.formatMessage({ id: 'contract.xingming' })}
                  name="transactorName"
                  colon={false}
                  rules={[{ required: true, message: intl.formatMessage({ id: 'contract.xingming' }) }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={intl.formatMessage({ id: 'contract.shoujihao' })}
                  colon={false}
                  required={true}
                  style={{ marginBottom: '0px' }}
                >
                  <Row gutter={24}>
                    <Col span={7}>
                      <Form.Item
                        style={{ width: '150px' }}
                        name="code"
                        rules={[{ required: true, message: intl.formatMessage({ id: 'contract.qingxuanzequhao' }) }]}
                      >
                        <Select style={{ width: '100%' }}>
                          {options.map((v) => (
                            <Option key={v} value={v}>
                              {v}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={17}>
                      <Form.Item
                        style={{ width: '398px' }}
                        name="transactorMobile"
                        rules={[{ required: true, validator: userPhoneRule }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item
                  label={intl.formatMessage({ id: 'contract.shenfenzhenghao' })}
                  name="transactorIdNumber"
                  colon={false}
                  rules={[
                    { required: true, message: intl.formatMessage({ id: 'contract.qingshurushenfenzhenghaoma' }) },
                  ]}
                >
                  <Input />
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Test
