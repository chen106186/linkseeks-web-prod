import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Card, Button, Space } from 'antd'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Submit from '@/components/NiceForm/components/Submit'
import { useSelfTable } from './model/useReadyAddBill'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import '../index.less'
import { tableListSchema } from '../constant'
import { getPurchaseRequisitionCreatePage } from '@apps/apis'
import { createAsyncFormActions, createFormActions, FormEffectHooks } from '@apps/formily'
import { searchOptionEffect } from './effect'
import { getMemberUserPage } from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import { AuthButton } from '@apps/components'

// 待新增请购单

export interface ReadyAddBillProps {}

const fetchTableData = async (params) => {
  const { data } = await getPurchaseRequisitionCreatePage(params)
  return data
}

const ReadyAddBill: React.FC<ReadyAddBillProps> = () => {
  const { columns, ref } = useSelfTable()
  const intl = useIntl()
  const clickAdd = () => {
    history.push(`/procurementAbility/purchaseRequisition/readyAddBill/add`)
  }
  const formActions = createFormActions()

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

  const controllerBtns = (
    <Space>
      <AuthButton type="custom" code="add">
        <Button icon={<PlusCircleOutlined />} type="primary" onClick={clickAdd}>
          {intl.formatMessage({ id: 'purchaseRequisition.xinjian', defaultMessage: '新建' })}
        </Button>
      </AuthButton>
    </Space>
  )
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
                FormEffectHooks.onFieldChange$('brandId').subscribe((state) => {
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
      </Card>
    </PageHeaderWrapper>
  )
}

ReadyAddBill.defaultProps = {}

export default ReadyAddBill
