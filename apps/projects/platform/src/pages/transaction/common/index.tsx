import React from 'react'
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons'

/** NiceForm lable ？帮助信息 */
export const help = (title: string, desc: string) => {
  return (
    <div>
      <span>{title}</span>
      <Tooltip title={desc}>
        <QuestionCircleOutlined
          style={{ margin: "0 3px", cursor: "default", marginLeft: 3 }}
        />
      </Tooltip>
    </div>
  );
};
