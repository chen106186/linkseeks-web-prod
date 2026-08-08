import React, { RefObject, useEffect } from 'react'
import {
  FormItemWrapper,
  FormLayoutWrapper,
  PageHeaderWrapper,
  StandardForm,
  StandardFormTable,
  StandardModal,
  StandardModalRefProps,
} from '@apps/components'
import { FormInstance } from 'antd'
import { Button, Input, Space } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import { useRequestApi } from '@linkseeks/hooks'
import { postPayEAccountAllInPayCashOut } from '@apps/apis'
import { useEAccountInitContext } from '../context'

const details = {}
const GetMoneyModal = ({
  modalRef,
  form,
  transcationRecordRef,
}: {
  modalRef: RefObject<StandardModalRefProps>
  form: FormInstance
  transcationRecordRef: any
}) => {
  const translate = useWebIntl()
  const { refreshAccountDetail, memberInfo, isSelf, accountDetail } = useEAccountInitContext()
  const { run, loading } = useRequestApi(postPayEAccountAllInPayCashOut, {
    manual: true,
    onSuccess({ code }) {
      if (code === 1000) {
        modalRef.current?.toggle()
        refreshAccountDetail()
        transcationRecordRef.current.reload()
      }
    },
  })
  const handleSubmit = async () => {
    const values = await form.validateFields()
    const money = Number(values.money)
    if (money > 0 && accountDetail?.usableBalance && money <= accountDetail?.usableBalance) {
      const params = {
        ...values,
        // bankCardNo: isSelf ? memberInfo?.bankNo : memberInfo?.accountNo,
      }
      run(params)
    }
    // const amount = Number(values.amount)
    // if (amount > 0 && amount <= details.usableBalance) {
    //   // 大于0并且小于可用金额
    //   let params = {
    //     money: amount,
    //     bankCardNo: details.bankNo,
    //   }
    //   postPayEAccountAllInPayCashOut(params).then(({ code, data }) => {
    //     if (code === 1000) {
    //       getAccountInfo()
    //       refTrade.current.reloadCurrent()
    //       withdrawForm.resetFields()
    //       setWithdrawVisible(false)
    //     }
    //     setLoading(false)
    //   })
    // } else {
    //   setLoading(false)
    //   message.error(intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.applyWithdraw.error' }))
    // }
  }

  const getAllMoney = () => {
    form.setFieldValue('money', accountDetail?.usableBalance)
  }

  const GetMoneyInput = ({ value, onChange }: any) => {
    return (
      <Space>
        <Input value={value} onChange={onChange} addonBefore={translate('web.common.currencySymbol')} />
        <Button type="link" onClick={getAllMoney}>
          {translate('public.quanbutixian')}
        </Button>
      </Space>
    )
  }
  return (
    <StandardModal
      actionRef={modalRef}
      title={translate('public.zhanghutixian')}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
    >
      <StandardForm form={form}>
        <FormLayoutWrapper>
          <FormItemWrapper label={translate('public.zhanghumingchen')} name="name">
            <span>{memberInfo?.name || memberInfo?.companyName}</span>
          </FormItemWrapper>

          <FormItemWrapper label={translate('public.yinhangzhanghao')}>
            <span>{memberInfo?.bankNo || memberInfo?.accountNo}</span>
          </FormItemWrapper>

          <FormItemWrapper label={translate('public.kaihuhang')}>
            <span>{memberInfo?.bankName}</span>
          </FormItemWrapper>

          <FormItemWrapper
            label={translate('public.tixianjine')}
            name="money"
            extra={`最多可提现${accountDetail?.usableBalance}`}
            full
            labelCol={{ span: 3 }}
          >
            <GetMoneyInput />
          </FormItemWrapper>
        </FormLayoutWrapper>
      </StandardForm>
    </StandardModal>
  )
}

export default GetMoneyModal
