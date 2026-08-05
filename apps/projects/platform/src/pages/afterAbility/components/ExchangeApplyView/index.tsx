import {
  DetailAuthButton,
  EyeAuthButton,
  AuthButton,
  useTableRef,
  PageHeaderWrapper,
  StandardFormTable,
} from '@apps/components'
import { dateFormat } from '@apps/utils/src/format'
import { useWebIntl } from '@apps/locales'
import { Link } from '@linkseeks/router-core'
import StatusTag from '@/components/StatusTag'
import { Badge, Button, Modal } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import {
  EXCHANGE_OUTER_STATUS_TAG_MAP,
  EXCHANGE_INNER_STATUS_BADGE_MAP,
  REPAIR_OUTER_STATUS_TAG_MAP,
  REPAIR_INNER_STATUS_BADGE_MAP,
} from '../../constants'

interface IProps {
  request: (params: any) => void
  rowKey?: string
  pageType:
    | 'exchangePrSubmit'
    | 'exchangePr1'
    | 'exchangePr2'
    | 'exchangePrConfirm'
    | 'exchangePrDeliver'
    | 'exchangePrReceived'
    | 'exchangePrConfirmBack'
    | 'repairPrSubmit'
    | 'repairPr1'
    | 'repairPr2'
    | 'repairPrConfirm'
}

const { confirm } = Modal

