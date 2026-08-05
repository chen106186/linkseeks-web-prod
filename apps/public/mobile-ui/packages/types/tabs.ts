import { ComponentClass } from "react";
import { CommonEvent } from "@tarojs/components/types/common";

import GodComponent from "./base";

export interface TabItem {
  /**
   * 标题
   */
  title: string;
  /**
   * 角标数量
   */
  badge?: number;
}

export interface GodTabsProps extends GodComponent {
  /**
   * Tab 方向，请跟 GodTabPane 保持一致
   * @default 'horizontal'
   */
  tabDirection?: "horizontal" | "vertical";
  /**
   * Tab 高度，当 tabDirection='vertical' 时，需要设置；
   * 当 tabDirection='horizontal' 时，会自动根据内容撑开，请勿设置
   */
  height?: string;
  /**
   * 当前选中的标签索引值，从 0 计数，开发者需要通过 onClick 事件来改变 current，从而切换 tab
   * @default 0
   */
  current: number;
  /**
   * 是否滚动，当标签太多时，建议使用。否则会出现部分标签被隐藏
   * @default false
   */
  scroll?: boolean;
  /**
   * 是否开启切换动画
   * @default true
   */
  animated?: boolean;
  /**
   * 是否支持手势滑动切换内容页，当 tabDirection='vertical' 时，无论是否设置，都不支持手势滑动切换内容页
   * @default true
   */
  swipeable?: boolean;
  /**
   * tab 列表
   */
  tabList: TabItem[];
  /**
   * 自定义选中选项卡颜色
   */
  activeColor?: string;
  /**
   * 是否隐藏底部
   */
  hideUnderLine?: boolean;
  /**
   * tab背景色透明
   */
  transparentBg?: boolean;
  /**
   * 切换模式
   * @default false
   * true: 改为display 显示tabsPane, 同时也要在tabsPane加上display
   */
  display?: boolean;
  /**
   * 点击或滑动时触发事件
   */
  onClick: (index: number, event: CommonEvent) => void;

  isDisplay?: boolean;
}

export interface GodTabsState {
  _scrollLeft: number;
  _scrollTop: number;
  _scrollIntoView: string;
}

declare const GodTabs: ComponentClass<GodTabsProps>;

export default GodTabs;
