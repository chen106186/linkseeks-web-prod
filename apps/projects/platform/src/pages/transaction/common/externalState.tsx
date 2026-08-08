// 内部状态
import React, { useState, useEffect } from 'react';
import { Tag } from 'antd';

interface params {
  state?: any,
  data: Array<any>,
  colorType?: number
}

const ExternalState: React.FC<params> = (props) => {
  const { state, data, colorType } = props;
  const [color, setcolor] = useState<any>([]);
  useEffect(() => {
    switch(colorType) {
      case 1:
        setcolor(['', 'default', 'warning', 'default', 'warning', 'success', 'error', 'error', 'error'])
        break;
      case 2:
        setcolor(['', 'default', 'processing', 'warning', 'success', 'error'])
        break;
    }
  },[])
  return (
    <>
      {data.length > 0 && data.map((item: any) => {
        return (
          state === item.state &&
          <Tag
            color={color[item.state]}
            key={item.state}
          >
            {item.name}
          </Tag>
        )
      })}
    </>
  )
}

export default ExternalState