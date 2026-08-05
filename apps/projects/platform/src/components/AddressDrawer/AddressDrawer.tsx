import { debounceFn, throttleFn } from '@/utils/throttleFn'
import { useDebounce } from '@linkseeks/hooks'
import { Button, Col, Drawer, Form, FormInstance, Input, Radio, Row, Select, Space } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { FormatValue } from '.'
import AddressForm from './AddressForm'
import AddressRaio, { AddressRaioContext, AddressRaioContextProvider } from './AddressRaio'
import AreaSet from './AreaSet'
import styles from './AddressDrawer.less'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
interface SumbitRequest {
  add: (values?: any) => Promise<any>
  update: (values?: any) => Promise<any>
  info: (values?: any) => Promise<any>
}

/**
 * AddressDrawerProps的器
 * @param onChange 如果使用 FormItem 默认拥有onChange
 * @param formInstance 外部使用的form对象,如果不传入，那就会新建一个内部的自己管理
 * @param renderForm 重写渲染Form
 * @param sumbitRequest 表单提交的Promise 请求地址 方法
 * @param addressListRequest 获取地址列表请求地址
 * @param value 值
 * @param disabled 是否禁用
 * @param rows
 * @param showDefault 是否显示默认值
 */
interface AddressDrawerProps {
  onChange?: (val) => void
  formInstance?: FormInstance
  renderForm?: React.ReactNode
  sumbitRequest?: SumbitRequest
  addressListRequest?: (values?: any) => Promise<any>
  value?: any
  disabled?: boolean
  rows?: number
  showDefault?: boolean
  formatValue?: (value) => string
  title: {
    name: string
    label: string
  }
  className?: string
  renderText?: React.ReactNode
  hiddenBtn?: boolean
  formProps?: FormInstance
  id?: string
}

function AddressDrawer(props: AddressDrawerProps) {
  const {
    onChange,
    formInstance,
    renderForm,
    sumbitRequest,
    addressListRequest,
    value: addr,
    disabled = false,
    rows = 1,
    hiddenBtn = false,
    showDefault = false,
    formatValue = (addr) => {
      return FormatValue(addr)
    },
    title,
    className,
    renderText,
    formProps,
    id,
  } = props

  const [visible, setVisible] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [value, setValue] = useState(addr)
  const [addrForm] = Form.useForm(formInstance)
  const [addrList, setAddrList] = useState([])
  const [flash, setFlash] = useState(false)

  const handleInputChangeHooks = debounceFn((str) => {
    const val: string = str
    const reg = /.+?(省|市|自治区|自治州|镇|县|区)/g
    const maths = val.match(reg)

    if (maths && maths.length >= 3) {
      //至少 拥有省市区 才进行处理
      const slice: string = maths[maths.length - 1]
      const addressOther: string = val.slice(val.indexOf(slice) + slice.length, val.length)
      const otherSplit = addressOther.split(' ')
      let propValue = {
        provinceName: tryGetMatchValue(maths, 0),
        cityName: tryGetMatchValue(maths, 1),
        districtName: tryGetMatchValue(maths, 2),
        streetName: tryGetMatchValue(maths, 3),
        address: tryGetMatchValue(otherSplit, 0),
        receiverName: tryGetMatchValue(otherSplit, 1),
        phone: tryGetMatchValue(otherSplit, 2),
        fullAddress:
          tryGetMatchValue(maths, 0) +
          tryGetMatchValue(maths, 1) +
          tryGetMatchValue(maths, 2) +
          tryGetMatchValue(maths, 3) +
          tryGetMatchValue(otherSplit, 0),
      }

      onChange(propValue)
    }
  }, 1000)

  useEffect(() => {
    renderAddressList().then((data) => {
      if (addr) {
        // props 更新 内部状态更新 用于FormItem 的操作
        let targetValue = formatValue(addr)

        if (targetValue !== 'undefined  ') {
          setValue(targetValue)
        }
      } else if (showDefault) {
        // 如果没有默认值，且设置了 showDefault
        const target = data.find((v) => v.isDefault === 1)
        if (target != undefined && formProps !== undefined) {
          formProps.setFieldsValue({
            [id]: target,
          })
        }
      }
    })
  }, [addr])

  //地址提交
  function sumbitAddressForm() {
    addrForm.validateFields().then((values) => {
      values.isDefault = values.isDefault ? 1 : 0
      values.provinceName = AreaSet.getInstance().getProvinceNameByCode(values.provinceCode)
      values.cityName = AreaSet.getInstance().getCityNameByCode(values.cityCode)
      values.districtName = AreaSet.getInstance().getDistrictNameByCode(values.districtCode)
      values.streetName = AreaSet.getInstance().getStreetNameByCode(values.streetCode)
      values.id ? handleSumbitRequest(sumbitRequest.update(values)) : handleSumbitRequest(sumbitRequest.add(values))
    })
  }

  function renderAddressList() {
    return addressListRequest().then((res) => {
      setAddrList(res.data)
      return res.data
    })
  }

  // 添加新的地址
  function handleSumbitRequest(promise: Promise<any>) {
    promise.then((res) => {
      renderAddressList()
      setShowForm(false)
    })
  }

  function renderAddressForm() {
    return renderForm ? renderForm : <AddressForm flash={flash} title={title} form={addrForm} />
  }

  const renderAddressFormBtnGroup = () => {
    if (showForm) {
      return (
        <Button type="primary" onClick={sumbitAddressForm}>
          {translate('web.common.submit')}
        </Button>
      )
    } else {
      return (
        <Button
          type="primary"
          onClick={() => {
            setVisible(false)
          }}
        >
          {translate('web.common.confirm')}
        </Button>
      )
    }
  }

  const handleInputChange = (e) => {
    const targetValue = e.target.value
    setValue(targetValue)
    handleInputChangeHooks(targetValue)
  }

  const tryGetMatchValue = (maths, i) => {
    try {
      return maths[i] || ''
    } catch {
      return ''
    }
  }

  return (
    <AddressRaioContextProvider value={addrList}>
      {renderText ? (
        <div className={styles.renderText} onClick={() => setVisible(true)}>
          {renderText}
        </div>
      ) : (
        <Row className={className} gutter={10}>
          <Col span={hiddenBtn ? 24 : 20}>
            <Input.TextArea rows={rows} disabled={true} value={value} onChange={handleInputChange} />
          </Col>
          {!hiddenBtn && (
            <Col span={4}>
              <Button disabled={disabled} className="w-full" onClick={() => setVisible(true)}>
                {translate('web.common.dizhiguanli')}
              </Button>
            </Col>
          )}
        </Row>
      )}
      <Drawer
        width={600}
        visible={visible}
        onClose={() => setVisible(false)}
        title={translate('web.common.dizhiguanli')}
        footer={<Button.Group>{renderAddressFormBtnGroup()}</Button.Group>}
      >
        <Radio.Group
          className="w-full"
          onChange={(e) => {
            const value = e.target.value
            setValue(JSON.parse(value))
            onChange(JSON.parse(value))
          }}
        >
          <Space className="w-full" direction="vertical">
            <AddressRaio
              info={sumbitRequest?.info}
              onEdit={(addr) => {
                setShowForm(true)
                addrForm.setFieldsValue(addr)
                setFlash(!flash)
              }}
            />
          </Space>
        </Radio.Group>

        <Button className="mt-10" onClick={() => setShowForm(true)}>
          {translate('web.resource.logistics.xinzengdizhi')}
        </Button>

        {showForm && renderAddressForm()}
      </Drawer>
    </AddressRaioContextProvider>
  )
}

export default AddressDrawer
