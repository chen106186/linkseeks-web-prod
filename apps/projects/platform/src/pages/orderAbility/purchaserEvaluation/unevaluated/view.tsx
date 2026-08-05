import React, { useState, useRef } from 'react'
import { Card, Badge, Button } from 'antd'
import { Link, useLocation } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import { formatTimeString } from '@/utils'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getMemberOrderCommentBuyerPage } from '@apps/apis'
import { checkIsPointsOrder } from '@/constants/order'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { listSearchSchema } from './schema'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { fetchOrderTypes } from '../../utils/orderTypes'

const intl = getIntl()
const formActions = createFormActions()

const Unevaluated: React.FC<any> = (props) => {
  const { pathname } = useLocation()

  const ref = useRef<any>({})

  const defaultColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.dingdanhao' }),
      dataIndex: 'orderNo',
      align: 'center',
      render: (text, record) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`${pathname}/detail?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.dingdanzhaiyao' }),
      dataIndex: 'digest',
      align: 'center',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.gongyinghuiyuan' }),
      dataIndex: 'memberName',
      align: 'center',
      render: (text, record) => <>{text}</>,
    },
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.xiadanshijian' }),
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.dingdanzonge' }),
      dataIndex: 'totalAmount',
      align: 'center',
      render: (text, record) =>
        !checkIsPointsOrder(record.orderType)
          ? `${intl.formatMessage({ id: 'common.money' })}${text}`
          : `${text}${intl.formatMessage({ id: 'common.currency.points' })}`,
    },
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.dingdanleixing' }),
      dataIndex: 'orderTypeName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.waibuzhuangtai' }),
      dataIndex: 'outerStatusName',
      align: 'center',
      render: (text, record) => (
        <StatusTag type="success" title={intl.formatMessage({ id: 'purchaserEvaluation.yiwancheng' })} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.neibuzhuangtai' }),
      dataIndex: 'innerStatusName',
      align: 'center',
      render: (text, record) => (
        <Badge color="#41CC9E" text={intl.formatMessage({ id: 'purchaserEvaluation.yiwancheng' })} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.caozuo' }),
      dataIndex: 'option',
      align: 'center',
      render: (text, record) => (
        <>
          <EditAuthButton>
            <Link to={`${pathname}/edit?id=${record.id}`}>
              {!record.completeCommentStatus && (
                <Button type="link">{intl.formatMessage({ id: 'purchaserEvaluation.pingjia' })}</Button>
              )}
            </Link>
          </EditAuthButton>
        </>
      ),
    },
  ]

  const [columns, setColumns] = useState<any[]>(defaultColumns)

  const fetchListData = (params: any) => {
    let { createTimeStart, createTimeEnd, ...rest } = params
    createTimeStart = createTimeStart ? formatTimeString(+createTimeStart) : undefined
    createTimeEnd = createTimeEnd ? formatTimeString(+createTimeEnd) : undefined

    return new Promise((resolve, reject) => {
      getMemberOrderCommentBuyerPage({
        createTimeStart,
        createTimeEnd,
        ...rest,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject()
        })
        .catch(() => {
          reject()
        })
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'orderNo',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'orderNo', FORM_FILTER_PATH)

                useAsyncSelect('orderType', fetchOrderTypes, ['text', 'id'])
              }}
              schema={listSearchSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Unevaluated
