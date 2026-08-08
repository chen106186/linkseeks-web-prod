import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { nextTick, createSelectorQuery } from '@apps/mobile-services/utils/taro'
import { ScrollView, Text, View } from '@apps/mobile-ui'
import Group from './components/Group'
import DateGroup, { DateRangeValueType } from './components/DateGroup'
import styles from './index.module.scss'
import cx from 'classnames'

export interface StatusItem {
	/**
	 * 状态名称
	 */
	name: string,
	/**
	 * 状态值
	 */
	status: number,
}

export interface FilterModalProps {
	/**
	 * 渲染头部内容，头部内容高度为作为定位依据
	 */
	renderHeaderComponent?: React.ReactNode
	/**
	 * 是否可见的
	 */
	visible: boolean,
	/**
	 * 关闭事件
	 */
	onClose: () => void,
	/**
	 * 是否显示时间
	 */
	showDateGroup?: boolean,
	/**
	 * 是否显示外部状态
	 */
	showOuterStatus?: boolean,
	/**
	 * 是否显示内部状态
	 */
	showInnerStatus?: boolean,
	/**
	 * 时间
	 */
	dateOptions?: DateRangeValueType[],
	/**
	 * 外部状态
	 */
	outerStatus?: StatusItem[],
	/**
	 * 内部状态
	 */
	innerStatus?: StatusItem[],
	/**
	 * 当前时间组的值
	 */
	dateGroupValue?: DateRangeValueType
	/**
	 * 外部状态值
	 */
	outerStatusValue?: number,
	/**
	 * 内部状态值
	 */
	innerStatusValue?: number,
	/**
	 * 外部状态值改变
	 */
	onOuterStatusChange?: (value: number) => void,
	/**
	 * 内部状态值改变
	 */
	onInnerStatusChange?: (value: number) => void,
	/**
	 * 时间组改变
	 */
	onDateGroupChange?: (value: DateRangeValueType | undefined) => void,
	/**
	 * 重置事件
	 */
	onReset?: () => void,
	/**
	 * 确认事件，参数 当前外部状态、当前内部状态
	 */
	onConfirm: (outerStatus: number, innerStatus: number, dateRange: Date[]) => void,
}

const FilterModal: React.FC<FilterModalProps> = props => {
  const {
    renderHeaderComponent,
    visible,
    onClose,
    onConfirm,
    onReset,
    onOuterStatusChange,
    onInnerStatusChange,
    onDateGroupChange,
    outerStatus = [],
    innerStatus = [],
    outerStatusValue = 0,
    innerStatusValue = 0,
    showOuterStatus = true,
    showInnerStatus = true,
    showDateGroup = true,
  } = props

  const intl = useIntl()
  const [offsetTop, setOffsetTop] = useState(0)
  const [curOuterStatus, setCurOuterStatus] = useState(outerStatusValue)
  const [curInnerStatus, setCurInnerStatus] = useState(innerStatusValue)
  const [curDateGroup, setCurDateGroup] = useState<DateRangeValueType | undefined>(() => {
    return props.dateGroupValue ?? props.dateOptions?.[0]
  })


  useEffect(() => {
    nextTick(() => {
      const query = createSelectorQuery()
      query.select(`#filterModalHead`).boundingClientRect(res => {
        if (res?.height) setOffsetTop(res.height)
      }).exec()
    })
  }, [renderHeaderComponent])

  useEffect(() => {
    setCurDateGroup(props.dateGroupValue ?? undefined)
  }, [props.dateGroupValue])

  useEffect(() => {
    setCurOuterStatus(outerStatusValue)
  }, [outerStatusValue])

  useEffect(() => {
    setCurInnerStatus(innerStatusValue)
  }, [innerStatusValue])

  const handleReset = () => {
    setCurOuterStatus(0)
    setCurInnerStatus(0)
    setCurDateGroup(undefined)
		onReset?.()
  }

  const handleConfirm = () => {
    onConfirm(curOuterStatus, curInnerStatus, curDateGroup?.range || [])
  }

  return (
    <View className={styles['filter-modal']}>
      <View className={styles['filter-modal-head']} id="filterModalHead">
        {renderHeaderComponent}
      </View>
      <View
        className={styles['filter-modal-modal']}
        style={{
          height: visible ? '100%' : 0,
          overflow: visible ? 'visible' : 'hidden',
          top: offsetTop,
        }}
      >
        <View className={styles['filter-modal-wrap']}>
          <View className={styles['filter-modal-overlay']} onClick={onClose} />
          <View className={styles['filter-modal-ship']}>
            <View className={styles['status']}>
              <ScrollView className={styles['status-scroll-view']}>
                {/* 时间选择 */}
                {showDateGroup && (
                  <DateGroup
                    value={curDateGroup?.value}
                    options={props.dateOptions ?? []}
                    onChange={val => {
                      setCurDateGroup(val)
											onDateGroupChange?.(val)
                    }}
                  />
                )}

                {/* 外部状态 */}
                {showOuterStatus && outerStatus.length > 0 && (
                  <Group
                    title={intl.formatMessage({ id: 'filterModal_outerStatus', defaultMessage: '外部状态' })}
                    dataSource={outerStatus.map(item => ({
                      name: item.name,
                      value: item.status,
                    }))}
                    value={curOuterStatus}
                    onClick={val => {
                      setCurOuterStatus(+val)
											onOuterStatusChange?.(+val)
                    }}
                  />
                )}

                {/* 内部状态 */}
                {showInnerStatus && innerStatus.length > 0 && (
                  <Group
                    title={intl.formatMessage({ id: 'filterModal_innerStatus', defaultMessage: '内部状态' })}
                    dataSource={innerStatus.map(item => ({
                      name: item.name,
                      value: item.status,
                    }))}
                    value={curInnerStatus}
                    onClick={val => {
                      setCurInnerStatus(+val)
											onInnerStatusChange?.(+val)
                    }}
                  />
                )}
                <View className={styles['gap']} />
              </ScrollView>
            </View>

            {/* 底部按钮 */}
            <View className={styles['actions']}>
              <View className={styles['actions-item']}>
                <View
                  onClick={handleReset}
                  className={styles['button-wrap__block']}
                >
                  <View
                    className={cx(styles['button'], styles['button-large'], styles['button__block'])}
                  >
                    <Text
                      className={cx(styles['button-text'], styles['button-large-text'])}
                    >
                      {intl.formatMessage({id: 'filterModal_reset', defaultMessage: '重置'})}
                    </Text>
                  </View>
                </View>
              </View>
              <View className={styles['actions-item']}>
                <View
                  onClick={handleConfirm}
                  className={styles['button-wrap__block']}
                >
                  <View
                    className={cx(styles['button'], styles['button-primary'], styles['button-large'], styles['button__block'])}
                  >
                    <Text
                      className={cx(styles['button-text'], styles['button-primary-text'], styles['button-large-text'])}
                    >
                      {intl.formatMessage({id: 'filterModal_confirm', defaultMessage: '确定'})}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default FilterModal
