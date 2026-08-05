import React, { useRef, useState, useImperativeHandle, useEffect } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from 'antd'
import StandardTable from '@/components/StandardTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ColumnType } from 'antd/lib/table/interface'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSelectGetSelectCategoryOptionEffect } from '@/pages/transaction/effect/index'
import { useLinkageUtils } from '@/utils/formEffectUtils'
const { onFormMount$ } = FormEffectHooks

import {
  PurchaseDemandSchema,
  PurchaseDemandPublicSchema,
  INQUIRYDEMANDORDER_SCHEMA,
  INQUIRYWAITORDER_SCHEMA,
  OFFERDEMANDSERAH_SCHEMA,
  OFFERSERAH_SCHEMA,
  OFFERSERAHAUDIT_SCHEMA,
  CONFIRMOFFERSERAH_SCHEMA,
  CONFIRMOFFERSUBMITAPRICE_SCHEMA,
  CONFIRMOFFERAUDIT_SCHEMA,
} from '../../schema'
import { DEMANDPLANSERCH_SECHEMA, DEMANDPLANADDED_SECHEMA, DEMANDPLAN_SECHEMA } from '../../schema/demandPlan'
import { PURCHASEPLANSERCH_SECHEMA, PURCHASEPLAN_SECHEMA } from '../../schema/purchasePlan'
import {
  PURCHASEBIDORDER_SCHEMA,
  PURCHASEBIDREADYADD_SCHEMA,
  PURCHASEBIDOSIGNUP_SCHEMA,
} from '../../schema/purchaseBid'

import { ONLINEBIDORDER_SCHEMA, ONLINEBIDREADYBID_SCHEMA, ONLINEBIDREADYSIGN_SCHEMA } from '../../schema/onlineBid'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'

