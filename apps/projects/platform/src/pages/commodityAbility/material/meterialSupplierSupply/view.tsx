import React, { useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Card } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  getProductMaterielGetMaterielSupplyAbilityList,
  GetProductMaterielGetMaterielSupplyAbilityListResponseDetail,
} from '@apps/apis'
import NiceForm from '@/components/NiceForm'
const formActions = createFormActions()

type SearchFormValuesType = {
  name: string
  memberType: string
  roleId: number
  level: number
  source: number
  innerStatus: number
  outerStatus: number
  status: number
  startDate: string
  endDate: string
  memberConfigs: { [key: string]: any }
  code: string
  currencyType: number
  categoryId: [string]
}

const fetchData = async (params: any) => {
  const payload = { ...params }

  const res = await getProductMaterielGetMaterielSupplyAbilityList(payload, { ctlType: 'none' })

  if (res.code === 1000) {
    return res.data
  }
  return { data: [], totalCount: 0 }
}

const MemberMaintain: React.FC<[]> = () => {
  const ref = useRef<any>({})
  const intl = useIntl()

  const columns: ColumnType<GetProductMaterielGetMaterielSupplyAbilityListResponseDetail>[] = [
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.code',
        defaultMessage: '物料编号',
      }),
      dataIndex: 'code',
      fixed: true,
      width: 120,
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.name',
        defaultMessage: '物料名称',
      }),
      width: 160,
      fixed: true,
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.materialGroup',
        defaultMessage: '物料组',
      }),
      dataIndex: ['materialGroup', 'name'],
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.type',
        defaultMessage: '规格型号',
      }),
      dataIndex: 'type',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.category',
        defaultMessage: '品类',
      }),
      dataIndex: ['customerCategory', 'name'],
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.brand',
        defaultMessage: '品牌',
      }),
      dataIndex: ['brand', 'name'],
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.unitName',
        defaultMessage: '单位',
      }),
      dataIndex: 'unitName',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.memberName',
        defaultMessage: '供应商名称',
      }),
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.goodsNo',
        defaultMessage: '供应商物料编号',
      }),
      dataIndex: 'goodsNo',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.userName',
        defaultMessage: '联系人',
      }),
      dataIndex: 'userName',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.phone',
        defaultMessage: '联系电话',
      }),
      dataIndex: 'phone',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.manufacturer',
        defaultMessage: '生产厂家',
      }),
      dataIndex: 'manufacturer',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.origin',
        defaultMessage: '产地',
      }),
      dataIndex: 'origin',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.departure',
        defaultMessage: '起运地',
      }),
      dataIndex: 'departure',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.deliveryCycle',
        defaultMessage: '到货周期',
      }),
      dataIndex: 'deliveryCycle',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.material.supplier.deliveryMethod',
        defaultMessage: '交货方式',
      }),
      dataIndex: 'deliveryMethod',
    },
  ]

  const handleReloadList = (values: SearchFormValuesType) => {
    ref.current.reload(values)
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'validateId',
            scroll: {
              x: 2000,
            },
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={handleReloadList}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'code', FORM_FILTER_PATH)
              }}
              schema={{
                type: 'object',
                properties: {
                  mageLayout: {
                    type: 'object',
                    'x-component': 'mega-Layout',
                    properties: {
                      code: {
                        type: 'string',
                        'x-component': 'Search',
                        'x-component-props': {
                          align: 'flex-left',
                          placeholder: intl.formatMessage({
                            id: 'common.material.code.search',
                            defaultMessage: '搜索物料编号',
                          }),
                          allowClear: true,
                        },
                      },
                      [FORM_FILTER_PATH]: {
                        type: 'object',
                        'x-component': 'mega-Layout',
                        'x-component-props': {
                          grid: true,
                          full: true,
                          autoRow: true,
                          columns: 6,
                        },
                        properties: {
                          name: {
                            type: 'string',
                            'x-component-props': {
                              placeholder: `${intl.formatMessage({
                                id: 'common.material.name.search',
                                defaultMessage: '搜索物料名称',
                              })}`,
                              allowClear: true,
                              style: {
                                width: 145,
                              },
                            },
                          },
                          vendorMemberName: {
                            type: 'string',
                            'x-component-props': {
                              placeholder: `${intl.formatMessage({
                                id: 'common.material.vendorMemberName.search',
                                defaultMessage: '搜索供应商名称',
                              })}`,
                              allowClear: true,
                              style: {
                                width: 145,
                              },
                            },
                          },
                          submit: {
                            'x-component': 'Submit',
                            'x-mega-props': {
                              span: 1,
                            },
                            'x-component-props': {
                              children: intl.formatMessage({
                                id: 'member.management.maintain.query.query',
                              }),
                            },
                          },
                        },
                      },
                    },
                  },
                },
              }}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberMaintain
