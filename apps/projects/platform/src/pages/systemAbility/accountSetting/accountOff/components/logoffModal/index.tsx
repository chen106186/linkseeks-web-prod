import { PageHeaderWrapper } from '@apps/components'
import { Alert, Button, Card, Col, Form, Input, Modal, Row } from '@linkseeks/ui'
import usePhoneVerify from '@apps/services/verify/usePhoneVerify'
import style from './index.less'
import { history } from '@linkseeks/router-manager'
import { useRequestApi, useToggle } from '@linkseeks/hooks'
import { forwardRef, useImperativeHandle } from 'react'
import { encryptedByAES } from '@linkseeks/crypto'
import { getMemberSecurityCancellationSms, postMemberSecurityCancellation } from '@apps/apis'

const RESET_TIME = 120

const LogoffModal = forwardRef<any, any>(({ phone }, ref) => {
  const [form] = Form.useForm()
  const [logoffVisible, logoffToggle] = useToggle(false)
  const { countdown, start, sendLoading, canSend } = usePhoneVerify({
    api: getMemberSecurityCancellationSms,
    codeResetTime: RESET_TIME,
  })
  const { run, loading } = useRequestApi(postMemberSecurityCancellation, {
    manual: true,
    onSuccess() {
      logoffToggle(false)
      history.redirect('/systemAbility/accountSetting/accountOff/success')
    },
  })

  useImperativeHandle(ref, () => ({
    logoffToggle,
  }))

  const Tip = () => (
    <div style={{ marginTop: 4 }}>
      验证码已发出，请注意动态短信，如果没有收到，您可以{<span className={style['phone-count']}>{countdown} s</span>}
      后重新获取
    </div>
  )

  const handleLogOff = async () => {
    try {
      const params = await form.validateFields()
      if (params.smsCode) {
        params.smsCode = encryptedByAES(params.smsCode)
      }
      run(params)
    } catch (err) {}
  }

  return (
    <Modal
      width={720}
      title="确认注销"
      open={logoffVisible}
      onCancel={logoffToggle}
      onOk={handleLogOff}
      okType="primary"
      okButtonProps={{ danger: true }}
      confirmLoading={loading}
    >
      <Alert
        message="提示"
        type="warning"
        showIcon
        description="账号注销后将无法恢复，请谨慎注销。若当前账号是主体账号且有关联的用户子账号,则用户子账号也会被注销。"
      />
      <div className={style['phone-box']}>
        <div className={style['phone-title']}>当前账号手机号</div>
        <div className={style['phone']}>{phone}</div>
      </div>
      <Form form={form}>
        <Form.Item
          help={canSend ? null : <Tip />}
          label="验证码"
          colon={false}
          labelCol={{ span: 4 }}
          labelAlign="left"
          rules={[{ required: true, message: '请填写验证码' }]}
          name="smsCode"
        >
          <Row>
            <Col flex={1}>
              <Input />
            </Col>
            <Col style={{ marginLeft: 24 }}>
              <Button onClick={() => start()} loading={sendLoading} disabled={!canSend}>
                获取验证码
              </Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item name="cancellationReason" label="注销原因" colon={false} labelCol={{ span: 4 }} labelAlign="left">
          <Row>
            <Col flex={1}>
              <Input.TextArea />
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default LogoffModal
