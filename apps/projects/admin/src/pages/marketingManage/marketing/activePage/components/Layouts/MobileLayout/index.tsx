import React from 'react'

interface Iprops {
  backgroundColor: string
  children: React.ReactNode
}

const MobileLayout: React.FC<Iprops> = (props: Iprops) => {
  const { children, backgroundColor } = props

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        background: backgroundColor,
        overflowX: 'hidden',
        paddingBottom: '50px',
      }}
    >
      {children}
    </div>
  )
}

export default MobileLayout
