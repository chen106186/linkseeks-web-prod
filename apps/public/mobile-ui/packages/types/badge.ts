import React, { ComponentClass } from "react";

import GodComponent from "./base";

export interface GodBadgeProps extends GodComponent {
  /**
   * 自定义小圆点的颜色
   * @default #ff4d4f
   */
  color?: 'primary' | 'error' | 'warning' | 'info' | string & {};
  /**
   * 展示的数字，大于 overflowCount 时显示为 ${overflowCount}+，为 0 时隐藏
   */
  count?: React.ReactNode;
  /**
   * 展示封顶的数字值
   * @default 99
   */
  overflowCount?: number;
  /**
   * 当数值为 0 时，是否展示 Badge
   * @default false
   */
  showZero?: boolean;
}

declare const GodBadge: ComponentClass<GodBadgeProps>;

export default GodBadge;
