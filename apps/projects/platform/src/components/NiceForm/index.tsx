import React, { JSXElementConstructor, useEffect } from 'react'
import SchemaForm, {
  IAntdSchemaFormProps,
  createVirtualBox,
  registerVirtualBox,
  Schema,
  SchemaField,
  FormButtonGroup,
  Reset,
  createControllerBox,
  registerValidationRules,
  Checkbox,
  Radio,
  Switch,
} from '@apps/formily'
import { Row, DatePicker } from 'antd'
import { Loading } from '@apps/components'
import CustomUpload from './components/CustomUpload'
import CustomStatus from './components/CustomStatus'
import CustomAddArray from './components/CustomAddArray'
import CustomSlider from './components/CustomSlider'
import Search from './components/Search'
import CustomInputSearch from './components/CustomInputSearch'
import CustomCategorySearch from './components/CustomCategorySearch'
import Submit from './components/Submit'
import Text from './components/Text'
import CardCheckBox from './components/CardCheckBox'
import MultTable from './components/MultTable'
import CustomRegistryPhone from './components/CustomRegistryPhone'
import CustomRelevance from './components/CustomRelevance'
import Children from './components/Children'
import CircleBox from './components/CircleBox'
import Phone from './components/Phone'
import CustomRadio from './components/CustomRadio'
import Select from './components/Select'
import SearchSelect from './components/SearchSelect'
import TableTagList from './components/TableTagList'
import DateSelect from './components/DateSelect'
import DateRangePickerUnix from './components/DateRangePickerUnix'
import NumberRange from './components/NumberRange'
import VirtualChildren from './components/VirtualChildren'
import SmilingFace from './components/SmilingFace'
import SliderValidate from './components/SliderValidate'
import AntUpload from './components/AntUpload'
import AreaSelect from './components/AreaSelect'
import CustomSelect from './components/CustomSelect'
import CheckboxGroup from './components/CheckboxGroup'
import CustomRadioGroup from './components/CustomRadioGroup'
import CustomAddressSelect from './components/CustomAddressSelect'
import CustomModalForm from './components/CustomModalForm'
import { useLinkComponentProps } from './linkages/linkComponentProps'
import MultAddress from './components/MultAddress'
import CustomAddress from './components/CustomAddress'
import CustomCascader from './components/CustomCascader'
import FixUpload from './components/FixUpload'
import type { currentStateType } from './utils/keepAlive'
import { getCurrentState } from './utils/keepAlive'
import { getIntl } from '@linkseeks/i18n'
import { useLocation } from '@linkseeks/router-core'
import FormItemCard from './components/FormItemCard'
import MiniUnit from './components/MiniUnit'
import IndexField from './components/IndexField'
import './index.less'
import NotFoundContent from './components/NotFoundConent'

export interface NiceFormProps extends IAntdSchemaFormProps {
  loading?: boolean
}
const intl = getIntl()
const SchemaFormButtonGroup = createVirtualBox(
  'schemaButtonGroup',
  FormButtonGroup as unknown as JSXElementConstructor<any> | undefined,
)
export const FlexBox = createVirtualBox('flexBox', (props) => <Row {...props} />)

export const isFieldLegal = (value: any): boolean => {
  if (Array.isArray(value) && !value.length) {
    return false
  }
  // 校验数值 及 字符串数值，这里主要是处理 数值 0 是合法的问题
  if (!isNaN(parseFloat(value))) {
    return true
  }
  // 校验布尔值，若字段值为true/false，符合规则
  if (typeof value === 'boolean') {
    return true
  }

  return !!value
}

