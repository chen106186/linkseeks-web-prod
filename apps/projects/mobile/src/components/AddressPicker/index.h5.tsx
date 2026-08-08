import React, { useState, useEffect } from 'react'
import { PickerView } from '@apps/mobile-ui'
import { getProductMobileShopEnterpriseGetArea } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

import './index.scss'

export interface PickerItem {
  label: string | undefined
  value: string | undefined
  children: {
    label: string | undefined
    value: string | undefined
  }[]
}

export interface AddressListType {
  label: string | undefined
  value: string | undefined
  children: PickerItem[]
}

interface AddressPickerProps {
  // 外部值，暂不使用
  value?: any[]
  // 显示控制
  visible?: boolean
  // 传入的地区数组
  actions?: any[]
  // 选择层级
  column?: 1 | 2 | 3
  // 子元素
  children?: React.ReactChild
  // 确定方法
  onSelect?: (item: any[]) => void
}

const AddressPicker: React.FC<AddressPickerProps> = (props: AddressPickerProps) => {
  const { value, actions, column = 2, children, onSelect } = props
  const [provinceList, setProvinceList] = useState<AddressListType[]>([])
  const [addressList, setAddressList] = useState<AddressListType[]>([])
  const [selectValue, setSelectValue] = useState<any[]>([])
  const [arrValue, setArrValue] = useState<any[]>([])
  const [columns, setColumns] = useState<any[]>([])

  const intl = useIntl()

  const _normalizeList = (data: any) => {
    if (!data) {
      return []
    }
    return data.map((item: { provinceName: any; provinceCode: any; cityList: any[] }) => ({
      label: item.provinceName,
      value: item.provinceCode,
      children: item.cityList
        ? item.cityList.map((cityItem) => ({
            label: cityItem.cityName,
            value: cityItem.cityCode,
            children: [],
          }))
        : [],
    }))
  }

  /**
   * 获取地区数据
   */
  const fetchAdderssList = () => {
    getProductMobileShopEnterpriseGetArea().then((res) => {
      if (res.code === 1000) {
        setAddressList(_normalizeList(res.data))
      }
    })
  }

  const initActions = () => {
    const _selectValue: any = []
    let _list: any = []
    let _provinceList: any = []
    let _cityList: any = []
    let _countryList: any = []
    if (actions || addressList) {
      _provinceList = actions || addressList
      setProvinceList(_provinceList)
      _list.push(_provinceList)
      _selectValue[0] = _provinceList[0].value
      if (_provinceList[0].children) {
        _cityList = _provinceList[0].children as AddressListType[]
        _list.push(_cityList)
        _selectValue[1] = _provinceList[0].children[0].value
        if (_provinceList[0].children[0].children && _provinceList[0].children[0].children.length > 0) {
          _selectValue[2] = _provinceList[0].children[0].children[0].value
          _countryList = _provinceList[0].children[0].children as AddressListType[]
          _list.push(_countryList)
        }
      }
      setColumns(_list)
      setSelectValue(_selectValue)
    }
  }

  const handleSelect = () => {
    onSelect && onSelect(selectValue)
  }

  useEffect(() => {
    if (actions && actions.length > 0) {
      initActions()
    } else {
      fetchAdderssList()
    }
  }, [actions])

  useEffect(() => {
    if (actions && actions.length > 0) {
      initActions()
    }
  }, [addressList])

  /* 循环元素 */
  const mapItem = (list: any, code: string) => {
    const ArrList: any = []
    list.forEach((element: any) => {
      if (element.value === code) {
        ArrList.push(element)
      }
      return false
    })
    return ArrList
  }

  const _returnChildren = (list, code) => {
    let _children = []
    list.forEach((item) => {
      if (item.value === code) {
        _children = item.children
      }
      return false
    })
    return _children
  }

  const handlePickerChange = (val: any) => {
    if (provinceList.length <= 0) return
    const arr: any = val
    const _select: any = []
    let List = mapItem(provinceList, arr[0])
    let _list: any = [provinceList]
    let _cityList = []
    let _countryList = []
    _select[0] = List[0]?.value
    _select[1] = arr[1] || undefined
    _cityList = List[0]?.children
    if (arr[2]) {
      _select[2] = arr[2]
      _countryList = _returnChildren(List[0]?.children, arr[1])
    }
    if (_select[0] !== selectValue[0]) {
      _cityList = List[0]?.children || []
      _select[1] = List[0]?.children?.[0]?.value || ''
      arr[1] = 0

      if (List[0]?.children?.[0]?.children && List[0]?.children?.[0]?.children?.length > 0) {
        _countryList = List[0]?.children[0]?.children || []
        _select[2] = List[0]?.children[0]?.children[0]?.value || ''
        arr[2] = 0
      }
    }
    if (column === 3 && _select[1] !== selectValue[1]) {
      List.forEach((element: any) => {
        element.children.forEach((elements: any) => {
          if (elements.value === _select[1]) {
            _countryList = elements?.children || []
            _select[2] = elements?.children[0]?.value || ''
            arr[2] = 0
          }
        })
        return false
      })
    }
    if (_cityList?.length > 0) {
      _list.push(_cityList)
    }
    if (_countryList?.length > 0) {
      _list.push(_countryList)
    }
    setColumns(_list)
    setSelectValue(_select)
    setArrValue(arr)
  }

  return (
    <PickerView
      cancelText={intl.formatMessage({ id: 'addressPicker_cancel' })}
      submitText={intl.formatMessage({ id: 'addressPicker_confirm' })}
      title={intl.formatMessage({ id: 'addressPicker_title' })}
      columns={columns}
      value={arrValue}
      onConfirm={handleSelect}
      onChange={(val) => {
        handlePickerChange(val)
      }}
    >
      {children}
    </PickerView>
  )
}

export default AddressPicker
