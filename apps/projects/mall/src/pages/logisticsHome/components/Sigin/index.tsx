import React, { useState, useEffect } from 'react'
import { Form, Button, Tooltip, InputNumber } from 'antd'
import { LinkTo } from '@/utils'
import { getManageAreaAll } from '@apps/apis'
import AddressSelect from './AddressSelect'
import Category from './Category'
import styles from './index.module.less'

const Sigin: React.FC = () => {
  const layout = {
    labelCol: {
      style: {
        width: '80px',
        textAlign: 'center',
      },
    },
  }
  const addressSelectDesc = {
    firstSelect: {
      id: 0,
      name: '',
    },
    secondSelect: {
      id: 0,
      name: '',
    },
    thirdSelect: {
      id: 0,
      name: '',
    },
  }

  const [addressSelectPretend, setAddressSelectPretend] = useState(addressSelectDesc)
  const [addressSelectDischarge, setAddressSelectDischarge] = useState(addressSelectDesc)
  const [categorySelect, setCategorySelect] = useState(addressSelectDesc)
  const [addressList, setAddressList] = useState<any>([])
  const [visiblePretend, setVisiblePretend] = useState(false)
  const [visibleDischarge, setVisibleDischarge] = useState(false)
  const [visibleCategory, setVisibleCategory] = useState(false)
  const [tonnage, setTonnage] = useState<number>()
  const [form] = Form.useForm()

  const fnGetAddress = () => {
    const data = {
      columnType: '9',
    }
    getManageAreaAll(data).then((res) => {
      setAddressList(res.data)
    })
  }

  /**
   *
   * @param item 选中对象
   * @param key  一句
   * @param shouldHiden 显示隐藏
   * 弹框 显示对应的选择
   */
  const fnChangeSelectAddress = (item: any, key: string, shouldHiden: boolean) => {
    if (key === 'addressSelectPretend') {
      setAddressSelectPretend({ ...item })
      if (item.thirdSelect.id) {
        setVisiblePretend(false)
      }
    } else if (key === 'addressSelectDischarge') {
      setAddressSelectDischarge({ ...item })
      if (item.thirdSelect.id) {
        setVisibleDischarge(false)
      }
    } else if (key === 'categorySelect') {
      setCategorySelect({ ...item })
      if (item.thirdSelect.id) {
        setVisibleCategory(false)
      }
    }

    if (shouldHiden) {
      setVisibleDischarge(false)
      setVisiblePretend(false)
      setVisibleCategory(false)
    }
  }
  const fnGetShowText = (item: any, key: string) => {
    let str = key
    if (item.firstSelect.id) {
      str = item.firstSelect.name
    }
    if (item.secondSelect.id) {
      str = str + '/' + item.secondSelect.name
    }
    if (item.thirdSelect.id) {
      str = str + '/' + item.thirdSelect.name
    }
    return str
  }

  const fnShowLayer = (key: string) => {
    if (key === 'visibleDischarge') {
      setVisibleDischarge(!visibleDischarge)
      setVisiblePretend(false)
      setVisibleCategory(false)
    } else if (key === 'visiblePretend') {
      setVisibleDischarge(false)
      setVisiblePretend(!visiblePretend)
      setVisibleCategory(false)
    } else if (key === 'visibleCategory') {
      setVisibleDischarge(false)
      setVisiblePretend(false)
      setVisibleCategory(!visibleCategory)
    }
  }

  /**
   * 获取城市ID
   */
  const fnGetAddressId = (newObj: any, type: string) => {
    let descCallBlack = ''
    if (!newObj) {
      return descCallBlack
    }
    if (newObj.firstSelect.id > 0 && type == 'provinceCode') {
      // 省
      descCallBlack = newObj.firstSelect.code
    }
    if (newObj.secondSelect.id && type == 'cityCode') {
      // 市
      descCallBlack = newObj.secondSelect.code
    }
    return descCallBlack
  }

  /**
   * 获取分类ID
   */
  const fnGetCategoryId = (categorySelect: any) => {
    let descCallBlack = ''
    if (!categorySelect) {
      return descCallBlack
    }
    if (categorySelect.thirdSelect.id) {
      descCallBlack = categorySelect.thirdSelect.id
    }
    if (categorySelect.secondSelect.id) {
      descCallBlack = categorySelect.secondSelect.id
    }
    if (categorySelect.firstSelect.id) {
      descCallBlack = categorySelect.firstSelect.id
    }
    return descCallBlack
  }

  /**
   * 保存搜索信息 预备跳转
   */
  const fnKeepMessage = () => {
    const provinceCodePretend = fnGetAddressId(addressSelectPretend, 'provinceCode') // 装点省份ID
    const cityCodePretend = fnGetAddressId(addressSelectPretend, 'cityCode') // 装点城市ID
    const provinceCodeDischarge = fnGetAddressId(addressSelectDischarge, 'provinceCode') // 卸点省份ID
    const cityCodeDischarge = fnGetAddressId(addressSelectDischarge, 'cityCode') // 卸点城市ID
    const categoryId = fnGetCategoryId(categorySelect) // 货类ID
    const jumpUrl = `/portal/search?tonnage=${tonnage}&provinceCodePretend=${provinceCodePretend}&cityCodePretend=${cityCodePretend}&provinceCodeDischarge=${provinceCodeDischarge}&cityCodeDischarge=${cityCodeDischarge}&categoryId=${categoryId}`
    LinkTo(jumpUrl)
  }

  const fnChangeTonnage = (e: any) => {
    console.log(e.target.value)
    console.log(Number(e.target.value).toFixed(2))
    const desc = Number(Number(e.target.value).toFixed(2))
    setTonnage(desc)
    form.setFieldsValue({ tonnage: desc })
  }
  useEffect(() => {
    fnGetAddress()
  }, [])

  return (
    <Form
      {...layout}
      name="normal_login"
      className={`${styles['login-form']} ant-form-item-bg`}
      initialValues={{ remember: true }}
      form={form}
    >
      <Form.Item label="装点" name="username" colon={false}>
        <Tooltip
          visible={visiblePretend}
          color="#ffffff"
          placement="topLeft"
          overlayClassName="tab-main-320"
          title={
            <AddressSelect
              fnCallBlack={fnChangeSelectAddress}
              fnCallBlackText="addressSelectPretend"
              selectList={addressList}
              addressSelect={addressSelectPretend}
            ></AddressSelect>
          }
        >
          <span
            style={{ color: addressSelectPretend.firstSelect.id ? '#000000' : '#cccccc' }}
            className={styles['select-value']}
            onClick={() => {
              fnShowLayer('visiblePretend')
            }}
          >
            {fnGetShowText(addressSelectPretend, '请选择装货地点')}
          </span>
        </Tooltip>
      </Form.Item>

      <Form.Item label="卸点" name="username" colon={false}>
        <Tooltip
          visible={visibleDischarge}
          color="#ffffff"
          placement="topLeft"
          overlayClassName="tab-main-320"
          title={
            <AddressSelect
              fnCallBlack={fnChangeSelectAddress}
              fnCallBlackText="addressSelectDischarge"
              selectList={addressList}
              addressSelect={addressSelectDischarge}
            ></AddressSelect>
          }
        >
          <span
            style={{ color: addressSelectDischarge.firstSelect.id ? '#000000' : '#cccccc' }}
            className={styles['select-value']}
            onClick={() => {
              fnShowLayer('visibleDischarge')
            }}
          >
            {fnGetShowText(addressSelectDischarge, '请选择卸货地点')}
          </span>
        </Tooltip>
      </Form.Item>

      <Form.Item label="货物" name="categorySelect" colon={false}>
        <Tooltip
          visible={visibleCategory}
          color="#ffffff"
          placement="topLeft"
          overlayClassName="tab-main-320"
          title={
            <Category
              fnCallBlack={fnChangeSelectAddress}
              fnCallBlackText="categorySelect"
              selectList={addressList}
              addressSelect={categorySelect}
            ></Category>
          }
        >
          <span
            style={{ color: categorySelect.firstSelect.id ? '#000000' : '#cccccc' }}
            className={styles['select-value']}
            onClick={() => {
              fnShowLayer('visibleCategory')
            }}
          >
            {fnGetShowText(categorySelect, '请选择货物类型（选填）')}
          </span>
        </Tooltip>
      </Form.Item>

      <Form.Item label="吨位" name="tonnage" colon={false}>
        <InputNumber
          placeholder="请输入货物吨数（选填）"
          min={0}
          max={10000}
          stringMode={true}
          value={tonnage}
          onBlur={(e) => {
            fnChangeTonnage(e)
          }}
          style={{ width: '100%' }}
        ></InputNumber>
        {/* <Select placeholder='请选择货物吨位（选填）'
                className='left-min-bor' value={tonnage}
                onChange={(e)=>{setTonnage(e)}}>
                    <Option value="1">50W以下</Option>
                    <Option value="2">50万~100万</Option>
                    <Option value="3">101万~500万</Option>
                    <Option value="4">501万~1000万</Option>
                </Select> */}
      </Form.Item>
      <Button
        className={styles['submit-btn']}
        type="primary"
        htmlType="submit"
        block
        onClick={fnKeepMessage}
        style={{ background: '#6278ED', position: 'relative' }}
      >
        快速找车
      </Button>
    </Form>
  )
}

export default Sigin
