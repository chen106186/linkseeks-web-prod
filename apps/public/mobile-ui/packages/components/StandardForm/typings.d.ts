import type { ReactElement } from 'react'
import type { FieldProps } from './Field'
import { FormInstance } from './FormStore'

export type StoreValue = any

export type Store = Record<string, any>

export type ValidateRule = {
  max?: number
  min?: number
  len?: number
  required?: boolean
  message?: string
}[]

interface ValueUpdateInfo {
  type: 'valueUpdate'
  source: 'internal' | 'external'
}

interface ResetInfo {
  type: 'reset'
}

export type NotifyInfo = ValueUpdateInfo | ResetInfo

export type ValuedNotifyInfo = NotifyInfo & {
  store: Store
}

export interface FieldEntity {
  onStoreChange: (store: Store, name: string[] | undefined, info: ValuedNotifyInfo) => void
  props: FieldProps
}

export interface Callbacks<Values = any> {
  onValuesChange?: (changedValues: any, values: Values) => void
  onFinish?: (values: Values) => void
}

export type RuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email'

type Validator = (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => Promise<void | any> | void

export type RuleRender = (form: FormInstance) => RuleObject

export interface ValidatorRule {
  warningOnly?: boolean
  message?: string | ReactElement
  validator: Validator
}

interface BaseRule {
  warningOnly?: boolean
  enum?: StoreValue[]
  len?: number
  max?: number
  message?: string | ReactElement
  min?: number
  pattern?: RegExp
  required?: boolean
  transform?: (value: StoreValue) => StoreValue
  type?: RuleType
  whitespace?: boolean

  /** Customize rule level `validateTrigger`. Must be subset of Field `validateTrigger` */
  validateTrigger?: string | string[]
}

type AggregationRule = BaseRule & Partial<ValidatorRule>

interface ArrayRule extends Omit<AggregationRule, 'type'> {
  type: 'array'
  defaultField?: RuleObject
}

export type RuleObject = AggregationRule | ArrayRule

export type Rule = RuleObject | RuleRender

export interface RuleError {
  errors: string[]
  rule: RuleObject
}

export interface ValidateOptions {
  triggerName?: string
  validateMessages?: ValidateMessages
  /**
   * Recursive validate. It will validate all the name path that contains the provided one.
   * e.g. ['a'] will validate ['a'] , ['a', 'b'] and ['a', 1].
   */
  recursive?: boolean
}

type ValidateMessage = string | (() => string)
export interface ValidateMessages {
  default?: ValidateMessage
  required?: ValidateMessage
  enum?: ValidateMessage
  whitespace?: ValidateMessage
  date?: {
    format?: ValidateMessage
    parse?: ValidateMessage
    invalid?: ValidateMessage
  }
  types?: {
    string?: ValidateMessage
    method?: ValidateMessage
    array?: ValidateMessage
    object?: ValidateMessage
    number?: ValidateMessage
    date?: ValidateMessage
    boolean?: ValidateMessage
    integer?: ValidateMessage
    float?: ValidateMessage
    regexp?: ValidateMessage
    email?: ValidateMessage
    url?: ValidateMessage
    hex?: ValidateMessage
  }
  string?: {
    len?: ValidateMessage
    min?: ValidateMessage
    max?: ValidateMessage
    range?: ValidateMessage
  }
  number?: {
    len?: ValidateMessage
    min?: ValidateMessage
    max?: ValidateMessage
    range?: ValidateMessage
  }
  array?: {
    len?: ValidateMessage
    min?: ValidateMessage
    max?: ValidateMessage
    range?: ValidateMessage
  }
  pattern?: {
    mismatch?: ValidateMessage
  }
}
