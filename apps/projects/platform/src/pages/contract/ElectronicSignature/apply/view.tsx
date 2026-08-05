import React, { useState } from 'react'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import {
  ExclamationCircleFilled,
  CheckCircleFilled,
  ClockCircleFilled,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Button, Space, Spin } from 'antd'
import { postContractSignatureAuthOrgAuth, postContractSignatureAuthPersonalAuth } from '@apps/apis'
import { authService } from '@apps/services'
import Personal from './services/components/personal'
import Enterprise from './services/components/enterprise'
import { AuthButton } from '@apps/components'
import useApply from './services/hooks/useApply'
import { Form } from '@linkseeks/ui'

const Apply: React.FC = () => {
  const { memberType } = authService.getAuth() || {}
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const intl = useIntl()
  /**头部状态的颜色值
   * 申请状态 0-未申请 1-申请中 2-申请不通过 3-申请通过
   */
  const applyStaus = {
    0: {
      name: intl.formatMessage({ id: 'contract.weishenqing', defaultMessage: '未申请' }),
      icon: <ExclamationCircleFilled />,
      color: '#909399',
    },
    1: {
      name: intl.formatMessage({ id: 'contract.shenhezhong', defaultMessage: '认证授权中' }),
      icon: <ClockCircleFilled />,
      color: '#4279DF',
    },
    2: {
      name: intl.formatMessage({ id: 'contract.shouquanyiguoqi', defaultMessage: '授权已过期' }),
      icon: <ExclamationCircleOutlined />,
      color: 'rgba(145, 149, 155, 1)',
    },
    3: {
      name: intl.formatMessage({ id: 'contract.shenqingtongguo', defaultMessage: '已申请' }),
      icon: <CheckCircleFilled />,
      color: '#00A98F',
    },
  }
  const { currentState, signatureDetail, signatureForm, spinLoading, setCurrentState, refresh } = useApply()

  /**电子签章认证申请 */
  const AuthApply = async () => {
    signatureForm.validateFields().then((values) => {
      setSubmitLoading(true)
      const params = {
        ...values,
        redirectUrl: window.location.href,
      }

      // 法人认证，把法人信息填到经办人
      if (values.authType === 1) {
        params.transactorName = values.legalRepName
        params.transactorIdCardNum = values.legalRepIdCardNum
        params.transactorMobile = values.legalRepMobile
      }

      if (memberType === 1) {
        // 企业认证
        postContractSignatureAuthOrgAuth(params)
          .then((res) => {
            if (res.code === 1000 && res.data) {
              refresh()
              window.location.href = res.data
            }
            setSubmitLoading(false)
          })
          .catch(() => {
            setSubmitLoading(false)
          })
      } else {
        // 个人认证
        postContractSignatureAuthPersonalAuth(params)
          .then((res) => {
            if (res.code === 1000 && res.data) {
              refresh()
              window.location.href = res.data
            }
            setSubmitLoading(false)
          })
          .catch(() => {
            setSubmitLoading(false)
          })
      }
    })
  }

  const retryOpenAuthLink = () => {
    let link = ''
    if (memberType === 1) {
      if (signatureDetail?.organization?.authUrl) {
        link = signatureDetail?.organization?.authUrl
      }
    } else {
      if (signatureDetail?.personal?.authUrl) {
        link = signatureDetail?.personal?.authUrl
      }
    }
    if (link) {
      window.location.href = link
    }
  }

  const handleRetryApply = () => {
    setCurrentState(0)
  }

  return (
    <PageHeaderWrapper>
      <div className={styles.apply_info}>
        <Spin spinning={spinLoading}>
          <div className={styles.apply_status}>
            <div className={styles.status} style={{ backgroundColor: applyStaus[currentState]?.color }}>
              {applyStaus[currentState]?.icon}
            </div>
            <div className={styles.status_text}>{applyStaus[currentState]?.name}</div>
            <div className={styles.apply_status_btn}>
              {currentState === 0 && (
                <AuthButton type="custom" code="apply">
                  <Button loading={submitLoading} size="middle" onClick={AuthApply} type="primary">
                    {intl.formatMessage({ id: 'contract.lijishenqing', defaultMessage: '立即申请' })}
                  </Button>
                </AuthButton>
              )}
              {currentState === 1 && (
                <Space>
                  <AuthButton type="custom" code="apply">
                    <Button size="middle" type="link" onClick={handleRetryApply}>
                      {intl.formatMessage({
                        id: 'contract.electronicSignature.apply.retry',
                        defaultMessage: '重新发起',
                      })}
                    </Button>
                  </AuthButton>
                  <AuthButton type="custom" code="apply">
                    <Button size="middle" type="primary" onClick={retryOpenAuthLink}>
                      {intl.formatMessage({
                        id: 'contract.electronicSignature.apply.retryLink',
                        defaultMessage: '重新打开链接',
                      })}
                    </Button>
                  </AuthButton>
                </Space>
              )}
              {currentState === 2 && (
                <Space>
                  <AuthButton type="custom" code="apply">
                    <Button loading={submitLoading} size="middle" type="primary">
                      {intl.formatMessage({
                        id: 'contract.electronicSignature.apply.retryAuth',
                        defaultMessage: '重新认证授权',
                      })}
                    </Button>
                  </AuthButton>
                </Space>
              )}
            </div>
          </div>
          <Form
            form={signatureForm}
            labelAlign="left"
            labelCol={{
              span: 5,
            }}
            wrapperCol={{
              span: 16,
            }}
          >
            {
              // 个人认证
              memberType === 2 && (
                <Personal detail={signatureDetail?.personal} editable={currentState === 0} form={signatureForm} />
              )
            }
            {
              // 企业认证
              memberType === 1 && (
                <Enterprise detail={signatureDetail?.organization} editable={currentState === 0} form={signatureForm} />
              )
            }
          </Form>
        </Spin>
      </div>
    </PageHeaderWrapper>
  )
}

export default Apply
