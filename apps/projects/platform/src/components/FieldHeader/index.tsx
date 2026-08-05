import React, { ReactNode } from 'react'
import mixinsClassName from 'classnames'
import './index.less'

export interface FieldHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  renderTitle: ReactNode,
  extra?: ReactNode,
}

const FieldHeader:React.FC<FieldHeaderProps> = (props) => {
  const { renderTitle, extra, className, ...restDivProps } = props
  return (
    <div className={mixinsClassName('field-header_container', className)} {...restDivProps}>
      <div className='field-header_title'>{renderTitle}</div>
      <div>{extra}</div>
    </div>
  )
}

FieldHeader.defaultProps = {}

export default FieldHeader
