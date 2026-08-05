import React from 'react'
import './index.less'

interface Iprops {
  top?: number
  text?: string
  onClick?: () => void
}

const BackToApp: React.FC<Iprops> = (props: Iprops) => {
  const { top = 250, text = '在APP打开', onClick } = props

  const handleClick = () => {
    onClick?.()
  }

  return (
    <div className={'back-to-app'} style={{ top: `${top}px` }} onMouseDown={handleClick} aria-hidden="true">
      {text}
    </div>
  )
}

export default BackToApp
