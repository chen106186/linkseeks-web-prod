import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { Row, Col } from 'antd'
import OverViewCard from './OverViewCard'

const OverView = () => {
  const intl = useIntl()
  const list = [
    {
      title: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.OverVIew.OverView.todayWarn' })}`,
      type: 'warn',
      first: 3,
      second: 4,
      third: 5,
      total: 12,
    },
    {
      title: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.OverVIew.OverView.todayWaitDeal',
      })}`,
      type: 'primary',
      first: 3,
      second: 4,
      third: 5,
      total: 12,
    },
    {
      title: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.OverVIew.OverView.todayDeal' })}`,
      type: 'success',
      first: 3,
      second: 4,
      third: 5,
      total: 12,
    },
    {
      title: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.OverVIew.OverView.historySumWarn',
      })}`,
      type: 'default',
      first: 3,
      second: 4,
      third: 5,
      total: 12,
    },
  ]

  return (
    <>
      {list.map((_item) => {
        return (
          <Col lg={6} xxl={6} md={12} sm={24} key={_item.type}>
            <OverViewCard {..._item} type={_item.type as 'primary'} />
          </Col>
        )
      })}
    </>
  )
}

export default OverView
