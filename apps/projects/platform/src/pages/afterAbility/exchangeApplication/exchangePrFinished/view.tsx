import React, { useState, useRef } from 'react'
import { Card, Badge, Progress, Button, Popconfirm, Space } from 'antd'
import { history } from '@linkseeks/router-manager'
import { ClockCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import { DetailAuthButton, EyeAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { getAftersalesReplaceGoodsPageToBeComplete } from '@apps/apis'
import StatusTag from '@/components/StatusTag'
import { EXCHANGE_OUTER_STATUS_TAG_MAP, EXCHANGE_INNER_STATUS_BADGE_MAP } from '../../constants'
import { useWebIntl } from '@apps/locales'
import { dateFormat } from '@apps/utils/src/format'
const ExchangePrFinished: React.FC = () => {
  const translate = useWebIntl()
  const columns: any[] = [
    {
      title: translate('web.resource.member.shenqingdanhao'),
      dataIndex: 'applyNo',
      key: 'applyNo',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton url={`/afterAbility/exchangeApplication/exchangePrFinished/detail?id=${record.replaceId}`}>
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
          <AuthButton type="custom" code="confirm">
            <Button
              type="link"
              onClick={() =>
                history.push(`/afterAbility/exchangeApplication/exchangePrFinished/edit?id=${record.replaceId}`)
              }
            >
              {translate('web.resource.afterAbility.refundSubmitFinished')}
            </Button>
          </AuthButton>
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
          return getAftersalesReplaceGoodsPageToBeComplete(params)
        }}
      />
    </PageHeaderWrapper>
  )
}

export default ExchangePrFinished
