import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Card, Spin, Button } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import ReturnEle from '@/components/ReturnEle'
import { createFormActions, FormEffectHooks, ISchema } from '@apps/formily'
import { SaveOutlined } from '@ant-design/icons'
import { useLinkEnumEffect } from '@/components/NiceForm/linkages/linkEnum'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import styles from './index.less'
import { getManageAreaByPcode } from '@apps/apis'
import { getTelCodeOptions } from '@apps/services'
const intl = getIntl()
const formActions = createFormActions()
const { onFormInputChange$ } = FormEffectHooks

interface AddressFormProps {
  /**
   * 数据id
   */
  id?: number
  /**
   * 是否可编辑的
   */
  isEdit?: boolean
  /**
   * 联动title
   **/
  title?: string
  /**
   * 接口
   */
  fetch?: () => Promise<unknown>
  /**
   * schema
   */
  schema?: ISchema
  /**
   * detail
   */
  detail?: () => Promise<unknown>
}

const AddressForm: React.FC<AddressFormProps> = (props: any) => {
  const addressData = useRef<any[]>([])
  const { id, isEdit, title, fetch, schema, detail } = props
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const [infoLoading, setInfoLoading] = useState(false)
  const [initialValue, setInitialValue] = useState(null)

  // 获取手机code
  const fetchTelCode = async () => {
    return await getTelCodeOptions()
  }

  const AddressLabel = <div className={styles.label}>{title}</div>

  const PhoneLabel = <div className={styles.label}>{intl.formatMessage({ id: 'logistics.shoujihaoma' })}</div>

  const findAreaNameByCode = (dataSource, code) => {
    return dataSource.find((v) => v.code === code).name
  }

  const handleSubmit = (value: any) => {
    setSubmitLoading(true)
    const provinceCode = formActions.getFieldValue('provinceCode')
    const cityCode = formActions.getFieldValue('cityCode')
    const districtCode = formActions.getFieldValue('districtCode')

    const provinceData = addressData.current
    const cityData = provinceData.find((v) => v.code === provinceCode).areaRespList
    const districtData = cityData.find((v) => v.code === cityCode).areaRespList
    const provinceName = findAreaNameByCode(provinceData, provinceCode)
    const cityName = findAreaNameByCode(cityData, cityCode)
    const districtName = findAreaNameByCode(districtData, districtCode)

    const params = {
      ...value,
      isDefault: Number(!!value.isDefault),
      provinceName,
      cityName,
      districtName,
    }
    id && (params.id = id)
    fetch(params)
      .then((res) => {
        setUnsaved(false)
        setSubmitLoading(false)
        if (res.code !== 1000) {
          setSubmitLoading(false)
          return
        }
        setTimeout(() => {
          history.goBack()
        }, 200)
      })
      .catch((_error) => {
        setSubmitLoading(false)
      })
  }

  const formatedValue = useMemo(() => {
    if (!initialValue) {
      return {}
    }
    return initialValue
  }, [initialValue])

  const getFetchData = async () => {
    await detail({ id })
      .then((res) => {
        setInfoLoading(false)
        if (res.code !== 1000) {
          return
        }
        setTimeout(() => {
          setInitialValue(res.data)
        }, 500)
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  useEffect(() => {
    if (id) {
      setInfoLoading(true)
      getFetchData()
    }
  }, [])

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        extra={[
          isEdit && (
            <Button
              key="1"
              type="primary"
              icon={<SaveOutlined />}
              loading={submitLoading}
              onClick={() => formActions.submit()}
            >
              {intl.formatMessage({ id: 'logistics.baocun' })}
            </Button>
          ),
        ]}
      >
        <Card>
          <NiceForm
            initialValues={formatedValue}
            onSubmit={handleSubmit}
            actions={formActions}
            expressionScope={{
              AddressLabel,
              PhoneLabel,
            }}
            effects={($, { setFieldState, setFieldValue }) => {
              $('onFormMount').subscribe(async () => {
                await getManageAreaByPcode({ pcode: '' }).then((res) => {
                  if (res.code === 1000) {
                    const { data } = res
                    addressData.current = data
                    setFieldState('provinceCode', (targetState) => {
                      targetState.originData = data
                      targetState.props.enum = data.map((v) => ({
                        label: v.name,
                        value: v.code,
                      }))
                    })
                    if (initialValue) {
                      const { provinceCode, cityCode } = initialValue
                      const cityData: any[] = data.find((v) => v.code === provinceCode).areaRespList || []
                      setFieldState('cityCode', (targetState) => {
                        targetState.originData = cityData
                        targetState.props.enum = cityData.map((v) => ({
                          label: v.name,
                          value: v.code,
                        }))
                      })
                      setFieldState('districtCode', (targetState) => {
                        const districtData: any[] = cityData.find((v) => v.code === cityCode).areaRespList || []
                        targetState.originData = districtData
                        targetState.props.enum = districtData.map((v) => ({
                          label: v.name,
                          value: v.code,
                        }))
                      })
                    }
                  }
                })
              })

              useLinkEnumEffect(
                'areaRespList',
                (result) =>
                  result.map((v) => ({
                    label: v.name,
                    value: v.code,
                  })),
                'code',
              )

              useAsyncSelect('areaCode', fetchTelCode)

              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })
            }}
            schema={schema}
            editable={isEdit}
          />
        </Card>
      </PageHeaderWrapper>
    </Spin>
  )
}

AddressForm.defaultProps = {
  id: 0,
  isEdit: false,
}

export default AddressForm
