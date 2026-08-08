import React, { useMemo } from 'react'

interface Iprops {
  children: React.ReactNode
  title: string
  props: {
    'x-component-props': {
      title: string
    }
  }
}

const VerticalLayout: React.FC<Iprops> & { isVirtualFieldComponent: boolean } = (props: Iprops) => {
  const { children } = props
  const xComponentProps = props.props['x-component-props'] || {}
  const { title = '' } = xComponentProps

  const styles = useMemo(
    () => ({
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 16px 0px 16px',
    }),
    [],
  )

  return (
    <div style={styles as any}>
      <div style={{ marginBottom: '16px', color: '#252537', fontSize: '14px', lineHeight: '14px', fontWeight: 600 }}>
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

VerticalLayout.isVirtualFieldComponent = true

export default VerticalLayout
