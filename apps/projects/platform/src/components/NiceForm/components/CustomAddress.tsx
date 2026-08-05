import React, { useEffect, useState, useRef } from 'react'
import { Row, Col, Select, Form } from 'antd'
import styled from 'styled-components'
import { getManageAreaAll, getManageAreaByPcodeAll } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
/**
 * 自定义省市区/县三级联动 地址选择
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
    ...rest
  } = props.props['x-component-props'] || {}

  // 处理表单提交置空触发错误角标提示
  let value = null
  if (!_v || !_v.length) {
    value = [{ provinceCode: null, province: null, cityCode: null, city: null, areaCode: null, area: null }]
  } else if (
    value?.length &&
    !value[0]['provinceCode'] &&
    !value[0]['province'] &&
    !value[0]['cityCode'] &&
    !value[0]['city'] &&
    !value[0]['areaCode'] &&
    !value[0]['area']
  ) {
    mutators.change([])
  } else {
    value = _v
  }

  const [code, setcode] = useState<any>([])
  const [province, setprovince] = useState<any>([]) // 省列表
  const [city, setcity] = useState<any>([]) // 市列表
  const [area, setarea] = useState<any>([]) // 区/县列表

  const cityAfterRef = useRef<boolean>(true)
  const areaAfterRef = useRef<boolean>(true)

  useEffect(() => {
    getAllAreaData().then((data) => {
      setprovince(data)
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
    value.forEach((item, index) => {
      if (item.cityCode) {
        renderCity([...value], item['cityCode'], index)
      }
    })
  }, [city])

  const getAllAreaData = () => {
    return new Promise((resolve) => {
      getManageAreaAll().then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  // 触发onChange改变值
  // num: 1省2市区3区/县
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
      renderProvice(result, val, idx)
    } else if (num === 2) {
      renderCity(result, val, idx)
    } else if (num === 3) {
      renderArea(result, val, idx)
    }
    mutators.change(result)
  }

  // 渲染省份option
  const renderProvice = async (result, val, idx) => {
    await province.forEach((item) => {
      if (item.code === val) {
        getManageAreaByPcodeAll({ pcode: val }).then((res: any) => {
          if (res.code === 1000) {
            result[idx].provinceCode = val
            result[idx].province = item.name
            // @ 编辑情况下 第一次不清空
            if (!cityAfterRef.current) {
              result[idx].cityCode = null
              result[idx].city = null
              result[idx].areaCode = null
              result[idx].area = null
            } else {
              cityAfterRef.current = false
            }
            city[idx] = { citydata: res.data }
            setcity([...city])
          }
        })
      }
    })
  }

  // 渲染市区option
  const renderCity = async (result, val, idx) => {
    await city.forEach((item) => {
      item.citydata.forEach((items) => {
        if (items.code === val) {
          getManageAreaByPcodeAll({ pcode: val }).then((res: any) => {
            if (res.code === 1000) {
              result[idx].cityCode = val
              result[idx].city = items.name
              // @ 编辑情况下 第一次不清空
              if (!areaAfterRef.current) {
                result[idx].areaCode = null
                result[idx].area = null
              } else {
                areaAfterRef.current = false
              }
              area[idx] = { areadata: res.data }
              setarea([...area])
            }
          })
        }
      })
    })
  }

  // 渲染县
  const renderArea = (result, val, idx) => {
    area[0].areadata.forEach((item) => {
      if (item.code === val) {
        result[idx].areaCode = val
        result[idx].area = item.name
      }
    })
    setarea([...area])
  }

  // // 触发select下拉调用
  // const onDropdownVisibleChange = () => {
  //   return new Promise(reslove => reslove(code)).then((res: any) => {
  //     city.forEach((item: any) => {
  //       item.citydata.filter(it => {
  //         res.map(items => {
  //           if (items === it.code) {
  //             it.disabled = true
  //           }
  //         })
  //       })
  //     })
  //     setcity([...city])
  //   })
  // }

  return (
    <RowStyleLayout>
      {value.map((item: any, idx: number) => {
        return (
          <Row gutter={10} key={`paramAddress${idx}_`} className="formwrap">
            <Col span={8}>
              <Form.Item>
                <Select
                  placeholder={intl.formatMessage({ id: 'components.qingxuanze' })}
                  // onDropdownVisibleChange={onDropdownVisibleChange}
                  onChange={(value) => {
                    changeAddress(value, idx, 1)
                  }}
                  value={item.provinceCode}
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
            <Col span={8}>
              <Form.Item>
                <Select
                  placeholder={intl.formatMessage({ id: 'components.qingxuanze' })}
                  // onDropdownVisibleChange={onDropdownVisibleChange}
                  onChange={(value) => {
                    changeAddress(value, idx, 2)
                  }}
                  value={item.cityCode}
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
            <Col span={8}>
              <Form.Item>
                <Select
                  placeholder={intl.formatMessage({ id: 'components.qingxuanze' })}
                  // onDropdownVisibleChange={onDropdownVisibleChange}
                  onChange={(value) => {
                    changeAddress(value, idx, 3)
                  }}
                  value={item.areaCode}
                >
                  {item.provinceCode &&
                    item.cityCode &&
                    area.length > 0 &&
                    area[idx] &&
                    area[idx].areadata.map((items) => {
                      return (
                        <Option disabled={items.disabled} key={`${items.id}_${idx}_area`} value={items.code}>
                          {items.name}
                        </Option>
                      )
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )
      })}
    </RowStyleLayout>
  )
}

MultAddress.defaultProps = {}

MultAddress.isFieldComponent = true

export default MultAddress
