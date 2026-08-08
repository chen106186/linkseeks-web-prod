import React from 'react'
import { Button } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { useToggle } from '@linkseeks/hooks'
import BrandItem from './brandItem'
import BranchList from './branchList'

interface Iprops {
  value: {
    id: number
    icon: string
    name: string
  }
  mutators: {
    change: (params: any) => void
  }
}

const FormilyBrand: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, mutators } = props
  const [visible, setVisible] = useToggle(false)
  const intl = useIntl()
  const onCancel = () => {
    setVisible(false)
  }

  const onConfirm = (options: { id: number; icon: string; name: string }) => {
    mutators.change(options)
    setVisible(false)
  }

  return (
    <div>
      <Button onClick={() => setVisible(true)}>{intl.formatMessage({ id: 'common.button.select' })}</Button>
      <div style={{ marginTop: '12px' }}>{value?.icon && <BrandItem {...value} />}</div>
      <BranchList value={value} visible={visible} onCancel={onCancel} onConfirm={onConfirm} />
    </div>
  )
}

FormilyBrand.isFieldComponent = true

export default FormilyBrand
