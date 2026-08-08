import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import StatusLabel from '../StatusLabel'
import CircleChart from '../CircleChart'

const Item = StatusLabel.Item
const PurchaseContractExpire = () => {
  const intl = useIntl()

  const options = [
    {
      label: `30${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.day',
      })}`,
      render: () => {
        return (
          <Item
            percent={'30%'}
            value={12}
            range={`30${intl.formatMessage({
              id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.day',
            })}`}
          />
        )
      },
    },
    {
      label: `15${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.day',
      })}`,
      render: () => {
        return (
          <Item
            percent={'30%'}
            value={8}
            range={
              "15${intl.formatMessage({id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.day'})}"
            }
          />
        )
      },
    },
    {
      label: `7${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.day',
      })}`,
      render: () => {
        return (
          <Item
            percent={'30%'}
            value={5}
            range={`7${intl.formatMessage({
              id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.day',
            })}`}
          />
        )
      },
    },
    {
      label: `3${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.day',
      })}`,
      render: () => {
        return (
          <Item
            percent={'30%'}
            value={4}
            range={
              "3${intl.formatMessage({id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.day'})}"
            }
          />
        )
      },
    },
    {
      label: `1${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.day',
      })}`,
      render: () => {
        return (
          <Item
            percent={'30%'}
            value={3}
            range={`1${intl.formatMessage({
              id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.day',
            })}`}
          />
        )
      },
    },
    {
      label: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.expired',
      })}`,
      render: () => {
        return (
          <Item
            percent={'30%'}
            value={3}
            range={`${intl.formatMessage({
              id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.expired',
            })}`}
          />
        )
      },
    },
  ]

  return (
    <CircleChart
      title={intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.Contract.purchaseContractExpire.purchaseContractExpired',
      })}
      options={options}
    />
  )
}

export default PurchaseContractExpire
