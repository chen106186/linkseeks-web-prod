import React from 'react'
import { Typography } from 'antd'
import { LinkOutlined } from '@ant-design/icons'

interface FilesItemProps {
  files?: any
}

const FilesItem: React.FC<FilesItemProps> = (props: any) => {
  const { files } = props
  if (files && files.length > 0) {
    return files.map((item, index) => {
      return (
        <div key={index}>
          <Typography.Link href={item.url} target="_blank">
            <LinkOutlined />
            {item.name}
          </Typography.Link>
        </div>
      )
    })
  } else {
    return '-'
  }
}

export default FilesItem
