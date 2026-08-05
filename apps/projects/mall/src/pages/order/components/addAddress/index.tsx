import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Select, Form, Input, Switch } from 'antd'
import FormLabel from '@/components/FormLabel'

import isEmpty from 'lodash/isEmpty'
import {
  getLogisticsReceiverAddressGet,
  postLogisticsReceiverAddressAdd,
  postLogisticsReceiverAddressUpdate,
  getManageAreaByPcode,
} from '@apps/apis'
import { validatorByte } from '@/utils/regExp'
import { getWebIntl } from '@/utils/locales'
import { AddressItemType } from '../../address'
import { useCountryCodeList, useTelCode } from '@apps/services'
import styles from './index.module.less'

interface SeleteItemType {
  value: string
  label: string
}

// 列表带来的参数
export interface ListProps {
  title?: React.ReactNode
}
export interface ListType {
  checked: boolean // 可选
}

interface AddAddressPropsType {
  visible?: boolean
  onOk?: any
  onCancel?: any
  title?: string
  editItem?: AddressItemType
  type: 'add' | 'edit'
}

const { Option } = Select

const AddAddress: React.FC<AddAddressPropsType> = (props) => {
  const translate = getWebIntl()
  const { visible = false, title, onOk, onCancel, editItem, type } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [provinceList, setProvinceList] = useState<SeleteItemType[]>([])
  const [cityList, setCityList] = useState<SeleteItemType[]>([])
  const [districtList, setDistrictList] = useState<SeleteItemType[]>([])
  const [streetList, setStreetList] = useState<SeleteItemType[]>([])
  const [isDefault, setIsDefault] = useState<boolean>(false)
  const [form] = Form.useForm()
  const { countryCodeList } = useCountryCodeList()
  const countryCodeValue = Form.useWatch('countryCode', form)
  const { telColOptions, getTelPattern } = useTelCode()

  const initAddressItemInfo = async () => {
    if (!editItem) return
    const param: any = {
      id: editItem.id,
    }
    const addressDetailRes = await getLogisticsReceiverAddressGet(param)
    const addressDetail = addressDetailRes.data
    setIsDefault(addressDetail['isDefault'] === 0 ? false : true)
    handleProviceChange(addressDetail['provinceCode'])
    handleCityChange(addressDetail['cityCode'])
    handleDistrictChange(addressDetail['districtCode'])
    form.setFieldsValue(addressDetail)
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

      if (type === 'edit' && editItem) {
        initAddressItemInfo()
      } else {
        form.resetFields()
      }
    }
  }, [editItem, type, visible])

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

  const handleOk = () => {
    form.submit()
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

  const handleFormFinsh = (values: any) => {
    const value = { ...values }
    value.isDefault = isDefault ? 1 : 0
    value.provinceName = getNameByCode(value.provinceCode, provinceList)
    value.cityName = getNameByCode(value.cityCode, cityList)
    value.districtName = getNameByCode(value.districtCode, districtList)
    value.streetName = getNameByCode(value.streetCode, streetList)
    setConfirmLoading(true)
    let postLogisticsFn
    if (type === 'edit' && editItem) {
      value.id = editItem.id
      postLogisticsFn = postLogisticsReceiverAddressUpdate
    } else {
      postLogisticsFn = postLogisticsReceiverAddressAdd
    }

    postLogisticsFn(value)
      .then((res) => {
        setConfirmLoading(false)
        if (res.code === 1000) {
          onOk()
        }
      })
      .catch(() => {
        setConfirmLoading(false)
      })
  }

  /**
   * 当国家地区选择中国大陆时，需显示地区选择，否则不显示
   */
  const isCN = useMemo(() => {
    return countryCodeValue === 'CN'
  }, [countryCodeValue])

  return visible ? (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      width={600}
      centered
      confirmLoading={confirmLoading}
      className={styles.common_add_modal}
      onCancel={onCancel}
      maskClosable={false}
    >
      <Form layout="vertical" form={form} colon={false} onFinish={handleFormFinsh}>
        <Form.Item
          name="receiverName"
          label={<FormLabel label={translate('web.resource.logistics.shouhuoren')} />}
          rules={[
            { required: true, message: translate('web.resource.mall.qingshurushouhuoren') },
            {
              validator: (r, v, c) =>
                validatorByte(r, v, c, 20, translate('web.resource.mall.characterszifuyinei', { characters: 20 })),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={translate('web.resource.logistics.guojia_diqu')}
          name="countryCode"
          required
          rules={[
            {
              required: true,
              message: translate('web.common.qingxuanze'),
            },
          ]}
        >
          <Select style={{ width: 150 }} options={countryCodeList} />
        </Form.Item>
        {isCN && (
          <Form.Item label={<FormLabel label={translate('web.resource.mall.shouhuodizhi')} required={true} />}>
            <Input.Group compact>
              <Form.Item
                name="provinceCode"
                rules={[{ required: true, message: translate('web.resource.mall.qingxuanzeshengfenzhixiashi') }]}
                noStyle
              >
                <Select
                  placeholder={`-${translate('web.resource.mall.shengfenzhixiashi')}-`}
                  style={{ width: 130, marginRight: 14 }}
                  onChange={handleProviceChange}
                >
                  {provinceList &&
                    provinceList.map((item) => (
                      <Option key={`province_${item.value}`} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="cityCode"
                rules={[{ required: true, message: translate('web.common.qingxuanzeshi') }]}
                noStyle
              >
                <Select
                  placeholder={`-${translate('web.resource.mall.shi')}-`}
                  style={{ width: 130, marginRight: 14 }}
                  onChange={handleCityChange}
                >
                  {cityList &&
                    cityList.map((item) => (
                      <Option key={`city_${item.value}`} value={item.value}>
                        {item.label}
                      </Option>
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
                  placeholder={`-${translate('web.resource.mall.qu')}-`}
                  style={{ width: 130, marginRight: 14 }}
                  onChange={handleDistrictChange}
                >
                  {districtList &&
                    districtList.map((item) => (
                      <Option key={`district_${item.value}`} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item name="streetCode" noStyle>
                <Select placeholder={`-${translate('web.resource.mall.jiedao')}-`} style={{ width: 130 }}>
                  {streetList &&
                    streetList.map((item) => (
                      <Option key={`street_${item.value}`} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        )}
        <Form.Item
          name="address"
          label={<FormLabel label={translate('web.resource.logistics.xiangxidizhi')} />}
          rules={[{ required: true, message: translate('web.resource.mall.qingshuruxiangxidizhi') }]}
        >
          <Input placeholder={translate('web.resource.mall.qingshuruxiangxidizhilumingmenpaihao')} />
        </Form.Item>
        <Form.Item name="postalCode" label={<FormLabel label={translate('web.resource.logistics.youbian')} />}>
          <Input />
        </Form.Item>
        <Form.Item label={<FormLabel label={translate('web.resource.logistics.shoujihaoma')} required />}>
          <Input.Group compact>
            <Form.Item
              name="areaCode"
              noStyle
              rules={[{ required: true, message: translate('web.resource.mall.qingxuanzequhao') }]}
            >
              <Select placeholder={translate('web.resource.mall.quhao')} style={{ width: 128, marginRight: 16 }}>
                {telColOptions &&
                  telColOptions.map((item) => (
                    <Option key={`telCode_${item.value}`} value={item.value}>
                      {item.label}
                    </Option>
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
        <Form.Item name="tel" label={<FormLabel label={translate('web.common.telNumber')} />}>
          <Input />
        </Form.Item>
        <Form.Item name="isDefault" label={<FormLabel label={translate('web.resource.logistics.shifoumoren')} />}>
          <Switch checked={isDefault} onChange={(checked) => setIsDefault(checked)} />
        </Form.Item>
      </Form>
    </Modal>
  ) : null
}

export default AddAddress
