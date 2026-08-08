/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-05 14:25:41
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 20:04:30
 * @Description: 退货申请单查询
 */
import React, { useState, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Card, Badge, Progress, Button } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import { getAftersalesReturnGoodsPageByConsumer, getAftersalesReturnGoodsPageItems } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { coverColFiltersItem } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { listSearchSchema } from './schema'
import { RETURN_OUTER_STATUS_TAG_MAP, RETURN_INNER_STATUS_BADGE_MAP } from '../../constants'

const formActions = createFormActions()

const ReturnQuery: React.FC = () => {
  const ref = useRef<any>({})

  const intl = useIntl()

  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.applyNo', defaultMessage: '申请单号' }),
      dataIndex: 'applyNo',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton url={`/afterAbility/returnApplication/returnQuery/detail?id=${record.returnId}`}>
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
      title: intl.formatMessage({ id: 'afterService.common.return.refundAmount', defaultMessage: '退款金额' }),
      dataIndex: 'refundAmount',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.applyTime', defaultMessage: '单据时间' }),
      dataIndex: 'applyTime',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.outerStatus', defaultMessage: '外部状态' }),
      dataIndex: 'outerStatusName',
      render: (text, record) => <StatusTag type={RETURN_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.innerStatus', defaultMessage: '内部状态' }),
      dataIndex: 'innerStatusName',
      render: (text, record) => (
        <Badge color={RETURN_INNER_STATUS_BADGE_MAP[record.innerStatus] || '#606266'} text={text} />
      ),
    },
  ]

  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const fetchListData = (params: any) => {
    const { startTime, endTime, ...rest } = params
    return new Promise((resolve, reject) => {
      getAftersalesReturnGoodsPageByConsumer({
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
    const res = await getAftersalesReturnGoodsPageItems()

    if (res.code === 1000) {
      const { data } = res
      const { outerStatusList = [], innerStatusList = [] } = data

      const newColumns = columns.slice()

      // filter 0 过滤掉全部选项
      coverColFiltersItem(
        newColumns,
        'outerStatusName',
        outerStatusList.map((item) => ({ text: item.name, value: item.status })).filter((item) => item.value),
      )
      coverColFiltersItem(
        newColumns,
        'innerStatusName',
        innerStatusList.map((item) => ({ text: item.name, value: item.status })).filter((item) => item.value),
      )

      setColumns(newColumns)

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
            rowKey: 'returnId',
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

export default ReturnQuery
