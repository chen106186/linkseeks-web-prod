import { PageHeaderWrapper, CardWrapper, StandardForm } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import { FormItemWrapper, FormLayoutWrapper } from '@apps/services/commodity'
import { Button, Input, Space, message, Select } from '@linkseeks/ui'
import { InitContextProvider, useEAccountInitContext } from './context'
import { postPayMobileEAccountAllInPayUpdateAccountInfo } from '@apps/apis'
import { useState } from 'react'
import { useHistory } from '@linkseeks/router-core'

const Edit = () => {
  const translate = useWebIntl()
  const history = useHistory()
  const { memberInfo, accountDetail, refreshPayMemberInfo, refreshAccountDetail, isEnterprise } =
    useEAccountInitContext()

  const [form] = StandardForm.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true)
      const values = await form.validateFields()
      const params = {
        id: accountDetail?.id,
        companyName: values.companyName,
        uniCredit: values.uniCredit,
        legalName: values.legalName,
        legalPhone: values.legalPhone,
        legalIdentityType: 1,
        legalIds: values.legalIds,
        accountNo: values.accountNo,
        bankName: values.bankName,
        unionBank: values.unionBank,
        bankBranchName: values.bankBranchName,
        phone: values.phone,
      }
      const res = await postPayMobileEAccountAllInPayUpdateAccountInfo(params, { ctlType: 'none' })
      if (res.code === 1000) {
        message.success('保存成功')
        refreshPayMemberInfo()
        refreshAccountDetail()
        // 保存成功后返回上一页
        history.goBack()
      }
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      setSubmitLoading(false)
    }
  }

  const renderEnterprise = () => {
    return (
      <>
        <CardWrapper title="认证信息">
          <StandardForm form={form}>
            <FormLayoutWrapper>
              <FormItemWrapper
                name="companyName"
                label="企业名称"
                rules={[{ required: true, message: '请输入企业名称' }]}
                initialValue={memberInfo?.companyName}
              >
                <Input placeholder="请输入企业名称" />
              </FormItemWrapper>
              <FormItemWrapper
                name="uniCredit"
                label="统一社会信用代码"
                rules={[{ required: true, message: '请输入统一社会信用代码' }]}
                initialValue={memberInfo?.uniCredit}
              >
                <Input placeholder="请输入统一社会信用代码" />
              </FormItemWrapper>
              <FormItemWrapper
                name="legalName"
                label="法人姓名"
                rules={[{ required: true, message: '请输入法人姓名' }]}
                initialValue={memberInfo?.legalName}
              >
                <Input placeholder="请输入法人姓名" />
              </FormItemWrapper>
              <FormItemWrapper
                name="legalPhone"
                label="法人手机号"
                rules={[{ required: true, message: '请输入法人手机号' }]}
                initialValue={memberInfo?.legalPhone}
              >
                <Input placeholder="请输入法人手机号" />
              </FormItemWrapper>
              <FormItemWrapper name="legalIdentityType" label="证件类型" initialValue={1}>
                <span>身份证</span>
              </FormItemWrapper>
              <FormItemWrapper
                name="legalIds"
                label="法人证件号"
                rules={[{ required: true, message: '请输入法人证件号' }]}
                initialValue={memberInfo?.legalIds}
              >
                <Input placeholder="请输入法人证件号" />
              </FormItemWrapper>
              <FormItemWrapper
                name="accountNo"
                label="企业对公账户"
                rules={[{ required: true, message: '请输入企业对公账户' }]}
                initialValue={memberInfo?.accountNo}
              >
                <Input placeholder="请输入企业对公账户" />
              </FormItemWrapper>
              <FormItemWrapper
                name="bankName"
                label="开户银行名称"
                rules={[{ required: true, message: '请输入开户银行名称' }]}
                initialValue={memberInfo?.bankName}
              >
                <Input placeholder="请输入开户银行名称" />
              </FormItemWrapper>
              <FormItemWrapper
                name="bankBranchName"
                label="开户行支行名称"
                rules={[{ required: true, message: '请输入开户行支行名称' }]}
                initialValue={memberInfo?.branchName}
              >
                <Input placeholder="请输入开户行支行名称" />
              </FormItemWrapper>
              <FormItemWrapper
                name="unionBank"
                label="支行行号"
                rules={[{ required: true, message: '请输入支行行号' }]}
                initialValue={memberInfo?.unionBank}
              >
                <Input placeholder="请输入支行行号" />
              </FormItemWrapper>
            </FormLayoutWrapper>
          </StandardForm>
        </CardWrapper>

        <CardWrapper title="绑定手机">
          <StandardForm form={form}>
            <FormLayoutWrapper>
              <FormItemWrapper
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
                ]}
                initialValue={memberInfo?.phone}
              >
                <Input placeholder="请输入手机号" />
              </FormItemWrapper>
            </FormLayoutWrapper>
          </StandardForm>
        </CardWrapper>
      </>
    )
  }

  const renderSelf = () => {
    return (
      <CardWrapper title={translate('web.common.jibenxinxi')}>
        <StandardForm form={form}>
          <FormLayoutWrapper>
            <FormItemWrapper
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
              ]}
              initialValue={memberInfo?.phone}
            >
              <Input placeholder="请输入手机号" />
            </FormItemWrapper>
          </FormLayoutWrapper>
        </StandardForm>
      </CardWrapper>
    )
  }

  return (
    <PageHeaderWrapper
      title="编辑"
      loading={!memberInfo}
      extra={
        <Space>
          <Button type="primary" loading={submitLoading} onClick={handleSubmit} style={{ marginLeft: '15px' }}>
            保存
          </Button>
        </Space>
      }
    >
      {isEnterprise && renderEnterprise()}
      {!isEnterprise && renderSelf()}
    </PageHeaderWrapper>
  )
}

export default () => (
  <InitContextProvider>
    <Edit />
  </InitContextProvider>
)
