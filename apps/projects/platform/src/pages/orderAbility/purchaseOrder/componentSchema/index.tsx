import MellowCard from '@/components/MellowCard'
import NiceForm from '@/components/NiceForm'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import {
  getContractContractTemplatePage,
  getContractSelectCurrencyList,
  postContractContractSignProcurementSignContractCreate,
  postContractContractSignSaleSignContractCreate,
} from '@apps/apis'
import { getOrderBuyerPaymentTypeAll, postOrderVendorValidateUpdatePromisedDeliveryDate } from '@apps/apis'
import type { ISchema } from '@apps/formily'
import { Button, DatePicker, message } from 'antd'
import type { Moment } from 'moment'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import './index.less'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
export const schemasFn = (addSchemaAction, intl, other?) => {
  const { buyerMemberId, buyerRoleId, orderId } = other || {}
  // 获取合同模板
  const fetchTemplateSelectOptions = async () => {
    const { data } = await getContractContractTemplatePage({
      current: '1',
      pageSize: '999',
      name: '',
    })
    return data.data?.filter((v) => v.state)
  }
  const [signLoading, setSignLoading] = useState(false)
  const handleCreateContract = async () => {
    const contractTemplateId = addSchemaAction.getFieldValue('contractText.templateId')
    const memberId = buyerMemberId || addSchemaAction.getFieldValue('vendorMemberId')
    const roleId = buyerRoleId || addSchemaAction.getFieldValue('vendorRoleId')
    const orderMode = addSchemaAction.getFieldValue('orderMode')
    if (!memberId || !roleId) {
      return message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.materialOrder.error' }))
    }
    setSignLoading(true)
    let fn: any = postContractContractSignProcurementSignContractCreate
    if (orderId) {
      fn = postContractContractSignSaleSignContractCreate
    }
    const {
      code,
      data,
      message: msg,
    } = await fn(
      {
        contractTemplateId,
        memberId,
        roleId,
        orderMode,
        orderId,
      },
      { ctlType: 'none' },
    )
    if (code === 1000) {
      addSchemaAction.setFieldValue('contractText.contractFile', [
        {
          uid: data.contractUrl,
          name: data.contractName,
          url: data.contractUrl,
        },
      ])
    } else {
      message.error(msg)
    }
    setSignLoading(false)
  }

  const templateDescription = (
    <p>
      {translate('web.resource.order.gouxuanjibiaoshi_tip')}
      {/* 1、使用合同模板生成电子合同，即可根据合同模板生成电子合同并可对电子合同进行下载编辑，重新上传操作。
      <br />
      2、不使用合同模板生成电子合同，即可直接上传电子合同附件。 */}
    </p>
  )
  const createContract = (
    <div style={{ marginLeft: 16 }}>
      <Button type="link" onClick={handleCreateContract} loading={signLoading}>
        {translate('web.resource.order.shenchengdianzihetong')}
      </Button>
    </div>
  )
  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 20) {
      message.warning(intl.formatMessage({ id: 'detail.purchase.message9' }))
      return Promise.reject()
    }
  }

  const showBtn = ($) => {
    return $('onFieldValueChange', 'contractText.templateId').subscribe((state) => {
      if (state.value) {
        state.props['x-props'].addonAfter = createContract
      } else {
        state.props['x-props'].addonAfter = undefined
      }
    })
  }
  const getList = () => {
    return useAsyncSelect('contractText.templateId', fetchTemplateSelectOptions, ['name', 'id'])
  }

  const sub = (params) => {
    // 校验电子合同
    const contract_ = params.contractText.contractFile_
    const contract = params.contractText.contractFile || contract_
    // if (params.contractText.isUseElectronicContract && !contract?.length) {
    //   message.error(intl.formatMessage({ id: 'purchaseOrder.orderCollect.error10' }))
    //   return
    // }
    // 电子合同转换
    // if (params.contractText.isUseElectronicContract) {
    if (contract_) {
      params.contractText.contractFile = contract_
    }
    if (contract?.length) {
      params.contractText.contractName = contract[0].name || contract[0].response.data.fileName
      params.contractText.contractUrl = contract[0].url || contract[0].response.data.url
      params.contractText.id = params.contractText.id || 0
    }
    // }
    params.contractText.isUseElectronicContract = params.contractText.isUseElectronicContract ? 1 : 0
  }
  return {
    templateDescription,
    beforeUpload,
    showBtn,
    getList,
    sub,
  }
}
/* 电子合同回显 */
export const contractTextVal = (initValue) => {
  const contractFile = initValue.contractText.contractUrl
    ? [
        {
          uid: initValue.contractText.contractUrl,
          url: initValue.contractText.contractUrl,
          name: initValue.contractText.contractName,
        },
      ]
    : []
  const vals: any = {
    isUseElectronicContract: !!initValue.contractText.isUseElectronicContract,
    templateId: initValue.contractText.templateId,
    id: initValue.contractText.id,
  }
  if (initValue.contractText.templateId) {
    vals.contractFile = contractFile
    vals.ht_sel = false
  } else {
    vals.contractFile_ = contractFile
  }
  return vals
}
export const schemas = (Index?: number) => {
  // 电子合同
  const contractText = {
    type: 'object',
    properties: {
      NO_SUBMIT_LAYOUT_ORTHER: {
        type: 'object',
        'x-component': 'mega-layout',
        'x-component-props': {
          labelCol: 3,
          wrapperCol: 9,
          labelAlign: 'left',
          grid: true,
          full: true,
          autoRow: true,
          columns: 1,
        },
        properties: {
          isUseElectronicContract: {
            type: 'boolean',
            title: translate('web.resource.contract.zaixiandianzihetong'),
            description: '{{templateDescription}}',
            'x-component': 'CheckboxSingle',
            'x-component-props': {
              children: translate('web.resource.contract.shiyongzaixiandianzihetong'),
            },
            default: false,
            'x-linkages': [
              {
                type: 'value:visible',
                target: 'contractText.FLEX_LAYOUT_RIGHT',
                condition: '{{$value}}',
              },
              {
                type: 'value:visible',
                target: 'contractText.contractFile_',
                condition: '{{!$value}}',
              },
            ],
          },
          FLEX_LAYOUT_RIGHT: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              labelCol: 3,
              wrapperCol: 9,
              className: 'contractTemplateClass',
            },
            properties: {
              // ht_sel: {
              //   type: 'string',
              //   title: '合同选择',
              //   'x-component': 'Radio',
              //   enum: [
              //     {
              //       label: '直接上传电子合同',
              //       value: true,
              //     },
              //     {
              //       label: '通过模板生成合同',
              //       value: false,
              //     },
              //   ],
              //   default: true,
              //   'x-linkages': [
              //     {
              //       type: 'value:visible',
              //       target: 'contractText.templateId',
              //       condition: '{{!$value}}',
              //     },
              //     {
              //       type: 'value:visible',
              //       target: 'contractText.contractFile',
              //       condition: '{{!$value}}',
              //     },
              //     {
              //       type: 'value:visible',
              //       target: 'contractText.contractFile_',
              //       condition: '{{$value}}',
              //     },
              //   ],
              // },
              templateId: {
                type: 'number',
                title: translate('web.resource.contract.hetongmuban'),
                enum: [],
                'x-component-props': {
                  placeholder: translate.formatFormSelectTip(translate('web.resource.contract.hetongmuban')),
                },
              },
              contractFile: {
                title: translate('web.resource.contract.hetongwenben'),
                'x-component': 'FixUpload',
                required: true,
                'x-component-props': {
                  action: '/api/contract/signature/contractUpload',
                  data: {
                    fileType: 1,
                    prefix: '',
                  },
                  maxCount: 1,
                  beforeUpload: '{{beforeUpload}}',
                  accept: '.xls, .xlsx, .doc, .docx, .pdf',
                  readOnly: true,
                },
                'x-rules': [
                  {
                    required: false,
                    message: translate('web.resource.contract.dianzihetong_tip'),
                  },
                ],
                description: translate('web.resource.contract.dianzihetong_desc'),
              },
            },
          },
          contractFile_: {
            title: translate('web.resource.contract.hetongwenben'),
            'x-component': 'FixUpload',
            // required: true,
            'x-component-props': {
              action: '/api/contract/signature/contractUpload',
              data: {
                fileType: 1,
                prefix: '',
              },
              maxCount: 1,
              beforeUpload: '{{beforeUpload}}',
              accept: '.xls, .xlsx, .doc, .docx, .pdf',
            },
            // 'x-rules': [
            //   {
            //     required: false,
            //     message: '请生成或上传电子合同',
            //   },
            // ],
            description: translate('web.resource.contract.dianzihetong_desc'),
          },
        },
      },
    },
  }
  const electronicInfo: ISchema = {
    'x-index': Index,
    type: 'object',
    'x-component': 'MellowCard',
    'x-component-props': {
      title: getIntl().formatMessage({ id: 'contract.hetongwenben' }),
      id: 'electronicInfo',
    },
    properties: {
      contractText,
    },
  }
  return {
    contractText,
    electronicInfo,
  }
}
// 付款信息
export const getPaymentInfoFn = () => {
  // 获取币别类型
  const fetchCurrencyType = async () => {
    const { data } = await getContractSelectCurrencyList()
    return data
  }

  // 获取付款方式
  const fetchPaymentType = async () => {
    const { data } = await getOrderBuyerPaymentTypeAll()
    return data
  }
  const getListPay = () => {
    useAsyncSelect('currencyType', fetchCurrencyType, ['text', 'id'])
    useAsyncSelect('paymentType', fetchPaymentType, ['text', 'id'])
  }
  return {
    getListPay,
  }
}
export const getPaymentInfo: (Index: number) => ISchema = (Index: number) => ({
  'x-index': Index,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.schema.paymentInfo' }),
    id: 'paymentInfo',
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 18,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 2,
      },
      properties: {
        currencyType: {
          type: 'string',
          enum: [],
          title: translate('web.resource.member.bibie'),
          'x-component-props': {
            getPopupContainer: '{{getPopupPaymentContainer}}',
            dropdownStyle: {
              zIndex: 998,
            },
          },
        },
        paymentType: {
          type: 'string',
          enum: [],
          title: translate('web.resource.member.fukuanfangshi'),
          'x-component-props': {
            getPopupContainer: '{{getPopupPaymentContainer}}',
            dropdownStyle: {
              zIndex: 998,
            },
          },
        },
      },
    },
  },
})

