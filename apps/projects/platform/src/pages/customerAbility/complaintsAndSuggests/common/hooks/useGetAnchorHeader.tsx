import { useIntl } from '@linkseeks/i18n'
import { GetMemberComplaintSubGetResponse } from '@apps/apis'
import { useMemo, useState } from 'react'

type Options<T = any> = {
  initialValue: T
}

export default function useGetAnchorHeader<T>(blackList: string[] = [], options?: Options<T>) {
  const intl = useIntl()

  const [headers, setHeaders] = useState(() => {
    return [
      {
        key: 'basicInfo',
        label: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.baseInfo' })}`,
      },
      {
        key: 'result',
        label: `${intl.formatMessage({
          id: 'member.complaintsAndSuggests.common.hooks.useGetAnchorHeader.dealResult',
        })}`,
      },
    ]
  })
  const cacheHeaders = useMemo(() => {
    const temp = headers.filter((_item) => !blackList.includes(_item.key))
    if (options && options.initialValue) {
      return temp.filter((_row) => {
        console.log(options.initialValue)
        if (
          _row.key === 'result' &&
          (options.initialValue as unknown as GetMemberComplaintSubGetResponse).handleResult === null
        ) {
          return false
        }
        return true
      })
    }
    return temp
  }, [blackList, headers, options.initialValue])

  return { headers: cacheHeaders }
}
