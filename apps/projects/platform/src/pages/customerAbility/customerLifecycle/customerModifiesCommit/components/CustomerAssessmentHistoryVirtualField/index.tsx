/*
 * @Description: 考评记录虚拟组件
 */
import React from 'react';
import CustomerAssessmentHistory, { CustomerAssessmentHistoryProps } from '../../../components/CustomerAssessmentHistory';

interface CustomerAssessmentHistoryVirtualFieldProps extends CustomerAssessmentHistoryProps {}

const CustomerAssessmentHistoryVirtualField = (props) => {
  const {
    schema,
  } = props;
  const componentProps: CustomerAssessmentHistoryVirtualFieldProps = schema.getExtendsComponentProps() || {};

  return (
    <CustomerAssessmentHistory {...componentProps} />
  );
};

CustomerAssessmentHistoryVirtualField.isVirtualFieldComponent = true;

export default CustomerAssessmentHistoryVirtualField;