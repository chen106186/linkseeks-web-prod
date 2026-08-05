import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { Card as CardLayout } from '@linkseeks/ui'
import { Button, Col, Radio, Row, Drawer, Empty, Modal } from 'antd'
import style from './index.less'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { DELIVERY_SCHEMA } from './schema/delivery'
import { DISPATCH_SCHEMA } from './schema/dispatch'
import NiceForm from '@/components/NiceForm'
import AddressSelect from '@/components/AddressSelect/components/AreaSelectFormilyItem'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { getManageAreaByPcode, GetManageAreaByPcodeRequest } from '@apps/apis'
import { useFetchAreaEnumLinkageEffect } from '@/components/AddressSelect'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { isEmpty } from 'lodash'
import { getIntl } from '@linkseeks/i18n'
import { addressInfo, Context } from '../add'
import { getTelCodeOptions } from '@apps/services'

const intl = getIntl()

/** 收货地址 */
export const ADDED_DELIVERY = 1
/** 发货(自提)地址 */
export const ADDED_DISPATCH = 2
export interface addressProps {
  /** 锚点id */
  id?: string
  /** 标题 */
  title?: string
  /** 类型 */
  type?: number
  /** change */
  onChange?: Function
}

const addressSchemaAction = createFormActions()
const { onFormInputChange$ } = FormEffectHooks

export type addressList = {
  /** 发货人名称 */
  deliverName?: string
  /** 收货人名称 */
  receiverName?: string
  /** 省编号 */
  provinceCode?: string
  /** 省名称 */
  provinceName?: string
  /** 市编号 */
  cityCode?: string
  /** 市名称 */
  cityName?: string
  /** 区编号 */
  districtCode?: string
  /** 区名称 */
  districtName?: string
  /** 街道编码 */
  streetCode?: string
  /** 街道名称 */
  streetName?: string
  /** 详细地址 */
  address?: string
  /** 邮编 */
  postalCode?: string
  /** 手机区号 */
  areaCode?: string
  /** 手机号码 */
  phone?: string
  /** 电话号码 */
  tel?: string
  /** 是否默认0-否1-是 */
  isDefault?: number
}

