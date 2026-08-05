import React, { useState } from 'react'
import { Input, Space, Button, Tooltip } from '@linkseeks/ui'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import { useForm, useFormEffects, onFieldReact, IForm } from '@apps/form'
import { FORM_FILTER_PATH } from '../const'

const Search = (props: any) => {
  const form = useForm<IForm>()
  const [state, setState] = useState({
    filterSearch: false,
  })
  const {
    align,
    advanced = true, // 是否展示高级筛选
    tip, // 搜索框悬浮提示
    onlyNumber = false, //只输入整数
    displayFieldPath = FORM_FILTER_PATH, // 高级筛选显示隐藏的FieldPath
    ...rest
  } = props
  const justifyAlign = align || 'flex-end'

  const changeFilterVisible = () => {
    if (state.filterSearch) {
      form.reset(
        // 清除FILTER_PARAMS下所有字段
        `*.${displayFieldPath}.*`,
      )
    }

    setState({
      filterSearch: !state.filterSearch,
    })

    form.setFieldState(displayFieldPath, (field) => {
      field.visible = !state.filterSearch
    })
  }

  useFormEffects(() => {
    onFieldReact(displayFieldPath, (field) => {
      field.visible = state.filterSearch
    })
  })

  return (
    <Space size={20} style={{ justifyContent: justifyAlign, width: '100%' }}>
      <Tooltip title={tip}>
        <Input.Search
          value={props.value || ''}
          onChange={(e) => props.mutators.change(onlyNumber ? e.target.value.replace(/\D/g, '') : e.target.value)}
          onSearch={(_, e) => {
            e.preventDefault()
            form.submit()
          }}
          {...rest}
        />
      </Tooltip>
      {advanced && (
        <Button
          style={state.filterSearch ? { backgroundColor: '#6B778C', borderColor: '#6B778C', color: '#FFF' } : {}}
          onClick={changeFilterVisible}
        >
          高级筛选
          {state.filterSearch ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </Button>
      )}
      <Button
        onClick={() => {
          form.reset()
          sessionStorage.setItem('tableRest', 'true')
          form.submit()
        }}
      >
        重置
      </Button>
    </Space>
  )
}

Search.defaultProps = {}

Search.isFieldComponent = true

export default Search
