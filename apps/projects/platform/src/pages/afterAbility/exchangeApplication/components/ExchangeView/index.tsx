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
import { useWebIntl } from '@apps/locales'
import {
  getAftersalesReplaceGoodsPageToBeAddLogisticsByConsumer,
  getAftersalesReplaceGoodsPageToBeAddReturnDeliveryGoods,
  postAftersalesReplaceGoodsVerifyReturnDeliveryGoods,
  getAftersalesReplaceGoodsPageToBeReturnDeliveryGoods,
} from '@apps/apis'
import { EXCHANGE_OUTER_STATUS_TAG_MAP, EXCHANGE_INNER_STATUS_BADGE_MAP } from '../../../constants'
import { useState } from 'react'
import { Button, Modal, Badge } from '@linkseeks/ui'
import {
  EXCHANGE_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS,
  EXCHANGE_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS,
  EXCHANGE_INNER_STATUS_UNACCEPTED_RETURN_LOGISTICS,
  EXCHANGE_INNER_STATUS_NOT_ADDED_RETURN_DELIVERY,
  EXCHANGE_INNER_STATUS_UNREVIEWED_RETURN_DELIVERY,
} from '@/constants/afterService'
import { history } from '@linkseeks/router-manager'
import { dateFormat } from '@apps/utils/src/format'

import { ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

interface ExchangeViewProps {
  pageType: 'exchangePrAddLogistics' | 'exchangePrAddDeliver' | 'exchangePrDeliver'
}

const ExchangeView = (props: ExchangeViewProps) => {
  const translate = useWebIntl()
  const tableRef = useTableRef()

  const { pageType } = props

  const handleVerify = (record) => {
    confirm({
      title: translate('web.resource.afterAbility.querenshenhecaozuo'),
      icon: <ExclamationCircleOutlined />,
      content: translate('web.resource.afterAbility.returnPrAddDeliverVerifyContent', {
        returnDeliveryNo: record.returnDeliveryNo,
      }),
      onOk() {
        return new Promise((resolve, reject) => {
          postAftersalesReplaceGoodsVerifyReturnDeliveryGoods({
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
  const renderControl = (record) => {
    if (pageType === 'exchangePrAddLogistics') {
      return (
        <>
          {record.innerStatus === EXCHANGE_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS && (
            <AuthButton type="add">
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/add?createType=${4}&id=${
                      record.replaceId
                    }`,
                  )
                }
              >
                {translate('web.common.add')}
              </Button>
            </AuthButton>
          )}
          {record.innerStatus === EXCHANGE_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS && (
            <AuthButton type="custom" code="seeLogistics">
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `/logisticsAbility/logisticsBillSubmit/logisticsBillQuery/preview?id=${record.returnLogisticsId}`,
                  )
                }
              >
                {translate('web.resource.afterAbility.chakanwuliudan')}
              </Button>
            </AuthButton>
          )}
          {record.innerStatus === EXCHANGE_INNER_STATUS_UNACCEPTED_RETURN_LOGISTICS && (
            <AuthButton type="edit">
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/edit?id=${record.returnLogisticsId}`,
                  )
                }
              >
                {translate('web.common.edit')}
              </Button>
            </AuthButton>
          )}
        </>
      )
    } else if (pageType === 'exchangePrAddDeliver') {
      return (
        <>
          {record.innerStatus === EXCHANGE_INNER_STATUS_NOT_ADDED_RETURN_DELIVERY && (
            <AuthButton type="add">
              <Button
                type="link"
                onClick={() =>
                  history.push(`/afterAbility/exchangeApplication/exchangePrAddDeliver/add?applyId=${record.replaceId}`)
                }
              >
                {translate('web.common.add')}
              </Button>
            </AuthButton>
          )}
          {record.innerStatus === EXCHANGE_INNER_STATUS_UNREVIEWED_RETURN_DELIVERY && (
            <AuthButton type="custom" code="examine">
              <Button type="link" onClick={() => handleVerify(record)}>
                {translate('web.common.approved')}
              </Button>
            </AuthButton>
          )}
        </>
      )
    } else if (pageType === 'exchangePrDeliver') {
      return (
        <>
          <AuthButton type="custom" code="deliver">
            <Button
              type="link"
              onClick={() =>
                history.push(`/afterAbility/exchangeApplication/exchangePrDeliver/edit?id=${record.replaceId}`)
              }
            >
              {translate('web.resource.afterAbility.returnPrDeliverAllRefundDeliver')}
            </Button>
          </AuthButton>
        </>
      )
    }
    return null
  }

  const [columns, setColumns] = useState<any[]>([
    {
      title: translate('web.resource.member.shenqingdanhao'),
      key: 'applyNo',
      dataIndex: 'applyNo',
      render: (text, record) => {
        const urlMap = new Map([
          ['exchangePrAddLogistics', '/afterAbility/exchangeApplication/exchangePrAddLogistics/detail'],
          ['exchangePrAddDeliver', '/afterAbility/exchangeApplication/exchangePrAddDeliver/detail'],
          ['exchangePrDeliver', '/afterAbility/exchangeApplication/exchangePrDeliver/detail'],
        ])
        const url = urlMap.get(pageType)
        return (
          <DetailAuthButton>
            <EyeAuthButton url={`${url}?id=${record.replaceId}`}>{text}</EyeAuthButton>
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
    {
      title: translate('web.resource.afterAbility.returnBatch'),
      dataIndex: 'returnBatch',
      key: 'returnBatch',
    },
    {
      title: translate('web.resource.afterAbility.returnDeliveryNo'),
      dataIndex: 'returnDeliveryNo',
      key: 'returnDeliveryNo',
      render: (text, record) => (
        <Link to={`/afterAbility/exchangeApplication/exchangePrAddDeliver/deliverDetail?id=${record.returnDeliveryId}`}>
          {text}
        </Link>
      ),
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
      key: 'option',
      render: (text, record) => renderControl(record),
    },
  ])
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
          if (pageType === 'exchangePrAddLogistics') {
            return getAftersalesReplaceGoodsPageToBeAddLogisticsByConsumer(params)
          } else if (pageType === 'exchangePrAddDeliver') {
            return getAftersalesReplaceGoodsPageToBeAddReturnDeliveryGoods(params)
          } else if (pageType === 'exchangePrDeliver') {
            return getAftersalesReplaceGoodsPageToBeReturnDeliveryGoods(params)
          }
        }}
        actionRef={tableRef}
      />
    </PageHeaderWrapper>
  )
}
export default ExchangeView
