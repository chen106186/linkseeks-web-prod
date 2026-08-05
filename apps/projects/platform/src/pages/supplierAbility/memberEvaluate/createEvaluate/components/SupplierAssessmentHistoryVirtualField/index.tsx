/*
 * @Description: 考评记录虚拟组件
 */
import React from 'react'
import SupplierAssessmentHistory from '../SupplierAssessmentHistory'

interface SupplierAssessmentHistoryVirtualFieldProps {}

const SupplierAssessmentHistoryVirtualField = (props) => {
  const { schema } = props
  const componentProps: SupplierAssessmentHistoryVirtualFieldProps = schema.getExtendsComponentProps() || {}

  return <SupplierAssessmentHistory data={{}} />
}

SupplierAssessmentHistoryVirtualField.isVirtualFieldComponent = true

export default SupplierAssessmentHistoryVirtualField
