/*
 * @Author: XieZhiXiong
 * @Date: 2021-04-13 10:48:00
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-08 18:28:20
 * @Description: 内、外部状态过滤
 */
import React, { useState, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, ScrollView } from '@apps/mobile-ui'
import FilterModal, { IProps as FilterModalProps } from './index'
import Group from './components/Group'
import DateGroup, { DateRangeValueType } from './components/DateGroup'
import './index.scss'

export interface StatusItem {
  /**
   * 状态名称
   */
  name: string
  /**
   * 状态值
   */
  status: number
}

export interface ConfirmData {
  curOuterStatus?: number
  curInnerStatus?: number
  dateGroup?: DateRangeValueType['range']
}

interface IProps extends FilterModalProps {
  /**
   * 是否显示时间组
   */
  timer?: boolean
  /**
   * 外部状态
   */
  outerStatus?: StatusItem[]
  /**
   * 内部状态
   */
  innerStatus?: StatusItem[]
  /**
   * 外部状态值
   */
  outerStatusValue?: number
  /**
   * 外部状态值
   */
  innerStatusValue?: number
  /**
   * 外部状态值改变
   */
  onOuterStatusChange?: (value: number) => void
  /**
   * 内部状态值改变
   */
  onInnerStatusChange?: (value: number) => void
  /**
   * 时间组改变
   */
  onDateGroupChange?: (value: DateRangeValueType | undefined) => void
  /**
   * 重置内部状态值
   */
  restInnerVal?: number
  /**
   * 重置事件
   */
  onReset?: () => void
  /**
   * 确认事件，参数 当前外部状态、当前内部状态
   */
  onConfirm: (obj: ConfirmData) => void
}

const StatusFilterModal: React.FC<IProps> = (props: IProps) => {
  const intl = useIntl()
  const {
    timer = true,
    renderHeaderComponent,
    visible,
    onClose,
    outerStatus,
    innerStatus,
    outerStatusValue,
    innerStatusValue,
    onOuterStatusChange,
    onInnerStatusChange,
    onDateGroupChange,
    restInnerVal,
    onReset,
    onConfirm,
  } = props
  const [curOuterStatus, setCurOuterStatus] = useState(0)
  const [curInnerStatus, setCurInnerStatus] = useState(0)
  const [curDateGroupValue, setCurDateGroup] = useState<DateRangeValueType | undefined>(undefined)

  const dateGroupRangeRef = useRef<DateRangeValueType['range']>([])

  const handleClose = () => {
    if (onClose) {
      if ('innerStatusValue' in props) {
        setCurInnerStatus(innerStatusValue!)
      }
      if ('outerStatusValue' in props) {
        setCurOuterStatus(outerStatusValue!)
      }
      onClose()
    }
  }

  useEffect(() => {
    if ('outerStatusValue' in props) {
      setCurOuterStatus(outerStatusValue!)
    }
  }, [outerStatusValue])

  useEffect(() => {
    if ('innerStatusValue' in props) {
      setCurInnerStatus(innerStatusValue!)
    }
  }, [innerStatusValue])

  const handleOuterChange = (status: number) => {
    setCurOuterStatus(status)
    if (onOuterStatusChange) {
      onOuterStatusChange(status)
    }
  }

  const handleInnerChange = (status: number) => {
    setCurInnerStatus(status)
    if (onInnerStatusChange) {
      onInnerStatusChange(status)
    }
  }

  const handleDateGroupChange = (value: DateRangeValueType) => {
    setCurDateGroup(value)
    if (onDateGroupChange) {
      onDateGroupChange(value)
    }
    dateGroupRangeRef.current = value.range
  }

  const handleReset = () => {
    if (onReset) {
      onReset()
    }
    // if (!('outerStatusValue' in props)) {
    setCurOuterStatus(0)
    // }
    if (onOuterStatusChange) {
      onOuterStatusChange(0)
    }
    // if (!('innerStatusValue' in props)) {
    setCurInnerStatus(restInnerVal || 0)
    // }
    if (onInnerStatusChange) {
      onInnerStatusChange(0)
    }

    if (!('dateGroupValue' in props)) {
      setCurDateGroup(undefined)
    }
    if (onDateGroupChange) {
      onDateGroupChange(undefined)
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      let _obj: ConfirmData = {}
      if (outerStatus) _obj['curOuterStatus'] = curOuterStatus
      if (innerStatus) _obj['curInnerStatus'] = curInnerStatus
      _obj['dateGroup'] = curDateGroupValue ? dateGroupRangeRef.current : undefined
      onConfirm(_obj)
    }
  }

  return (
    <FilterModal renderHeaderComponent={renderHeaderComponent} visible={visible} onClose={handleClose}>
      <View className="status">
        <ScrollView className="status-scroll-view">
          {timer && <DateGroup value={curDateGroupValue?.value} onChange={handleDateGroupChange} />}
          {outerStatus && (
            <Group
              title={intl.formatMessage({ id: 'filterModal_outerStatus', defaultMessage: '外部状态' })}
              dataSource={outerStatus.map((item) => ({ name: item.name, value: item.status }))}
              onClick={(value) => handleOuterChange(+value)}
              value={curOuterStatus}
            />
          )}
          {innerStatus && (
            <Group
              title={intl.formatMessage({ id: 'filterModal_innerStatus', defaultMessage: '内部状态' })}
              dataSource={innerStatus.map((item) => ({ name: item.name, value: item.status }))}
              onClick={(value) => handleInnerChange(+value)}
              value={curInnerStatus}
            />
          )}
          <View className="gap" />
        </ScrollView>
      </View>
      <View className="actions">
        <View className="actions-item">
          <View onClick={handleReset} className="button-wrap__block">
            <View className="button button-large button__block">
              <Text className="button-text button-large-text">
                {intl.formatMessage({ id: 'filterModal_reset', defaultMessage: '重置' })}
              </Text>
            </View>
          </View>
        </View>
        <View className="actions-item">
          <View onClick={handleConfirm} className="button-wrap__block">
            <View className="button button-primary button-large button__block">
              <Text className="button-text button-primary-text button-large-text">
                {intl.formatMessage({ id: 'filterModal_confirm', defaultMessage: '确定' })}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </FilterModal>
  )
}

StatusFilterModal.defaultProps = {
  onOuterStatusChange: undefined,
  onInnerStatusChange: undefined,
  onReset: undefined,
}

export default StatusFilterModal
