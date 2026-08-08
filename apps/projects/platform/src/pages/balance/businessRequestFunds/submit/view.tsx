import React, { useRef } from 'react'
import Table from '@/components/TableLayout'
import { Tag, Badge, Button, Popconfirm } from 'antd'
import { ColumnType } from 'antd/lib/table/interface'
import { formatTimeString } from '@/utils'
import { INTERNALSTATE_COLOR } from '@/constants/stateColor'
import { getIntl } from '@linkseeks/i18n'
import { Link } from '@linkseeks/router-core'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  applyAbstract,
  applyAmount,
  applyNo,
  applyType,
  createTime,
  expectPayTime,
  interiorStateName,
  operation,
  payee,
} from '../columns'
import { schema } from '../sechma'
import {
  getSettlementBusinessApplyAmountToAddApplyAmountExamine3List,
  postSettlementBusinessApplyAmountGoodsExamine3,
} from '@apps/apis'
import { AuthButton } from '@apps/components'
import { priceFormat } from '@/utils/numberFomat'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
const Submit = () => {
  const ref = useRef<any>({})

  const fetchSubmitBatch = (id) => {
    postSettlementBusinessApplyAmountGoodsExamine3({ id, state: 1 }).then((res) => {
      if (res.code === 1000) {
        ref.current.reloadCurrent()
      }
    })
  }

  const columns: any[] = [
    {
      ...applyNo,
      render: (_text, record) => (
        <>
          {AuthUrl('detail') ? (
            <Link to={`/balance/businessRequestFunds/submit/detail?id=${record.id}&no=${record.applyNo}`}>{_text}</Link>
          ) : (
            _text
          )}
        </>
      ),
    },
    {
      ...applyAbstract,
    },
    {
      ...applyType,
    },
    {
      ...payee,
    },
    {
      ...applyAmount,
      render: (_text) => `${translate('web.common.currencySymbol')}${priceFormat(_text)}`,
    },
    {
      ...expectPayTime,
      render: (_text) => formatTimeString(_text, 'YYYY-MM-DD'),
    },
    {
      ...createTime,
      render: (_text) => formatTimeString(_text, 'YYYY-MM-DD HH:mm'),
    },
    {
      ...interiorStateName,
      render: (_text, _record) => <Tag color={INTERNALSTATE_COLOR[_record.interiorState]}>{_text}</Tag>,
    },
    {
      ...operation,
      render: (_text, record) => (
        <AuthButton type="custom" code="audit">
          <Popconfirm
            title={intl.formatMessage({ id: 'balance.quedingyaotijiaoma' })}
            okText={intl.formatMessage({ id: 'balance.shi' })}
            cancelText={intl.formatMessage({ id: 'balance.fou' })}
            onConfirm={() => fetchSubmitBatch(record.id)}
          >
            <Button type="link">{intl.formatMessage({ id: 'balance.tijiao', defaultMessage: '提交' })}</Button>
          </Popconfirm>
        </AuthButton>
      ),
    },
  ]

  return (
    <Table
      reload={ref}
      columns={columns}
      effects="applyNo"
      fetch={getSettlementBusinessApplyAmountToAddApplyAmountExamine3List}
      schema={schema}
    />
  )
}

export default Submit
