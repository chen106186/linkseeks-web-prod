import React, { useRef, useState, useEffect } from 'react'
import { FormEffectHooks, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { Button, message, Cascader } from 'antd'
import { useModalTable } from '../../model/useModalTable'
import AnchorDrawer from '@/components/AnchorDrawer'
import style from './index.less'
import { LinkOutlined } from '@ant-design/icons'
import DrawerTable from '@/components/DrawerTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import CustomInputSearch from '@/components/NiceForm/components/CustomInputSearch'
import CustomCategorySearch from '@/components/NiceForm/components/CustomCategorySearch'
import { goodFormSchema, goodSearch } from '../../schema/modal'
import { searchBrandOptionEffect, searchCustomerCategoryOptionEffect } from '../../effects'
import { treeReduction } from '@/utils'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import {
  getProductCustomerGetCustomerCategoryTree,
  getProductMaterielGetMaterielList,
  getProductSelectGetSelectBrand,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { useSelectUnit } from '@apps/services'

export interface RelevanceGoodDrawerProps {
  type?: 'radio' | 'checkbox'
  title?: string
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  pageAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  dataIdList: any
  confirmModal?()
}

// const formActions = createFormActions();

export const RelevanceGoodDrawer: React.FC<RelevanceGoodDrawerProps> = ({
  type = 'checkbox',
  title,
  schemaAction,
  confirmModal,
  currentRef,
  dataIdList,
  pageAction,
  ...restProps
}) => {
  const intl = getIntl()

  const cacheRef = useRef({
    categorys: [],
    units: [],
  })
  const { pageStatus } = usePageStatus()
  const { visible, setVisible } = useModalTable({ type, customKey: 'id' })
  const [childVisible, setChildVisible] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<any[]>([]) // 子级抽屉选择的行数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([])
  const { fetchUnitOptions } = useSelectUnit('custom')

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
      }
    }
  }, [])

  const getCommonData = async () => {
    const brandRes = await getProductSelectGetSelectBrand({ name: '' })
    const categoryRes = await getProductCustomerGetCustomerCategoryTree()
    const unitRes = await fetchUnitOptions()
    cacheRef.current = {
      categorys: categoryRes.data,
      units: unitRes,
    }
    return {
      brandData: brandRes.data,
      categoryData: categoryRes.data,
      unitData: unitRes,
    }
  }

  const selectGoods = () => {
    setSelectRow([])
    setSelectedRowKeys([])
    setChildVisible(true)
  }

  // 选择货品的列
  const columns = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.code' }),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.productName' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.type' }),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
      dataIndex: ['customerCategory', 'name'],
      key: 'customerCategory',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.brand' }),
      dataIndex: ['brand', 'name'],
      key: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.unitName' }),
      dataIndex: 'unitName',
      key: 'unit',
    },
  ]

  // 父级抽屉提交 @通过code判断唯一性
  const confirmSubmit = () => {
    schemaAction.validate().then((res) => {
      if (res['errors']['length'] === 0) {
        schemaAction
          .submit((v) => {
            const origin = pageAction.getFieldValue('materielList') || []
            const isEdit = pageAction.getFieldValue('isEdit')
            console.log(v, 'vv', origin, isEdit)
            if (isEdit) {
              pageAction.setFieldValue(
                'materielList',
                origin.map((item) => (item.code === v.code ? { ...item, ...v } : item)),
              )
            } else {
              pageAction.setFieldValue('materielList', origin.concat([{ ...v }]))
            }
          })
          .then(() => setVisible(false))
      }
    })
  }

  const onClose = () => {
    setVisible(false)
    schemaAction.reset()
  }

  const footer = (
    <div
      style={{
        textAlign: 'right',
      }}
    >
      <Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
        {intl.formatMessage({ id: 'detail.purchase.cancel' })}
      </Button>
      <Button onClick={confirmSubmit} type="primary">
        {intl.formatMessage({ id: 'detail.purchase.confirm' })}
      </Button>
    </div>
  )

  // 子级抽屉点击确定
  const onConfirm = async () => {
    setChildVisible(false)
    const selectItem = selectRow[0]
    console.log('selectItem: ', selectItem)
    await schemaAction.setFieldValue('code', selectItem['code'])
    await schemaAction.setFieldValue('name', selectItem['name'])
    await schemaAction.setFieldValue('type', selectItem['type'])
    await schemaAction.setFieldValue('brandName', selectItem['brand'] ? selectItem['brand']['name'] : null)
    await schemaAction.setFieldValue(
      'categoryId',
      selectItem['customerCategory']['fullId'].split('.').map((item) => Number(item).toString()),
    )
    setTimeout(async () => {
      await schemaAction.setFieldValue('categoryName', selectItem['customerCategory']['name'])
      await schemaAction.setFieldValue('unitId', selectItem['unitId'])
      await schemaAction.setFieldValue('unitName', selectItem['unitName'])
      await schemaAction.setFieldValue('has', true)
      await schemaAction.setFieldValue('goodsId', selectItem['id'])
      await schemaAction.setFieldValue('id', selectItem['id'])
    }, 300)
  }

  const fetchData = (params: any) => {
    return new Promise((resolve, reject) => {
      let obj = { ...params }
      getProductMaterielGetMaterielList(obj).then((res) => {
        resolve(res.data)
      })
    })
  }

  const rowSelection: any = {
    type: 'radio',
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectRow(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
    },
  }

  // 选择货品
  const connectGood = (
    <div className="connectBtn" onClick={selectGoods}>
      <LinkOutlined style={{ marginRight: 4 }} />
      {intl.formatMessage({ id: 'detail.purchase.select' })}
    </div>
  )

  const beforeUpload = (file) => {
    if (file.size / 1024 / 1024 > 20) {
      message.warning(intl.formatMessage({ id: 'detail.purchase.placeholder2' }))
      return Promise.reject()
    }
  }

  const displayRender = (label) => {
    return label[label.length - 1]
  }

  return (
    <AnchorDrawer
      title={title}
      visible={visible}
      dataIdList={dataIdList}
      footer={footer}
      onClose={onClose}
      isForm={true}
      actions={schemaAction}
      effects={($, ctx) => {
        ctx.reset()
        $('onFormMount').subscribe(async () => {
          const commonData = await getCommonData()
          ctx.setFieldState('categoryId', (state) => {
            state.props['x-component-props'].options = commonData['categoryData']
          })
          ctx.setFieldState('unitId', (state) => {
            state.props['enum'] = commonData['unitData']
          })
        })
        $('onFieldValueChange', 'unitId').subscribe((state) => {
          const { value } = state
          if (value && pageStatus !== PageStatus.EDIT) {
            let _v = cacheRef.current.units.filter((item) => item.value === value)[0]['label']
            ctx.setFieldValue('unitName', _v)
          }
        })
        $('onFieldValueChange', 'categoryId').subscribe((state) => {
          const { value } = state
          if (value.length && pageStatus !== PageStatus.EDIT) {
            console.log(cacheRef.current.categorys, value)
            let _v = treeReduction(cacheRef.current.categorys)[value[value.length - 1]]['title']
            ctx.setFieldValue('categoryName', _v)
          }
        })
      }}
      schema={goodFormSchema}
      components={{
        Cascader,
      }}
      expressionScope={{
        connectGood,
        beforeUpload,
        displayRender,
      }}
      restDrawer={{
        className: style.parentDrawerWrapper,
        destroyOnClose: true,
      }}
      reloadFields={['categoryId']}
    >
      <DrawerTable
        drawerTitle={intl.formatMessage({ id: 'detail.purchase.modalTitle1' })}
        confirm={onConfirm}
        cancel={() => setChildVisible(false)}
        visible={childVisible}
        columns={columns}
        rowSelection={rowSelection}
        fetchTableData={(params: any) => fetchData(params)}
        formilyProps={{
          ctx: {
            schema: goodSearch,
            components: {
              ModalSearch: Search,
              Submit,
              CustomInputSearch,
              CustomCategorySearch,
            },
            effects: ($, actions) => {
              // actions.reset()
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              FormEffectHooks.onFieldChange$('brandId').subscribe((state) => {
                searchBrandOptionEffect(actions, 'brandId')
              })
              FormEffectHooks.onFieldChange$('customerCategoryId').subscribe((state) => {
                searchCustomerCategoryOptionEffect(actions, 'customerCategoryId')
              })
            },
          },
        }}
        resetDrawer={{
          destroyOnClose: true,
        }}
        tableProps={{
          rowKey: 'id',
        }}
      />
    </AnchorDrawer>
  )
}

RelevanceGoodDrawer.defaultProps = {}

export default RelevanceGoodDrawer
