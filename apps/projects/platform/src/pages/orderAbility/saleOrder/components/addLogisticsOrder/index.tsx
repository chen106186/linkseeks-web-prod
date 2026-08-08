import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { Button, Col, message, Row } from 'antd'
import { createFormActions, registerVirtualBox, useFormSpy } from '@apps/formily'
import { SaveOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import { increaseSchema } from './schema'
import { useDetailTableChangeForAmount } from './effects'
import { procurementProcessField, procurmentRenderInit } from './constant'
import { useUpdate } from '@linkseeks/hooks'
import { help } from '@/pages/transaction/common'
import styled from 'styled-components'
import FormDetailHeader from '@/components/FormDetailHeader'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import { FormDetailContext } from '@/formSchema/context'
import { useProductTable } from './model/useProductTable'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import ProductModalTable from './components/productModalTable'
import { getOrderVendorCreateLogisticsDetail } from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getLogisticsCompanyPage, getLogisticsShipperAddressPage, postLogisticsOrderWaitSubmitAdd } from '@apps/apis'
import addressText from '@/pages/orderAbility/components/addressText'
import { authService } from '@apps/services'
import { getSettlementPlatformConfigGetSettlementWay } from '@apps/apis'

const addSchemaAction = createFormActions()

const RowStyle = styled((props) => (
  <Row style={{ marginTop: 12, justifyContent: 'flex-end' }} justify="end" {...props}>
    {props.children}
  </Row>
))`
  .ant-col {
    text-align: center;
  }
  .ant-col div {
    margin-bottom: 12px;
  }
`

// 总计金额联动框
export const MoneyTotalBox = registerVirtualBox('moneyTotalBox', () => {
  const intl = useIntl()
  const { form } = useFormSpy({ selector: [['onFieldValueChange', 'detailList']], reducer: (v) => v })
  const data = form.getFieldValue('detailList')

  const totalCarton = data.reduce((prev, next) => (prev * 1000 + (next.carton || 0) * 1000) / 1000, 0)
  const totalWeight = data.reduce((prev, next) => (prev * 1000 + (next.weight || 0) * 1000) / 1000, 0)
  const totalVolume = data.reduce((prev, next) => (prev * 1000 + (next.volume || 0) * 1000) / 1000, 0)

  return (
    <RowStyle>
      <Col span={2}>
        <div>{intl.formatMessage({ id: 'saleOrder.zongxiangshu', defaultMessage: '总箱数' })}</div>
        <div style={{ fontSize: 24, color: '#1F2C3D' }}>{totalCarton.toFixed(1)}</div>
      </Col>
      <Col span={2}>
        <div>{intl.formatMessage({ id: 'saleOrder.zongzhongliang', defaultMessage: '总重量' })}(KG)</div>
        <div style={{ fontSize: 24, color: '#1F2C3D' }}>{totalWeight.toFixed(3)}</div>
      </Col>
      <Col span={2}>
        <div>{intl.formatMessage({ id: 'saleOrder.zongtiji', defaultMessage: '总体积' })}(m³)</div>
        <div style={{ fontSize: 24, color: '#1F2C3D' }}>{totalVolume.toFixed(3)}</div>
      </Col>
    </RowStyle>
  )
})

/** 新增/查看物流单 */
const AddLogisticsOrder: React.FC<{}> = () => {
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const update = useUpdate()
  const { id, preview = null } = usePageStatus()
  const [initFormValue, setInitFormValue] = useState<any>({})
  const { formContext } = useFormDetail()
  const intl = useIntl()
  const { memberRoleId, memberId } = authService.getAuth() || {}

  useEffect(() => {
    if (id) {
      setFormLoading(true)
      getOrderVendorCreateLogisticsDetail({ orderId: id }).then((res) => {
        const { data } = res
        setInitFormValue(() => procurmentRenderInit(data))
        setFormLoading(false)
      })
      getSettlementPlatformConfigGetSettlementWay({ memberId: memberId + '', roleId: memberRoleId + '' }).then(
        (res) => {
          const { code, data } = res
          if (code === 1000) {
            addSchemaAction.setFieldValue('settlementWay', data)
          }
        },
      )
    }
  }, [])

  const handleSubmit = async (value) => {
    try {
      // 新增物流单/编辑物流单
      const params = { ...value }
      console.log(value)
      if (formContext.innerFormErrors) {
        throw new Error(
          intl.formatMessage({ id: 'saleOrder.qingwanshanwuliudan', defaultMessage: '请完善物流单明细数据' }),
        )
      }
      setBtnLoading(true)
      const _params = procurementProcessField(params)

      const fnResult = await postLogisticsOrderWaitSubmitAdd(_params)
      if (fnResult.code === 1000) {
        setTimeout(() => {
          history.push('/orderAbility/saleOrder/readyAddLogisticsOrder')
        }, 1000)
      } else {
        setBtnLoading(false)
      }
    } catch (error) {
      setBtnLoading(false)
      error?.message && message.error(error.message)
    }
  }

  // 订单商品
  const { productAddButton, productRef, productColumns, productComponents, ...sectionProps } =
    useProductTable(addSchemaAction)

  const providerValue = {
    schemaActions: addSchemaAction,
    formContext,
  }

  const fetchDeliverAddressSelectOptions = async () => {
    const { data } = await getLogisticsShipperAddressPage({ current: '1', pageSize: '999' })
    return data.data.map((v) => ({ label: v.fullAddress, value: v.id }))
  }

  const fetchLogisticProviderSelectOptions = async () => {
    const { data } = await getLogisticsCompanyPage({ current: '1', pageSize: '999' })
    return data.data.map((v) => ({ label: v.name, value: v.id }))
  }

  const renderTitle = () => {
    return intl.formatMessage({ id: 'saleOrder.xinzengwuliudan', defaultMessage: '新增物流单' })
  }

  return (
    <div>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={renderTitle()}
          schema={increaseSchema}
          extraRight={
            !preview && [
              <Button
                key="1"
                onClick={() => addSchemaAction.submit()}
                loading={btnLoading}
                type="primary"
                icon={<SaveOutlined />}
              >
                {intl.formatMessage({ id: 'saleOrder.baocun', defaultMessage: '保存' })}
              </Button>,
            ]
          }
        />
        <FormDetailWrapper>
          <NiceForm
            loading={formLoading}
            previewPlaceholder=" "
            value={initFormValue}
            actions={addSchemaAction}
            schema={increaseSchema}
            editable={!preview}
            onSubmit={handleSubmit}
            effects={($, ctx) => {
              $('onFormMount').subscribe(() => {})
              // 物流明细信息的改动 渲染总额
              useDetailTableChangeForAmount(ctx, update)

              // 注入表单完成进度
              formContext.useAttachmentChangeForContext(ctx)

              useAsyncSelect('shipperAddressId', fetchDeliverAddressSelectOptions)

              useAsyncSelect('companyId', fetchLogisticProviderSelectOptions)
            }}
            components={{
              addressText,
            }}
            expressionScope={{
              productColumns,
              productComponents,
              productAddButton,
              help,
            }}
          />
        </FormDetailWrapper>
      </FormDetailContext.Provider>

      {/* 选择商品 */}
      <ProductModalTable
        currentRef={productRef}
        schemaAction={addSchemaAction}
        sectionProps={sectionProps}
        forceRender
      />
    </div>
  )
}

AddLogisticsOrder.defaultProps = {}

export default AddLogisticsOrder
