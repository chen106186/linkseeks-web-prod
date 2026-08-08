import React, { useState, useEffect } from 'react'
import useHistory from '@/hooks/useHistory'
import { Checkbox } from 'antd'
import { changeURLArg, removeURLArg } from '@/utils/getUrlParam'
import { getWebIntl } from '@/utils/locales'
import FilterBox from '../FilterBox'
import { FILTER_PARAM } from '../types'
import './index.less'

interface CarriageTypePropsType {
  innerValue: FILTER_PARAM | undefined
  onChange?: (values: FILTER_PARAM) => void
  pathname?: string
  search?: string
}

const CheckboxGroup = Checkbox.Group

const SourceType: React.FC<CarriageTypePropsType> = (props) => {
  const { innerValue, pathname, search } = props
  const [selectKeys, setSelectKeys] = useState<number[]>([])
  const history = useHistory()
  const translate = getWebIntl()

  useEffect(() => {
    if (innerValue?.type) {
      setSelectKeys([Number(innerValue?.type)])
    } else {
      setSelectKeys([])
    }
  }, [innerValue])

  const linkToPath = (path: string) => {
    history.push(path)
  }

  const styleOptions = [
    { label: translate('web.resource.order.caigouxunjia'), value: 1 },
    { label: translate('web.resource.order.caigouzhaobiao'), value: 2 },
    { label: translate('web.resource.order.caigoujingjia'), value: 3 },
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
        if (search.indexOf('type') > -1) {
          linkToPath(changeURLArg(url, 'type', result[0]))
        } else {
          linkToPath(`${url}&type=${result[0]}`)
        }
      } else {
        linkToPath(`${url}?type=${result[0]}`)
      }
    } else {
      linkToPath(removeURLArg(url, 'type'))
    }
  }

  return (
    <FilterBox title={translate('web.resource.contract.xunyuanleixing')}>
      <div className="filter_style">
        <CheckboxGroup options={styleOptions} value={selectKeys} onChange={handleChange} />
      </div>
    </FilterBox>
  )
}

export default SourceType
