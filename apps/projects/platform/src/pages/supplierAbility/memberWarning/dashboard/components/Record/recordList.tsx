import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import RecordItem from './recordItem'

type RecordItemType = React.ComponentProps<typeof RecordItem>
interface Iprops {
  height: number
  dataSource: RecordItemType[]
}

const RecordList = (props: Iprops) => {
  const intl = useIntl()
  const { height, dataSource } = props
  return (
    <div style={{ height: `${height}px`, overflowY: 'scroll', margin: '8px 0 16px 16px' }}>
      {dataSource?.map((_item, key) => {
        return (
          <div key={key} style={{ marginBottom: '24px' }}>
            <RecordItem
              type="danger"
              alert={intl.formatMessage({
                id: 'member.memberWarning.dashboard.components.Record.recordList.contractExpired',
              })}
              content={intl.formatMessage({
                id: 'member.memberWarning.dashboard.components.Record.recordList.collapse',
              })}
            />
          </div>
        )
      })}
    </div>
  )
}

export default RecordList
