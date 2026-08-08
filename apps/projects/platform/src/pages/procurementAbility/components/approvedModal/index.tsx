import React, { useContext, useEffect, useState } from 'react'
import ModalForm from '@/components/ModalForm'
import { createFormActions, registerVirtualBox, FormEffectHooks } from '@apps/formily'
import { Checkbox } from 'antd'
import { BidDetailContext } from '../../_public/bid/context'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export interface ApprovedModalProps {
  currentRef: any
  onConfirm()
  loading?: boolean
  title?: string
}

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
        checkStatus: {
          type: 'radio',
          enum: [
            { label: intl.formatMessage({ id: 'detail.purchase.message86' }), value: true },
            { label: intl.formatMessage({ id: 'detail.purchase.message87' }), value: false },
          ],
          default: true,
          'x-component-props': {
            disabled: false,
          },
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'checkRemark',
              condition: '{{!$value}}',
            },
          ],
        },
        checkRemark: {
          type: 'textarea',
          'x-component-props': {
            rows: 4,
            placeholder: intl.formatMessage({ id: 'table.purchase.zaicishuruni60' }),
          },
          title: intl.formatMessage({ id: 'detail.purchase.message84' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'table.purchase.qingshurushenhe' }),
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

const approvedActions = createFormActions()
// 需要弹窗确认的审核
const ApprovedModal: React.FC<ApprovedModalProps> = (props) => {
  const { currentRef, onConfirm, title, children, loading } = props
  const { data } = useContext(BidDetailContext)

  useEffect(() => {
    if (currentRef) {
      currentRef.current = Object.assign({}, currentRef.current, { actions: approvedActions })
    }
  }, [currentRef])

  return (
    <ModalForm
      modalTitle={title || intl.formatMessage({ id: 'table.purchase.tishi' })}
      currentRef={currentRef}
      confirm={onConfirm}
      actions={approvedActions}
      schema={ApproveSchema}
      effects={($, ctx) => {
        $('onFormInit').subscribe(() => {
          // // 上级审核不通过
          // if(data && (data.purchaseOrderInteriorState === 6 || data.purchaseOrderInteriorState === 7 || data.purchaseOrderInteriorState === 8)) {
          //   ctx.setFieldValue("state", 0)
          //   ctx.setFieldState("state", state => {
          //     state.props["x-component-props"] = {
          //       disabled: true
          //     }
          //   })
          // }
        })
      }}
      modalProps={{ confirmLoading: loading }}
    />
  )
}

ApprovedModal.defaultProps = {}

export default ApprovedModal
