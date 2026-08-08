import React, { useEffect, useImperativeHandle, useState } from 'react'
import { Modal, Form, Radio, Input, Switch, Select } from 'antd'
import { getManageAreaByPcode, postLogisticsReceiverAddressAdd, postLogisticsReceiverAddressUpdate } from '@apps/apis'
import { validatorByte } from '@/utils/regExp'
import { useTelCode } from '@apps/services'
import isEmpty from 'lodash/isEmpty'
import { useWebIntl } from '@apps/locales'

interface SeleteItemType {
  value: string
  label: string
}

interface AddressModalProps {
  currentRef?: any
  optionType: 'add' | 'edit' | 'preview'
  onOk?: () => void
}

const AddressModal: React.FC<AddressModalProps> = (props) => {
  const { currentRef, optionType = 'add', onOk } = props
  const [visible, setVisible] = useState<boolean>(false)
  const [comfirmLoading, setComfirmLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const { telColOptions, getTelPattern } = useTelCode()
  const [provinceList, setProvinceList] = useState<SeleteItemType[]>([])
  const [cityList, setCityList] = useState<SeleteItemType[]>([])
  const [districtList, setDistrictList] = useState<SeleteItemType[]>([])
  const [streetList, setStreetList] = useState<SeleteItemType[]>([])
  const translate = useWebIntl()

  const modelTitle = {
    add: translate('web.common.add'),
    edit: translate('web.common.edit'),
    preview: translate('web.common.preview'),
  }

  const fetchProvinceData = () => {
    if (isEmpty(provinceList)) {
      getManageAreaByPcode({ pcode: '100000' }).then((res: any) => {
        const list: SeleteItemType[] = []
        res.data.forEach((item: any) => {
          list.push({ label: item.name, value: item.code })
        })
        setProvinceList(list)
      })
    } else {
      setCityList([])
      setDistrictList([])
    }
  }

  useEffect(() => {
    if (visible) {
      fetchProvinceData()
      if (form) {
        setTimeout(() => {
          const provinceCode = form.getFieldValue('provinceCode')
          const cityCode = form.getFieldValue('cityCode')
          const districtCode = form.getFieldValue('districtCode')
          const streetCode = form.getFieldValue('streetCode')

          if (optionType === 'edit' && provinceCode && cityCode && districtCode) {
            handleProviceChange(provinceCode)
            handleCityChange(cityCode)
            handleDistrictChange(districtCode)
            form.setFieldsValue({
              provinceCode,
              cityCode,
              districtCode,
              streetCode,
            })
          }
        }, 500)
      }
    }
  }, [optionType, form, visible])

  useImperativeHandle(currentRef, () => ({
    form,
    visible,
    setVisible,
  }))

  const getNameByCode = (code: string, list: SeleteItemType[]) => {
    if (list && code) {
      let result = ''
      list.forEach((item) => {
        if (item.value === code) {
          result = item.label
        }
      })
      return result
    }
    return ''
  }

  const handleFormFinsh = async (values: any) => {
    const params = {
      ...values,
      isDefault: values?.isDefault ? 1 : 0,
      provinceName: getNameByCode(values.provinceCode, provinceList),
      cityName: getNameByCode(values.cityCode, cityList),
      districtName: getNameByCode(values.districtCode, districtList),
      streetName: getNameByCode(values.streetCode, streetList),
    }
    setComfirmLoading(true)
    const fn = optionType === 'edit' ? postLogisticsReceiverAddressUpdate : postLogisticsReceiverAddressAdd
    const res = await fn(params)
    setComfirmLoading(false)
    if (res.code === 1000) {
      setVisible(false)
      form.resetFields()
      onOk?.()
    }
  }

  /**
   * 根据选择的省级编号获取市数据
   * @param value
   */
  const handleProviceChange = (value: string) => {
    const list: SeleteItemType[] = []
    setCityList([])
    setDistrictList([])
    form.setFieldsValue({ cityCode: undefined, districtCode: undefined })
    getManageAreaByPcode({ pcode: value }).then((res: any) => {
      res.data.forEach((item: any) => {
        list.push({ label: item.name, value: item.code })
      })
      setCityList(list)
    })
  }

  /**
   * 根据选择的市级编号获取区数据
   * @param value
   */
  const handleCityChange = (value: string) => {
    const list: SeleteItemType[] = []
    setDistrictList([])
    form.setFieldsValue({ districtCode: undefined })
    getManageAreaByPcode({ pcode: value }).then((res: any) => {
      res.data.forEach((item: any) => {
        list.push({ label: item.name, value: item.code })
      })
      setDistrictList(list)
    })
  }

  /**
   * 根据选择的市级编号获取街道数据
   * @param value
   */
  const handleDistrictChange = (value: string) => {
    const list: SeleteItemType[] = []
    setStreetList([])
    form.setFieldsValue({ streetCode: undefined })
    getManageAreaByPcode({ pcode: value }).then((res: any) => {
      res.data.forEach((item: any) => {
        list.push({ label: item.name, value: item.code })
      })
      setStreetList(list)
    })
  }

  return (
    <Modal
      open={visible}
      title={modelTitle[optionType]}
      confirmLoading={comfirmLoading}
      centered
      onCancel={() => {
        form.resetFields()
        setVisible(false)
      }}
      onOk={() => form.submit()}
      width={650}
    >
      <Form layout="vertical" form={form} colon={false} onFinish={handleFormFinsh}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="receiverName"
          label={translate('web.resource.logistics.shouhuoren')}
          rules={[
            { required: true, message: translate('web.resource.mall.qingshurushouhuoren') },
            {
              validator: (r, v, c) => validatorByte(r, v, c, 20),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={translate('web.resource.mall.shouhuodizhi')} required>
          <Input.Group compact>
            <Form.Item
              name="provinceCode"
              rules={[{ required: true, message: translate('web.resource.mall.qingxuanzeshengfenzhixiashi') }]}
              noStyle
            >
              <Select
                placeholder={translate('web.resource.logistics.shengfenzhixiashi')}
                style={{ width: 130, marginRight: 14 }}
                onChange={handleProviceChange}
              >
                {provinceList &&
                  provinceList.map((item) => (
                    <Select.Option key={`province_${item.value}`} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="cityCode"
              rules={[{ required: true, message: translate('web.common.qingxuanzeshi') }]}
              noStyle
            >
              <Select
                placeholder={translate('web.resource.mall.city')}
                style={{ width: 130, marginRight: 14 }}
                onChange={handleCityChange}
              >
                {cityList &&
                  cityList.map((item) => (
                    <Select.Option key={`city_${item.value}`} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="districtCode"
              rules={[
                { required: districtList && districtList.length > 0, message: translate('web.common.qingxuanzequ') },
              ]}
              noStyle
            >
              <Select
                placeholder={translate('web.resource.mall.district')}
                style={{ width: 130, marginRight: 14 }}
                onChange={handleDistrictChange}
              >
                {districtList &&
                  districtList.map((item) => (
                    <Select.Option key={`district_${item.value}`} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item name="streetCode" noStyle>
              <Select placeholder={translate('web.resource.mall.street')} style={{ width: 130 }}>
                {streetList &&
                  streetList.map((item) => (
                    <Select.Option key={`street_${item.value}`} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item
          name="address"
          label={translate('web.resource.logistics.xiangxidizhi')}
          rules={[{ required: true, message: translate('web.resource.mall.qingshuruxiangxidizhi') }]}
        >
          <Input placeholder={translate('web.resource.mall.qingshuruxiangxidizhilumingmenpaihao')} />
        </Form.Item>
        <Form.Item name="postalCode" label={translate('web.resource.logistics.youbian')}>
          <Input />
        </Form.Item>
        <Form.Item label={translate('web.resource.logistics.shoujihaoma')} required>
          <Input.Group compact>
            <Form.Item
              name="areaCode"
              noStyle
              initialValue={'+86'}
              rules={[{ required: true, message: translate('web.resource.mall.qingxuanzequhao') }]}
            >
              <Select style={{ width: 128, marginRight: 16 }}>
                {telColOptions &&
                  telColOptions.map((item) => (
                    <Select.Option key={`telCode_${item.value}`} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="phone"
              dependencies={['areaCode']}
              noStyle
              rules={[
                {
                  required: true,
                  message: translate('web.resource.mall.shurunideshoujihaoma'),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve()
                    }

                    if (getTelPattern(getFieldValue('areaCode')).test(value)) {
                      return Promise.resolve()
                    } else {
                      return Promise.reject(new Error(translate('web.resource.mall.qingshuruzhengqueshoujihao')))
                    }
                  },
                }),
              ]}
            >
              <Input style={{ width: 420 }} placeholder={translate('web.resource.mall.shurunideshoujihaoma')} />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item name="tel" label={translate('web.common.telNumber')}>
          <Input />
        </Form.Item>
        <Form.Item name="isDefault" valuePropName="checked" label={translate('web.resource.logistics.shifoumoren')}>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddressModal
