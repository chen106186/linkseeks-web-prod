/** 8D查询列表 */
import PolymericTable, { NormalTableRefHandleType } from '@/components/PolymericTable'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  postOrderEightDRectificationList,
  postOrderEightDRectificationEnumOuters,
  postOrderEightDRectificationEnumInternals,
  PostOrderEightDRectificationListResponseDetail,
  postOrderEightDRectificationCancel,
} from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { Badge, Button, Card, Input, message, Modal } from 'antd'
import { ColumnType } from 'antd/lib/table'
import moment from 'moment'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { querySchema } from './schema/querySchema'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { isArray } from 'lodash'
import StatusTag from '@/components/StatusTag'
import { EIGHTD_EX_STATUS_TAG_TYPE, EIGHTD_IN_STATUS_BADGE_TYPE } from '../constant'
import SchemaForm, { createAsyncFormActions, createFormActions } from '@apps/formily'
import { modalSchema } from './schema/modalSchema'
import { PageHeaderWrapper } from '@apps/components'
import { QUATITY_EIGHTD_IN_STATUS_CANCEL, QUATITY_EIGHTD_IN_STATUS_FINISH } from '@/constants/quatity'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { authService } from '@apps/services'

const action = createFormActions()
const index: React.FC = () => {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const polymericRef = useRef<NormalTableRefHandleType | null>(null)
  const intl = useIntl()
  /** 获取8D查询数据 */
  const fetch8DSelectList = async (params) => {
    const res = await postOrderEightDRectificationList(
      {
        eightDRectificationType: 1,
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
        return AuthUrl('detail') ? <Link to={`/qualityAbility/8D/query/detail?id=${record.id}`}>{text}</Link> : text
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
      render: (text, record) => {
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
      width: '100px',
      render: (text, record) => {
        //  内部状态为“已取消”、“已完成” 不显示“取消8d”按钮
        return record.internalStatus === QUATITY_EIGHTD_IN_STATUS_CANCEL ||
          record.internalStatus === QUATITY_EIGHTD_IN_STATUS_FINISH ? null : (
          <AuthButton type="custom" code={'cancel'}>
            <Button
              type="link"
              onClick={() => {
                setShowCancelModal(true)
                action.setFieldValue('formData', {
                  cancelTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                  id: record.id,
                  eightDRectificationNo: text,
                  cancelReason: '',
                })
              }}
            >
              {intl.formatMessage({
                id: 'eightD.quxiao8D',
                defaultMessage: '取消8D',
              })}
            </Button>
          </AuthButton>
        )
      },
    },
  ]
  /** 确定取消8D */
  const comfirmCancel = () => {
    action.validate().then((errorRes) => {
      if (errorRes.errors.length === 0) {
        const value = action.getFieldValue('formData')
        postOrderEightDRectificationCancel({
          ...value,
        }).then((res) => {
          const { code } = res
          if (code === 1000) {
            polymericRef.current.reload()
          }
          setShowCancelModal(false)
        })
      }
    })
  }
  /** 获取内外部状态列表 */
  const getInOrExStatus = async () => {
    let result = { outerStatus: [], internalStatus: [] }
    const { data: dataEx, code: codeEx } = await postOrderEightDRectificationEnumOuters({}, { ctlType: 'none' })
    const { data: dataIn, code: codeIn } = await postOrderEightDRectificationEnumInternals({}, { ctlType: 'none' })
    if (codeEx === 1000 && isArray(dataEx)) {
      result.outerStatus = dataEx.map((item) => ({
        label: item.text,
        value: item.id,
      }))
    }
    if (codeIn === 1000 && isArray(dataIn)) {
      result.internalStatus = dataIn.map((item) => ({
        label: item.text,
        value: item.id,
      }))
    }
    return result
  }
  return (
    <>
      <PageHeaderWrapper>
        <Card>
          <PolymericTable
            rowKey="eightDRectificationNo"
            columns={columns}
            fetchDataSource={(params) => fetch8DSelectList(params)}
            defaultPageSize={10}
            searchFormProps={{
              schema: querySchema,
              effects: ($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'eightDRectificationNo', FORM_FILTER_PATH)
                useAsyncInitSelect(['outerStatus', 'internalStatus'], getInOrExStatus)
              },
            }}
            scroll={{ x: 1200 }}
            ref={polymericRef}
          />
        </Card>
      </PageHeaderWrapper>
      {/* 取消8D弹窗 */}
      <Modal
        title={intl.formatMessage({
          id: 'eightD.quxiao8D',
          defaultMessage: '取消8D',
        })}
        visible={showCancelModal}
        onCancel={() => {
          setShowCancelModal(false)
        }}
        onOk={comfirmCancel}
      >
        <SchemaForm actions={action} schema={modalSchema} components={{ TextArea: Input.TextArea }}></SchemaForm>
      </Modal>
    </>
  )
}

export default index
