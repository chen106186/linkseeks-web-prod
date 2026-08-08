import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { Button, message } from 'antd'
import { createFormActions } from '@apps/formily'
import { SaveOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import { increaseSchema } from './schema'
import { procurementProcessField, procurementRenderField, procurmentRenderInit } from './constant'
import { help } from '@/pages/transaction/common'
import { useProductTable } from './model/useProductTable'
import FormDetailHeader from '@/components/FormDetailHeader'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import { FormDetailContext } from '@/formSchema/context'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import { getOrderVendorSellDeliveryDetail, postOrderVendorCreateSellDelivery } from '@apps/apis'
import addressText from '@/pages/orderAbility/components/addressText'

const addSchemaAction = createFormActions()

/** 新增/查看销售发货单 */
const AddSaleDelevedOrder: React.FC<{}> = () => {
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const { id, preview = null } = usePageStatus()
  const [initFormValue, setInitFormValue] = useState<any>({})
  const { formContext } = useFormDetail()
  const intl = useIntl()

  // 单据商品明细
  const { productColumns, productComponents } = useProductTable(addSchemaAction)

  useEffect(() => {
    if (id) {
      setFormLoading(true)
      getOrderVendorSellDeliveryDetail({ orderId: id }).then((res) => {
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
      // 新增发货单
      const params = { ...value }
      if (formContext.innerFormErrors) {
        throw new Error(
          intl.formatMessage({ id: 'saleOrder.qingwanshanfahuodan', defaultMessage: '请完善发货单明细数据' }),
        )
      }
      // 校验是否填写发货数量
      if (!params.detailList.every((item) => item?.deliveryQuantity)) {
        throw new Error(
          intl.formatMessage({ id: 'saleOrder.qingtianxiefahuoshuliang', defaultMessage: '请填写发货数量' }),
        )
      }
      setBtnLoading(true)

      const _params = procurementProcessField(params)
      const fnResult = await postOrderVendorCreateSellDelivery({ ..._params, id })
      if (fnResult.code === 1000) {
        setTimeout(() => {
          history.push('/orderAbility/saleOrder/readyAddDelevedOrder')
        }, 1000)
      } else {
        setBtnLoading(false)
      }
    } catch (error) {
      setBtnLoading(false)
      error?.message && message.error(error.message)
    }
  }

  const providerValue = {
    schemaActions: addSchemaAction,
    formContext,
  }

  const renderTitle = () => {
    // intl.formatMessage({ id: 'saleOrder.bianjixiaoshoufahuodan', defaultMessage: '编辑销售发货单' })
    if (preview) {
      intl.formatMessage({ id: 'saleOrder.chakanxiaoshoufahuodan', defaultMessage: '查看销售发货单' })
    }
    return intl.formatMessage({ id: 'saleOrder.xinzengxiaoshoufahuodan', defaultMessage: '新增销售发货单' })
  }

  return (
    <div>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={renderTitle()}
          schema={increaseSchema}
          extraRight={[
            <Button
              key="1"
              onClick={() => addSchemaAction.submit()}
              loading={btnLoading}
              type="primary"
              icon={<SaveOutlined />}
            >
              {intl.formatMessage({ id: 'saleOrder.baocun', defaultMessage: '保存' })}
            </Button>,
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

              // 注入表单完成进度
              formContext.useAttachmentChangeForContext(ctx)
            }}
            components={{
              addressText,
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

AddSaleDelevedOrder.defaultProps = {}

export default AddSaleDelevedOrder
