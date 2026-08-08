import React from 'react';
import { Radio } from 'antd';

export interface ButtonListProps {
  size?: 'default' | 'large',
  group: {value: string, text?: React.ReactNode, key: string}[]
}
const ButtonList: React.FC<ButtonListProps> = (props) => {
  return (
    <div className={'margin320'}>
      <Radio.Group>
        {
          props.group.map(v => <Radio.Button value={v.value} key={v.key} className={props.size === 'default' ? 'default' : 'large'}>{v.text}</Radio.Button>)
        }
      </Radio.Group>
    </div>
  )
}

ButtonList.defaultProps = {
  size: 'default'
}
export default ButtonList