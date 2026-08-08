import React, { useRef } from 'react'
import moment from 'moment'
import { Card, Tag, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { EyeAuthButton } from '@apps/components'
import {
  getProductSampleDeliverVendorPage,
  getProductSampleDeliverStatusDropItems,
  GetProductSampleDeliverVendorPageResponseDetail,
} from '@apps/apis'
import { outerStatusColor } from '../common/commonData'
import { querySchema } from './schema'
import useSpliceArray from '@/hooks/useSpliceArray'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
const format = 'YYYY-MM-DD'
const RequestSheetQuery: React.FC = () => {
  const ref = useRef<any>({})
  const formActions = createFormActions()
  const intl = useIntl()

  const defaultColumns: ColumnType<GetProductSampleDeliverVendorPageResponseDetail>[] = [
    {
      title: intl.formatMessage({ id: 'customerAbility.songyang.title_1', defaultMessage: '送样需求单号' }),
      dataIndex: 'deliveryNo',
      key: 'deliveryNo',
      width: 160,
      render: (t, r) => (
        <EyeAuthButton url={`/commodityAbility/deliverTogether/requestSheetQuery/detail?id=${r.id}`}>{t}</EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.songyang.title_2', defaultMessage: '送样需求单摘要' }),
      dataIndex: 'summary',
      key: 'summary',
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.songyang.title_3', defaultMessage: '需求日期' }),
      dataIndex: 'demandDate',
      key: 'demandDate',
      sorter: (a, b) => moment(a.demandDate, format).valueOf() - moment(b.demandDate, format).valueOf(),
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.songyang.title_4', defaultMessage: '送样类型' }),
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.songyang.title_5', defaultMessage: '紧急程度' }),
      dataIndex: 'emergencyLevelName',
      key: 'emergencyLevelName',
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.songyang.title_6', defaultMessage: '接收部门' }),
      dataIndex: 'receiveDepartment',
      key: 'receiveDepartment',
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.songyang.title_buyers', defaultMessage: '采购商' }),
      dataIndex: 'buyerMemberName',
      key: 'buyerMemberName',
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.songyang.title_8', defaultMessage: '单据时间' }),
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: (a, b) => moment(a.createTime, format).valueOf() - moment(b.createTime, format).valueOf(),
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.songyang.title_9', defaultMessage: '外部状态' }),
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      render: (text, record) => (
        <Tag
          color={outerStatusColor.hasOwnProperty(record.outerStatus) ? outerStatusColor[record.outerStatus] : 'default'}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.songyang.title_0', defaultMessage: '操作' }),
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <DetailAuthButton>
          {record.showCheckQuality && (
            <Button
              type="link"
              onClick={() => history.open(`/qualityAbility/qualitySynergy/search/detail?id=${record.qualityId}`)}
            >
              {intl.formatMessage({ id: 'customerAbility.songyang.qualityInspection', defaultMessage: '查看质检单' })}
            </Button>
          )}
        </DetailAuthButton>
      ),
    },
  ]
  const [columns, columnsHandle] = useSpliceArray<ColumnType<any>>(defaultColumns)

  const fetchListData = async (params) => {
    const { data } = await getProductSampleDeliverVendorPage(params)
    return data
  }

  // 获取外部状态下拉列表
  const fetchSelectOptions = async () => {
    const { data } = await getProductSampleDeliverStatusDropItems()
    return data.map((item) => ({ label: item.text, value: item.id }))
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          currentRef={ref}
          columns={columns}
          fetchTableData={(params: unknown) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              schema={querySchema}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'deliveryNo', FORM_FILTER_PATH)
                // 外部状态
                useAsyncSelect('outerStatus', fetchSelectOptions)
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default RequestSheetQuery
