import { Card } from 'antd'
import React from 'react'

interface BaseInfoPorps {
  title?: string
  className?: string
  children: JSX.Element[]
  cols?: number
  id?: string
}

/**
 * 基础信息布局 Card
 * @param param0
 * @returns
 */
function BaseInfo({ title, className, children, cols = 2, id }: BaseInfoPorps) {
  return (
    <Card id={id} title={title} className={className}>
      <div className={`base_info grid grid-cols-${cols} gap-4`}>{children}</div>
    </Card>
  )
}

function BaseInfoItem({ label, children }: { label: string; children: JSX.Element | string }) {
  return (
    <div className="base_info_item flex text-lg">
      <div className="label flex-grow-0 w-60 text-gray-400">{label}</div>
      <div className="value font-semibold">{typeof children === 'string' ? <span>{children}</span> : children}</div>
    </div>
  )
}

BaseInfo.BaseInfoItem = BaseInfoItem

export default BaseInfo
