import { useMemo } from 'react'
import React from 'react'
import moment from 'moment'
import { findLastIndexFlowState } from '@/utils'
import { GetEnhanceSupplierToBeAddDetailsResponse } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

type otherType = {
  otherAsk: {
    explain?: {
      name: string
      value: string
    }[]
    annex?: {
      name: string
      value: string
    }[]
  }
}

/**
 * 详情页基本信息 列信息
 */
export const useBasicInfoColumnInDetail = <T extends Object = GetEnhanceSupplierToBeAddDetailsResponse>(options: {
  initialValue: T
}) => {
  const { initialValue } = options
  const intl = useIntl()

  const basicInfoColumn = useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'handling.no' }),
        value: initialValue?.['noticeNo'],
      },
      {
        title: intl.formatMessage({ id: 'handling.assign.add.notice.source' }),
        value:
          initialValue?.['source'] === 1
            ? intl.formatMessage({ id: 'handling.assign.add.notice.source.order' })
            : intl.formatMessage({ id: 'handling.assign.add.notice.source.product' }),
      },
      {
        title: intl.formatMessage({ id: 'handling.docTime' }),
        value: initialValue?.['createTime'],
      },
      {
        title: intl.formatMessage({ id: 'handling.description' }),
        value: initialValue?.['summary'],
        span: 2,
      },
      {
        title: intl.formatMessage({ id: 'handling.processName' }),
        value: initialValue?.['processName'],
      },
      {
        title: intl.formatMessage({ id: 'handling.outerStatus' }),
        value: initialValue?.['outerStatusName'],
        span: 3,
      },
      {
        title: intl.formatMessage({ id: 'handling.innerStatus' }),
        value: initialValue?.['innerStatusName'],
        span: 3,
      },
    ]
  }, [initialValue])

  const payInfoColumns = useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'handling.assign.add.delivery' }),
        value:
          initialValue?.['deliveryType'] === 1
            ? intl.formatMessage({ id: 'handling.assign.add.delivery.logistics' })
            : intl.formatMessage({ id: 'handling.assign.add.delivery.self' }),
      },
      initialValue?.['deliveryType'] === 1
        ? {
            title: intl.formatMessage({ id: 'handling.assign.add.receiveAddress' }),
            value: (
              <div>
                <div>
                  <span>
                    {initialValue?.['receiveUserName']}/ {initialValue?.['receiveUserTel']}
                  </span>
                </div>
                <span>{initialValue?.['receiveAddress']}</span>
              </div>
            ),
          }
        : null,
      initialValue?.['deliveryAddress'] !== null
        ? {
            title:
              initialValue?.['deliveryType'] === 1
                ? intl.formatMessage({ id: 'handling.detail.deliveryAddress' })
                : intl.formatMessage({ id: 'handling.detail.selfAddress' }),
            value: (
              <div>
                <div>
                  <span>
                    {initialValue?.['deliveryUserName']}/ {initialValue?.['deliveryUserTel']}
                  </span>
                </div>
                <span>{initialValue?.['deliveryAddress']}</span>
              </div>
            ),
          }
        : null,
      {
        title: intl.formatMessage({ id: 'handling.assign.add.notice.deliveryDate' }),
        value: initialValue?.['deliveryDate'] && moment(initialValue?.['deliveryDate']).format('YYYY-MM-DD HH:mm:ss'),
      },
    ].filter(Boolean)
  }, [initialValue])

  const cacheOtherInfo = useMemo(() => {
    const explain = initialValue?.['otherAsk']?.explain || []
    const list = explain.map((_item) => {
      return {
        title: _item.name,
        value: _item.value,
      }
    })
    return list
  }, [initialValue])

  const annexInfo = useMemo(() => {
    const annex = initialValue?.['otherAsk']?.annex || []
    return [
      {
        title: intl.formatMessage({ id: 'handling.assign.add.files' }),
        value: (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {annex.map((_item, key) => {
              return (
                <a href={_item.value} style={{ marginTop: '4px' }} key={key}>
                  {_item.name}
                </a>
              )
            })}
          </div>
        ),
      },
    ]
  }, [initialValue])

  const progressInfo = useMemo(() => {
    const outerVerifySteps =
      initialValue && initialValue.outerTaskList
        ? initialValue.outerTaskList.map((item) => ({
            step: item.step,
            stepName: item.taskName,
            roleName: item.roleName,
            status: item.isExecute ? 'finish' : 'wait',
          }))
        : []
    const outerVerifyCurrent = findLastIndexFlowState(initialValue?.outerTaskList)
    const innerVerifySteps =
      initialValue && initialValue.innerTaskList
        ? initialValue.innerTaskList.map((item) => ({
            step: item.step,
            stepName: item.taskName,
            roleName: item.roleName,
            status: item.isExecute ? 'finish' : 'wait',
          }))
        : []
    const innerVerifyCurrent = findLastIndexFlowState(initialValue?.innerTaskList)
    return {
      outerVerifySteps,
      outerVerifyCurrent,
      innerVerifySteps,
      innerVerifyCurrent,
    }
  }, [initialValue])

  return { basicInfoColumn, payInfoColumns, cacheOtherInfo, annexInfo, progressInfo }
}