interface Iprops {
  fetch?: () => Promise<unknown>
  fetchRowkeys?(e: number[])
  controllerBtns?: React.ReactNode
  schemaType?:
    | 'PurchaseDemand'
    | 'PurchaseDemandPublic'
    | 'INQUIRYDEMANDORDER_SCHEMA'
    | 'INQUIRYWAITORDER_SCHEMA'
    | 'OFFERDEMANDSERAH_SCHEMA'
    | 'OFFERSERAH_SCHEMA'
    | 'OFFERSERAHAUDIT_SCHEMA'
    | 'CONFIRMOFFERSERAH_SCHEMA'
    | 'CONFIRMOFFERSUBMITAPRICE_SCHEMA'
    | 'CONFIRMOFFERAUDIT_SCHEMA'
    | 'DEMANDPLANSERCH_SECHEMA'
    | 'DEMANDPLANADDED_SECHEMA'
    | 'DEMANDPLAN_SECHEMA'
    | 'PURCHASEPLANSERCH_SECHEMA'
    | 'PURCHASEPLAN_SECHEMA'
    | 'PURCHASEBIDORDER_SCHEMA'
    | 'PURCHASEBIDREADYADD_SCHEMA'
    | 'PURCHASEBIDOSIGNUP_SCHEMA'
    | 'ONLINEBIDORDER_SCHEMA'
    | 'ONLINEBIDREADYBID_SCHEMA'
    | 'ONLINEBIDREADYSIGN_SCHEMA'
  columns: ColumnType<any>[]
  effects?: string
  selectedRow?: boolean
  reload?: any
  extraParams?: any
  externalStatusFetch?: () => Promise<unknown>
  interiorStatusFetch?: () => Promise<unknown>
  /** rowKey */
  rowKey?: string
  /** 禁用 */
  getCheckboxProps?: (record: any) => void
}
const formActions = createFormActions()
const Table: React.FC<Iprops> = (props: any) => {
  const {
    schemaType,
    columns,
    effects,
    fetch,
    controllerBtns,
    selectedRow,
    reload,
    fetchRowkeys,
    rowKey,
    extraParams,
    getCheckboxProps,
    externalStatusFetch,
    interiorStatusFetch,
  } = props
  const tableRef = useRef<any>({})
  /** Schema */
  const SchemaRender = () => {
    switch (schemaType) {
      case 'PurchaseDemand':
        return PurchaseDemandSchema
      case 'PurchaseDemandPublic':
        return PurchaseDemandPublicSchema
      case 'INQUIRYDEMANDORDER_SCHEMA':
        return INQUIRYDEMANDORDER_SCHEMA
      case 'INQUIRYWAITORDER_SCHEMA':
        return INQUIRYWAITORDER_SCHEMA
      case 'OFFERDEMANDSERAH_SCHEMA':
        return OFFERDEMANDSERAH_SCHEMA
      case 'OFFERSERAH_SCHEMA':
        return OFFERSERAH_SCHEMA
      case 'OFFERSERAHAUDIT_SCHEMA':
        return OFFERSERAHAUDIT_SCHEMA
      case 'CONFIRMOFFERSERAH_SCHEMA':
        return CONFIRMOFFERSERAH_SCHEMA
      case 'CONFIRMOFFERSUBMITAPRICE_SCHEMA':
        return CONFIRMOFFERSUBMITAPRICE_SCHEMA
      case 'CONFIRMOFFERAUDIT_SCHEMA':
        return CONFIRMOFFERAUDIT_SCHEMA
      case 'DEMANDPLANSERCH_SECHEMA':
        return DEMANDPLANSERCH_SECHEMA
      case 'DEMANDPLANADDED_SECHEMA':
        return DEMANDPLANADDED_SECHEMA
      case 'DEMANDPLAN_SECHEMA':
        return DEMANDPLAN_SECHEMA
      case 'PURCHASEPLANSERCH_SECHEMA':
        return PURCHASEPLANSERCH_SECHEMA
      case 'PURCHASEPLAN_SECHEMA':
        return PURCHASEPLAN_SECHEMA
      case 'PURCHASEBIDORDER_SCHEMA':
        return PURCHASEBIDORDER_SCHEMA
      case 'PURCHASEBIDREADYADD_SCHEMA':
        return PURCHASEBIDREADYADD_SCHEMA
      case 'PURCHASEBIDOSIGNUP_SCHEMA':
        return PURCHASEBIDOSIGNUP_SCHEMA
      case 'ONLINEBIDORDER_SCHEMA':
        return ONLINEBIDORDER_SCHEMA
      case 'ONLINEBIDREADYBID_SCHEMA':
        return ONLINEBIDREADYBID_SCHEMA
      case 'ONLINEBIDREADYSIGN_SCHEMA':
        return ONLINEBIDREADYSIGN_SCHEMA
    }
  }
  /** 列表数据 */
  const fetchData = (params?: any) => {
    return new Promise((resolve, reject) => {
      fetch({ ...params, ...extraParams })
        .then((res) => {
          resolve(res.data)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }

  /**多选 */
  const [selectRow, selectRowFns] = useRowSelectionTable({
    customKey: rowKey || 'id',
    extendsSelection: {
      getCheckboxProps: (record) => getCheckboxProps && getCheckboxProps(record),
    },
  })

  useEffect(() => {
    fetchRowkeys && fetchRowkeys(selectRowFns.selectedRowKeys)
  }, [selectRowFns])

  useImperativeHandle(reload, () => ({
    reloadCurrent: () => {
      tableRef.current.reloadCurrent()
      selectRowFns.setSelectedRowKeys([])
    },
  }))

  // 搜索
  const search = (values: any) => {
    tableRef.current.reload(values)
  }

  const useBusinessEffects = () => {
    const linkage = useLinkageUtils()
    onFormMount$().subscribe(() => {
      externalStatusFetch &&
        externalStatusFetch()
          .then((res) => {
            if (res.code !== 1000) return
            const _enum = res.data.map((item) => {
              return { label: item.name || item.message, value: item.satatus || item.code }
            })
            linkage.enum('externalState', _enum)
            linkage.enum('externalStatusList', _enum)
          })
          .catch((error) => {
            console.warn(error)
          })
      interiorStatusFetch &&
        interiorStatusFetch()
          .then((res) => {
            if (res.code !== 1000) return
            const _enum = res.data.map((item) => {
              return { label: item.name || item.message, value: item.satatus || item.code }
            })
            linkage.enum('interiorState', _enum)
            linkage.enum('innerStatusList', _enum)
          })
          .catch((error) => {
            console.warn(error)
          })
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          currentRef={tableRef}
          columns={columns}
          tableProps={{ rowKey: rowKey ? rowKey : 'id' }}
          rowSelection={selectedRow && selectRow}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              components={{
                controllerBtns: () => controllerBtns,
              }}
              onSubmit={(values) => search(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, effects, FORM_FILTER_PATH)
                FormEffectHooks.onFieldChange$('category').subscribe((state) => {
                  searchSelectGetSelectCategoryOptionEffect(actions, 'category')
                })
                useBusinessEffects()
              }}
              schema={schemaType && SchemaRender()}
            ></NiceForm>
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Table
