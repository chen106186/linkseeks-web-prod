import React from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Modal } from 'antd'
import { SchemaForm, SchemaMarkupField as Field, createFormActions, FormEffectHooks } from '@apps/formily'
import { Input, Radio } from '@apps/formily'
import { postLogisticsOrderWaitConfirmConfirm } from '@apps/apis'

const intl = getIntl()

interface BillSubmitProps {
  /** 数据 */
  dataSource: any
  /** 显示隐藏 */
  visible: boolean
  /** 关闭 */
  onClose: () => void
}

const actions = createFormActions()
const { onFieldChange$ } = FormEffectHooks
const BillSubmit: React.FC<BillSubmitProps> = (props: any) => {
  const { visible, dataSource, onClose } = props

  const useFormEffects = () => {
    const { setFieldState } = createFormActions()
    onFieldChange$('status').subscribe(({ value }) => {
      setFieldState('remark', (state) => {
        if (value === 4) {
          state.visible = false
        } else {
          state.visible = true
        }
      })
    })
  }

  const handleSubmit = (val: any) => {
    const params = {
      ...val,
      id: dataSource.id,
      freightPrice: dataSource.freightPrice,
      taxInclusive: 1,
      taxRate: dataSource.taxRate,
    }
    postLogisticsOrderWaitConfirmConfirm(params)
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        history.goBack()
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  const onCancel = () => {
    onClose()
    actions.reset()
  }

  return (
    <Modal
      title={intl.formatMessage({ id: 'logistics.danjuqueren' })}
      visible={visible}
      okText={intl.formatMessage({ id: 'logistics.queding' })}
      cancelText={intl.formatMessage({ id: 'logistics.quxiao' })}
      onCancel={onCancel}
      onOk={() => actions.submit()}
      afterClose={() => actions.reset()}
    >
      <SchemaForm
        labelCol={6}
        layout="vertical"
        components={{
          Input,
          Radio: Radio.Group,
          TextArea: Input.TextArea,
        }}
        actions={actions}
        effects={() => useFormEffects()}
        onSubmit={(values) => handleSubmit(values)}
        initialValues={{
          status: 4,
        }}
      >
        <Field
          enum={[
            { label: intl.formatMessage({ id: 'logistics.jieshouwuliudan' }), value: 4 },
            { label: intl.formatMessage({ id: 'logistics.bujieshouwuliudan' }), value: 3 },
          ]}
          name="status"
          required
          x-component="Radio"
        />
        <Field
          title={intl.formatMessage({ id: 'logistics.bujieshouyuanyin' })}
          name="remark"
          x-component="TextArea"
          required
          x-component-props={{
            placeholder: intl.formatMessage({ id: 'logistics.zaicishurunideneirong' }),
          }}
          x-mega-prop={{
            labelAlign: 'left',
          }}
          x-rules={{
            max: 60,
            message: intl.formatMessage({ id: 'logistics.yuanyinzuiduo60gehanzi' }),
          }}
        />
      </SchemaForm>
    </Modal>
  )
}

export default BillSubmit
