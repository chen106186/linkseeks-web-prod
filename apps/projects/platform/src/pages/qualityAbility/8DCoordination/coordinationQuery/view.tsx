/** 8D整改 查询 */
import PolymericTable, { NormalTableRefHandleType } from '@/components/PolymericTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  postOrderEightDRectificationList,
  postOrderEightDRectificationEnumOuters,
  PostOrderEightDRectificationListResponseDetail,
} from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card } from 'antd'
import { ColumnType } from 'antd/lib/table'
import moment from 'moment'
import React, { useRef, useState } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { querySchema } from './schema/querySchema'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { isArray } from 'lodash'
import { EIGHTD_EX_STATUS_TAG_TYPE } from '../../8D/constant'
import StatusTag from '@/components/StatusTag'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const index: React.FC = () => {
  const polymericRef = useRef<NormalTableRefHandleType | null>(null)
  const intl = useIntl()
  /** 获取8D查询数据 */
  const fetchTableList = async (params) => {
    const res = await postOrderEightDRectificationList(
      {
        eightDRectificationType: 12,
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
          <Link to={`/qualityAbility/8DCoordination/coordinationQuery/detail?id=${record.id}`}>{text}</Link>
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
        id: 'eightD.caigouhuiyuan',
        defaultMessage: '采购会员',
      }),
      dataIndex: 'memberName',
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
      width: '140px',
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
              useAsyncInitSelect(['outerStatus'], async () => {
                let result = { outerStatus: [], internalStatus: [] }
                const { data, code } = await postOrderEightDRectificationEnumOuters({}, { ctlType: 'none' })
                if (code === 1000 && isArray(data)) {
                  result.outerStatus = data.map((item) => ({
                    label: item.text,
                    value: item.id,
                  }))
                }
                return result
              })
            },
          }}
          scroll={{ x: 1400 }}
          ref={polymericRef}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default index
