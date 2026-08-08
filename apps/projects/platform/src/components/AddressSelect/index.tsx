/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-05 10:28:06
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-02 18:13:17
 * @Description: 地址选择 FormItem
 */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Select, Button, Drawer, Divider, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { createFormActions, FormEffectHooks, FormPath, useValueLinkageEffect } from '@apps/formily'
import type { IRequestSuccess } from '@/index'
import type { GetLogisticsReceiverAddressGetResponse, GetLogisticsShipperAddressGetResponse } from '@apps/apis'
import {
  getLogisticsReceiverAddressGet,
  getLogisticsSelectListReceiverAddress,
  getLogisticsSelectListShipperAddress,
  getLogisticsShipperAddressGet,
  postLogisticsReceiverAddressAdd,
  postLogisticsReceiverAddressUpdate,
  postLogisticsShipperAddressAdd,
  postLogisticsShipperAddressUpdate,
} from '@apps/apis'
import { getManageAreaByPcode } from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import NiceForm from '@/components/NiceForm'
import { createSchema } from './schema'
import ModalForm from '../ModalForm'
import { AddressSelectContextProvider } from './context'
import type { AddressItemType, AddressValueType } from './components/AddressRadioGroup'
import AddressRadioGroup from './components/AddressRadioGroupFormilyItem'
import styles from './index.less'
import NotFoundContent from '../NiceForm/components/NotFoundConent'
import { BLOCK_STATUS, getCountryCodeList, getTelCodeOptions } from '@apps/services'
import { ADDRESS_TYPE, AddressManageDrawer, AddressManageModal, AddressManageSelectDrawer } from '@apps/components'

const formActions = createFormActions()
const { onFormInit$, onFormMount$ } = FormEffectHooks

export const useFetchAreaEnumLinkageEffect = () => {
  useValueLinkageEffect({
    type: 'value:areaEnum',
    resolve: async ({ origin, target }, { getFieldValue, setFieldState, getFieldState }) => {
      const parentValue = getFieldValue(origin)

      getFieldState(origin, (innerState) => {
        if (innerState.modified) {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          setFieldState(target, (innerState) => {
            FormPath.setIn(innerState, 'value', undefined)
            FormPath.setIn(innerState, 'props.enum', [])
          })
          innerState.modified = false
          return
        }
      })
      // loading start
      setFieldState(target, (innerState) => {
        FormPath.setIn(innerState, 'props.x-props.hasFeedback', true)
        FormPath.setIn(innerState, 'loading', true)
      })
      const res = await getManageAreaByPcode({
        pcode: parentValue,
      })
      if (res.code === 1000) {
        setFieldState(target, (innerState) => {
          FormPath.setIn(innerState, 'originData', res.data)
          FormPath.setIn(
            innerState,
            'props.enum',
            res.data.map((item) => ({
              label: item.name,
              value: item.code,
            })),
          )
        })
      }
      // loading end
      setFieldState(target, (innerState) => {
        FormPath.setIn(innerState, 'loading', false)
      })
    },
    reject: ({ target }, { setFieldState }) => {
      setFieldState(target, (innerState) => {
        FormPath.setIn(innerState, 'value', undefined)
        FormPath.setIn(innerState, 'props.enum', [])
      })
    },
  })
}

export interface AddressSelectProps {
  /**
   * 类型：1 收货地址 2 发货地址，默认 2
   */
  addressType?: 1 | 2
  /**
   * 值
   */
  value?: AddressValueType
  /**
   * 选择触发改变
   */
  onChange?: (value: AddressValueType) => void
  /**
   * 是否默认选择 默认地址，是的话会触发 onChange value为默认地址，默认为false
   */
  isDefaultAddress?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否可编辑的
   */
  editable?: boolean
  /**
   * 是否显示下拉框，注意该属性与 isDefaultAddress 冲突
   */
  echo?: boolean

  /**
   * 占位符
   */
  placeholder?: string

  /**
   * 编辑地址表单的展示类型
   */
  editAddressFromType?: 'default' | 'modal'

  /**
   * 显示地址弹窗按钮国际化文案id
   */
  suffixTextId?: string

  /**
   * 显示地址弹窗按钮国际化文案id
   */
  dreawTitleTextId?: string

  /**
   * 外部传递进来调用获取地址列表的接口
   */
  getAddressListApi?: () => Promise<any>
  /**
   * 外部接口额外参数
   */
  params?: Record<string, any>
  needParams?: boolean
  /**
   * 显示地址弹窗新增地址按钮国际化文案id
   */
  createTitleTextId?: string
  /**
   * 是否可以更换地址
   */
  canChange?: boolean
}

