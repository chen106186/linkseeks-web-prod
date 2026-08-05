import React, { useEffect } from 'react'
import type { IAntdSchemaFormProps } from '@apps/formily'
import SchemaForm, {
  createVirtualBox,
  Schema,
  SchemaField,
  FormButtonGroup,
  Reset,
  createControllerBox,
  registerValidationRules,
  Checkbox,
} from '@apps/formily'
import { Button, Row, DatePicker } from 'antd'
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
import Select from './components/Select'
import MultTable from './components/MultTable'
import CustomRegistryPhone from './components/CustomRegistryPhone'
import CustomRelevance from './components/CustomRelevance'
import Children from './components/Children'
import CircleBox from './components/CircleBox'
import Phone from './components/Phone'
import CustomRadio from './components/CustomRadio'
import SearchSelect from './components/SearchSelect'
import TableTagList from './components/TableTagList'
import DateSelect from './components/DateSelect'
import DateRangePickerUnix from './components/DateRangePickerUnix'
import SmilingFace from './components/SmilingFace'
import FixUpload from './components/FixUpload'
import './index.global.less'
import StandardLayout from './components/StandardLayout'
import './reset.global.less'
// import './index.less'
import { currentStateType, getCurrentState } from './utils/keepAlive'
export type NiceFormProps = IAntdSchemaFormProps

const SchemaFormButtonGroup = createVirtualBox('schemaButtonGroup', FormButtonGroup)
const SchemaButton = createVirtualBox('schemaButton', Button)
const SchemaSubmit = createVirtualBox('schemaSubmit', Submit)
const SchemaReset = createVirtualBox('schemaReset', Reset)
export const FlexBox = createVirtualBox('flexBox', (props) => <Row {...props} />)

// 自定义校验规则
registerValidationRules({
  limitByte: (value, desc, rules) => {
    const { allowChineseTransform = true, maxByte } = desc
    let str = value
    let message = `不能超过${maxByte}个字符`
    if (allowChineseTransform) {
      str = str.replace(/[\u4E00-\u9FA5]/g, 'AA')
      message += `,或者${maxByte / 2}个汉字`
    }
    return str.length > maxByte ? message : ''
  },
})

// 该组件用于schema中嵌套表单， 不过控制台会出现警告
const schemaLayout = createControllerBox('schemaLayout', (_props) => {
  const { schema } = _props
  const componentProps = schema.getExtendsComponentProps()
  const { properties } = schema.toJSON()
  const nestedSchema = new Schema({
    type: 'object',
    properties,
  })

  // const { visible, title, onCancel, footer, ...others } = componentProps;

  return (
    <NiceForm>
      <SchemaField schema={nestedSchema}></SchemaField>
    </NiceForm>
  )
})

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
  SmilingFace,
  FixUpload,
  'standard-layout': StandardLayout,
}
const NiceForm: React.FC<NiceFormProps> = (props) => {
  const { children, components, ...reset } = props
  const defineComponents = Object.assign(componentExport, components)

  useEffect(() => {
    const paginationInfo: currentStateType = getCurrentState()
    // 一般 列表检索传入的 controlRender 的 NiceForm 是没有 value 或者 initialValues 的
    // value 或者 initialValues 的，表单页有
    if (
      paginationInfo &&
      window.location.pathname === paginationInfo.pathname &&
      !('value' in reset) &&
      !('initialValues' in reset)
    ) {
      // @ts-ignore
      reset.actions?.setFormState((state) => (state.values = paginationInfo.queryParams))
    }
  }, [])

  return (
    <SchemaForm colon={false} components={defineComponents} {...reset}>
      {children}
    </SchemaForm>
  )
}

NiceForm.defaultProps = {}

export default NiceForm
