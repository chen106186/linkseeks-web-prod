import React, { useState, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Card, Badge, Progress, Button } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import { getAftersalesRepairGoodsPageBySupplier, getAftersalesRepairGoodsPageItems } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { coverColFiltersItem } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { listSearchSchema } from './schema'
import { REPAIR_OUTER_STATUS_TAG_MAP, REPAIR_INNER_STATUS_BADGE_MAP } from '../../constants'

const formActions = createFormActions()

const RepairManageQuery: React.FC = () => {
  const ref = useRef<any>({})

  const intl = useIntl()

  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.applyNo', defaultMessage: '申请单号' }),
      dataIndex: 'applyNo',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton url={`/afterAbility/repairManage/repairQuery/detail?id=${record.applyId}`}>
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
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.consumerName', defaultMessage: '采购会员' }),
      dataIndex: 'consumerName',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.applyTime', defaultMessage: '单据时间' }),
      dataIndex: 'applyTime',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.outerStatus', defaultMessage: '外部状态' }),
      dataIndex: 'outerStatusName',
      render: (text, record) => <StatusTag type={REPAIR_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.innerStatus', defaultMessage: '内部状态' }),
      dataIndex: 'innerStatusName',
      render: (text, record) => (
        <Badge color={REPAIR_INNER_STATUS_BADGE_MAP[record.innerStatus] || '#606266'} text={text} />
      ),
    },
  ]

  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const fetchListData = (params: any) => {
    const { startTime, endTime, ...rest } = params
    return new Promise((resolve, reject) => {
      getAftersalesRepairGoodsPageBySupplier({
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

  // 初始化高级筛选选项
  const fetchSearchItems = async () => {
    const res = await getAftersalesRepairGoodsPageItems()

    if (res.code === 1000) {
      const { data } = res
      const { outerStatusList = [], innerStatusList = [] } = data

      return {
        outerStatus: outerStatusList
          .map((item) => ({ label: item.name, value: item.status }))
          .filter((item) => item.value),
        innerStatus: innerStatusList
          .map((item) => ({ label: item.name, value: item.status }))
          .filter((item) => item.value),
      }
    }
    return {}
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'applyId',
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
                useAsyncInitSelect(['innerStatus', 'outerStatus'], fetchSearchItems)
              }}
              schema={listSearchSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default RepairManageQuery
