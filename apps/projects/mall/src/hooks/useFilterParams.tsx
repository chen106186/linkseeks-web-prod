import { useState } from 'react'
import { FilterValueType, FILTER_PARAM, FILTER_TYPE } from '@/components/CommonFilter/types'
import { useEffect } from 'react'
import isEqual from 'lodash/isEqual'
import { MroCategoryItemType } from '@/types/commodity'
import { LAYOUT_TYPE } from '@/types/global'
import { postProductCustomerGetEffectiveAttribute, postProductPlatformGetEffectiveAttribute } from '@apps/apis'
import { integrationBlackTime } from '@/utils'

interface UseFilterParamsProps {
  filterList: FilterValueType[]
  initMroCategoryTree?: MroCategoryItemType[]
  initMroFilterSelected?: Record<string, any>
}

interface UseFilterParamsReturn {
  filterParam: FILTER_PARAM | undefined
  mroCategoryTree: MroCategoryItemType[]
  mroFilterSelected: Record<string, any>
  setMroFilter: (parentId: string, id: number, layoutType: LAYOUT_TYPE) => void
  dispatchFilterParam: (values: FILTER_PARAM | undefined) => void
}

const useFilterParams = (props: UseFilterParamsProps): UseFilterParamsReturn => {
  const { filterList, initMroCategoryTree, initMroFilterSelected } = props
  const [filterParam, setFilterParam] = useState<FILTER_PARAM>()
  const [mroCategoryTree, setMroCategoryTree] = useState<MroCategoryItemType[]>(initMroCategoryTree || [])
  const [mroFilterSelected, setMroFilterSelected] = useState<Record<string, any>>(initMroFilterSelected || {})

  /** 判读两个数组缺少的数据，不存在的则补充 */
  const replenishData = (list: any[], allList: any[], attributeId: string, attributeValueId: string) => {
    if (Array.isArray(list) && list.length > 0 && Array.isArray(allList) && allList.length > 0) {
      const result: any[] = []
      for (const item of allList) {
        const filterItem = list.find((listItem) => listItem[attributeId] === item.id)
        if (filterItem) {
          result.push(filterItem)
        } else {
          result.push({
            [attributeId]: item.id,
            [attributeValueId]: item[attributeValueId] ?? [],
          })
        }
      }
      return result
    }
    return []
  }

  const mroForEach = (
    data: any,
    mroCategoryTree: any[],
    attrName: string | number,
    attributeId: any,
    attributeValueId: any,
    mroFilterSelected?: any,
  ) => {
    if (data.length > 0) {
      data.forEach((item: any) => {
        const _id = item[attributeId]
        mroCategoryTree.forEach((item2: any) => {
          if (item2.id === _id && item2[attrName].length > 0) {
            item2[attrName].forEach((item3: any, itemIndex3: number, arr3: any) => {
              if (item[attributeValueId].indexOf(item3.id) >= 0) {
                arr3[itemIndex3]['able'] = true
              } else {
                arr3[itemIndex3]['able'] = false
                if (mroFilterSelected) {
                  const _index = mroFilterSelected['attr']?.[item2.id]?.indexOf(item3.id)
                  if (_index != undefined && _index >= 0) {
                    mroFilterSelected['attr'][item2.id].splice(_index, 1)
                  }
                }
              }
            })
          }
        })
      })
    } else {
      mroCategoryTree.forEach((item2: any) => {
        item2[attrName]?.forEach((item3: any, itemIndex3: number, arr3: any) => {
          arr3[itemIndex3]['able'] = false
          if (mroFilterSelected) {
            const _index = mroFilterSelected['attr']?.[item2.id]?.indexOf(item3.id)
            if (_index != undefined && _index >= 0) {
              mroFilterSelected['attr'][item2.id].splice(_index, 1)
            }
          }
        })
      })
    }
  }

  const mroBrandForEach = (data: any, mroCategoryTree: any, attrName: string | number, mroFilterSelected?: any) => {
    const _indexBrand = mroCategoryTree.findIndex((item: any) => item.id === 'brand999')
    mroCategoryTree[_indexBrand][attrName].forEach((item: any, index: any, arr: any) => {
      if (data.indexOf(item.id) >= 0) {
        arr[index]['able'] = true
      } else {
        arr[index]['able'] = false
        if (mroFilterSelected) {
          const _index = mroFilterSelected['brand']?.['brand999']?.indexOf(item.id)
          if (_index != undefined && _index >= 0) {
            mroFilterSelected['brand']?.['brand999']?.splice(_index, 1)
          }
        }
      }
    })
  }

  const setMroFilter = async (parentId: string, id: number, layoutType: LAYOUT_TYPE) => {
    const _attrName = layoutType === LAYOUT_TYPE.joint ? 'attributeValueList' : 'customerAttributeValueList'
    const _attributeId = layoutType === LAYOUT_TYPE.joint ? 'attributeId' : 'customerAttributeId'
    const _attributeValueId = layoutType === LAYOUT_TYPE.joint ? 'attributeValueId' : 'customerAttributeValueId'
    const _commodityAttributeResponseList =
      layoutType === LAYOUT_TYPE.joint ? 'commodityAttributeRespList' : 'commoditySkuAttributeRespList'

    const _effectiveAttrApi =
      layoutType === LAYOUT_TYPE.joint
        ? postProductPlatformGetEffectiveAttribute
        : postProductCustomerGetEffectiveAttribute

    const _isBrand = parentId === 'brand999'
    const _keyName = _isBrand ? 'brand' : 'attr'
    let _mroFilterSelected = { ...mroFilterSelected }
    let _mroCategoryTree = [...mroCategoryTree]

    if (!_mroFilterSelected[_keyName]) {
      _mroFilterSelected[_keyName] = {}
    }
    if (!_mroFilterSelected[_keyName][parentId]) {
      _mroFilterSelected[_keyName][parentId] = []
    }
    const _index = _mroFilterSelected[_keyName][parentId].indexOf(id)
    if (_index >= 0) {
      _mroFilterSelected[_keyName][parentId].splice(_index, 1)
    } else {
      _mroFilterSelected[_keyName][parentId].push(id)
    }
    let _attributeIdList: any = []
    let _attributeValueIdList: any = []
    for (let key in _mroFilterSelected['attr']) {
      if (_mroFilterSelected['attr'][key] && _mroFilterSelected['attr'][key].length > 0) {
        _attributeIdList.push(key)
        _attributeValueIdList = _attributeValueIdList.concat(_mroFilterSelected['attr'][key])
      }
    }
    const { data } = await _effectiveAttrApi(
      {
        attributeIdList: _attributeIdList,
        attributeValueIdList: _attributeValueIdList,
        brandIdList: _mroFilterSelected?.['brand']?.['brand999'] || [],
        categoryId: filterParam?.categoryId ?? filterParam?.customerCategoryId,
      },
      { ctlType: 'none' },
    )
    mroForEach(
      replenishData(data[_commodityAttributeResponseList], _mroCategoryTree, _attributeId, _attributeValueId),
      _mroCategoryTree,
      _attrName,
      _attributeId,
      _attributeValueId,
      _mroFilterSelected,
    )

    if (_mroCategoryTree && _mroCategoryTree.some((item) => item.id === 'brand999')) {
      mroBrandForEach(data['brandIdList'], _mroCategoryTree, _attrName, _mroFilterSelected)
    }
    setMroCategoryTree(_mroCategoryTree)
    setMroFilterSelected(_mroFilterSelected)
  }

  useEffect(() => {
    if (filterList && filterList.length > 0) {
      formatFilterParam(filterList)
    } else {
      setFilterParam(undefined)
    }
  }, [filterList])

  const formatFilterParam = (newFilterList: FilterValueType[]) => {
    const tempFilterParam: any = {}
    for (const filterItem of newFilterList) {
      switch (filterItem.type) {
        case FILTER_TYPE.keyword:
          tempFilterParam.name = filterItem.key
          break
        case FILTER_TYPE.shopKeyword:
          tempFilterParam.name = filterItem.key
          break
        case FILTER_TYPE.category:
          tempFilterParam.categoryId = filterItem.key
          tempFilterParam.categoryKey = filterItem.filter
          break
        case FILTER_TYPE.customerCategory:
          tempFilterParam.customerCategoryId = Number(filterItem.key)
          tempFilterParam.categoryKey = filterItem.filter
          break
        case FILTER_TYPE.commodityType:
          tempFilterParam.priceTypeList = [filterItem.key]
          break
        case FILTER_TYPE.carriageType:
          tempFilterParam.carriageType = filterItem.key
          break
        case FILTER_TYPE.minPoints:
        case FILTER_TYPE.minPrice:
          tempFilterParam.min = filterItem.key
          break
        case FILTER_TYPE.maxPoints:
        case FILTER_TYPE.maxPrice:
          tempFilterParam.max = filterItem.key
          break
        case FILTER_TYPE.brand:
          tempFilterParam.brandId = filterItem.key
          break
        case FILTER_TYPE.province:
          tempFilterParam.provinceCode = filterItem.key
          break
        case FILTER_TYPE.city:
          tempFilterParam.cityCode = filterItem.key
          break
        case FILTER_TYPE.sort:
          switch (filterItem.key) {
            case 'soldSort':
              tempFilterParam.orderType = 1
              break
            case 'creditSort':
              tempFilterParam.orderType = 2
              break
            case 'priceSortHighToLow':
              tempFilterParam.orderType = 3
              break
            case 'priceSortLowToHigh':
              tempFilterParam.orderType = 4
              break
            case 'pointSortHighToLow':
              tempFilterParam.orderType = 3
              break
            case 'pointSortLowToHigh':
              tempFilterParam.orderType = 4
              break
            case 'creditSortHighToLow':
              tempFilterParam.orderType = 1
              break
            case 'creditSortLowToHigh':
              tempFilterParam.orderType = 2
              break
            case 'publicTimeSortHighToLow':
              tempFilterParam.orderType = 3
              break
            case 'publicTimeSortLowToHigh':
              tempFilterParam.orderType = 4
              break
            case 'dateSort':
              tempFilterParam.orderType = 5
              break
          }
          break
        case FILTER_TYPE.soldSort:
          tempFilterParam.orderType = 1
          break
        case FILTER_TYPE.creditSort:
          tempFilterParam.orderType = 2
          break
        case FILTER_TYPE.priceSortHighToLow:
          tempFilterParam.orderType = 3
          break
        case FILTER_TYPE.priceSortLowToHigh:
          tempFilterParam.orderType = 4
          break
        case FILTER_TYPE.attribute:
          tempFilterParam.customerAttributeList = filterItem.key
          break
        case FILTER_TYPE.shopArea:
          tempFilterParam.areaCode = filterItem.key
          break
        case FILTER_TYPE.creditSortLowToHigh:
          tempFilterParam.sortCredit = 1
          break
        case FILTER_TYPE.creditSortHighToLow:
          tempFilterParam.sortCredit = 2
          break
        case FILTER_TYPE.shopCreditSortLowToHigh:
          tempFilterParam.sortCreditPoint = 'ASC'
          break
        case FILTER_TYPE.shopCreditSortHighToLow:
          tempFilterParam.sortCreditPoint = 'DESC'
          break
        case FILTER_TYPE.dateSortLowToHigh:
          tempFilterParam.sortTime = 1
          break
        case FILTER_TYPE.dateSortHighToLow:
          tempFilterParam.sortTime = 2
          break
        case FILTER_TYPE.categoryName:
          tempFilterParam.category = filterItem.key
          break
        case FILTER_TYPE.publicStartTime:
          tempFilterParam.startTime = integrationBlackTime(`${filterItem.key} 00:00:00`)
          break
        case FILTER_TYPE.publicEndTime:
          tempFilterParam.endTime = integrationBlackTime(`${filterItem.key} 23:59:59`)
          break
        case FILTER_TYPE.projectKeyword:
          tempFilterParam.name = filterItem.key
          break
        case FILTER_TYPE.sourceType:
          tempFilterParam.type = filterItem.key
          break
        case FILTER_TYPE.aboutUs:
          tempFilterParam.aboutUs = filterItem.key
          break
        default:
          break
      }
    }
    if (isEqual(filterParam, tempFilterParam)) {
      return
    }

    if (Object.keys(tempFilterParam).length > 0) {
      setFilterParam(tempFilterParam)
    } else {
      setFilterParam(undefined)
    }
  }

  const dispatchFilterParam = (values: FILTER_PARAM | undefined) => {
    setFilterParam(values)
  }

  return {
    filterParam,
    mroCategoryTree,
    mroFilterSelected,
    setMroFilter,
    dispatchFilterParam,
  }
}

export default useFilterParams
