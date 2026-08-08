import React from 'react';
import { usePageStatus } from '@/hooks/usePageStatus';
import DetailInfo from '../components/DetailInfo';

const QuotaPrSubmitDetail: React.FC = () => {
  const { id, creditId } = usePageStatus();

  return (
    <DetailInfo id={id} creditId={creditId} />
  );
};

export default QuotaPrSubmitDetail;