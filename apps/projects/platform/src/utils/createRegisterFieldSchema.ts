import { ISchema } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'

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
}

export type FieldType = 'string' | 'number' | 'upload' | 'radio' | 'select' | 'checkbox' | 'area' | (string & {})

/**
 * 判断表单元素是否真的有值
 * @param fieldType 字段类型
 * @param value 字段值
 * @returns
 */
export function fieldHasValue(fieldType: FieldType, value: any): boolean {
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
    default:
      return true
  }
}

/**
 * 根据后台生成注册资料 schema
 * @param elements
 * @param editable 有值的元素是否可编辑
 * @returns
 */
export function createRegisterFieldsSchema(elements: ElementType[], editable: boolean = true) {
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
 * 将选项值的 value 转换成 label
 * @param enums
 * @returns
 */
function convertEnumLabelToValue(enums: ElementType['fieldEnum']): ISchema['enum'] {
  const newEnums = enums.map((item) => ({ label: item.label, value: item.label }))
  return newEnums.filter((item, index) => newEnums.findIndex((entity) => entity.value === item.value) === index)
}

// 字段校验规则枚举：0-无校验规则，1-邮箱规则，2-手机号码规则，3-身份证规则，4-电话号码规则
const RULE_REG_MAP = {
  1: PATTERN_MAPS.email,
  2: PATTERN_MAPS.phone,
  3: PATTERN_MAPS.identity,
  4: PATTERN_MAPS.tel,
}

function getFieldType(field: ElementType, editable: boolean = true) {
  const isDisabled = (!editable && fieldHasValue(field.fieldType, field.fieldValue)) || !!field.disabled

  // 默认是 输入框
  let description: { [key: string]: any } = {
    'x-component-props': {
      // placeholder: field.fieldRemark,
      placeholder: field.fieldLocalName,
      disabled: isDisabled,
    },
    title: '',
  }
  // 公共的属性
  const common = {
    type: 'string',
    required: field.fieldEmpty === 0,
    title: field.fieldLocalName,
    default: field.fieldValue,
    // 列表检索不需要字段校验
    // 'x-rules': [
    //   (
    //     field.ruleEnum
    //       ? {
    //         pattern: RULE_REG_MAP[field.ruleEnum],
    //         message: field.msg,
    //       }
    //       : null
    //   ),
    //   // paas平台删除了配置正则的接口相关
    //   // (
    //   //   field.pattern
    //   //     ? {
    //   //       pattern: new RegExp(field.pattern),
    //   //       message: field.msg,
    //   //     }
    //   //     : null
    //   // ),
    // ].filter(Boolean),
  }

  switch (field.fieldType as FieldType) {
    // case 'upload': {
    //   description =  {
    //     'x-component': 'CustomUpload',
    //     'x-component-props': {
    //       showDesc: false,
    //       disabled: isDisabled,
    //     },
    //   };
    //   break;
    // }
    // 渲染成下拉形式
    case 'radio': {
      description = {
        enum: convertEnumLabelToValue(field.fieldEnum),
        'x-component-props': {
          disabled: isDisabled,
          placeholder: field.fieldLocalName,
          allowClear: true,
        },
        title: '',
      }
      break
    }
    // 渲染成下拉形式
    case 'checkbox': {
      description = {
        enum: convertEnumLabelToValue(field.fieldEnum),
        'x-component-props': {
          disabled: isDisabled,
          placeholder: field.fieldLocalName,
          allowClear: true,
        },
        title: '',
      }
      break
    }
    case 'select': {
      description = {
        enum: convertEnumLabelToValue(field.fieldEnum),
        'x-component-props': {
          disabled: isDisabled,
          placeholder: field.fieldLocalName,
          allowClear: true,
        },
        title: '',
      }
      break
    }
    case 'area': {
      description = {
        // 'x-component': 'AreaSelect',
        'x-component': 'MemberRegisterAreaField',
        'x-component-props': {
          disabled: isDisabled,
          placeholder: field.fieldLocalName,
        },
        // 这里判断 省级 是否有值，没值给 undefined
        // 后台没值是返回 {provinceCode: '', cityCode: '', districtCode: ''}
        default: field.fieldValue ? (field.fieldValue.provinceCode ? field.fieldValue : undefined) : undefined,
        title: '',
      }
      break
    }
    default:
      break
  }
  return Object.assign({}, common, description)
}
