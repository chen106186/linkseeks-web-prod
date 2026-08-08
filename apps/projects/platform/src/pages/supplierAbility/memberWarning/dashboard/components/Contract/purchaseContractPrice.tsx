import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import StatusLabel from '../StatusLabel'
import CircleChart from '../CircleChart'

const Item = StatusLabel.Item
const ContractPrice = () => {
  const intl = useIntl()

  const options = [
    {
      label: '90%-100%',
      render: () => {
        return <Item percent={'30%'} value={12} range={'90% - 100%'} />
      },
    },
    {
      label: '80%-89%',
      render: () => {
        return <Item percent={'30%'} value={12} range={'90% - 100%'} />
      },
    },
    {
      label: '70%-79%',
      render: () => {
        return <Item percent={'30%'} value={12} range={'90% - 100%'} />
      },
    },
  ]

  return (
    <CircleChart
      title={intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.Contract.purchaseContractPrice.purchaseContractMoney',
      })}
      options={options}
    />
  )
}

export default ContractPrice
