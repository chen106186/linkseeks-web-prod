import React, { useState } from 'react'
import { Form, Row, Col, Input, Button, Select, DatePicker } from 'antd'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'

const { RangePicker } = DatePicker
interface SearchItemType {
  type: any
  component: any
  key: any
  placeholder: any
  span?: number
  option?: {
    label: string
    value: any
  }[]
}

interface OperationItemType {
  searchList: SearchItemType[]
  highSearchList: SearchItemType[]
}

interface SearchFormPropsType {
  option: OperationItemType
}

const SearchForm: React.FC<SearchFormPropsType> = (props) => {
  const { option } = props
  const [isHighSearch, setIsHighSearch] = useState<boolean>(false)
  const [form] = Form.useForm()
  const intl = useIntl()

  const handleSearch = () => {}

  const handleReset = () => {}

  const renderFormItemByCompnent = (detail: SearchItemType) => {
    switch (detail.component) {
      case 'Search':
        return (
          <Form.Item name={detail.key}>
            <Input.Search style={{ width: 256 }} placeholder={detail.placeholder} allowClear onSearch={handleSearch} />
          </Form.Item>
        )
      case 'Input':
        return (
          <Form.Item name={detail.key}>
            <Input style={{ width: '100%' }} placeholder={detail.placeholder} allowClear />
          </Form.Item>
        )
      case 'Select':
        return (
          <Form.Item name={detail.key}>
            <Select style={{ width: '100%' }} placeholder={detail.placeholder} allowClear>
              {detail.option.map((item, index) => (
                <Select.Option key={`option_${index}`} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )
      case 'DateRangePicker':
        return (
          <Form.Item name={detail.key}>
            <RangePicker
              style={{ width: '100%' }}
              // format={dateFormat}
            />
          </Form.Item>

          // <span className={styles.daterangegpicker_wrap}>
          //   <Form.Item
          //     name={detail.key[0]}
          //   >
          //     <DatePicker placeholder={detail.placeholder[0]} />
          //   </Form.Item>
          //   <Form.Item
          //     name={detail.key[1]}
          //   >
          //     <DatePicker placeholder={detail.placeholder[1]} />
          //   </Form.Item>
          // </span>
        )
    }
  }

  return (
    <div className={styles.search_form}>
      <Form form={form}>
        <Row>
          <Col span={24}>
            <Row gutter={[16, 16]} style={{ marginBottom: 0 }}>
              {/* <Col span={6}></Col> */}
              <Col span={18} style={{ display: 'flex', justifyContent: 'flex-start', padding: '0 8px' }}>
                {option.searchList &&
                  option.searchList.map((item, index) => (
                    <Col key={`searchList_item_${index}`}>{renderFormItemByCompnent(item)}</Col>
                  ))}
                {option.highSearchList && (
                  <Col>
                    <Button onClick={() => setIsHighSearch(!isHighSearch)}>
                      {intl.formatMessage({ id: 'components.gaojishaixuan' })}
                      {isHighSearch ? <CaretUpOutlined /> : <CaretDownOutlined />}
                    </Button>
                  </Col>
                )}
                <Col>
                  <Button onClick={() => handleReset()}>{intl.formatMessage({ id: 'components.zhongzhi' })}</Button>
                </Col>
              </Col>
            </Row>
          </Col>
          {isHighSearch && (
            <Col span={24}>
              <Row gutter={[16, 16]} justify="end">
                <Col span={24} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  {option.highSearchList &&
                    option.highSearchList.map((hignSearchItem, hignSearchIndex) => (
                      <Col key={`hignSearchList_item_${hignSearchIndex}`} span={hignSearchItem.span || 4}>
                        {renderFormItemByCompnent(hignSearchItem)}
                      </Col>
                    ))}
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  )
}

export default SearchForm