export type SubmitValuesType = {
  /**
   * 地址单选选中的值
   */
  address?: AddressValueType
  /**
   * 收件人名称 或 发货人名称
   */
  name: string
  /**
   * 省级code
   */
  provinceCode: string
  /**
   * 市级code
   */
  cityCode: string
  /**
   * 区级code
   */
  districtCode: string
  /**
   * 街道code
   */
  streetCode?: string
  /**
   * 详细地址
   */
  detailed: string
  /**
   * 邮编
   */
  postalCode: string
  /**
   * 区号
   */
  areaCode: string
  /**
   * 手机号码
   */
  phone: string
  /**
   * 电话号码
   */
  tel: string
  /**
   * 是否是默认
   */
  isDefault: boolean
}

const AddressSelect: React.FC<AddressSelectProps> = (props) => {
  const {
    addressType = 2,
    value,
    onChange,
    isDefaultAddress = false,
    disabled = false,
    editable = true,
    echo = false,
    placeholder = '',
    editAddressFromType = 'default',
    suffixTextId = 'components.xuanze',
    getAddressListApi,
    params,
    needParams = false,
    canChange = true,
    dreawTitleTextId = 'components.genggaishouhuodizhixinxi',
    createTitleTextId = 'componnets.addressSelect.create',
  } = props
  const [list, setList] = useState<AddressValueType[]>([])
  const [internalValue, setInternalValue] = useState<AddressValueType>()
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const actionRef = AddressManageDrawer.useRef({ type: addressType })
  // 记录当前编辑的地址id
  const editAddressId = useRef<number | null>(null)

  // 记录是否是新增或编辑操作
  const actionFlagRef = useRef<boolean>(false)

  const customModalFormRef = useRef<any>({})

  const intl = useIntl()

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const triggerChange = (value: AddressValueType) => {
    if (onChange) {
      onChange(value)
    }
  }

  const getAddressList = (updateDefault?: boolean = true) => {
    let fetchAction
    if (getAddressListApi && typeof getAddressListApi === 'function') {
      fetchAction = getAddressListApi
      if (needParams && !params) {
        return
      }
    } else {
      fetchAction = addressType === 2 ? getLogisticsSelectListShipperAddress : getLogisticsSelectListReceiverAddress
    }

    fetchAction &&
      fetchAction({ ...params })
        .then((res: IRequestSuccess<AddressItemType[]>) => {
          if (res.code === 1000) {
            const defaultItem = res.data?.find((item) => item.isDefault)
            const listArr = res.data?.map(({ shipperName, receiverName, ...rest }) => ({
              name: shipperName || receiverName,
              ...rest,
            }))
            setList(listArr)

            if (!updateDefault) {
              return
            }

            // 这里处理如果设置了回调默认地址，然后进行了删除这条默认地址地址操作
            // 之后重新请求了列表，但因为之前的默认地址被删除了，需要重新置空地址值
            if (isDefaultAddress && value && value.id && !listArr.find((item) => item.id === value.id) && !echo) {
              if (!('value' in props)) {
                setInternalValue(undefined)
              }

              triggerChange(undefined)
            }

            if (isDefaultAddress && defaultItem && !disabled && editable && !actionFlagRef.current && !echo) {
              const { shipperName, receiverName, ...rest } = defaultItem
              const next = {
                name: shipperName || receiverName,
                ...rest,
              }

              if (!('value' in props)) {
                setInternalValue(next)
              }
              triggerChange(next)
            }
          }
        })
        .catch((err) => {
          console.warn(err)
        })
  }

  // 获取手机code
  const fetchTelCode = async () => {
    return await getTelCodeOptions()
  }

  useEffect(() => {
    if ('value' in props) {
      setInternalValue(value)
    }
  }, [value])

  useEffect(() => {
    getAddressList()
  }, [getAddressListApi, params])

  const onRefreshAddressList = () => {
    getAddressList(false)
  }

  const handleVisibleDrawer = (flag?: boolean) => {
    if (flag) {
      editAddressId.current = null
    } // 解决点击编辑然后关掉弹窗再进来新增变成编辑的问题
    setVisibleDrawer(!!flag)
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleSelectChange = (value: number) => {
    const current = list.find((item) => item.id === value)

    if (!('value' in props)) {
      setInternalValue(current)
    }

    if (current) {
      triggerChange(current)
    }
  }

  const resetAddressFormItem = () => {
    formActions.setFieldValue('name', undefined, true)
    formActions.setFieldValue('countryCode', undefined, true)
    formActions.setFieldValue('provinceCode', undefined, true)
    formActions.setFieldValue('cityCode', undefined, true)
    formActions.setFieldValue('districtCode', undefined, true)
    formActions.setFieldValue('streetCode', undefined, true)
    formActions.setFieldValue('detailed', undefined, true)
    formActions.setFieldValue('postalCode', undefined, true)
    formActions.setFieldValue('areaCode', undefined, true)
    formActions.setFieldValue('phone', undefined, true)
    formActions.setFieldValue('tel', undefined, true)
    formActions.setFieldValue('isDefault', false, true)
  }
  const handleSubmit = async (values: SubmitValuesType) => {
    let next = values.address
    // 有值表示是新增 或 修改操作
    if (values.name) {
      const provinceCodeOriginData = formActions.getFieldState('provinceCode', (fieldState) => {
        return fieldState.originData
      })
      if (!provinceCodeOriginData) {
        message.warn(intl.formatMessage({ id: 'components.weizhaodaoshengjixinxi', defaultMessage: '未找到省级信息' }))
        return
      }
      const currentProvince = provinceCodeOriginData.find((item) => item.code === values.provinceCode)

      const cityCodeOriginData = formActions.getFieldState('cityCode', (fieldState) => {
        return fieldState.originData
      })
      if (!cityCodeOriginData) {
        message.warn(intl.formatMessage({ id: 'components.weizhaodaoshijixinxi', defaultMessage: '未找到市级信息' }))
        return
      }
      const currentCity = cityCodeOriginData.find((item) => item.code === values.cityCode)

      const districtCodeOriginData = formActions.getFieldState('districtCode', (fieldState) => {
        return fieldState.originData
      })
      if (!districtCodeOriginData) {
        message.warn(intl.formatMessage({ id: 'components.weizhaodaoqujixinxi', defaultMessage: '未找到区级信息' }))
        return
      }
      const currentDistrict = districtCodeOriginData.find((item) => item.code === values.districtCode)

      const streetCodeOriginData = formActions.getFieldState('streetCode', (fieldState) => {
        return fieldState.originData
      })
      if (!streetCodeOriginData) {
        message.warn(intl.formatMessage({ id: 'components.weizhaodaojiedaoxinxi', defaultMessage: '未找到街道信息' }))
        return
      }
      const currentStreet = streetCodeOriginData.find((item) => item.code === values.streetCode)

      const provinceName = currentProvince?.name
      const cityName = currentCity?.name
      const districtName = currentDistrict?.name
      const streetName = currentStreet?.name

      const { name, detailed, isDefault, ...rest } = values
      const commonPayload = {
        ...rest,
        id: 0,
        provinceName,
        cityName,
        districtName,
        streetName,
        address: detailed,
        isDefault: isDefault ? 1 : 0,
      }

      // 新增地址
      if (!editAddressId.current) {
        try {
          setSubmitLoading(true)
          const addRes =
            addressType === 2
              ? await postLogisticsShipperAddressAdd({
                  ...commonPayload,
                  shipperName: name,
                })
              : await postLogisticsReceiverAddressAdd({
                  ...commonPayload,
                  receiverName: name,
                })

          if (addRes.code === 1000) {
            const fullAddress = `${provinceName}${cityName}${districtName}`
            next = {
              fullAddress: editAddressFromType === 'default' ? fullAddress : `${fullAddress}${streetName}${detailed}`,
              id: addRes.data?.id,
              isDefault: values.isDefault ? 1 : 0,
              name: values.name,
              phone: values.phone,
            }
            // 重新获取列表，把新添加的内容加载出来
            // 不触发默认值提交
            actionFlagRef.current = true
            getAddressList()

            // formActions.reset({ selector: 'ADDRESS_NEW.*', validate: false });
            resetAddressFormItem()
            setTimeout(() => {
              formActions.setFieldState('ADDRESS_NEW', (state) => {
                state.visible = false
              })
            }, 0)

            formActions.setFieldState('ADD_ACTION', (state) => {
              state.props['x-component-props'] = {
                flag: true,
              }
            })
          }
          setSubmitLoading(false)
        } catch (error) {
          console.warn(error)
        }
      }
      // 编辑地址
      if (editAddressId.current) {
        try {
          setSubmitLoading(true)
          const addRes =
            addressType === 2
              ? await postLogisticsShipperAddressUpdate({
                  ...commonPayload,
                  id: editAddressId.current,
                  shipperName: name,
                })
              : await postLogisticsReceiverAddressUpdate({
                  ...commonPayload,
                  id: editAddressId.current,
                  receiverName: name,
                })

          if (addRes.code === 1000) {
            const fullAddress = `${provinceName}${cityName}${districtName}`
            next = {
              fullAddress: editAddressFromType === 'default' ? fullAddress : `${fullAddress}${streetName}${detailed}`,
              id: editAddressId.current,
              isDefault: values.isDefault ? 1 : 0,
              name: values.name,
              phone: values.phone,
            }
            // 重新获取列表，把新添加的内容加载出来
            // 不触发默认值提交
            actionFlagRef.current = true
            getAddressList()

            editAddressId.current = null
            // formActions.reset({ selector: 'ADDRESS_NEW.*', validate: false });
            resetAddressFormItem()
            setTimeout(() => {
              formActions.setFieldState('ADDRESS_NEW', (state) => {
                state.visible = false
              })
            }, 0)

            formActions.setFieldState('ADD_ACTION', (state) => {
              state.props['x-component-props'] = {
                flag: true,
              }
            })
          }
          setSubmitLoading(false)
        } catch (error) {
          console.warn(error)
        }
      }
    }
    if (!('value' in props)) {
      setInternalValue(next)
    }
    triggerChange(next)
    handleVisibleDrawer(false)
  }

  const useFields = (): any =>
    useMemo(
      () => ({
        AddressRadioGroup,
      }),
      [],
    )

  const createRichTextUtils = () => {
    return {
      required(text) {
        return React.createElement('div', { className: styles['label-required'] }, text)
      },
    }
  }

  const AreaLabel = <div className={styles['label-required']}>{intl.formatMessage({ id: 'components.diqu' })}</div>
  const PhoneLabel = (
    <div className={styles['label-required']}>{intl.formatMessage({ id: 'contract.shoujihaoma' })}</div>
  )

  const setProvinceCode = async ($, action) => {
    // 先获取地区信息
    action.setFieldState('provinceCode', (targetState) => {
      FormPath.setIn(targetState, 'props.x-props.hasFeedback', true)
      FormPath.setIn(targetState, 'loading', true)
    })
    const areaRes = await getManageAreaByPcode()

    action.setFieldState('provinceCode', (targetState) => {
      FormPath.setIn(targetState, 'loading', false)
    })

    if (areaRes.code !== 1000) {
      message.warn(intl.formatMessage({ id: 'components.huoqushengjixinxishibai', defaultMessage: '获取省级信息失败' }))
      return
    }
    const { data } = areaRes
    action.setFieldState('provinceCode', (targetState) => {
      FormPath.setIn(targetState, 'originData', data)
      FormPath.setIn(
        targetState,
        'props.enum',
        data.map((v) => ({
          label: v.name,
          value: v.code,
        })),
      )
    })
  }

  const handleAddAddress = async () => {
    // 重置，尝试过 reset 但是没有效果不知道为啥
    // formActions.reset({ selector: 'ADDRESS_NEW.*', validate: false, forceClear: true }); // 这样没效果
    resetAddressFormItem()

    const visible = formActions.getFieldState('ADDRESS_NEW', (targetState) => {
      return targetState.visible
    })
    formActions.setFieldState('ADDRESS_NEW', (state) => {
      state.visible = !visible
    })

    if (editAddressFromType === 'default') {
      formActions.setFieldState('ADD_ACTION', (state) => {
        state.props['x-component-props'] = {
          flag: visible,
        }
      })
      setProvinceCode(FormEffectHooks, formActions)
    }
    if (editAddressFromType === 'modal') {
      setTimeout(() => {
        customModalFormRef.current.setVisible(!visible)
      }, 10)
    }
  }

  const handleEditAddress = async () => {
    actionRef.toggle(BLOCK_STATUS.EDIT, value?.id)
    // try {
    //   const res =
    //     addressType === 2
    //       ? await getLogisticsShipperAddressGet({ id: `${id}` })
    //       : await getLogisticsReceiverAddressGet({ id: `${id}` })
    //   if (res.code === 1000) {
    // 		actionRef.toggle(BLOCK_STATUS.EDIT, res.data)
    //   } else {
    //     message.warn(intl.formatMessage({ id: 'components.huoqudizhixinxishibai', defaultMessage: '获取地址信息失败' }))
    //   }
    // } catch (error) {
    //   console.warn(error)
    // }
  }

  const onRefresh = (actionFlag?: boolean) => {
    actionFlagRef.current = !!actionFlag
    getAddressList()
  }

  const options = useMemo(() => {
    return list.map((item) => {
      if (!item.fullAddress) {
        item.fullAddress = `${item.provinceName || ''}${item.cityName || ''}${item.districtName || ''}${
          item.streetName || ''
        }${item.address || ''}`
      }
      return {
        value: item.id,
        label: `${item.name} ${item.fullAddress} ${item.phone}`,
      }
    })
  }, [list])

  const AddButton = useMemo(() => {
    return (props_) => {
      const { flag = true } = props_
      switch (editAddressFromType) {
        case 'modal':
          return (
            <div>
              <Button style={{ width: '100%' }} onClick={handleAddAddress}>
                <PlusOutlined />
                {intl.formatMessage({ id: createTitleTextId, defaultMessage: '使用新地址' })}
              </Button>
            </div>
          )
        default:
          return (
            <div>
              <Button onClick={handleAddAddress}>
                {flag
                  ? `${intl.formatMessage({ id: 'components.xinzeng', defaultMessage: '新增' })}${
                      addressType === 2
                        ? intl.formatMessage({ id: 'components.fahuo', defaultMessage: '发货' })
                        : intl.formatMessage({ id: 'components.shouhuo', defaultMessage: '收货' })
                    }${intl.formatMessage({ id: 'components.dizhi', defaultMessage: '地址' })}`
                  : intl.formatMessage({ id: 'components.quxiao', defaultMessage: '取消' })}
              </Button>
              <Divider style={{ marginBottom: 4 }} />
            </div>
          )
      }
    }
  }, [editAddressFromType])

  const useSchemaEffects = ($, ctx) => {
    const { setFieldState } = ctx
    onFormMount$().subscribe(() => {
      if (editAddressFromType === 'modal') {
        setProvinceCode($, ctx)
      }
    })
    onFormInit$().subscribe(() => {
      setFieldState('address', (state) => {
        state.props['x-component-props'] = {
          ...(state.props['x-component-props'] || {}),
          isDefaultAddress,
          addressType,
        }
      })
    })

    useFetchAreaEnumLinkageEffect()

    useAsyncSelect('areaCode', fetchTelCode)
    getCountryCodeList(useAsyncSelect)
  }

  const modalExpressionScope = () => {
    return {
      customModalFormRef,
      formActions,
      modalConfirm: () => {
        formActions.submit()
      },
      handleSubmit,
      useSchemaEffects,
      editBtnText: <EditOutlined />,
      deleteBtnText: <DeleteOutlined />,
    }
  }

  const renderAddressStr = () => {
    const current = list.find((item) => item.id === value?.id)
    const full = current ? `${current.name} ${current.fullAddress} ${current.phone}` : null
    const isStr = typeof value === 'string'
    return (
      <div>{full || (!isStr ? `${value?.name || ''} ${value?.fullAddress || ''} ${value?.phone || ''}` : value)}</div>
    )
  }

  if (!editable) {
    return renderAddressStr()
  }

  return (
    <AddressSelectContextProvider
      value={{
        addressList: list,
        refresh: onRefresh,
      }}
    >
      <div className={styles['address-select']}>
        {!echo && (
          <div className={styles['address-select-input']}>
            <Select
              placeholder={placeholder}
              options={options}
              value={typeof value === 'object' ? value?.id : value}
              onChange={handleSelectChange}
              disabled={disabled}
              style={{
                width: '100%',
              }}
            />
          </div>
        )}
        {echo && <div className={styles['address-select-input']}>{renderAddressStr()}</div>}
        {canChange && (
          <Button
            type="primary"
            onClick={handleEditAddress}
            className={styles['address-select-action']}
            disabled={disabled}
          >
            {intl.formatMessage({ id: suffixTextId, defaultMessage: '更改' })}
          </Button>
        )}
      </div>
      <AddressManageSelectDrawer
        actionRef={actionRef}
        value={value}
        onChange={onChange}
        onRefreshAddressList={onRefreshAddressList}
      />
    </AddressSelectContextProvider>
  )
}

export default AddressSelect
