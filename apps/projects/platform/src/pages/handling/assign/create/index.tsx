import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Cascader, message, Space, Table, Modal } from 'antd'
import { LinkOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import NiceForm from '@/components/NiceForm'
import creataSchema from './schema'
import { createFormActions, FormEffectHooks, registerVirtualBox } from '@apps/formily'
import MellowCard from '@/components/MellowCard'
import { PageHeaderWrapper } from '@apps/components'
import { ArrayTable } from '@apps/formily'
import ReadOnly from './components/ReadOnly'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import { CloudUploadOutlined } from '@ant-design/icons'
import TableModal from '@/pages/customerAbility/components/TableModal'
import useModal from '@/pages/customerAbility/memberEvaluate/hooks/useModal'
import { enterprisesColumn } from './common/columns/enterprisesColumn'
import { enterprisesSchema } from './common/schemas/enterprisesSchema'
import { productSchema } from './common/schemas/productSchema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  getMemberManageLowerPageBynamerole,
  GetMemberManageLowerPageBynameroleResponse,
  getMemberManageRoleSubList,
  GetMemberManageRoleSubListResponse,
} from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { authService } from '@apps/services'
import { ColumnsType } from 'antd/es/table'
import {
  getProductCommodityCommonGetCommodityListByBuyer,
  GetProductCommodityCommonGetCommodityListByBuyerResponseDetail,
  getProductCommodityGetCommodityAttributeByCommoditySkuId,
  getProductCustomerGetCustomerCategoryTree,
  getProductSelectGetSelectBrand,
} from '@apps/apis'
import ProductDrawer, { productSubmitType, productInfo } from './components/ProductDrawer'
import { priceFormat } from '@/utils/numberFomat'
import { orderColumns, orderProductColumns } from './common/columns/orderColumn'
import { orderSchema } from './common/schemas/orderSchema'
import {
  EnterpriceType,
  FileType,
  SubmitDataType,
  RestDataType,
  OtherAskType,
  SelectedProcessProductType,
} from './types'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import moment from 'moment'
import useFormatData from './common/hooks/useFormatData'
import { GetOrderCommonEnhancePageRequest, GetOrderCommonEnhancePageResponseDetail } from '@apps/apis'
import { getOrderCommonEnhancePage } from '@apps/apis'
import { getLogisticsReceiverAddressPage } from '@apps/apis'
import { postEnhanceSupplierToBeAddAdd, postEnhanceSupplierToBeAddUpdate } from '@apps/apis'
import request from '@/utils/request'

const { confirm } = Modal
const intl = getIntl()

