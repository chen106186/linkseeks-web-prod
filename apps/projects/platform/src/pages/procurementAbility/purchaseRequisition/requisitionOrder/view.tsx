import React from 'react'
import { Card } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import { useSelfTable } from './model/useRequisitionOrder'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../index.less'
import { tableListSchema } from '../constant'
import { getPurchaseRequisitionTransferPurchasePage } from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { searchOptionEffect } from '../readyAddBill/effect'
import { getMemberUserPage } from '@apps/apis'

// 待请购单转采购订单

export interface RequisitionOrderProps {}

const fetchTableData = async (params) => {
  // lifeCycleStageRuleId: lifecyclePhaseRules.SUPPLIER_ORDER
  const { data } = await getPurchaseRequisitionTransferPurchasePage({ ...params })
  return data
}

const RequisitionOrder: React.FC<RequisitionOrderProps> = () => {
  const { columns, ref } = useSelfTable()
  const formActions = createFormActions()

  const controllerBtns = null
  const handleSearch = async (value) => {
    if (!value) {
      formActions.setFieldState('requisitionerId', (fieldState) => {
        fieldState.props.enum = []
      })
      return
    }
    const data: any = { name: value, status: '1', pageSize: 10, current: 1 }
    const res = await getMemberUserPage(data)
    const list = res.data.data.map((item) => {
      return { label: item.name, value: item.userId }
    })
    formActions.setFieldState('requisitionerId', (fieldState) => {
      fieldState.props.enum = list
    })
  }
  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          fetchTableData={(params) => fetchTableData(params)}
          columns={columns}
          currentRef={ref}
          rowKey="id"
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              expressionScope={{
                controllerBtns,
                handleSearch,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'requisitionNo', FORM_FILTER_PATH)
                FormEffectHooks.onFieldChange$('brandId').subscribe(() => {
                  searchOptionEffect(actions, 'brandId')
                })
              }}
              schema={tableListSchema()}
              components={{
                DateRangePickerUnix,
                Submit,
              }}
            />
          }
          tableProps={{
            scroll: {
              x: '100%',
            },
          }}
        />
        {/* <StandardTable
        fetchTableData={params => fetchTableData(params)}
        columns={columns}
        currentRef={ref}
        rowKey="id"
        formilyLayouts={{
          justify: 'space-between'
        }}
        formilyProps={{
          ctx: {
            inline: false,
            schema: tableListSchema(),
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect(
                $,
                actions,
                'requisitionNo',
                FORM_FILTER_PATH,
              );
            },
            components: {
              DateRangePickerUnix,
              Submit
            }
          },
          layouts: {
            order: 2,
            span: 24
          }
        }}
      /> */}
      </Card>
    </PageHeaderWrapper>
  )
}

RequisitionOrder.defaultProps = {}

export default RequisitionOrder
