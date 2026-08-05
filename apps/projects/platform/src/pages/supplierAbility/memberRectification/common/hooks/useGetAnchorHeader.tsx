import { useIntl } from '@linkseeks/i18n'
import { useMemo, useState } from 'react'

export default function useGetAnchorHeader(blackList: string[] = []) {
  const intl = useIntl()
  const [headers, setHeaders] = useState(() => {
    return [
      {
        key: 'progress',
        label: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.circulateProgress' })}`,
      },
      {
        key: 'basicInfo',
        label: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.baseInfo' })}`,
      },
      {
        key: 'editInfo',
        label: `${intl.formatMessage({
          id: 'member.memberRectification.common.hooks.useGetAnchorHeader.rectifyMessage',
        })}`,
      },
      {
        key: 'result',
        label: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.queryColumns.rectifyResult' })}`,
      },
      {
        key: 'record',
        label: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.circulateRecord' })}`,
      },
    ]
  })

  const cacheHeaders = useMemo(() => {
    return headers.filter((_item) => !blackList.includes(_item.key))
  }, [blackList, headers])

  return { headers: cacheHeaders, setHeaders }
}
