/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-19 16:36:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-19 17:28:53
 * @Description: 书签子项
 */
import React, { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { BookmarkContext } from './index';
import styles from './index.less';

export declare type ValueType = string | number | undefined;

interface IProps {
  /**
   * 值
   */
  value: ValueType,
  /**
   * 左侧图标
   */
  icon?: React.ReactNode,
  /**
   * 标题
   */
  title: React.ReactNode,
  /**
   * 是否显示；default: true
   */
  visible?: boolean
}

const BookmarkItem: React.FC<IProps> = (props: IProps) => {
  const {
    value,
    icon,
    title,
    visible = true
  } = props;
  const bookmarkContext = useContext(BookmarkContext);

  useEffect(() => {
    bookmarkContext?.checkIn(value);
  }, [value]);

  const handleClick = () => {
    bookmarkContext?.toggleChange(value);
  };

  return visible ? (
    <li
      className={classNames(styles['bookmark-itemWrap'], {
        [styles['bookmark-itemWrap-hide']]: !visible,
      }
    )}>
      <div
        className={classNames(styles['bookmark-item'], {
          [styles['bookmark-item-active']]: value === bookmarkContext.value,
        })}
        onClick={handleClick}
      >
        {icon ? (
          <div className={styles['bookmark-item-left']}>
            {icon}
          </div>
        ) : null}
        <div className={styles['bookmark-item-center']}>
          {title}
        </div>
      </div>
    </li>
  ) : null
};

BookmarkItem.defaultProps = {
  icon: null,
  visible: true,
};

BookmarkItem.displayName = 'BookmarkItem';

export default BookmarkItem;
