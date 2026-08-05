/** 待提交8D（B2B） */
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import PolymericTable, { NormalTableRefHandleType } from '@/components/PolymericTable'
import StatusTag from '@/components/StatusTag'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import {
  postOrderEightDRectificationList,
  PostOrderEightDRectificationListResponseDetail,
  postOrderEightDRectificationDelete,
  postOrderEightDRectificationSubmit,
} from '@apps/apis'
import { CaretDownOutlined, PlusOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card, Dropdown, Menu, Modal, Space } from 'antd'
import { ColumnType } from 'antd/lib/table'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { getOuterStatusFilter } from '../componentsFn/getStatusFilterArray'
import { EIGHTD_EX_STATUS_TAG_TYPE } from '../constant'
import { querySchema } from './schema/querySchema'

const waitingSubmitB2B: React.FC = () => {
  const polymericRef = useRef<NormalTableRefHandleType | null>(null)
  const intl = useIntl()
  /** 列配置 */
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
          <Link to={`/qualityAbility/8D/wantaSubmittedB2b/detail?id=${record.id}`}>{text}</Link>
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
      width: '140px',
      sorter: (current, next) => {
        return current.productDetail?.code?.localeCompare(next.productDetail?.code)
      },
      render: (_text, record) => record.productDetail?.code,
    },
    {
      title: intl.formatMessage({
        id: 'eightD.wuliaomingcheng3',
        defaultMessage: '商品名称',
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
        id: 'eightD.caozuo',
        defaultMessage: '操作',
      }),
      dataIndex: 'operate',
      fixed: 'right',
      width: '160px',
      render: (_text, record) => {
        return (
          <>
            <AuthButton type="custom" code="submit">
              <Button
                type="link"
                onClick={() => {
                  handleSubmit(record.id)
                }}
              >
                {intl.formatMessage({
                  id: 'eightD.tijiao',
                  defaultMessage: '提交',
                })}
              </Button>
            </AuthButton>

            <Dropdown
              overlay={
                <Menu>
                  {AuthUrl('edit') && (
                    <Menu.Item
                      onClick={() => {
                        history.push(`/qualityAbility/8D/wantaSubmittedB2b/edit?id=${record.id}&edit=true`)
                      }}
                    >
                      {intl.formatMessage({
                        id: 'eightD.bianji',
                        defaultMessage: '编辑',
                      })}
                    </Menu.Item>
                  )}
                  {AuthUrl('del') && (
                    <Menu.Item
                      onClick={() => {
                        handleDelete(record.id)
                      }}
                    >
                      {intl.formatMessage({
                        id: 'eightD.shanchu',
                        defaultMessage: '删除',
                      })}
                    </Menu.Item>
                  )}
                  {AuthUrl('add') && (
                    <Menu.Item
                      onClick={() => {
                        history.push(`/qualityAbility/8D/wantaSubmittedB2b/add?id=${record.id}`)
                      }}
                    >
                      {intl.formatMessage({
                        id: 'eightD.zhakan',
                        defaultMessage: '查看',
                      })}
                    </Menu.Item>
                  )}
                </Menu>
              }
            >
              <Button type="link">
                <span>
                  <span>
                    {intl.formatMessage({
                      id: 'eightD.gengduo',
                      defaultMessage: '更多',
                    })}
                  </span>
                  <CaretDownOutlined />
                </span>
              </Button>
            </Dropdown>
          </>
        )
      },
    },
  ]
  /** 获取列表数据 */
  const fetchTableList = async (params) => {
    const res = await postOrderEightDRectificationList(
      {
        eightDRectificationType: 3,
        ...params,
      },
      { ctlType: 'none' },
    )
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }
  /** 新增按钮 */
  const renderAddBtn = () => (
    <Space>
      <AuthButton type="custom" code="add">
        <Button
          type="primary"
          onClick={() => {
            history.push('/qualityAbility/8D/wantaSubmittedB2b/detail')
          }}
          icon={<PlusOutlined />}
        >
          {intl.formatMessage({ id: 'eightD.xinzeng', defaultMessage: '新增' })}
        </Button>
      </AuthButton>
    </Space>
  )
  /** 点击提交 */
  const handleSubmit = (id) => {
    Modal.confirm({
      content: intl.formatMessage({
        id: 'eightD.shifouyiquerentijiao8D',
        defaultMessage: '是否已确认提交8D报告？提交后不允许再撤回。',
      }),
      onOk: () => {
        postOrderEightDRectificationSubmit({ id }).then((res) => {
          if (res.code === 1000) {
            polymericRef.current.reload()
          }
        })
      },
    })
  }
  /** 点击删除 */
  const handleDelete = (id) => {
    postOrderEightDRectificationDelete({ id }).then((res) => {
      if (res.code === 1000) {
        polymericRef.current.reload()
      }
    })
  }

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
            components: {
              renderAddBtn,
            },
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
export default waitingSubmitB2B
