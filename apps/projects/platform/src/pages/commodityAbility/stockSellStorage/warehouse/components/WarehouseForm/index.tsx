import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { Button, Card, Spin } from 'antd'
import ReturnEle from '@/components/ReturnEle'
import NiceForm from '@/components/NiceForm'
import { warehouseDetailSchema } from './schema'
import { useLinkEnumEffect } from '@/components/NiceForm/linkages/linkEnum'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getManageAreaAll } from '@apps/apis'
import { getProductWarehouseDetails, postProductWarehouseAddOrUpdate } from '@apps/apis'
import styles from './index.less'
import FormDetailHeader from '@/components/FormDetailHeader'
import { FormDetailContext } from '@/formSchema/context'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import { getTelCodeOptions, getCountryCodeList, useTelCode } from '@apps/services'

const formActions = createFormActions()
const { onFormInputChange$, onFieldValueChange$ } = FormEffectHooks

interface WarehouseFormProps {
  id?: string
  validateId?: string
  // 是否是编辑的
  isEdit?: boolean
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({ id, isEdit = false }) => {
  const [info, setInfo] = useState({})
  const [unsaved, setUnsaved] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const { getTelPattern } = useTelCode()
  const intl = useIntl()
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'stockSellStorage.ninhaiyouweibaocundenei',
    }),
  })

  const getWarehouseInfo = async () => {
    if (id) {
      setInfoLoading(true)
      const infoRes = await getProductWarehouseDetails({
        id,
      })

      const areaRes = await getManageAreaAll()
      if (areaRes.code === 1000) {
        const { data } = areaRes
        formActions.setFieldState('provinceCode', (targetState) => {
          targetState.originData = data
          targetState.props.enum = data.map((v) => ({
            label: v.name,
            value: v.code,
          }))
        })
      }

      if (infoRes.code === 1000) {
        setInfo(infoRes.data)
      }
      setInfoLoading(false)
    } else {
      const areaRes = await getManageAreaAll()
      if (areaRes.code === 1000) {
        const { data } = areaRes
        formActions.setFieldState('provinceCode', (targetState) => {
          targetState.originData = data
          targetState.props.enum = data.map((v) => ({
            label: v.name,
            value: v.code,
          }))
        })
      }
    }
  }

  useEffect(() => {
    getWarehouseInfo()
  }, [])

  // 获取手机code
  const fetchTelCode = async () => {
    return await getTelCodeOptions()
  }

  const handleSubmit = (value) => {
    if (value.countryCode !== 'CN') {
      delete value.provinceCode
      delete value.provinceName
      delete value.areaCode
      delete value.areaName
      delete value.cityCode
      delete value.cityName
      delete value.streetCode
      delete value.streetName
    }

    setSubmitLoading(true)
    postProductWarehouseAddOrUpdate({
      id: id,
      ...value,
    })
      .then((res) => {
        if (res.code === 1000) {
          setTimeout(() => {
            history.goBack()
          }, 800)
        }
      })
      .finally(() => {
        setSubmitLoading(false)
      })
    setUnsaved(false)
  }

  const AddressLabel = <div className={styles.label}>{intl.formatMessage({ id: 'stockSellStorage.cangkudizhi' })}</div>

  const { formContext } = useFormDetail()
  const providerValue = {
    // detailData: initFormValue,
    schemaActions: warehouseDetailSchema,
    formContext,
  }
  return (
    <Spin spinning={infoLoading}>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          styles={{ marginTop: -67, paddingBottom: 12 }}
          title={
            !id
              ? intl.formatMessage({ id: 'stockSellStorage.xinjiancangku' })
              : isEdit
              ? intl.formatMessage({ id: 'stockSellStorage.bianjicangku' })
              : intl.formatMessage({ id: 'stockSellStorage.zhakancangku' })
          }
          schema={warehouseDetailSchema}
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
            previewPlaceholder=" "
            editable={isEdit || !id}
            expressionScope={{
              AddressLabel,
            }}
            effects={($, actions) => {
              useLinkEnumEffect(
                'areaRespList',
                (result) =>
                  result.map((v) => ({
                    label: v.name,
                    value: v.code,
                  })),
                'code',
              )
              useAsyncSelect('telCode', fetchTelCode)
              getCountryCodeList(useAsyncSelect).then((res) => {
                if (!id && res.length > 0) {
                  actions.setFieldValue('countryCode', res[0].value)
                }
              })

              onFieldValueChange$('countryCode').subscribe((countryCode) => {
                actions.setFieldState('MEGA_LAYOUT1_1', (state) => {
                  if (countryCode.value === 'CN') {
                    state.display = true
                  } else {
                    state.display = false
                  }
                })
              })

              onFieldValueChange$('telCode').subscribe((telCode) => {
                actions.setFieldState('tel', (state) => {
                  state.props['x-rules'] = [
                    {
                      pattern: getTelPattern(telCode.value, telCode.props.enum),
                      message: intl.formatMessage({
                        id: 'accountSetting.inputCorrentPhoneNumble',
                        deaultMessage: '请填写正确的手机号',
                      }),
                    },
                  ]
                })
              })

              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })
              // 注入表单完成进度
              formContext.useAttachmentChangeForContext(actions)
            }}
            initialValues={info}
            onSubmit={handleSubmit}
            actions={formActions}
            schema={warehouseDetailSchema}
          />
        </Card>
      </FormDetailContext.Provider>
    </Spin>
  )
}

export default WarehouseForm
