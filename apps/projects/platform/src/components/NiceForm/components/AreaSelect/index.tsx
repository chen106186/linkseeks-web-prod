import React, { useState, useEffect } from 'react'
import { Row, Select, Col } from 'antd'
import { getMemberAreaCity, getMemberAreaDistrict, getMemberAreaProvince } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const { Option } = Select
const AreaSelect = (props: any) => {
  const { mutators } = props
  const { needName = false, ...rest } = props.props['x-component-props'] || {}
  const intl = useIntl()

  /** 省列表 */
  const [province, setProvince] = useState<any>([])
  const [provinceCode, setProvinceCode] = useState<any>('')
  const [provinceName, setProvinceName] = useState<any>('')
  /** 市列表 */
  const [city, setCity] = useState<any>([])
  const [cityCode, setCityCode] = useState<any>('')
  const [cityName, setCityName] = useState<any>('')
  /** 区列表 */
  const [district, setDistrict] = useState<any>([])
  const [districtCode, setDistrictCode] = useState<any>('')
  const [districtName, setDistrictName] = useState<any>('')
  /** 结果 */
  const [result, setResult] = useState<any>({
    provinceCode: '',
    // province: '',
    cityCode: '',
    // city: '',
    districtCode: '',
    // area: '',
  })
  const [lock, setLock] = useState<boolean>(false)

  useEffect(() => {
    manageProvince().then((data) => {
      setProvince(data)
    })
  }, [])

  useEffect(() => {
    if (lock) {
      let _index = 0
      for (let key in result) {
        if (!result[key]) {
          _index++
        }
      }
      mutators.change(_index === 0 ? result : undefined)
    }
  }, [result, lock])

  /** 获取所有地区 */
  const manageProvince = () => {
    return new Promise((resolve) => {
      getMemberAreaProvince().then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  /** 选择下拉得内容 */
  const handProvince = async (val: any, num: number) => {
    let _item: any = {}
    if (num === 1) {
      for (let i = 0; i < province.length; i++) {
        if (province[i].code === val) {
          _item = province[i]
          getMemberAreaCity({ code: val }).then((res: any) => {
            if (res.code === 1000) {
              setCity([...res.data])
            }
          })
          break
        }
      }
      setProvinceCode(val)
      setProvinceName(_item.name)
      let _result = {
        provinceCode: _item.code,
        // province: _item.name,
        cityCode: '',
        // city: '',
        districtCode: '',
        // area: '',
      }
      needName && (_result['province'] = _item.name)
      needName && (_result['areaCode'] = '')
      setResult(_result)
      setDistrict([])
      setCityCode('')
      setCityName('')
      setDistrictCode('')
      setDistrictName('')
    } else if (num === 2) {
      for (let i = 0; i < city.length; i++) {
        if (city[i].code === val) {
          _item = city[i]
          getMemberAreaDistrict({ code: val }).then((res: any) => {
            if (res.code === 1000) {
              setDistrict([...res.data])
            }
          })
          break
        }
      }
      setCityCode(val)
      setCityName(_item.name)
      let _result = {
        provinceCode: provinceCode,
        // province: provinceCode.name,
        cityCode: val,
        // city: _item.name,
        districtCode: '',
        // area: '',
      }
      needName && (_result['province'] = provinceName)
      needName && (_result['city'] = _item.name)
      needName && (_result['areaCode'] = '')
      setResult(_result)
      setDistrictCode('')
      setDistrictName('')
    } else {
      for (let i = 0; i < district.length; i++) {
        if (district[i].code === val) {
          _item = district[i]
          setDistrictCode(val)
          setDistrictName(_item.name)
          let _result = {
            provinceCode: provinceCode,
            // province: provinceCode.name,
            cityCode: cityCode,
            // city: cityCode.name,
            districtCode: _item.code,
            // area: _item.name,
          }
          needName && (_result['province'] = provinceName)
          needName && (_result['city'] = cityName)
          needName && (_result['area'] = _item.name)
          needName && (_result['areaCode'] = _item.code)
          setResult(_result)
          break
        }
      }
    }
    setLock(true)
  }

  return (
    <Row gutter={10} style={{ width: '100%' }}>
      <Col span={8}>
        <Select
          onChange={(value) => {
            handProvince(value, 1)
          }}
          value={provinceCode || undefined}
          placeholder={intl.formatMessage({ id: 'components.qingxuanzesheng' })}
          {...rest}
        >
          {province &&
            province.map((items) => (
              <Option key={`${items.code}_province`} value={items.code}>
                {items.name}
              </Option>
            ))}
        </Select>
      </Col>
      <Col span={8}>
        <Select
          onChange={(value) => {
            handProvince(value, 2)
          }}
          value={cityCode || undefined}
          placeholder={intl.formatMessage({ id: 'components.qingxuanzeshi' })}
          {...rest}
        >
          {city &&
            city.map((items) => (
              <Option key={`${items.code}_province`} value={items.code}>
                {items.name}
              </Option>
            ))}
        </Select>
      </Col>
      <Col span={8}>
        <Select
          onChange={(value) => {
            handProvince(value, 3)
          }}
          value={districtCode || undefined}
          placeholder={intl.formatMessage({ id: 'components.qingxuanzequ' })}
          {...rest}
        >
          {district &&
            district.map((items) => (
              <Option key={`${items.code}_district`} value={items.code}>
                {items.name}
              </Option>
            ))}
        </Select>
      </Col>
    </Row>
  )
}

AreaSelect.isFieldComponent = true

export default AreaSelect
