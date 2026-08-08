import React, { useState } from 'react'
import { Input, Space, Button, Tooltip, Select } from 'antd'
import { CaretUpOutlined, CaretDownOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useFieldState } from '@apps/formily'
import { useIntl } from '@linkseeks/i18n'
export interface SearchProps {
  value: string
  mutators: any
  props: any
}

const Search = (props) => {
  // console.log(props);
  const intl = useIntl()
  const [state, setState] = useFieldState({
    filterSearch: false,
  })
  const {
    align,
    adadded = false, // 是否展示新增货品按钮
    advanced = true, // 是否展示高级筛选
    tip, // 搜索框悬浮提示
    ...rest
  } = props.props['x-component-props']
  const isSelect = props.props.enum && Array.isArray(props.props.enum) && props.props.enum.length > 0

  const justifyAlign = align || 'flex-end'
  const changeFilterVisible = () => {
    /** 隐藏的时候没必要清除， 隐藏下 提交值默认为undefined, 这里如果对niceForm下做初始值的时候，隐藏了即重置了高级筛选下的字段会把初始值也去掉了 */
    // if (state.filterSearch) {
    //   props.form.reset({
    //     // 清除FILTER_PARAMS下所有字段
    //     selector: `*.${FORM_FILTER_PATH}.*`,
    //   });
    // }
    setState({
      filterSearch: !state.filterSearch,
    })
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: justifyAlign, width: '100%' }}>
      <Tooltip title={tip || rest.placeholder}>
        {isSelect ? (
          <Select
            style={{ width: '200px', marginRight: 16 }}
            value={props.value || undefined}
            onClear={() => {
              props.mutators.change(undefined)
              props.form.submit()
            }}
            onSelect={(value) => {
              props.mutators.change(value)
              props.form.submit()
            }}
            options={props.props.enum}
            {...rest}
          />
        ) : (
          //   {
          //     props.props.enum.map((item) => (
          //       <Select.Option kye={`select_item_${item.value}`} value={item.value}>{item.label}</Select.Option>
          //     ))
          //   }
          // </Select>
          <Input.Search
            style={{ width: '200px', marginRight: 16 }}
            value={props.value || ''}
            onChange={(e) => props.mutators.change(e.target.value)}
            onSearch={(_, e) => {
              e.preventDefault()
              props.form.submit()
            }}
            {...rest}
          />
        )}
      </Tooltip>
      {advanced && (
        <Button onClick={changeFilterVisible} style={{ marginRight: 16 }}>
          {intl.formatMessage({ id: 'components.gaojishaixuan' })}
          {state.filterSearch ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </Button>
      )}
      <Button
        onClick={() => {
          sessionStorage.setItem('tableRest', 'true')
          props.form.reset()
          props.form.submit()
        }}
      >
        {intl.formatMessage({ id: 'components.zhongzhi' })}
      </Button>
      {adadded && (
        <Space style={{ marginLeft: 16 }}>
          <Button target="_blank" href="/commodityAbility/material/materialPendingAdd/add">
            {intl.formatMessage({ id: 'components.xinzenghuopin' })}
          </Button>
          <Tooltip title={intl.formatMessage({ id: 'components.dianjichaxunliebiaoke' })}>
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      )}
    </div>
  )
}

Search.defaultProps = {}

Search.isFieldComponent = true

export default Search
