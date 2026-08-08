import React, { useRef, useState, useEffect } from 'react'
import StandardTable from '@/components/StandardTable'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { getSchema, mixSchema } from '../common/searchTableSchema'
import { Button, Card, Space, Cascader, message, Menu, Dropdown } from 'antd'
import { getColumn } from '../common/columns'
import { createFormActions } from '@apps/formily'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import type { PostProductMaterielGetMaterialListRequest } from '@apps/apis'
import {
  postProductCommodityMaterielUsing,
  postProductMaterielGetMaterialList,
  postProductMaterielFreezeOrEnableMateriel,
  postProductMaterielFreezeOrEnableMaterielBatch,
  postProductCustomerGetMemberCustomerCategoryAttribute,
} from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import {
  useAsyncCascader,
  fetchBrand,
  fetchStatus,
  fetchCategoryData,
  fetchTreeData,
  EMPTY,
} from '../common/useGetTableSearchData'
import { Link } from '@linkseeks/router-core'
import { DownOutlined } from '@ant-design/icons'
import FrozonMadal from '../components/frozonMadal'
import { FROZEN, HAS_CONFIRM } from '@/constants/material'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { authService } from '@apps/services'
import { useWebIntl } from '@apps/locales'

/**
 * 物料查询
 */
const formActions = createFormActions()
// const querySchema = getSchema({ showStatus: true });

export type SearchParams = Omit<PostProductMaterielGetMaterialListRequest, 'materialGroupId'> & {
  materialGroupId: string[]
  status: string | number
  customerCategoryId: string[]
  attributeSearchRequestList: any
}
const URL_PREFIX = '/commodityAbility/material'

