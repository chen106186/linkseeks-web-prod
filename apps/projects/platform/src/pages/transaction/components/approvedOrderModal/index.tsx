import React, { useContext, useEffect, useState } from 'react'
import ModalForm from '@/components/ModalForm'
import { createFormActions, registerVirtualBox } from '@apps/formily'
import { OrderDetailContext } from '../../_public/order/context'
import { Checkbox } from 'antd'
import { getIntl } from '@linkseeks/i18n'

export interface ApprovedOrderModalProps {
  currentRef: any
  onConfirm: () => any
  loading?: boolean
  title?: string
  isUseElectronicContract?: boolean
}
const intl = getIntl()

// 虚线边框
registerVirtualBox('CustomDashLayout', ({ children }) => {
  return (
    <>
      <p style={{ fontSize: 12, color: '#c0c4cc' }}>
        {intl.formatMessage({ id: 'transaction_components.zhugouxuanzebiaoshitong' })}
      </p>
      <div style={{ borderTop: '1px dashed #DFE1E6', marginTop: 24, height: 24 }}>{children}</div>
    </>
  )
})

// 采用电子合同字段的Schema
const ApproveSchemaUseContract = {
  type: 'object',
  properties: {
    NO_SUBMIT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        // 合同相关
        isElectronicContract: {
          type: 'boolean',
          'x-component': 'children',
          'x-component-props': {
            children: '',
          },
          title: intl.formatMessage({ id: 'transaction_components.dianzihetong' }),
          'x-rules': [
            {
              message: intl.formatMessage({ id: 'transaction_components.qingxuanzedianzihetong' }),
              required: true,
            },
          ],
        },
        electronicContractName: {
          type: 'string',
          display: false,
        },
        electronicContractUrl: {
          type: 'string',
          display: false,
        },
        signatureLogId: {
          type: 'string',
          display: false,
        },
        //--
        NOFIELD: {
          type: 'object',
          title: '',
          'x-component': 'CustomDashLayout',
          'x-component-props': {},
        },
        state: {
          type: 'radio',
          enum: [
            { label: intl.formatMessage({ id: 'transaction_components.shenhetongguo' }), value: 1 },
            {
              label: intl.formatMessage({ id: 'transaction_components.shenhebutongguo' }),
              value: 0,
            },
          ],
          default: 1,
          'x-component-props': {
            disabled: false,
          },
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'cause',
              condition: '{{$value === 0}}',
            },
            {
              type: 'value:visible',
              target: 'isElectronicContract',
              condition: '{{$value === 1}}',
            },
            {
              type: 'value:visible',
              target: 'NOFIELD',
              condition: '{{$value === 1}}',
            },
          ],
        },
        cause: {
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

// 不采用电子合同字段的Schema
const ApproveSchema = {
  type: 'object',
  properties: {
    NO_SUBMIT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        agree: {
          type: 'radio',
          enum: [
            { label: intl.formatMessage({ id: 'transaction_components.shenhetongguo' }), value: 1 },
            {
              label: intl.formatMessage({ id: 'transaction_components.shenhebutongguo' }),
              value: 0,
            },
          ],
          default: 1,
          'x-component-props': {
            disabled: false,
          },
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'reason',
              condition: '{{$value === 0}}',
            },
            {
              type: 'value:visible',
              target: 'isElectronicContract',
              condition: '{{$value === 1}}',
            },
            {
              type: 'value:visible',
              target: 'NOFIELD',
              condition: '{{$value === 1}}',
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
              maxByte: 120,
            },
          ],
        },
      },
    },
  },
}

const approvedActions = createFormActions()
// 需要弹窗确认的审核订单
const ApprovedOrderModal: React.FC<ApprovedOrderModalProps> = (props) => {
  const { currentRef, onConfirm, title, loading, isUseElectronicContract = false } = props
  const { data } = useContext(OrderDetailContext)?.formContext || useContext(OrderDetailContext)

  const [, setCheckedContract] = useState<boolean>(false)

  useEffect(() => {
    if (currentRef) {
      currentRef.current = Object.assign({}, currentRef.current, { actions: approvedActions })
    }
  }, [currentRef])

  const onChange = (e) => {
    setCheckedContract(e.target.checked)
    if (e.target.checked) {
      approvedActions.setFieldValue('isElectronicContract', true)
    } else {
      approvedActions.setFieldValue('isElectronicContract', null)
    }
  }

  return (
    <ModalForm
      modalTitle={title || intl.formatMessage({ id: 'transaction_components.tishi' })}
      currentRef={currentRef}
      confirm={onConfirm}
      actions={approvedActions}
      schema={isUseElectronicContract ? ApproveSchemaUseContract : ApproveSchema}
      effects={($, ctx) => {
        $('onFormInit').subscribe(() => {
          ctx.setFieldState('isElectronicContract', (innerState) => {
            innerState.props['x-component-props'] = {
              children: (
                <>
                  <Checkbox onChange={onChange} />
                  &nbsp;&nbsp;
                  <a href={data.electronicContractUrl} target="blank">
                    {data.electronicContractName}
                  </a>
                </>
              ),
            }
          })
          // 上级审核不通过
          if (
            data &&
            (data.innerStatusName === intl.formatMessage({ id: 'transaction_components.tijiaoshenhebutongguo' }) ||
              data.innerStatusName === intl.formatMessage({ id: 'transaction_components.shenhebutongguoyiji' }) ||
              data.innerStatusName === intl.formatMessage({ id: 'transaction_components.shenhebutongguoerji' }))
          ) {
            ctx.setFieldValue('agree', 0)
            ctx.setFieldState('agree', (state) => {
              state.props['x-component-props'] = {
                disabled: true,
              }
            })
          }
        })
      }}
      modalProps={{ confirmLoading: loading }}
    />
  )
}

ApprovedOrderModal.defaultProps = {}

export default ApprovedOrderModal
