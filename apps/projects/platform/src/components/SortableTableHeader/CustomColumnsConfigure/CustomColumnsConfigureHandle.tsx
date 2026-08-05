/**
 * @Description 自定义配置表格Columns组件
 */
import React, { useState } from 'react';
import { Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import CustomColumnsConfigureModal, { CustomColumnsConfigureModalProps, CustomColumnsConfigureModalRef } from './CustomColumnsConfigureModal';
import './index.less';

export interface CustomColumnsConfigureProps extends Omit<CustomColumnsConfigureModalProps, 'visible' | 'onClose'> {
  children?: React.ReactNode,
}

export interface CustomColumnsConfigureRef extends CustomColumnsConfigureModalRef {}

const CustomColumnsConfigure = (props: CustomColumnsConfigureProps, ref) => {
  const {
    defaultColumns = [],
    onConfirm,
    children,
  } = props;
  const [visibleModal, setVisibelModal] = useState(false);

  const handleVisibleModal = (flag?: boolean) => {
    setVisibelModal(!!flag);
  };

  const handleConfirm: CustomColumnsConfigureModalProps['onConfirm'] = (newColumns) => {
    handleVisibleModal(false);
    onConfirm?.(newColumns);
  };

  return (
    <div className="columns-configure" onClick={() => handleVisibleModal(true)}>
      {children || <Button icon={<SettingOutlined />} />}

      <CustomColumnsConfigureModal
        defaultColumns={defaultColumns}
        visible={visibleModal}
        onClose={() => handleVisibleModal(false)}
        onConfirm={handleConfirm}
        ref={ref}
      />
    </div>
  );
};

const CustomColumnsConfigureForWard = React.forwardRef<CustomColumnsConfigureRef, CustomColumnsConfigureProps>(CustomColumnsConfigure);

export default CustomColumnsConfigureForWard;
