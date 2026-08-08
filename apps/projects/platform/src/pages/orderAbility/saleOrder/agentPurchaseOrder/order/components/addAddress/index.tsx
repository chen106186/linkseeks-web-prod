import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Select, Form, Input, Switch } from 'antd'
import { PATTERN_MAPS } from '@/constants/regExp'
import FormLabel from '../FormLabel'
import styles from './index.less'
import { isEmpty } from 'lodash'
import {
  getLogisticsReceiverAddressGet,
  // postLogisticsReceiverAddressAdd,
  // postLogisticsReceiverAddressUpdate,
  postLogisticsReceiverAddressAgentAdd,
  postLogisticsReceiverAddressAgentUpdate,
} from '@apps/apis'
import { getManageAreaByPcode } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { AddressItemType } from '../../address'
import { AgentPurchaseOrderInfoType } from '../../../types'
import { getTelCodeOptions, useCountryCodeList, useTelCode } from '@apps/services'
import { useWebIntl } from '@apps/locales'

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
  buyerInfo: AgentPurchaseOrderInfoType
}

const { Option } = Select

const AddAddress: React.FC<AddAddressPropsType> = (props) => {
  const intl = useIntl()
  const { visible = false, title, onOk, onCancel, editItem, type, buyerInfo } = props
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [telCodeList, setTelCodeList] = useState<SeleteItemType[]>([])
  const [provinceList, setProvinceList] = useState<SeleteItemType[]>([])
  const [cityList, setCityList] = useState<SeleteItemType[]>([])
  const [districtList, setDistrictList] = useState<SeleteItemType[]>([])
  const [streetList, setStreetList] = useState<SeleteItemType[]>([])
  const [isDefault, setIsDefault] = useState<boolean>(false)
  const [form] = Form.useForm()
  const { countryCodeList } = useCountryCodeList()
  const countryCodeValue = Form.useWatch('countryCode', form)
  const { telColOptions, getTelPattern } = useTelCode()
  const translate = useWebIntl()

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

  const fetchCountryAreaTelCode = () => {
    if (isEmpty(telCodeList)) {
      getTelCodeOptions().then((data: any) => {
        setTelCodeList(data)
      })
    }
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
      fetchCountryAreaTelCode()
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
    value.memberId = buyerInfo.memberId
    value.roleId = buyerInfo.roleId
    setConfirmLoading(true)
    let postLogisticsFn
    if (type === 'edit' && editItem) {
      value.id = editItem.id
      postLogisticsFn = postLogisticsReceiverAddressAgentUpdate
    } else {
      postLogisticsFn = postLogisticsReceiverAddressAgentAdd
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
          label={<FormLabel label={intl.formatMessage({ id: 'order.addAddress.consignee' })} />}
          rules={[{ required: true, message: intl.formatMessage({ id: 'order.addAddress.enterConsignee' }) }]}
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
          <Form.Item
            label={<FormLabel label={intl.formatMessage({ id: 'order.addAddress.addressArea' })} required={true} />}
          >
            <Input.Group compact>
              <Form.Item
                name="provinceCode"
                rules={[{ required: true, message: intl.formatMessage({ id: 'order.addAddress.province' }) }]}
                noStyle
              >
                <Select
                  placeholder={intl.formatMessage({ id: 'order.addAddress.provinceList' })}
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
                rules={[{ required: true, message: intl.formatMessage({ id: 'order.addAddress.city' }) }]}
                noStyle
              >
                <Select
                  placeholder={intl.formatMessage({ id: 'order.addAddress.cityList' })}
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
                  {
                    required: districtList && districtList.length > 0,
                    message: intl.formatMessage({ id: 'order.addAddress.area' }),
                  },
                ]}
                noStyle
              >
                <Select
                  placeholder={intl.formatMessage({ id: 'order.addAddress.areaList' })}
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
              <Form.Item
                name="streetCode"
                // rules={[{ required: true, message: '请选择街道' }]}
                noStyle
              >
                <Select placeholder={intl.formatMessage({ id: 'order.addAddress.street' })} style={{ width: 130 }}>
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
          label={<FormLabel label={intl.formatMessage({ id: 'order.addAddress.DetailedAddress' })} />}
          rules={[{ required: true, message: intl.formatMessage({ id: 'order.addAddress.enterDetailedAddress' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'order.addAddress.streetTip' })} />
        </Form.Item>
        <Form.Item
          name="postalCode"
          label={<FormLabel label={intl.formatMessage({ id: 'order.addAddress.ZipCode' })} />}
        >
          <Input />
        </Form.Item>
        <Form.Item label={<FormLabel label={intl.formatMessage({ id: 'order.addAddress.phoneNumber' })} required />}>
          <Input.Group compact>
            <Form.Item
              name="areaCode"
              noStyle
              rules={[{ required: true, message: intl.formatMessage({ id: 'order.addAddress.selectareaCode' }) }]}
            >
              <Select
                placeholder={intl.formatMessage({ id: 'order.addAddress.areaCode' })}
                style={{ width: 128, marginRight: 16 }}
              >
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
                { required: true, message: intl.formatMessage({ id: 'order.addAddress.enterPhoneNumber' }) },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve()
                    }

                    if (getTelPattern(getFieldValue('areaCode')).test(value)) {
                      return Promise.resolve()
                    } else {
                      return Promise.reject(
                        new Error(
                          intl.formatMessage({
                            id: 'order.addAddress.correctNumber',
                          }),
                        ),
                      )
                    }
                  },
                }),
              ]}
            >
              <Input
                style={{ width: 420 }}
                placeholder={intl.formatMessage({ id: 'order.addAddress.enterPhoneNumber' })}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item name="tel" label={<FormLabel label={intl.formatMessage({ id: 'order.addInvoice.Telephone' })} />}>
          <Input />
        </Form.Item>
        <Form.Item
          name="isDefault"
          label={<FormLabel label={intl.formatMessage({ id: 'order.addInvoice.Default' })} />}
        >
          <Switch checked={isDefault} onChange={(checked) => setIsDefault(checked)} />
        </Form.Item>
      </Form>
    </Modal>
  ) : null
}

export default AddAddress
