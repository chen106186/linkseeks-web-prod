/*
 * @Description: 自定义选项过滤弹窗
 */
import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@apps/mobile-ui'
import FilterModal, { IProps as FilterModalProps } from './index'
import Group, { DataSourceItem } from './components/Group'
import DateGroup from './components/DateGroup'
import './index.scss'

export type FieldType = 'custom' | 'date'

export type FilterGroupType = {
  /**
   * 标题
   */
  title?: string
  /**
   * 字段名称，用作值收集的key
   */
  fieldName: string
  /**
   * 字段类型，可选 'custom' | 'date'，如果是 date则会渲染 内部 DateGroup 组件，否则渲染普通 Group
   */
  fieldType: FieldType
  /**
   * 选项
   */
  options?: DataSourceItem[]
}

export type FilterValueType = { [key: string]: any }

interface IProps extends FilterModalProps {
  /**
   * 选项数据
   */
  groups?: FilterGroupType[]
  /**
   * 值
   */
  value?: FilterValueType
  /**
   * 选择选项触发事件
   */
  onChange?: (value: FilterValueType) => void
  /**
   * 重置事件
   */
  onReset?: () => void
  /**
   * 确认事件
   */
  onConfirm: (value: FilterValueType) => void
}

const CustomFilterModal: React.FC<IProps> = (props: IProps) => {
  const { renderHeaderComponent, visible, onClose, groups, value, onChange, onReset, onConfirm } = props
  const [internalValue, setInterValue] = useState<FilterValueType>({})

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  useEffect(() => {
    if ('value' in props) {
      setInterValue(value!)
    }
  }, [value])

  const handleChange = (fieldName: string, next: any) => {
    const nextValue = { ...internalValue, [fieldName]: next }
    console.log('nextValuenextValue', nextValue)
    if (!('value' in props)) {
      setInterValue(nextValue)
    }
    onChange?.(nextValue)
  }

  const handleReset = () => {
    if (onReset) {
      onReset()
    }
    if (!('value' in props)) {
      setInterValue({})
    }
    onChange?.({})
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(internalValue)
    }
  }

  const renderOptions = (record: FilterGroupType) => {
    let node: JSX.Element | null = null
    switch (record.fieldType) {
      case 'custom': {
        node = (
          <Group
            title={record.title}
            dataSource={record.options || []}
            onClick={(value) => handleChange(record.fieldName, value)}
            value={internalValue[record.fieldName]}
            key={record.fieldName}
          />
        )
        break
      }
      case 'date': {
        node = (
          <DateGroup
            onChange={(value) => handleChange(record.fieldName, value)}
            value={internalValue[record.fieldName]}
            key={record.fieldName}
          />
        )
        break
      }
      default:
        break
    }
    return node
  }

  return (
    <FilterModal renderHeaderComponent={renderHeaderComponent} visible={visible} onClose={handleClose}>
      <View className="status">
        <ScrollView className="status-scroll-view">
          {groups?.map((group) => renderOptions(group))}
          <View className="gap" />
        </ScrollView>
      </View>
      <View className="actions">
        <View className="actions-item">
          <View onClick={handleReset} className="button-wrap__block">
            <View className="button button-large button__block">
              <Text className="button-text button-large-text">重置</Text>
            </View>
          </View>
        </View>
        <View className="actions-item">
          <View onClick={handleConfirm} className="button-wrap__block">
            <View className="button button-primary button-large button__block">
              <Text className="button-text button-primary-text button-large-text">确定</Text>
            </View>
          </View>
        </View>
      </View>
    </FilterModal>
  )
}

CustomFilterModal.defaultProps = {
  onChange: undefined,
  onReset: undefined,
}

export default CustomFilterModal
