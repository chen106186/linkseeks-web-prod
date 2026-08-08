import React, { useState } from 'react'
import { Input, Space, Button, Tooltip } from 'antd'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import { useFieldState, FormPath, FormEffectHooks } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

export interface SearchProps {
  value: string
  mutators: any
  props: any
}

const Search = (props) => {
  // console.log(props);
  const [state, setState] = useFieldState({
    filterSearch: false,
  })
  const {
    align,
    advanced = true, // 是否展示高级筛选
    tip, // 搜索框悬浮提示
    onlyNumber = false, //只输入整数
    ...rest
  } = props.props['x-component-props']
  const justifyAlign = align || 'flex-end'

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
      <Tooltip title={tip}>
        <Input.Search
          value={props.value || ''}
          style={{ width: 256 }}
          onChange={(e) => props.mutators.change(onlyNumber ? e.target.value.replace(/\D/g, '') : e.target.value)}
          onSearch={(_, e) => {
            e.preventDefault()
            props.form.submit()
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
          props.form.reset()
          sessionStorage.setItem('tableRest', 'true')
          props.form.submit()
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
