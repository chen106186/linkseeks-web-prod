import React from 'react'
import { PATTERN_MAPS } from '@/constants/regExp'
import MellowCard from '@/components/MellowCard'
import Select from '@/components/Select'
import Form from '../../components/Form'
import { RuleObject } from '../../components/Form/typings'
import CustomInput from '../../components/CustomInput'
import CustomUpload from '../../components/CustomUpload'
import AreaSelect from '../../components/AreaSelect'
import RegisterDataList from '../../components/RegisterDataList'
import { ElementsItemType } from '../../components/SupplierProfile'

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
  attr?: { [key: string]: any }
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
  /**
   * 会员注册资料配置子字段 ,ConfigDetailVO
   */
  configs?: ElementType[]
  /**
   *
   */
  registers?: ElementType[][]
}

export type GroupsType = {
  /**
   * 组名
   */
  groupName: string
  /**
   * 元素
   */
  elements: ElementType[]
}[]

export type FieldType = 'string' | 'long' | 'upload' | 'radio' | 'select' | 'checkbox' | 'area' | 'list' | (string & {})

// 判断表单元素是否真的有值
const fieldHasValue = (fieldType: FieldType, value: any): boolean => {
  switch (fieldType) {
    case 'string':
    case 'long':
    case 'radio':
    case 'select':
      return !!value
    case 'upload':
    case 'checkbox':
      return value && value.length > 0
    case 'area':
      return value && !!value.provinceCode
    default:
      return true
  }
}

// 字段校验规则枚举：0-无校验规则，1-邮箱规则，2-手机号码规则，3-身份证规则，4-电话号码规则
const RULE_REG_MAP = {
  1: PATTERN_MAPS.email,
  2: PATTERN_MAPS.phone,
  3: PATTERN_MAPS.identity,
  4: PATTERN_MAPS.tel,
}

export type FormGroupsType = {
  /**
   * 组名
   */
  title: string
  /**
   * 字段
   */
  fields: FormFieldType[]
}[]

export type FormFieldType = {
  /**
   * 字段标题
   */
  title: string
  /**
   * 字段名称
   */
  fieldName: string
  /**
   * 占位
   */
  placeholder?: string
  /**
   * 校验规则
   */
  rules: RuleObject[]
  /**
   * 是否禁用
   */
  disabled: boolean
  /**
   * 下拉、多选、复选选项
   */
  enum?: { label?; value? }[]
  /**
   * 字段默认值
   */
  default: any
  /**
   * 对应的组件
   */
  xComponent: 'Input' | 'Select' | 'AreaSelect' | 'Upload' | 'List'
  /**
   * 对应的组件属性
   */
  xComponentProps: Record<string, any>
}

export const getFieldType = (field: ElementType, editable: boolean = true): FormFieldType => {
  const isDisabled = (!editable && fieldHasValue(field.fieldType!, field.fieldValue)) || !!field.disabled

  // 公共的属性
  const commonFieldProps: FormFieldType = {
    title: field.fieldLocalName!,
    fieldName: field.fieldName!,
    placeholder: field.fieldRemark,
    disabled: isDisabled,
    default: field.fieldValue,
    rules: [
      field.fieldEmpty === 0
        ? {
            required: true,
            message: `${field.fieldLocalName}是必填字段`,
          }
        : null,
      field.ruleEnum
        ? {
            pattern: RULE_REG_MAP[field.ruleEnum],
            message: field.msg,
          }
        : null,
      // paas平台删除了配置正则的接口相关
      // (
      //   field.pattern
      //     ? {
      //       pattern: new RegExp(field.pattern),
      //       message: field.msg,
      //     }
      //     : null
      // ),
    ].filter(Boolean) as unknown as RuleObject[],
    xComponent: 'Input',
    xComponentProps: {},
  }

  switch (field.fieldType as FieldType) {
    case 'file':
    case 'upload': {
      commonFieldProps.xComponent = 'Upload'
      break
    }
    case 'radio': {
      commonFieldProps.enum = field.fieldEnum
      commonFieldProps.xComponent = 'Select'
      break
    }
    case 'select': {
      commonFieldProps.enum = field.fieldEnum
      commonFieldProps.xComponent = 'Select'
      break
    }
    case 'checkbox': {
      commonFieldProps.enum = field.fieldEnum
      commonFieldProps.xComponent = 'Select'
      commonFieldProps.xComponentProps = {
        multiple: true,
      }
      break
    }
    case 'area': {
      commonFieldProps.enum = field.fieldEnum
      commonFieldProps.xComponent = 'AreaSelect'
      // 这里判断 省级 是否有值，没值给 undefined
      // 后台没值是返回 {provinceCode: '', cityCode: '', districtCode: ''}
      commonFieldProps.default = field.fieldValue
        ? field.fieldValue.provinceCode
          ? field.fieldValue
          : undefined
        : undefined
      // commonFieldProps.default = {
      //   provinceCode: '340000',
      //   cityCode: '340800',
      //   districtCode: '340803',
      // };
      break
    }
    case 'list': {
      commonFieldProps.enum = field.fieldEnum
      commonFieldProps.xComponent = 'List'
      commonFieldProps.xComponentProps = {
        configs: field.configs,
      }
      const defaultValue = field.registers?.map((registersItem) => {
        const itemValue = {}
        registersItem?.forEach((field) => {
          itemValue[field.fieldName!] = field.fieldValue
        })
        return itemValue
      })
      commonFieldProps.default = defaultValue
      break
    }
    default:
      break
  }
  return commonFieldProps
}

