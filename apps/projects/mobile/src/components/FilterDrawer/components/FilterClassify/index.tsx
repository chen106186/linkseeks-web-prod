/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-28 11:46:57
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-25 17:20:11
 * @Description: 品类过滤
 */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { ScrollView } from '@tarojs/components'
import { View, Button } from '@apps/mobile-ui'
import useShopLayout from '@/hooks/useShopLayout'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import { FILTER_PARAM, FILTER_PARAM_KEY } from '@/components/FilterSortBar/type'
import {
  getProductMobileShopEnterpriseGetCategoryTree,
  getProductMobileShopSelfGetCustomerCategoryTree,
  getProductMobileShopStoreGetCustomerCategoryTree,
} from '@apps/apis'
import FilterShelf from '../FilterShelf'
import FilterTofu, { FilterTofuOption, FilterTofuValue, FilterTofuRefHandle } from '../FilterTofu'
import FilterPage from '../FilterPage'
import './index.scss'

interface FilterClassifyProps {
  /**
   * 店铺id
   */
  storeId?: string | undefined
  /**
   * 是否多选，默认 false
   */
  multiple?: boolean
  /**
   * 过滤项改变触发事件
   */
  onChange?: (values: any) => void

  innerValue: FILTER_PARAM | undefined
}

const FilterClassify: React.FC<FilterClassifyProps> = (props: FilterClassifyProps) => {
  const { multiple, storeId, innerValue, onChange } = props
  const [options, setOptions] = useState<FilterTofuOption[]>([])
  const [tofuValue, setTofuValue] = useState<FilterTofuValue>([])
  const [visiblePopup, setVisiblePopup] = useState(false)
  const shopLayout = useShopLayout(storeId !== undefined)
  const {
    userStore: { shopAndSite },
  } = useStores()

  const intl = useIntl()
  useEffect(() => {
    if (
      innerValue &&
      (innerValue.categoryId ||
        innerValue.categoryIdList ||
        innerValue.customerCategoryId ||
        innerValue.customerCategoryIdList)
    ) {
      const selectVal =
        innerValue.categoryId ||
        innerValue.categoryIdList ||
        innerValue.customerCategoryId ||
        innerValue.customerCategoryIdList
      setTofuValue(selectVal)
    } else {
      setTofuValue([])
    }
  }, [innerValue])

  const classifyRef = useRef<FilterTofuRefHandle | null>(null)

  const API_MAP = {
    [LAYOUT_TYPE.spot]: getProductMobileShopEnterpriseGetCategoryTree,
    [LAYOUT_TYPE.client]: getProductMobileShopEnterpriseGetCategoryTree,
    [LAYOUT_TYPE.shop]: getProductMobileShopStoreGetCustomerCategoryTree,
    [LAYOUT_TYPE.own]: getProductMobileShopSelfGetCustomerCategoryTree,
  }

  const getOptions = () => {
    const payload: any = {}

    if (shopLayout === LAYOUT_TYPE.own) {
      payload.memberId = shopAndSite?.memberId
    }

    if (shopLayout === LAYOUT_TYPE.shop) {
      payload.storeId = storeId
    }

    API_MAP[shopLayout](payload).then((res) => {
      if (res.code === 1000 && res.data) {
        const formatData = res.data.map((item) => ({
          label: item.name,
          value: item.id,
          children: item?.children || [],
        }))
        setOptions(formatData)
      }
    })
  }

  useEffect(() => {
    getOptions()
  }, [])

  const getKey = () => {
    switch (shopLayout) {
      case LAYOUT_TYPE.spot:
      case LAYOUT_TYPE.mall:
      case LAYOUT_TYPE.client:
        if (multiple) {
          return FILTER_PARAM_KEY.categoryIdList
        } else {
          return FILTER_PARAM_KEY.categoryId
        }
      default:
        if (multiple) {
          return FILTER_PARAM_KEY.customerCategoryIdList
        } else {
          return FILTER_PARAM_KEY.customerCategoryId
        }
    }
  }

  const triggerChange = (next: FilterTofuValue) => {
    if (onChange) {
      const key = getKey()
      onChange({
        ...innerValue,
        [key]: next,
      })
    }
  }

  const handleChange = (value: FilterTofuValue) => {
    if (!('innerValue' in props)) {
      setTofuValue(value)
    }
    triggerChange(value)
  }

  const handleShowPopup = () => {
    classifyRef?.current?.setValue(tofuValue)
    setVisiblePopup(true)
  }

  const handleHidePopup = () => {
    setVisiblePopup(false)
  }

  const handleConfirm = () => {
    if (classifyRef.current) {
      const next = classifyRef.current?.getValue()
      if (!('innerValue' in props)) {
        setTofuValue(next)
      }
      triggerChange(next)
      handleHidePopup()
    }
  }

  const arrValue: any[] = useMemo(() => (!multiple ? [tofuValue] : tofuValue), [multiple, tofuValue])
  const description = useMemo(() => {
    let descriptionList: string[] = []
    if (arrValue && arrValue.length > 0) {
      arrValue.forEach((arrItem) => {
        if (options.some((item) => item.value === arrItem)) {
          options.forEach((optionItem) => {
            if (optionItem.value === arrItem) {
              descriptionList.push(optionItem.label)
            }
          })
        } else {
          options.forEach((item) => {
            if (item.children && item.children.length > 0) {
              item.children.forEach((childItem) => {
                if (childItem.id === arrItem) {
                  descriptionList.push(childItem.name)
                }
              })
            }
          })
        }
      })
    }
    return descriptionList.join('、')
  }, [options, arrValue])

  return (
    <>
      <FilterShelf
        title={intl.formatMessage({ id: 'search.pinlei', defaultMessage: '品类' })}
        description={description}
        onMore={handleShowPopup}
      >
        <FilterTofu options={options} value={tofuValue} onChange={handleChange} multiple={multiple} maxLength={6} />
      </FilterShelf>
      <FilterPage visible={visiblePopup}>
        <View className="filter-page-page">
          <ScrollView className="filter-page-scroll" scrollY>
            <FilterShelf
              title={intl.formatMessage({ id: 'search.xuanzepinlei', defaultMessage: '选择品类' })}
              description={intl.formatMessage({ id: 'search.quanbupinlei', defaultMessage: '全部品类' })}
              more={false}
            >
              <FilterTofu options={options} defaultValue={tofuValue} multiple={multiple} ref={classifyRef} />
            </FilterShelf>
          </ScrollView>
          <View className="filter-page-actions">
            <View className="filter-page-actions-item">
              <Button onClick={handleHidePopup}>
                {intl.formatMessage({ id: 'search.quxiao', defaultMessage: '取消' })}
              </Button>
            </View>
            <View className="filter-page-actions-item">
              <Button type="primary" onClick={handleConfirm}>
                {intl.formatMessage({ id: 'search.queren', defaultMessage: '确认' })}
              </Button>
            </View>
          </View>
        </View>
      </FilterPage>
    </>
  )
}

FilterClassify.defaultProps = {
  multiple: false,
}

export default FilterClassify
