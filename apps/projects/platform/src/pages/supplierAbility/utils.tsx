import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import { PATTERN_MAPS } from '@/constants/regExp'
import { StandardFileList } from '@apps/components'
const intl = getIntl()
import ListInfo from './components/ListInfo'

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

export function coverColFiltersItem(data: Record<string, any>[], dataIndex: string, item: Record<string, any>) {
  const index = data.findIndex((i) => i.dataIndex === dataIndex)

  if (index !== -1) {
    data.splice(index, 1, {
      ...data[index],
      filters: item,
    })
  }
}

export type FieldType = 'string' | 'number' | 'file' | 'radio' | 'select' | 'checkbox' | 'area' | 'list' | (string & {})

// 判断表单元素是否真的有值
const fieldHasValue = (fieldType: FieldType, value: any): boolean => {
  switch (fieldType) {
    case 'string':
    case 'number':
    case 'radio':
    case 'select':
      return !!value
    case 'file':
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
    (!editable && fieldHasValue(field.fieldType, field.fieldType === 'list' ? field.configs : field.fieldValue)) ||
    !!field.disabled

  // 默认是 输入框
  let description: Record<string, any> = {
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
      // paas平台删除了配置正则的接口相关
      // (
      //   field.pattern
      //     ? {
      //       pattern: new RegExp(field.pattern),
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
        const obj = {}
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
              + {intl.formatMessage({ id: 'common.button.addition', defaultMessage: '添加' })}
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
        // itemsProperties[item.fieldName] = getFieldType(item, editable);
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
  for (const item of elements) {
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
export function renderFieldTypeContent(fieldType: FieldType, fieldValue: any, lastRegisters?: any): React.ReactNode {
  if (!fieldValue) {
    return intl.formatMessage({
      id: 'customerAbility.management.memberPrVerifyComingData.verify.upperMember.null',
      defaultMessage: '无',
    })
  }
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
      node = <ListInfo currentListData={fieldValue} oldListData={lastRegisters ? lastRegisters : null} />
      break
    default:
      break
  }
  return node
}

export type CategoryItemType = {
  /**
   * 数据id
   */
  id: string
  /**
   * 父级id
   */
  parentId: string
  /**
   * 标题
   */
  title: string
  /**
   * 是否选中
   */
  checked: boolean
  /**
   * 图片url路径
   */
  imageUrl: string
  /**
   * 子元素
   */
  children: CategoryItemType[]
}
export function completeCategory(ids: string[], dataSource: CategoryItemType[]): CategoryItemType[] {
  const ret: CategoryItemType[] = []
  if (!Array.isArray(dataSource)) {
    return ret
  }
  ids.forEach((curId, index) => {
    const target = (ret[index - 1]?.children || dataSource).find((item) => item.id === curId)
    if (target) {
      ret.push(target)
    }
  })
  return ret
}

/**
 * 获取入库信息锚点key
 * @param index 索引
 * @returns
 */
export const getIncomingInfoAnchorKey = (index: number) => `incomingInfo-${index}`

/**
 * 获取注册字段 fieldName map
 * @param data 注册资料
 * @returns
 */
export const convertFilesToNamesArr = (data: GroupItem[]): string[] => {
  const result = []
  data.forEach((_item) => {
    if (_item.elements && _item.elements.length) {
      _item.elements.forEach((ele) => {
        result.push(ele.fieldName)
      })
    }
  })
  return result
}
