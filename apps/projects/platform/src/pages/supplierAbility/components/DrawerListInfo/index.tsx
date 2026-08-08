/*
 * @Description: 抽屉中展示 (注册、入库) 列表信息
 */
import { Drawer } from 'antd'
import React from 'react'
import ListInfo from '../ListInfo'
import { ChangeItemType } from '../MemberChangedInfo'

interface PropsType {
  /**
   * 抽屉状态
   */
  visible: boolean
  /**
   * 修改抽屉状态的方法
   */
  onClose(params: boolean): void
  /**
   * 列表数据
   */
  listData: ChangeItemType[]
  [keys: string]: any
}

const DrawerListInfo: React.FC<PropsType> = (props) => {
  const { visible, onClose, listData, ...rest } = props
  return (
    <Drawer visible={visible} onClose={() => onClose(false)} {...rest}>
      <ListInfo
        currentListData={listData?.fieldValue ? listData?.fieldValue : null}
        oldListData={listData?.lastValue ? listData?.lastValue : null}
        tabsLocation={true}
      />
    </Drawer>
  )
}

export default DrawerListInfo
