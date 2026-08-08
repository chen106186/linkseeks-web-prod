import { useMemo, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

function useGetAnchorHeader(options: { blackList: string[] }) {
  const { blackList } = options

  const [headerColumn, setHeaderColumn] = useState(() => {
    const temp = [
      {
        key: 'progress',
        label: intl.formatMessage({ id: 'handling.liuzhuanjindu' }),
      },
      {
        key: 'basicInfo',
        label: intl.formatMessage({ id: 'handling.jibenxinxi' }),
      },
      {
        key: 'noticeDetails',
        label: `${intl.formatMessage({ id: 'handling.detail.noticeDetail' })}`,
      },
      {
        key: 'deliveryDetail',
        label: intl.formatMessage({ id: 'handling.shoufahuomingxi' }),
      },
      {
        key: 'payInfo',
        label: intl.formatMessage({ id: 'handling.jiaofuxinxi' }),
      },
      {
        key: 'otherRequire',
        label: intl.formatMessage({ id: 'handling.qitayaoqiu' }),
      },
      {
        key: 'annex',
        label: intl.formatMessage({ id: 'handling.fujian' }),
      },
      {
        key: 'record',
        label: intl.formatMessage({ id: 'handling.liuzhuanjilu' }),
      },
    ]
    return temp.filter((item) => !blackList.includes(item.key))
  })
  const cacheColumns = useMemo(() => headerColumn, [headerColumn])

  return cacheColumns
}

export default useGetAnchorHeader
