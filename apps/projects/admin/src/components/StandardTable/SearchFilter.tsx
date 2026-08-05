import React, { useState } from 'react'
import { Input, Space, Button } from 'antd'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import { useFieldState } from '@apps/formily'

const FORM_FILTER_PATH = 'FORM_FILTER_PATH'

export interface SearchProps {
  value: string
  mutators: any
  props: any
}

const SearchFilter = (props) => {
  // console.log(props);
  const [state, setState] = useFieldState({
    filterSearch: false,
  })
  const justifyAlign = props.props['x-component-props'].align || 'flex-end'
  const changeFilterVisible = () => {
    if (state.filterSearch) {
      props.form.reset({
        // 清除FILTER_PARAMS下所有字段
        selector: `*.${FORM_FILTER_PATH}.*`,
      })
    }
    setState({
      filterSearch: !state.filterSearch,
    })
  }
  return (
    <Space size={20} style={{ justifyContent: justifyAlign, width: '100%' }}>
      <Input.Search
        value={props.value || ''}
        onChange={(e) => props.mutators.change(e.target.value)}
        onSearch={(_, e) => {
          e.preventDefault()
          props.form.submit()
        }}
        {...props.props['x-component-props']}
      />
      <Button onClick={changeFilterVisible}>
        高级筛选
        {state.filterSearch ? <CaretUpOutlined /> : <CaretDownOutlined />}
      </Button>
      <Button
        onClick={() => {
          sessionStorage.setItem('tableRest', 'true')
          props.form.reset()
          props.form.submit()
        }}
      >
        重置
      </Button>
    </Space>
  )
}

SearchFilter.defaultProps = {}

SearchFilter.isFieldComponent = true

export default SearchFilter