// 自定义校验规则
registerValidationRules({
  limitByte: (value, desc) => {
    const { allowChineseTransform = true, maxByte } = desc
    let str = value
    let message = `${intl.formatMessage({
      id: 'components.bunengchaoguo',
    })}${maxByte}${intl.formatMessage({ id: 'components.gezifu' })}`
    if (allowChineseTransform) {
      str = str.replace(/[\u4E00-\u9FA5]/g, 'AA')
      message += `,${intl.formatMessage({ id: 'components.huozhe' })}${maxByte / 2}${intl.formatMessage({
        id: 'components.gehanzi',
      })}`
    }
    return str.length > maxByte ? message : ''
  },
  required: (value, desc) => {
    const { required, message } = desc
    let msg = ''
    if (required) {
      msg = message || `${intl.formatMessage({ id: 'common.bitian' })}`
    }
    return required && !isFieldLegal(value) ? msg : ''
  },
})

// 全局注册card布局组件
registerVirtualBox('MellowCard', ({ children, schema }) => {
  const props = schema['x-component-props']

  return <FormItemCard {...props}>{children}</FormItemCard>
})

// 该组件用于schema中嵌套表单， 不过控制台会出现警告

export const componentExport = {
  CheckboxSingle: Checkbox,
  CustomUpload,
  CustomStatus,
  CustomAddArray,
  CustomSlider,
  CustomRadio,
  Search,
  CustomInputSearch,
  CustomCategorySearch,
  Submit,
  Text,
  CardCheckBox,
  MultTable,
  CustomRegistryPhone,
  CustomRelevance,
  Children,
  CircleBox,
  SchemaFormButtonGroup,
  FlexBox,
  Phone,
  Select,
  SearchSelect,
  DateRangePicker: DatePicker.RangePicker,
  TableTagList,
  DateSelect,
  DateRangePickerUnix,
  NumberRange,
  VirtualChildren,
  SmilingFace,
  SliderValidate,
  RadioGroup: Radio.Group,
  AntUpload,
  MultAddress,
  CustomAddress,
  CustomCascader,
  FixUpload,
  AreaSelect,
  CustomSelect,
  CheckboxGroup,
  CustomRadioGroup,
  CustomAddressSelect,
  Switch,
  MiniUnit,
  Reset,
  CustomModalForm,
  IndexField,
}
const NiceForm: React.FC<NiceFormProps> = (props) => {
  const { children, components, effects, expressionScope, loading = false, schema, ...reset } = props
  const { pathname } = useLocation()

  const defineComponents = Object.assign({ ...componentExport }, { ...components })

  useEffect(() => {
    const paginationInfo: currentStateType = getCurrentState()
    // 一般 列表检索传入的 controlRender 的 NiceForm 是没有 value 或者 initialValues 的
    // value 或者 initialValues 的，表单页有
    if (paginationInfo && pathname === paginationInfo.pathname && !('value' in reset) && !('initialValues' in reset)) {
      reset.actions?.setFormState((state) => (state.values = paginationInfo.queryParams))
    }
  }, [])

  /**
   * 给所有表单想默认添加 allowClear
   * @param schema
   * @returns
   */
  const addAllowClearToSchema = (schema) => {
    const traverse = (node) => {
      if (node) {
        if (node.properties) {
          Object.values(node.properties).forEach(traverse)
        }
        node['x-component-props'] = {
          allowClear: true,
          ...(node['x-component-props'] || {}),
        }
      }
    }
    traverse(schema)
    return schema
  }

  return (
    <div className="god-standard-table-form-controller" style={{ width: '100%', position: 'relative' }}>
      <SchemaForm
        colon={false}
        components={defineComponents}
        style={{ opacity: loading ? 0 : 1, position: loading ? 'absolute' : 'initial' }}
        effects={($, ctx) => {
          // 自定义联动scope收集器
          useLinkComponentProps(expressionScope)

          // 组件联动
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          effects && effects($, ctx)
        }}
        expressionScope={{
          NotFoundContent,
          ...expressionScope,
        }}
        schema={addAllowClearToSchema(schema)}
        {...reset}
      >
        {children}
      </SchemaForm>
      {loading && <Loading />}
    </div>
  )
}

NiceForm.defaultProps = {}

export default NiceForm
