import { Badge, Tooltip } from 'antd'
import React from 'react'
import { AlreadyDeliveryNoteGenerated, AlreadyNoticeGenerated } from '../../constants'

interface CustomizedTableItemProps {
  /**
   * 是否生成送货通知单
   */
  createNotice: boolean
  /**
   * 是否生成送货单
   */
  createDelivery: boolean
  /**
   * 数量
   */
  planCount: number | string
}

/**
 *  业务定制 表格项显示
 * @author: Gavin
 * @description: 定制化业务表格渲染项
 */
const CustomizedTableItem: React.FC<CustomizedTableItemProps> = (props) => {
  return (
    <>
      {props?.createNotice ? (
        <Tooltip title={AlreadyNoticeGenerated}>
          <Badge color="#2db7f5" text={props?.planCount} />
        </Tooltip>
      ) : props?.createDelivery ? (
        <Tooltip title={AlreadyDeliveryNoteGenerated}>
          <Badge color="#00a98f" text={props?.planCount} />
        </Tooltip>
      ) : (
        <span>{props?.planCount}</span>
      )}
    </>
  )
}
CustomizedTableItem.defaultProps = {
  createNotice: false,
  createDelivery: false,
  planCount: 0,
}
export default CustomizedTableItem
