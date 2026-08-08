/*
 * @Description: 变更状态展示组件
 */
import React from 'react';
import StatusTag from '@/components/StatusTag';

const ModifiesStatusTagField = (props) => {
  const {
    value,
  } = props;

  if (!value) {
    return null;
  }

  return (
    <div>
      <StatusTag type="default" title={value} />
    </div>
  );
};

export default ModifiesStatusTagField;