import React, { useRef, useState, useEffect } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import { Button, Card, message } from 'antd'
import { createFormActions } from '@apps/formily'
import { SaveOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import style from './index.less'
import { formSchema } from './schema'
import { ArrayTable } from '@apps/formily'
import { useProductTable } from './model/useProductTable'
import RelevanceTenderProduct from './components/relateProductDrawer'
import { processTenderData } from './constant'
import { useUpdate } from '@linkseeks/hooks'
import { getPurchaseSubmitTenderGetSubmitTender, postPurchaseSubmitTenderSaveSubmitTender } from '@apps/apis'
const intl = getIntl()

export interface AddTenderProps {}

// 页面表单全部提交
const addSchemaAction = createFormActions()

// 新增投标 包含新增和编辑
const AddTender: React.FC<AddTenderProps> = (props) => {
  const update = useUpdate()
  const [formLoading, setFormLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [initFormValue, setInitFormValue] = useState<any>({
    submitTenderMateriel: [],
  })
  const [code, setCode] = useState<any>({})

  // 关联报价商品
  const productRef = useRef<any>({})

  const { productColumns, productComponents, productChildren, ...sectionProps } = useProductTable(
    addSchemaAction,
    productRef,
  )

  const { id, preview, pageStatus } = usePageStatus()

  useEffect(() => {
    if (id) {
      getPurchaseSubmitTenderGetSubmitTender({ submitTenderId: id }).then((res) => {
        if (res.code === 1000) {
          const pocessedData = processTenderData(res.data)
          setCode(res.data.inviteTender)
          setInitFormValue(pocessedData)
        }
      })
    }
  }, [id])

  const handleSubmit = async (value) => {
    console.log(value)
    if (value && JSON.stringify(value) !== '{}') {
      setBtnLoading(true)
      let params: any = {
        submitTenderId: id,
        file: value['file'],
        remark: value['remark'],
        submitTenderMateriel: value['submitTenderMateriel'].map((item) => {
          if (!value?.id && item?.file?.lengt) {
            item.file = item.file.map((_) => {
              delete _.id
              return _
            })
          }
          let param = {
            ...item,
          }
          if (item?.inviteTender?.id) {
            param.inviteTenderMateriel = { id: item.inviteTender.id }
          } else {
            param.inviteTenderMateriel = { id: item.id }
          }
          if (!value?.id) delete param.id
          return param
        }),
      }

      // 校验单价
      let judgementByCount =
        params.submitTenderMateriel?.length &&
        params.submitTenderMateriel.map((item) => {
          if (item.price && typeof item.taxRate === 'number') {
            return true
          } else {
            return false
          }
        })
      if (!judgementByCount || judgementByCount.includes(false)) {
        setBtnLoading(false)
        return message.error(intl.formatMessage({ id: 'table.purchase.qingtianxieshangpin' }))
      }
      if (value?.id) params.id = value.id
      const res = await postPurchaseSubmitTenderSaveSubmitTender(params)
      if (res.code === 1000) {
        setTimeout(() => {
          history.goBack()
        }, 800)
      } else {
        setBtnLoading(false)
      }
    }
  }

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 20) {
      message.warning(intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }))
      return Promise.reject()
    }
  }

  const InviterCodeJump = () => (
    <a target="_blank" href={`/procurementAbility/tender/callForBidsSearch/detail?id=${code.id}`}>
      {code.code}
    </a>
  )

  return (
    <PageHeaderWrapper
      style={{ margin: 0 }}
      title={intl.formatMessage({ id: 'table.purchase.xinjiantoubiao' })}
      extra={[
        <Button
          key="1"
          onClick={() => addSchemaAction.submit()}
          loading={btnLoading}
          type="primary"
          icon={<SaveOutlined />}
        >
          {intl.formatMessage({ id: 'table.purchase.baocun' })}
        </Button>,
      ]}
    >
      <Card className={style.restContainer}>
        <NiceForm
          loading={formLoading}
          previewPlaceholder=" "
          value={initFormValue}
          actions={addSchemaAction}
          schema={formSchema}
          onSubmit={handleSubmit}
          components={{
            ArrayTable,
            InviterCodeJump,
          }}
          effects={($, ctx) => {
            $('onFormMount').subscribe(async () => {
              $('onFieldValueChange', 'deliverAddress').subscribe(async (state) => {
                if (state.value) {
                  ctx.setFieldValue('fullAddress', state.value)
                }
              })
            })

            $('onFieldValueChange', 'submitTenderMateriel').subscribe((state) => {
              // 重新渲染价格
              update()
            })

            // useAsyncInitSelect(
            //   ['countryCodeId'],
            //   getPageitemsBasic,
            // );
          }}
          expressionScope={{
            productColumns,
            productComponents,
            productChildren,
            beforeUpload,
          }}
        />
      </Card>

      {/* 关联投标商品 */}
      <RelevanceTenderProduct
        title={intl.formatMessage({ id: 'table.purchase.guanliantoubiaoshang' })}
        currentRef={productRef}
        schemaAction={addSchemaAction}
      />
    </PageHeaderWrapper>
  )
}

AddTender.defaultProps = {}

export default AddTender
