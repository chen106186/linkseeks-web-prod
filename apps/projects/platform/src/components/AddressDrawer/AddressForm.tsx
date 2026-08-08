import { PATTERN_MAPS } from '@/constants/regExp'
import { getManageAreaByPcode } from '@apps/apis'
import { validatorByte } from '@/utils/regExp'
import { Cascader, Form, FormInstance, Input, Row, Select, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import AreaSet from './AreaSet'
import { getWebIntl } from '@apps/locales'
import { Validator } from '@apps/validator'
import { useCountryCodeList } from '@apps/services'
const FormItem = Form.Item

interface addrFormProps {
  form?: FormInstance
  title: {
    name: string
    label: string
  }
  flash: boolean
}

const translate = getWebIntl()
const validator = new Validator()
function AddressForm(props: addrFormProps) {
  const { title, flash } = props
  const [selfForm] = Form.useForm(props.form)
  const [province, setProvince] = useState([])
  const [city, setCity] = useState([])
  const [district, setDistrict] = useState([])
  const [street, setStreet] = useState([])

  const { countryCodeList, loading, telList, defaultTelCode, getTelLength } = useCountryCodeList()
  const telCodeValue = Form.useWatch('areaCode', selfForm)
  useEffect(() => {
    fetchData().then((res) => {
      setProvince(res)
      AreaSet.getInstance().setArea('province', res)

      const id = selfForm.getFieldValue('id')
      if (id) {
        //如果是编辑需要把子的select 也请求
        const provinceCode = selfForm.getFieldValue('provinceCode')
        fetchData(provinceCode).then((city) => {
          setCity(city)
          AreaSet.getInstance().setArea('city', city)
          fetchData(city[0].value).then((district) => {
            setDistrict(district)
            AreaSet.getInstance().setArea('district', district)
            fetchData(district[0].value).then((street) => {
              AreaSet.getInstance().setArea('street', street)
              setStreet(street)
            })
          })
        })
      }
    })
  }, [flash])

  /**
   * 获取地区ID下的所有字菜单
   * @param id 地区ID
   * @returns
   */
  const fetchData = (id?: string): Promise<any> => {
    return getManageAreaByPcode({ pcode: id }).then((res) =>
      res.data.map((v) => ({
        label: v.name,
        value: v.code,
      })),
    )
  }

  const handleSelectChange = (v, upTarget: string) => {
    if (upTarget === 'city') {
      fetchData(v).then((city) => {
        selfForm.setFieldsValue({ cityCode: '', districtCode: '', streetCode: '' })
        setCity(city)
        AreaSet.getInstance().setArea('city', city)
        fetchData(city[0].value).then((district) => {
          setDistrict(district)
          AreaSet.getInstance().setArea('district', district)
          fetchData(district[0].value).then((street) => {
            AreaSet.getInstance().setArea('street', street)
            setStreet(street)
          })
        })
      })
    }

    if (upTarget === 'district') {
      fetchData(v).then((district) => {
        selfForm.setFieldsValue({ districtCode: '', streetCode: '' })
        setDistrict(district)
        AreaSet.getInstance().setArea('district', district)

        fetchData(district[0].value).then((street) => {
          AreaSet.getInstance().setArea('street', street)
          setStreet(street)
        })
      })
    }

    if (upTarget === 'street') {
      fetchData(v).then((street) => {
        selfForm.setFieldsValue({ streetCode: '' })
        setStreet(street)
        AreaSet.getInstance().setArea('street', street)
      })
    }
  }

  return (
    <Form style={{ marginTop: 32 }} layout="vertical" form={selfForm}>
      <FormItem hidden name="id">
        <Input type="hidden" />
      </FormItem>

      <FormItem
        label={title.label}
        name={title.name}
        rules={[
          { required: true, message: `${title.label}${translate('web.common.bunengweikong')}` },
          { validator: (rule, value, callback) => validatorByte(rule, value, callback, 40) },
        ]}
      >
        <Input maxLength={40} />
      </FormItem>
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
        <Select style={{ width: 150 }} options={countryCodeList} loading={loading} />
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.countryCode !== curValues.countryCode}>
        {({ getFieldValue }) => {
          const countryCode = getFieldValue('countryCode')

          return (
            countryCode === 'CN' && (
              <Form.Item label={translate('web.resource.logistics.fahuodizhi')} required>
                <div className="grid gap-5 mt-5 grid-cols-4">
                  <FormItem
                    name="provinceCode"
                    rules={[{ required: true, message: translate('web.common.qingxuanzeshenfeng') }]}
                  >
                    <Select className="w-full" options={province} onChange={(v) => handleSelectChange(v, 'city')} />
                  </FormItem>

                  <FormItem
                    name="cityCode"
                    rules={[{ required: true, message: translate('web.common.qingxuanzeshi') }]}
                  >
                    <Select className="w-full" options={city} onChange={(v) => handleSelectChange(v, 'district')} />
                  </FormItem>

                  <FormItem
                    name="districtCode"
                    rules={[{ required: true, message: translate('web.common.qingxuanzequ') }]}
                  >
                    <Select className="w-full" options={district} onChange={(v) => handleSelectChange(v, 'street')} />
                  </FormItem>

                  <FormItem name="streetCode" rules={[]}>
                    <Select className="w-full" options={street} />
                  </FormItem>
                </div>
              </Form.Item>
            )
          )
        }}
      </Form.Item>
      <FormItem
        label={translate('web.resource.logistics.fahuodizhixiangqing')}
        name="address"
        rules={[
          { required: true, message: translate('web.resource.logistics.fahuodizhixiangqingbunegnweikong') },
          { validator: (rule, value, callback) => validatorByte(rule, value, callback, 60) },
        ]}
      >
        <Input maxLength={60} />
      </FormItem>

      <Form.Item label={translate('web.resource.logistics.shoujihaoma')} required>
        <Row>
          <Form.Item name="areaCode" initialValue={defaultTelCode}>
            <Select style={{ width: 100 }} options={telList} loading={loading} />
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

      <FormItem
        label={translate('web.common.telNumber')}
        name="tel"
        rules={[
          { pattern: PATTERN_MAPS.tel, message: translate('web.resource.logistics.dianhuahaomageshibuzhengque') },
        ]}
      >
        <Input />
      </FormItem>

      <FormItem label={translate('web.resource.logistics.shifoumoren')} name="isDefault">
        <Switch />
      </FormItem>
    </Form>
  )
}

export default AddressForm
