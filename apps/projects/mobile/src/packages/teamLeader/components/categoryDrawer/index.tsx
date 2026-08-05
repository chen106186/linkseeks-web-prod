import React, { useEffect, useState } from 'react'
import { View } from '@apps/mobile-ui'
import Popup from '@/components/Popup'
import './index.scss'
import { useIntl } from '@linkseeks/i18n'
import { getSystemInfoSync } from '@apps/mobile-services/utils/taro'
import { themeLayout } from '@/constants/theme'
import { IS_WEB } from '@/constants'

interface CategoryItem {
	id: number | string
	name: string
	status?: boolean
}

interface CategoryFilterDrawerProps {
	/**
	 * 是否可见
	 */
	visible: boolean
	/**
	 * 关闭触发事件
	 */
	onClose?: () => void
	/**
	 * 顶部偏移距离
	 */
	offsetTop?: number
	/**
	 * 过滤项改变触发事件
	 */
	onChange?: (values: any) => void
	/**
	 * 品类和品牌是否支持多选
	 */
	multiple?: boolean
	/**
	 * 自定义选择数据
	 */
	options: CategoryItem[]
	/**
	 * 默认选中值（初始值）
	 */
	defaultValue?: number
}

const CategoryDrawer: React.FC<CategoryFilterDrawerProps> = props => {
  const {
    visible,
    onClose,
    offsetTop,
    onChange,
    multiple = true,
    options,
    defaultValue = 0,
  } = props

  const intl = useIntl()
  const safeBottom = getSystemInfoSync().safeArea.bottom
  const screenHeight = getSystemInfoSync().screenHeight
  const safePadding = IS_WEB ? 0 : screenHeight - safeBottom

  const [selectedValue, setSelectedValue] = useState<number | string | (number | string)[]>(
    multiple ? [] : ''
  )

  // 初始化默认值
  useEffect(() => {
    if (defaultValue !== undefined) {
      setSelectedValue(defaultValue)
    }
  }, [defaultValue])

  // 点击选项
  const toggleSelect = (val: number | string) => {
    if (multiple) {
      let newSelected = Array.isArray(selectedValue) ? [...selectedValue] : []
      if (newSelected.includes(val)) {
        newSelected = newSelected.filter(v => v !== val)
      } else {
        newSelected.push(val)
      }
      setSelectedValue(newSelected)
    } else {
      setSelectedValue(val)
    }
  }

  // 点击确认
  const handleConfirm = () => {
		onChange?.(selectedValue)
		onClose?.()
  }

  // 点击重置
  const handleReset = () => {
    // const resetVal = multiple ? [] : ''
    const resetVal = multiple ? [options[0]?.value] : options[0]?.value ?? ''
    setSelectedValue(resetVal)
  }

  // 判断是否选中
  const isSelected = (val: number | string) => {
    return multiple
      ? Array.isArray(selectedValue) && selectedValue.includes(val)
      : selectedValue === val
  }

  return (
    <View className="filter-drawer">
      <Popup
        visible={visible}
        onClose={onClose}
        position="right"
        closeable={false}
        round={false}
        customClassName="filter-drawer-popup"
        customStyle={{ top: `${offsetTop}px` }}
        overlayStyle={{ top: `${offsetTop}px` }}
      >
        <View
          className="team-leader-drawer-content"
          style={{ paddingBottom: safePadding ? `${safePadding}PX` : themeLayout['padding-xs'] }}
        >
          <View className="team-leader-drawer-scroll">
            <View className="team-leader-drawer-title">品类</View>
            <View className="team-leader-drawer-group">
              {options.map(option => (
                <View
                  key={option.id}
                  className={`team-leader-drawer-option ${isSelected(option.id) ? 'team-leader-drawer-option-selected' : ''}`}
                  onClick={() => toggleSelect(option.id)}
                >
                  {option.name}
                </View>
              ))}
            </View>
          </View>
          <View className="team-leader-page-actions">
            <View className="team-leader-page-actions-item">
              <View className="team-leader-page-actions-item-btn1" onClick={handleReset}>
                {intl.formatMessage({ id: 'teamLeader.zhongzhi', defaultMessage: '重置' })}
              </View>
            </View>
            <View className="team-leader-page-actions-item">
              <View className="team-leader-page-actions-item-btn2" onClick={handleConfirm}>
                {intl.formatMessage({ id: 'teamLeader.queren', defaultMessage: '确定' })}
              </View>
            </View>
          </View>
        </View>
      </Popup>
    </View>
  )
}

CategoryDrawer.defaultProps = {
  onClose: undefined,
  offsetTop: 0,
}

export default CategoryDrawer
