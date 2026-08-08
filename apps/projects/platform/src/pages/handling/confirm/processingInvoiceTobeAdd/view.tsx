import React, { useCallback, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, Space, Popconfirm } from 'antd'
import { basicSchema } from '../../common/schemas/confirmQuery'
import StandardTable from '@/components/StandardTable'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import setColumnsByLinks from '../../common/columns/comfrimOtherQuery'
import useFetchData from '../../common/hooks/useFetchData'
import useFetchFilterData, { FilterResType } from '../../common/hooks/useFetchFilterData'
import useColumnWithFilter from '../../common/hooks/useColumnWithFilter'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { DEPENDENT_DOC_PRODUCTION, DOC_TYPE_PROCESS_INVOICE } from '@/constants/commodity'
import { PENDING_ADD_PROCESS_DELIVERY, PENDING_VERIFY_PROCESS_DELIVERY } from '@/constants/handling'
import useSingleActionSubmit from '../../common/hooks/useSingleAction'
import { getEnhanceProcessToBeAddDeliveryList, postEnhanceProcessToBeAddDeliveryExam } from '@apps/apis'
import { AuthButton } from '@apps/components'

const formActions = createFormActions()
const queryColumns = setColumnsByLinks({
  detail: '/handling/confirm/query/detail',
  delivery: '/commodityAbility/stockSellStorage/bills/detail',
})
const ADD_DELIVERY_PATH = '/commodityAbility/stockSellStorage/bills/add'

const AllQuery = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const { fetchListData, onFormatSearchData } = useFetchData()
  const { filterRes, fetchSelectOptions } = useFetchFilterData()
  const { submitLoadingID, onSingleAction } = useSingleActionSubmit()

  const { columns } = useColumnWithFilter(
    queryColumns,
    [
      {
        title: intl.formatMessage({ id: 'common.table.action' }),
        render: (text, record) => {
          const loading = submitLoadingID.includes(record.id)
          return (
            <Space>
              {record.processInnerStatus === PENDING_ADD_PROCESS_DELIVERY && (
                <AuthButton type="custom" code="processShipment">
                  <Link
                    to={`${ADD_DELIVERY_PATH}?relevanceInvoicesId=${record.id}&invoicesTypeId=${DOC_TYPE_PROCESS_INVOICE}&relevanceInvoices=${DEPENDENT_DOC_PRODUCTION}`}
                  >
                    {intl.formatMessage({ id: 'handling.query.processStock.add.processShipment' })}
                  </Link>
                </AuthButton>
              )}
              {record.processInnerStatus === PENDING_VERIFY_PROCESS_DELIVERY && (
                <AuthButton type="custom" code="shenhe">
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'handling.query.processStock.exam.deliverNo',
                      deliveryNo: record.deliverNo,
                    })}
                    // visible={visibleID === record.id}
                    placement="left"
                    okText={intl.formatMessage({ id: 'common.button.confirm' })}
                    cancelText={intl.formatMessage({ id: 'common.button.cancel' })}
                    // onCancel={handleCancel}
                    okButtonProps={{ loading: loading }}
                    onConfirm={() => handleExam({ id: record.id })}
                  >
                    <a>{intl.formatMessage({ id: 'handling.toExamine' })}</a>
                  </Popconfirm>
                </AuthButton>
              )}
            </Space>
          )
        },
      },
    ],
    filterRes,
  )

  const handleExam = async (params: { id: number }) => {
    const { code, data } = await onSingleAction(postEnhanceProcessToBeAddDeliveryExam, params)
    if (code === 1000) {
      formActions.submit()
    }
  }

  const handleSearch = useCallback((values: any) => {
    const searchData = onFormatSearchData(values)
    ref.current.reload(searchData)
  }, [])

  return (
    <PageHeaderWrapper title={intl.formatMessage({ id: 'handling.confirm.query.processingInvoiceTobeAdd' })}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            // rowSelection: selectRow
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(getEnhanceProcessToBeAddDeliveryList, params)}
          controlRender={
            <NiceForm
              schema={basicSchema}
              actions={formActions}
              onSubmit={handleSearch}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'noticeNo', FORM_FILTER_PATH)
                useAsyncInitSelect(['innerStatus', 'outerStatus'], fetchSelectOptions)
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default AllQuery
