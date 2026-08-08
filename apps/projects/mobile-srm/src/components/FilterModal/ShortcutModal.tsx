/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-06 14:04:31
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-06 16:12:45
 * @Description: 快捷跳转
 */
import React from 'react'
import { View, ScrollView } from '@apps/mobile-ui'
import Router from '@/utils/router'
import FilterModal, { IProps as FilterModalProps } from './index'
import Group from './components/Group'
import './index.scss'

export interface SourceItem {
  /**
   * 名称
   */
  name: string
  /**
   * 跳转的路径
   */
  path: string
}

interface IProps extends FilterModalProps {
  /**
   * 外部状态
   */
  dataSource: SourceItem[]
  /**
   * 当前路径，作为高亮依据
   */
  current: string
}

const Shortcut: React.FC<IProps> = (props: IProps) => {
  const { renderHeaderComponent, visible, dataSource, current, onClose } = props

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleJump = (path: any) => {
    if (current === path) {
      return
    }
    Router.navigateTo(path)
  }

  return (
    <FilterModal renderHeaderComponent={renderHeaderComponent} visible={visible} onClose={handleClose}>
      <View className="status">
        <ScrollView>
          <Group
            dataSource={dataSource.map((item) => ({ name: item.name, value: item.path }))}
            onClick={(value) => handleJump(value as any)}
            value={current}
          />
          <View className="gap" />
        </ScrollView>
      </View>
    </FilterModal>
  )
}

export default Shortcut
