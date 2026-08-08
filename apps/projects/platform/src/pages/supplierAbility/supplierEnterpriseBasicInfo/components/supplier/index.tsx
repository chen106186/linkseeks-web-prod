import React, { useContext, useEffect, useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Card } from 'antd'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  getProductMaterielGetMaterielSupplyAbilityListBySupplier,
  GetProductMaterielGetMaterielSupplyAbilityListBySupplierResponseDetail,
} from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import MemberDetailsContext from '../../../memberDetailsContext'

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

interface SupplierAbilityProps {}

const SupplierAbility: React.FC<SupplierAbilityProps> = () => {
  const contenxt = useContext(MemberDetailsContext)
  const { details: memberInfo } = contenxt
  const ref = useRef<any>({})
  const intl = useIntl()

  useEffect(() => {
    contenxt.onAnchorsReady([])
  }, [])

  const fetchData = async (params: any) => {
    const payload = {
      ...params,
      vendorMemberId: memberInfo?.memberId,
      vendorRoleId: memberInfo?.roleId,
    }

    const res = await getProductMaterielGetMaterielSupplyAbilityListBySupplier(payload, { ctlType: 'none' })

    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const columns: ColumnType<GetProductMaterielGetMaterielSupplyAbilityListBySupplierResponseDetail>[] = [
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
                  'x-component': 'Mega-Layout',
                  properties: {
                    controllerWrap: {
                      type: 'object',
                      'x-component': 'Mega-Layout',
                      'x-component-props': {
                        grid: true,
                      },
                      properties: {
                        ctl: {
                          type: 'string',
                          'x-component': 'Children',
                          'x-component-props': {
                            children: (
                              <b style={{ fontSize: 14 }}>
                                {intl.formatMessage({ id: 'member.management.maintain.detail.supplier' })}
                              </b>
                            ),
                          },
                        },
                        code: {
                          type: 'string',
                          'x-component': 'Search',
                          'x-component-props': {
                            placeholder: intl.formatMessage({
                              id: 'common.material.code.search',
                              defaultMessage: '搜索物料编号',
                            }),
                            allowClear: true,
                          },
                        },
                      },
                    },
                    [FORM_FILTER_PATH]: {
                      type: 'object',
                      'x-component': 'Flex-Layout',
                      'x-component-props': {
                        colStyle: {
                          marginLeft: 20,
                        },
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
  )
}

export default SupplierAbility
