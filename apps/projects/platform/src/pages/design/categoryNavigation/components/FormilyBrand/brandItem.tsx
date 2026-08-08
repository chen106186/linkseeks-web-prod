import React from 'react'
import { Checkbox } from 'antd'

interface Iprops {
  name: string
  icon: string
  id: number
  onSelect?: ((checked: boolean, options: { id: number; icon: string; name: string }) => void) | null
  isChecked?: boolean
  disabled?: boolean
}

const BrandItem: React.FC<Iprops> = (props: Iprops) => {
  const { name, icon, id, onSelect, isChecked, disabled = false } = props

  const onChecked = (e) => {
    onSelect?.(e.target.checked, { id, icon, name })
  }

  const checkedStyle = isChecked
    ? {
        border: '1px solid rgb(4, 169, 143)',
      }
    : {}

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '1px solid #F7F8FA', ...checkedStyle }}
    >
      {onSelect && <Checkbox disabled={disabled} onChange={onChecked} checked={isChecked} />}
      <img src={icon} style={{ width: '64px', height: '36px', marginLeft: '12px' }} />
      <span style={{ marginLeft: '18px', fontSize: '12px', color: '#606266' }}>{name}</span>
    </div>
  )
}

BrandItem.defaultProps = {
  onSelect: null,
  isChecked: false,
}

export default BrandItem
