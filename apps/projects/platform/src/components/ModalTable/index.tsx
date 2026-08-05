import React, { ReactText, useRef, useEffect, useLayoutEffect } from 'react'
import StandardTable, { IStandardTableProps } from '@/components/StandardTable'
import NestTable from '@/components/NestTable'
import { Row, Col, Modal } from 'antd'
import {
  requisitSchema,
  productModalSchema,
  productModalByMemberSchema,
  memberModalSchema,
  supplierModalSchema,
  inquirySchema,
  demandSchema,
  enquirySchema,
  mergeOrderSchema,
  goodsModalSchema,
  demandNumberSchema,
  logisticsDeliverySearchSchema,
  addOrderModalSchema,
  logisticsSelectGoodsSearchSchema,
  SelectRfqOrderSearchSchema,
  SelectLogisticsService,
  contractSchema,
  departmentSchema,
  requisitionSchema,
} from './schema'
import Search from '../NiceForm/components/Search'
import SearchSelect from '../NiceForm/components/SearchSelect'
import Submit from '../NiceForm/components/Submit'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import DateSelect from '../NiceForm/components/DateSelect'

export interface ModalTableProps extends IStandardTableProps<any> {
  width?: number
  modalTitle?: ReactText
  confirm?()
  cancel?()
  visible?: boolean
  resetModal?: object
  modalType?:
    | 'productByDefault'
    | 'productByMember'
    | 'memberByDefault'
    | 'supplierByDefault'
    | 'inquiryByDefault'
    | 'demandByDefault'
    | 'enquiryModel'
    | 'MergeOrderByDefault'
    | 'goodsModalSchema'
    | 'demandNumberSchema'
    | 'logisticsDelivery'
    | 'addOrderModalSchema'
    | 'selectGoodsSchema'
    | 'selectRfqOrder'
    | 'SelectLogisticsService'
    | 'contractByDefault'
    | 'departmentSchema'
    | 'requisitionSchema'
    | 'requisitSchema'
    | 'none'
  useNestTable?: boolean // 是否使用嵌套表格
  nestColumns?: any[]
  nestTableProps?: any
  // fix: 新增参数， 为true时每次开启弹窗都会重新reload接口
  forceRender?: boolean
  searchName?: string
}

const ModalTable: React.FC<ModalTableProps> = (props) => {
  const {
    width = 704,
    modalTitle,
    confirm,
    cancel,
    visible,
    currentRef,
    resetModal,
    modalType = 'none',
    forceRender,
    useNestTable = false,
    nestColumns,
    nestTableProps,
    searchName,
    ...resetTable
  } = props
  const { tableType = 'small' } = resetTable
  const selfRef = currentRef || useRef<any>({})
  useEffect(() => {
    if (visible && forceRender) {
      // 重新开启时需reload接口
      // fix: 去掉自动reload接口, 防止重复请求
      // fix: 新增forceRender接口， 用于控制弹窗是否需要reload
      selfRef.current.reloadCurrent && selfRef.current.reloadCurrent()
    } else {
      selfRef.current.resetField &&
        selfRef.current.resetField({
          validate: false,
        })
    }
  }, [visible])

  const modelSchemaRender = () => {
    switch (modalType) {
      case 'productByDefault': {
        return productModalSchema
      }
      case 'productByMember': {
        return productModalByMemberSchema
      }
      case 'memberByDefault': {
        return memberModalSchema
      }
      case 'supplierByDefault': {
        return supplierModalSchema
      }
      case 'inquiryByDefault': {
        return inquirySchema
      }

      case 'enquiryModel': {
        return enquirySchema
      }

      case 'demandByDefault': {
        return demandSchema
      }

      case 'MergeOrderByDefault': {
        return mergeOrderSchema
      }
      case 'goodsModalSchema': {
        return goodsModalSchema
      }
      case 'demandNumberSchema': {
        return demandNumberSchema
      }
      case 'logisticsDelivery': {
        return logisticsDeliverySearchSchema
      }
      case 'addOrderModalSchema': {
        return addOrderModalSchema
      }
      case 'selectGoodsSchema': {
        return logisticsSelectGoodsSearchSchema
      }
      case 'selectRfqOrder': {
        return SelectRfqOrderSearchSchema
      }
      case 'SelectLogisticsService': {
        return SelectLogisticsService
      }
      case 'contractByDefault': {
        return contractSchema
      }
      case 'departmentSchema': {
        return departmentSchema
      }
      case 'requisitionSchema': {
        return requisitionSchema
      }
      case 'requisitSchema': {
        return requisitSchema
      }
      case 'none': {
        return {}
      }
    }
  }
  return (
    <Modal width={width} title={modalTitle} onOk={confirm} onCancel={cancel} visible={visible} {...resetModal}>
      {useNestTable ? (
        <NestTable
          NestColumns={nestColumns}
          className="common_tb"
          rowClassName={(_, index) => index % 2 === 0 && 'tb_bg'}
          {...nestTableProps}
        />
      ) : (
        <StandardTable
          keepAlive={false}
          tableType="small"
          currentRef={selfRef}
          formRender={(child, ps) => (
            <Row justify="space-between" style={{ marginBottom: 16 }}>
              <Col style={{ zIndex: 99, width: tableType === 'small' ? 'calc(100% - 200px)' : '100%' }}>{child}</Col>
              {tableType === 'small' && <Col style={{ marginTop: 4, minWidth: 128 }}>{ps}</Col>}
            </Row>
          )}
          formilyProps={
            modalType === 'none'
              ? null
              : {
                  ctx: {
                    schema: modelSchemaRender(),
                    components: { ModalSearch: Search, SearchSelect, Submit, DateSelect },
                    effects: ($, actions) => {
                      useStateFilterSearchLinkageEffect($, actions, searchName ? searchName : 'name', FORM_FILTER_PATH)
                    },
                  },
                }
          }
          {...resetTable}
        />
      )}
    </Modal>
  )
}

ModalTable.defaultProps = {}

export default ModalTable
