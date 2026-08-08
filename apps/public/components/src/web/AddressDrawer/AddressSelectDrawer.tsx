import {
  Drawer,
  DrawerProps,
  Form,
  Space,
  RadioCardGroup,
  Button,
  Input,
  Cascader,
  Select,
  Row,
  Switch,
} from '@linkseeks/ui'
import React, { useMemo, useRef, useState } from 'react'
import './index.less'
import { EditIcon } from '@linkseeks/icons'
import { useMemoizedFn, useRequestApi, useToggle } from '@linkseeks/hooks'
import { useAddressContext } from './AddressContext'
import { getManageAreaAll, postLogisticsShipperAddressAdd, postLogisticsShipperAddressUpdate } from '@apps/apis'
import { useAreaAllList } from '@apps/services'
export interface AddressDrawerProps extends DrawerProps {
  toggleVisible(): void
  onSubmit?(value: any): void
}

export const AddressSelectDrawer = (props: AddressDrawerProps) => {
  const { onSubmit, ...resetProps } = props
  const isEdit = useRef(false)
  const { addressList, formInstance, fetchAddressList, addressValue, handleChangeAddress } = useAddressContext()
  const [addressId, setAddressId] = useState(addressValue)
  const [formVisible, toggleFormVisible] = useToggle(false)
  const [areaList, areaListLoading, flatMaps, flatCodeMaps] = useAreaAllList()
  const { run: addApi, loading: addLoading } = useRequestApi(postLogisticsShipperAddressAdd, {
    manual: true,
    onFinally() {
      formInstance.resetFields()
      toggleFormVisible()
      fetchAddressList()
    },
  })
  const { run: editApi, loading: editLoading } = useRequestApi(postLogisticsShipperAddressUpdate, {
    manual: true,
    onFinally() {
      formInstance.resetFields()
      toggleFormVisible()
      fetchAddressList()
    },
  })

  const handleEditAddress = useMemoizedFn((address: any, e) => {
    e.stopPropagation()
    isEdit.current = true
    toggleFormVisible()
    const area: number[] = []
    address.provinceCode && area.push(flatCodeMaps[address.provinceCode].id)
    address.cityCode && area.push(flatCodeMaps[address.cityCode].id)
    address.districtCode && area.push(flatCodeMaps[address.districtCode].id)
    address.streetCode && area.push(flatCodeMaps[address.streetCode].id)
    formInstance.setFieldsValue({
      ...address,
      area,
    })
  })

  const handleAddAddress = useMemoizedFn(() => {
    isEdit.current = false
    toggleFormVisible()
  })

  const handleChange = (addressId) => {
    setAddressId(addressId)
  }

  // 地址选项列表
  const addressOptions = useMemo(() => {
    if (addressList) {
      return addressList.map((v) => {
        return {
          title: v.shipperName + ' ' + v.phone,
          desc: v.fullAddress,
          value: v.id,
          extra: <EditIcon size={18} onClick={(e) => handleEditAddress(v, e)} />,
        }
      })
    } else {
      return []
    }
  }, [addressList])

  const handleSelectAddress = () => {
    handleChangeAddress(addressId)
    props.toggleVisible()
  }
  const renderButtonParent = () => {
    return (
      <Space>
        <Button type="primary" onClick={handleAddAddress}>
          添加地址
        </Button>
        <Button type="primary" onClick={handleSelectAddress}>
          确认
        </Button>
      </Space>
    )
  }
  const renderButtonChild = () => {
    return (
      <Space>
        <Button type="primary" onClick={handleSubmit} loading={addLoading || editLoading}>
          提交
        </Button>
      </Space>
    )
  }

  const handleSubmit = async () => {
    const values = await formInstance.validateFields()
    const { area } = values
    const [provinceId, cityId, districtId, streetId] = area
    const province = flatMaps[provinceId]
    const city = flatMaps[cityId]
    const district = flatMaps[districtId]
    const street = flatMaps[streetId]
    const params = {
      ...values,
      provinceCode: province.code,
      provinceName: province.name,
      cityCode: city.code,
      cityName: city.name,
      districtCode: district?.code,
      districtName: district?.name,
      streetCode: street?.code,
      streetName: street?.name,
      isDefault: values.isDefault ? 1 : 0,
    }
    delete params.area

    if (isEdit.current) {
      editApi(params)
    } else {
      addApi(params)
    }
  }
  return (
    <Drawer title="选择地址" size="large" extra={renderButtonParent()} onClose={props.toggleVisible} {...resetProps}>
      <RadioCardGroup
        value={addressId}
        onChange={handleChange}
        options={addressOptions}
        containerStyle={{ width: '100%' }}
      />
      <Drawer title="地址操作" size="large" open={formVisible} onClose={toggleFormVisible} extra={renderButtonChild()}>
        <Form form={formInstance} labelCol={{ span: 4 }} labelAlign="left">
          <Form.Item name="shipperName" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="area" label="地区" rules={[{ required: true, message: '请选择地区' }]}>
            <Cascader options={areaList} loading={areaListLoading} />
          </Form.Item>
          <Form.Item name="address" label="详细地址" rules={[{ required: true, message: '请输入详细地址' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="手机号" required>
            <Row>
              <Form.Item name="areaCode" initialValue="+86">
                <Select style={{ width: 100 }} options={[{ label: '+86', value: '+86' }]} />
              </Form.Item>
              <Form.Item
                style={{ flex: 1, marginLeft: 16 }}
                name="phone"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input />
              </Form.Item>
            </Row>
          </Form.Item>
          <Form.Item label="电话号码" name="tel">
            <Input />
          </Form.Item>
          <Form.Item label="邮编" name="postalCode">
            <Input />
          </Form.Item>
          <Form.Item label="是否默认" name="isDefault" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="id" hidden></Form.Item>
        </Form>
      </Drawer>
    </Drawer>
  )
}
