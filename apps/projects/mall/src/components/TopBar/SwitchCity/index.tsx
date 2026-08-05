/*
 * @Author: GHua
 * @Date: 2022-02-15 09:49:51
 * @LastEditTime: 2022-03-07 14:46:52
 * @LastEditors: GHua
 * @Description: 商城切换城市组件
 */
import React, { useEffect } from 'react'
import { AutoComplete, Input } from 'antd'
import cx from 'classnames'
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons'
import { getWebIntl } from '@/utils/locales'
import { UseAreaDataRes, AreaDataItemType, SelectAreaItemType, SearchOption } from './types'
import styles from './index.module.less'

interface SwitchCityProps {
  value: SelectAreaItemType | undefined
  hook: () => UseAreaDataRes
  onSelect?: (selectItem: SelectAreaItemType) => void
}

const SwitchCity: React.FC<SwitchCityProps> = (props) => {
  const translate = getWebIntl()
  const { value, hook, onSelect } = props
  const {
    visible,
    currentActive,
    selectProvince,
    selectCity,
    areaData,
    directlyCityList,
    cityList,
    searchOptions,
    dispatchProvince,
    dispatchCity,
    dispatchSearchValue,
    onSearchSelect,
    toggleVisible,
  } = hook()

  const initSelect = (selectInfo: SelectAreaItemType) => {
    const provincInfo = areaData.filter((item) => item.provinceCode === selectInfo.provinceCode)[0]
    if (provincInfo) {
      dispatchProvince(provincInfo)
      if (provincInfo.cityList.length > 1) {
        const cityInfo = provincInfo.cityList.filter((item) => item.cityCode === selectInfo.cityCode)[0]
        cityInfo && dispatchCity(cityInfo)
      }
    }
  }

  useEffect(() => {
    if (value && areaData.length > 0) {
      initSelect(value)
    }
  }, [value, areaData])

  const handleSelectProvice = (provinceInfo: AreaDataItemType) => {
    dispatchProvince(provinceInfo)
  }

  const handleSelectArea = (selectInfo: SelectAreaItemType) => {
    const urbanDistricts = '市辖区'
    if (selectInfo.cityList && selectInfo.cityList.length > 1) {
      dispatchCity({
        cityCode: selectInfo.cityCode,
        cityName: selectInfo.cityName,
      })
    } else {
      dispatchCity(undefined)
    }

    if (selectInfo && onSelect) {
      onSelect({
        provinceCode: selectInfo.provinceCode,
        provinceName: selectInfo.provinceName,
        cityCode: selectInfo.cityCode,
        cityName: selectInfo.cityName === urbanDistricts ? selectInfo.provinceName : selectInfo.cityName,
      })
      toggleVisible()
    }
  }

  return (
    <div className={styles.switch_city}>
      {value && (
        <div className={styles.current_city} onClick={toggleVisible}>
          <EnvironmentOutlined className={styles.icon} translate={undefined} />
          <span>{value?.cityName}</span>
        </div>
      )}
      {visible && (
        <>
          <div className={styles.switch_city_mask} onClick={toggleVisible} />
          <div className={styles.switch_city_panel}>
            <div className={styles.switch_city_body}>
              <div className={styles.switch_city_search}>
                <AutoComplete
                  className={styles.switch_city_search_autoComplete}
                  options={searchOptions}
                  onSearch={(searchText: string) => dispatchSearchValue(searchText)}
                  onSelect={(_, option) => {
                    const selectInfo = onSearchSelect(option as SearchOption)
                    selectInfo && handleSelectArea(selectInfo)
                  }}
                  getPopupContainer={(triggerNode) => triggerNode}
                >
                  <Input
                    className={styles.switch_city_search_autoComplete_input}
                    placeholder={translate('web.common.search')}
                  />
                </AutoComplete>
                <SearchOutlined translate={undefined} className={styles.search_icon} />
              </div>
              <div className={styles.switch_city_select_city_line}>
                <div
                  className={cx(
                    styles.switch_city_select_city_line_item,
                    currentActive === 'province' && styles.active_select,
                  )}
                  onClick={() => {
                    dispatchCity(undefined)
                  }}
                >
                  <span className={styles.switch_city_select_city_line_item_text}>
                    {selectProvince ? selectProvince.provinceName : translate('web.common.qingxuanze')}
                  </span>
                </div>
                <div
                  className={cx(
                    styles.switch_city_select_city_line_item,
                    currentActive === 'city' && styles.active_select,
                  )}
                >
                  <span className={styles.switch_city_select_city_line_item_text}>
                    {selectCity ? selectCity.cityName : translate('web.common.qingxuanze')}
                  </span>
                </div>
              </div>
              {currentActive === 'province' ? (
                <>
                  <div className={styles.switch_city_select_hot_line}>
                    {directlyCityList &&
                      directlyCityList.length > 0 &&
                      directlyCityList.map((directlyCityItem) => (
                        <div
                          className={cx(
                            styles.switch_city_select_item,
                            selectProvince?.provinceCode === directlyCityItem.provinceCode && styles.active,
                          )}
                          key={directlyCityItem.provinceCode}
                          onClick={() => {
                            const provincInfo: AreaDataItemType = {
                              provinceCode: directlyCityItem.provinceCode,
                              provinceName: directlyCityItem.provinceName,
                              cityList: directlyCityItem.cityList,
                            }
                            dispatchProvince(provincInfo)
                            handleSelectArea({
                              ...provincInfo,
                              ...provincInfo.cityList[0],
                            })
                          }}
                        >
                          <span>{directlyCityItem.provinceName}</span>
                        </div>
                      ))}
                  </div>
                  <div className={styles.switch_city_select_list}>
                    {areaData &&
                      areaData.length > 0 &&
                      areaData.map((item) => (
                        <div
                          className={cx(
                            styles.switch_city_select_item,
                            selectProvince?.provinceCode === item.provinceCode && styles.active,
                          )}
                          key={item.provinceCode}
                          onClick={() => handleSelectProvice(item)}
                        >
                          <span>{item.provinceName}</span>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <div className={styles.switch_city_select_list}>
                  {cityList &&
                    cityList.length > 0 &&
                    cityList.map((item) => (
                      <div
                        className={cx(
                          styles.switch_city_select_item,
                          selectCity?.cityCode === item.cityCode && styles.active,
                        )}
                        key={item.cityCode}
                        onClick={() =>
                          handleSelectArea({
                            ...selectProvince,
                            ...item,
                          } as SelectAreaItemType)
                        }
                      >
                        <span>{item.cityName}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SwitchCity
