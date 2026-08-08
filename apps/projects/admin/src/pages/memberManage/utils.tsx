import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { PATTERN_MAPS } from '@/constants/regExp'
import { StandardFileList } from '@apps/components'
import ListWrap from './components/ListWrap'

export function coverColFiltersItem(
  data: Array<{ [key: string]: any }>,
  dataIndex: string,
  item: { [key: string]: any },
) {
  const index = data.findIndex((i) => i.dataIndex === dataIndex)

  if (index !== -1) {
    data.splice(index, 1, {
      ...data[index],
      filters: item,
    })
  }
}

// 初始化内部流转记录
export function normalizeInnerHistory(source: { [key: string]: any }[]) {
  const ret: any[] = []

  if (!Array.isArray(source)) {
    return ret
  }

  source.forEach((item) => {
    const atom = {
      id: item.id,
      operator: item.operatorName,
      org: item.operatorOrgName,
      jobTitle: item.operatorJobTitle,
      innerStatusName: item.innerStatusName,
      innerStatus: item.innerStatus,
      operation: item.operation,
      operateTime: item.createTime,
      reason: item.remark,
    }
    ret.push(atom)
  })
  return ret
}

// 初始化外部流转记录
export function normalizeOuterHistory(source: { [key: string]: any }[]) {
  const ret: any[] = []

  if (!Array.isArray(source)) {
    return ret
  }

  source.forEach((item) => {
    const atom = {
      id: item.id,
      roleName: item.operatorRoleName,
      status: item.outerStatus,
      statusName: item.outerStatusName,
      operation: item.operation,
      operateTime: item.createTime,
      reason: item.remark,
    }
    ret.push(atom)
  })
  return ret
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
  fieldType?: FieldType
  /**
   * 字段类型附加属性(该参数为map)
   */
  attr?: { [key: string]: any }
  /**
   * 字段长度
   */
  fieldLength?: number
  /**
   * 是否可为空0-不能为空1-可以为空
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
  registers?: ElementType[]
}

export type GroupItem = {
  /**
   * 组名
   */
  groupName: string
  /**
   * 元素
   */
  elements: ElementType[]
}

export type FieldType =
  | 'string'
  | 'number'
  | 'upload'
  | 'radio'
  | 'select'
  | 'checkbox'
  | 'area'
  | 'list'
  | (string & {})

// 判断表单元素是否真的有值
const fieldHasValue = (fieldType: FieldType, value: any): boolean => {
  switch (fieldType) {
    case 'string':
    case 'number':
    case 'radio':
    case 'select':
      return !!value
    case 'upload':
    case 'checkbox':
      return value && value.length > 0
    case 'area':
      return value && !!value.provinceCode
    case 'list':
      return value && value.length > 0
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

const getFieldType = (field: ElementType, editable: boolean = true) => {
  const isDisabled =
    (!editable &&
      fieldHasValue(field.fieldType as string, field.fieldType === 'list' ? field.configs : field.fieldValue)) ||
    !!field.disabled

  // 默认是 输入框
  let description: { [key: string]: any } = {
    'x-component-props': {
      placeholder: field.fieldRemark,
      disabled: isDisabled,
    },
  }
  // 公共的属性
  const common = {
    type: 'string',
    required: field.fieldEmpty === 0,
    title: field.fieldLocalName,
    default: field.fieldValue,
    'x-rules': [
      field.ruleEnum
        ? {
            pattern: RULE_REG_MAP[field.ruleEnum],
            message: field.msg,
          }
        : null,
      // (
      //   field.pattern
      //     ? {
      //       pattern: field.pattern,
      //       message: field.msg,
      //     }
      //     : null
      // ),
    ].filter(Boolean),
  }

  switch (field.fieldType as FieldType) {
    case 'file': {
      description = {
        'x-component': 'CustomUpload',
        'x-component-props': {
          showDesc: false,
          disabled: isDisabled,
          listType: 'text',
          fileMaxSize: (field.fieldLength || 2) * 1024,
        },
      }
      break
    }
    case 'radio': {
      description = {
        'x-component': 'RadioGroup',
        enum: field.fieldEnum,
        'x-component-props': {
          disabled: isDisabled,
        },
      }
      break
    }
    case 'select': {
      description = {
        enum: field.fieldEnum,
        'x-component-props': {
          disabled: isDisabled,
          allowClear: true,
        },
      }
      break
    }
    case 'checkbox': {
      description = {
        'x-component': 'CheckboxGroup',
        enum: field.fieldEnum,
        'x-component-props': {
          disabled: isDisabled,
        },
      }
      break
    }
    case 'area': {
      description = {
        'x-component': 'AreaSelect',
        'x-component-props': {
          disabled: isDisabled,
        },
        // 这里判断 省级 是否有值，没值给 undefined
        // 后台没值是返回 {provinceCode: '', cityCode: '', districtCode: ''}
        default: field.fieldValue ? (field.fieldValue.provinceCode ? field.fieldValue : undefined) : undefined,
      }
      break
    }
    case 'list': {
      // 回显列表数据
      let detail = []
      detail = field.registers?.map((item) => {
        let obj = {}
        item.forEach((val) => {
          obj[val.fieldName] = val.fieldValue
        })
        return obj
      })

      description = {
        type: 'array',
        default: detail,
        'x-component': 'ArrayTable',
        'x-component-props': {
          disabled: isDisabled,
          renderAddition: () => (
            <div style={{ padding: '2px 0', textAlign: 'center' }}>
              <PlusOutlined /> 添加
            </div>
          ),
          scroll: {
            x: 1200,
          },
        },
        items: {
          type: 'object',
          properties: {},
        },
      }
      const itemsProperties = {}
      ;(field.configs || []).forEach((item) => {
        const fieldType = getFieldType(item, editable)
        itemsProperties[item.fieldName] = {
          ...fieldType,
          'x-props': {
            width: item.fieldType === 'area' ? 800 : 280,
          },
        }
      })
      description.items.properties = itemsProperties
      break
    }
    default:
      break
  }
  return Object.assign({}, common, description)
}

/**
 * 根据后台生成注册资料 schema
 * @param elements
 * @param editable 有值的元素是否可编辑
 * @returns
 */
export function createMemberSchema(elements: ElementType[], editable: boolean = true) {
  const components = {}

  if (!Array.isArray(elements)) {
    return components
  }
  for (let item of elements) {
    components[item.fieldName as string] = getFieldType(item, editable)
  }
  return components
}

/**
 * 根据 fieldType 渲染对应的内容
 * @param fieldType 数据类型
 * @param fieldValue 数据值 (当fieldType为list时，表示当前数据值)
 * @param lastRegisters 当fieldType为list时，表示旧的数据值
 * @returns
 */
export function renderFieldTypeContent(fieldType: FieldType, fieldValue: any): React.ReactNode {
  if (!fieldValue) return '无'
  // 默认渲染 string
  let node
  switch (fieldType) {
    case 'string':
    case 'number':
    case 'radio':
    case 'select':
    case 'checkbox':
    case 'area':
      node = fieldValue
      break
    case 'file':
      node = <StandardFileList fileWidth={88} fileList={[fieldValue]} />
      break
    case 'list':
      node = <ListWrap currentListData={fieldValue} />
      break
    default:
      break
  }
  return node
}
