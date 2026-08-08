import React, { useState, useEffect } from 'react'
import useHistory from '@/hooks/useHistory'
import { Checkbox } from 'antd'
import { changeURLArg, removeURLArg } from '@/utils/getUrlParam'
import { getWebIntl } from '@/utils/locales'
import FilterBox from '../FilterBox'
import { FILTER_PARAM, FILTER_SEARCH_TYPE } from '../types'
import './index.less'

interface CarriageTypePropsType {
  innerValue: FILTER_PARAM | undefined
  onChange?: (values: FILTER_PARAM) => void
  pathname?: string
  search?: string
}

const CheckboxGroup = Checkbox.Group

const CarriageType: React.FC<CarriageTypePropsType> = (props) => {
  const { innerValue, pathname, search, onChange } = props
  const [selectKeys, setSelectKeys] = useState<number[]>([])
  const history = useHistory()
  const translate = getWebIntl()

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
    { label: translate('web.resource.mall.carriageType1'), value: 1 },
    { label: translate('web.resource.mall.carriageType2'), value: 2 },
  ]

  const handleChange = (checkValue: any[]) => {
    let result: any[] = []
    if (!selectKeys || (selectKeys && selectKeys.length === 0)) {
      result = checkValue
    } else {
      result = checkValue.filter((item) => item !== selectKeys[0])
    }
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
  }

  return (
    <FilterBox title={translate('web.resource.mall.carriageType')}>
      <div className="filter_style">
        <CheckboxGroup options={styleOptions} value={selectKeys} onChange={handleChange} />
      </div>
    </FilterBox>
  )
}

export default CarriageType
