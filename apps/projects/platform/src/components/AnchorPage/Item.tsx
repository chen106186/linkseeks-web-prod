/*
 * @Description: 页面公用锚点项容器
 */
import React from 'react';

interface AnchorPageItemProps {
  /**
   * key，实际就是 标签id
   */
  itemKey: string,
  /**
   * 自定义外部样式
   */
  customStyle?: React.HTMLAttributes<HTMLDivElement>,
  /**
   * 自定义外部 className
   */
  className?: string,

  children?: React.ReactNode,
}

const AnchorPageItem: React.FC<AnchorPageItemProps> = (props: AnchorPageItemProps) => {
  const { itemKey, customStyle, className, children } = props;
  return (
    <div id={itemKey} style={customStyle} className={className}>
      {children}
    </div>
  );
};

export default AnchorPageItem;
