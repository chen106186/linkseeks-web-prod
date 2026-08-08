/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-18 11:22:44
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:40:45
 * @Description: 待新增换货发货单
 */
import React, { useState, useRef } from 'react'
import { Card, Badge, Progress, Button } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
// import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import { getAftersalesReplaceGoodsPageToBeAddLogisticsByConsumer } from '@apps/apis'
import {
  EXCHANGE_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS,
  EXCHANGE_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS,
  EXCHANGE_INNER_STATUS_UNACCEPTED_RETURN_LOGISTICS,
} from '@/constants/afterService'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { listSearchSchema } from './schema'
import { EXCHANGE_OUTER_STATUS_TAG_MAP, EXCHANGE_INNER_STATUS_BADGE_MAP } from '../../constants'

import { AuthButton } from '@apps/components'

const formActions = createFormActions()

const ExchangePrAddLogistics: React.FC = () => {
  const ref = useRef<any>({})

  const intl = useIntl()

  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.applyNo', defaultMessage: '申请单号' }),
      dataIndex: 'applyNo',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton url={`/afterAbility/exchangeApplication/exchangePrAddLogistics/detail?id=${record.replaceId}`}>
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.applyAbstract', defaultMessage: '申请单摘要' }),
      dataIndex: 'applyAbstract',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.supplierName', defaultMessage: '供应会员' }),
      dataIndex: 'supplierName',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.applyTime', defaultMessage: '单据时间' }),
      dataIndex: 'applyTime',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.return.returnBatch', defaultMessage: '退货批次' }),
      dataIndex: 'returnBatch',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.return.returnDeliveryNo', defaultMessage: '退货发货单号' }),
      dataIndex: 'returnDeliveryNo',
      render: (text, record) => (
        <Link to={`/afterAbility/exchangeApplication/exchangePrAddDeliver/deliverDetail?id=${record.returnDeliveryId}`}>
          {text}
        </Link>
      ),
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.outerStatus', defaultMessage: '外部状态' }),
      dataIndex: 'outerStatusName',
      render: (text, record) => <StatusTag type={EXCHANGE_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.innerStatus', defaultMessage: '内部状态' }),
      dataIndex: 'innerStatusName',
      render: (text, record) => (
        <Badge color={EXCHANGE_INNER_STATUS_BADGE_MAP[record.innerStatus] || '#606266'} text={text} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'option',
      render: (text, record) => (
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
                {intl.formatMessage({ id: 'afterService.common.add', defaultMessage: '新增' })}
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
                {intl.formatMessage({ id: 'afterService.common.checkLogistics', defaultMessage: '查看物流单' })}
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
                {intl.formatMessage({ id: 'afterService.common.edit', defaultMessage: '编辑' })}
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const fetchListData = (params: any) => {
    const { startTime, endTime, ...rest } = params
    return new Promise((resolve, reject) => {
      getAftersalesReplaceGoodsPageToBeAddLogisticsByConsumer({
        startTime: startTime ? formatTimeString(+startTime) : null,
        endTime: endTime ? formatTimeString(+endTime) : null,
        ...rest,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'replaceId',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'applyNo', FORM_FILTER_PATH)
              }}
              schema={listSearchSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default ExchangePrAddLogistics
