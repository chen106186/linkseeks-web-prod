import { Button, Row, Input, Form } from '@linkseeks/ui'
import { UserIcon, LockIcon, VerificationIcon } from '@linkseeks/icons'
import cx from 'classnames'
import { Link } from '@linkseeks/router-core'
import VerifyModal from '../components/VerifyModal'
import style from './style.less'
import useSceneList from './services/useSceneList'
import SceneList from './components/sceneList'
import useLogin from './services/useLogin'

export default () => {
  const { sceneList } = useSceneList()
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
  } = useLogin()

  const hidePhoneNumber = (phoneNumber: string) => {
    // 使用正则表达式匹配手机号中的数字部分
    const regex = /(\d{3})(\d{4})(\d{4})/
    // 将中间的数字部分替换为星号
    const maskedNumber = phoneNumber.replace(regex, (_, prefix, middle, suffix) => {
      const maskedMiddle = '*'.repeat(middle.length) // 将中间部分替换为星号
      return `${prefix}${maskedMiddle}${suffix}`
    })
    return maskedNumber
  }

  const hideEmail = (email: string) => {
    // 使用正则表达式匹配电子邮件地址中的用户名和域名部分
    const regex = /^([^@]+)(@[^.]+\.[^.]+)$/
    // 将用户名部分中间的字符替换为星号
    const maskedEmail = email.replace(regex, (_, username, domain) => {
      const maskedUsername = '*'.repeat(username.length - 2) // 将用户名部分中间的字符替换为星号，保留第一个和最后一个字符
      return `${username[0]}${maskedUsername}${username.slice(-1)}${domain}`
    })
    return maskedEmail
  }

  const hideByType = (value: string | undefined) => {
    if (!value) return ''
    if (checkAccountType === 'phone') {
      return hidePhoneNumber(value)
    } else {
      return hideEmail(value)
    }
  }

  return (
    <div className={style['container-wrap']}>
      <div className={style['content']}>
        <div className={style['left-title']}>B2B业务中台运营平台</div>
        <div className={style['right-content']}>
          <SceneList sceneList={sceneList} />

          <div className={cx(style['login-container'], sceneList.length === 0 && style.round)}>
            <div className={cx(style['login-body'])}>
              <h4>使用平台账户登录</h4>
              <Form form={loginForm} name="normal_login" initialValues={{ remember: true }} onFinish={handleSubmit}>
                <Form.Item name="account" rules={[{ required: true, message: '请输入用户名!' }]}>
                  <Input
                    className={style['login-input']}
                    size="large"
                    prefix={<UserIcon className={style.icon} size={20} />}
                    placeholder="用户账号"
                  />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
                  <Input.Password
                    className={style['login-input']}
                    size="large"
                    prefix={<LockIcon className={style.icon} size={20} />}
                    type="password"
                    placeholder="密码"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    size="large"
                    icon={
                      <span>
                        <VerificationIcon size={18} />
                      </span>
                    }
                    htmlType="submit"
                    type="primary"
                    className={style['login-btn']}
                    loading={checkLoading}
                    block
                  >
                    登录
                  </Button>
                </Form.Item>
                <Row justify="end">
                  <Link to="/user/forget" className={style.link}>
                    忘记密码
                  </Link>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <VerifyModal
        visible={modalVisible}
        setVisible={setModalVisible}
        form={verifyForm}
        onOk={handleAdminVerify}
        onCancel={() => setModalVisible(false)}
        onSmsSend={handleStartSms}
        account={checkAccount}
        type={checkAccountType}
        confirmLoading={confirmLoading}
        accountInfo={accountInfo}
        onCheckTypeChange={handleSwitchCheckoutAccountType}
      />
    </div>
  )
}
