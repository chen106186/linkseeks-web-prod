import { getIntl } from '@linkseeks/i18n'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { columnsUnitProduct } from '../constant'
import { PageStatus } from '@/hooks/usePageStatus'
import { orderlyLadderPrice } from '@/pages/commodityAbility/commodity/products/constant'
import { getProductCustomerGetCustomerCategoryTree, getProductSelectGetSelectBrand } from '@apps/apis'

// 高级筛选schema中用于输入搜索品牌的Effect

export const searchBrandOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductSelectGetSelectBrand({ name: state.props['x-component-props'].searchValue }).then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}

// 高级筛选schema中用于输入搜索商品品类的Effect

export const searchCustomerCategoryOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductCustomerGetCustomerCategoryTree().then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}

// 构建设置价格 table 所需要的data和columns

export const constructTableData = (data: any, ctx: ISchemaFormActions | ISchemaFormAsyncActions, pageStatus: any) => {
  const intl = getIntl()
  let col: any = [...columnsUnitProduct]
  let temp: any = []
  console.log(data, 'data')
  // 兼容编辑价格策略 新增使用data 编辑使用data[0].commodityUnitPrice
  let _data_column = pageStatus === PageStatus.ADD ? data[0] : data[0]?.['commoditySku'] || []
  _data_column?.commoditySkuAttributeList &&
    _data_column.commoditySkuAttributeList.map((_item) => {
      temp.push({
        title: _item.customerAttribute.name,
        dataIndex: [_item.customerAttribute.name, 'value'],
        key: _item.customerAttribute.name,
      })
    })

  col.push(
    {
      title: intl.formatMessage({ id: 'priceManage.effect.goods' }),
      dataIndex: intl.formatMessage({ id: 'priceManage.effect.goods' }),
      key: intl.formatMessage({ id: 'priceManage.effect.goods' }),
    },
    ...temp,
    {
      title: intl.formatMessage({ id: 'priceManage.effect.unitPrice' }),
      dataIndex: intl.formatMessage({ id: 'priceManage.effect.unitPrice' }),
      key: intl.formatMessage({ id: 'priceManage.effect.unitPrice' }),
      render: (text, record) => {
        if (!text || JSON.stringify(text) === '{}') return null
        return Object.keys(text).map((v, i) => {
          return (
            <>
              <span key={i}>
                {v === '0-0' ? '' : `${v}:`}{' '}
                <span style={{ color: 'red' }}>
                  {intl.formatMessage({ id: 'common.money' })}
                  {text[v]}
                </span>
              </span>
              <br />
            </>
          )
        })
      },
    },
  )

  // 兼容编辑价格策略 新增使用data 编辑使用data -> item -> commoditySku
  let _tableData: any = []
  data.map((item, index) => {
    let temp: any = {}
    let _item_differ = pageStatus === PageStatus.ADD ? item : item['commoditySku']
    _item_differ?.commoditySkuAttributeList &&
      _item_differ.commoditySkuAttributeList.map((_item) => {
        temp[_item.customerAttribute.name] = {
          value: _item.customerAttributeValue.value,
          vId: _item.customerAttributeValue.id,
          id: _item.customerAttribute.id,
        }
      })

    _tableData.push({
      listId: pageStatus !== PageStatus.ADD ? item.id : undefined,
      id: _item_differ.id,
      [intl.formatMessage({ id: 'priceManage.effect.index' })]: index,
      [intl.formatMessage({ id: 'priceManage.effect.goodsId' })]:
        _item_differ.materiel?.id || _item_differ?.materielId || '',
      [intl.formatMessage({ id: 'priceManage.effect.goodsName' })]: `${ctx.getFieldValue('productName')}${
        _item_differ?.commodityAttribute ? `/${_item_differ?.commodityAttribute}` : ''
      }`,
      [intl.formatMessage({ id: 'priceManage.effect.goods' })]:
        _item_differ.materiel?.name || _item_differ?.materielName || '',
      ...temp,
      [intl.formatMessage({ id: 'priceManage.effect.unitPrice' })]: orderlyLadderPrice(item.unitPrice),
    })
  })

  return {
    columsUnit: col,
    tableUnitData: _tableData,
  }
}

// 生成 Api 所需要的参数

export const transformParamsForApi = (data: any, ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const intl = getIntl()
  let _params: any = {}
  _params['name'] = data.name
  _params['priceType'] = data.priceType
  _params['applyType'] = data.applyType
  let shopInfo = data?.shopId ? { id: data.shopId } : ctx.getFieldState('shopId')['values'][1]

  _params['shopId'] = shopInfo['id']
  _params['type'] = shopInfo['type']
  _params['environment'] = shopInfo['environment']
  _params['commodity'] = { id: data.productId }
  if (data?.commodityMemberList) {
    _params['commodityMemberList'] = data.commodityMemberList.map((item) => ({
      memberId: item.memberId,
      memberName: item.name,
      memberTypeName: item.memberTypeName,
      memberRoleId: item.roleId,
      memberRoleName: item.roleName,
    }))
  }
  if (data?.commodityMemberLevelList) {
    _params['commodityMemberLevelList'] = data.commodityMemberLevelList.map((item) => ({
      memberRoleId: item.roleId,
      memberRoleName: item.roleName,
      ...item,
    }))
  }

  _params['memberUnitPriceList'] = data.memberUnitPriceList.map((item) => ({
    id: item?.listId,
    commoditySku: { id: item.id },
    unitPrice: item[intl.formatMessage({ id: 'priceManage.effect.unitPrice' })],
  }))

  return {
    params: _params,
  }
}

// 生成前端Form所需要的参数
export const transformDataForNiceForm = (value: any, ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  if (value && JSON.stringify(value) !== '{}') {
    let initValue: any = {}
    initValue['name'] = value.name
    initValue['applyType'] = value.applyType
    initValue['priceType'] = value.priceType
    initValue['productId'] = value.commodityId
    initValue['productName'] = value.commodityName
    initValue['commodityMemberList'] =
      value.commodityMemberList &&
      value.commodityMemberList.map((item) => ({
        memberId: item.memberId,
        name: item.memberName,
        memberTypeName: item.memberTypeName,
        roleId: item.memberRoleId,
        roleName: item.memberRoleName,
      }))
    initValue['commodityMemberLevelList'] =
      value.commodityMemberLevelList &&
      value.commodityMemberLevelList.map((item) => ({
        roleId: item.memberRoleId,
        roleName: item.memberRoleName,
        levelId: item.id,
        ...item,
      }))
    initValue['shopId'] = value['shopId']

    // Edit使用
    initValue['memberUnitPriceList'] = value['memberUnitPriceList'] || []

    return {
      initValue,
    }
  }
}