/**
 * 根据后台生成注册资料 schema
 * @param elements
 * @param editable 有值的元素是否可编辑
 * @returns
 */
export function createMemberSchema(groups: GroupsType, editable: boolean = true): FormGroupsType {
  const groupItem: FormGroupsType = []

  if (!Array.isArray(groups)) {
    return groupItem
  }
  for (let i = 0; i < groups.length; i++) {
    const item = groups[i]
    groupItem.push({
      title: item.groupName,
      fields: item.elements.map((element) => getFieldType(element, editable)),
    })
  }
  return groupItem
}

/**
 * 目前渲染是于检验规则分离的
 * @param field
 * @param unified 是否是交由 Form 统一管理状态，默认 true
 * @param extraProps 额外的属性
 * @returns
 */
export function renderFormFieldComponent(
  field: FormFieldType,
  unified = true,
  extraProps?: Record<string, any>,
): JSX.Element | null {
  let node: JSX.Element | null = null

  const provideExtraProps = extraProps || {}

  const renderFormItem = (children: JSX.Element) => (
    <Form.Item label={field.title} name={field.fieldName} initialValue={field.default} key={field.fieldName}>
      {children}
    </Form.Item>
  )

  switch (field.xComponent) {
    case 'Input': {
      node = (
        <CustomInput
          placeholder={field.placeholder || '点击输入'}
          disabled={field.disabled}
          {...field.xComponentProps}
          {...provideExtraProps}
        />
      )
      node = unified ? renderFormItem(node) : node
      break
    }
    case 'Select': {
      node = (
        <Select
          placeholder={field.placeholder || '请选择'}
          disabled={field.disabled}
          title={`选择${field.title}`}
          contentAlign="right"
          options={field.enum as any}
          {...field.xComponentProps}
          {...provideExtraProps}
        />
      )
      node = unified ? renderFormItem(node) : node
      break
    }
    case 'AreaSelect': {
      node = (
        <AreaSelect
          placeholder={field.placeholder || '请选择'}
          disabled={field.disabled}
          contentAlign="right"
          {...field.xComponentProps}
          {...provideExtraProps}
        />
      )
      node = node = unified ? renderFormItem(node) : node
      break
    }
    case 'Upload': {
      node = <CustomUpload disabled={field.disabled} {...field.xComponentProps} {...provideExtraProps} />
      node = node = unified ? renderFormItem(node) : node
      break
    }
    case 'List': {
      node = <CustomUpload disabled={field.disabled} {...field.xComponentProps} {...provideExtraProps} />
      node = unified ? (
        <Form.Item
          name={field.fieldName}
          initialValue={field.default}
          key={field.fieldName}
          customContentStyle={{
            flex: '0 0 100%',
          }}
        >
          <RegisterDataList title={field.title} editable {...(field.xComponentProps as any)} {...provideExtraProps} />
        </Form.Item>
      ) : (
        node
      )
      break
    }

    default:
      break
  }
  return node
}

export function renderRegisterDataFields(data: FormGroupsType): JSX.Element[] {
  const nodes: JSX.Element[] = []
  if (!Array.isArray(data)) {
    return nodes
  }
  for (let i = 0; i < data.length; i++) {
    const group = data[i]
    nodes.push(
      <MellowCard
        title={group.title}
        key={i}
        headStyle={{
          borderBottom: 'none',
        }}
        bodyStyle={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
        ribbon
      >
        {group.fields?.map((item) => renderFormFieldComponent(item))}
      </MellowCard>,
    )
  }
  return nodes
}

// 根据 fieldType 渲染对应的内容
export function renderFieldTypeContent(
  fieldType: FieldType,
  fieldValue: any,
  fieldLocalName?: string,
  registers?: ElementsItemType[][],
): React.ReactNode {
  // 默认渲染 string
  let node: React.ReactNode = fieldValue
  switch (fieldType) {
    case 'file':
    case 'upload':
      node = <CustomUpload value={fieldValue} disabled />
      break
    // todo
    case 'list':
      node = (
        <RegisterDataList
          title={fieldLocalName || ''}
          editable={false}
          configs={[]}
          registers={registers}
          showTitle={false}
        />
      )
      break

    default:
      break
  }
  return node
}

export function getFieldEmptyValue(fieldType: FieldType): any {
  let emptyValue: any = ''
  switch (fieldType) {
    case 'area':
      emptyValue = undefined
      break
    case 'checkbox':
      emptyValue = undefined
      break
    case 'radio':
      emptyValue = undefined
      break
    case 'select':
      emptyValue = undefined
      break
    case 'upload':
      emptyValue = undefined
      break
    case 'list':
      emptyValue = []
      break
    default:
      break
  }
  return emptyValue
}

/**
 * 获取注册字段 fieldName map
 * @param data 注册资料
 * @returns
 */
export const convertFilesToNamesArr = (data: FormGroupsType): string[] => {
  const result: string[] = []
  data.forEach((_item) => {
    if (_item && _item.fields.length) {
      _item.fields.forEach((ele) => {
        result.push(ele.fieldName!)
      })
    }
  })
  return result
}
