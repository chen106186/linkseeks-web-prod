import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Select, Form, Button, message } from 'antd'
import styled from 'styled-components'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { getManageAreaAll, getManageAreaByPcodeAll } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
/**
 * 自定义 省市多项选择
 */

const RowStyleLayout = styled((props) => <div {...props} />)`
  width: 100%;

  .formwrap {
    position: relative;
    .formbutton {
      position: absolute;
      right: -95px;
      display: flex;
      width: 90px;
      :global {
        .ant-form-item {
          width: 32px;
          margin-right: 10px;
          .ant-btn {
            width: 32px;
            padding: 0;
            margin-right: 10px;
          }
        }
      }
    }
  }
`

const { Option } = Select

const MultAddress = (props) => {
  const { value: _v, mutators } = props
  const intl = useIntl()

  const {
    placeholder = [],
    warningText = intl.formatMessage({ id: 'components.qingwanshanxiangguanxinxi' }),
    onlyShowText = false,
    ...rest
  } = props.props['x-component-props'] || {}

  // 是否仅读
  const { readOnly = null } = props.props

  // 处理表单提交置空触发错误角标提示
  let value = null
  if (!_v || !_v.length) {
    value = [{ provinceCode: null, province: null, cityCode: null, city: null }]
  } else if (
    value?.length &&
    !value[0]['provinceCode'] &&
    !value[0]['province'] &&
    !value[0]['cityCode'] &&
    !value[0]['city']
  ) {
    mutators.change([])
  } else {
    value = _v
  }

  const [code, setcode] = useState<any>([])
  const [province, setprovince] = useState<any>([]) // 省列表
  const [city, setcity] = useState<any>([]) // 市列表
  const flag = useRef<boolean>(true)

  useEffect(() => {
    getManageAreaAll().then((res) => {
      if (res.code === 1000) {
        const tempProvinceData = []
        tempProvinceData.push({
          code: '0',
          name: intl.formatMessage({ id: 'components.suoyou' }),
          pcode: '0',
        })
        for (const item of res.data) {
          tempProvinceData.push({ ...item })
        }
        setprovince(tempProvinceData)
      }
    })
  }, [])

  useEffect(() => {
    value.forEach((item, index) => {
      if (item.provinceCode) {
        renderProvice([...value], item['provinceCode'], index).then(() => {
          renderCity([...value], item['cityCode'], index)
        })
      }
    })
  }, [province])

  useEffect(() => {
    if (flag.current && value[0]['provinceCode']) {
      value.forEach((item, index) => {
        renderProvice([...value], item['provinceCode'], index).then(() => {
          renderCity([...value], item['cityCode'], index)
        })
      })
      flag.current = false
    }
  }, [value])

  /**
   * 触发onChange改变值
   * @param num (1省 2市)
   * */
  const changeAddress = async (val: any, idx: number, num: number) => {
    const result = [...value]
    const cityCode: Array<any> = []
    result.forEach((item: any) => {
      if (item.cityCode) {
        cityCode.push(item.cityCode)
      }
    })
    setcode([...cityCode])
    if (num === 1) {
      // @ 省份切换 清空之前选的市
      result[idx]['city'] = intl.formatMessage({ id: 'components.suoyou' })
      result[idx]['cityCode'] = '0'
      result[idx]['cityName'] = intl.formatMessage({ id: 'components.suoyou' })
      renderProvice(result, val, idx)
    } else if (num === 2) {
      renderCity(result, val, idx)
    }
    mutators.change(result)
  }

  // 渲染省份option
  const renderProvice = async (result, val, idx) => {
    // console.log(result, val, idx, result[idx])
    await province.forEach((item) => {
      if (item.code === val) {
        getManageAreaByPcodeAll({ pcode: val }).then((res: any) => {
          if (res.code === 1000) {
            result[idx].provinceCode = val
            result[idx].province = item.name
            if (val === '0') {
              city[idx] = {
                citydata: [
                  {
                    code: '0',
                    name: intl.formatMessage({ id: 'components.suoyou' }),
                    pcode: '0',
                  },
                ],
              }
            } else {
              const tempCityList = []
              tempCityList.push({
                code: '0',
                name: intl.formatMessage({ id: 'components.suoyou' }),
                pcode: '0',
              })
              for (const cityItem of res.data) {
                tempCityList.push({ ...cityItem })
              }
              city[idx] = {
                citydata: tempCityList,
              }
            }
            setcity([...city])
          }
        })
      }
    })
  }

  // 渲染市区option
  const renderCity = (result, val, idx) => {
    city.forEach((item) => {
      item.citydata.forEach((items) => {
        if (items.code === val) {
          const cityCode = code.find((it) => items.code)
          if (cityCode !== items.code) {
            items.disabled = false
          }
          result[idx].cityCode = val
          result[idx].city = items.name
        }
      })
    })
    setcity([...city])
  }

  // @todo 对已选择的禁用
  const onDropdownVisibleChange = () => {
    // console.log(result, city, 'res')
    // return new Promise(reslove => reslove(code)).then((res: any) => {
    //   city.forEach((item: any) => {
    //     item.citydata.filter(it => {
    //       result.map(items => {
    //         if (items.cityCode === it.code) {
    //           it.disabled = true
    //         }
    //       })
    //     })
    //   })
    //   setcity([...city])
    // })
  }

  // 添加一条地址
  const addAddress = (idx: number) => {
    const address: any = {
      provinceCode: null,
      province: null,
      cityCode: null,
      city: null,
    }
    if (value[idx].provinceCode && value[idx].cityCode) {
      mutators.change([...value, address])
    } else {
      message.error(warningText)
    }
  }

  // 删除一条地址
  const removeAddress = (idx: any) => {
    const requisitionFormAddressFilter = value.filter((item: any, index: number) => index !== idx)
    const cityFilter = city.filter((item: any, index: number) => index !== idx)
    requisitionFormAddressFilter.forEach((item: any, index: number) => {
      const cityCode = code.find((it) => item.cityCode)
      if (cityCode !== item.cityCode) {
        item.disabled = false
      }
    })
    setcity(cityFilter)
    mutators.change(requisitionFormAddressFilter)
  }

  const _renderAreas = (item: any, idx: number) => {
    if (onlyShowText) {
      return (
        <div key={`paramAddress${idx}_`}>
          {item.province}/{item.city}
        </div>
      )
    } else {
      return (
        <Row gutter={10} key={`paramAddress${idx}_`} className="formwrap">
          <Col span={12}>
            <Form.Item>
              <Select
                placeholder={intl.formatMessage({ id: 'components.qingxuanze' })}
                onDropdownVisibleChange={onDropdownVisibleChange}
                onChange={(value) => {
                  changeAddress(value, idx, 1)
                }}
                value={item.provinceCode}
                disabled={readOnly}
              >
                {province.map((items) => {
                  return (
                    <Option key={`${items.id}_${idx}_province`} value={items.code}>
                      {items.name}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <Select
                placeholder={intl.formatMessage({ id: 'components.qingxuanze' })}
                onDropdownVisibleChange={onDropdownVisibleChange}
                onChange={(value) => {
                  changeAddress(value, idx, 2)
                }}
                value={item.cityCode}
                disabled={readOnly}
              >
                {item.provinceCode &&
                  city.length > 0 &&
                  city[idx] &&
                  city[idx].citydata.map((items) => {
                    return (
                      <Option disabled={items.disabled} key={`${items.id}_${idx}_city`} value={items.code}>
                        {items.name}
                      </Option>
                    )
                  })}
              </Select>
            </Form.Item>
          </Col>
          {!readOnly ? (
            <div className="formbutton">
              {idx === value.length - 1 && (
                <Form.Item>
                  <Button style={{ marginRight: 16 }} type="primary" onClick={() => addAddress(idx)}>
                    <PlusOutlined />
                  </Button>
                </Form.Item>
              )}
              {value.length > 1 && (
                <Form.Item>
                  <Button onClick={() => removeAddress(idx)}>
                    <MinusOutlined />
                  </Button>
                </Form.Item>
              )}
            </div>
          ) : null}
        </Row>
      )
    }
  }

  return <RowStyleLayout>{value.map((item: any, idx: number) => _renderAreas(item, idx))}</RowStyleLayout>
}

MultAddress.defaultProps = {}

MultAddress.isFieldComponent = true

export default MultAddress
