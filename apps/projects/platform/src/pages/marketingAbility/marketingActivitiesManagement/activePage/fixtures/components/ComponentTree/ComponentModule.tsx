import React, { useEffect, useState } from 'react'
import { Switch } from 'antd'
import { useSelector } from '@apps/design-react'

interface Iprops {
  image?: string
  title: string
  visible: boolean
  onChange?: ((checked: boolean, option: { dataIndex: string; treeKey: string }) => void) | null
  dataIndex: string
  treeKey: string
}

const ComponentModule: React.FC<Iprops> = (props: Iprops) => {
  const { image, title, visible, onChange = null, dataIndex, treeKey } = props
  const [innerVisible, setInnerVisible] = useState<boolean>(false)
  const { pageConfig } = useSelector(['pageConfig'])

  useEffect(() => {
    setInnerVisible(visible)
  }, [visible])

  const handleChange = (checked: boolean) => {
    const props = pageConfig[treeKey].props
    onChange?.(checked, { dataIndex: dataIndex, treeKey: treeKey, props })
  }

  return (
    <div
      style={{
        height: '160px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img style={{ width: '24px', height: '24px' }} src={image} />
      <div style={{ margin: '8px 0' }}>{title}</div>
      <div>
        <Switch size="small" checked={innerVisible} onChange={handleChange} />
      </div>
    </div>
  )
}

export default ComponentModule
