/**
 * @Description 可拖拽的表格头部 Row 组件
 */
import React, { useRef, useState, useEffect } from 'react';
import classNames from 'classnames';
import './index.less';

interface ResizableHandleBarProps {
  /**
   * 滑动时触发事件
   */
  onSlide: (value: number) => void,
}

export type PositionType = {
  /**
   * 锁
   */
  lock: boolean,
  /**
   * 起始 x 位置
   */
  startX: number,
  /**
   * 父级宽度
   */
  parentWidth: number,
}

// * 如果需要修改该值，请同步修改 css 文件中的宽度
const RESIZE_BAR_WIDTH = 12;

const ResizableHandleBar: React.FC<ResizableHandleBarProps> = (props) => {
  const { onSlide } = props;

  const [offsetX, setOffsetX] = useState(RESIZE_BAR_WIDTH / 2);
  const [moving, setMoving] = useState(false);

  const position = useRef<PositionType>({
    lock: true,
    startX: 0,
    parentWidth: 0,
  });

  const handleMouseDown: React.DOMAttributes<HTMLDivElement>['onMouseDown'] = (e) => {
    position.current.lock = false;
    position.current.startX = e.pageX - offsetX;
    // css布局原因，获取值实际少了容器宽度的一半
    // 故这里加回一半，就能间接得到父级宽度
    position.current.parentWidth = e.currentTarget.offsetLeft + RESIZE_BAR_WIDTH / 2;
    setMoving(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (position.current.lock) {
        return;
      }
      const diffX = Math.max(e.pageX - position.current.startX, -position.current.parentWidth + RESIZE_BAR_WIDTH / 2);
      setOffsetX(diffX);
    };

    const handleMouseUp = () => {
      if (!position.current.lock) {
        position.current.lock = true;
        setMoving(false);
        setTimeout(() => {
          onSlide?.(position.current.parentWidth + offsetX - RESIZE_BAR_WIDTH / 2);
          setOffsetX(RESIZE_BAR_WIDTH / 2);
        }, 0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onSlide, offsetX]);

  return (
    <div
      className={classNames('resizable-handle')}
      style={{
        right: `${-offsetX}px`,
        opacity: moving ? 1 : 0,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={classNames('resizable-handle-line')} />
    </div>
  );
};

export default ResizableHandleBar;
