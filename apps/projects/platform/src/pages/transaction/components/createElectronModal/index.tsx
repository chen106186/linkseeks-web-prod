import React, { useContext } from 'react'
import { Button, message } from 'antd'
import type { ISchema } from '@apps/formily'
import { createFormActions } from '@apps/formily'
import ModalForm from '@/components/ModalForm'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { OrderDetailContext } from '../../_public/order/context'
import {
  // getContractSelectListContractTemplate,
  postContractContractSignSaleSignContractCreate,
} from '@apps/apis'
import { postOrderVendorValidateSubmit } from '@apps/apis'

export interface OrderElectronModalProps {
  currentRef: any
}
const intl = getIntl()
const schemaActions = createFormActions()

const schema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
        labelCol: 6,
      },
      properties: {
        // usingElectronicContracts: {
        //   type: 'radio',
        //   title: intl.formatMessage({ id: 'transaction_components.shifoushiyongdianzihetong' }),
        //   enum: [
        //     { label: intl.formatMessage({ id: 'transaction_components.shi' }), value: 1 },
        //     { label: intl.formatMessage({ id: 'transaction_components.fou' }), value: 0 },
        //   ],
        //   default: 1,
        //   'x-linkages': [
        //     {
        //       type: 'value:visible',
        //       target: 'contractTemplateId',
        //       condition: '{{$value === 1}}',
        //     },
        //     {
        //       type: 'value:visible',
        //       target: 'electronicContractName',
        //       condition: '{{$value === 1}}',
        //     },
        //   ],
        // },
        // contractTemplateId: {
        //   type: 'string',
        //   enum: [],
        //   title: intl.formatMessage({ id: 'transaction_components.dianzihetongmuban' }),
        //   required: true,
        //   'x-component-props': {
        //     placeholder: intl.formatMessage({
        //       id: 'transaction_components.qingxuanzedianzihetongmu',
        //     }),
        //     style: {
        //       minWidth: 140,
        //     },
        //   },
        //   'x-props': {
        //     addonAfter: '{{electronBtn}}',
        //   },
        // },
        // electronicContractName: {
        //   type: 'string',
        //   'x-component': 'children',
        //   'x-component-props': {
        //     children: '',
        //   },
        //   title: intl.formatMessage({ id: 'transaction_components.dianzihetong' }),
        //   'x-rules': [
        //     {
        //       message: intl.formatMessage({ id: 'transaction_components.qingxuanzedianzihetong' }),
        //       required: true,
        //     },
        //   ],
        // },
        // electronicContractUrl: {
        //   type: 'string',
        //   display: false,
        // },
        // signatureLogId: {
        //   type: 'string',
        //   display: false,
        // },
        agree: {
          type: 'radio',
          title: intl.formatMessage({ id: 'transaction_components.shifoushenhetongguo' }),
          enum: [
            { label: intl.formatMessage({ id: 'transaction_components.shenhetongguo' }), value: 1 },
            {
              label: intl.formatMessage({ id: 'transaction_components.shenhebutongguo' }),
              value: 0,
            },
          ],
          default: 1,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'reason',
              condition: '{{$value === 0}}',
            },
          ],
        },
        reason: {
          type: 'textarea',
          'x-component-props': {
            rows: 4,
            placeholder: intl.formatMessage({ id: 'transaction_components.zaicishurunideyuanyin' }),
          },
          title: intl.formatMessage({ id: 'transaction_components.shenhebutongguoyuanyin' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'transaction_components.qingshurushenhebutongguo',
              }),
            },
            {
              limitByte: true,
              maxByte: 30,
            },
          ],
        },
      },
    },
  },
}

const CreateOrderElectronModal: React.FC<OrderElectronModalProps> = (props) => {
  const {
    formContext: { data },
  } = useContext(OrderDetailContext)
  const { run, loading } = useHttpRequest(postContractContractSignSaleSignContractCreate, {
    ctlType: 'none',
  })
  const { run: submitRun, loading: submitLoading } = useHttpRequest(postOrderVendorValidateSubmit)
  const createElectron = async () => {
    const contractTemplateId = schemaActions.getFieldValue('contractTemplateId')
    if (data.isElectronicContract === 1 && !contractTemplateId) {
      message.error(intl.formatMessage({ id: 'transaction_components.qingxianxuanzedianzihetong' }))
      return
    }
    const orderId = data.orderId
    const memberId = data.createMemberId

    const params = {
      contractTemplateId,
      orderId,
      memberId,
    }

    const { code, data: resData }: any = await run(params)
    if (code === 1000) {
      schemaActions.setFieldValue('electronicContractName', resData.contractName)
      schemaActions.setFieldValue('signatureLogId', resData.signatureLogId) //** */
      schemaActions.setFieldValue('electronicContractUrl', resData.contractUrl)
      schemaActions.setFieldState('electronicContractName', (state) => {
        state.props['x-component-props'].children = (
          <a href={resData.contractUrl} download={resData.contractName} target="_blank" rel="noreferrer">
            {resData.contractName}
          </a>
        )
      })
    }
  }
  const electronBtn = (
    <Button style={{ marginLeft: 24 }} onClick={createElectron} loading={loading}>
      {intl.formatMessage({ id: 'transaction_components.shengchengdianzihetong' })}
    </Button>
  )

  const handleSubmit = async (value) => {
    const params = {
      ...value,
      orderId: data.orderId,
    }
    const { code } = await submitRun(params)
    if (code === 1000) {
      history.goBack()
    }
  }

  const handleConfirm = () => {
    schemaActions.submit()
  }

  return (
    <ModalForm
      modalTitle={intl.formatMessage({ id: 'transaction_components.querentijiaoshenhe' })}
      previewPlaceholder=" "
      currentRef={props.currentRef}
      schema={schema}
      actions={schemaActions}
      onSubmit={handleSubmit}
      confirm={handleConfirm}
      modalProps={{
        confirmLoading: submitLoading,
      }}
      expressionScope={{
        electronBtn,
      }}
      effects={($, actions) => {
        $('onFormInit').subscribe(async () => {
          // if (data.isElectronicContract === 1) {
          //   const res = await getContractSelectListContractTemplate()
          //   const options = res.data.map((item) => ({
          //     label: item.name,
          //     value: item.id,
          //   }))
          //   actions.setFieldState('contractTemplateId', (state) => {
          //     state.props.enum = options
          //   })
          //   if (
          //     options?.length &&
          //     options.filter((_i) => _i.value === data.contractTemplateId).length
          //   ) {
          //     actions.setFieldValue('contractTemplateId', data.contractTemplateId)
          //   }
          // } else {
          //   actions.setFieldState('usingElectronicContracts', (state) => {
          //     state.value = 0
          //     state.props['x-component-props'] = {
          //       disabled: true,
          //     }
          //   })
          //   actions.setFieldValue('usingElectronicContracts', data.usingElectronicContracts || 0)
          // }
          // 采购合同下单 隐藏使用电子合同
          if (data?.orderModel > 30) {
            actions.setFieldState('usingElectronicContracts', (state) => {
              state.visible = false
            })
          }
        })
      }}
    />
  )
}

CreateOrderElectronModal.defaultProps = {}

export default CreateOrderElectronModal
