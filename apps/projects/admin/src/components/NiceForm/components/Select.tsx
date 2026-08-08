import React, { useState, useEffect, useRef } from 'react'
import { Select, Input, Row, Button } from '@linkseeks/ui'
import {
  ISchemaFieldComponentProps,
  FormPath,
  useFormEffects,
  createFormActions,
  createAsyncFormActions,
} from '@apps/formily'

// 自定义搜索型下拉框
const SingleSelect = (props: ISchemaFieldComponentProps) => {
  const ref = useRef<any>({})
  const { schema, form, path, mutators, editable } = props
  const dataSourceRef = useRef<any[]>([])
  // 可选参数 fetchSearch, select为search
  // multiple 是否开启多选
  const {
    fetchSearch,
    fetchParams = 'name',
    fetchFormat,
    multiple = false,
    ...resetProps
  } = schema.getExtendsComponentProps()
  const [dataSource, setDataSource] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)

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
          label: v.name,
          value: v.state,
        }))
        dataSourceRef.current = transformData
        setDataSource(transformData)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const multipleProps = multiple
    ? {
        open: openSelect,
        onFocus: () => setOpenSelect(true),
      }
    : {}
  return (
    <Select
      ref={ref}
      mode={multiple ? 'multiple' : null}
      onChange={(e) => mutators.change(e)}
      filterOption={false}
      loading={loading}
      options={dataSource}
      disabled={!editable}
      isSearch
      getPopupContainer={() => document.getElementById('root')} /* 处理option被遮挡 */
      value={props.value}
      {...multipleProps}
      {...resetProps}
    ></Select>
  )
}

SingleSelect.defaultProps = {}

SingleSelect.isFieldComponent = true

export default SingleSelect
