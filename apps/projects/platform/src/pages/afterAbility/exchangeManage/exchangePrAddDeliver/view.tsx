/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-06 16:30:44
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:48:17
 * @Description: 待新增换货发货单
 */
import React from 'react'
import { Badge, Button, Modal } from '@linkseeks/ui'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import {
  getAftersalesReplaceGoodsPageToBeAddReplaceDeliveryGoods,
  postAftersalesReplaceGoodsVerifyReplaceDeliveryGoods,
} from '@apps/apis'
import {
  EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_DELIVERY,
  EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_DELIVERY,
} from '@/constants/afterService'
import { PageHeaderWrapper, StandardFormTable, useTableRef, EyeAuthButton, DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { EXCHANGE_OUTER_STATUS_TAG_MAP, EXCHANGE_INNER_STATUS_BADGE_MAP } from '../../constants'

import { AuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import { dateFormat } from '@apps/utils/src/format'
const { confirm } = Modal

const ExchangePrAddDeliver: React.FC = () => {
  const ref = useTableRef()

  const translate = useWebIntl()

  const handleVerify = (record) => {
    confirm({
      title: translate('web.resource.afterAbility.querenshenhecaozuo'),
      icon: <ExclamationCircleOutlined />,
      content: translate('web.resource.afterAbility.returnPrAddDeliverVerifyContent', {
        replaceDeliveryNo: record.replaceDeliveryNo,
      }),
      onOk() {
        return new Promise((resolve, reject) => {
          postAftersalesReplaceGoodsVerifyReplaceDeliveryGoods({
            id: record.replaceId,
          })
            .then((res) => {
              if (res.code === 1000) {
                ref.current.reload()
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

  const columns: any[] = [
    {
      title: translate('web.resource.member.shenqingdanhao'),
      key: 'applyNo',
      dataIndex: 'applyNo',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton url={`/afterAbility/exchangeManage/exchangePrAddDeliver/detail?id=${record.replaceId}`}>
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
      key: 'replaceDeliveryNo',
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
      key: 'option',
      render: (text, record) => (
        <>
          {record.innerStatus === EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_DELIVERY && (
            <AuthButton type="add">
              <Button
                type="link"
                onClick={() =>
                  history.push(`/afterAbility/exchangeManage/exchangePrAddDeliver/add?applyId=${record.replaceId}`)
                }
              >
                {translate('web.common.add')}
              </Button>
            </AuthButton>
          )}
          {record.innerStatus === EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_DELIVERY && (
            <AuthButton type="custom" code="examine">
              <Button type="link" onClick={() => handleVerify(record)}>
                {translate('web.common.approved')}
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
          return getAftersalesReplaceGoodsPageToBeAddReplaceDeliveryGoods(params)
        }}
      />
    </PageHeaderWrapper>
  )
}

export default ExchangePrAddDeliver