const formActions = createFormActions()
const { onFieldInit$, onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks

registerVirtualBox('MellowCardBox', (_props) => {
  const { children, props: outerProps } = _props
  const props = outerProps['x-component-props'] || {}
  return <MellowCard {...props}>{children}</MellowCard>
})

type OrderProductType = GetOrderCommonEnhancePageResponseDetail['products'][0] & {
  orderId: number
  orderNo: string
}

/** @tofix 临时的，因为后端不返回只能值么临时搞着 */
const MALL_NAME = {
  '1': intl.formatMessage({ id: 'handling.qiyeshangcheng' }),
  '2': intl.formatMessage({ id: 'handling.qiyeshangcheng' }),
  '3': intl.formatMessage({ id: 'handling.qudaoshangcheng' }),
  '4': intl.formatMessage({ id: 'handling.qudaoziyoushangcheng' }),
}

/** 来源 加工订单或者是加工商品 */
const ORDER_SOURCE = 1

const Create = () => {
  const authInfo = authService.getAuth()
  const anchorColumn = useMemo(() => {
    return [
      {
        label: intl.formatMessage({ id: 'handling.assign.add.basicInfo' }),
        key: 'basicInfo',
      },
      {
        label: intl.formatMessage({ id: 'handling.assign.add.noticeDetail' }),
        key: 'detail',
      },
      {
        label: intl.formatMessage({ id: 'handling.assign.add.otherInfo' }),
        key: 'other',
      },
      {
        label: intl.formatMessage({ id: 'handling.assign.add.files' }),
        key: 'files',
      },
    ]
  }, [])
  const { isEdit, cacheInitialValue } = useFormatData()

  // console.log(initialValue)
  /**  ---- 加工企业 ----- */
  const { visible, toggle } = useModal()
  const [enterprice, setEnterprise] = useState<EnterpriceType[]>([])

  /** ---- 加工商品 ---- */
  const { visible: processProductVisible, toggle: processProductToggle } = useModal()
  const [processProduct, setProcessProduct] = useState<SelectedProcessProductType[]>([])
  /** ---- 加工商品 ---- */

  /** ---- 编辑商品 ---- */
  const { visible: productDrawerVisible, toggle: productDrawerToggle } = useModal()
  const [currentProduct, setCurrentProduct] = useState<productInfo | null>(null)
  /** ---- 编辑商品end ---- */

  /** ---- 加工订单 ------- */
  const { visible: processOrderVisible, toggle: processOrderToggle } = useModal()
  const [orderProductSelectRowKeys, setOrderProductSelectRowKeys] = useState<string[]>([])
  const [orderProductselectRowRecord, setOrderProductSelectRowRecord] = useState<{ [key: string]: any }[]>([])
  /** 勾选的加工订单数据 */
  const [processOrder, setProcessOrder] = useState<GetOrderCommonEnhancePageResponseDetail[]>([])
  /** ---- 加工订单end ------- */
  /** 订单数据 */
  const [fetchedOrderData, setFetchOrderData] = useState<GetOrderCommonEnhancePageResponseDetail[]>([])
  const [productActionType, setProductActionType] = useState<'view' | 'edit'>('view')
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!isEdit) {
      return
    }
    setEnterprise([
      {
        name: cacheInitialValue?.processName,
        memberId: cacheInitialValue?.processMemberId,
        roleId: cacheInitialValue?.processRoleId,
      },
    ])
    const isOrder = cacheInitialValue.source === ORDER_SOURCE
    if (!isOrder) {
      const productList = cacheInitialValue?.productList?.map((_item) => {
        return {
          id: _item.skuid,
          skuid: _item.skuid,
          commodityId: _item.commodityId,
          mainPic: _item.mainPic,
          name: _item.name,
          category: _item.category,
          brand: _item.brand,
          unitName: _item.unitName,
        }
      })
      setProcessProduct(productList)
    } else {
      const initialProcessOrder =
        cacheInitialValue.orderList?.map((_item) => ({ id: _item.orderId, products: _item })) || []
      setProcessOrder(initialProcessOrder as unknown as GetOrderCommonEnhancePageResponseDetail[])
      setOrderProductSelectRowRecord(
        cacheInitialValue.orderList?.map((_item) => ({ ..._item, productId: _item.commodityId })) || [],
      )
      setOrderProductSelectRowKeys(cacheInitialValue.orderList?.map((_item) => `${_item.orderId}_${_item.id}`) || [])
    }
  }, [isEdit, cacheInitialValue])

  /**
   * 获取加工企业
   */
  const handleFetchEnterprises = useCallback(
    async (params: { name: string; roleId: string; current: string; pageSize: string }) => {
      const { data, code } = await getMemberManageLowerPageBynamerole(params)
      if (code === 1000) {
        return data
      }
      return {
        totalCount: 0,
        data: [],
      }
    },
    [],
  )

  const triggerOk = (
    selectRowKeys: string[] | number[],
    selectRowRecord: GetMemberManageLowerPageBynameroleResponse['data'],
  ) => {
    if (selectRowRecord.length > 0) {
      const target = selectRowRecord[0]
      formActions.setFieldValue('basicInfo.layout.processName', target.name)
      formActions.setFieldValue('basicInfo.layout.processMemberId', target.memberId)
      formActions.setFieldValue('basicInfo.layout.processRoleId', target.roleId)
      setEnterprise(selectRowRecord)
    }

    toggle(false)
  }

  const fetchRoleOptions = useCallback(async () => {
    const { data, code } = await getMemberManageRoleSubList()
    if (code === 1000) {
      return data.map((_item: GetMemberManageRoleSubListResponse[0]) => ({
        label: _item.roleName,
        value: _item.roleId,
      }))
    }
    return []
  }, [])
  /** ----------- 加工企业结束 --------- */

  const onClickAddProcess = () => {
    const source = formActions.getFieldValue('source')
    if (source === ORDER_SOURCE) {
      processOrderToggle(true)
      return
    }
    processProductToggle(true)
  }

  /** -------------- 加工商品相关 --------------- */
  const renderAddProduct = () => (
    <div
      onClick={onClickAddProcess}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E3E4E5',
        cursor: 'pointer',
      }}
    >
      <PlusOutlined /> {intl.formatMessage({ id: 'common.button.add' })}
    </div>
  )

  /**
   * @tofix
   * 根据当前用户角色查询商城 配合memberType, 我也不明白为什么要这么操作 ，
   * 商城类型:1-企业商城,2-积分商城,3-渠道商城,4-渠道自有商城,5-渠道积分商城
   *  */
  const ENTERPRISE_MALL = useMemo(() => ({ '1': 1, '2': 1, '3': 3, '4': 4 }), [])

  const productColumn: ColumnsType<any> = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'handling.assign.add.product.id' }),
        dataIndex: 'commodityId',
      },
      {
        title: intl.formatMessage({ id: 'handling.assign.add.product.name' }),
        dataIndex: 'name',
        width: 350,
      },
      {
        title: intl.formatMessage({ id: 'handling.assign.add.product.mall' }),
        dataIndex: 'mall',
        render: (text, record) => {
          /** 后端不返回，要前段判断， 就离谱 */
          return MALL_NAME[authInfo.memberType]
        },
      },
      {
        title: intl.formatMessage({ id: 'handling.assign.add.product.category' }),
        dataIndex: 'customerCategoryName',
      },
      {
        title: intl.formatMessage({ id: 'handling.assign.add.product.brandName' }),
        dataIndex: 'brandName',
      },
    ],
    [authInfo],
  )

  /**
   * 1. 企业会员+个人会员，角色类型：服务提供者，数据来源于商品管理，取已上架至商城环境为WEB且商城类型为企业商城的商品
   * 2. 渠道企业会员+渠道个人会员，角色类型：服务提供者，数据来源于渠道商品管理，取已上架至商城环境为WEB且商城类型为渠道商城或渠道自有商城的商品。
   */
  const handleFetchProductList = useCallback(async (params: any) => {
    const { current, pageSize, brandId, ...rest } = params
    const customerCategoryId =
      params.customerCategoryId && Array.isArray(params.customerCategoryId) && params.customerCategoryId.pop()
    const postData = {
      ...rest,
      /** 	商城类型:1-企业商城,2-积分商城,3-渠道商城,4-渠道自有商城,5-渠道积分商城 */
      shopType: ENTERPRISE_MALL[authInfo.memberType],
      /** 商城环境:1-Web,2-H5,3-小程序,4-App */
      environment: 1,
      memberId: authInfo.memberId,
      customerCategoryId: customerCategoryId,
      brandId: brandId,
      current: current,
      pageSize: pageSize,
    }
    const { data, code } = await getProductCommodityCommonGetCommodityListByBuyer(postData as any)
    if (code === 1000) {
      return data
    }
    return {
      totalCount: 0,
      data: [],
    }
  }, [])

  const fetchBrand = useCallback(async () => {
    const { data, code } = await getProductSelectGetSelectBrand()
    if (code === 1000) {
      return data.map((_row) => ({
        label: _row.name,
        value: _row.id,
      }))
    }
    return []
  }, [])

  const fetchCategory = useCallback(async (actions) => {
    const { data, code } = await getProductCustomerGetCustomerCategoryTree()
    if (code === 1000) {
      actions.setFieldState('customerCategoryId', (state) => {
        state.props['x-component-props']['options'] = data
      })
    }
  }, [])

  const handleBeforeProductChecked = useCallback(
    async (
      record: GetProductCommodityCommonGetCommodityListByBuyerResponseDetail,
      selected: boolean,
      list: GetProductCommodityCommonGetCommodityListByBuyerResponseDetail[],
    ) => {
      if (selected) {
        const postData = list.map((item) => {
          return {
            /** * 这里指的是skuid， 而接口getProductCommodityCommonGetCommodityListByBuyer 的主键id 就是skuid， 不是（commodityId）*/
            productId: item.id,
            memberId: item.memberId || authInfo.memberId,
            memberRoleId: item.memberRoleId || authInfo.memberRoleId,
            shopId: ENTERPRISE_MALL[authInfo.memberType],
            /** 1.订单交易流程2.售后换货流程3.售后退货流程4.售后维修流程, @todo 5是后端说的，具体不知道代表什么意思？ */
            type: 5,
          }
        })
        const { flag } = await checkProcessEnum(postData)
        return flag
      }
      return true
    },
    [],
  )

  /** @review 总感觉这个接口有大问题，能力中心没办法拿到shopId，不知道这个shopId 的意义在哪里 */
  const checkProcessEnum = async (
    list: { productId: number; memberId: number; memberRoleId: number; shopId: number; type: number }[],
  ) => {
    return {
      flag: true,
      processEnum: 26,
    }
    // /** @tofix 曲线救国，v1没了，v2好像也没了  */
    // const { code, data, ...rest } = await request('/order/getProcessEnum', {data: {list: list},  method: 'POST', ctlType: 'message'})
    // // const {code, data, ...rest} = await  postOrderGetProcessEnum({list: list}, {ctlType: 'none'});
    // if (code !== 1000) {
    //   message.error(rest.message);
    //   return {
    //     flag: false,
    //   }
    // }
    // /** 文档是大写， 但返回是小写。。就离谱 */
    // const hasNoSetProcessEnum = data.some((_item) => (_item as any).processEnum === 0);
    // if(hasNoSetProcessEnum) {
    //   message.error("当前所选商品没有配置工作流");
    //   return {
    //     flag: false,
    //   }
    // }
    // const differentProcessEnumList = new Set(
    //   data.map((_item) => (_item as any).processEnum)
    // )
    // if (differentProcessEnumList.size > 1) {
    //   message.error("当前所选商品配置的工作流不一致");
    //   return {
    //     flag: false
    //   }
    // }

    // return {
    //   flag: true,
    //   processEnum: (data[0] as any).processEnum
    // }
  }

  /**
   * 确认勾选加工商品
   */
  const tiggerProcessProductOk = (
    selectRowKeys: string[] | number[],
    selectRowRecord: GetProductCommodityCommonGetCommodityListByBuyerResponseDetail[],
  ) => {
    const productList = formActions.getFieldValue('detail.layout1.productList')
    const uniqueIdList = new Set(productList.map((_item) => _item.skuid))

    /** 获取新增数列 */
    const newAddList = selectRowRecord
      .filter((_item) => !uniqueIdList.has(_item.id))
      .map((_item) => {
        return {
          skuid: _item.id,
          commodityId: _item.commodityId,
          mainPic: _item.mainPic,
          name: _item.name,
          category: _item.customerCategoryName,
          brand: _item.brandName,
          unitName: _item.unitName,
        }
      })

    const selectRowId = new Set(selectRowRecord.map((_item) => _item.id))
    // 过滤减少项
    const hasRemoveListRes = []
    productList.forEach((_item) => {
      if (selectRowId.has(_item.skuid)) {
        hasRemoveListRes.push(_item)
      }
    })

    const newDataSource = hasRemoveListRes.concat(newAddList)

    formActions.setFieldValue('detail.layout1.productList', newDataSource)

    setProcessProduct(newDataSource.map((_item) => ({ ..._item, id: _item.skuid })))
    processProductToggle(false)
  }

  const renderProductListTableRemove = (index: number) => (
    <Space>
      <a onClick={() => handleEditOrView(index, 'edit')}>{intl.formatMessage({ id: 'common.button.edit' })}</a>
      <a onClick={() => handleRemove(index)}>{intl.formatMessage({ id: 'common.button.delete' })}</a>
      <a onClick={() => handleEditOrView(index, 'view')}>{intl.formatMessage({ id: 'common.button.view.details' })}</a>
    </Space>
  )

  const handleRemove = (index: number) => {
    const source = formActions.getFieldValue('source')
    const isOrderSource = source === ORDER_SOURCE
    const productList = isOrderSource
      ? formActions.getFieldValue('detail.layout1.orderList')
      : formActions.getFieldValue('detail.layout1.productList')
    const target = productList[index]
    const newList = productList.filter((_item, _itemIndex) => _itemIndex !== index)

    if (isOrderSource) {
      const key = `${target.orderId}_${target.id}`
      setOrderProductSelectRowKeys((prev) => prev.filter((_row) => _row !== key))
      setOrderProductSelectRowRecord((prev) => prev.filter((_item) => `${_item.orderId}_${_item.id}` !== key))
      formActions.setFieldValue('detail.layout1.orderList', newList)
    } else {
      setProcessProduct((prev) => prev.filter((_item) => _item.id !== target.skuid))
      formActions.setFieldValue('detail.layout1.productList', newList)
    }
  }

  const handleEditOrView = async (index: number, type: 'edit' | 'view') => {
    const source = formActions.getFieldValue('source')
    const productList =
      source === ORDER_SOURCE
        ? formActions.getFieldValue('detail.layout1.orderList')
        : formActions.getFieldValue('detail.layout1.productList')
    // 这里理论不需要判断target 存不存在
    let target: productInfo = productList[index]
    console.log(target)
    /** 获取商品属性， @unknown 不知道为什么后台不一起返回。。。 */
    const { data, code } = await getProductCommodityGetCommodityAttributeByCommoditySkuId({
      commoditySkuId: target.skuid.toString(),
    })
    const {
      skuid,
      commodityId,
      category,
      brand,
      name,
      unitName,
      isHasTaxAndTaxRate,
      isHasTax,
      taxRate,
      processNum,
      processUnitPrice,
      enclosure,
    } = target as productInfo

    if (code === 1000) {
      const other = source === ORDER_SOURCE ? { orderId: target.orderId, orderNo: target.orderNo, id: target.id } : {}
      target = {
        ...other,
        skuid,
        commodityId,
        category,
        brand,
        name,
        unitName,
        isHasTaxAndTaxRate,
        isHasTax,
        taxRate,
        processNum,
        processUnitPrice,
        enclosure,
        /**
         * 商品属性
         */
        productProps: data.map((_item) => {
          return {
            name: _item.customerAttribute.name,
            value: _item.customerAttributeValueList?.[0].value || '',
          }
        }),
      }
    }
    setCurrentProduct(target)
    productDrawerToggle(true)
    setProductActionType(type)
  }

  const handleChangeProduct = (values: productSubmitType) => {
    if (productActionType === 'view') {
      productDrawerToggle(false)
      return
    }
    const source = formActions.getFieldValue('source')
    const isOrderSource = source === ORDER_SOURCE
    const productList = isOrderSource
      ? formActions.getFieldValue('detail.layout1.orderList')
      : formActions.getFieldValue('detail.layout1.productList')
    // const productList = formActions.getFieldValue('detail.layout1.productList');
    const { isHasTax, taxRate = 0, processNum, processUnitPrice, enclosure, productProps } = values
    let shouldShowConfirmMsg = false

    const newData = productList.map((_item) => {
      /** 加工商品的时候用sku, 如果是加工订单商品的话用orderid */
      if ((!isOrderSource && _item.skuid === values.skuid) || (isOrderSource && _item.id === values.id)) {
        const other = isOrderSource ? { surplusAndProcessNum: `${_item.surplusProcessNum}/${processNum}` } : {}
        shouldShowConfirmMsg = _item.surplusProcessNum < processNum
        return {
          ..._item,
          ...other,
          isHasTax,
          taxRate,
          isHasTaxAndTaxRate: `${
            isHasTax ? intl.formatMessage({ id: 'handling.shi' }) : intl.formatMessage({ id: 'handling.fou' })
          }/${taxRate}%`,
          processUnitPrice,
          processNum: processNum,
          processTotalPrice: `${priceFormat(+processUnitPrice * +processNum)}`,
          enclosure:
            enclosure?.map((_row) => ({
              name: _row.name,
              url: _row.url,
            })) || [],
          productProps: productProps,
          // ...values,
        }
      }
      return _item
    })
    if (shouldShowConfirmMsg) {
      confirm({
        title: intl.formatMessage({ id: 'handling.jiagongshangpindayushengyu' }),
        content: intl.formatMessage({ id: 'handling.jiagongshangpindayushengyu1' }),
        onOk() {
          formActions.setFieldValue(
            source === ORDER_SOURCE ? 'detail.layout1.orderList' : 'detail.layout1.productList',
            newData,
          )
          productDrawerToggle(false)
        },
      })
      return
    }
    formActions.setFieldValue(
      source === ORDER_SOURCE ? 'detail.layout1.orderList' : 'detail.layout1.productList',
      newData,
    )
    productDrawerToggle(false)
  }

  /** -------------- 加工商品相关结束 --------------- */

  /** ------- 加工订单相关 -------*/
  const onSelectChange = async (record: OrderProductType, selected: boolean, selectedRows) => {
    console.log(record, 'fetchedOrderData', fetchedOrderData)
    // 父级order 存储信息
    const currentOrderData = fetchedOrderData?.find((_item) => _item.orderId === record.orderId)
    console.log(
      'orderProductselectRowRecord',
      orderProductselectRowRecord,
      'orderProductSelectRowKeys',
      orderProductSelectRowKeys,
      'setProcessOrder',
      processOrder,
    )
    const key = `${record.orderId}_${record.orderProductId}`
    if (!selected) {
      setOrderProductSelectRowKeys((prev) => prev.filter((_row) => _row !== key))
      setOrderProductSelectRowRecord((prev) =>
        prev.filter((_item) => `${_item.orderId}_${_item.orderProductId}` !== key),
      )
      setProcessOrder((prev) => prev.filter((_item) => _item.orderId !== record.orderId))
    } else {
      const children = currentOrderData.products
      const tempData = orderProductselectRowRecord.concat(record)
      const keysList = tempData.filter((_item) => _item.orderId === record.orderId)
      /** @toRemove 这里逻辑重复，且要删除，让后端添加时自己判断 */

      const formatData = tempData.map((_item) => {
        return {
          productId: _item.productId,
          memberId: _item.memberId || authInfo.memberId,
          memberRoleId: _item.memberRoleId || authInfo.memberRoleId,
          shopId: ENTERPRISE_MALL[authInfo.memberType],
          /** 1.订单交易流程2.售后换货流程3.售后退货流程4.售后维修流程, @todo 5是后端说的，具体不知道代表什么意思？ */
          type: 5,
        }
      })
      const { flag } = await checkProcessEnum(formatData)
      if (flag) {
        setOrderProductSelectRowKeys((prev) => prev.concat(key))
        setOrderProductSelectRowRecord(tempData)
        /** 父子联动， 这里写的不是很好，但没想到好的办法 */
        if (children.length === keysList.length) {
          setProcessOrder((prev) => prev.concat(currentOrderData))
        }
      }
    }
  }

  const orderProductRowSelection = {
    // type: 'checkbox',
    selectedRowKeys: orderProductSelectRowKeys,
    onSelect: onSelectChange,
    getCheckboxProps: (record: GetOrderCommonEnhancePageResponseDetail['products'][0]) => {
      return {
        disabled: +record.quantity - +record.enhanceCount <= 0, // Column configuration not to be checked
      }
    },
    onSelectAll: async (
      selected: boolean,
      selectedRows: GetOrderCommonEnhancePageResponseDetail['products'],
      changeRows: any[],
    ) => {
      const filterEmptyRows = changeRows.filter(Boolean)
      const keys = filterEmptyRows.map((_item) => `${_item.orderId}_${_item.orderProductId}`)
      const orderId = changeRows[0].orderId
      const currentOrderData = fetchedOrderData?.find((_item) => _item.orderId === orderId)

      if (selected) {
        const addTempRow = orderProductselectRowRecord.concat(filterEmptyRows)
        const addTempRowKeys = addTempRow.map((_item) => `${_item.orderId}_${_item.orderProductId}`)

        /** @toRemove 这里逻辑重复，且要删除，让后端添加时自己判断 */
        const formatData = addTempRow.map((_item) => {
          return {
            productId: _item.productId,
            memberId: _item.memberId || authInfo.memberId,
            memberRoleId: _item.memberRoleId || authInfo.memberRoleId,
            shopId: ENTERPRISE_MALL[authInfo.memberType],
            /** 1.订单交易流程2.售后换货流程3.售后退货流程4.售后维修流程, @todo 5是后端说的，具体不知道代表什么意思？ */
            type: 5,
          }
        })

        const { flag } = await checkProcessEnum(formatData)
        if (flag) {
          setOrderProductSelectRowKeys(addTempRowKeys)
          setOrderProductSelectRowRecord(addTempRow)
          const keysLength = addTempRowKeys.filter((_item) => _item.includes(orderId))

          if (currentOrderData.products.length === keysLength.length) {
            setProcessOrder((prev) => prev.concat(currentOrderData))
          }
          return
        }
      } else {
        const removeKeys = orderProductSelectRowKeys.filter((_item) => !keys.includes(_item))
        // const removeRecord =
        setOrderProductSelectRowKeys(removeKeys)
        setOrderProductSelectRowRecord((prev) =>
          prev.filter((_item) => !keys.includes(`${_item.orderId}_${_item.orderProductId}`)),
        )
        if (currentOrderData.products.length !== removeKeys.length) {
          setProcessOrder((prev) => prev.filter((_item) => _item.orderId !== currentOrderData.orderId))
        }
      }
    },
    // onSelectAll: onSelectAll
  }

  const handleFetchOrderList = useCallback(async (params: GetOrderCommonEnhancePageRequest) => {
    const { startCreateTime, endCreateTime, ...rest } = params as any
    let postData = { ...rest, orderType: 3 }
    if (startCreateTime) {
      const format = 'YYYY-MM-DD'
      postData = {
        ...postData,
        startDate: startCreateTime,
        endDate: endCreateTime,
      }
    }

    const { data, code } = await getOrderCommonEnhancePage(postData as GetOrderCommonEnhancePageRequest)
    if (code === 1000) {
      setFetchOrderData(data.data)
      return data
    }
    return {
      totalCount: 0,
      data: [],
    }
  }, [])

  const handleBeforeOrderChecked = async (
    record: GetOrderCommonEnhancePageResponseDetail,
    checked: boolean,
    selectedRows: GetOrderCommonEnhancePageResponseDetail[],
  ) => {
    const { products, orderNo, orderId } = record
    const keys = products.map((_item) => `${orderId}_${_item.orderProductId}`)
    if (checked) {
      const uniqueKeys = Array.from(new Set(orderProductSelectRowKeys.concat(keys)))
      const uniqueList = orderProductselectRowRecord.concat(
        products.map((_item) => {
          return {
            orderNo: orderNo,
            orderId: record.orderId,
            ..._item,
          }
        }),
      )
      console.log(uniqueList)
      const formatData = uniqueList.map((_item) => {
        return {
          productId: _item.productId,
          memberId: _item.memberId || authInfo.memberId,
          memberRoleId: _item.memberRoleId || authInfo.memberRoleId,
          shopId: ENTERPRISE_MALL[authInfo.memberType],
          /** 1.订单交易流程2.售后换货流程3.售后退货流程4.售后维修流程, @todo 5是后端说的，具体不知道代表什么意思？ */
          type: 5,
        }
      })
      const { flag } = await checkProcessEnum(formatData)
      if (flag) {
        setOrderProductSelectRowKeys(uniqueKeys)
        setOrderProductSelectRowRecord(uniqueList)
        setProcessOrder((prev) => prev.concat(record))
        return true
      }
      return false
    } else {
      setOrderProductSelectRowKeys((prev) => prev.filter((_row) => !keys.includes(_row)))
      setOrderProductSelectRowRecord((prev) =>
        prev.filter((_row) => !keys.includes(`${_row.orderId}_${_row.orderProductId}`)),
      )
      setProcessOrder((prev) => prev.filter((_item) => _item.orderId !== orderId))
    }
    return true
  }
  const tiggerProcessOrderProductOk = () => {
    // const productOrderList = orderProductselectRowRecord.
    const orderList = formActions.getFieldValue('detail.layout1.orderList')
    const uniqueIdList = new Set(orderList.map((_item) => `${_item.orderId}_${_item.orderProductId}`))
    /** 获取新增数列 */
    const newAddList = orderProductselectRowRecord
      .filter((_item) => !uniqueIdList.has(`${_item.orderId}_${_item.orderProductId}`))
      .map((_item) => {
        const surplusProcessNum = +_item.quantity - +_item.enhanceCount
        return {
          orderNo: _item.orderNo,
          orderId: _item.orderId,
          /** 主键id */
          id: _item.orderProductId,
          skuid: _item.orderProductId,
          commodityId: _item.orderProductId,
          mainPic: _item.imgUrl,
          name: _item.name,
          category: _item.category,
          brand: _item.brand,
          unitName: _item.unit,
          purchaseCount: +_item.quantity,
          purchaseCountAndUnit: `${_item.quantity}/${_item.unit}`,
          surplusProcessNum: surplusProcessNum,
          surplusAndProcessNum: `${surplusProcessNum} / ${_item.enhanceCount}`,
        }
      })

    const selectRowId = new Set(orderProductselectRowRecord.map((_item) => `${_item.orderId}_${_item.id}`))
    // 过滤减少项
    const hasRemoveListRes = []
    orderList.forEach((_item) => {
      if (selectRowId.has(`${_item.orderId}_${_item.id}`)) {
        hasRemoveListRes.push(_item)
      }
    })

    const newDataSource = hasRemoveListRes.concat(newAddList)
    formActions.setFieldValue('detail.layout1.orderList', newDataSource)
    processOrderToggle(false)
  }

  /** ------- 加工订单相关end------- */

  const fetchReceiveAddress = useCallback(async () => {
    const { data, code } = await getLogisticsReceiverAddressPage({ current: '1', pageSize: '30' })
    if (code === 1000) {
      return data.data.map((_item) => ({
        label: `${_item.fullAddress} / ${_item.receiverName} / ${_item.phone}`,
        value: _item.id,
        name: _item.receiverName,
        address: _item.fullAddress,
        phone: _item.phone,
      }))
    }
    return []
  }, [])

  const onSubmit = async (value: SubmitDataType) => {
    setSubmitLoading(true)
    const {
      receivefullAddress,
      source,
      source1,
      deliveryDate,
      deliveryType,
      enclosure,
      deliveryDesc,
      payDesc,
      taxDesc,
      materialDesc,
      packingDesc,
      otherDesc,
      orderList,
      productList,
      receiveAddress,
      receiveUserName,
      receiveUserTel,
      receiverAddressId,
      ...rest
    } = value
    console.log(rest)
    const formatDeliveryDate = moment(deliveryDate, 'YYYY-MM-DD').valueOf()

    const orderListFormated = orderList?.map((_item) => {
      return {
        orderId: _item.orderId,
        orderNo: _item.orderNo,
        orderDetailId: _item.id,
        productId: _item.commodityId,
        purchaseCount: _item.purchaseCount,
        surplusProcessNum: _item.surplusProcessNum,
        productName: _item.name,
        category: _item.category,
        brand: _item.brand,
        unit: _item.unitName,
        processNum: +_item.processNum,
        processPrice: +_item.processUnitPrice,
        processTotalPrice: +_item.processNum * +_item.processUnitPrice,
        deliveryDate: formatDeliveryDate,
        isHasTax: _item.isHasTax,
        taxRate: _item.taxRate,
        property: {
          specs: _item.productProps || [],
          annex: _item.enclosure?.map((_row) => ({ name: _row.name, value: _row.url })) || [],
        },
      }
    })
    const productListFormated = productList?.map((_item) => {
      return {
        /** 采购数量， 加工商品不需要，默认给0 */
        purchaseCount: 0,
        /** 剩余加工数量， 加工商品不需要 */
        surplusProcessNum: 0,
        productId: _item.skuid,
        productName: _item.name,
        brand: _item.brand,
        category: _item.category,
        unit: _item.unitName,
        processNum: +_item.processNum,
        processPrice: +_item.processUnitPrice,
        processTotalPrice: +_item.processNum * +_item.processUnitPrice,
        deliveryDate: formatDeliveryDate,
        isHasTax: _item.isHasTax,
        taxRate: _item.taxRate,
        property: {
          specs: _item.productProps || [],
          annex: (_item.enclosure && _item.enclosure.map((item) => ({ name: item.name, value: item.url }))) || [],
        },
      }
    })

    const dataList = source === 1 ? orderListFormated : productListFormated
    const formatProcessEnumList = dataList.map((_record) => ({
      productId: _record.productId,
      memberId: authInfo.memberId,
      memberRoleId: authInfo.memberRoleId,
      shopId: ENTERPRISE_MALL[authInfo.memberType],
      /** 1.订单交易流程2.售后换货流程3.售后退货流程4.售后维修流程, @todo 5是后端说的，具体不知道代表什么意思？ */
      type: 5,
    }))
    const processEnumRes = await checkProcessEnum(formatProcessEnumList)
    if (!processEnumRes.flag) {
      return
    }

    let restData: RestDataType = {} as RestDataType
    if (deliveryType === 1) {
      restData = {
        // ...rest,
        receiveAddress,
        receiveUserName,
        receiveUserTel,
        receiverAddressId,
      }
    }

    const postData = {
      deliveryDate: formatDeliveryDate,
      otherAsk: {
        annex: enclosure?.map((item) => ({ name: item.name, value: item.url })) || [],
        explain: [
          { name: intl.formatMessage({ id: 'handling.jiaofushuoming' }), value: deliveryDesc },
          { name: intl.formatMessage({ id: 'handling.fukuanshuoming' }), value: payDesc },
          { name: intl.formatMessage({ id: 'handling.shuifeishuoming' }), value: taxDesc },
          { name: intl.formatMessage({ id: 'handling.wuzishuoming' }), value: materialDesc },
          { name: intl.formatMessage({ id: 'handling.baozhuangshuoming' }), value: packingDesc },
          { name: intl.formatMessage({ id: 'handling.qitashuoming' }), value: otherDesc },
        ],
      },
      details: source === 1 ? orderListFormated : productListFormated,
      deliveryType,
      source,
      ...restData,
      ...rest,
      outerTaskType: +processEnumRes.processEnum,
    }
    const service = isEdit ? postEnhanceSupplierToBeAddUpdate : postEnhanceSupplierToBeAddAdd
    const withId = isEdit ? { id: cacheInitialValue.id, ...postData } : postData
    const { data, code } = await service(withId as any)
    setSubmitLoading(false)
    if (code === 1000) {
      history.goBack()
    }
  }

  return (
    <div>
      <PageHeaderWrapper
        title={
          isEdit
            ? intl.formatMessage({ id: 'handling.assign.edit.notice' })
            : intl.formatMessage({ id: 'handling.assign.add.notice' })
        }
        items={anchorColumn}
        extra={
          <Button icon={<SaveOutlined />} type="primary" onClick={() => formActions.submit()} loading={submitLoading}>
            {intl.formatMessage({ id: 'handling.submit' })}
          </Button>
        }
      >
        <NiceForm
          onSubmit={onSubmit}
          value={cacheInitialValue}
          effects={($, actions) => {
            useAsyncSelect('receivefullAddress', fetchReceiveAddress)
            onFieldInputChange$(`*(source,source1)`).subscribe((state) => {
              const reverseName = state.name === 'source' ? 'source1' : 'source'
              formActions.setFieldValue(reverseName, state.value)
            })
            onFieldValueChange$('receivefullAddress').subscribe((state) => {
              if (state.visible) {
                const options = state.originAsyncData
                const target = options.filter((item) => item.value == state.value)[0]
                if (target) {
                  formActions.setFieldValue('receiveAddress', target.address)
                  formActions.setFieldValue('receiveUserName', target.name.trim())
                  formActions.setFieldValue('receiveUserTel', target.phone.trim())
                  formActions.setFieldValue('receiverAddressId', target.value)
                }
              }
            })
          }}
          actions={formActions}
          schema={creataSchema}
          expressionScope={{
            uploadChildren: (
              <div>
                <Button icon={<CloudUploadOutlined />}>
                  {intl.formatMessage({ id: 'handling.assign.add.upload' })}
                </Button>
                <p style={{ marginTop: '16px' }}>{intl.formatMessage({ id: 'handling.assign.add.upload.tips' })}</p>
              </div>
            ),
            connetEnterprise: (
              <div onClick={() => toggle(true)}>
                <LinkOutlined />
                <span style={{ marginLeft: 4 }}>{intl.formatMessage({ id: 'handling.assign.add.select' })}</span>
              </div>
            ),
            renderProductListTableRemove: renderProductListTableRemove,
          }}
          components={{
            ArrayTable,
            FormilyUploadFiles,
            renderAddProduct,
            ReadOnly,
          }}
        ></NiceForm>
      </PageHeaderWrapper>
      <TableModal
        width={920}
        visible={visible}
        onClose={() => toggle(false)}
        title={intl.formatMessage({ id: 'handling.assign.add.selectEnterprise' })}
        columns={enterprisesColumn}
        schema={enterprisesSchema}
        onOk={triggerOk}
        fetchData={handleFetchEnterprises}
        tableProps={{
          rowKey: (record) => `${record.memberId}_${record.roleId}`,
        }}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
          useAsyncSelect('roleId', fetchRoleOptions)
        }}
        mode={'radio'}
        value={enterprice}
      />
      <TableModal
        width={920}
        visible={processProductVisible}
        onClose={() => processProductToggle(false)}
        title={intl.formatMessage({ id: 'handling.assign.add.select.process.product' })}
        columns={productColumn}
        schema={productSchema}
        onOk={tiggerProcessProductOk}
        fetchData={handleFetchProductList}
        tableProps={{
          rowKey: (record) => `${record.id}`,
        }}
        components={{ Cascader }}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
          useAsyncSelect('brandId', fetchBrand)
          // useAsyncSelect('customerCategoryId', fetchCategory)
          onFieldInit$('customerCategoryId').subscribe((fieldState) => {
            fetchCategory(actions)
          })
        }}
        mode={'checkbox'}
        beforeChecked={handleBeforeProductChecked}
        value={processProduct}
      />
      <TableModal
        modalType={'Drawer'}
        width={1000}
        visible={processOrderVisible}
        onClose={() => processOrderToggle(false)}
        title={intl.formatMessage({ id: 'handling.assign.add.select.process.order' })}
        columns={orderColumns}
        schema={orderSchema}
        onOk={tiggerProcessOrderProductOk}
        fetchData={handleFetchOrderList}
        rowSelection={{
          getCheckboxProps: (_record) => {
            return {
              disabled: _record.products.every((_item) => +_item.quantity - +_item.enhanceCount <= 0),
            }
          },
        }}
        tableProps={{
          rowKey: (record) => `${record.orderId}`,
          // disabled: products.every((_i) => ),
          expandable: {
            expandedRowRender: (record) => {
              const withOrderNo = record.products.map((_item) => {
                return {
                  ..._item,
                  orderNo: record.orderNo,
                  orderId: record.orderId,
                }
              })
              return (
                <Table
                  columns={orderProductColumns}
                  // rowKey={(row) => `${row.orderId}_${row.id}`}
                  rowKey={(row) => `${row.orderId}_${row.orderProductId}`}
                  dataSource={withOrderNo}
                  rowSelection={orderProductRowSelection}
                  pagination={false}
                />
              )
            },
          },
        }}
        components={{ Cascader }}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)
        }}
        mode={'checkbox'}
        beforeChecked={handleBeforeOrderChecked}
        value={processOrder}
      />
      <ProductDrawer
        visible={productDrawerVisible}
        editable={productActionType === 'edit'}
        value={currentProduct}
        onSubmit={handleChangeProduct}
        onClose={() => productDrawerToggle(false)}
      />
    </div>
  )
}

export default Create
