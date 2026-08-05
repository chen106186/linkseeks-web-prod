import React, { useEffect, useState } from 'react'
import { Tooltip, Tabs } from 'antd'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import arrowDownIcon from './arrow_down_icon.png'
import styles from './index.module.less'

export interface SelectAreaItemType {
  provinceCode: string
  provinceName: string
  letter?: string
  cityList?: CityItemType[]
  cityCode: string
  cityName: string
}

interface SelectCityProps {
  value: SelectAreaItemType | undefined
  placeholder?: string
  areaData: SelectAreaItemType[]
  onChange: (value: SelectAreaItemType) => void
}

export interface CityItemType {
  cityCode: string
  cityName: string
}

interface SortAddressListType {
  letter: string
  data: SelectAreaItemType[]
}

const { TabPane } = Tabs

const SelectCity: React.FC<SelectCityProps> = (props) => {
  const { value, placeholder, onChange, areaData } = props
  const [addressList, setAddressList] = useState<SelectAreaItemType[]>([])
  const [hotCityList, setHotCityList] = useState<SelectAreaItemType[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [sortAdressList, setSortAdressList] = useState<SortAddressListType[]>([])
  const [cityList, setCityList] = useState<CityItemType[]>([])
  const [tempProvince, setTempProvince] = useState<SelectAreaItemType>()
  const [tabActiveKey, setTabActiveKey] = useState<string>('commonlyUse')
  const translate = getWebIntl()

  // 先写死热门城市名称
  const defaultHotCity = [
    '上海市',
    '无锡市',
    '苏州市',
    '常州市',
    '南京市',
    '杭州市',
    '宁波市',
    '马鞍山市',
    '武汉市',
    '镇江市',
    '安阳市',
    '天津市',
    '合肥市',
    '邯郸市',
    '唐山市',
    '潮州市',
    '广州市',
    '南通市',
    '成都市',
    '重庆市',
  ]

  useEffect(() => {
    if (addressList && addressList.length > 0) {
      sortAreaDataByPinyin()
      getHotCityData()
    }
  }, [addressList])

  useEffect(() => {
    if (areaData && areaData.length > 0) {
      setAddressList(areaData)
    }
  }, [areaData])

  /**
   * 获取默认热门城市的省市信息
   */
  const getHotCityData = () => {
    const newList = [...addressList]
    let result: SelectAreaItemType[] = []
    for (const item of newList) {
      if (item.cityList && item.cityList.length > 0) {
        let tempCityList: CityItemType[] = []
        for (const cityItem of item.cityList) {
          if (defaultHotCity.includes(cityItem.cityName)) {
            tempCityList.push(cityItem)
          }
        }
        if (tempCityList.length > 0) {
          item.cityList = tempCityList
          result.push(item)
        }
      }
    }
    setHotCityList(result)
  }

  /**
   * 根据拼音首字母把省份排序
   */
  const sortAreaDataByPinyin = () => {
    const newList = [...addressList]

    // 2. 根据首字母对省份数组进行分组
    const newProvinceList: any[] = []
    newList.forEach((provinceItem) => {
      if (newProvinceList.every((item) => item.letter !== provinceItem.letter)) {
        newProvinceList.push({
          letter: provinceItem.letter || '',
          data: [provinceItem],
        })
      } else {
        for (let i = 0; i < newProvinceList.length; i += 1) {
          const newProvinceItem = newProvinceList[i]
          if (newProvinceItem.letter === provinceItem.letter) {
            newProvinceItem.data = [...newProvinceItem.data, provinceItem]
          }
        }
      }
    })

    // 3. 根据字母进行排序
    const sortData = newProvinceList.sort((a, b) => a.letter.localeCompare(b.letter))
    setSortAdressList(sortData)
  }

  const handleSelectCity = (currentCity: CityItemType, parentItem: SelectAreaItemType | undefined) => {
    if (parentItem) {
      const selectValue = {
        cityCode: currentCity.cityCode,
        cityName: currentCity.cityName,
        provinceCode: parentItem.provinceCode,
        provinceName: parentItem.provinceName,
      }
      onChange(selectValue)
      setVisible(false)
    }
  }

  const handleSelectProvince = (provinceInfo: SelectAreaItemType) => {
    setTempProvince(provinceInfo)
    setCityList(provinceInfo.cityList || [])
    setTabActiveKey('city')
  }

  const renderCitySelect = () => {
    return (
      <Tabs
        activeKey={tabActiveKey}
        onChange={(activeKey: string) => {
          if (activeKey === 'city') {
            if (!cityList || cityList.length === 0) {
              return
            }
          }
          setTabActiveKey(activeKey)
        }}
      >
        <TabPane tab={translate('web.resource.mall.changyong')} key="commonlyUse">
          <div className={styles.tab_body}>
            <label className={styles.hot_lable}>
              {'热门'}
              {/* 热门 */}
            </label>
            <div className={styles.city_list}>
              {hotCityList &&
                hotCityList.length > 0 &&
                hotCityList.map(
                  (item) =>
                    item.cityList &&
                    item.cityList.length > 0 &&
                    item.cityList.map((cityItem) => (
                      <div
                        key={`city_list_item_${cityItem.cityCode}`}
                        className={cx(
                          styles.select_item,
                          value && value?.cityCode === cityItem.cityCode && styles.active,
                        )}
                        onClick={() => handleSelectCity(cityItem, item)}
                        title={cityItem.cityName}
                      >
                        {cityItem.cityName}
                      </div>
                    )),
                )}
            </div>
          </div>
        </TabPane>
        <TabPane tab={translate('web.resource.mall.shengfen')} key="province">
          <div className={styles.tab_body}>
            <div className={styles.province_line_wrap}>
              {sortAdressList &&
                sortAdressList.map((item) => (
                  <div className={styles.province_line} key={`letter_${item.letter}`}>
                    <label>{item.letter}</label>
                    <div className={styles.province_list}>
                      {item.data &&
                        item.data.map((provinceItem: any) => (
                          <div
                            key={`province_${provinceItem.provinceCode}`}
                            className={cx(
                              styles.select_item,
                              tempProvince && tempProvince.provinceCode === provinceItem.provinceCode && styles.active,
                            )}
                            onClick={() => handleSelectProvince(provinceItem)}
                            title={provinceItem.provinceName}
                          >
                            {provinceItem.provinceName}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </TabPane>
        <TabPane tab={translate('web.resource.mall.chengshi')} key="city">
          <div className={styles.tab_body}>
            <div className={styles.city_list}>
              {cityList &&
                cityList.map((item) => (
                  <div
                    key={`city_${item.cityCode}`}
                    className={cx(styles.select_item, value?.cityCode === item.cityCode && styles.active)}
                    onClick={() => handleSelectCity(item, tempProvince)}
                    title={item.cityName}
                  >
                    {item.cityName}
                  </div>
                ))}
            </div>
          </div>
        </TabPane>
      </Tabs>
    )
  }

  return (
    <Tooltip
      id="Tooltip"
      placement="bottomRight"
      title={renderCitySelect()}
      color="white"
      overlayClassName={styles.tool_tip}
      open={visible}
    >
      <div className={styles.select_city} onClick={() => setVisible(!visible)}>
        <div className={styles.select_city_value}>
          {value ? (
            <span className={styles.value}>
              {value.provinceName}/{value.cityName}
            </span>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>
        <i className={styles.select_city_icon}>
          <img src={arrowDownIcon} />
        </i>
      </div>
    </Tooltip>
  )
}

export default SelectCity
