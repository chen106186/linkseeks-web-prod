/*
 * @Description: 考评记录虚拟组件
 */
import React from 'react'
import SupplierAssessmentHistory, {
  SupplierAssessmentHistoryProps,
} from '../../../components/SupplierAssessmentHistory'

interface SupplierAssessmentHistoryVirtualFieldProps extends SupplierAssessmentHistoryProps {}

const SupplierAssessmentHistoryVirtualField = (props) => {
  const { schema } = props
  const componentProps: SupplierAssessmentHistoryVirtualFieldProps = schema.getExtendsComponentProps() || {}

  return <SupplierAssessmentHistory {...componentProps} />
}

SupplierAssessmentHistoryVirtualField.isVirtualFieldComponent = true

export default SupplierAssessmentHistoryVirtualField
