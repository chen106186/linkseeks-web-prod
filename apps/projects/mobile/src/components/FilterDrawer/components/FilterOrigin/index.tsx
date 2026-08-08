/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-28 18:52:12
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-25 17:32:54
 * @Description: 发货地过滤
 */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { View, Button, Icons } from '@apps/mobile-ui'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import useShopLayout from '@/hooks/useShopLayout'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import { FILTER_PARAM, FILTER_PARAM_KEY } from '@/components/FilterSortBar/type'
import {
  getProductMobileShopEnterpriseGetArea,
  getProductMobileShopSelfGetArea,
  getProductMobileShopStoreGetArea,
} from '@apps/apis'
import FilterPage from '../FilterPage'
import FilterShelf from '../FilterShelf'
import FilterTofu, { FilterTofuOption, FilterTofuValue, FilterTofuRefHandle } from '../FilterTofu'
import './index.scss'

interface FilterOriginProps {
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

interface ItemType {
  name: string
  value: string
}

interface IndexListItemType {
  title: string
  key: string
  items: ItemType[]
}

const FilterOrigin: React.FC<FilterOriginProps> = (props: FilterOriginProps) => {
  const { multiple, storeId, innerValue, onChange } = props
  const [options, setOptions] = useState<FilterTofuOption[]>([])
  const [tofuValue, setTofuValue] = useState<FilterTofuValue>([])
  const [visiblePopup, setVisiblePopup] = useState(false)
  const shopLayout = useShopLayout(storeId !== undefined)
  const {
    userStore: { shopAndSite },
  } = useStores()
  const [indexListData, setIndexListData] = useState<IndexListItemType[]>([])
  const intl = useIntl()
  const classifyRef = useRef<FilterTofuRefHandle | null>(null)

  useEffect(() => {
    if (innerValue) {
      let selectVal = ''
      if (innerValue.provinceCode) {
        selectVal = `p${innerValue.provinceCode}`
      } else if (innerValue.cityCode) {
        selectVal = `c${innerValue.cityCode}`
      }
      setTofuValue(selectVal)
    } else {
      setTofuValue([])
    }
  }, [innerValue])

  const API_MAP = {
    [LAYOUT_TYPE.spot]: getProductMobileShopEnterpriseGetArea,
    [LAYOUT_TYPE.client]: getProductMobileShopEnterpriseGetArea,
    [LAYOUT_TYPE.shop]: getProductMobileShopStoreGetArea,
    [LAYOUT_TYPE.own]: getProductMobileShopSelfGetArea,
  }

  const initIndexListdata = (list: any[]) => {
    const tempCityList: any[] = []

    // 1.根据每个城市名获取首字母添加到数据中
    list.forEach((listItem) => {
      if (listItem.cityList) {
        tempCityList.push(...listItem.cityList)
      }
    })

    // 2. 根据首字母对城市数组进行分组
    const newCityList: any[] = []
    tempCityList.forEach((cityItem) => {
      if (newCityList.every((item) => item.title !== cityItem.title)) {
        newCityList.push({
          title: cityItem.title || '',
          data: [cityItem],
        })
      } else {
        for (let i = 0; i < newCityList.length; i += 1) {
          const newCityItem = newCityList[i]
          if (newCityItem.title === cityItem.title) {
            newCityItem.data = [...newCityItem.data, cityItem]
          }
        }
      }
    })

    // 3. 根据字母进行排序
    const sortData = newCityList.sort((a, b) => a.title.localeCompare(b.title))

    const cityIndexList = sortData.map((sortItem) => {
      return {
        title: sortItem.title,
        key: sortItem.title,
        items: sortItem.data.map((dataItem) => {
          return {
            name: dataItem.cityName,
            value: `c${dataItem.cityCode}`,
          }
        }),
      }
    })

    const provinceList = list.map((item) => ({
      name: item.provinceName,
      value: `p${item.provinceCode}`,
    }))

    setIndexListData([
      {
        title: intl.formatMessage({ id: 'search.sheng', defaultMessage: '省' }),
        key: '',
        items: provinceList,
      },
      ...cityIndexList,
    ])
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
          initIndexListdata(res.data)
          const formatData = res.data.map((item) => ({
            label: item.provinceName,
            value: `p${item.provinceCode}`,
          }))
          setOptions(formatData)
        }
      })
  }

  useEffect(() => {
    getOptions()
  }, [])

  const getKeyByValue = (value: string) => {
    if (value && value.indexOf('p') > -1) {
      return {
        [FILTER_PARAM_KEY.provinceCode]: value.split('p')[1],
        [FILTER_PARAM_KEY.cityCode]: '',
      }
    } else if (value && value.indexOf('c') > -1) {
      return {
        [FILTER_PARAM_KEY.provinceCode]: '',
        [FILTER_PARAM_KEY.cityCode]: value.split('c')[1],
      }
    } else {
      return {
        [FILTER_PARAM_KEY.provinceCode]: '',
        [FILTER_PARAM_KEY.cityCode]: '',
      }
    }
  }

  const triggerChange = (next: FilterTofuValue) => {
    if (onChange) {
      onChange({
        ...innerValue,
        ...getKeyByValue(next),
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
    const result: string[] = []
    indexListData.forEach((indexItem) => {
      indexItem.items &&
        indexItem.items.forEach((indexChildItem) => {
          if (arrValue.includes(indexChildItem.value)) {
            result.push(indexChildItem.name)
          }
        })
    })
    return result.join('、')
  }, [indexListData, arrValue])

  return (
    <>
      <FilterShelf
        title={intl.formatMessage({ id: 'search.fahuodi', defaultMessage: '发货地' })}
        description={description}
        onMore={handleShowPopup}
      >
        <FilterTofu
          options={options}
          ref={classifyRef}
          value={tofuValue}
          onChange={handleChange}
          multiple={multiple}
          maxLength={6}
        />
      </FilterShelf>
      <FilterPage visible={visiblePopup}>
        <View className="filter-page-page">
          <FilterShelf
            title={
              <View className="filter-page-back" onClick={handleHidePopup}>
                <Icons className="filter-page-back-icon" name="ArrowLeft-1" size={20} color="#252D37" />
                {intl.formatMessage({ id: 'search.xuanzefahuodi', defaultMessage: '选择发货地' })}
              </View>
            }
            more={false}
          />
          <FilterTofu
            options={indexListData as any}
            indexList
            defaultValue={tofuValue}
            multiple={false}
            ref={classifyRef}
          />
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

FilterOrigin.defaultProps = {
  multiple: false,
}

export default FilterOrigin
