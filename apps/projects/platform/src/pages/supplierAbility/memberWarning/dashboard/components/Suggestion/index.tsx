import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import CustomizeCard from '../CustomizeCard'
import { Chart, Interval, Tooltip } from 'bizcharts'

interface Iprops {}

type DataType = {
  month: string
  number: number
}

const Suggestion = () => {
  const intl = useIntl()
  const data: DataType[] = [
    { month: `1951 ${intl.formatMessage({ id: 'home.userCenter.year' })}`, number: 38 },
    { month: `1952 ${intl.formatMessage({ id: 'home.userCenter.year' })}`, number: 52 },
    { month: `1956 ${intl.formatMessage({ id: 'home.userCenter.year' })}`, number: 61 },
    { month: `1957 ${intl.formatMessage({ id: 'home.userCenter.year' })}`, number: 45 },
    { month: `1958 ${intl.formatMessage({ id: 'home.userCenter.year' })}`, number: 48 },
    { month: `1959 ${intl.formatMessage({ id: 'home.userCenter.year' })}`, number: 38 },
    { month: `1960 ${intl.formatMessage({ id: 'home.userCenter.year' })}`, number: 38 },
    { month: `1962 ${intl.formatMessage({ id: 'home.userCenter.year' })}`, number: 38 },
  ]

  return (
    <CustomizeCard
      title={intl.formatMessage({ id: 'member.memberWarning.dashboard.components.Suggestion.index.complaintSuggest' })}
      bodyStyle={{ height: '312px', padding: '0' }}
    >
      <Chart height={312} autoFit data={data} interactions={['active-region']} padding={[30, 30, 30, 50]}>
        <Interval position="month*number" />
        <Tooltip shared />
      </Chart>
    </CustomizeCard>
  )
}

export default Suggestion
