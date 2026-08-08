import React, { ReactText, useRef, useEffect, useLayoutEffect, useState } from 'react'
import StandardTable, { IStandardTableProps } from '@/components/StandardTable'
import { ISchema } from '@apps/formily'
import NestTable from '@/components/NestTable'
import { Row, Col, Modal, Form, Radio } from 'antd'
import Search from '@/components//NiceForm/components/Search'
import SearchSelect from '@/components//NiceForm/components/SearchSelect'
import Submit from '@/components//NiceForm/components/Submit'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import DateSelect from '@/components//NiceForm/components/DateSelect'
import { getOrderCommonLogisticsPage } from '@apps/apis'
import {
  getAftersalesReplaceGoodsPageToBeAddReplaceByLogistics,
  getAftersalesReplaceGoodsPageToBeAddReturnByLogistics,
  getAftersalesReturnGoodsPageByLogistics,
} from '@apps/apis'
import { getEnhanceProcessToBeDeliveryList } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export interface ModalTableProps extends IStandardTableProps<any> {
  width?: number
  confirm?: Function
  cancel?()
  visible?: boolean
  resetModal?: object
  useNestTable?: boolean // 是否使用嵌套表格
  nestColumns?: any[]
  nestTableProps?: any
  // fix: 新增参数， 为true时每次开启弹窗都会重新reload接口
  forceRender?: boolean
  invoicesNo?: string // 对应订单号/售后单号
  relevanceType?: number //对应单据类型
}

export const logisticsDeliverySearchSchema: ISchema = {
  type: 'object',
  properties: {
    orderNo: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'logistics.danjuhao' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.huiyuanmingcheng' }),
            style: {
              width: 160,
            },
          },
        },
        orderThe: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.danjuzhaiyao' }),
            style: {
              width: 160,
            },
          },
        },
        '[startCreateTime,endCreateTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.danjushijianquanbu' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'logistics.chaxun' }),
          },
        },
      },
    },
  },
}
export const otherSearchSchema: ISchema = {
  type: 'object',
  properties: {
    applyNo: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'logistics.shenqingdanhao' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.huiyuanmingcheng' }),
            style: {
              width: 160,
            },
          },
        },
        applyAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.danjuzhaiyao' }),
            style: {
              width: 160,
            },
          },
        },
        '[startTime,endTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'logistics.danjushijianquanbu' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'logistics.chaxun' }),
          },
        },
      },
    },
  },
}
const ModalTableOrder: React.FC<ModalTableProps> = (props) => {
  const {
    width = 704,
    confirm,
    cancel,
    visible,
    currentRef,
    resetModal,
    forceRender,
    useNestTable = false,
    nestColumns,
    nestTableProps,
    invoicesNo,
    relevanceType,
    ...resetTable
  } = props
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

  const [form] = Form.useForm()
  const [type, setType] = useState<number>(1)
  const [modalTitle, setmodalTitle] = useState<string>(intl.formatMessage({ id: 'logistics.dingdan' }))

  useEffect(() => {
    console.log(relevanceType)
    setType(relevanceType)
  }, [visible])

  useEffect(() => {
    form.setFieldsValue({
      radio: type,
    })
  }, [type])

  const fetchData = (parmas?: any) => {
    if (visible) {
      return new Promise((resolve) => {
        switch (type) {
          case 1:
            getOrderCommonLogisticsPage({ ...parmas })
              .then((res) => {
                if (res.code === 1000) {
                  res.data.data.forEach((item: any) => {
                    item.id = item.orderId
                    item.applyNo = item.orderNo
                    item.memberName = item.buyerMemberName
                    item.applyAbstract = item.orderThe
                    item.applyTime = item.createTime
                  })
                  resolve(res.data)
                }
              })
              .catch((error) => {
                console.warn(error)
              })
            break
          case 2:
            getAftersalesReplaceGoodsPageToBeAddReturnByLogistics({ ...parmas })
              .then((res: any) => {
                if (res.code === 1000) {
                  res.data.data.forEach((item: any) => {
                    item.id = item.applyId
                  })
                  resolve(res.data)
                }
              })
              .catch((error) => {
                console.warn(error)
              })
            break
          case 3:
            getAftersalesReplaceGoodsPageToBeAddReplaceByLogistics({ ...parmas })
              .then((res: any) => {
                if (res.code === 1000) {
                  res.data.data.forEach((item: any) => {
                    item.id = item.applyId
                  })
                  resolve(res.data)
                }
              })
              .catch((error) => {
                console.warn(error)
              })
            break
          case 4:
            getAftersalesReturnGoodsPageByLogistics({ ...parmas })
              .then((res: any) => {
                if (res.code === 1000) {
                  res.data.data.forEach((item: any) => {
                    item.id = item.applyId
                  })
                  resolve(res.data)
                }
              })
              .catch((error) => {
                console.warn(error)
              })
            break
          case 5:
            getEnhanceProcessToBeDeliveryList({ ...parmas })
              .then((res: any) => {
                if (res.code === 1000) {
                  resolve(res.data)
                }
              })
              .catch((error) => {
                console.warn(error)
              })
            break
        }
      })
    }
  }

  return (
    <Modal
      width={width}
      title={modalTitle}
      onOk={() => confirm(type)}
      onCancel={cancel}
      visible={visible}
      {...resetModal}
      maskClosable={false}
    >
      {useNestTable ? (
        <NestTable
          NestColumns={nestColumns}
          className="common_tb"
          rowClassName={(_, index) => index % 2 === 0 && 'tb_bg'}
          {...nestTableProps}
        />
      ) : (
        <StandardTable
          tableType="small"
          currentRef={selfRef}
          fetchTableData={(params) => fetchData(params)}
          formRender={(child, ps) => (
            <Row justify="space-between" style={{ marginBottom: 16 }}>
              <Col span={18} style={{ zIndex: 99 }}>
                <Form form={form}>
                  <Form.Item name="radio" label={intl.formatMessage({ id: 'logistics.danjuxuanze' })}>
                    <Radio.Group
                      onChange={(e) => {
                        setType(e.target.value)
                        selfRef.current.reloadCurrent()
                      }}
                    >
                      <Radio value={1}>{intl.formatMessage({ id: 'logistics.dingdan' })}</Radio>
                      <Radio value={2}>{intl.formatMessage({ id: 'logistics.huanhuoshenqingdantuihuo' })}</Radio>
                      <Radio value={3}>{intl.formatMessage({ id: 'logistics.huanhuoshenqingdanhuanhuo' })}</Radio>
                      <Radio value={4}>{intl.formatMessage({ id: 'logistics.tuihuoshenqingdan' })}</Radio>
                      <Radio value={5}>{intl.formatMessage({ id: 'logistics.shengchantongzhidan' })}</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Form>
              </Col>
              <Col style={{ marginTop: 4 }}>{ps}</Col>
              <Col span={18} style={{ zIndex: 99 }}>
                {child}
              </Col>
            </Row>
          )}
          formilyProps={{
            ctx: {
              schema: type === 1 ? logisticsDeliverySearchSchema : otherSearchSchema,
              components: { ModalSearch: Search, SearchSelect, Submit, DateSelect },
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, type === 1 ? 'orderNo' : 'applyNo', FORM_FILTER_PATH)
              },
            },
          }}
          {...resetTable}
        />
      )}
    </Modal>
  )
}

ModalTableOrder.defaultProps = {}

export default ModalTableOrder
