import { useState } from 'react'

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
  picUrl: string
  // 非必须
  // 会员类型 2 - 企业会员 3 - 个人会员
  memberType: any
  uniCredit: any
}

export const useAccountForm = () => {
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
    picUrl: '',
    // 非必须
    // 会员类型 2 - 企业会员 3 - 个人会员
    memberType: '',
    uniCredit: '',
  })

  return {
    formItems,
    setFormItems,
  }
}
