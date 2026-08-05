import React, { useState, useEffect, useRef } from 'react'
import { Select } from '@linkseeks/ui'
import { Field, useField } from '@apps/form'
// 自定义搜索型下拉框
const SingleSelect = (props: any) => {
  const field = useField<Field>()
  const { editable } = field
  // 可选参数 fetchSearch, select为search
  // multiple 是否开启多选
  const { fetchSearch, fetchParams, fetchFormat, multiple, mapLabel, mapValue, ...resetProps } = props
  const [dataSource, setDataSource] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)
  const multipleProps = multiple
    ? {
        open: openSelect,
        onFocus: () => setOpenSelect(true),
      }
    : {}

  useEffect(() => {
    if (!editable) {
      return
    }
    setLoading(true)
    fetchSearch({
      [fetchParams]: '',
    })
      .then(({ data = [] }) => {
        const transformData = data.map((v) => ({
          label: v[mapLabel],
          value: v[mapValue],
        }))
        setDataSource(transformData)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <Select
      mode={multiple ? 'multiple' : undefined}
      onChange={(e) => props.mutators.change(e)}
      filterOption={false}
      loading={loading}
      options={dataSource}
      disabled={!editable}
      getPopupContainer={() => document.getElementById('root')} /* 处理option被遮挡 */
      value={props.value}
      {...multipleProps}
      {...resetProps}
    ></Select>
  )
}

SingleSelect.defaultProps = {
  // 可选参数
  fetchParams: 'name',
  // 多选
  multiple: false,
  mapLabel: 'label',
  mapValue: 'value',
}

SingleSelect.isFieldComponent = true

export default SingleSelect
