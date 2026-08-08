/*
 * @Author: ghua
 * @Date: 2021-05-10 11:36:58
 * @LastEditors: ghua
 * @LastEditTime: 2021-05-11 10:16:12
 * @Description: 地区选择组件
 */
import React, { useState, Fragment, forwardRef, useEffect } from 'react'
import { Select, Radio, Space } from '@linkseeks/ui'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import cx from 'classnames'
import { isEmpty } from 'lodash'
import { getManageAreaAll } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'

interface OptionType {
  label: string
  value: string
}

interface SelectItemType {
  provinceCode: string
  province: string
  cityCode: string
  city: string
  index: number
}

interface CitySelectPropsType {
  selectData: Array<SelectItemType>
  onAdd: Function
  onReduce: Function
  onChange: Function
  showUnderAddBtn?: Boolean
}

const CityCascader: React.FC<CitySelectPropsType> = (props) => {
  const { selectData, onAdd, onReduce, onChange } = props
  const intl = useIntl()
  const [provinceData, setProvinceData] = useState<OptionType[]>([])
  const [cityData, setCityData] = useState({})
  const [type, setType] = useState<0 | 1>(0) // 0: 全国 1: 指定区域
  const [cacheSelectData, setCacheSelectData] = useState<SelectItemType[]>([]) // 缓存上一次选择
  const showUnderAddBtn = false

  const allOptions = [
    {
      city: intl.formatMessage({ id: 'components.suoyou', defaultMessage: '所有' }),
      cityCode: '0',
      index: 0,
      province: intl.formatMessage({ id: 'components.suoyou', defaultMessage: '所有' }),
      provinceCode: '0',
    },
  ]

  useEffect(() => {
    fetchAreaList()
  }, [])

  useEffect(() => {
    // 初始下默认选择全国 -》设置全国参数
    if (selectData && selectData.length > 0) {
      // 有数据情况下，校验provinceCode和cityCod， 如果都是0，则选择全国选项，如果其中有个不是0，则切换指定区域
      if (selectData.some((item) => Number(item.provinceCode) !== 0)) {
        setCacheSelectData(selectData)
        setType(1)
      } else {
        if (type === 1 && cacheSelectData.length > 0) {
          onChange(cacheSelectData)
        }
      }
    } else {
      if (type === 0) {
        onChange(allOptions)
      } else {
        if (selectData.length === 0) {
          onChange([
            {
              city: '',
              cityCode: undefined,
              province: '',
              index: 0,
              provinceCode: undefined,
            },
          ])
        }
      }
    }
  }, [type, selectData])

  /**
   * 根据省编码获取省份信息
   * @param id
   * @returns
   */
  const getProviceById = (id: number): OptionType | undefined => {
    let result: OptionType | undefined = undefined
    provinceData &&
      provinceData.map((item) => {
        if (item.value === String(id)) {
          result = item
        }
      })
    return result
  }

  /**
   * 根绝id获取区信息
   * @param id 城市编码
   * @param provinceCode 省编码
   * @returns
   */
  const getCityById = (id: number, provinceCode: string) => {
    let result = 0
    !isEmpty(cityData) &&
      cityData[provinceCode].map((item) => {
        if (item.value === id) {
          result = item
        }
      })
    return result
  }

  /**
   * 查询省市区数据
   */
  const fetchAreaList = () => {
    getManageAreaAll().then((res) => {
      initProvinceAndCityData(res.data)
    })
  }

  const initProvinceAndCityData = (areaList: any) => {
    if (!areaList) {
      return
    }
    const tempProvinceData: OptionType[] = []
    const tempCityData = {}
    for (const item of areaList) {
      tempProvinceData.push({
        label: item.name,
        value: item.code,
      })
      if (item.areaRespList) {
        const tempCityList: OptionType[] = []
        tempCityList.push({
          label: intl.formatMessage({ id: 'components.suoyou', defaultMessage: '所有' }),
          value: '0',
        })
        for (const cityItem of item.areaRespList) {
          tempCityList.push({
            label: cityItem.name,
            value: cityItem.code,
          })
        }
        tempCityData[item.code] = tempCityList
      }
    }
    setProvinceData(tempProvinceData)
    tempCityData['0'] = [
      {
        label: intl.formatMessage({ id: 'components.suoyou', defaultMessage: '所有' }),
        value: '0',
      },
    ]
    setCityData(tempCityData)
  }

  const handleProvinceChange = (value: number, index: number) => {
    const newData = JSON.parse(JSON.stringify(selectData))
    const proviceById: any = getProviceById(value)

    newData.map((item: any) => {
      if (item.index === index) {
        item.provinceCode = value
        item.province = proviceById.label
        item.cityCode = cityData[proviceById.value][0].value
        item.city = cityData[proviceById.value][0].label
      }
      return item
    })
    onChange(newData)
  }

  const onSecondCityChange = (value: number, provinceCode: string, index: number) => {
    const newData = JSON.parse(JSON.stringify(selectData))

    const cityById: any = getCityById(value, provinceCode)
    newData.map((item: any) => {
      if (item.index === index) {
        item.cityCode = cityById.value
        item.city = cityById.label
      }
      return item
    })
    onChange(newData)
  }

  const handleAddNewSelect = () => {
    onAdd({
      index: selectData.length > 0 ? selectData[selectData.length - 1].index + 1 : 0,
      provinceCode: 0,
      province: '',
      cityCode: 0,
      city: '',
    })
  }

  const handleReduceSelect = (index: number) => {
    if (selectData.length > 1) {
      onReduce(index)
    }
  }

  const checkInList = (value: string | undefined, list: OptionType[]) => {
    if (!list || !value || (list && list.length === 0)) return undefined
    const findItem = list.find((item) => item.value === value)
    if (findItem) {
      return findItem.value
    }
    return undefined
  }

  return (
    <Fragment>
      <Radio.Group
        value={type}
        onChange={(e) => {
          if (e.target.value === 0) {
            onChange(allOptions)
          } else {
            if (selectData && selectData.length === 1) {
              onChange([
                {
                  city: '',
                  cityCode: undefined,
                  province: '',
                  index: 0,
                  provinceCode: undefined,
                },
              ])
            }
          }
          setType(e.target.value)
        }}
        style={{ marginBottom: 12 }}
      >
        <Space direction="vertical">
          <Radio className={styles['city-radio-item']} value={0}>
            {intl.formatMessage({
              id: 'componnets.cityselect.type.1',
              defaultMessage: '全国',
            })}
          </Radio>
          <Radio className={styles['city-radio-item']} value={1}>
            {intl.formatMessage({
              id: 'componnets.cityselect.type.2',
              defaultMessage: '指定区域',
            })}
          </Radio>
        </Space>
      </Radio.Group>
      {selectData &&
        type === 1 &&
        selectData.map((item: any, index) => (
          <div className={styles.city_select_line} key={`selectDataItem-${index}`}>
            <Select
              style={{ flex: 1 }}
              value={checkInList(item.provinceCode, provinceData)}
              onChange={(value) => handleProvinceChange(value, item.index)}
              placeholder={intl.formatMessage({ id: 'components.qingxuanze' })}
              options={provinceData || []}
            />
            <Select
              style={{ flex: 1, marginLeft: 8, marginRight: 8 }}
              value={
                item.provinceCode && item.provinceCode !== '0'
                  ? checkInList(item.cityCode, cityData[item.provinceCode])
                  : undefined
              }
              onChange={(value) => onSecondCityChange(value, item.provinceCode, item.index)}
              placeholder={intl.formatMessage({ id: 'components.qingxuanze' })}
              options={
                (item.provinceCode || item.provinceCode === 0) && !isEmpty(cityData) ? cityData[item.provinceCode] : []
              }
            />
            <Space>
              {!showUnderAddBtn && index === selectData.length - 1 && (
                <div className={cx(styles.opration_btn, styles.add)} onClick={() => handleAddNewSelect()}>
                  <PlusOutlined />
                </div>
              )}
              <div
                className={cx(styles.opration_btn, index === 0 && styles.disabled)}
                onClick={() => {
                  if (index !== 0) {
                    handleReduceSelect(item.index)
                  }
                }}
              >
                <MinusOutlined />
              </div>
              {index !== selectData.length - 1 && !showUnderAddBtn && (
                <div className={cx(styles.opration_btn, styles.hide)}>
                  <PlusOutlined />
                </div>
              )}
            </Space>
          </div>
        ))}
      {showUnderAddBtn && (
        <div className={styles.add_line} onClick={() => handleAddNewSelect()}>
          <PlusOutlined />
          {intl.formatMessage({ id: 'components.tianjia' })}
        </div>
      )}
    </Fragment>
  )
}

const CitySelect: React.FC<CitySelectPropsType> = forwardRef((props, ref) => {
  const { selectData, onAdd, onReduce, onChange, showUnderAddBtn } = props

  return (
    <div className={styles.city_select}>
      <CityCascader
        selectData={selectData}
        onAdd={onAdd}
        onReduce={onReduce}
        onChange={onChange}
        showUnderAddBtn={showUnderAddBtn}
      />
    </div>
  )
})

CitySelect.displayName = 'CitySelect'

export default CitySelect
