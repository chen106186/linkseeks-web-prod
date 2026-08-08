import React, { useEffect, useState } from 'react'
import { CaretRightOutlined, DeleteOutlined } from '@ant-design/icons'
import cx from 'classnames'
import style from './index.less'

type RemindLayoutProps = {
  /** 弹窗标题 */
  modalTitle?: string
  /** 选择商品按钮名称 */
  buttonTitle?: string
  /** 列表标题 */
  listTitle?: string
  /** 列表label */
  label?: { [key: number]: string }
  /** 提醒 */
  message?: { [key: number]: string }
}
interface CollapseLayoutProps {
  /** message */
  remind?: RemindLayoutProps
  /** 组编号优惠阶梯换购阶梯 */
  index: number
  /** 删除一个 */
  deletion: (e: number) => void
  /** 查看 */
  isPreview?: boolean
}

const CollapseLayout: React.FC<CollapseLayoutProps> = (props: any) => {
  const { remind, children, index, deletion, isPreview } = props
  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    if (index === 0) {
      setIsActive(true)
    }
  }, [index])
  return (
    <div className={cx(style.collapse, isActive && style.marginBottom)}>
      <div className={style.collapse_index}>{index + 1}</div>
      <div className={style.collapse_item}>
        {/* 头部 */}
        <div className={style.collapse_header} onClick={() => setIsActive(!isActive)}>
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
          <span className={style.collapse_arrow}>{remind.listTitle}</span>
          {!isPreview && <DeleteOutlined onClick={() => deletion(index)} />}
        </div>
        {/* 内容 */}
        {isActive && <>{children}</>}
      </div>
    </div>
  )
}
export default CollapseLayout
