/*
 * @Author: XieZhiXiong
 * @Date: 2021-04-12 15:55:39
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-08 18:33:20
 * @Description: 过滤拉下容器
 */
import React, { useEffect, useState } from 'react'
import { nextTick, createSelectorQuery, pxTransform } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'
import StatusFilterModal from './StatusFilterModal'
import ShortcutModal from './ShortcutModal'
import CustomFilterModal from './CustomFilterModal'
import './index.scss'

export interface IProps {
  /**
   * 渲染头部内容，头部内容高度为作为定位依据
   */
  renderHeaderComponent?: React.ReactNode
  /**
   * 是否可见的
   */
  visible: boolean
  /**
   * 关闭事件
   */
  onClose: () => void

  children?: React.ReactNode
}

const FilterModal = (props: IProps) => {
  const { renderHeaderComponent, children, visible, onClose } = props

  const [offsetTop, setOffsetTop] = useState(0)

  const calculateHeaderHeight = () => {
    nextTick(() => {
      const query = createSelectorQuery()
      query
        .select(`#filterModalHead`)
        .boundingClientRect((res) => {
          if (res && res.height) {
            setOffsetTop(res.height)
          }
        })
        .exec()
    })
  }

  useEffect(() => {
    calculateHeaderHeight()
  }, [renderHeaderComponent])

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <View className="filter-modal">
      <View className="filter-modal-head" id="filterModalHead">
        {renderHeaderComponent}
      </View>
      <View
        className="filter-modal-modal"
        style={{
          height: visible ? '100%' : 0,
          overflow: visible ? 'visible' : 'hidden',
          top: pxTransform(offsetTop),
        }}
      >
        <View className="filter-modal-wrap">
          <View className="filter-modal-overlay" onClick={handleClose} />
          <View className="filter-modal-ship">{children}</View>
        </View>
      </View>
    </View>
  )
}

FilterModal.defaultProps = {
  renderHeaderComponent: null,
  children: null,
}

FilterModal.Status = StatusFilterModal
FilterModal.Shortcut = ShortcutModal
FilterModal.CustomFilter = CustomFilterModal

export default FilterModal