const MaterialQuery = () => {
  const intl = useIntl()
  const ref = useRef<any>({})
  const [enableLoading, setEnableLoading] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [activeItem, setActiveItem] = useState(null)
  const [isBatch, setIsBatch] = useState(false)
  const [querySchema, setQuerySchema] = useState<any>()
  const [customerCategoryId, setCustomerCategoryId] = useState<any>()
  const [customerCategoryValues, setCustomerCategoryValues] = useState<any>()
  const [selectRow, selectRowFns] = useRowSelectionTable({
    customKey: 'id',
    extendsSelection: {
      getCheckboxProps: (record: any) => ({
        disabled: record.interiorState !== FROZEN && record.interiorState !== HAS_CONFIRM,
      }),
    },
  })

  const translate = useWebIntl()
  const userInfo = authService.getAuth()

  const onFrozonOrEnable = async (params: { status: number; materielId: number; freezeReason?: string }) => {
    const { freezeReason, ...rest } = params
    const formatData = params.status === 0 ? params : rest
    const { code } = await postProductMaterielFreezeOrEnableMateriel(formatData)
    setVisible(false)

    if (code === 1000) {
      // ref.current.reloadCurrent()
      formActions.submit()
    }
  }

  useEffect(() => {
    if (customerCategoryId) {
      postProductCustomerGetMemberCustomerCategoryAttribute(
        {
          memberId: userInfo.memberId,
          roleId: userInfo.memberRoleId,
          customerCategoryId: customerCategoryId,
        },
        { ctlType: 'none' },
      ).then((res) => {
        if (res.code === 1000) {
          setQuerySchema(getSchema({ showStatus: true }, mixSchema(res.data)))
          setCustomerCategoryValues(res.data)
        }
      })
    } else {
      formActions.setFieldValue('customerCategoryId', undefined)
      formActions.setFieldState('customerCategoryId', (fieldState) => {
        fieldState.value = undefined
        fieldState.values = [undefined]
        fieldState.visibleCacheValue = undefined
      })
      setQuerySchema(getSchema({ showStatus: true }))
      const _paths = customerCategoryValues?.map((item) => `customerCategoryId${item.id}`)?.join(',')
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      _paths && formActions.setFieldValue(`*(${_paths})`, undefined)
      setCustomerCategoryValues(undefined)
    }
  }, [customerCategoryId])

  const handleFrozonOrEnable = async (params: { id: string; interiorState: number }) => {
    if (params.interiorState === FROZEN) {
      onFrozonOrEnable({ materielId: +params.id, status: 1 })
      return
    }
    const { data, code } = await postProductCommodityMaterielUsing({ idList: [+params.id] as any })
    if (code !== 1000) {
      return
    }
    if (data) {
      message.destroy()
      message.info(
        intl.formatMessage({
          id: 'material.frozon.error',
          defaultMessage: '物料已关联商品，无法进行冻结',
        }),
      )
      return
    }
    setIsBatch(false)
    setActiveItem(params)
    setVisible(true)
  }

  const columns = getColumn({
    detailUrl: `${URL_PREFIX}/materialQuery/detail`,
    extraColumn: [
      {
        title: intl.formatMessage({ id: 'material.operation', defaultMessage: '操作' }),
        dataIndex: 'operation',
        render: (text, record) => {
          const menuItems = [
            record.interiorState === FROZEN || record.interiorState === HAS_CONFIRM ? (
              <AuthButton type="custom" code="enableOrFrozen">
                <Menu.Item
                  key="status"
                  style={{ color: '#2ea28c' }}
                  onClick={() => handleFrozonOrEnable({ interiorState: record.interiorState, id: record.id })}
                >
                  {record.interiorState === HAS_CONFIRM
                    ? intl.formatMessage({ id: 'material.frozon', defaultMessage: '冻结' })
                    : intl.formatMessage({ id: 'material.enable', defaultMessage: '启用' })}
                </Menu.Item>
              </AuthButton>
            ) : null,
            record.interiorState === HAS_CONFIRM ? (
              <AuthButton type="custom" code="change">
                <Menu.Item key="change">
                  <Link to={`${URL_PREFIX}/materialPendingAdd/edit?id=${record.id}`}>
                    {intl.formatMessage({ id: 'material.change', defaultMessage: '变更' })}
                  </Link>
                </Menu.Item>
              </AuthButton>
            ) : null,
            <AuthButton type="custom" code="toPriceLibrary">
              <Menu.Item key="priceLibrary">
                <Link to={`/commodityAbility/priceManage/priceLibrary?code=${record.code}`}>
                  {intl.formatMessage({ id: 'material.priceLibrary', defaultMessage: '价格库' })}
                </Link>
              </Menu.Item>
            </AuthButton>,
            <AuthButton type="custom" code="toStockSellStorage">
              <Menu.Item key="stockSellStorage">
                <Link to={`/commodityAbility/stockSellStorage/inventory?code=${record.code}`}>
                  {intl.formatMessage({ id: 'commodity.kucun', defaultMessage: '库存' })}
                </Link>
              </Menu.Item>
            </AuthButton>,
          ].filter(Boolean)
          const menu = <Menu>{menuItems}</Menu>
          return (
            <Space>
              <EditAuthButton>
                <Link to={`${URL_PREFIX}/materialQuery/edit?id=${record.id}`} state={{ name: record.name }}>
                  {translate('web.resource.commodity.huoyuanqingdan')}
                </Link>
              </EditAuthButton>
              {menuItems.length > 0 ? (
                <Dropdown overlay={menu}>
                  <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                    {intl.formatMessage({ id: 'material.more', defaultMessage: '更多' })} <DownOutlined />
                  </a>
                </Dropdown>
              ) : null}
            </Space>
          )
        },
      },
    ],
  })

  const handleBatchForFrozen = async () => {
    const selectedRowKeys = selectRowFns.selectedRowKeys

    if (selectedRowKeys.length === 0) {
      message.info(
        intl.formatMessage({
          id: 'material.batch.select.enableOrFrozon',
          defaultMessage: '请选择你要启动或冻结的物料',
        }),
      )
      return
    }

    const { data, code } = await postProductCommodityMaterielUsing({ idList: selectedRowKeys as any })
    if (code !== 1000) {
      return
    }
    if (data) {
      message.destroy()
      message.info(
        intl.formatMessage({
          id: 'material.frozon.error',
          defaultMessage: '物料已关联商品，无法进行冻结',
        }),
      )
      return
    }
    setVisible(true)
    setIsBatch(true)
  }

  /**
   * 冻结 0， 启动 1
   * @param status
   */
  const handleBatchFrozen = async (status: 0 | 1, reason?: string) => {
    const selectedRowKeys = selectRowFns.selectedRowKeys
    if (selectedRowKeys.length === 0) {
      message.info(
        intl.formatMessage({
          id: 'material.batch.select.enableOrFrozon',
          defaultMessage: '请选择你要启动或冻结的物料',
        }),
      )
      return
    }

    const defaultData = {
      materielId: selectedRowKeys,
      status: status,
    }

    const postData =
      status === 1
        ? defaultData
        : {
            ...defaultData,
            freezeReason: reason,
          }
    if (status === 1) {
      setEnableLoading(true)
    } else {
      setLoading(true)
    }

    try {
      const { code } = await postProductMaterielFreezeOrEnableMaterielBatch(postData)
      if (code === 1000) {
        // ref.current.reloadCurrent()
        formActions.submit()
      }
    } catch (e) {
    } finally {
      setLoading(false)
      setVisible(false)
      setEnableLoading(false)
      selectRowFns.setSelectedRowKeys([])
      selectRowFns.setSelectRow([])
    }
  }

  const controllerBtns = () => {
    return (
      <Space>
        <AuthButton type="custom" code="batchFrozon">
          <Button type="primary" loading={loading} onClick={handleBatchForFrozen}>
            {intl.formatMessage({ id: 'material.frozon.batch', defaultMessage: '批量冻结' })}
          </Button>
        </AuthButton>
        <AuthButton type="custom" code="batchEnable">
          <Button onClick={() => handleBatchFrozen(1)} loading={enableLoading}>
            {intl.formatMessage({ id: 'material.enable.batch', defaultMessage: '批量启用' })}
          </Button>
        </AuthButton>
      </Space>
    )
  }

  const handleSearch = (values: SearchParams) => {
    console.log(values)
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { materialGroupId, customerCategoryId, status, ...rest } = values
    const formatMaterialGroupId =
      materialGroupId && materialGroupId.length > 0 ? { materialGroupId: materialGroupId?.pop() } : {}

    const formatCategoryId =
      customerCategoryId && customerCategoryId.length > 0
        ? { customerCategoryId: customerCategoryId?.pop() }
        : { customerCategoryId: undefined }

    const formatStatus = typeof values.status !== 'undefined' ? { ids: [values.status] } : {}
    const result = { ...rest, ...formatMaterialGroupId, ...formatStatus, ...formatCategoryId }
    // let _customerAttributeValueIdList = [];
    // let _customerAttributeValueList = [];
    // const _paths = customerCategoryValues?.map((item) => `customerCategoryId${item.id}`);
    // for (let key in values) {
    //   const _value = values[key]
    //   const _index = _paths?.indexOf(key);
    //   if (_index > -1) {
    //     delete result[key];
    //     const _item = customerCategoryValues[_index];
    //     if (_value || _value?.lentgh > 0) {
    //       if (_item.type === 3) {
    //         _customerAttributeValueList.push(_value)
    //       } else {
    //         // const _itemId = _value.map((item) => item.id);
    //         // const _itemVal = _value.map((item) => item.value);
    //         _customerAttributeValueIdList = _customerAttributeValueIdList.concat(_value)
    //         // _customerAttributeValueList = _customerAttributeValueList.concat(_itemVal)
    //       }
    //     }
    //   }
    // }
    // _customerAttributeValueIdList.length > 0 && (result['customerAttributeValueIdList'] = _customerAttributeValueIdList.join(','));
    // _customerAttributeValueList.length > 0 && (result['customerAttributeValueList'] = _customerAttributeValueList.join(','));

    const cusList = []
    for (const key in result) {
      if (key.indexOf('customerCategoryId') > -1 && key.indexOf('t') > -1) {
        const keys = key.split('customerCategoryId')[1].split('t')
        if (keys[0] && result[key]) {
          cusList.push({
            id: keys[0],
            inputType: keys[1] == '3' ? 1 : 0,
            value: result[key],
          })
          delete result[key]
        }
      }
    }

    result.attributeSearchRequestList = cusList?.length == 0 ? null : cusList

    ref.current.reload(result)
  }

  const fetchListData = async (params: PostProductMaterielGetMaterialListRequest) => {
    try {
      const { data, code } = await postProductMaterielGetMaterialList(params, { ctlType: 'none' })
      if (code === 1000) {
        return data
      }
      return EMPTY
    } catch (e) {
      return EMPTY
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleFrozon = (value) => {
    if (isBatch) {
      handleBatchFrozen(0, value.reason)
      return
    }
    onFrozonOrEnable({ status: 0, materielId: activeItem.id, freezeReason: value.reason })
  }

  // useFormEffects(() => {
  //   const _paths = customerCategoryValues?.map((item) => `customerCategoryId${item.id}`)?.join(',');
  //   console.log(_paths)
  //   FormEffectHooks.onFieldValueChange$(`*(${_paths})`)?.subscribe(state => {
  //     console.log(state);
  //   })
  // })

  return (
    <PageHeaderWrapper title={intl.formatMessage({ id: 'material.query.title', defaultMessage: '物料查询' })}>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'id',
            rowSelection: selectRow,
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={fetchListData}
          keepAlive={false}
          controlRender={
            <NiceForm
              components={{ controllerBtns, Cascader }}
              schema={querySchema}
              actions={formActions}
              onSubmit={handleSearch}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'code', FORM_FILTER_PATH)
                useAsyncCascader('materialGroupId', fetchTreeData)
                useAsyncCascader('customerCategoryId', fetchCategoryData)
                useAsyncSelect('brandId', fetchBrand, ['name', 'id'])
                useAsyncSelect('status', fetchStatus, ['name', 'status'])
                $('onFieldChange', 'customerCategoryId').subscribe((state) => {
                  const _value =
                    (state?.value?.length !== undefined || state?.value?.length !== null) && state?.value?.length > 0
                      ? state?.value[state?.value?.length - 1]
                      : undefined
                  // console.log('customerCategoryId', _value)
                  // if (!_value) {
                  //   formActions.setFieldValue('customerCategoryId', undefined);
                  //   actions.setFieldValue('customerCategoryId', undefined);
                  //   actions.setFieldState('customerCategoryId', (fieldState) => {
                  //     fieldState.value = undefined;
                  //     fieldState.values = [undefined];
                  //     fieldState.visibleCacheValue = undefined;
                  //   });
                  // }
                  setCustomerCategoryId(_value)
                })
              }}
            />
          }
        />
      </Card>
      <FrozonMadal
        visible={visible}
        onCancel={() => setVisible(false)}
        title={intl.formatMessage({
          id: 'material.frozon.reason.modal.title',
          defaultMessage: '冻结原因',
        })}
        onSubmit={handleFrozon}
        confirmLoading={loading}
      />
    </PageHeaderWrapper>
  )
}

export default MaterialQuery
