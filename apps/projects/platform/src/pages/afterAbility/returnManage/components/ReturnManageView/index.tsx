import {
  DetailAuthButton,
  EyeAuthButton,
  AuthButton,
  useTableRef,
  PageHeaderWrapper,
  StandardFormTable,
} from '@apps/components'
import { Link } from '@linkseeks/router-core'
import StatusTag from '@/components/StatusTag'
import { Badge } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import { RETURN_OUTER_STATUS_TAG_MAP, RETURN_INNER_STATUS_BADGE_MAP } from '../../../constants'
import { dateFormat } from '@apps/utils/src/format'

interface IProps {
  request: (params: any) => void
  rowKey?: string
  searchButtons?: any[]
  pageType:
    | 'returnPrAddWarehousing'
    | 'returnPrSubmit'
    | 'returnPr1'
    | 'returnPr2'
    | 'returnPrConfirm'
    | 'returnPrReceived'
    | 'returnPrReturn'
  renderAction: (record: any, tableRef: any) => JSX.Element
}
const ReturnManageView = (props: IProps) => {
  const translate = useWebIntl()
  const tableRef = useTableRef()
  const { pageType, rowKey, searchButtons, request, renderAction } = props
  let columns: any[] = [
    {
      title: translate('web.resource.member.shenqingdanhao'),
      dataIndex: 'applyNo',
      key: 'applyNo',
      render: (text, record) => {
        const applyUrlMap = new Map([
          ['returnPrAddWarehousing', `/afterAbility/returnManage/returnPrAddWarehousing/detail?id=${record.returnId}`],
          ['returnPrSubmit', `/afterAbility/returnManage/returnPrSubmit/detail?id=${record.returnId}`],
          ['returnPr1', `/afterAbility/returnManage/returnPr1/detail?id=${record.returnId}`],
          ['returnPr2', `/afterAbility/returnManage/returnPr2/detail?id=${record.returnId}`],
          ['returnPrConfirm', `/afterAbility/returnManage/returnPrConfirm/detail?id=${record.returnId}`],
          ['returnPrReceived', `/afterAbility/returnManage/returnPrReceived/detail?id=${record.returnId}`],
          ['returnPrReturn', `/afterAbility/returnManage/returnPrReturn/detail?id=${record.returnId}`],
        ])
        return (
          <DetailAuthButton>
            <EyeAuthButton url={applyUrlMap.get(pageType)}>{text}</EyeAuthButton>
          </DetailAuthButton>
        )
      },
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
      title: translate('web.resource.order.caigouhuiyuan'),
      dataIndex: 'consumerName',
      key: 'consumerName',
      searchField: 'Input',
    },
    {
      title: translate('web.resource.afterAbility.tuikuanjine'),
      dataIndex: 'refundAmount',
      key: 'refundAmount',
    },
    {
      title: translate('web.resource.afterAbility.applyTime'),
      dataIndex: 'applyTime',
      key: 'applyTime',
      searchField: {
        type: 'DateSelect',
      },
    },
  ]
  if (['returnPrAddWarehousing', 'returnPrReceived'].indexOf(pageType) > -1) {
    columns = columns.concat([
      {
        title: translate('web.resource.afterAbility.returnBatch'),
        dataIndex: 'returnBatch',
        key: 'returnBatch',
      },
      {
        title: translate('web.resource.afterAbility.tuihuorukudanhao'),
        dataIndex: 'returnStorageNo',
        key: 'returnStorageNo',
        render: (text, record) => {
          /* const returnStorageUrl = new Map([
            ['returnPrAddWarehousing',`/afterAbility/returnManage/returnPrAddWarehousing/warehousingDetail?id=${record.returnDeliveryId}`],
            ['returnPrReceived',`/afterAbility/returnManage/returnPrAddWarehousing/warehousingDetail?id=${record.returnDeliveryId}`],
          ]) */
          return (
            <Link
              to={`/afterAbility/returnManage/returnPrAddWarehousing/warehousingDetail?id=${record.returnDeliveryId}`}
            >
              {text}
            </Link>
          )
        },
      },
    ])
  } else if (['returnPrReturn'].indexOf(pageType) > -1) {
    columns = columns.concat([
      {
        title: translate('web.resource.afterAbility.yituikuan'),
        dataIndex: 'returned',
        key: 'returned',
      },
    ])
  }
  columns = columns.concat([
    {
      title: translate('web.resource.afterAbility.outerStatus'),
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      render: (text, record) => {
        return <StatusTag type={RETURN_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />
      },
    },
    {
      title: translate('web.resource.afterAbility.innerStatus'),
      dataIndex: 'innerStatusName',
      key: 'innerStatusName',
      render: (text, record) => {
        return <Badge color={RETURN_INNER_STATUS_BADGE_MAP[record.innerStatus] || '#606266'} text={text} />
      },
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      render: (text, record) => renderAction(record, tableRef),
    },
  ])
  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        rowKey={rowKey || 'returnId'}
        searchButtons={searchButtons}
        request={(params) => {
          const [startTime, endTime] = params?.applyTime?.split(',') || []
          if (startTime) {
            params.startTime = dateFormat(new Date(+startTime), 'YY-MM-DD HH:mm:ss')
          }
          if (endTime) {
            params.endTime = dateFormat(new Date(+endTime), 'YY-MM-DD HH:mm:ss')
          }
          delete params.applyTime
          return request(params)
        }}
        actionRef={tableRef}
      />
    </PageHeaderWrapper>
  )
}
export default ReturnManageView
