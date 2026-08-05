import { useMemo, useState } from 'react'

function useGetAnchorHeader(options: { blackList: string[] }) {
  const { blackList } = options

  const [headerColumn, setHeaderColumn] = useState(() => {
    const temp = [
      {
        key: 'progress',
        label: '流转进度',
      },
      {
        key: 'basicInfo',
        label: '基本信息',
      },
      {
        key: 'noticeDetails',
        label: '通知单明细',
      },
      {
        key: 'deliveryDetail',
        label: '收发货明细',
      },
      {
        key: 'payInfo',
        label: '交付信息',
      },
      {
        key: 'otherRequire',
        label: '其他要求',
      },
      {
        key: 'annex',
        label: '附件',
      },
      {
        key: 'record',
        label: '流转记录',
      },
    ]
    return temp.filter((item) => !blackList.includes(item.key))
  })
  const cacheColumns = useMemo(() => headerColumn, [headerColumn])

  return cacheColumns
}

export default useGetAnchorHeader
