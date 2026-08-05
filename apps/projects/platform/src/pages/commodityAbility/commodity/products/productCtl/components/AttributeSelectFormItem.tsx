import { Button, Row, Select, message } from '@linkseeks/ui'
import { PlusCircleIcon } from '@linkseeks/icons'
import { CATEGORY_TYPE, SelectAttrFormItem } from './type'
import { useMemo } from 'react'
import {
  useProductForm,
  SPECS_ATTR_NAME_PREFIX,
  CATEGORY_ATTR_NAME_PREFIX,
  FormItemWrapper,
} from '@apps/services/commodity'
import { useWebIntl } from '@apps/locales'

const AttributeSelectFormItem = (props: SelectAttrFormItem) => {
  const { options, name, required, id, attrModalRef, isPrice, type } = props
  const { checkDisabled, noCheckDisabled, specsSettingDataSource } = useProductForm()
  const translate = useWebIntl()
  const ATTR_NAME_PREFIX = useMemo(() => {
    return isPrice ? SPECS_ATTR_NAME_PREFIX : CATEGORY_ATTR_NAME_PREFIX
  }, [isPrice])

  const validateChange = (newValue: any, oldValue: any) => {
    if (specsSettingDataSource.length === 0) {
      return true
    }
    if (newValue && oldValue) {
      // 当需要取消的值存在规格列表中时，则不允许取消
      if (newValue.length > oldValue.length) {
        return true
      } else {
        const items = oldValue?.filter((v) => !newValue.includes(v)) || []
        if (items.length === 1) {
          const attributeId = items[0]
          // 判断这个属性id存不存在现有的规格列表中
          const result = specsSettingDataSource.some((v) =>
            Object.values(v.getSpecsAttribute())
              .map((v: any) => v.value)
              .includes(attributeId),
          )
          if (result) {
            message.error(translate('web.resource.commodity.guigeshiyongtishi'))
            return false
          } else {
            return true
          }
        } else {
          console.error('代码异常')
          return false
        }
      }
    } else {
      return true
    }
  }
  return (
    <FormItemWrapper label={name} required={required}>
      <Row>
        <FormItemWrapper
          noStyle
          rules={[{ required: required, message: translate.formatFormSelectTip(name) }]}
          name={[ATTR_NAME_PREFIX, String(id)]}
        >
          <Select
            disabled={false}
            mode={type === CATEGORY_TYPE.SINGLE ? undefined : 'multiple'}
            style={{ flex: 1, marginRight: 16 }}
            options={options}
            optionFilterProp="children"
            filterOption={(input, option: any) => (option?.label || '').toLowerCase().includes(input.toLowerCase())}
            allowClear
            validateChange={validateChange}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
          />
        </FormItemWrapper>
        <Button type="secondary" icon={<PlusCircleIcon />} onClick={() => attrModalRef.current.toggle(props)}>
          {translate('web.common.add')}
        </Button>
      </Row>
    </FormItemWrapper>
  )
}

export default AttributeSelectFormItem
