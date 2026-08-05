import { LineTitle } from '@apps/components'
import { ReactNode } from 'react'

export interface SubTitleWrapperProps {
  title: ReactNode
  children?: ReactNode
}

const titleStyle = {
  fontSize: 12,
  fontWeight: 400,
}

const wrapperStyle = {}
/**
 * 卡片内带有副标题的容器
 */
const SubTitleWrapper = (props: SubTitleWrapperProps) => {
  const { title, children } = props
  return (
    <div style={wrapperStyle}>
      <LineTitle style={titleStyle}>{title}</LineTitle>
      {children}
    </div>
  )
}

export default SubTitleWrapper
