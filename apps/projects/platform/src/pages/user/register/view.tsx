import React, { useState, useEffect, Fragment, useRef } from 'react'
import { Steps, Button, Form } from 'antd'
import globalStyles from '@/global/styles/global.less'
import cx from 'classnames'
import { Helmet } from 'react-helmet'
import { Link } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { omit, filterUndef } from '@/utils'
import { encryptedByAES } from '@linkseeks/crypto'
import AccountInfo from './components/AccountInfo'
import Roles from './components/Roles'
import Info from './components/Info'
import WaitExamine from './components/WaitExamine'
import styles from './index.less'
import useInviteCode from './services/hooks/useInviteCode'
import { userRegister } from './services/features'
import { formatListFieldData } from './services/utils'
import { useWebIntl } from '@apps/locales'

const intl = getIntl()

interface UseTypeItem {
  memberType: number
  memberTypeName: string
  memberRole: {
    memberRoleId: number
    memberRoleName: string
  }[]
}

let timeChange: any // 定时器

const UserRegistry: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [isNeedAudit, setIsNeedAudit] = useState<boolean>(true)
  const [listFieldTypeKeys, setListFieldTypeKeys] = useState<string[]>([])
  const [memberType, setMemberType] = useState<string>('')
  const [registerForm] = Form.useForm()
  const { inviteCodeInfo } = useInviteCode({ form: registerForm })
  const translate = useWebIntl()
  const rolesRef = useRef<any>(null)
  // 是否开启了SAAS多租户部署
  // const isSaas = GlobalConfig.global.siteInfo.enableMultiTenancy === 1

  const stepList = [
    { title: intl.formatMessage({ id: 'user.tianxiexinxi' }), key: 'message', name: 'message' },
    { title: intl.formatMessage({ id: 'user.wanshanziliao' }), key: 'over', name: 'over' },
    { title: intl.formatMessage({ id: 'user.dengdaishenhe' }), key: 'wait', name: 'wait' },
    // { title: intl.formatMessage({ id: 'user.zhucechenggong' }), key: 'success', name: 'success' },
  ]

  const [time, setTime] = useState(5) // timer

  useEffect(() => {
    if (current === 2) runTimerJump()
  }, [current])

  useEffect(() => {
    if (time === 0) {
      clearInterval(timeChange)
      setTime(60)
      history.push('/user/login')
    }
  }, [time])

  const runTimerJump = () => {
    timeChange = setInterval(() => setTime((t) => --t), 1000)
  }

  const handleActionBtn = () => {
    registerForm.validateFields().then(() => {
      setCurrent(1)
    })
  }

  const goLogin = () => {
    history.goLogin()
  }
  // 提交注册成功后
  const submitForm = () => {
    registerForm.validateFields().then(async (values) => {
      let data = {
        ...values,
      }
      // 处理列表表格数据
      if (listFieldTypeKeys && listFieldTypeKeys.length > 0) {
        data = formatListFieldData(data, listFieldTypeKeys)
      }
      const params = omit(filterUndef(data), ['isRead', 'confirmPassword'])
      params.phone = encryptedByAES(params.phone)
      params.password = encryptedByAES(params.password)
      params.smsCode = encryptedByAES(params.smsCode)
      if (params.email) {
        params.email = encryptedByAES(params.email, false)
      }
      setSubmitLoading(true)
      // 如果有邀请码信息则，注册时传入邀请码
      if (inviteCodeInfo) {
        params.invitationCode = encryptedByAES(inviteCodeInfo.invitationCode)
      }
      params.memberType = rolesRef?.current?.getMemberType(params.memberRoleId) || ''
      try {
        const { code, data } = await userRegister(params)
        if (code === 1000) {
          setCurrent(2)
          setIsNeedAudit(!data.verify)
        } else {
          setCurrent(0)
        }
        setSubmitLoading(false)
      } catch (err) {
        setSubmitLoading(false)
      }
    })
  }
  return (
    <Fragment>
      <Helmet>
        <title>{intl.formatMessage({ id: 'user.yonghuzhuce' })}</title>
      </Helmet>
      <div className={cx(styles.register, globalStyles.content1024)}>
        <div className={cx(styles.registerBox, globalStyles.lingxiBusinessMarginContent)}>
          <div>
            <Steps current={current} className={styles.stepWrap} size="small">
              {stepList.map((v) => (
                <Steps.Step title={v.title} key={v.key}></Steps.Step>
              ))}
            </Steps>
          </div>
          <div className={cx(styles.registerContainer, current !== 0 ? styles.grey : '')}>
            <Form form={registerForm} layout="vertical">
              {/* 填写信息 */}
              {/* 选择会员类型和角色 */}
              <Roles form={registerForm} show={current === 0} ref={rolesRef} />
              <AccountInfo form={registerForm} show={current === 0} />
              {/* 完善资料 */}
              <Info
                form={registerForm}
                show={current === 1}
                onNextAction={() => submitForm()}
                updateListKeys={(keys) => setListFieldTypeKeys(keys)}
              />
              {/* 等待审核 */}
              <WaitExamine show={current === 2} isNeedAudit={isNeedAudit} time={time} />
            </Form>
            <div>
              {current === 0 && (
                <Fragment>
                  <Button type="primary" className={styles.continueButton} onClick={handleActionBtn}>
                    {intl.formatMessage({
                      id: 'user.tongyixieyibingzhuce',
                      defaultMessage: '同意协议并注册',
                    })}
                  </Button>
                  <p className={styles.readyLogin}>
                    {intl.formatMessage({
                      id: 'user.yiyoupingtaizhanghao',
                      defaultMessage: '已有平台账号?',
                    })}{' '}
                    <Button type="link" ghost onClick={() => history.push('/user/login')}>
                      {intl.formatMessage({ id: 'user.qudenglu' })}
                    </Button>
                  </p>
                </Fragment>
              )}
              {current === 1 && (
                <div className={styles.continueButtonWrap}>
                  <Button type="primary" className={styles.continueButton} onClick={submitForm} loading={submitLoading}>
                    {intl.formatMessage({
                      id: 'user.tijiaozhuceziliao',
                      defaultMessage: '提交注册资料',
                    })}
                  </Button>
                  <Button
                    ghost
                    type="link"
                    onClick={() => {
                      setCurrent(0)
                    }}
                  >
                    {translate('web.resource.member.fanhuishangyibu')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default UserRegistry
