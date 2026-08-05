import React, { Fragment } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Form, Input, Button } from '@linkseeks/ui'
import { UserOutlined, LockOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import styles from './index.less'
import VerifyModal from '../../components/VerifyModal'
import { useInitLoginContext } from '../services/context'

const intl = getIntl()
const LoginWrap: React.FC<any> = () => {
  const {
    verifyForm,
    loginForm,
    confirmLoading,
    checkLoading,
    checkAccount,
    checkAccountType,
    modalVisible,
    accountInfo,
    handleSubmit,
    setModalVisible,
    handleStartSms,
    handleAdminVerify,
    handleSwitchCheckoutAccountType,
    loginDataRef,
  } = useInitLoginContext()

  const handleChange = (changeValue, values) => {
    loginDataRef.current = { ...values }
  }
  return (
    <Fragment>
      <p>{intl.formatMessage({ id: 'user.qingshiyongpingtaizhanghaodeng', defaultMessage: '请使用平台账号登录' })}</p>
      <Form onFinish={(value) => handleSubmit(value)} form={loginForm} onValuesChange={handleChange}>
        <Form.Item
          name="account"
          rules={[
            {
              required: true,
              message: (
                <>
                  <ExclamationCircleFilled style={{ marginRight: 6 }} />
                  <span>{intl.formatMessage({ id: 'user.qingshuruzhengquedeyonghu' })}</span>
                </>
              ),
            },
          ]}
        >
          <Input
            className={styles.loginInput}
            prefix={<UserOutlined />}
            placeholder={intl.formatMessage({ id: 'user.yonghumingshoujihao' })}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: (
                <>
                  <ExclamationCircleFilled style={{ marginRight: 6 }} />
                  <span>{intl.formatMessage({ id: 'user.qingshuruzhengquedemima' })}</span>
                </>
              ),
            },
          ]}
        >
          <Input.Password
            className={styles.loginInput}
            prefix={<LockOutlined />}
            placeholder={intl.formatMessage({ id: 'user.qingshurumima' })}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" disabled={checkLoading} loading={checkLoading} size="large" htmlType="submit" block>
            {intl.formatMessage({ id: 'user.denglu' })}
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  )
}

export default LoginWrap
