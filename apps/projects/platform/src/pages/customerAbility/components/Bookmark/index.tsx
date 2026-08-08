/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-19 16:18:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-19 18:11:50
 * @Description: 书签
 */
import React, { useState, useEffect, useRef } from 'react';
import BookmarkItem, { ValueType } from './Item';
import styles from './index.less';

interface BookmarkData {
  /**
   * 当前选中的值
   */
  value: ValueType,
  /**
   * 选中改变触发事件
   */
  toggleChange: ((value: ValueType) => void) | undefined,
  /**
   * 子元素向父级传递信息
   */
  checkIn: ((value: ValueType) => void) | undefined,
}

export const BookmarkContext = React.createContext<BookmarkData>({
  value: '',
  toggleChange: undefined,
  checkIn: undefined,
});

interface IProps {
  /**
   * 当前选中的值
   */
  value?: ValueType,
  /**
   * 选择触发改变事件
   */
  onChange?: (value: ValueType) => void,

  children: React.ReactNode,
}

const Bookmark = (props: IProps) => {
  const {
    value,
    onChange,
    children,
  } = props;
  const [current, setCurrent] = useState<ValueType>(undefined);

  const childValueArrRef = useRef<ValueType[]>([]);

  useEffect(() => {
    if ('value' in props) {
      setCurrent(value);
    }
  }, [value]);

  const toggleChange = (next: ValueType) => {
    if (next === current) {
      return;
    }
    if (!('value' in props)) {
      setCurrent(next);
    }
    if (onChange) {
      onChange(next);
    }
  };

  const childNodes = React.Children.map(children, (child: any) => {
    if (child) {
      if (child.type.displayName === 'BookmarkItem') {
        return child;
      }
    }
    return null;
  });
  
  const checkIn = (value: ValueType) => {
    const index = childValueArrRef.current.findIndex((item) => item === value);
    if (index === -1) {
      childValueArrRef.current.push(value);
    }
    // 初始值
    if (
      childValueArrRef.current.length === childNodes.length
      && !('value' in props)
      && !current
    ) {
      setCurrent(childValueArrRef.current[0]);
    }
  };

  return (
    <ul className={styles.bookmark}>
      <BookmarkContext.Provider
        value={{
          value: current,
          toggleChange,
          checkIn,
        }}
      >
        {childNodes}
      </BookmarkContext.Provider>
    </ul>
  );
};

Bookmark.defaultProps = {
  onChange: undefined,
};

Bookmark.Item = BookmarkItem;

export default Bookmark;
