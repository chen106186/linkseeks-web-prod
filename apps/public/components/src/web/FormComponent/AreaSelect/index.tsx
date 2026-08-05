import React, { useEffect } from 'react'
import { Cascader, Form, FormItemProps } from '@linkseeks/ui'
import { useAreaAllList } from '@apps/services'
import { useWebIntl } from '@apps/locales'
import { areaList2Code } from '../utils'
import { useAreaSelect, AREA_SELECT_NAME } from './useAreaSelect'
export interface AreaSelectProps extends FormItemProps {}

/**
 * 该组件请配合useAreaSelect使用
 */
export const AreaSelectFormItem = (props: AreaSelectProps) => {
  const { ...resetProps } = props
  const translate = useWebIntl()
  const formInstance = Form.useFormInstance()
  const [areaList, areaListLoading, flatData, flatData2] = useAreaAllList()

  const handleChangeArea = (value) => {
    const target = areaList2Code(value, flatData2)
    for (const key in target) {
      formInstance.setFieldValue(key, target[key])
    }
    return value
  }

  return (
    <Form.Item label={translate('web.common.diqu')} normalize={handleChangeArea} {...resetProps}>
      <Cascader
        options={areaList}
        loading={areaListLoading}
        fieldNames={{ label: 'name', value: 'code', children: 'areaRespList' }}
      />
    </Form.Item>
  )
}

AreaSelectFormItem.useAreaSelect = useAreaSelect
AreaSelectFormItem.AREA_SELECT_NAME = AREA_SELECT_NAME
