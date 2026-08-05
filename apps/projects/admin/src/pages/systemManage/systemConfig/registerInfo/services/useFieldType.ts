import { Form } from '@linkseeks/ui'

const useFieldType = (formInstance) => {
  const fieldTypeValue = Form.useWatch('fieldType', formInstance)

  return {
    // 文本类型
    isTextType: fieldTypeValue === 'string',
    isfileType: fieldTypeValue === 'file',
    isCheckType: fieldTypeValue === 'checkbox',
    isRadioType: fieldTypeValue === 'radio',
    isSelectType: fieldTypeValue === 'select',
    isListType: fieldTypeValue === 'list',
    isNumberType: fieldTypeValue === 'number',
    isAddressType: fieldTypeValue === 'address',
    isTrue: !!fieldTypeValue,
  }
}

export default useFieldType
