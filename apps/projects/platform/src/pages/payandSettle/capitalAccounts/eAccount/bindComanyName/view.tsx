import React, { useEffect } from 'react'
import {
  CardWrapper,
  FormItemWrapper,
  FormLayoutWrapper,
  PageHeaderWrapper,
  StandardForm,
  StandardFormTable,
  StandardModal,
  StandardValidatePhoneCode,
} from '@apps/components'
import { Alert, Button, Input, message, Modal, Space, Steps, Tag } from '@linkseeks/ui'
import usePhoneVerify from '@apps/services/verify/usePhoneVerify'
import {
  postPayAllInPayMemberRegAndBindPhoneApply,
  postPayAllInPayMemberRegAndBindPhoneConfirm,
  postPayAllInPayRegisterCompanyMember,
} from '@apps/apis'
import { useHistory } from '@linkseeks/router-core'
import { useEAccountInitContext } from '../context'
import { useEAccountMemberInfo } from '@apps/services/eAccount'

const BindComanyName = () => {
  const [form] = StandardForm.useForm()
  const history = useHistory()
  const {
    memberInfo,
    refreshPayMemberInfo,
    payMemberInfoLoading,
    isFinishProcess,
    isFinishMoneyProcess,
    isExpiredProcess,
    isExistProcess,
  } = useEAccountMemberInfo()

  useEffect(() => {
    refreshPayMemberInfo()
  }, [])

  const formModalRef = StandardModal.useRef()
  useEffect(() => {
    if (isFinishMoneyProcess) {
      // 只是填写了手机号时，就已经可以使用功能了
      history.replace('/payandSettle/capitalAccounts/eAccount')
    }
  }, [isFinishMoneyProcess])
  const handleSubmit = async (isReAuth = false) => {
    if (isReAuth) {
      // 重新发起
      formModalRef.current.toggle()
      return
    }
    if (isFinishProcess) {
      history.replace('/payandSettle/capitalAccounts/eAccount')
    }
    const values = await form.validateFields()

    handleOpenAuth(values)
  }

  const handleOpenAuth = async (values, isReAuth = false) => {
    const result = await postPayAllInPayRegisterCompanyMember({
      ...values,
      jumpUrl: location.href,
      isReAuth,
    })

    if (result.code === 1000) {
      window.location.href = result.data.regInviteLink
    } else {
      message.error(result.message)
    }
  }

  const stepItems = [
    {
      title: (
        <Space>
          <span>企业信息采集</span>
          <Tag color="orange">必须</Tag>
        </Space>
      ),
      description: memberInfo?.companyName || '进行中',
    },
    {
      title: (
        <Space>
          <span>绑定手机</span>
          <Tag color="orange">必须</Tag>
        </Space>
      ),
      description: memberInfo?.phone || '进行中',
    },
    {
      title: (
        <Space>
          <span>账户提现协议签约</span>
          <Tag>非必须</Tag>
        </Space>
      ),
      description: memberInfo?.acctProtocolNo || '进行中',
    },
  ]

  const renderSubTitle = () => {
    if (isExpiredProcess) {
      return '已过期'
    }
    return isFinishProcess ? '已完成' : '认证中'
  }

  return (
    <PageHeaderWrapper
      loading={!memberInfo}
      subTitle={renderSubTitle()}
      extra={
        <Space>
          {(memberInfo?.companyName || isExpiredProcess) && (
            <Button danger onClick={() => handleSubmit(true)}>
              重新发起
            </Button>
          )}
          <Button type="primary" onClick={() => handleSubmit(false)}>
            {isFinishProcess || isExpiredProcess ? '返回首页' : '立即申请'}
          </Button>
        </Space>
      }
    >
      <CardWrapper title="企业信息">
        <StandardForm form={form}>
          <FormLayoutWrapper>
            <FormItemWrapper
              name="companyName"
              label="企业名称"
              rules={[{ required: true }]}
              initialValue={isExpiredProcess ? '' : memberInfo?.companyName}
            >
              {memberInfo?.companyName ? <span>{memberInfo?.companyName}</span> : <Input />}
            </FormItemWrapper>
          </FormLayoutWrapper>
        </StandardForm>
      </CardWrapper>

      <Alert
        banner
        message="完成 ①-企业信息采集、②-绑定手机号 即可进行交易支付；如需开通账户提现功能，可选择签署 ③-账户提现协议签约。"
        type="warning"
      ></Alert>
      <br />
      <CardWrapper title="认证进度">
        <Steps current={memberInfo?.step} direction="vertical" items={stepItems}></Steps>
      </CardWrapper>

      <StandardModal
        title="重新发起认证"
        onSubmit={(values) => handleOpenAuth(values, true)}
        actionRef={formModalRef}
        formProps={{ labelCol: { span: 8 }, wrapperCol: { span: 16 } }}
        formItemList={[{ name: 'companyName', children: <Input />, label: '企业名称', rules: [{ required: true }] }]}
      ></StandardModal>
    </PageHeaderWrapper>
  )
}

export default BindComanyName
