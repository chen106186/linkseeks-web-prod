import { useIntl } from '@linkseeks/i18n'
import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import { Card as CardLayout } from '@linkseeks/ui'
import { isEmpty } from 'lodash'

interface PrizeListProps {
  /** columns */
  columns?: any[]
  /** 回显数据 */
  dataSource?: any[]
}

const PrizeList: React.FC<PrizeListProps> = (props: any) => {
  const intl = useIntl()
  const { columns, dataSource } = props
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    if (!isEmpty(dataSource)) {
      setData(dataSource)
    }
  }, [dataSource])
  return (
    <CardLayout id="activityProductLayout" title={intl.formatMessage({ id: 'selfManagement.thePrize' })} weight>
      <Table
        rowKey={(record) => record.level}
        columns={columns}
        dataSource={data}
        pagination={{
          size: 'small',
        }}
      />
    </CardLayout>
  )
}
export default PrizeList
