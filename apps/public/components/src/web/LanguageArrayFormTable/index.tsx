import React from 'react'
import { EditIcon, PlusCircleIcon } from '@linkseeks/icons'
import { Input, Table, Form, TableProps, FormInstance, Button } from '@linkseeks/ui'
import { InputRef } from 'antd'
import { ColumnGroupType, ColumnType } from 'antd/lib/table'
import { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import ArrayFormTable, { ArrayFormTableProps } from '../ArrayFormTable'
import { useLanguage } from '@apps/domains'

interface LanguageArrayFormTableProps extends ArrayFormTableProps {
  type?: 'single' | 'multiple'
  value?: any
  onChange?(value): void
  /**
   * 是否显示新增按钮
   */
  showControl?: boolean
  maxLength?: number
  /**
   * 获取目标字段的值
   * 由于后端有时候需要指定的字段中是带有一个额外字段名才能解析数据
   * 例如[[ { language: 'zh-CN' }]], 会转变成[{ items: [ { language: 'zh-CN' } ] }]
   * 例如 外部传入的是一个configs对象，如果targetKey为 fieldLocalName, 则最终导入的dataSource应该是configs['fieldLocalName']
   */
  targetKey?: string
}

/**
 * 专门为国际化编辑组成的表格组件
 * single类型则是表示单字段
 * multiple表示可以自增
 */
const LanguageArrayFormTable = forwardRef((props: LanguageArrayFormTableProps, ref) => {
  const { type = 'single', value, targetKey, ...resetProps } = props
  const { languageList } = useLanguage()

  const DEFAULT_LANGUAGE_LIST = useMemo(() => {
    return languageList.map((_item) => ({
      language: _item.key,
      value: '',
    }))
  }, [])

  const getValue = useMemo(() => {
    if (value && value.length > 0 && targetKey) {
      return value.map((v) => v[targetKey])
    } else {
      return value
    }
  }, [value, targetKey])
  const transformDataSource = (dataSource: any[], mult = false) => {
    const result = [...dataSource].reduce((prev, next) => {
      prev[next.language] = next.value
      return prev
    }, {} as any)
    return mult ? result : [result]
  }

  const columns: any[] = useMemo(() => {
    if (languageList && languageList.length > 0) {
      return languageList.map((_item) => ({
        key: _item.key,
        dataIndex: _item.key,
        title: _item.language,
        editable: true,
        render(_, record, index) {
          if (type === 'single') {
            return record
          } else {
            return record[_item.key] || ''
          }
        },
      }))
    }
    return []
  }, [languageList])

  const transformDataValue = (dataValue: any) => {
    return Object.keys(dataValue).map((key) => ({
      language: key,
      value: dataValue[key],
    }))
  }
  const languageValue = useMemo(() => {
    if (getValue) {
      if (type === 'single') {
        return transformDataSource(getValue)
      } else if (type === 'multiple') {
        return getValue.map((v) => transformDataSource(v, true))
      }
    } else {
      if (type === 'single') {
        return transformDataSource(DEFAULT_LANGUAGE_LIST)
      }
      return []
    }
  }, [type, getValue, languageList])

  const handleAdd = () => {
    if (resetProps.onChange) {
      if (targetKey) {
        if (value) {
          // 传入的是对象
          const target = [...value]
          target.push({ [targetKey]: DEFAULT_LANGUAGE_LIST })
          resetProps.onChange(target)
        } else {
          resetProps.onChange([{ [targetKey]: DEFAULT_LANGUAGE_LIST }])
        }
      } else {
        resetProps.onChange(value ? [...value, DEFAULT_LANGUAGE_LIST] : [DEFAULT_LANGUAGE_LIST])
      }
    }
  }

  const handleRemove = (record, index) => {
    if (value) {
      const target = [...value]
      target.splice(index, 1)
      resetProps.onChange && resetProps.onChange(target)
    }
  }

  const handleSave = (record: any, index: number) => {
    const result = record[index]
    if (resetProps.onChange) {
      const target = [...value]
      target.splice(index, 1, targetKey ? { [targetKey]: transformDataValue(result) } : transformDataValue(result))
      resetProps.onChange(target)
    }
  }

  const handleValueChange = (current, allCurrent) => {
    if (type === 'single') {
      const value = allCurrent[resetProps.id!]
      resetProps.onChange && resetProps.onChange(transformDataValue(value[0]))
    }
  }
  return (
    <ArrayFormTable
      columns={columns}
      value={languageValue}
      rowKey={(_, index) => index}
      onAdd={handleAdd}
      onSave={handleSave}
      onRemove={handleRemove}
      onValueChange={handleValueChange}
      {...resetProps}
    />
  )
})

export default LanguageArrayFormTable
