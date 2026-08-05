import React, { useState, useEffect, useMemo } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import ReturnEle from '@/components/ReturnEle'
import { Button, Card, Spin } from 'antd'
import NiceForm from '@/components/NiceForm'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getManageAreaByPcode, GetManageAreaByPcodeRequest } from '@apps/apis'
import { PATTERN_MAPS } from '@/constants/regExp'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import AddressSelect from '@/components/AddressSelect/components/AreaSelectFormilyItem'
import {
  getLogisticsShipperAddressGet,
  postLogisticsShipperAddressAdd,
  postLogisticsShipperAddressUpdate,
} from '@apps/apis'
import { SaveOutlined } from '@ant-design/icons'
import { useFetchAreaEnumLinkageEffect } from '@/components/AddressSelect'
import { area } from '../component/format'
import { getTelCodeOptions } from '@apps/services'
const intl = getIntl()
export interface AddressModalProps {
  /** 类型 */
  mode: 'add' | 'edit' | 'preview' | 'default'
  /** id */
  id?: string
}
const addressSchemaAction = createFormActions()
const { onFormInputChange$ } = FormEffectHooks

const AddedAddressLayout: React.FC<AddressModalProps> = (props) => {
  const { mode, id } = props
  const [infoLoading, setInfoLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState<boolean>(false)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [selfInitValue, setSelfInitValue] = useState<any>({})

  // 获取手机区号
  const fetchTelCode = async () => {
    return await getTelCodeOptions()
  }

  const handleSubmit = async (value) => {
    const params = {
      ...value,
      isDefault: Number(!!value.isDefault),
      ...area(value.areaSelect),
    }
    delete params.areaSelect
    setSubmitLoading(true)
    const fn = mode === 'edit' ? postLogisticsShipperAddressUpdate : postLogisticsShipperAddressAdd
    await fn(params).then((res) => {
      if (res.code !== 1000) {
        setSubmitLoading(false)
        return
      }
      setUnsaved(false)
      setSubmitLoading(false)
      setTimeout(() => {
        history.goBack()
      }, 200)
    })
  }

  const renderSelectOption = (key, ctx, params?: GetManageAreaByPcodeRequest) => {
    getManageAreaByPcode({ ...params }).then((res) => {
      if (res.code === 1000) {
        const { data } = res
        ctx.setFieldState(key, (targetState) => {
          targetState.originData = data
          targetState.props.enum = data.map((v) => ({
            label: v.name,
            value: v.code,
          }))
        })
      }
    })
  }

  useEffect(() => {
    if (id) {
      setInfoLoading(true)
      new Promise((resolve) => {
        getLogisticsShipperAddressGet({ id }).then((res) => {
          if (res.code !== 1000) {
            setInfoLoading(false)
            return
          }
          setInfoLoading(false)
          resolve(res.data)
        })
      }).then((res: any) => {
        const areaSelect = [
          { name: res.provinceName, code: res.provinceCode },
          { name: res.cityName, code: res.cityCode },
          { name: res.districtName, code: res.districtCode },
          { name: res.streetName, code: res.streetCode },
        ]
        const param = {
          areaSelect,
          ...res,
        }
        setSelfInitValue(param)
      })
    }
  }, [mode === 'edit'])

  const useChainEffects = ($, ctx) => {
    // 初始省份选择
    renderSelectOption('provinceCode', ctx)
  }

  const useFields = (): any =>
    useMemo(
      () => ({
        AddressSelect,
      }),
      [],
    )

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        extra={[
          mode !== 'preview' && (
            <Button
              key="1"
              type="primary"
              icon={<SaveOutlined />}
              loading={submitLoading}
              onClick={() => addressSchemaAction.submit()}
            >
              {intl.formatMessage({ id: 'logistics.baocun' })}
            </Button>
          ),
        ]}
      >
        <Card>
          <NiceForm
            editable={mode !== 'preview'}
            onSubmit={handleSubmit}
            fields={useFields()}
            initialValues={selfInitValue}
            actions={addressSchemaAction}
            effects={($, ctx) => {
              $('onFormMount').subscribe(() => {
                // 四级联动
                useChainEffects($, ctx)
              })
              useFetchAreaEnumLinkageEffect()
              useAsyncSelect('areaCode', fetchTelCode)

              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })
            }}
            schema={{
              type: 'object',
              properties: {
                NO_SUBMIT_LAYOUT_ADDRESS: {
                  type: 'object',
                  'x-component': 'mega-layout',
                  'x-component-props': {
                    labelCol: 4,
                    wrapperCol: 9,
                    labelAlign: 'left',
                  },
                  properties: {
                    shipperName: {
                      type: 'string',
                      title: intl.formatMessage({ id: 'logistics.fahuoren' }),
                      'x-rules': [
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'logistics.qingshurufahuo' }),
                        },
                        {
                          limitByte: true,
                          maxByte: 40,
                        },
                      ],
                    },
                    areaSelect: {
                      type: 'string',
                      title: intl.formatMessage({ id: 'logistics.fahuodiqu' }),
                      'x-rules': [
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'portalSystem.qingxuanzeshengshiqu',
                            defaultMessage: '请选择省/市/区',
                          }),
                        },
                      ],
                      'x-component': 'AddressSelect',
                    },
                    address: {
                      type: 'string',
                      'x-component': 'textarea',
                      'x-component-props': {
                        rows: 3,
                        placeholder: '',
                      },
                      title: intl.formatMessage({ id: 'logistics.xiangxidizhi' }),
                      'x-rules': [
                        {
                          required: true,
                          message: `${intl.formatMessage({ id: 'detail.purchase.message22' })} ${intl.formatMessage({
                            id: 'logistics.xiangxidizhi',
                          })} `,
                        },
                        {
                          limitByte: true,
                          maxByte: 60,
                        },
                      ],
                    },
                    postalCode: {
                      type: 'string',
                      title: intl.formatMessage({ id: 'logistics.youbian' }),
                      'x-rules': [
                        {
                          limitByte: true,
                          maxByte: 12,
                        },
                      ],
                    },
                    NO_SUBMIT_LAYOUT_PHONE: {
                      type: 'object',
                      'x-component': 'mega-layout',
                      'x-component-props': {
                        wrapperCol: 24,
                        label: intl.formatMessage({ id: 'logistics.shoujihaoma' }),
                        className: 'noMarbottom',
                        required: true,
                      },
                      properties: {
                        MEGA_LAYOUT2_1: {
                          type: 'object',
                          'x-component': 'mega-layout',
                          'x-component-props': {
                            grid: true,
                            full: true,
                            columns: 2,
                          },
                          properties: {
                            areaCode: {
                              type: 'string',
                              enum: [],
                              default: '+86',
                              'x-component-props': {
                                placeholder: intl.formatMessage({ id: 'logistics.qingxuanze' }),
                              },
                            },
                            phone: {
                              type: 'string',
                              'x-mega-props': {
                                span: 3,
                              },
                              'x-component-props': {
                                placeholder: intl.formatMessage({ id: 'logistics.qingshurunide' }),
                                maxLength: 11,
                              },
                              'x-rules': [
                                {
                                  required: true,
                                  message: intl.formatMessage({ id: 'logistics.qingshurunide' }),
                                },
                                {
                                  pattern: PATTERN_MAPS.phone,
                                  message: intl.formatMessage({ id: 'logistics.qingshuruzhengque' }),
                                },
                              ],
                            },
                          },
                        },
                      },
                    },
                    tel: {
                      title: intl.formatMessage({ id: 'logistics.dianhuahaoma' }),
                      type: 'string',
                    },
                    isDefault: {
                      title: intl.formatMessage({ id: 'logistics.shifoumoren' }),
                      type: 'boolean',
                      'x-mega-props': {
                        wrapperWidth: 36,
                      },
                    },
                  },
                },
              },
            }}
          />
        </Card>
      </PageHeaderWrapper>
    </Spin>
  )
}
export default AddedAddressLayout
