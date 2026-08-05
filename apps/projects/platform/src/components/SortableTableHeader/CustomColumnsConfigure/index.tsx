/**
 * @Description 自定义配置表格Columns组件
 */
import * as React from 'react';
import CustomColumnsConfigureHandle, { CustomColumnsConfigureProps, CustomColumnsConfigureRef } from './CustomColumnsConfigureHandle';
import CustomColumnsConfigureModal from './CustomColumnsConfigureModal';

export * from './CustomColumnsConfigureHandle';
export * from './CustomColumnsConfigureModal';

interface CompoundedComponent
  extends React.ForwardRefExoticComponent<CustomColumnsConfigureProps & React.RefAttributes<CustomColumnsConfigureRef>> {
  Modal: typeof CustomColumnsConfigureModal;
}

const CustomColumnsConfigure = CustomColumnsConfigureHandle as CompoundedComponent;

export default CustomColumnsConfigure;
