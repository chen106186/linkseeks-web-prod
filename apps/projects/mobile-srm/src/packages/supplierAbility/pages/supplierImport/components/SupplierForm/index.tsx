/*
 * @Description: 新增会员Form组件，用于新增及编辑
 */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { showToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { Steps, View, Button } from '@apps/mobile-ui'
import { Item } from '@apps/mobile-ui/packages/types/steps'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import { PATTERN_MAPS } from '@/constants/regExp'
import { encryptedByAES } from '@linkseeks/crypto'
import {
  getMemberMobileImportPageitemsBasic,
  getMemberMobileImportPageitemsDetail,
  getMemberMobileImportPageitemsRole,
} from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Space from '@/components/Space'
import Select, { SelectOptions } from '@/components/Select'
import Form from '@/packages/supplierAbility/components/Form'
import CustomInput from '@/packages/supplierAbility/components/CustomInput'
import { RuleObject } from '@/packages/supplierAbility/components/Form/typings'
import { validateFields } from '@/packages/supplierAbility/components/Form/utils/validateUtil'
import {
  convertFilesToNamesArr,
  createMemberSchema,
  FormGroupsType,
  renderRegisterDataFields,
} from '@/packages/supplierAbility/common/utils/createMemberSchemaUtil'
import ChannelInfoFormItems from './components/ChannelInfoFormItems'
import './index.scss'
import { useTelCode } from '@apps/services'

const getSteps = (channel: boolean) =>
  [{ desc: '供应商基本信息' }, channel ? { desc: '渠道信息' } : null].filter(Boolean) as Item[]

const defaultRules = new Map([
  [
    'memberType',
    [
      {
        required: true,
        message: '请选择供应商类型',
      },
    ],
  ],
  [
    'roleId',
    [
      {
        required: true,
        message: '请选择供应商角色',
      },
    ],
  ],
  [
    'countryCodeId',
    [
      {
        required: true,
        message: '请选择电话区号',
      },
    ],
  ],
  [
    'phone',
    [
      {
        required: true,
        message: '请输入注册手机号',
      },
      // 不需要了
      // {
      //   pattern: PATTERN_MAPS.phone,
      //   message: '请输入正确格式的手机号',
      // },
    ],
  ],
  [
    'password',
    [
      {
        required: true,
        message: '请输入密码',
      },
    ],
  ],
  [
    'email',
    [
      {
        pattern: PATTERN_MAPS.email,
        message: '请输入正确格式的邮箱',
      },
    ],
  ],
])

export type FormSubmitValuesType = {
  /**
   * 会员类型id
   */
  memberType: number
  /**
   * 会员角色id
   */
  roleId: number
  /**
   * 国际电话区号
   */
  countryCodeId: number
  /**
   * 电话号码
   */
  phone: string
  /**
   * 邮箱
   */
  email: string
} & Record<string, any>

export type SupplierDetailsType = FormSubmitValuesType

export type SubmitValuesType = FormSubmitValuesType & {
  /**
   * 会员注册资料
   */
  detail?: Record<string, any>
}

export type CountryCodeResType = {
  value: number
  label: string
  /**
   * 手机号码位数
   */
  phoneLength: number
}[]

export interface SupplierFormProps {
  /**
   * 供应商信息，用于表单回填
   */
  value?: SupplierDetailsType
  /**
   * 提交触发事件
   */
  onSubmit?: (values: SubmitValuesType) => void
  /**
   * 表单值改变触发事件
   */
  onValuesChange?: () => void
}

const SupplierForm: React.FC<SupplierFormProps> = (props: SupplierFormProps) => {
  const { value, onSubmit, onValuesChange } = props

  const [memberTypes, setMemberTypes] = useState<SelectOptions>([])
  const [countryCodes, setCountryCodes] = useState<SelectOptions>([])
  const [memberRoles, setMemberRoles] = useState<SelectOptions>([])
  const { telColOptions } = useTelCode()
  const [
    visibleChannel,
    // setVisibleChannel,
  ] = useState(false)
  const [registerData, setRegisterData] = useState<FormGroupsType>([])

  const [step, setStep] = useState(0)

  const rules = useRef<Map<string, RuleObject[]>>(new Map(defaultRules))
  // 注册资料校验规则，与基础信息 rulus 作区分
  const registerRules = useRef<Map<string, RuleObject[]>>(new Map([]))

  const formInitial = useRef(false)

  const [form] = Form.useForm()
  const { safeBottomHeight } = useSafeArea()
  // 会员类型、注册手机下拉框
  const fetchPageitemsBasic = async () => {
    try {
      const res = await getMemberMobileImportPageitemsBasic()
      if (res.code === 1000) {
        const { memberTypes = [] } = res.data || {}
        return {
          memberType: memberTypes.map((item) => ({ label: item.memberTypeName, value: item.memberType })),
          // countryCodeId: countryCodes.map((item) => ({
          //   label: item.text,
          //   value: item.id,
          //   phoneLength: item.phoneLength,
          // })),
        }
      }
      return null
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    fetchPageitemsBasic().then((res) => {
      if (res) {
        setMemberTypes(res.memberType)
        // setCountryCodes(res.countryCodeId)
        // countryCodeRes.current = res.countryCodeId
        // // 手动触发联动
        // if (value && value.countryCodeId) {
        //   handleCountryCodeValueChange(value.countryCodeId)
        // }
      }
    })
  }, [])

  useEffect(() => {
    if (value && !formInitial.current) {
      formInitial.current = true
      form.setFieldsValue(value)

      // 手动触发联动
      handleMemberTypeValueChange(value.memberType)
      handleMemberRoleValueChange(value.roleId)
      // handleCountryCodeValueChange(value.countryCodeId)
    }
  }, [value])

  // 会员类型值改变联动
  const handleMemberTypeValueChange = (next: number) => {
    // 获取会员角色
    getMemberMobileImportPageitemsRole({
      memberType: `${next}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { data = [] } = res
          const options = data.map((item) => ({ label: item.roleName, value: item.roleId }))
          setMemberRoles(options)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
  }

  // 会员类型手动输入联动
  const handleMemberTypeInputChange = (next: number) => {
    setMemberRoles([])
    form.setFieldsValue({
      roleId: undefined,
      // level: undefined, // 暂无
      // channelTypeId: undefined, // 清空渠道原来数据
      // areas: [], // 清空渠道原来数据
      // remark: '', // 清空渠道原来数据
      // upperRelationId: '', // 清空渠道原来数据
    })
    handleMemberTypeValueChange(next)
    // 手动触发会员角色值联动
    handleMemberRoleValueChange(undefined)
  }

  // 会员角色值改变联动
  const handleMemberRoleValueChange = (next?: number) => {
    if (!next) {
      setRegisterData([])
      return
    }
    // 重新赋值
    registerRules.current = new Map([])
    getMemberMobileImportPageitemsDetail({
      roleId: `${next}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { data = [] } = res
          const registerDataGroups = createMemberSchema(data)
          registerDataGroups.forEach((group) => {
            if (group.fields && group.fields.length) {
              group.fields.forEach((field) => {
                registerRules.current.set(field.fieldName, field.rules)
              })
            }
          })
          setRegisterData(registerDataGroups)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
  }

  // 会员角色手动输入联动
  const handleMemberRoleChange = (next: number) => {
    handleMemberRoleValueChange(next)
  }

  // 电话区号值变化联动
  const handleCountryCodeValueChange = (next: string) => {
    const current = telColOptions.find((item) => item.value === next)
    if (current && current.phoneLength !== undefined) {
      rules.current.set('phone', [
        {
          required: true,
          message: '请输入注册手机号',
        },
        {
          validator: (_, value) => {
            return value?.length !== current.phoneLength
              ? Promise.reject(new Error(`注册手机号不等于${current.phoneLength}位数`))
              : Promise.resolve()
          },
        },
      ])
    }
  }

  // 电话区号变化联动检验规则
  const handleCountryCodeChange = (next: number) => {
    handleCountryCodeValueChange(next)
    form.setFieldsValue({
      phone: undefined, // 清空电话
    })
  }

  // 渠道信息获取回调
  // const handleChannelFetchCallback = (provided: boolean) => {
  //   if (provided) {
  //     setVisibleChannel(true);
  //   }
  // };

  const handleFinish = async (values: any) => {
    // 校验基础信息
    const valueErrors = await validateFields(values, rules.current)
    if (valueErrors.length) {
      showToast({ title: valueErrors[0].errors?.[0], icon: 'none' })
      return
    }
    // 校验注册资料
    const registerValueErrors = await validateFields(values, registerRules.current)
    if (registerValueErrors.length) {
      showToast({ title: registerValueErrors[0].errors?.[0], icon: 'none' })
      return
    }
    const { memberType, roleId, countryCodeId, phone, email, password, ...detail } = values
    const registerNames = convertFilesToNamesArr(registerData)
    const registerDetails: Record<string, any> = {}

    // 由于注册资料是schema是动态的
    // 当选择完一个角色，并且编辑了动态生成的字段
    // 此时 form 是已经收集到值了
    // 这个是否如果切换角色并生成不同的注册资料，最终提交上个角色生成并编辑过的注册资料并没有移除
    // 所以这里再做一层判断
    for (const key in detail) {
      if (Object.prototype.hasOwnProperty.call(detail, key) && registerNames.includes(key)) {
        const value = detail[key]
        registerDetails[key] = value
      }
    }
    const params: SubmitValuesType = {
      memberType,
      roleId,
      telCode: countryCodeId,
      // 加密传输
      phone: encryptedByAES(phone),
      password: encryptedByAES(password),
      email,
      detail: registerDetails,
    }
    onSubmit?.(params)
  }

  const handleCommit = () => {
    form.submit()
  }

  const handleValuesChange = () => {
    onValuesChange?.()
  }

  const steps = useMemo(
    () => getSteps(visibleChannel).concat(registerData.map((item) => ({ desc: item.title }))),
    [visibleChannel, registerData],
  )

  const handleNext = async () => {
    if (step >= steps.length - 1) {
      return
    }
    // 只校验当前步骤下的字段，只有通过了再能进入下一步
    let currentRules: Map<string, RuleObject[]> = new Map()
    if (step === 0) {
      currentRules = rules.current
    } else {
      const currentGroup = registerData[step - 1]
      if (currentGroup) {
        const rulesMap = new Map()
        currentGroup.fields.forEach((field) => {
          rulesMap.set(field.fieldName, field.rules)
        })
        currentRules = rulesMap
      }
    }
    const formValue = form.getFieldsValue()
    const valueErrors = await validateFields(formValue, currentRules)
    if (valueErrors.length) {
      showToast({ title: valueErrors[0].errors?.[0], icon: 'none' })
      return
    }
    setStep(step + 1)
  }

  const handlePrev = () => {
    setStep(step - 1)
  }

  const firstStep = useMemo(() => step === 0, [step])

  const lastStep = useMemo(() => steps.length > 0 && step === steps.length - 1, [steps, step])

  return (
    <View className="supplier-form">
      <View className="supplier-form-steps">
        <Steps items={steps} current={step} onChange={(current) => setStep(current)} />
      </View>
      <View className="supplier-form-section">
        <Form form={form} onFinish={handleFinish} onValuesChange={handleValuesChange}>
          {/* 基本信息 */}
          <MellowCard
            title="供应商基本信息"
            headStyle={{
              borderBottom: 'none',
            }}
            bodyStyle={{
              paddingTop: 0,
              paddingBottom: 0,
            }}
            style={{
              display: step === 0 ? 'block' : 'none',
            }}
            ribbon
          >
            <Form.Item label="供应商类型" name="memberType">
              <Select
                title="选择供应商类型"
                placeholder="请选择"
                options={memberTypes}
                contentAlign="right"
                onChange={handleMemberTypeInputChange}
              />
            </Form.Item>
            <Form.Item label="供应商角色" name="roleId">
              <Select
                title="选择供应商角色"
                placeholder="请选择"
                options={memberRoles}
                contentAlign="right"
                onChange={handleMemberRoleChange}
              />
            </Form.Item>
            <Form.Item label="电话区号" name="countryCodeId">
              <Select
                title="选择电话区号"
                placeholder="请选择"
                options={telColOptions}
                contentAlign="right"
                onChange={handleCountryCodeChange}
              />
            </Form.Item>
            <Form.Item label="注册手机号" name="phone">
              <CustomInput placeholder="点击输入" />
            </Form.Item>
            <Form.Item label="登录密码" name="password">
              <CustomInput password placeholder="点击输入" />
            </Form.Item>
            <Form.Item label="注册邮箱" name="email">
              <CustomInput placeholder="(选填)请输入" />
            </Form.Item>
          </MellowCard>
          {/* 渠道信息，暂时不做*/}
          {/* <ChannelInfoFormItems
            memberType={1}
            form={form}
            onFetchCallback={handleChannelFetchCallback}
          /> */}
          {/* 注册资料 */}
          {renderRegisterDataFields(registerData).map((item, index) => (
            <View style={{ display: index + 1 === step ? 'block' : 'none' }} key={index}>
              {item}
            </View>
          ))}
        </Form>
      </View>
      <View
        className="supplier-form-actions"
        style={{
          paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
        }}
      >
        <Space>
          {!firstStep ? (
            <Button type="secondary" onClick={handlePrev}>
              上一步
            </Button>
          ) : null}
          {(firstStep && steps.length > 1) || (!firstStep && !lastStep && steps.length > 1) ? (
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          ) : null}
          {lastStep ? (
            <Button type="primary" onClick={handleCommit}>
              提交审核
            </Button>
          ) : null}
        </Space>
      </View>
    </View>
  )
}

export default SupplierForm
