import React, { useState, useEffect } from 'react'
import { Button, Card, Progress, Spin } from 'antd'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import ReturnEle from '@/components/ReturnEle'
import NiceForm from '@/components/NiceForm'
import { getProductInvoicesTypeDetails, postProductInvoicesTypeAddOrUpdate } from '@apps/apis'
import { billsTypeDetailSchema } from './schema'
import FormDetailHeader from '@/components/FormDetailHeader'
import { FormDetailContext } from '@/formSchema/context'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'

const formActions = createFormActions()
const { onFormInputChange$ } = FormEffectHooks

interface BillTypeFormProps {
  id?: string
  validateId?: string
  // 是否是编辑的
  isEdit?: boolean
}
const BillTypeForm: React.FC<BillTypeFormProps> = ({ id, isEdit = false }) => {
  const [info, setInfo] = useState({})
  const [unsaved, setUnsaved] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const intl = useIntl()

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'stockSellStorage.ninhaiyouweibaocundenei',
    }),
  })

  const docTypeInfo = async () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    const infoRes = await getProductInvoicesTypeDetails({
      id,
    })

    if (infoRes.code === 1000) {
      setInfo(infoRes.data)
      formActions.setFieldState('number', (state) => {
        state.visible = true
      })
    }
    setInfoLoading(false)
  }

  useEffect(() => {
    docTypeInfo()
  }, [])

  const handleSubmit = (value) => {
    setSubmitLoading(true)
    postProductInvoicesTypeAddOrUpdate({
      id: id,
      ...value,
    }).then((res) => {
      if (res.code === 1000) {
        history.goBack()
      }
    })

    setUnsaved(false)
  }

  const { formContext } = useFormDetail()
  const providerValue = {
    // detailData: initFormValue,
    schemaActions: formActions,
    formContext,
  }
  return (
    <Spin spinning={infoLoading}>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          styles={{ marginTop: -67, paddingBottom: 12 }}
          title={
            !id
              ? intl.formatMessage({
                  id: 'stockSellStorage.xinjiandanjuleixing',
                })
              : isEdit
              ? intl.formatMessage({
                  id: 'stockSellStorage.bianjidanjuleixing',
                })
              : intl.formatMessage({
                  id: 'stockSellStorage.zhakandanjuleixing',
                })
          }
          schema={billsTypeDetailSchema}
          extraRight={
            isEdit || !id
              ? [
                  <Button
                    key="1"
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={submitLoading}
                    onClick={() => formActions.submit()}
                  >
                    {intl.formatMessage({ id: 'stockSellStorage.baocun' })}
                  </Button>,
                ]
              : []
          }
        />
        <Card
          style={{
            margin: '68px 12px 0 12px',
          }}
        >
          <NiceForm
            previewPlaceholder="' '"
            editable={isEdit || !id}
            effects={($, ctx) => {
              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })
              // 注入表单完成进度
              formContext.useAttachmentChangeForContext(ctx)
            }}
            initialValues={info}
            onSubmit={handleSubmit}
            actions={formActions}
            schema={billsTypeDetailSchema}
          />
        </Card>
      </FormDetailContext.Provider>
    </Spin>
  )
}

export default BillTypeForm
