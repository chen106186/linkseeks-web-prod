/*
 * @Description: 货源清单虚拟组件
 */
import React from 'react'
import EvaluationsSupplyList from '../EvaluationsSupplyList'

interface EvaluationsSupplyListVirtualFieldProps {}

const EvaluationsSupplyListVirtualField = (props) => {
  const { schema } = props
  const componentProps: EvaluationsSupplyListVirtualFieldProps = schema.getExtendsComponentProps() || {}

  return <EvaluationsSupplyList data={{}} />
}

EvaluationsSupplyListVirtualField.isVirtualFieldComponent = true

export default EvaluationsSupplyListVirtualField
