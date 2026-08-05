/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-28 18:33:24
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-10-29 18:11:16
 * @Description: 品牌过滤
 */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { ScrollView } from '@tarojs/components'
import { View, Button } from '@apps/mobile-ui'
import useStores from '@/store/useStores'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { useIntl } from '@linkseeks/i18n'
import useShopLayout from '@/hooks/useShopLayout'
import { FILTER_PARAM, FILTER_PARAM_KEY } from '@/components/FilterSortBar/type'
import {
  getProductMobileShopEnterpriseGetBrand,
  getProductMobileShopSelfGetBrand,
  getProductMobileShopStoreGetBrand,
} from '@apps/apis'
import FilterTofu, { FilterTofuOption, FilterTofuValue, FilterTofuRefHandle } from '../FilterTofu'
import FilterPage from '../FilterPage'
import FilterShelf from '../FilterShelf'
import './index.scss'

interface FilterBrandProps {
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
  /**
   * 选中参数
   */
  innerValue?: FILTER_PARAM | undefined
}

const FilterBrand: React.FC<FilterBrandProps> = (props: FilterBrandProps) => {
  const { multiple, storeId, innerValue, onChange } = props
  const [options, setOptions] = useState<FilterTofuOption[]>([])
  const [tofuValue, setTofuValue] = useState<FilterTofuValue>([])
  const [visiblePopup, setVisiblePopup] = useState(false)
  const intl = useIntl()
  const classifyRef = useRef<FilterTofuRefHandle | null>(null)
  const shopLayout = useShopLayout(storeId !== undefined)
  const {
    userStore: { shopAndSite },
  } = useStores()

  useEffect(() => {
    if (innerValue && (innerValue.brandId || innerValue.brandIdList)) {
      const selectVal = innerValue.brandId || innerValue.brandIdList

      setTofuValue(selectVal)
    } else {
      setTofuValue([])
    }
  }, [innerValue])

  const API_MAP = {
    [LAYOUT_TYPE.spot]: getProductMobileShopEnterpriseGetBrand,
    [LAYOUT_TYPE.client]: getProductMobileShopEnterpriseGetBrand,
    [LAYOUT_TYPE.shop]: getProductMobileShopStoreGetBrand,
    [LAYOUT_TYPE.own]: getProductMobileShopSelfGetBrand,
  }

  const getOptions = () => {
    const payload: any = {}

    if (shopLayout === LAYOUT_TYPE.own) {
      payload.memberId = shopAndSite?.memberId
    }

    if (shopLayout === LAYOUT_TYPE.shop) {
      payload.storeId = storeId
    }

    API_MAP[shopLayout] &&
      API_MAP[shopLayout](payload).then((res) => {
        if (res.code === 1000 && res.data) {
          const formatData = res.data.map((item) => ({
            label: item.name,
            value: String(item.id),
          }))
          setOptions(formatData)
        }
      })
  }

  useEffect(() => {
    getOptions()
  }, [])

  const getKey = () => {
    if (multiple) {
      return FILTER_PARAM_KEY.brandIdList
    } else {
      return FILTER_PARAM_KEY.brandId
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
  const description = useMemo(
    () =>
      options
        .filter((item) => arrValue.includes(item.value))
        .map((item) => item.label)
        .join('、'),
    [options, arrValue],
  )

  return (
    <>
      <FilterShelf
        title={intl.formatMessage({ id: 'search.pinpai', defaultMessage: '品牌' })}
        description={description}
        onMore={handleShowPopup}
      >
        <FilterTofu options={options} value={tofuValue} onChange={handleChange} multiple={multiple} maxLength={6} />
      </FilterShelf>
      <FilterPage visible={visiblePopup}>
        <View className="filter-page-page">
          <ScrollView className="filter-page-scroll" scrollY>
            <FilterShelf
              title={intl.formatMessage({ id: 'search.xuanzepinpai', defaultMessage: '选择品牌' })}
              description={intl.formatMessage({ id: 'search.quanbupinpai', defaultMessage: '全部品牌' })}
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

FilterBrand.defaultProps = {
  multiple: false,
}

export default FilterBrand
