import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { Button, message } from 'antd'
import { createFormActions } from '@apps/formily'
import { SaveOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import { increaseSchema } from './schema'
import { useMaterialTableChangeForAmount } from './effects'
import { procurementProcessField, procurementRenderField, procurmentRenderInit } from './constant'
import { useUpdate } from '@linkseeks/hooks'
import { help } from '@/pages/transaction/common'
import { useProductTable } from './model/useProductTable'
import FormDetailHeader from '@/components/FormDetailHeader'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import { FormDetailContext } from '@/formSchema/context'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import { postPurchaseRequisitionCreate, postPurchaseRequisitionUpdate } from '@apps/apis'
import { getOrderBuyerReceiveDetail } from '@apps/apis'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
const addSchemaAction = createFormActions()

/** 新增采购收货单 */
const AddPurchaseReceiveOrder: React.FC<{}> = () => {
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const update = useUpdate()
  const { id, preview = null } = usePageStatus()
  const [initFormValue, setInitFormValue] = useState<any>({})
  const { formContext } = useFormDetail()
  const intl = useIntl()

  // 单据商品
  const { productColumns, productComponents } = useProductTable(addSchemaAction)

  useEffect(() => {
    if (id) {
      setFormLoading(true)
      getOrderBuyerReceiveDetail({ orderId: id }).then((res) => {
        const { data, code } = res
        if (code === 1000) {
          const _orderProductRequests = procurementRenderField(data)
          setInitFormValue(() => procurmentRenderInit(data))
          setTimeout(() => {
            addSchemaAction.setFieldValue('detailList', _orderProductRequests)
          }, 1000)
        }
        setFormLoading(false)
      })
    }
  }, [])

  const handleSubmit = async (value) => {
    try {
      let fnResult = null
      // 新增单据/编辑单据
      const params = { ...value }
      console.log(value)
      if (formContext.innerFormErrors) {
        throw new Error(
          intl.formatMessage({ id: 'purchaseOrder.qingwanshancaigou', defaultMessage: '请完善采购收货单明细数据' }),
        )
      }
      setBtnLoading(true)

      const _params = procurementProcessField(params)
      console.log(_params)
      if (id) {
        fnResult = await postPurchaseRequisitionUpdate({ ..._params, id })
      } else {
        fnResult = await postPurchaseRequisitionCreate(_params)
      }
      if (fnResult.code === 1000) {
        setTimeout(() => {
          history.push('/procurementAbility/purchaseRequisition/readyAddBill')
        }, 1000)
      } else {
        setBtnLoading(false)
      }
    } catch (error) {
      setBtnLoading(false)
      error?.message && message.error(error.message)
      console.log(error)
    }
  }

  const providerValue = {
    schemaActions: addSchemaAction,
    formContext,
  }

  const renderTitle = () => {
    if (preview) {
      return intl.formatMessage({ id: 'purchaseOrder.chakancaigoushou', defaultMessage: '查看采购收货单' })
    }
    return intl.formatMessage({ id: 'purchaseOrder.xinzengcaigoushou', defaultMessage: '新增采购收货单' })
  }

  return (
    <div>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={renderTitle()}
          schema={increaseSchema}
          extraRight={[
            // <AuthButton type="custom" code="save">
            <Button
              key="1"
              onClick={() => addSchemaAction.submit()}
              loading={btnLoading}
              type="primary"
              icon={<SaveOutlined />}
            >
              {intl.formatMessage({ id: 'purchaseOrder.baocun', defaultMessage: '保存' })}
            </Button>,
            // </AuthButton>,
          ]}
        />
        <FormDetailWrapper>
          <NiceForm
            loading={formLoading}
            previewPlaceholder=" "
            value={initFormValue}
            actions={addSchemaAction}
            schema={increaseSchema}
            onSubmit={handleSubmit}
            effects={($, ctx) => {
              $('onFormMount').subscribe(() => {})
              // 物料信息的改动 渲染总额
              useMaterialTableChangeForAmount(ctx, update)

              // 注入表单完成进度
              formContext.useAttachmentChangeForContext(ctx)
            }}
            expressionScope={{
              productColumns,
              productComponents,
              help,
            }}
          />
        </FormDetailWrapper>
      </FormDetailContext.Provider>
    </div>
  )
}

AddPurchaseReceiveOrder.defaultProps = {}

export default AddPurchaseReceiveOrder
