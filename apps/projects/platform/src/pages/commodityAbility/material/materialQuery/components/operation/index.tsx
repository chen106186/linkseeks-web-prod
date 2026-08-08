import { FormPath } from '@apps/formily'
import { useWebIntl } from '@apps/locales'
import { Space } from 'antd'
import React from 'react'

interface OperationProps {
  /**
   * 删除之后触发事件
   */
  onDeleteAfter?: () => void
  /**
   * 保存之后触发事件
   */
  onSaveAfter?: () => void

  setEditState?: (value: boolean) => void
}

const Operation = (props) => {
  const xComponentProps: OperationProps = props.props['x-component-props'] || {}
  const { onDeleteAfter, onSaveAfter, setEditState } = xComponentProps
  const translate = useWebIntl()

  /** 这里用index 做值貌似有点问题 */
  const [, index] = props.name.split('.')
  const id = props.form.getFieldValue(`datas.${index}.id`)
  const { editable } = props
  const handleEdit = () => {
    const str = props.form.getFieldValue('datas')[index]?.supplierMaterial
      ? `datas.${index}.*(!id,name,goodsNo)`
      : `datas.${index}.*(!id,name)`
    props.form.setFieldState(str, (state) => {
      FormPath.setIn(state, 'editable', true)
    })
    setEditState(true)
  }

  const handleCancel = () => {
    const dataSource = props.form.getFieldValue('cacheData')
    const newDataSource = [...dataSource]
    newDataSource[index] = {
      ...newDataSource[index],
    }
    props.form.setFieldValue(
      `datas`,
      newDataSource.filter((_item) => _item.status === 1),
    )
    props.form.setFieldValue(`cacheData`, newDataSource)
    props.form.setFieldState(`datas.${index}.*(!id,name)`, (state) => {
      FormPath.setIn(state, 'editable', false)
    })
    setEditState(false)
  }

  const handleDelete = () => {
    const dataSource = props.form.getFieldValue('cacheData')
    const id = props.form.getFieldValue(`datas.${index}.id`)
    const memberName = props.form.getFieldValue(`datas.${index}.name`)
    const newDataSource = dataSource.map((_item) => {
      if (_item.id === id && _item.name === memberName) {
        return {
          ..._item,
          status: 0,
        }
      }
      return _item
    })

    props.form.setFieldValue(
      `datas`,
      newDataSource.filter((_item) => _item.status === 1),
    )
    props.form.setFieldValue(`cacheData`, newDataSource)
    onDeleteAfter?.()
  }

  const handleSave = () => {
    const dataSource = props.form.getFieldValue('cacheData')
    const id = props.form.getFieldValue(`datas.${index}.id`)
    const memberName = props.form.getFieldValue(`datas.${index}.name`)
    let temp = {}
    let hasError = false
    props.form.setFieldState(`datas.${index}.*(!id,name)`, (state) => {
      if (state.ruleErrors.length !== 0 || hasError) {
        hasError = true
        return
      }
      FormPath.setIn(state, 'editable', false)
      const { name, value } = state
      const [, , fieldName] = name.split('.')
      temp[fieldName] = value || ''
    })
    if (hasError) {
      return
    }
    const newDataSource = dataSource.map((_item) => {
      if (_item.id === id && _item.name === memberName) {
        return {
          ..._item,
          ...temp,
        }
      }
      return _item
    })
    setEditState(false)
    props.form.setFieldValue(`cacheData`, newDataSource)
    onSaveAfter?.()
  }

  if (editable) {
    return (
      <Space>
        <a onClick={handleSave}>{translate('web.common.confirm')}</a>
        <a onClick={handleCancel}>{translate('web.common.cancel')}</a>
      </Space>
    )
  }

  return (
    <Space>
      <a onClick={handleEdit}>{translate('web.common.edit')}</a>
      <a onClick={handleDelete}>{translate('web.common.delete')}</a>
    </Space>
  )
}

Operation.isFieldComponent = true

export default Operation