const AddressLayout: React.FC<addressProps> = (props: addressProps) => {
  const { id, title, type, onChange } = props
  const [visible, setVisible] = useState<boolean>(false)
  const [selfInitValue, setSelfInitValue] = useState<any>({})
  const [addressList, setAddressList] = useState<addressList>({})
  const [unsaved, setUnsaved] = useState<boolean>(false)
  const context = useContext(Context)

  const handleAdded = () => {
    setVisible(true)
  }
  const renderSelectOption = (key, ctx, params?: GetManageAreaByPcodeRequest) => {
    getManageAreaByPcode({ ...params }).then((res) => {
      if (res.code === 1000) {
        const { data } = res
        ctx.setFieldState(key, (targetState) => {
          targetState.originData = data
          targetState.props.enum = data.map((v) => ({
            label: v.name,
            value: v.code,
          }))
        })
      }
    })
  }

  const useChainEffects = ($, ctx) => {
    // 初始省份选择
    renderSelectOption('provinceCode', ctx)
  }

  const fetchTelCode = async () => {
    return await getTelCodeOptions()
  }

  const area = (areaSelect) => {
    const [province, city, district, street] = areaSelect
    let newObj: addressInfo = {}
    newObj.provinceCode = province.code
    newObj.provinceName = province.name
    newObj.cityCode = city.code
    newObj.cityName = city.name
    newObj.districtCode = district.code
    newObj.districtName = district.name
    street && (newObj.streetCode = street.code)
    street && (newObj.streetName = street.name)
    return newObj
  }

  /** 新增地址 */
  const handleSubmit = async (value) => {
    console.log(value, 10086)
    const params = {
      ...value,
      ...area(value.areaSelect),
      isDefault: Number(!!value.isDefault),
    }

    delete params.areaSelect
    setAddressList(params)
    setVisible(false)
    onChange(params, type)
  }

  const handleColse = () => {
    if (unsaved) {
      Modal.confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: '您还有未保存的内容，是否确定要离开？',
        onOk() {
          setVisible(false)
          setUnsaved(false)
        },
      })
    } else {
      setVisible(false)
    }
  }

  const renderFooter = () => {
    return (
      <div style={{ textAlign: 'right' }}>
        <Button style={{ marginRight: 8 }} onClick={() => handleColse()}>
          取消
        </Button>
        <Button type="primary" onClick={() => addressSchemaAction.submit()}>
          保存
        </Button>
      </div>
    )
  }

  /** 地址拼合 */
  const handleMosaic = (provinceName, cityName, districtName, address, streetName?) => {
    const mosaic = streetName
      ? provinceName + cityName + districtName + streetName + address
      : provinceName + cityName + districtName + address
    return mosaic
  }

  const deleteOutlined = () => {
    const newObj: addressList = {}
    setSelfInitValue({})
    setAddressList(newObj)
    onChange(newObj, type)
  }

  const editOutlined = (item) => {
    const areaSelect = [
      { name: item.provinceName, code: item.provinceCode },
      { name: item.cityName, code: item.cityCode },
      { name: item.districtName, code: item.districtCode },
      { name: item.streetName, code: item.streetCode },
    ]
    const param = {
      areaSelect,
      ...item,
    }
    setSelfInitValue(param)
    setVisible(true)
  }

  useEffect(() => {
    if (context) {
      if (type === ADDED_DELIVERY) {
        onChange(context.receiveAddress, ADDED_DELIVERY)
        setAddressList(context.receiveAddress)
        console.log(context.receiveAddress, 10086)
      } else if (type === ADDED_DISPATCH) {
        onChange(context.deliverAddress, ADDED_DISPATCH)
        setAddressList(context.deliverAddress)
      }
    }
  }, [context])

  const useFields = (): any =>
    useMemo(
      () => ({
        AddressSelect,
      }),
      [],
    )

  useEffect(() => {}, [unsaved])

  return (
    <Fragment>
      <CardLayout
        id={id}
        title={title}
        extra={
          isEmpty(addressList) ? (
            <Button type="link" onClick={() => handleAdded()}>
              {intl.formatMessage({ id: 'portalSystem.xinzengdizhi', defaultMessage: '新增地址' })}
            </Button>
          ) : null
        }
      >
        <div className={style.addressList}>
          {!isEmpty(addressList) ? (
            <Radio.Group style={{ display: 'block' }}>
              <Row gutter={[48, 24]}>
                {addressList && (
                  <Col span={12}>
                    <div className={style.addressLayout}>
                      <Radio checked>
                        <div className={style.addressInfo}>
                          <div className={style.info}>
                            <div className={style.name}>
                              {type === ADDED_DELIVERY ? addressList.receiverName : addressList.deliverName}&nbsp;
                              {addressList.phone}
                            </div>
                            {addressList.isDefault ? (
                              <div className={style.default}>
                                {intl.formatMessage({ id: 'portalSystem.morendizhi', defaultMessage: '默认地址' })}
                              </div>
                            ) : null}
                          </div>
                          <div className={style.address}>
                            {handleMosaic(
                              addressList.provinceName,
                              addressList.cityName,
                              addressList.districtName,
                              addressList.address,
                              addressList.streetName,
                            )}
                          </div>
                        </div>
                        <div className={style.addressOperate}>
                          <EditOutlined className={style.icon} onClick={() => editOutlined(addressList)} />
                          <DeleteOutlined className={style.icon} onClick={() => deleteOutlined()} />
                        </div>
                      </Radio>
                    </div>
                  </Col>
                )}
              </Row>
            </Radio.Group>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      </CardLayout>
      <Drawer
        title={title}
        visible={visible}
        width={600}
        destroyOnClose
        closable
        onClose={() => handleColse()}
        footer={renderFooter()}
      >
        <NiceForm
          initialValues={selfInitValue}
          onSubmit={handleSubmit}
          actions={addressSchemaAction}
          fields={useFields()}
          effects={($, ctx) => {
            $('onFormMount').subscribe(() => {
              // 四级联动
              useChainEffects($, ctx)
            })
            useFetchAreaEnumLinkageEffect()
            useAsyncSelect('areaCode', fetchTelCode)

            onFormInputChange$().subscribe(() => {
              if (!unsaved) {
                setUnsaved(true)
              }
            })
          }}
          schema={type === ADDED_DELIVERY ? DELIVERY_SCHEMA : DISPATCH_SCHEMA}
        />
      </Drawer>
    </Fragment>
  )
}
export default AddressLayout
