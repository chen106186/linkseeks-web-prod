/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-18 11:22:44
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:48:35
 * @Description: 待新增换货发货单
 */
import React from 'react'
import { Badge, Button } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { formatTimeString } from '@/utils'
import { getAftersalesReplaceGoodsPageToBeAddLogisticsBySupplier } from '@apps/apis'
import {
  EXCHANGE_INNER_STATUS_SUPPLIER_NOT_ADDED_LOGISTICS,
  EXCHANGE_INNER_STATUS_SUPPLIER_UNCONFIRMED_LOGISTICS,
  EXCHANGE_INNER_STATUS_UNACCEPTED_RETURN_EXCHANGE,
} from '@/constants/afterService'
import StatusTag from '@/components/StatusTag'
import { EXCHANGE_OUTER_STATUS_TAG_MAP, EXCHANGE_INNER_STATUS_BADGE_MAP } from '../../constants'
import { useWebIntl } from '@apps/locales'
import { PageHeaderWrapper, StandardFormTable, EyeAuthButton, DetailAuthButton, AuthButton } from '@apps/components'

import { dateFormat } from '@apps/utils/src/format'

const ReturnPrAddLogistics: React.FC = () => {
  const translate = useWebIntl()

  const columns: any[] = [
    {
      title: translate('web.resource.member.shenqingdanhao'),
      dataIndex: 'applyNo',
      key: 'applyNo',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton url={`/afterAbility/exchangeManage/exchangePrAddLogistics/detail?id=${record.replaceId}`}>
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
    {
      title: translate('web.resource.afterAbility.huanhuopici'),
      dataIndex: 'replaceBatch',
      key: 'replaceBatch',
    },
    {
      title: translate('web.resource.afterAbility.huanhuofahuodanhao'),
      dataIndex: 'replaceDeliveryNo',
      render: (text, record) => (
        <Link to={`/afterAbility/exchangeManage/exchangePrAddDeliver/deliverDetail?id=${record.replaceDeliveryId}`}>
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
      render: (text, record) => (
        <>
          {record.innerStatus === EXCHANGE_INNER_STATUS_SUPPLIER_NOT_ADDED_LOGISTICS && (
            <AuthButton type="add" code="add">
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/add?createType=${5}&id=${
                      record.replaceId
                    }`,
                  )
                }
              >
                {translate('web.common.add')}
              </Button>
            </AuthButton>
          )}
          {record.innerStatus === EXCHANGE_INNER_STATUS_SUPPLIER_UNCONFIRMED_LOGISTICS && (
            <AuthButton type="custom" code="checkLogistics">
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `/logisticsAbility/logisticsBillSubmit/logisticsBillQuery/detail?id=${record.replaceLogisticsId}`,
                  )
                }
              >
                {translate('web.resource.afterAbility.chakanwuliudan')}
              </Button>
            </AuthButton>
          )}
          {record.innerStatus === EXCHANGE_INNER_STATUS_UNACCEPTED_RETURN_EXCHANGE && (
            <AuthButton type="edit" code="edit">
              <Button
                type="link"
                onClick={() =>
                  history.push(
                    `/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill/edit?id=${record.replaceLogisticsId}`,
                  )
                }
              >
                {translate('web.common.edit')}
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ]
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
          return getAftersalesReplaceGoodsPageToBeAddLogisticsBySupplier(params)
        }}
      />
    </PageHeaderWrapper>
  )
}

export default ReturnPrAddLogistics