const ExchangeApplyView = (props: IProps) => {
  const translate = useWebIntl()
  const tableRef = useTableRef()
  const { request, pageType } = props

  let columns: any[] = [
    {
      title: translate('web.resource.member.shenqingdanhao'),
      dataIndex: 'applyNo',
      key: 'applyNo',
      render: (text, record) => {
        const applyUrlMap = new Map([
          ['exchangePrSubmit', `/afterAbility/exchangeManage/exchangePrSubmit/detail?id=${record.replaceId}`],
          ['exchangePr1', `/afterAbility/exchangeManage/exchangePr1/detail?id=${record.replaceId}`],
          ['exchangePr2', `/afterAbility/exchangeManage/exchangePr2/detail?id=${record.replaceId}`],
          ['exchangePrConfirm', `/afterAbility/exchangeManage/exchangePrConfirm?id=${record.replaceId}`],
          ['exchangePrDeliver', `/afterAbility/exchangeManage/exchangePrDeliver/detail?id=${record.replaceId}`],
          ['exchangePrReceived', `/afterAbility/exchangeManage/exchangePrReceived/detail?id=${record.replaceId}`],
          ['exchangePrConfirmBack', `/afterAbility/exchangeManage/exchangePrConfirmBack/detail?id=${record.replaceId}`],
          ['repairPrSubmit', `/afterAbility/repairManage/repairPrSubmit/detail?id=${record.applyId}`],
          ['repairPr1', `/afterAbility/repairManage/repairPr1/detail?id=${record.applyId}`],
          ['repairPr2', `/afterAbility/repairManage/repairPr2/detail?id=${record.applyId}`],
          ['repairPrConfirm', `/afterAbility/repairManage/repairPrConfirm/detail?id=${record.applyId}`],
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
      title: translate('web.resource.afterAbility.applyTime'),
      dataIndex: 'applyTime',
      key: 'applyTime',
      searchField: {
        type: 'DateSelect',
      },
    },
  ]
  if (['exchangePrDeliver', 'exchangePrConfirmBack'].indexOf(pageType) > -1) {
    columns = columns.concat([
      {
        title: translate('web.resource.afterAbility.huanhuopici'),
        dataIndex: 'replaceBatch',
        key: 'replaceBatch',
      },
      {
        title: translate('web.resource.afterAbility.huanhuofahuodanhao'),
        dataIndex: 'replaceDeliveryNo',
        render: (text, record) => {
          return (
            <Link to={`/afterAbility/exchangeManage/exchangePrAddDeliver/deliverDetail?id=${record.replaceDeliveryId}`}>
              {text}
            </Link>
          )
        },
      },
    ])
  } else if (pageType === 'exchangePrReceived') {
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
        render: (text, record) => (
          <Link
            to={`/afterAbility/exchangeManage/exchangePrAddWarehousing/warehousingDetail?id=${record.returnStorageId}`}
          >
            {text}
          </Link>
        ),
      },
    ])
  }
  columns = columns.concat([
    {
      title: translate('web.resource.afterAbility.outerStatus'),
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      render: (text, record) => {
        let type = EXCHANGE_OUTER_STATUS_TAG_MAP[record.outerStatus]
        if (['repairPrSubmit', 'repairPr1', 'repairPr2', 'repairPrConfirm'].indexOf(pageType) > -1) {
          type = REPAIR_OUTER_STATUS_TAG_MAP[record.outerStatus]
        }
        return <StatusTag type={type} title={text} />
      },
    },
    {
      title: translate('web.resource.afterAbility.innerStatus'),
      dataIndex: 'innerStatusName',
      key: 'innerStatusName',
      render: (text, record) => {
        let type = EXCHANGE_INNER_STATUS_BADGE_MAP[record.innerStatus]
        if (['repairPrSubmit', 'repairPr1', 'repairPr2', 'repairPrConfirm'].indexOf(pageType) > -1) {
          type = REPAIR_INNER_STATUS_BADGE_MAP[record.innerStatus]
        }
        return <Badge color={type || '#606266'} text={text} />
      },
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      render: (text, record) => {
        const urlMap = new Map([
          [
            'exchangePrSubmit',
            {
              name: translate('web.common.tijiaoshenhe'),
              url: `/afterAbility/exchangeManage/exchangePrSubmit/edit?id=${record.replaceId}`,
            },
          ],
          [
            'exchangePr1',
            {
              name: translate('web.common.tijiaoshenhe'),
              url: `/afterAbility/exchangeManage/exchangePr1/edit?id=${record.replaceId}`,
            },
          ],
          [
            'exchangePr2',
            {
              name: translate('web.common.tijiaoshenhe'),
              url: `/afterAbility/exchangeManage/exchangePr2/edit?id=${record.replaceId}`,
            },
          ],
          [
            'exchangePrConfirm',
            {
              name: translate('web.resource.afterAbility.querenshenqingdan'),
              url: `/afterAbility/exchangeManage/exchangePrConfirm/edit?id=${record.replaceId}`,
            },
          ],
          [
            'exchangePrDeliver',
            {
              name: translate('web.resource.afterAbility.huanhuofahuo'),
              url: `/afterAbility/exchangeManage/exchangePrDeliver/edit?id=${record.replaceId}`,
            },
          ],
          [
            'exchangePrReceived',
            {
              name: translate('web.resource.afterAbility.tuihuoshouhuo'),
              url: `/afterAbility/exchangeManage/exchangePrReceived/edit?id=${record.replaceId}`,
            },
          ],
          [
            'exchangePrConfirmBack',
            {
              name: translate('web.resource.afterAbility.querenhuanhuohuidan'),
              url: `/afterAbility/exchangeManage/exchangePrConfirmBack/edit?id=${record.replaceId}`,
            },
          ],
          [
            'repairPrSubmit',
            {
              name: translate('web.common.tijiaoshenhe'),
              url: `/afterAbility/repairManage/repairPrSubmit/edit?id=${record.applyId}`,
            },
          ],
          [
            'repairPr1',
            {
              name: translate('web.common.tijiaoshenhe'),
              url: `/afterAbility/repairManage/repairPr1/edit?id=${record.applyId}`,
            },
          ],
          [
            'repairPr2',
            {
              name: translate('web.common.tijiaoshenhe'),
              url: `/afterAbility/repairManage/repairPr2/edit?id=${record.applyId}`,
            },
          ],
          [
            'repairPrConfirm',
            {
              name: translate('web.resource.afterAbility.querenshenqingdan'),
              url: `/afterAbility/repairManage/repairPrConfirm/edit?id=${record.applyId}`,
            },
          ],
        ])
        const item = urlMap.get(pageType)
        return (
          <>
            <AuthButton type="custom" code="edit">
              <Button type="link" onClick={() => history.push(item!.url)}>
                {item?.name}
              </Button>
            </AuthButton>
          </>
        )
      },
    },
  ])
  let rowKey = props.rowKey || 'replaceId'
  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        rowKey={rowKey}
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

export default ExchangeApplyView
