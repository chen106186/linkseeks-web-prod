import { Input } from '@linkseeks/ui'
import {
  InputAttrFormItem,
  FormItemWrapper,
  CATEGORY_ATTR_NAME_PREFIX,
  SPECS_ATTR_NAME_PREFIX,
} from '@apps/services/commodity'
import { useMemo } from 'react'

const InputFormItem = ({ isMust, name, id, isPrice }: InputAttrFormItem) => {
  const ATTR_NAME_PREFIX = useMemo(() => {
    return isPrice ? SPECS_ATTR_NAME_PREFIX : CATEGORY_ATTR_NAME_PREFIX
  }, [isPrice])
  return (
    <FormItemWrapper label={name} rules={[{ required: isMust }]} name={[ATTR_NAME_PREFIX, String(id)]}>
      <Input />
    </FormItemWrapper>
  )
}

export default InputFormItem
