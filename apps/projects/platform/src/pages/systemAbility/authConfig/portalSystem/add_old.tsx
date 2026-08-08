import React, { Fragment, useEffect, useState } from 'react'
import { Button, Form, message, Space } from 'antd'
import { history } from '@linkseeks/router-manager'
import { usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import BasicLayout from './components/basicLayout'
import ContactLayout from './components/contactLayout'
import AddressLayout, { ADDED_DELIVERY, ADDED_DISPATCH, addressList } from './components/address'
import { getMemberStoreDetail, postMemberStoreAdd, postMemberStoreUpdate } from '@apps/apis'
import { isEmpty } from 'lodash'

const intl = getIntl()

export const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}

export type addressInfo = {
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
}

export type org = {
  /** 主键ID */
  id?: number
  /** 父节点Id */
  parentId?: number
  /** 机构标识（用于树形菜单) */
  key?: string
  /** 机构代码 */
  code?: string
  /** 机构名称 */
  title?: string
}

export type sunmitVal = {
  /** 主键id */
  id?: number
  /** 门店代码 */
  code?: string
  /** 门店名称 */
  name?: string
  /** 门店logo */
  logo?: string
  /** 详细地址 */
  address?: string
  /** 邮政编码 */
  postalCode?: string
  /** 联系人姓名 */
  contactName?: string
  /** 国家编码（手机号码前缀） */
  countryCode?: string
  /** 手机号码 */
  phone?: string
  /** 邮箱 */
  email?: string
  /** 职位 */
  position: string
  /** 所属组积机构ID */
  orgId?: string
  /** 发货(自提)地址 */
  deliverAddress?: addressList
  /** 收货地址 */
  receiveAddress?: addressList
  /** 关联组织机构 */
  org?: org
}

export const Tablink = [
  { key: 'basicLayout', label: intl.formatMessage({ id: 'portalSystem.jibenxinxi', defaultMessage: '基本信息' }) },
  { key: 'contactLayout', label: intl.formatMessage({ id: 'portalSystem.lianxixinxi', defaultMessage: '联系信息' }) },
  { key: 'address1', label: intl.formatMessage({ id: 'portalSystem.shouhuodizhi', defaultMessage: '收货地址' }) },
  {
    key: 'address2',
    label: intl.formatMessage({ id: 'portalSystem.fahuozitidizhi', defaultMessage: '发货(自提)地址' }),
  },
]

export const Context = React.createContext<sunmitVal & addressInfo>(null)

const PortalSystemAdded = (props) => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [dataSource, setDataSource] = useState<sunmitVal & addressInfo>(null)
  const [deliverAddress, setDeliverAddress] = useState<addressList>({})
  const [receiveAddress, setReceiveAddress] = useState<addressList>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState<boolean>(false)
  const [form] = Form.useForm()

  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'dealAbility.ninhaiyouweibaocundenei' }) })

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

  const handleSubmit = async () => {
    await form.validateFields().then((res) => {
      const param = {
        ...res,
        ...area(res.areaSelect),
      }
      !isEmpty(deliverAddress) && (param.deliverAddress = deliverAddress)
      !isEmpty(receiveAddress) && (param.receiveAddress = receiveAddress)
      path === 'edit' && (param.id = dataSource.id)
      delete param.areaSelect
      delete param.orgName
      setLoading(true)
      let feildGet = path === 'add' ? postMemberStoreAdd : postMemberStoreUpdate
      feildGet(param).then((res) => {
        if (res.code !== 1000) {
          setLoading(false)
          message.error(res.message)
          return
        }
        setUnsaved(false)
        setTimeout(() => {
          history.goBack()
        }, 200)
      })
      console.log(param, 10086)
    })
  }

  const handleGetAddress = (e: addressList, type: number) => {
    if (type === ADDED_DELIVERY) {
      setReceiveAddress(e)
    } else if (type === ADDED_DISPATCH) {
      setDeliverAddress(e)
    }
  }

  useEffect(() => {
    if (path === 'edit') {
      getMemberStoreDetail({ id } as any).then((res) => {
        if (res.code !== 1000) {
          message.error(res.message)
          return
        }
        const data = {
          ...res.data,
          telCode: res.data?.countryCode,
        }
        setDataSource(data)
        form.setFieldsValue(data)
      })
    }
  }, [path])

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper
        title={
          path === 'edit'
            ? intl.formatMessage({ id: 'portalSystem.bianjimendian', defaultMessage: '编辑门店' })
            : intl.formatMessage({ id: 'portalSystem.xinzengmendian', defaultMessage: '新增门店' })
        }
        items={Tablink}
        // hideBreak
        extra={
          <Button type="primary" loading={loading} onClick={() => handleSubmit()}>
            {intl.formatMessage({ id: 'portalSystem.baocun', defaultMessage: '保存' })}
          </Button>
        }
      >
        <Form
          {...layout}
          form={form}
          onValuesChange={() => {
            if (!unsaved) {
              setUnsaved(true)
            }
          }}
        >
          <Space direction="vertical" style={{ width: '100%', display: 'flex' }} size={16}>
            <BasicLayout form={form} />
            <ContactLayout form={form} />
            <AddressLayout
              id="address1"
              title={intl.formatMessage({ id: 'portalSystem.shouhuodizhi', defaultMessage: '收货地址' })}
              type={ADDED_DELIVERY}
              onChange={handleGetAddress}
            />
            <AddressLayout
              id="address2"
              title={intl.formatMessage({ id: 'portalSystem.fahuozitidizhi', defaultMessage: '发货(自提)地址' })}
              type={ADDED_DISPATCH}
              onChange={handleGetAddress}
            />
          </Space>
        </Form>
      </PageHeaderWrapper>
    </Context.Provider>
  )
}
export default PortalSystemAdded
