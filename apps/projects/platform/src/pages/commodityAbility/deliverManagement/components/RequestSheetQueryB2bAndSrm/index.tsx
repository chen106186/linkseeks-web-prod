import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { Button, Cascader, message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import type { ParsedQuery } from 'query-string'
import { FormDetailContext } from '@/formSchema/context'
import NiceForm from '@/components/NiceForm'
import FormDetailHeader from '@/components/FormDetailHeader'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { mergeAllSchemas } from './schema'
import moment from 'moment'
import { formatTimeString } from '@/utils'
import { cloneDeep, debounce } from 'lodash'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import { SaveOutlined } from '@ant-design/icons'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import DrawerSearchTable from '../DrawerSearchTable'
import DeliverMaterialTable from '../DeliverMaterialTable'
import CustomInputSearch from '@/components/NiceForm/components/CustomInputSearch'
import usePrompt from '@/hooks/usePrompt'
import { ReceiverAddress } from '@/components/AddressDrawer'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { deliverShopColumns, deliverMaterialColumns } from './columns'
import {
  getMemberManageSupplyMember,
  getMemberUserPage,
  postMemberSupplierLifecycleArchivesManagementPage,
} from '@apps/apis'
import type { GetMemberManageSupplyMemberResponseDetail, GetMemberUserPageResponseDetail } from '@apps/apis'
import {
  postProductSampleDeliverBuyerB2bCreate,
  getProductSampleDeliverTypeDropItems,
  getProductSampleDeliverEmergencyLevelDropItems,
  getProductSampleDeliverBuyerDetail,
  postProductSampleDeliverBuyerSrmCreate,
  postProductSampleDeliverBuyerUpdate,
} from '@apps/apis'
import { getLogisticsReceiverAddressListDefault } from '@apps/apis'
import { authService } from '@apps/services'

type InitFormValue = Record<string, any>
type InitFormSchema = Record<string, any>

type Props = {
  /**
   * 角色
   */
  roleType: 1 | 2
  /**
   * 链接参数
   */
  query: ParsedQuery
}

type SetSchemaEnumApi = (params: Record<string, any>, options: { ctlType: 'none' | 'success' }) => Promise<any>

type SelectUnit = { value: string | number; label: string }[]

const addSchemaAction = createFormActions()

const MemberApi = {
  '1': postMemberSupplierLifecycleArchivesManagementPage, //srm会员接口
  '2': getMemberManageSupplyMember, //b2b会员接口
}

const createDeliverApi = {
  '1': postProductSampleDeliverBuyerSrmCreate, //srm创建数据
  '2': postProductSampleDeliverBuyerB2bCreate, //b2b创建数据
}

const getUserPhone = (phone) => {
  return !isNaN(phone) && phone.length == 11 ? phone : ''
}

const getUnitName = (unit: string | number, selectUnitList: SelectUnit) => {
  return selectUnitList.find((unitItem) => {
    return unit === unitItem.value
  })
}

const setSchemaEnum = async (name: string, api: SetSchemaEnumApi) => {
  try {
    const { data } = await api({}, { ctlType: 'none' })
    addSchemaAction.setFieldState(`*(${name})`, (state) => {
      state.props.enum = data.map((item) => ({ label: item.text, value: item.id }))
      state.props.default = data[0].id
    })
    // addSchemaAction.setFieldValue(`*(${name})`,data[0].id)
  } catch (error) {}
}

const setDemandDateDisabledDay = () => {
  addSchemaAction.setFieldState('*(demandDate)', (state) => {
    state.props['x-component-props'].disabledDate = (date: moment.Moment) => {
      return date && date < moment().startOf('day')
    }
  })
}

const { onFormMount$, onFieldValueChange$ } = FormEffectHooks

const Index: React.FC<Props> = ({ roleType = 1, query }) => {
  const [headerTitle, setHeaderTitle] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)
  const [hasEdit, setHasEdit] = useState(false)
  const [initFormValue, setInitFormValue] = useState<InitFormValue>({ effectiveType: 1 })
  const [initFormSchema] = useState<InitFormSchema>({ ...mergeAllSchemas(roleType) })
  const [editable, setEditable] = useState(true)

  const tableFromRef = useRef<any[]>([])
  const neederRef = useRef<any>({})
  const canSubmit = useRef<boolean>(true)
  const supplier = useRef<Partial<GetMemberManageSupplyMemberResponseDetail>>({})
  const selectUnit = useRef<SelectUnit>([])

  const { formContext } = useFormDetail()
  const { handleLeave } = usePrompt()

  const providerValue = {
    schemaActions: addSchemaAction,
    formContext,
  }

  const intl = useIntl()

  // 获取会员列表
  const fetchSupplierList = async (params) => {
    const queryParams = {
      ...params,
    }
    if (queryParams.memberName && roleType === 1) {
      // 兼容一下srm会员接口会员搜索名字字段是name
      Object.assign(queryParams, { name: queryParams.memberName })
      delete queryParams.memberName
    }
    try {
      const res = await MemberApi[roleType](queryParams, { ctlType: 'none' })
      if (res.code === 1000) {
        return res.data
      }
      return { totalCount: 0, data: [] }
    } catch (error) {
      return { totalCount: 0, data: [] }
    }
  }
  // 获取接收人列表
  const fetchNeederList = async (params) => {
    const queryParams = {
      ...params,
      status: 1,
    }
    try {
      const res = await getMemberUserPage(queryParams)
      if (res.code === 1000) {
        res.data.data = res.data.data.map((item: GetMemberUserPageResponseDetail & { index: number }, index) => {
          if (!item.index) {
            item.index = index
          }
          return item
        })
        return res.data
      }
      return { totalCount: 0, data: [] }
    } catch (error) {
      return { totalCount: 0, data: [] }
    }
  }

  // 收货地址列表接口
  const getAddressListApi = () => {
    return getLogisticsReceiverAddressListDefault({ isStore: 0 })
  }

  // 处理送样物料/商品的数据
  const getProductsList = (products) => {
    return products.map((item) => {
      const productList = item ? { ...item } : {}
      let unitName = null
      const findUnitEnums = Array.isArray(productList?.unitEnums)
        ? getUnitName(productList.unit, productList?.unitEnums)
        : null
      const findSelectUnit = Array.isArray(selectUnit?.current)
        ? getUnitName(productList.unit, selectUnit.current)
        : null
      // 如果列表里面没有这个单位数据
      if (findUnitEnums) {
        unitName = findUnitEnums?.label
      }
      // 就拿初始列表的数组
      if (findSelectUnit) {
        unitName = findSelectUnit?.label
      }
      // 上面匹配不到说明是过来修改，没有重新选单位
      unitName = unitName ?? productList.unit

      if (item.attachment.length) {
        Object.assign(productList, {
          attachment: {
            name: item.attachment[0].name,
            url: item.attachment[0].url,
          },
        })
      } else {
        delete productList.attachment
      }
      if (productList.categoryId === '') {
        delete productList.categoryId
      }
      Object.assign(productList, {
        unit: unitName,
      })
      delete productList.index
      delete productList.readOnly
      delete productList.disabled
      delete productList.unitEnums
      return productList
    })
  }

  // 保存提交整个页面数据
  const handleSubmit = useCallback(
    async (value) => {
      if (!canSubmit.current) {
        return
      }
      const {
        summary,
        type,
        emergencyLevel,
        demandDate,
        supplierMember: [member],
        receiver: [receiverInfo],
        phone,
        address,
        remark,
        products,
      } = value

      const params = {
        summary,
        type,
        emergencyLevel,
        demandDate: formatTimeString(demandDate, 'YYYY-MM-DD'),
        vendorMemberId: member.memberId,
        vendorRoleId: member.roleId,
        vendorMemberName: member.name,
        receiver: receiverInfo.name,
        receiveDepartment: receiverInfo.orgName,
        receiverAddressId: address.id,
        phone,
        receiverName: address.name,
        address:
          address.fullAddress ||
          `${address.provinceName || ''}${address.cityName || ''}${address.districtName || ''}${
            address.streetName || ''
          }${address.address || ''}`,
        receiverPhone: address.phone,
        remark,
        products: getProductsList(products || []),
      }

      try {
        let api = createDeliverApi[roleType]
        // 更新操作的话传入id和更换接口
        if (query.id !== void 0) {
          Object.assign(params, { id: query.id })
          api = postProductSampleDeliverBuyerUpdate
        }

        setSubmitLoading(true)
        setSubmitBtnDisabled(true)

        const { code } = await api(params)
        if (code == 1000) {
          handleLeave(false)
          setSubmitLoading(false)
          setTimeout(() => {
            history.goBack()
          }, 500)
          return
        }

        setSubmitLoading(false)
        setSubmitBtnDisabled(false)
      } catch (error) {
        setSubmitLoading(false)
        setSubmitBtnDisabled(false)
        message.error(
          `${intl.formatMessage({ id: 'commodity.deliverManagement.baocunshibai', defaultMessage: '保存失败' })}!`,
        )
      }
    },
    [roleType, handleLeave, intl, query],
  )

  // 校验需求商品信息是否全部填写
  const tableValidateFields = () => {
    return new Promise<boolean>((resole) => {
      let current = 0
      if (tableFromRef.current?.length) {
        tableFromRef.current.forEach((item) => {
          item
            .validateFields()
            .then(() => {
              current++
              if (current === tableFromRef.current?.length) {
                resole(true)
              }
            })
            .catch((err) => {
              // 有点问题校验通过还会走这里，暂时判断outOfDate是否有false值，有的话就是校验不通过
              if (err.outOfDate === false) {
                resole(false)
              } else {
                current++
                if (current === tableFromRef.current?.length) {
                  resole(true)
                }
              }
            })
        })
      } else {
        resole(false)
      }
    })
  }

  // 发起整个页面数据校验
  const handleCheckForm = async () => {
    try {
      const status = await tableValidateFields()
      canSubmit.current = status
      await addSchemaAction.submit()
    } catch (error) {
      canSubmit.current = false
    }
  }

  // 重置一下送样物料的数据格式
  const deliverColumns = useMemo(() => {
    const { id, edit } = query
    return cloneDeep(roleType == 2 ? deliverShopColumns : deliverMaterialColumns).map((item) => {
      const colums = { ...item }
      if (id && !edit) {
        Object.assign(colums, { editProps: { ...item.editProps, disabled: true } })
      }
      return colums
    })
  }, [query, roleType])

  // 更新商品/物料序号
  const updateRowIndex = (temaList: any[]) => {
    return temaList.map((item, index) => {
      item.index = index
      return item
    })
  }

  // 新增商品/物料
  const addMemberHandler = useCallback(async (temaList) => {
    const oldTemaList = addSchemaAction.getFieldValue('*(products)')

    const updateRow = updateRowIndex(oldTemaList.concat(temaList))

    addSchemaAction.setFieldValue('*(products)', updateRow)
  }, [])

  // 更新商品数据
  const updateProductList = useCallback(async (record) => {
    const index = record.index
    const temaList: any[] = await addSchemaAction.getFieldValue('*(products)')
    temaList.splice(index, 1, record)
    addSchemaAction.setFieldValue('*(products)', temaList.slice())
  }, [])

  // 删除
  const deleteRow = useCallback(async (record) => {
    const index = record.index
    const temaList: any[] = await addSchemaAction.getFieldValue('*(products)')
    temaList.splice(index, 1)
    addSchemaAction.setFieldValue('*(products)', updateRowIndex(temaList))
  }, [])

  // 物料/商品各种操作的事件
  const shopHandleChange = useMemo(() => {
    return {
      operation: deleteRow,
      id: updateProductList,
      skuId: updateProductList,
      name: updateProductList,
      category: updateProductList,
      brand: updateProductList,
      unit: updateProductList,
      demandQuantity: updateProductList,
      demandTime: updateProductList,
      demandPerson: updateProductList,
      attachment: updateProductList,
    }
  }, [])

  // 物料/商品操作变更
  const DeliverMaterialChange = (record, key) => {
    shopHandleChange[key]?.(record)
  }

  // 编辑的时候更新初始化数据
  const getUpdateDetail = useCallback(async () => {
    try {
      setFormLoading(true)
      const { data } = await getProductSampleDeliverBuyerDetail({ id: query.id }, { ctlType: 'none' })
      const result = {
        supplierMember: [
          {
            memberId: data?.vendorMemberId || '',
            roleId: data?.vendorRoleId || '',
            name: data?.vendorMemberName || '',
          },
        ],
        receiver: [
          {
            name: data?.receiver || '',
            phone: data?.phone || '',
            orgName: data?.receiveDepartment || '',
          },
        ],
        address: {
          name: data?.receiverName || '',
          phone: data?.receiverPhone || '',
          address: data?.address || '',
          fullAddress: data?.address || '',
          id: data?.receiverAddressId || '',
        },
        products: data?.products.map((item, index) => {
          const productItem = {
            ...item,
            skuId: String(item.skuId),
            index: index,
            demandTime: formatTimeString(item.demandTime, 'YYYY-MM-DD HH:mm'),
            disabled: !query.edit,
          }

          const attachment = []
          if (item?.attachment && Object.keys(item.attachment).length) {
            attachment.push(item.attachment)
          }

          Object.assign(productItem, {
            attachment,
          })

          if (!query.edit) {
            Object.assign(productItem, { readOnlyAll: true })
          } else if (productItem.source === 1) {
            Object.assign(productItem, {
              readOnlyList: {
                skuId: true,
                name: true,
                spec: true,
                category: true,
                brand: true,
              },
            })
          }

          return productItem
        }),
      }

      Object.assign(data, result)
      setInitFormValue(data)
      setFormLoading(false)
    } catch (error) {
      console.log('error===>', error)
    }
  }, [query])

  // 初始化需求人搜索栏
  const neederSearchEffects = ($, action) => {
    useStateFilterSearchLinkageEffect($, action, 'name', FORM_FILTER_PATH)
  }

  const searchNeeder = (values) => {
    neederRef.current.reload(values)
  }

  // 新增物料/商品信息
  const addShopHandle = useCallback(async () => {
    const productsList: any[] = await addSchemaAction.getFieldValue('*(products)')
    const item = {
      index: productsList.length,
      attachment: [],
      brand: '',
      category: '',
      demandPerson: '',
      demandQuantity: '',
      demandTime: moment().format('YYYY-MM-DD HH:mm'),
      skuId: '',
      name: '',
      operation: undefined,
      unit: undefined,
      disabled: false,
      readonly: false,
      bordered: true,
      source: 2,
    }
    if (roleType == 1) {
      Object.assign(item, { spec: '' })
    }
    productsList.push(item)
    addSchemaAction.setFieldValue('*(products)', productsList.slice())
  }, [roleType])

  useEffect(() => {
    setHeaderTitle(
      intl.formatMessage({
        id: 'commodity.deliverManagement.xinzengsongyangxuqiudan',
        defaultMessage: '新增送样需求单',
      }),
    )
    setDemandDateDisabledDay()
    if (query?.id) {
      getUpdateDetail()
      setHeaderTitle(
        intl.formatMessage({
          id: 'commodity.deliverManagement.bianjisongyangxuqiudan',
          defaultMessage: '编辑送样需求单',
        }),
      )
      if (!query.edit) {
        // 打开不可编辑
        setEditable(false)
        handleLeave(false)
        setHeaderTitle(
          intl.formatMessage({
            id: 'commodity.deliverManagement.zhakansongyangxuqiudan',
            defaultMessage: '查看送样需求单',
          }),
        )
      }
    }
  }, [query])

  useEffect(() => {
    if (parseInt((Number(formContext.formProcess || 0) * 100).toFixed(2)) && !hasEdit && editable) {
      handleLeave()
      setHasEdit(true)
    }
  }, [formContext.formProcess, handleLeave, hasEdit, editable])

  const useNiceFormEffect = useCallback(
    ($, ctx) => {
      const { setFieldValue } = ctx
      onFormMount$().subscribe(() => {
        setSchemaEnum('type', getProductSampleDeliverTypeDropItems)
        setSchemaEnum('emergencyLevel', getProductSampleDeliverEmergencyLevelDropItems)
        if (!query.id) {
          const { account, name, orgName } = authService.getAuth() as Record<string, any>
          setFieldValue('receiver', [
            {
              name: name || '',
              phone: getUserPhone(account),
              orgName: orgName || '',
            },
          ])
        }
      })

      onFieldValueChange$('*(receiver)').subscribe((state) => {
        const [data] = state.value || []
        if (data) {
          setFieldValue('phone', data.phone)
          setFieldValue('receiveDepartment', data.orgName)
        }
      })

      onFieldValueChange$('*(supplierMember)').subscribe((state) => {
        const [data] = state.value || []
        supplier.current = data ?? {}
      })
      // 注入表单完成进度
      formContext.useAttachmentChangeForContext(ctx)
    },
    [formContext, query],
  )

  return (
    <div>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={headerTitle}
          schema={initFormSchema}
          extraRight={
            editable
              ? [
                  <Button
                    key="1"
                    onClick={handleCheckForm}
                    loading={submitLoading}
                    type="primary"
                    icon={<SaveOutlined />}
                    disabled={submitBtnDisabled}
                  >
                    {intl.formatMessage({ id: 'commodity.deliverManagement.baocun', defaultMessage: '保存' })}
                  </Button>,
                ]
              : []
          }
        />
        <FormDetailWrapper>
          <NiceForm
            loading={formLoading}
            previewPlaceholder=" "
            value={initFormValue}
            actions={addSchemaAction}
            schema={initFormSchema}
            editable={editable}
            effects={useNiceFormEffect}
            components={{
              DrawerSearchTable,
              DeliverMaterialTable,
              FormilyUploadFiles,
              ReceiverAddress,
              Cascader,
              CustomInputSearch,
            }}
            expressionScope={{
              fetchSupplierList,
              fetchNeederList,
              addMemberHandler,
              DeliverMaterialChange,
              deliverColumns,
              showSelectModalBtn: editable,
              addHandle: addShopHandle,
              neederSearchEffects,
              getAddressListApi,
              searchNeeder,
              neederRef,
              tableFromRef,
              roleType,
              supplier,
              selectUnit,
            }}
            onSubmit={debounce(handleSubmit, 500)}
          />
        </FormDetailWrapper>
      </FormDetailContext.Provider>
    </div>
  )
}

export default Index
