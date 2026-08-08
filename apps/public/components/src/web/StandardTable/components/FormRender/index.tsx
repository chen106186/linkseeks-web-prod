import React, { useMemo } from 'react'
import classNames from 'classnames'
import { Input, Button, Table } from '@linkseeks/ui'
import ListToolBar, { ListToolBarProps } from '../ListToolBar'
import { ActionType, IStandardTableProps } from '../../typing'
import './index.less'

interface FormRenderProps<T, U> {
  className?: string
  style?: React.CSSProperties
  toolbar?: ListToolBarProps
  action: React.MutableRefObject<ActionType | undefined>
  loading: boolean
  onSubmit?: (params: Record<string, any>) => void
  onReset?: () => void
  columns: IStandardTableProps<T, U>['columns']
  type: IStandardTableProps<T, U>['type']
}

const FormRender = <T, U>(props: FormRenderProps<T, U>) => {
  const { style, className, toolbar, columns = [], type } = props

  const toolbarDom = toolbar && toolbar.actions && toolbar.actions.length > 0 ? <ListToolBar {...toolbar} /> : null

  const columnsList = useMemo(() => {
    return columns
      .filter((item) => {
        if (item === Table.EXPAND_COLUMN || item === Table.SELECTION_COLUMN) {
          return false
        }
        if ((item.hideInSearch || item.search === false) && type !== 'form') {
          return false
        }
        if (type === 'form' && item.hideInForm) {
          return false
        }
        return true
      })
      .map((item) => {
        const finalValueType =
          !item.valueType || (['textarea'].includes(item?.valueType as unknown as string) && type === 'table')
            ? 'text'
            : (item?.valueType as 'text')
        const columnKey = item?.key || item?.dataIndex?.toString()

        return {
          ...item,
          width: undefined,
          ...(item.search ? item.search : {}),
          valueType: finalValueType,
          proFieldProps: {
            ...item.proFieldProps,
            proFieldKey: columnKey ? `table-field-${columnKey}` : undefined,
          },
        }
      })
  }, [columns, type])

  console.log(columnsList, 'columnsList')

  return (
    <div style={style} className={classNames('standard-table-form', className)}>
      {toolbarDom}
      <div className={classNames('standard-table-form-render', toolbar && 'justify-end', className)}>
        <Input />
        <Button>搜索</Button>
      </div>
    </div>
  )
}

export default FormRender
