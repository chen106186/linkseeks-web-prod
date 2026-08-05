/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-10 14:27:37
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 13:49:09
 * @Description: 区域选择
 */
import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import SelectItem from './SelectItem'
import { getMemberAreaCity, getMemberAreaDistrict, getMemberAreaProvince } from '@apps/apis'

function isObj(value) {
  return typeof value === 'object'
}

type AreaCodeType = {
  /**
   * 区域编码
   */
  value: string
  /**
   * 区域名称
   */
  label: string
}

const AreaSelect = (props) => {
  const { mutators, editable } = props
  const value = isObj(props.value) ? props.value : {}
  const XComponentProps = props.props['x-component-props'] || {}
  const SelectProps = {
    ...XComponentProps,
    disabled: !editable || XComponentProps.disabled,
  }

  const intl = useIntl()

  const [provinceList, setProvinceList] = useState<AreaCodeType[]>([])
  const [cityList, setCityList] = useState<AreaCodeType[]>([])
  const [districtList, setDistrictList] = useState<AreaCodeType[]>([])

  const [provinceLoading, setProvinceLoading] = useState(false)
  const [cityLoading, setCityLoading] = useState(false)
  const [districtLoading, setDistrictLoading] = useState(false)

  const [provinceValue, setProvinceValue] = useState('')
  const [cityValue, setCityValue] = useState('')
  const [districtValue, setDistrictValue] = useState('')

  const getProvinceList = async () => {
    setProvinceLoading(true)
    const res = await getMemberAreaProvince()
    if (res.code === 1000) {
      setProvinceList(res.data?.map((item) => ({ label: item.name, value: item.code })))
    }
    setProvinceLoading(false)
  }

  const getCityList = async (code: string) => {
    if (!code) {
      return
    }
    setCityLoading(true)
    const res = await getMemberAreaCity({ code })
    if (res.code === 1000) {
      setCityList(res.data?.map((item) => ({ label: item.name, value: item.code })))
    }
    setCityLoading(false)
  }

  const getDistrictList = async (code: string) => {
    if (!code) {
      return
    }
    setDistrictLoading(true)
    const res = await getMemberAreaDistrict({ code })
    if (res.code === 1000) {
      setDistrictList(res.data?.map((item) => ({ label: item.name, value: item.code })))
    }
    setDistrictLoading(false)
  }

  useEffect(() => {
    const { provinceCode, cityCode, districtCode } = value
    setProvinceValue(provinceCode)
    setCityValue(cityCode)
    setDistrictValue(districtCode)
  }, [value])

  useEffect(() => {
    getProvinceList()
  }, [])

  useEffect(() => {
    getCityList(provinceValue)
  }, [provinceValue])

  useEffect(() => {
    getDistrictList(cityValue)
  }, [cityValue])

  const handleProvinceChange = (next: string) => {
    setProvinceValue(next)
    setCityValue(undefined)
    setCityList([])
    setDistrictList([])
    setDistrictValue(undefined)
    mutators.change({ ...value, provinceCode: next, cityCode: undefined, districtCode: undefined })
  }

  const handleCityChange = (next: string) => {
    setCityValue(next)
    setDistrictList([])
    setDistrictValue(undefined)
    mutators.change({ ...value, cityCode: next, districtCode: undefined })
  }

  const handleDistrictChange = (next: string) => {
    setDistrictValue(next)
    mutators.change({ ...value, districtCode: next })
  }

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <SelectItem
            placeholder={intl.formatMessage({
              id: 'customerAbility.components.AreaSelect.province.placeholder',
              defaultMessage: '- 省 -',
            })}
            allowClear
            {...SelectProps}
            value={provinceValue}
            options={provinceList}
            loading={provinceLoading}
            onChange={handleProvinceChange}
          />
        </Col>
        <Col span={8}>
          <SelectItem
            placeholder={intl.formatMessage({
              id: 'customerAbility.components.AreaSelect.city.placeholder',
              defaultMessage: '- 市 -',
            })}
            allowClear
            {...SelectProps}
            value={cityValue}
            options={cityList}
            loading={cityLoading}
            onChange={handleCityChange}
          />
        </Col>
        <Col span={8}>
          <SelectItem
            placeholder={intl.formatMessage({
              id: 'customerAbility.components.AreaSelect.district.placeholder',
              defaultMessage: '- 县 / 区 -',
            })}
            allowClear
            {...SelectProps}
            value={districtValue}
            options={districtList}
            loading={districtLoading}
            onChange={handleDistrictChange}
          />
        </Col>
      </Row>
    </div>
  )
}

AreaSelect.isFieldComponent = true

export default AreaSelect
