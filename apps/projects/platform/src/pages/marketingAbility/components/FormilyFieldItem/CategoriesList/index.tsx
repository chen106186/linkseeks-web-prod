/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-25 14:43:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-25 16:51:33
 * @Description: formily 品牌列表
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col, Button } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { ArrayList } from '@apps/formily'
import { SchemaField } from '@apps/formily'
import { toArr, FormPath } from '@apps/formily'
import styles from './index.less'

const FormilyCategoriesList = (props) => {
  const intl = useIntl()
  const { value, className, editable, path, mutators, schema } = props
  const {} = props.props['x-component-props'] || {}

  const onAdd = () => {
    const items = Array.isArray(schema.items) ? schema.items[schema.items.length - 1] : schema.items
    mutators.push(items.getEmptyValue())
  }
  const onRemove = (index) => mutators.remove(index)

  return (
    <ArrayList value={value}>
      <div className={styles['categories-list']}>
        <Row gutter={[16, 16]}>
          {toArr(value).map((item, index) => (
            <Col key={index} span={12}>
              <div className={styles['categories-list-item-wrap']}>
                <Row gutter={16} align="middle">
                  <Col flex={1} className={styles['categories-list-item-fields']}>
                    <SchemaField path={FormPath.parse(path).concat(index)} />
                  </Col>
                  <Col>
                    <Button
                      onClick={() => onRemove(index)}
                      type="link"
                      icon={<DeleteOutlined style={{ fontSize: 14 }} />}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          ))}
          {editable && (
            <Col span={12}>
              <Button onClick={onAdd} type="dashed" className={styles['categories-list-add']}>
                <PlusOutlined />
                {intl.formatMessage({ id: 'marketingAbility.tianjia' })}
              </Button>
            </Col>
          )}
        </Row>
      </div>
    </ArrayList>
  )
}

FormilyCategoriesList.isFieldComponent = true

export default FormilyCategoriesList
