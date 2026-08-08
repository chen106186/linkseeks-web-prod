// 外部状态
import React, { useState, useEffect } from 'react';
import { Badge } from 'antd';

interface params {
  state?: any,
  data: Array<any>,
  colorType?: number
}

const InteriorState: React.FC<params> = (props) => {
  const { state, data, colorType } = props;
  const [color, setcolor] = useState<any>([]);
  useEffect(() => {
    switch(colorType) {
      case 1:
        setcolor(['', 'default', 'warning', 'warning', 'processing', 'success', 'error', 'error'])
        break;
      case 2:
        setcolor(['', 'default', 'warning', 'warning', 'success', 'success', 'error'])
        break;
    }
  }, [])
  return (
    <>
      {data.length > 0 && data.map((item: any) => {
        return (
          state === item.state &&
          <Badge
            status={color[item.state]}
            text={item.name}
            key={item.state}
          />
        )
      })}
    </>
  )
}

export default InteriorState