import React, { useEffect, useState } from 'react'
import Group, { DataSourceItem } from '../Group' // 你的Group组件，负责显示和选中

export type DateValueType = string // 用字符串做唯一标识

export type DateRangeValueType = {
	name: string        // 显示的名字，比如“7天内”、“当日”
	value: DateValueType  // 唯一值，方便选中
	range: Date[]       // 实际的日期范围，[开始日期, 结束日期]
}

interface DateGroupProps {
	value?: DateValueType            // 受控当前选中值
	options: DateRangeValueType[]    // 选项列表，外部传入
	onChange?: (selected: DateRangeValueType) => void  // 选中变化时回调，传出选中项对象
}

const DateGroup: React.FC<DateGroupProps> = props => {
  const { value, options, onChange } = props

  // 内部状态，保存当前选中value，支持受控和非受控
  const [innerValue, setInnerValue] = useState<DateValueType | undefined>(value)

  // 当外部value改变时同步更新
  useEffect(() => {
    setInnerValue(value)
  }, [value])

  // 选中某项触发
  const handleSelect = (selectedValue: DateValueType) => {
    if (selectedValue === innerValue) return // 同一项不重复触发
    setInnerValue(selectedValue)
    // 找到完整选中对象
    const selected = options.find(item => item.value === selectedValue)
    if (selected) {
			onChange?.(selected)
    }
  }

  // 转换成 Group 组件需要的数据格式，只要 name 和 value
  const dataSource: DataSourceItem[] = options.map(item => ({
    name: item.name,
    value: item.value,
  }))

  return (
    <Group
      title="时间"
      dataSource={dataSource}
      value={innerValue ?? ''}
      onClick={handleSelect}
    />
  )
}

// 默认属性
DateGroup.defaultProps = {
  value: undefined,
  onChange: undefined,
}

export default DateGroup
