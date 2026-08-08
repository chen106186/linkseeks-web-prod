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

import { EXCHANGE_OUTER_STATUS_TAG_MAP, EXCHANGE_INNER_STATUS_BADGE_MAP } from '../../../constants'
import {
  EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_STORAGE,
  EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_STORAGE,
} from '@/constants/afterService'
import { postAftersalesReplaceGoodsVerifyReplaceGoodsStorage } from '@apps/apis'
interface IProps {
  request: (params: any) => void
  pageType: 'exchangePrReceived' | 'exchangePrAddWarehousing' | 'exchangePrConfirmBack'
}

const { confirm } = Modal

const ExchangePrReceived = (props: IProps) => {
  const translate = useWebIntl()
  const tableRef = useTableRef()
  const { request, pageType } = props
  const columns: any[] = [
    {
      title: translate('web.resource.member.shenqingdanhao'),
      dataIndex: 'applyNo',
      key: 'applyNo',
      render: (text, record) => {
        const applyUrl = new Map([
          ['exchangePrReceived', '/afterAbility/exchangeApplication/exchangePrReceived/detail'],
          ['exchangePrAddWarehousing', '/afterAbility/exchangeApplication/exchangePrAddWarehousing/detail'],
          ['exchangePrConfirmBack', '/afterAbility/exchangeApplication/exchangePrConfirmBack/detail'],
        ])
        return (
          <DetailAuthButton>
            <EyeAuthButton url={`${applyUrl.get(pageType)}?id=${record.replaceId}`}>{text}</EyeAuthButton>
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
    pageType === 'exchangePrConfirmBack'
      ? {
          title: translate('web.resource.afterAbility.returnBatch'),
          dataIndex: 'returnBatch',
          key: 'returnBatch',
        }
      : {
          title: translate('web.resource.afterAbility.huanhuopici'),
          dataIndex: 'replaceBatch',
          key: 'replaceBatch',
        },
    pageType === 'exchangePrConfirmBack'
      ? {
          title: translate('web.resource.afterAbility.returnDeliveryNo'),
          dataIndex: 'returnDeliveryNo',
          key: 'returnDeliveryNo',
          render: (text, record) => (
            <Link
              to={`/afterAbility/exchangeApplication/exchangePrAddDeliver/deliverDetail?id=${record.returnDeliveryId}`}
            >
              {text}
            </Link>
          ),
        }
      : {
          title: translate('web.resource.afterAbility.replaceStorageNo'),
          dataIndex: 'replaceStorageNo',
          key: 'replaceStorageNo',
          render: (text, record) => {
            const urlMap = new Map([
              ['exchangePrReceived', `/commodityAbility/stockSellStorage/bills/detail?id=${record.replaceStorageId}`],
              [
                'exchangePrAddWarehousing',
                `/afterAbility/exchangeApplication/exchangePrAddWarehousing/warehousingDetail?id=${record.replaceDeliveryId}`,
              ],
            ])
            return <Link to={urlMap.get(pageType) as string}>{text}</Link>
          },
        },
    {
      title: translate('web.resource.afterAbility.outerStatus'),
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      render: (text, record) => <StatusTag type={EXCHANGE_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
    },
    {
      title: translate('web.resource.afterAbility.innerStatus'),
      dataIndex: 'innerStatusName',
      key: 'innerStatusName',
      render: (text, record) => (
        <Badge color={EXCHANGE_INNER_STATUS_BADGE_MAP[record.innerStatus] || '#606266'} text={text} />
      ),
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      render: (text, record) => {
        const renderMap = new Map([
          [
            'exchangePrReceived',
            <>
              <AuthButton type="custom" code="exchangereceipt">
                <Button
                  type="link"
                  onClick={() =>
                    history.push(`/afterAbility/exchangeApplication/exchangePrReceived/edit?id=${record.replaceId}`)
                  }
                >
                  {translate('web.resource.afterAbility.huanhuoshouhuo')}
                </Button>
              </AuthButton>
            </>,
          ],
          [
            'exchangePrAddWarehousing',
            <>
              {record.innerStatus === EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_STORAGE && (
                <AuthButton type="add">
                  <Button
                    type="link"
                    onClick={() =>
                      history.push(
                        `/afterAbility/exchangeApplication/exchangePrAddWarehousing/add?applyId=${record.replaceId}&deliveryId=${record.replaceDeliveryId}`,
                      )
                    }
                  >
                    {translate('web.common.add')}
                  </Button>
                </AuthButton>
              )}
              {record.innerStatus === EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_STORAGE && (
                <AuthButton type="custom" code="examine">
                  <Button type="link" onClick={() => handleVerify(record)}>
                    {translate('web.common.approved')}
                  </Button>
                </AuthButton>
              )}
            </>,
          ],
          [
            'exchangePrConfirmBack',
            <>
              <AuthButton type="custom" code="returnPrConfirmBack">
                <Button
                  type="link"
                  onClick={() =>
                    history.push(`/afterAbility/exchangeApplication/exchangePrConfirmBack/edit?id=${record.replaceId}`)
                  }
                >
                  {translate('web.resource.afterAbility.querentuihuohuidan')}
                </Button>
              </AuthButton>
            </>,
          ],
        ])
        return renderMap.get(pageType)
      },
    },
  ]
  const handleVerify = (record) => {
    confirm({
      title: translate('web.resource.afterAbility.querenshenhecaozuo'),
      icon: <ExclamationCircleOutlined />,
      content: translate('web.resource.afterAbility.returnPrAddDeliverVerifyContent', {
        replaceStorageNo: record.replaceStorageNo,
      }),
      onOk() {
        return new Promise((resolve, reject) => {
          postAftersalesReplaceGoodsVerifyReplaceGoodsStorage({
            id: record.replaceId,
          })
            .then((res) => {
              if (res.code === 1000) {
                tableRef.current.reload()
              }
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },
    })
  }
  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        rowKey="replaceId"
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

export default ExchangePrReceived
