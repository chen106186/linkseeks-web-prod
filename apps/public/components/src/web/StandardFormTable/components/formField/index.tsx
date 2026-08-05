import React, { useMemo } from 'react'
import { InputNumber, Form, FormItemProps, Input, Select } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import { useFormContext } from '../../contexts/formContext'
import { RecordColumns, SearchField, SearchFieldProps } from '../../types'
import './index.global.less'
import { useFormTable } from '../../contexts'
import { useIntl } from '@linkseeks/i18n'
import dayjs from 'dayjs'
import NumberRanageField from './fields/NumberRanage'
import FormWrapper from './fields/FormWrapper'
import { DefaultOptionType } from 'antd/lib/select'
import CascaderField from './fields/Cascader'
import DateRangeField from './fields/DateRange'
const FormItem = Form.Item

interface FormFieldProps<RecordType> extends RecordColumns<RecordType> {
  type: SearchField
  formItemProps?: FormItemProps
}

const getPrevTime = (num, flag) => {
  return dayjs().startOf('day').subtract(num, flag).valueOf()
}

const FormField = (props: SearchFieldProps) => {
  const { type, title, name, valueEnum, display, ...resetProps } = props
  const { actionRef } = useFormTable()
  const { width } = useFormContext()
  const translate = useWebIntl()

  const innerStyle = {
    width,
    // ...style
  }

  const intl = useIntl()
  const todayStartTime = dayjs().startOf('day').valueOf()
  const nowTime = dayjs().endOf('day').valueOf()

  const dateMemo = useMemo(
    () => [
      {
        label: translate('web.common.jintian', { defaultMessage: '今天' }),
        value: `${todayStartTime},${nowTime}`,
      },
      {
        label: translate('web.common.yizhounei', { defaultMessage: '一周内' }),
        value: `${getPrevTime(1, 'week')},${nowTime}`,
      },
      {
        label: translate('web.common.yigeyuenei', { defaultMessage: '一月内' }),
        value: `${getPrevTime(1, 'month')},${nowTime}`,
      },
      {
        label: translate('web.common.sanyuenei', { defaultMessage: '三月内' }),
        value: `${getPrevTime(3, 'month')},${nowTime}`,
      },
      {
        label: translate('web.common.liuyuenei', { defaultMessage: '六月内' }),
        value: `${getPrevTime(6, 'month')},${nowTime}`,
      },
      {
        label: translate('web.common.yiniannei', { defaultMessage: '一年内' }),
        value: `${getPrevTime(1, 'year')},${nowTime}`,
      },
      {
        label: translate('web.common.yinianqian', { defaultMessage: '一年前' }),
        value: `0,${getPrevTime(1, 'year')}`,
      },
    ],
    [],
  )

  const renderField = () => {
    const placeholder = (type !== 'Cascader' && (resetProps.placeholder as string)) || ''
    switch (type) {
      case 'Input':
        return (
          <FormWrapper name={name} {...resetProps}>
            <Input
              style={innerStyle}
              placeholder={placeholder || `${translate('web.common.qingshuru', { defaultMessage: '请输入' })}${title}`}
              allowClear
            />
          </FormWrapper>
        )
      case 'InputNumber':
        return (
          <FormWrapper name={name} {...resetProps}>
            <InputNumber
              style={innerStyle}
              placeholder={placeholder || `${translate('web.common.qingshuru', { defaultMessage: '请输入' })}${title}`}
              allowClear
            />
          </FormWrapper>
        )
      case 'Select':
        return (
          <FormWrapper name={name} {...resetProps}>
            <Select
              style={innerStyle}
              placeholder={
                placeholder ||
                `${translate('web.common.qingxuanze', { defaultMessage: '请选择' })}${title}(${translate(
                  'web.common.all',
                  { defaultMessage: '全部' },
                )})`
              }
              options={valueEnum}
              allowClear
            />
          </FormWrapper>
        )
      case 'Search':
        return (
          <FormWrapper name={name} {...resetProps}>
            <Input.Search
              style={innerStyle}
              placeholder={placeholder || `${translate('web.common.qingshuru', { defaultMessage: '请输入' })}${title}`}
              onSearch={() => actionRef.current.submit()}
              // @todo 这里由于官方点击clear图标时会触发onSearch方法，导致无法区分要用缓存还是不用缓存，保险起见，此处禁用allowClear
              // 解决方案应该要自己实现一个search输入框
              // allowClear
            />
          </FormWrapper>
        )

      case 'DateSelect':
        return (
          <FormWrapper name={name} {...resetProps}>
            <Select
              style={innerStyle}
              placeholder={placeholder || `${translate('web.common.qingxuanze', { defaultMessage: '请选择' })}${title}`}
              options={dateMemo}
              allowClear
            />
          </FormWrapper>
        )
      case 'NumberRanage': {
        return <NumberRanageField name={name} innerStyle={innerStyle} {...resetProps} />
      }
      case 'SearchSelect':
        return (
          <FormWrapper name={name} {...resetProps}>
            <Select
              showSearch
              style={innerStyle}
              placeholder={placeholder || `${translate('web.common.qingxuanze', { defaultMessage: '请选择' })}${title}`}
              options={valueEnum}
              filterOption={(input, option: any) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              allowClear
              onSearch={(value) => resetProps?.onSearch(value)}
            />
          </FormWrapper>
        )
      case 'Cascader': {
        const filter = (inputValue: string, path: DefaultOptionType[]) =>
          path.some((option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
        return (
          <FormWrapper name={name} {...resetProps}>
            <CascaderField
              options={valueEnum}
              placeholder={placeholder || `${translate('web.common.qingxuanze', { defaultMessage: '请选择' })}${title}`}
              allowClear
              showSearch={{ filter }}
            />
          </FormWrapper>
        )
      }
      case 'DateRange': {
        return <DateRangeField name={name} placeholder={placeholder} {...resetProps} />
      }
    }
  }

  return (
    <FormWrapper key={name as string} {...resetProps}>
      {renderField()}
    </FormWrapper>
  )
}

export default FormField
