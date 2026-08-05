import { useEffect, useMemo, useState } from 'react'
import {
  DetailAuthButton,
  EyeAuthButton,
  AuthButton,
  useTableRef,
  PageHeaderWrapper,
  StandardFormTable,
} from '@apps/components'
import { useWebIntl } from '@apps/locales'
import StatusTag from '@/components/StatusTag'
import { Badge } from '@linkseeks/ui'
import { EXCHANGE_OUTER_STATUS_TAG_MAP, EXCHANGE_INNER_STATUS_BADGE_MAP } from '../../constants'
import { dateFormat } from '@apps/utils'
import { getAftersalesReplaceGoodsPageByConsumer, getAftersalesReplaceGoodsPageItems } from '@apps/apis'
import { coverColFiltersItem } from '@/utils'

const ExchangeQuery = () => {
  const translate = useWebIntl()
  const tableRef = useTableRef()

  const [outerStatusList, setOuterStatusList] = useState<any[]>([])
  const [innerStatusList, setInnerStatusList] = useState<any[]>([])
  useEffect(() => {
    const fetchSearchItems = async () => {
      const res = await getAftersalesReplaceGoodsPageItems()
      if (res.code === 1000) {
        const { data } = res
        const { outerStatusList = [], innerStatusList = [] } = data
        setOuterStatusList(outerStatusList)
        setInnerStatusList(innerStatusList)
      }
    }
    fetchSearchItems()
  }, [])
  const columns: any[] = useMemo(() => {
    const defaultColumns = [
      {
        title: translate('web.resource.member.shenqingdanhao'),
        key: 'applyNo',
        dataIndex: 'applyNo',
        render: (text, record) => (
          <DetailAuthButton>
            <EyeAuthButton url={`/afterAbility/exchangeApplication/exchangeQuery/detail?id=${record.replaceId}`}>
              {text}
            </EyeAuthButton>
          </DetailAuthButton>
        ),
        searchField: {
          type: 'Input',
          main: true,
        },
      },
      {
        title: translate('web.resource.afterAbility.shenqingzhaiyao'),
        dataIndex: 'applyAbstract',
        key: 'applyAbstract',
        ellipsis: true,
        searchField: 'Input',
      },
      {
        title: translate('web.resource.afterAbility.supplierName'),
        dataIndex: 'supplierName',
        key: 'supplierName',
        searchField: 'Input',
      },
      {
        title: translate('web.resource.afterAbility.applyTime'),
        dataIndex: 'applyTime',
        key: 'applyTime',
        searchField: {
          type: 'DateSelect',
        },
      },
      {
        title: translate('web.resource.afterAbility.outerStatus'),
        dataIndex: 'outerStatusName',
        key: 'outerStatusName',
        searchField: {
          type: 'Select',
          name: 'outerStatus',
          valueEnum: outerStatusList
            .map((item) => ({ label: item.name, value: item.status }))
            .filter((item) => item.value),
        },
        render: (text, record) => <StatusTag type={EXCHANGE_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
      },
      {
        title: translate('web.resource.afterAbility.innerStatus'),
        dataIndex: 'innerStatusName',
        key: 'innerStatusName',
        searchField: {
          type: 'Select',
          name: 'innerStatus',
          valueEnum: innerStatusList
            .map((item) => ({ label: item.name, value: item.status }))
            .filter((item) => item.value),
        },
        render: (text, record) => (
          <Badge color={EXCHANGE_INNER_STATUS_BADGE_MAP[record.innerStatus] || '#606266'} text={text} />
        ),
      },
    ]
    return defaultColumns
  }, [outerStatusList, innerStatusList])

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        rowKey="replaceId"
        request={(params) => {
          console.log('params', params)
          const [startTime, endTime] = params?.applyTime?.split(',') || []
          if (startTime) {
            params.startTime = dateFormat(new Date(+startTime), 'YY-MM-DD HH:mm:ss')
          }
          if (endTime) {
            params.endTime = dateFormat(new Date(+endTime), 'YY-MM-DD HH:mm:ss')
          }
          delete params.applyTime
          return getAftersalesReplaceGoodsPageByConsumer(params)
        }}
        actionRef={tableRef}
      />
    </PageHeaderWrapper>
  )
}
export default ExchangeQuery
