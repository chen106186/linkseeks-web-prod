import { useState, useEffect, useRef } from 'react'
import { message, Form, FormInstance } from 'antd'
import {
  getManageMemberNoticeFindByColumnTypeMemberInfo,
  getMemberCustomerAbilityInfoApplyDepositDetail,
  getMemberCustomerAbilityInfoApplyDetail,
  postMemberCustomerAbilityInfoApply,
} from '@apps/apis'
import { FILE_TYPE_ENUM } from './useFileType'

interface UseApplyStepProps {
  /** 店铺商家会员id */
  upperMemberId: number
  /** 店铺商家角色id */
  upperRoleId: number
}

export interface FieldType {
  /**
   * 分组内的字段顺序
   */
  fieldOrder?: number
  /**
   * 字段类型
   */
  fieldType?: string
  /**
   * 字段中文名称
   */
  fieldLocalName?: string
  /**
   * 字段名称
   */
  fieldName?: string
  /**
   * 字段值
   */
  fieldValue?: string
  /**
   * 修改之前的值，如果没有为空字符串
   */
  lastValue?: string
  /**
   * 入库资料
   */
  registers?: {}
  /**
   * 入库资料,修改之前的值，如果没有为空列表
   */
  lastRegisters?: {}
}

export type ElementType = {
  /**
   * 注册资料id
   */
  id?: number
  /**
   * 字段名称
   */
  fieldName?: string
  /**
   * 中文名称
   */
  fieldLocalName?: string
  /**
   * 字段类型
   */
  fieldType?: string
  /**
   * 字段类型附加属性(该参数为map)
   */
  attr?: Record<string, any>
  /**
   * 字段长度
   */
  fieldLength?: number
  /**
   * 是否可为空 0-不能为空 1-可以为空
   */
  fieldEmpty?: number
  /**
   * 字段顺序
   */
  fieldOrder?: number
  /**
   * 帮助信息
   */
  fieldRemark?: string
  /**
   * 枚举标签列表
   */
  fieldEnum?: {
    value?: number
    label?: string
  }[]
  /**
   * 字段校验规则枚举：0-无校验规则，1-邮箱规则，2-手机号码规则，3-身份证规则，4-电话号码规则
   */
  ruleEnum?: number
  /**
   * 校验规则的正则表达式
   */
  pattern?: string
  /**
   * 校验错误的提示语
   */
  msg?: string
  /**
   * 值
   */
  fieldValue?: any
  /**
   * 是否禁用
   */
  disabled?: boolean
  /*
   * 列表数据
   */
  configs?: ElementType[]
  /*
   * 列表数据展示
   */
  registers?: ElementType[][]
}

/**
 * 会员注册信息分组内容
 */
export interface RegisterDetailType {
  /**
   * 分组名称
   */
  groupName: string
  /**
   * 分组内的元素
   */
  elements: FieldType[]
}

/**
 * 入库资料分组内容
 */
export interface DepositDetailType {
  /**
   * 分组名称
   */
  groupName: string
  /**
   * 分组内的元素
   */
  elements: ElementType[]
}

export interface ApplyStepReturn {
  agreement: string | undefined
  registerInfo: RegisterDetailType[]
  depositInfo: DepositDetailType[]
  submitLoading: boolean
  depositForm: FormInstance<any>
  getRegisterInfo: () => Promise<RegisterDetailType[]>
  getDepositInfo: () => Promise<DepositDetailType[]>
  applyMember: () => void
}

const useApplyStep = (props: UseApplyStepProps): ApplyStepReturn => {
  const { upperMemberId, upperRoleId } = props
  const [agreement, setAgreement] = useState<string>()
  const [registerInfo, setRegisterInfo] = useState<RegisterDetailType[]>([])
  const [depositInfo, setDepositInfo] = useState<DepositDetailType[]>([])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const listFieldTypeKeysRef = useRef<string[]>([])
  const [depositForm] = Form.useForm()

  // 店铺会员协议 - 取值于原“商家入库协议”的内容显示。
  const getDepositAgreement = async () => {
    const res = await getManageMemberNoticeFindByColumnTypeMemberInfo({
      columnType: '3',
      memberId: `${upperMemberId}`,
      roleId: `${upperRoleId}`,
    })
    if (res.code === 1000) {
      setAgreement(res.data && res.data.length ? res.data[0].content : '')
    }
  }

  /**
   * 获取注册资料
   */
  const getRegisterInfo = async (): Promise<RegisterDetailType[]> => {
    if (!upperMemberId || !upperRoleId) {
      return []
    }
    const res = await getMemberCustomerAbilityInfoApplyDetail({
      upperMemberId: `${upperMemberId}`,
      upperRoleId: `${upperRoleId}`,
    })
    if (res.code === 1000) {
      if (res.data && res.data.registerDetails) {
        const registerDetails = res.data.registerDetails as RegisterDetailType[]
        setRegisterInfo(registerDetails)
        return registerDetails
      }
    } else {
      message.destroy()
      message.error(res.message)
    }
    return []
  }

  /**
   * 获取入库资料相关
   */
  const getDepositInfo = async () => {
    if (!upperMemberId || !upperRoleId) {
      return []
    }
    const res = await getMemberCustomerAbilityInfoApplyDepositDetail({
      upperMemberId: `${upperMemberId}`,
      upperRoleId: `${upperRoleId}`,
    })
    if (res.code === 1000) {
      const depositDetails = res.data.depositDetails as DepositDetailType[]
      setDepositInfo(depositDetails)
      const listKeys: string[] = []
      depositDetails.forEach((item) => {
        for (const element of item.elements) {
          if (element.fieldType === FILE_TYPE_ENUM.list && element.fieldName) {
            listKeys.push(element.fieldName)
          }
        }
      })
      if (listKeys.length > 0) {
        listFieldTypeKeysRef.current = listKeys
      }
      return depositDetails
    }
    return []
  }

  const formatListFieldData = (values: Record<string, any>, keys: string[]) => {
    const depositDetails = { ...values.depositDetails }
    for (const listKey of keys) {
      const temp = depositDetails[listKey]
      if (temp) {
        const tempList: any[] = []
        Object.keys(temp).forEach((key) => {
          const filed = key.split('-')[0]
          const index = Number(key.split('-')[2])
          if (!tempList[index]) {
            tempList[index] = {}
          }
          tempList[index][filed] = temp[key]
        })
        depositDetails[listKey] = tempList
      }
    }
    return {
      ...values,
      depositDetails,
    }
  }

  const applyMember = async () => {
    try {
      setSubmitLoading(true)
      const depositValues = depositForm.getFieldsValue()
      let params: any = {
        upperMemberId: upperMemberId as number,
        upperRoleId: upperRoleId as number,
        ...depositValues,
      }
      // 处理列表表格数据
      if (listFieldTypeKeysRef.current && listFieldTypeKeysRef.current.length > 0) {
        params = formatListFieldData(params, listFieldTypeKeysRef.current)
      }

      const res = await postMemberCustomerAbilityInfoApply(params, { ctlType: 'none' })
      if (res.code !== 1000) {
        message.error(res.message)
        return false
      }
      return true
    } catch (error) {
      setSubmitLoading(false)
      return true
    }
  }

  useEffect(() => {
    getDepositAgreement()
  }, [])

  return {
    agreement,
    registerInfo,
    depositInfo,
    submitLoading,
    depositForm,
    getRegisterInfo,
    getDepositInfo,
    applyMember,
  }
}

export default useApplyStep
