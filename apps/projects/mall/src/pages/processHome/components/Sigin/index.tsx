import React, { useState, useEffect } from 'react'
import { Form, Button, Tooltip, InputNumber, Select, Input } from 'antd'
import { LinkTo } from '@/utils'
import { getManageAreaAll } from '@apps/apis'
import AddressSelect from './AddressSelect'
import Category from './Category'
import styles from './index.module.less'

const { Option } = Select
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
  const [machining, setMachining] = useState<any>()
  const [scale, setScale] = useState<any>()
  const fnGetAddress = () => {
    const data = {
      columnType: '9',
    }
    getManageAreaAll(data).then((res) => {
      setAddressList(res.data)
    })
  }

  const fnChangeSelectAddress = (item: any, key: string, shouldHiden: boolean) => {
    if (key === 'addressSelectPretend') {
      setAddressSelectPretend({ ...item })
      if (item.thirdSelect.id) {
        setVisiblePretend(false)
      }
    } else if (key === 'addressSelectDischarge') {
      console.log(item)
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
  /**
   *
   * @param key 弹框的依据
   */
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
   * 修改加工数量
   */
  const fnChangeMachining = (num: string) => {
    setMachining(num)
  }
  /**
   * 修改工厂规模
   */
  const fnChangeScale = (e: any) => {
    console.log(e)
    setScale(e)
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
  const fnKeepMessage = () => {
    const categoryId = fnGetAddressId(categorySelect, 'cityCode') // 加工货物
    const provinceCode = fnGetAddressId(addressSelectDischarge, 'provinceCode') // 加工地区省份ID
    const cityCode = fnGetAddressId(addressSelectDischarge, 'cityCode') // 加工地区城市ID                             // 货类ID
    const jumpUrl = `/portal/search?machining=${machining}&scale=${scale}&provinceCode=${provinceCode}&cityCode=${cityCode}&categoryId=${categoryId}`
    LinkTo(jumpUrl)
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
    >
      <Form.Item label="加工货物" name="username" colon={false}>
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
            {fnGetShowText(categorySelect, '请选择加工货物种类')}
          </span>
        </Tooltip>
      </Form.Item>

      <Form.Item label="加工地区" name="username" colon={false}>
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
            {fnGetShowText(addressSelectDischarge, '请选择加工地区（选填）')}
          </span>
        </Tooltip>
      </Form.Item>

      <Form.Item label="加工数量" name="machining" colon={false}>
        <Input
          value={machining}
          onChange={(e) => {
            fnChangeMachining(e.target.value)
          }}
          className="left-min-bor"
          placeholder="请选择加工数量（选填）"
        />
      </Form.Item>

      <Form.Item label="工厂规模" name="scale" colon={false}>
        <Select
          value={scale}
          onChange={(e) => {
            fnChangeScale(e)
          }}
          className="left-min-bor"
          placeholder="请选择年加工额范围（选填）"
        >
          <Option value="1">50W以下</Option>
          <Option value="2">50万~100万</Option>
          <Option value="3">101万~500万</Option>
          <Option value="4">501万~1000万</Option>
        </Select>
      </Form.Item>
      <Button
        className={styles['submit-btn']}
        type="primary"
        htmlType="submit"
        block
        onClick={fnKeepMessage}
        style={{ position: 'relative' }}
      >
        提交
      </Button>
    </Form>
  )
}

export default Sigin
