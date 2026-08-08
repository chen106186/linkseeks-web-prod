/**
 * @Description: 标签面板
 */
import React, { useEffect } from 'react';
import './index.less';
import { ActiveKeyType } from './typings';
import TagsPaneContext from './TagsPaneContext';

export interface TagsPaneProps {
  /**
   * 名称
   */
  name: React.ReactNode,
  /**
   * 对应 activeKey
   */
  key?: ActiveKeyType,
  /**
   * 对应 activeKey
   */
  tabKey?: ActiveKeyType,
  /**
   * 是否激活
   */
  active?: boolean,
  /**
   * 自定义样式
   */
  style?: React.CSSProperties,
  /**
   * 被隐藏时是否渲染 DOM 结构
   */
  forceRender?: boolean,
  /**
   * 是否可关闭的
   */
  closable?: boolean,
  /**
   * 可拖拽的
   */
  sortable?: boolean,

  children?: React.ReactNode,
}

const TagsPane: React.FC<TagsPaneProps> = (props: TagsPaneProps) => {
  const {
    tabKey,
    active,
    style,
    forceRender,
    children
  } = props;

  const tagsPaneContext = React.useContext(TagsPaneContext);

  // useEffect(() => {
  //   const { registerPane } = tagsPaneContext;
  //   registerPane(key, name);
  // }, [key, name]);

  const mergedStyle: React.CSSProperties = {};
  if (!active) {
    mergedStyle.display = 'none';
  }

  return (
    <div
      className="tagsPane-pane"
      style={{ ...mergedStyle, ...style }}
      key={tabKey}
    >
      {(active || forceRender) && children}
    </div>
  );
};

export default TagsPane;
