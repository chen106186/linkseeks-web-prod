import React, { useState, useEffect, useRef } from 'react'
import { Select, Input, Row, Button } from '@linkseeks/ui'
import { useField, useForm } from '@apps/form'

const SelectContent = (props: any) => {
  const { handleChange, multiple, confirm, resetField } = props

  return (
    <div onBlur={confirm}>
      <div style={{ padding: '12px' }}>
        <Input.Search onChange={handleChange} />
      </div>
      {props.children}
      {multiple && (
        <Row justify="end" style={{ borderTop: '1px solid #eee' }}>
          <Button type="link" onClick={resetField}>
            重置
          </Button>
          <Button type="link" onClick={confirm}>
            确定
          </Button>
        </Row>
      )}
    </div>
  )
}

// 自定义搜索型下拉框
const SearchSelect = (props: any) => {
  const ref = useRef<any>({})
  const form = useForm()
  const field = useField()
  const { path, editable } = field
  const dataSourceRef = useRef<any[]>([])
  // 可选参数 fetchSearch, select为search
  // multiple 是否开启多选
  const { fetchSearch, fetchParams, fetchFormat, multiple, mapLabel, mapValue, ...resetProps } = props
  const [dataSource, setDataSource] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)

  const resetField = () => {
    form.setFieldState(path, (state) => {
      state.value = multiple ? [] : ''
    })
  }

  const confirm = (e: React.FocusEvent<HTMLElement>) => {
    e.preventDefault()
    setOpenSelect(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const filterDataSource = fuzzyQuery(value)
    setDataSource(filterDataSource)
  }

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
        dataSourceRef.current = transformData
        setDataSource(transformData)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <Select
      ref={ref}
      mode={multiple ? 'multiple' : null}
      filterOption={false}
      loading={loading}
      options={dataSource}
      disabled={!editable}
      // renderSelect={{ getPopupContainer: () => document.getElementById('root') }} /* 处理option被遮挡 */
      value={props.value}
      isSearch
      // dropdownRender={(originNode) => (
      //   <SelectContent
      //     confirm={confirm}
      //     resetField={resetField}
      //     parentRef={ref}
      //     handleChange={handleChange}
      //     multiple={multiple}
      //     value={props.value}
      //   >
      //     {originNode}
      //   </SelectContent>
      // )}
      {...multipleProps}
      {...resetProps}
    ></Select>
  )
}

SearchSelect.defaultProps = {
  // 可选参数
  fetchParams: 'name',
  // 多选
  multiple: false,
  mapLabel: 'label',
  mapValue: 'value',
}

SearchSelect.isFieldComponent = true

export default SearchSelect