/* 承诺交期 */
export const PromiseTime = ({ orderId, record, times = '' }) => {
  const [timeVal, setTimeVal] = useState<Moment>()
  const handelChange = (val, valStr) => {
    const params = {
      updateList: [
        {
          orderProductId: record.orderProductId,
          promisedDeliveryDate: valStr,
        },
      ],
      orderId,
    }
    postOrderVendorValidateUpdatePromisedDeliveryDate(params, { ctlType: 'none' }).then((res) => {
      if (res.code === 1000) {
        setTimeVal(val)
      } else {
        message.error(res.message)
      }
    })
  }
  useEffect(() => {
    if (times) {
      setTimeVal(moment(times))
    }
  }, [times])
  useEffect(() => {
    if (record.promisedDeliveryDate) {
      setTimeVal(moment(record.promisedDeliveryDate))
    }
  }, [record?.promisedDeliveryDate])
  return (
    <DatePicker
      style={{ width: '100%' }}
      format="YYYY-MM-DD"
      onChange={handelChange}
      disabledDate={(val) => val < moment().endOf('day')}
      mode={'date'}
      value={timeVal}
    />
  )
}

export const Ht = (props) => {
  const { buyerMemberId, buyerRoleId, orderId, addSchemaAction_ } = props.data || {}
  const intl = useIntl()
  const { contractText } = schemas()
  const { templateDescription, beforeUpload, showBtn, getList, sub } = schemasFn(addSchemaAction_, intl, {
    buyerMemberId,
    buyerRoleId,
    orderId,
  })
  const handleSubmit = (values) => {
    return new Promise((resolve) => {
      sub(values)
      values.contractText.id = values.contractText.id || 0
      values.contractText.templateId = values.contractText.templateId || 0
      setTimeout(() => {
        resolve(values)
      }, 100)
    })
  }
  return (
    <MellowCard id="contractInfo" title={translate('web.resource.contract.hetongwenben')} fullHeight>
      <NiceForm
        previewPlaceholder=" "
        // value={initFormValue}
        actions={addSchemaAction_}
        schema={{
          type: 'object',
          properties: {
            contractText,
          },
        }}
        onSubmit={handleSubmit}
        effects={($, ctx) => {
          $('onFormMount').subscribe(() => {
            ctx.setFieldValue('type', intl.formatMessage({ id: 'purchaseOrder.orderCollect.requisition.type' }))
            showBtn($)
          })
          getList()
        }}
        expressionScope={{
          templateDescription,
          beforeUpload,
        }}
      />
    </MellowCard>
  )
}
