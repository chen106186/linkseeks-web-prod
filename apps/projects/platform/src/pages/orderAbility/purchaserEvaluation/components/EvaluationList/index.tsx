import React from 'react'
import { SchemaField } from '@apps/formily'
import { ArrayList } from '@apps/formily'
import { toArr, FormPath } from '@apps/formily'

const ArrayComponents = {
  CircleButton: () => null,
  TextButton: () => null,
  AdditionIcon: () => null,
  RemoveIcon: () => null,
  MoveDownIcon: () => null,
  MoveUpIcon: () => null,
}

const EvaluationList = (props) => {
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
    <ArrayList
      value={value}
      minItems={schema.minItems}
      maxItems={schema.maxItems}
      editable={editable}
      components={ArrayComponents}
    >
      {toArr(value).map((item, index) => {
        return <SchemaField key={index} path={FormPath.parse(path).concat(index)} />
      })}
    </ArrayList>
  )
}

EvaluationList.isFieldComponent = true

export default EvaluationList
