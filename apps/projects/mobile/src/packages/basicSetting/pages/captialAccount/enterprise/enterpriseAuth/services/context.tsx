import { Form, StandardForm } from '@apps/mobile-ui'
import React, { createContext, useContext, useState } from 'react'

export interface FromProps {
  // 通联企业用户名称
  companyName: string
  // 法人姓名
  name: string
  // 法人证件类型(目前只支持身份证) 1 - 身份证 2 - 护照 3 - 军官证。。
  cardType: any
  // 法人证件号码
  cardNo: string
  // 法人手机号码
  phone: string
  // 企业对公账户
  accountNo: string
  // 请输入支付行号
  bankNo: string
  // 必须
  // 请输入支付行号
  bankName: string
  // 必须
  // 开户银行名称
  branchName: string
  // 会员电子协议编号
  ContractNo: string
  // 非必须
  // 法人所需证件以及营业照照片
  // picUrl: string
  // 非必须
  // 会员类型 2 - 企业会员 3 - 个人会员
  memberType: any
  uniCredit: any
}

export enum BUTTON_STATUS {
  /**
   * 待提交审核
   */
  READY_SUBMIT = 1,

  /**
   * 审核中
   */
  APPROVED = 2,

  /**
   * 重新提交审核
   */
  REPLAY_SUBMIT = 3,

  /**
   * 下一步
   */
  NEXT_STEP = 4,

  /**
   * 完成认证
   */
  FINISH_SUBMIT = 5,

  /**
   * 完成认证(禁用状态)
   */
  FINISH_SUBMIT_DISABLED = 6,
}

const initContextValue = () => {
  const [formItems, setFormItems] = useState<FromProps>({
    // 通联企业用户名称
    companyName: '',
    // 法人姓名
    name: '',
    // 法人证件类型(目前只支持身份证) 1-身份证 2-护照 3-军官证。。。
    cardType: '',
    // 法人证件号码
    cardNo: '',
    // 法人手机号码
    phone: '',
    // 企业对公账户
    accountNo: '',
    // 请输入支付行号
    bankNo: '',
    // 必须
    // 开户银行名称
    bankName: '',
    // 必须
    // 请输入支付行号
    branchName: '',
    // 会员电子协议编号
    ContractNo: '',
    // 非必须
    // 法人所需证件以及营业照照片
    // picUrl: '',
    // 非必须
    // 会员类型 2 - 企业会员 3 - 个人会员
    memberType: '',
    uniCredit: '',
  })

  const [form] = StandardForm.useForm()
  const [bankName, setbankName] = useState('')
  const [buttonStatus, setButtonStatus] = useState<BUTTON_STATUS>(BUTTON_STATUS.REPLAY_SUBMIT)

  return {
    formItems,
    setFormItems,
    bankName,
    setbankName,
    buttonStatus,
    setButtonStatus,
    form,
  }
}

export type EAccountFormContextProps = ReturnType<typeof initContextValue>

const EAccountFormContext = createContext<EAccountFormContextProps>({} as EAccountFormContextProps)

export const useEAccountContext = () => {
  return useContext(EAccountFormContext)
}

export const EAccountFormProvider = ({ children }) => {
  const value = initContextValue()

  return <EAccountFormContext.Provider value={value}>{children}</EAccountFormContext.Provider>
}
