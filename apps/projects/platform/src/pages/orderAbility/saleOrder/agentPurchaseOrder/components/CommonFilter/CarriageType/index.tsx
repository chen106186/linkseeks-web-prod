import React, { useState, useEffect } from 'react'
import { Checkbox } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { useHistory } from '@linkseeks/router-core'
import FilterBox from '../FilterBox'
import { FILTER_PARAM, FILTER_SEARCH_TYPE } from '../types'
import './index.less'
import { changeURLArg, removeURLArg } from '@/utils'

interface CarriageTypePropsType {
  innerValue: FILTER_PARAM | undefined
  onChange?: (values: FILTER_PARAM) => void
  filterType?: FILTER_SEARCH_TYPE
  pathname?: string
  search?: string
}

const CheckboxGroup = Checkbox.Group

const CarriageType: React.FC<CarriageTypePropsType> = (props) => {
  const { innerValue, pathname, search, filterType, onChange } = props
  const [selectKeys, setSelectKeys] = useState<number[]>([])
  const history = useHistory()
  const intl = useIntl()

  useEffect(() => {
    if (innerValue?.carriageType) {
      setSelectKeys([Number(innerValue?.carriageType)])
    } else {
      setSelectKeys([])
    }
  }, [innerValue])

  const linkToPath = (path: string) => {
    history.push(path)
  }

  const styleOptions = [
    { label: intl.formatMessage({ id: 'filter.index.carriageType_1', defaultMessage: '包邮' }), value: 1 },
    { label: intl.formatMessage({ id: 'filter.index.carriageType_2', defaultMessage: '不包邮' }), value: 2 },
  ]

  const handleChange = (checkValue: any[]) => {
    let result: any[] = []
    if (!selectKeys || (selectKeys && selectKeys.length === 0)) {
      result = checkValue
    } else {
      result = checkValue.filter((item) => item !== selectKeys[0])
    }
    if (filterType === FILTER_SEARCH_TYPE.url) {
      setSelectKeys(result)
      const url = `${pathname}${search}`
      if (result && result.length > 0) {
        if (search) {
          if (search.indexOf('carriageType') > -1) {
            linkToPath(changeURLArg(url, 'carriageType', result[0]))
          } else {
            linkToPath(`${url}&carriageType=${result[0]}`)
          }
        } else {
          linkToPath(`${url}?carriageType=${result[0]}`)
        }
      } else {
        linkToPath(removeURLArg(url, 'carriageType'))
      }
    } else {
      onChange &&
        onChange({
          ...innerValue,
          carriageType: result[0],
        })
    }
  }

  return (
    <FilterBox title={intl.formatMessage({ id: 'filter.index.carriageType' })}>
      <div className="filter_style">
        <CheckboxGroup options={styleOptions} value={selectKeys} onChange={handleChange} />
      </div>
    </FilterBox>
  )
}

export default CarriageType
