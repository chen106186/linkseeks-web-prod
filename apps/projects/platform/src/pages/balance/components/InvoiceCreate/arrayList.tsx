import React from 'react'

import { SchemaField, SchemaMarkupField as Field } from '@apps/formily'
import { ArrayList } from '@apps/formily'
import { toArr, isFn, FormPath } from '@apps/formily'
import styles from './arrayList.less'
import { MinusOutlined, PlusOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
const ArrayCustom = (props) => {
  const { value, schema, className, editable, path, mutators } = props
  const xComponentProps = props.props['x-component-props']

  const onAdd = () => {
    const items = Array.isArray(schema.items) ? schema.items[schema.items.length - 1] : schema.items
    mutators.push(items.getEmptyValue())
  }

  return (
    <ArrayList
      value={value}
      minItems={schema.minItems}
      maxItems={schema.maxItems}
      // editable={editable}
    >
      {xComponentProps?.header || null}
      {toArr(value).map((item, index) => {
        return (
          <div className={styles.container} key={index}>
            <SchemaField path={FormPath.parse(path).concat(index)} />
            {!xComponentProps.disabled && (
              <div className={styles.remove} onClick={() => mutators.remove(index)}>
                <MinusOutlined />
              </div>
            )}
          </div>
        )
      })}
      {!xComponentProps.disabled && (
        <div className={styles.add} onClick={onAdd}>
          <PlusOutlined size={12} />
          <span className={styles.addText}>{intl.formatMessage({ id: 'balance.tianjia' })}</span>
        </div>
      )}
    </ArrayList>
  )
}

ArrayCustom.isFieldComponent = true

export default ArrayCustom
