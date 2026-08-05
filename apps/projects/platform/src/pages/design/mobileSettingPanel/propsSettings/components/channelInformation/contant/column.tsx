import React from 'react'
import { ImageBox } from '@apps/components'
import { getIntl } from '@linkseeks/i18n'

const showMainPic = (mainPic: string) => <ImageBox width={32} height={32} src={mainPic} />

const intl = getIntl()

const informationColumn = [
  {
    title: intl.formatMessage({ id: 'editor.columns.information.img' }),
    dataIndex: 'imageUrl',
    render: (imageUrl: string) => showMainPic(imageUrl),
  },
  {
    title: intl.formatMessage({ id: 'editor.columns.information.title' }),
    dataIndex: 'title',
    width: 360,
    ellipsis: true,
  },
]

export default informationColumn
