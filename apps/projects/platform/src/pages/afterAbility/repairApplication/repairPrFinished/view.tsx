import React, { useRef } from 'react'
import { Badge, Button } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { dateFormat } from '@apps/utils/src/format'
import { PageHeaderWrapper, StandardFormTable, AuthButton, DetailAuthButton, EyeAuthButton } from '@apps/components'
import { getAftersalesRepairGoodsPageToBeConfirmComplete } from '@apps/apis'
import StatusTag from '@/components/StatusTag'
import { REPAIR_OUTER_STATUS_TAG_MAP, REPAIR_INNER_STATUS_BADGE_MAP } from '../../constants'

import { useWebIntl } from '@apps/locales'

const RepairPrFinished: React.FC = () => {
  const translate = useWebIntl()

  const columns: any[] = [
    {
      title: translate('web.resource.member.shenqingdanhao'),
      dataIndex: 'applyNo',
      key: 'applyNo',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton url={`/afterAbility/repairApplication/repairPrFinished/detail?id=${record.applyId}`}>
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
      render: (text, record) => <StatusTag type={REPAIR_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
    },
    {
      title: translate('web.resource.afterAbility.innerStatus'),
      dataIndex: 'innerStatusName',
      key: 'innerStatusName',
      render: (text, record) => (
        <Badge color={REPAIR_INNER_STATUS_BADGE_MAP[record.innerStatus] || '#606266'} text={text} />
      ),
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      render: (text, record) => (
        <>
          <AuthButton type="custom" code="edit">
            <Button
              type="link"
              onClick={() => history.push(`/afterAbility/repairApplication/repairPrFinished/edit?id=${record.applyId}`)}
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
        rowKey="applyId"
        request={(params) => {
          const [startTime, endTime] = params?.applyTime?.split(',') || []
          if (startTime) {
            params.startTime = dateFormat(new Date(+startTime), 'YY-MM-DD HH:mm:ss')
          }
          if (endTime) {
            params.endTime = dateFormat(new Date(+endTime), 'YY-MM-DD HH:mm:ss')
          }
          delete params.applyTime
          return getAftersalesRepairGoodsPageToBeConfirmComplete(params)
        }}
      />
    </PageHeaderWrapper>
  )
}

export default RepairPrFinished
