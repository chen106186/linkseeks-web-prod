import { useState, useEffect, useRef } from 'react'
import { Select, Input, Row, Button } from '@linkseeks/ui'
import { ISchemaFieldComponentProps } from '@apps/formily'
import { useIntl } from '@linkseeks/i18n'
const SelectContent = (props) => {
  const { handleChange, multiple, confirm, resetField } = props
  const intl = useIntl()

  return (
    <div onBlur={confirm}>
      <div style={{ padding: '12px' }}>
        <Input.Search onChange={handleChange} placeholder={intl.formatMessage({ id: 'components.anpinyinsousuo' })} />
      </div>
      {props.children}
      {multiple && (
        <Row justify="end" style={{ borderTop: '1px solid #eee' }}>
          <Button type="link" onClick={resetField}>
            {intl.formatMessage({ id: 'components.zhongzhi' })}
          </Button>
          <Button type="link" onClick={confirm}>
            {intl.formatMessage({ id: 'components.queding' })}
          </Button>
        </Row>
      )}
    </div>
  )
}

// 自定义搜索型下拉框
const SearchSelect = (props: ISchemaFieldComponentProps) => {
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
    queryParams = {},
    ...resetProps
  } = schema.getExtendsComponentProps()
  const [dataSource, setDataSource] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)

  const resetField = () => {
    form.setFieldValue(path, multiple ? [] : '')
  }

  const confirm = (e) => {
    e.preventDefault()
    setOpenSelect(false)
  }

  useEffect(() => {
    if (!editable) {
      return
    }
    setLoading(true)
    fetchSearch({
      [fetchParams]: '',
      ...queryParams,
    })
      .then(({ data = [] }) => {
        const transformData = data.map((v) => ({
          label: v.name,
          value: v.id,
        }))
        dataSourceRef.current = transformData
        setDataSource(transformData)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleChange = (e) => {
    const { value } = e.target
    const filterDataSource = fuzzyQuery(value)
    setDataSource(filterDataSource)
  }

  // 注释部分为下拉搜索框

  // const dispatchSearch = (searchValue: string) => {
  //   if (fetchSearch) {
  //     fetchSearch({
  //       [fetchParams]: searchValue
  //     }).then(({data = []}) => {
  //       const formatData = fetchFormat ? fetchFormat(data) : data.map(v => ({
  //         label: v.name,
  //         value: v.id
  //       }))
  //       setDataSource(formatData)
  //     }).finally(() => {
  //       setLoading(false)
  //     })
  //   }

  //   // 触发自定义事件
  //   form.notify('onSearchSelect', {
  //     ...props,
  //     searchValue
  //   })
  // }

  // const { run } = useDebounceFn(dispatchSearch, 500)
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
      // getPopupContainer={triggerNode => {
      //   return triggerNode
      // }}
      isSearch
      getPopupContainer={() => document.getElementById('root')} /* 处理option被遮挡 */
      value={props.value}
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

SearchSelect.defaultProps = {}

SearchSelect.isFieldComponent = true

export default SearchSelect
