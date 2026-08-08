import React, { useEffect } from 'react'
import useHistory from '@/hooks/useHistory'
import { Form, Input } from 'antd'
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

const PorjectKeyword: React.FC<CarriageTypePropsType> = (props) => {
  const { innerValue, pathname, search } = props
  const history = useHistory()
  const translate = getWebIntl()
  const url = `${pathname}${search}`
  const [form] = Form.useForm()

  useEffect(() => {
    if (innerValue) {
      if (innerValue.name) {
        form.setFieldValue('keyword', innerValue.name)
      } else {
        form.setFieldValue('keyword', '')
      }
    } else {
      form.resetFields()
    }
  }, [innerValue])

  const linkToPath = (path: string) => {
    history.push(path)
  }

  const handleSearch = (value: string) => {
    if (value) {
      if (search) {
        if (search.indexOf('name') > -1) {
          linkToPath(changeURLArg(url, 'name', value))
        } else {
          linkToPath(`${url}&name=${value}`)
        }
      } else {
        linkToPath(`${url}?name=${value}`)
      }
    } else {
      linkToPath(removeURLArg(url, 'name'))
    }
  }

  return (
    <FilterBox title={translate('web.resource.mall.xiangmuguanjianci')}>
      <Form form={form}>
        <div className="filter_style">
          <Form.Item name="keyword">
            <Input.Search allowClear onSearch={handleSearch} />
          </Form.Item>
        </div>
      </Form>
    </FilterBox>
  )
}

export default PorjectKeyword
