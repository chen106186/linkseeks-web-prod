import { useMemo } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { useWebIntl } from '@apps/locales'
import StatusTag from '@/components/StatusTag'
import React from 'react'
import { priceFormat, numFormat } from '@/utils/numberFomat'

type OptionsType = 'pay' | 'receive' | 'platform' | 'score'

/**
 * 结算单详情信息
 */
function useBalanceInfo<T extends { [key: string]: any }>(initialValue: T, options: { type: OptionsType }) {
  const type = options.type
  const intl = useIntl()
  const translate = useWebIntl()

  const list = useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'balance.hooks.useBalanceInfo.list.1' }),
        value: initialValue?.settlementDate,
      },
      {
        title: translate('web.resource.order.danjushuliang'),
        value: numFormat(initialValue?.totalCount),
      },
      {
        title: intl.formatMessage({ id: 'balance.hooks.useBalanceInfo.list.3' }),
        value: <StatusTag title={initialValue?.statusName} type="primary"></StatusTag>,
      },
      {
        title: intl.formatMessage({ id: 'balance.hooks.useBalanceInfo.list.4' }),
        value: initialValue?.settlementWayName,
      },
      {
        title: translate('web.resource.order.daishoujine'),
        value: priceFormat(initialValue?.collectAmount || 0),
      },
      {
        title: translate('web.resource.order.pingtaiyongjin'),
        value: priceFormat(initialValue?.brokerage || 0),
      },
      {
        title: intl.formatMessage({ id: 'balance.hooks.useBalanceInfo.list.5' }),
        value: priceFormat(initialValue?.amount),
      },
      type === 'pay' || type === 'receive'
        ? {
            title:
              type === 'pay'
                ? intl.formatMessage({ id: 'balance.hooks.useBalanceInfo.list.6' })
                : intl.formatMessage({ id: 'balance.hooks.useBalanceInfo.list.7' }),
            value: type === 'pay' ? initialValue?.settlementName : initialValue?.payName,
          }
        : null,
    ].filter(Boolean)
  }, [initialValue])
  return { infoList: list }
}

export default useBalanceInfo
