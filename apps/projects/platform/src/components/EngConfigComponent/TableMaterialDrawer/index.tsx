/**
 * 选择物料弹窗
 */
import { getProductMaterielGetDoesNotFreezeMaterielList } from '@apps/apis'
import { ColumnType } from 'antd/lib/table'
import React, { memo, forwardRef } from 'react'
import CommonTableDrawer from '../CommonTableDrawer'
import { schema } from './schema'
import { fetchBrand, fetchCategoryData, fetchTreeData, useAsyncCascader } from '../effects'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { Cascader } from 'antd'
import { getIntl } from '@linkseeks/i18n'

interface PropsType {
  handleOk?: (data: any) => void
  onQueryAll?: (value?: any) => void
  otherParams?: Object
}

const intl = getIntl()

const tableColumns: ColumnType<any>[] = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  {
    title: intl.formatMessage({ id: 'material.code', defaultMessage: '物料编号' }),
    dataIndex: 'code',
    key: 'code',
    width: 120,
  },
  { title: intl.formatMessage({ id: 'material.name', defaultMessage: '物料名称' }), dataIndex: 'name', key: 'name' },
  {
    title: intl.formatMessage({ id: 'material.group.title', defaultMessage: '物料组' }),
    dataIndex: ['materialGroup', 'name'],
    key: 'materialGroup',
  },
  { title: intl.formatMessage({ id: 'material.type', defaultMessage: '规格型号' }), dataIndex: 'type', key: 'type' },
  {
    title: intl.formatMessage({ id: 'material.category', defaultMessage: '品类' }),
    dataIndex: ['customerCategory', 'name'],
    key: 'customerCategory',
  },
  {
    title: intl.formatMessage({ id: 'material.brand', defaultMessage: '品牌' }),
    dataIndex: ['brand', 'name'],
    key: 'brand',
  },
]

const TableMaterialDrawer = ({ handleOk, onQueryAll, otherParams = {}, ...rest }: PropsType, ref) => {
  return (
    <CommonTableDrawer
      ref={ref}
      title={intl.formatMessage({ id: 'material.modal.selectMaterial.title', defaultMessage: '选择物料' })}
      queryAllLabel={intl.formatMessage({ id: 'material.all', defaultMessage: '全部物料' })}
      onOk={handleOk}
      onQueryAll={onQueryAll}
      tableColumns={tableColumns}
      fetchTableApi={getProductMaterielGetDoesNotFreezeMaterielList}
      fnTableParams={(params: any) => {
        const materialGroupId = params?.materialGroupId?.length
          ? params?.materialGroupId[params?.materialGroupId?.length - 1]
          : ''
        const customerCategoryId = params?.customerCategoryId?.length
          ? params?.customerCategoryId[params?.customerCategoryId?.length - 1]
          : ''
        materialGroupId && (params.materialGroupId = materialGroupId)
        customerCategoryId && (params.customerCategoryId = customerCategoryId)
        return { ...params, ...otherParams }
      }}
      controlSchema={schema}
      controlComponents={{ Cascader }}
      controlEffects={($, actions) => {
        useStateFilterSearchLinkageEffect($, actions, 'code', FORM_FILTER_PATH)
        useAsyncCascader('materialGroupId', fetchTreeData)
        useAsyncCascader('customerCategoryId', fetchCategoryData)
        useAsyncSelect('brandId', fetchBrand, ['name', 'id'])
      }}
      {...rest}
    />
  )
}

export default memo(forwardRef(TableMaterialDrawer))
