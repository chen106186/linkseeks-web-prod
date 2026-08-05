import React, { useEffect, useMemo } from 'react'
import { Form, Input, Cascader, Row, Select, Switch, FormInstance } from '@linkseeks/ui'
import { useAreaAllList, useCountryCodeList } from '@apps/services'
import { Validator } from '@apps/validator'
import { AreaSelectFormItem } from '@apps/components'
import { CN } from '@apps/constants'
import { useWebIntl } from '@apps/locales'

export interface AddressBaseFormProps {
  type: ADDRESS_TYPE
  form?: FormInstance
}

/**
 * 地址类型
 */
export enum ADDRESS_TYPE {
  /**
   * 收货类型
   */
  RECEIVING = 1,
  /**
   * 发货类型
   */
  DELIVERY = 2,
}

const validator = new Validator()
/**
 * 地址管理表单
 *
 * 用于新增地址/编辑地址/查看地址
 */
export const AddressBaseForm = (props: AddressBaseFormProps) => {
  const { form, type } = props
  const [formInstance] = Form.useForm(form)
  const { countryCodeList, telList, defaultTelCode, getTelLength, loading: countryCodeLoading } = useCountryCodeList()
  const translate = useWebIntl()
  const telCodeValue = Form.useWatch('areaCode', formInstance)
  const countryCodeValue = Form.useWatch('countryCode', formInstance)
  const { AREA_SELECT_NAME } = AreaSelectFormItem

  // 根据传入的地址名称不同(收货，发货),给出不一样的字段名
  const nameKey = useMemo(() => {
    return type === ADDRESS_TYPE.DELIVERY ? 'shipperName' : 'receiverName'
  }, [type])

  /**
   * 当国家地区选择中国大陆时，需显示地区选择，否则不显示
   */
  const isCN = useMemo(() => {
    if (countryCodeValue) {
      return countryCodeValue === CN
    } else {
      return true
    }
  }, [countryCodeValue])

  useEffect(() => {
    if (!isCN) {
      // 如果选择了非中国地区，则自动将省市区字段设置成undefined
      formInstance.resetFields([
        'provinceCode',
        'provinceName',
        'cityCode',
        'cityName',
        'districtCode',
        'districtName',
        'streetCode',
        'streetName',
      ])
    }
  }, [isCN])

  return (
    <Form form={formInstance} labelCol={{ span: 4 }} labelAlign="left">
      <Form.Item
        name={nameKey}
        label={translate('web.resource.logistics.lianxirenxingming')}
        required
        rules={[
          validator.validateRequired({
            message: translate.formatFormInputTip(translate('web.resource.logistics.xingming')),
          }),
          validator.validateTextLength({ length: 20 }),
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={translate('web.resource.logistics.shoujihaoma')} required>
        <Row>
          <Form.Item name="areaCode" initialValue={defaultTelCode}>
            <Select style={{ width: 100 }} options={telList} loading={countryCodeLoading} />
          </Form.Item>
          <Form.Item
            style={{ flex: 1, marginLeft: 16 }}
            name="phone"
            rules={[
              validator.validateRequired({
                message: translate.formatFormInputTip(translate('web.resource.logistics.shoujihaoma')),
              }),
              validator.validateNumber({ length: getTelLength(telCodeValue) }),
            ]}
          >
            <Input />
          </Form.Item>
        </Row>
      </Form.Item>

      <Form.Item
        label={translate('web.common.telNumber')}
        name="tel"
        rules={[validator.validateNumber({ length: 20 })]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={translate('web.resource.logistics.guojia_diqu')}
        name="countryCode"
        required
        rules={[
          validator.validateRequired({
            message: translate.formatFormSelectTip(translate('web.resource.logistics.guojia_diqu')),
          }),
        ]}
      >
        <Select style={{ width: 150 }} options={countryCodeList} loading={countryCodeLoading} />
      </Form.Item>
      {isCN && (
        <AreaSelectFormItem
          name={AREA_SELECT_NAME}
          required
          rules={[validator.validateRequired({ message: translate.formatFormSelectTip(translate('web.common.diqu')) })]}
        />
      )}
      <Form.Item
        name="address"
        label={translate('web.resource.logistics.xiangxidizhi')}
        required
        rules={[
          validator.validateRequired({
            message: translate.formatFormSelectTip(translate('web.resource.logistics.xiangxidizhi')),
          }),
          validator.validateTextLength({ length: 50 }),
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={translate('web.resource.logistics.youbian')}
        name="postalCode"
        rules={[validator.validateNumber({ length: 12 })]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={translate('web.resource.logistics.morendizhi')}
        name="isDefault"
        valuePropName="checked"
        normalize={(value) => (value ? 1 : 0)}
        initialValue={0}
      >
        <Switch />
      </Form.Item>
      <Form.Item name="id" hidden></Form.Item>
      <Form.Item name="provinceCode" hidden></Form.Item>
      <Form.Item name="provinceName" hidden></Form.Item>
      <Form.Item name="cityCode" hidden></Form.Item>
      <Form.Item name="cityName" hidden></Form.Item>
      <Form.Item name="districtCode" hidden></Form.Item>
      <Form.Item name="districtName" hidden></Form.Item>
      <Form.Item name="streetCode" hidden></Form.Item>
      <Form.Item name="streetName" hidden></Form.Item>
    </Form>
  )
}

export default AddressBaseForm
