/*
 * @Description: 考评记录虚拟组件
 */
import React from 'react';
import CustomerAssessmentHistory from '../CustomerAssessmentHistory';

interface CustomerAssessmentHistoryVirtualFieldProps {}

const CustomerAssessmentHistoryVirtualField = (props) => {
  const {
    schema,
  } = props;
  const componentProps: CustomerAssessmentHistoryVirtualFieldProps = schema.getExtendsComponentProps() || {};

  return (
    <CustomerAssessmentHistory data={{}} />
  );
};

CustomerAssessmentHistoryVirtualField.isVirtualFieldComponent = true;

export default CustomerAssessmentHistoryVirtualField;