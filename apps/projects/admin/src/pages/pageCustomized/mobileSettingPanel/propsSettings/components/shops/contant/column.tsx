import React from 'react'
import { ImageBox } from '@apps/components'

const showMainPic = (mainPic: string) => <ImageBox width={32} height={32} src={mainPic} />

export const shopColumn = [
  {
    title: '店铺图片',
    dataIndex: 'logo',
    render: (logo: string) => showMainPic(logo),
  },
  {
    title: '店铺名称',
    dataIndex: 'memberName',
    width: 300,
    ellipsis: true,
  },
]
