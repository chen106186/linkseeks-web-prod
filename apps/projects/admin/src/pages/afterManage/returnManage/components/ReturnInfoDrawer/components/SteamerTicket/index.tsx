/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-18 17:44:26
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-22 11:26:59
 * @Description:
 */
import React from 'react'
import { SchemaField, FormPath, toArr, ArrayList } from '@apps/formily'
import styled from 'styled-components'
import Stamp from '../../../Stamp'

const SteamerWrap = styled((props) => <div {...props} />)`
  .ant-form-item {
    margin-bottom: 0;
  }
  .mega-layout-container-content {
    &.grid {
      grid-row-gap: 0 !important;
    }
  }
`

const ArrayCustom = (props) => {
  const { value, schema, className, editable, path, mutators } = props
  const {
    renderAddition,
    renderRemove,
    renderMoveDown,
    renderMoveUp,
    renderEmpty,
    renderExtraOperations,
    ...componentProps
  } = schema.getExtendsComponentProps() || {}

  return (
    <SteamerWrap>
      <ArrayList
        value={value}
        minItems={schema.minItems}
        maxItems={schema.maxItems}
        editable={editable}
        components={{}}
        renders={{
          renderAddition,
          renderRemove,
          renderMoveDown,
          renderMoveUp,
          renderEmpty, // 允许开发者覆盖默认
        }}
      >
        {toArr(value).map((item, index) => {
          return (
            <div {...componentProps} key={index}>
              <Stamp imprinted>
                <SchemaField path={FormPath.parse(path).concat(index)} />
              </Stamp>
            </div>
          )
        })}
      </ArrayList>
    </SteamerWrap>
  )
}

ArrayCustom.isFieldComponent = true

export default ArrayCustom
