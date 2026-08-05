/** 待审核PCA反馈（二级） */
import PolymericTable, { NormalTableRefHandleType } from '@/components/PolymericTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { postOrderEightDRectificationList, PostOrderEightDRectificationListResponseDetail } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { PageHeaderWrapper } from '@apps/components'
import { Badge, Button, Card, Tooltip } from 'antd'
import { ColumnType } from 'antd/lib/table'
import moment from 'moment'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { querySchema } from './schema/querySchema'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { EIGHTD_EX_STATUS_TAG_TYPE, EIGHTD_IN_STATUS_BADGE_TYPE } from '../constant'
import StatusTag from '@/components/StatusTag'
import { getInternalsFilter, getOuterStatusFilter } from '../componentsFn/getStatusFilterArray'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { AuthButton } from '@apps/components'

const index: React.FC = () => {
  const polymericRef = useRef<NormalTableRefHandleType | null>(null)
  const intl = useIntl()
  const fetchTableList = async (params) => {
    const res = await postOrderEightDRectificationList(
      {
        eightDRectificationType: 10,
        ...params,
      },
      { ctlType: 'none' },
    )
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }
  const columns: ColumnType<PostOrderEightDRectificationListResponseDetail>[] = [
    {
      title: intl.formatMessage({
        id: 'eightD.8Dbianhao',
        defaultMessage: '8D编号',
      }),
      dataIndex: 'eightDRectificationNo',
      width: '150px',
      render: (text, record) => {
        return AuthUrl('detail') ? (
          <Link to={`/qualityAbility/8D/pcaWantAuditingSecond/detail?id=${record.id}`}>{text}</Link>
        ) : (
          text
        )
      },
    },
    {
      title: intl.formatMessage({
        id: 'eightD.zhaiyao',
        defaultMessage: '摘要',
      }),
      dataIndex: 'summary',
      width: '180px',
    },
    {
      title: intl.formatMessage({
        id: 'eightD.gongyinghuiyuan',
        defaultMessage: '供应会员',
      }),
      dataIndex: 'supplyMemberName',
      width: '100px',
    },
    {
      title: intl.formatMessage({
        id: 'eightD.ICAyaoqiuriqi',
        defaultMessage: 'ICA要求日期',
      }),
      dataIndex: 'icaReplyTime',
      width: '120px',
      sorter: (current, next) => {
        return moment(current.icaReplyTime).valueOf() - moment(next.icaReplyTime).valueOf()
      },
      render: (text) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
      },
    },
    {
      title: intl.formatMessage({
        id: 'eightD.PCAyaoqiuriqi',
        defaultMessage: 'PCA要求日期',
      }),
      dataIndex: 'pcaReplyTime',
      width: '120px',
      sorter: (current, next) => {
        return moment(current.pcaReplyTime).valueOf() - moment(next.pcaReplyTime).valueOf()
      },
      render: (text) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
      },
    },
    {
      title: intl.formatMessage({
        id: 'eightD.wuliaobianhao',
        defaultMessage: '物料编号',
      }),
      dataIndex: 'productCode',
      width: '100px',
      sorter: (current, next) => {
        return current.productDetail?.code?.localeCompare(next.productDetail?.code)
      },
      render: (_text, record) => record.productDetail?.code,
    },
    {
      title: intl.formatMessage({
        id: 'eightD.wuliaomingcheng2',
        defaultMessage: '物料/商品名称',
      }),
      dataIndex: 'productName',
      width: '140px',
      render: (_text, record) => record.productDetail?.name,
    },
    {
      title: intl.formatMessage({
        id: 'eightD.guigexinghao',
        defaultMessage: '规格型号',
      }),
      dataIndex: 'productType',
      width: '100px',
      render: (_text, record) => record.productDetail?.type,
    },
    {
      title: intl.formatMessage({
        id: 'eightD.danjushijian',
        defaultMessage: '单据时间',
      }),
      dataIndex: 'createTime',
      width: '150px',
      render: (text) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
      },
    },
    {
      title: intl.formatMessage({
        id: 'eightD.waibuzhuangtai',
        defaultMessage: '外部状态',
      }),
      dataIndex: 'outerStatusName',
      width: '180px',
      render: (text, record) => (
        <StatusTag
          type={'default'}
          style={{
            background: EIGHTD_EX_STATUS_TAG_TYPE[record.outerStatus]?.bgColor,
            color: EIGHTD_EX_STATUS_TAG_TYPE[record.outerStatus]?.color,
          }}
          title={text}
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'eightD.neibuzhuangtai',
        defaultMessage: '内部状态',
      }),
      dataIndex: 'internalStatusName',
      width: '180px',
      render: (text, record) => (
        <Badge color={EIGHTD_IN_STATUS_BADGE_TYPE[record.internalStatus] ?? 'orange'} text={text} />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'eightD.caozuo',
        defaultMessage: '操作',
      }),
      dataIndex: 'ope',
      fixed: 'right',
      width: '160px',
      render: (_text, record) => {
        return (
          <AuthButton type="custom" code="audit">
            <Button
              type="link"
              onClick={() => {
                history.push(`/qualityAbility/8D/pcaWantAuditingSecond/detail?id=${record.id}`)
              }}
            >
              <span>
                {intl.formatMessage({
                  id: 'eightD.shenhePCAfankui',
                  defaultMessage: '审核PCA反馈',
                })}
              </span>
            </Button>
          </AuthButton>
        )
      },
    },
  ]

  return (
    <PageHeaderWrapper>
      <Card>
        <PolymericTable
          rowKey="eightDRectificationNo"
          columns={columns}
          fetchDataSource={(params) => fetchTableList(params)}
          defaultPageSize={10}
          searchFormProps={{
            schema: querySchema,
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'eightDRectificationNo', FORM_FILTER_PATH)
            },
          }}
          scroll={{ x: 1200 }}
          ref={polymericRef}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default index
