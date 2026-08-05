import React, { useRef, useState } from 'react'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { getSchema } from '../common/searchTableSchema'
import { Button, Card, Cascader, message, Space } from 'antd'
import { getColumn } from '../common/columns'
import { createFormActions } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { EMPTY, fetchBrand, fetchCategoryData, fetchTreeData, useAsyncCascader } from '../common/useGetTableSearchData'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import {
  getProductMaterielMaterielExamineChangeList2,
  postProductMaterielMaterielExamineChangeBatch2,
} from '@apps/apis'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'

/**
 * 物料查询
 */
const formActions = createFormActions()
const querySchema = getSchema({ showStatus: false })

const MaterialQuery = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const ref = useRef<any>({})
  const [loading, setLoading] = useState(false)
  const [selectRow, selectRowFns] = useRowSelectionTable({
    customKey: 'id',
  })

  const columns = getColumn({
    detailUrl: '/commodityAbility/material/materialPendingExamChangeII/detail',
    extraColumn: [
      {
        title: intl.formatMessage({ id: 'material.operation', defaultMessage: '操作' }),

        render: (text, record) => {
          return (
            <Space>
              <DetailAuthButton>
                <Link to={`/commodityAbility/material/materialPendingExamChangeII/detail?id=${record.id}`}>
                  {translate('web.common.approved')}
                </Link>
              </DetailAuthButton>
            </Space>
          )
        },
      },
    ],
  })

  const controllerBtns = () => {
    return (
      <Space>
        <AuthButton type="custom" code="examineBatch">
          <Button type="primary" onClick={handleBatchSuccess} loading={loading}>
            {intl.formatMessage({ id: 'material.exam.batch.success', defaultMessage: '批量审核通过' })}
          </Button>
        </AuthButton>
      </Space>
    )
  }

  const handleBatchSuccess = async () => {
    const selectedRowKeys = selectRowFns.selectedRowKeys
    if (selectedRowKeys.length === 0) {
      message.info(intl.formatMessage({ id: 'material.select.required', defaultMessage: '请选择物料' }))
      return
    }
    setLoading(true)
    try {
      const { data, code } = await postProductMaterielMaterielExamineChangeBatch2({ idList: selectedRowKeys })
      if (code === 1000) {
        selectRowFns.setSelectedRowKeys([])
        selectRowFns.setSelectRow([])
        ref.current.reloadCurrent()
      }
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (values: any) => {
    const { materialGroupId, customerCategoryId, ...rest } = values
    const formatMaterialGroupId =
      materialGroupId && materialGroupId.length > 0 ? { materialGroupId: materialGroupId?.pop() } : {}

    const formatCategoryId =
      customerCategoryId && customerCategoryId.length > 0 ? { customerCategoryId: customerCategoryId?.pop() } : {}

    const result = { ...rest, ...formatMaterialGroupId, ...formatCategoryId }
    ref.current.reload(result)
  }

  const fetchListData = async (params) => {
    try {
      const { data, code } = await getProductMaterielMaterielExamineChangeList2(params)
      if (code === 1000) {
        return data
      }
      return EMPTY
    } catch (e) {
      return EMPTY
    }
  }

  return (
    <PageHeaderWrapper title={intl.formatMessage({ id: 'material.exam.changeII', defaultMessage: '待审核变更二级' })}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            rowSelection: selectRow,
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={fetchListData}
          controlRender={
            <NiceForm
              components={{ controllerBtns, Cascader }}
              schema={querySchema}
              actions={formActions}
              onSubmit={handleSearch}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'code', FORM_FILTER_PATH)
                useAsyncCascader('materialGroupId', fetchTreeData)
                useAsyncCascader('customerCategoryId', fetchCategoryData)
                useAsyncSelect('brandId', fetchBrand, ['name', 'id'])
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MaterialQuery
