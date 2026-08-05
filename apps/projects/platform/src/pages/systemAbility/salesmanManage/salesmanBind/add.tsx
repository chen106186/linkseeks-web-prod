import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Col, Input, message, Popconfirm, Row } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { Card as CardLayout } from '@linkseeks/ui'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { PageStatus, usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { useLocation, getCurrentRouter } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import {
  getMemberAbilitySalesChannel,
  getMemberAbilitySalesSelect,
  postMemberAbilitySalesChannelBind,
  postMemberAbilitySalesChannelPage,
  postMemberAbilitySalesChannelUnbind,
} from '@apps/apis'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import StandardTable from '@/components/StandardTable'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import ModalTable from '@/components/ModalTable'

const intl = getIntl()

export const Tablink = [
  { key: 'basicLayout', label: intl.formatMessage({ id: 'shop.seo.tab.basic' }) },
  { key: 'manageLayout', label: intl.formatMessage({ id: 'channel.member.tab.manage.subordinate' }) },
]

const formAction = createFormActions()

const fetchMemberAbilitySelect = async (params) => {
  const { data } = await getMemberAbilitySalesSelect(params)
  return data
}

const SalesmanBindAdded = (props) => {
  const staticData = useRef<any>([])
  const [rowSelection, rowCtl] = useRowSelectionTable({ customKey: 'relationId' })
  const [realRowSelection, realRowCtl] = useRowSelectionTable({ customKey: 'relationId' })
  const [memberVisible, setMemberVisible] = useState(false)
  const { pageStatus, id } = usePageStatus()
  const [tableData, setTableData] = useState<any[]>([])
  const [keywordName, setKeywordName] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const { pathname } = useLocation()

  /** 用户Id（业务员Id） */
  const [userId, setUserId] = useState<number>()
  /** 过滤已有的下级会员 */

  const fliterTableData = useMemo(() => {
    if (!keywordName) {
      return tableData
    }
    return tableData.filter((v) => v.name.toString().includes(keywordName))
  }, [tableData, keywordName])

  useEffect(() => {
    if (id) {
      fetchSaleChannel()
    }
  }, [id])

  const fetchSaleChannel = async () => {
    getMemberAbilitySalesChannel({
      userId: id,
      current: '1',
      pageSize: '20',
      name: keywordName,
    }).then((res) => {
      if (res.code === 1000) {
        formAction.setFieldValue('userId', [res.data])
        // rowCtl.setSelectRow(res.data.data)
        // rowCtl.setSelectedRowKeys(res.data.data.map(_item => _item.relationId))
        setTableData(res.data.data)
      }
    })
  }

  const handleSearchChannel = () => {}

  useEffect(() => {
    staticData.current = realRowCtl.selectedRowKeys
  }, [realRowCtl.selectedRowKeys])

  useEffect(() => {
    rowCtl.setSelectedRowKeys(tableData.map((v) => v.relationId))
    rowCtl.setSelectRow([...tableData])

    realRowCtl.setSelectedRowKeys(tableData.filter((v) => !staticData.current.includes(v)))
  }, [tableData])

  const cacelConnect = (record) => {
    unBindMember(record)
  }

  const abilityColumns: any[] = [
    {
      key: 'userId',
      dataIndex: 'userId',
      title: intl.formatMessage({ id: 'channel.member.table.userId' }),
      align: 'center',
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: intl.formatMessage({ id: 'channel.member.table.name' }),
      align: 'center',
    },
    {
      key: 'phone',
      dataIndex: 'phone',
      title: intl.formatMessage({ id: 'channel.member.table.phone' }),
      align: 'center',
    },
    {
      key: 'orgName',
      dataIndex: 'orgName',
      title: intl.formatMessage({ id: 'channel.member.table.orgName' }),
      align: 'center',
    },
    {
      key: 'jobTitle',
      dataIndex: 'jobTitle',
      title: intl.formatMessage({ id: 'channel.member.table.jobTitle' }),
      align: 'center',
    },
  ]

  const connectMemberColumns: any[] = [
    {
      key: 'memberId',
      dataIndex: 'memberId',
      title: intl.formatMessage({ id: 'channel.member.table.memberId' }),
      align: 'center',
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: intl.formatMessage({ id: 'channel.member.table.memberName' }),
      align: 'center',
    },
    {
      key: 'memberTypeName',
      dataIndex: 'memberTypeName',
      title: intl.formatMessage({ id: 'channel.member.table.memberTypeName' }),
      align: 'center',
    },
    {
      key: 'roleName',
      dataIndex: 'roleName',
      title: intl.formatMessage({ id: 'channel.member.table.roleName' }),
      align: 'center',
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: intl.formatMessage({ id: 'channel.member.table.createTime' }),
      align: 'center',
    },
    {
      key: 'levelTag',
      dataIndex: 'levelTag',
      title: intl.formatMessage({ id: 'channel.member.table.levelTag' }),
      align: 'center',
    },
    {
      key: 'statusName',
      dataIndex: 'statusName',
      title: intl.formatMessage({ id: 'channel.member.table.statusName' }),
      align: 'center',
    },
    {
      key: 'ctl',
      dataIndex: 'ctl',
      title: intl.formatMessage({ id: 'common.table.action' }),
      align: 'center',
      render: (_, record) => {
        return (
          <Popconfirm
            disabled={pageStatus === PageStatus.PREVIEW}
            title={intl.formatMessage({ id: 'channel.member.relieve.confirm' })}
            onConfirm={() => cacelConnect(record)}
          >
            <Button type="link" disabled={pageStatus === PageStatus.PREVIEW}>
              {intl.formatMessage({ id: 'channel.member.relieve' })}
            </Button>
          </Popconfirm>
        )
      },
    },
  ]

  const modalMemberColumns: any[] = [
    {
      title: intl.formatMessage({ id: 'channel.member.table.memberId' }),
      dataIndex: 'memberId',
      key: 'memberId',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'channel.member.table.memberName' }),
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'channel.member.table.memberTypeName' }),
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'channel.member.table.roleName' }),
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'channel.member.table.levelTag' }),
      dataIndex: 'levelTag',
      key: 'levelTag',
      align: 'center',
    },
  ]

  const fetchTableData = async (params) => {
    const { data } = await postMemberAbilitySalesChannelPage(
      { ...params, userId, relationIds: tableData.map((_item) => _item?.relationId) },
      { ctlType: 'none' },
    )
    return data
  }

  const handleConfirm = () => {
    setMemberVisible(false)
    setTableData(rowCtl.selectRow)
  }

  const unBindMember = async (options?) => {
    const relationIds = []
    if (options) {
      // 单选
      const { relationId, isRemote } = options
      if (pageStatus === PageStatus.ADD || !isRemote) {
        // 新增或者编辑时是未保存状态的渠道业务员则无需调用接口 直接删除
        setTableData((d) => d.filter((v) => v.relationId !== relationId))
        return false
      }
      relationIds.push(relationId)
    } else {
      // 批量
      if (pageStatus === PageStatus.ADD) {
        // 新增情况下 删除本地数据
        setTableData((d) => {
          return d.filter((v) => !realRowCtl.selectedRowKeys.includes(v.relationId))
        })
        return false
      }

      const localRow = realRowCtl.selectRow.filter((v) => !v.isRemote)
      const localRowKey = localRow.map((v) => v.relationId)
      const remoteRowKey = realRowCtl.selectRow.filter((v) => v.isRemote).map((v) => v.relationId)
      setTableData((d) => {
        return d.filter((v) => !localRow.find((l) => l.relationId === v.relationId))
      })
      if (remoteRowKey.length === 0) {
        clearRealRowCtl(localRowKey)
        return false
      }
      relationIds.push(...remoteRowKey)
    }
  }

  const clearRealRowCtl = (ids: any[]) => {
    realRowCtl.setSelectRow([...realRowCtl.selectRow.filter((v) => !ids.includes(v.relationId))])
    realRowCtl.setSelectedRowKeys([...realRowCtl.selectedRowKeys.filter((v) => !ids.includes(v))])
  }

  const handleSubmit = async () => {
    const userInfo = formAction.getFieldValue('userId')
    if (userInfo && userInfo.length > 0) {
      const userId = userInfo[0].userId
      setLoading(true)
      const result = await postMemberAbilitySalesChannelBind({
        userId,
        relationIds: tableData.map((v) => v.relationId),
      })

      if (result.code !== 1000) {
        setLoading(false)
        return
      }
      history.goBack()
    }
  }

  return (
    <PageHeaderWrapper
      // hideBreak
      title={getCurrentRouter(pathname)?.title}
      items={Tablink}
      extra={
        <Button type="primary" disabled={pageStatus === PageStatus.PREVIEW} loading={loading} onClick={handleSubmit}>
          {intl.formatMessage({ id: 'common.button.save' })}
        </Button>
      }
    >
      <Fragment>
        <CardLayout id="basicLayout" title={intl.formatMessage({ id: 'shop.seo.tab.basic' })}>
          <Row>
            <Col span={12}>
              <NiceForm
                labelCol={6}
                wrapperCol={24}
                labelAlign="left"
                actions={formAction}
                editable={pageStatus !== PageStatus.PREVIEW}
                previewPlaceholder=" "
                schema={{
                  type: 'object',
                  properties: {
                    userId: {
                      type: 'string',
                      title: intl.formatMessage({ id: 'channel.form.salesman' }),
                      'x-component': 'CustomRelevance',
                      'x-component-props': {
                        title: intl.formatMessage({ id: 'common.text.select' }),
                        disabled: pageStatus === PageStatus.EDIT,
                        modalProps: {
                          title: intl.formatMessage({ id: 'channel.form.modal.salesman.title' }),
                        },
                        columns: abilityColumns,
                        fetchTableData: fetchMemberAbilitySelect,
                        formilyProps: {
                          ctx: {
                            schema: {
                              type: 'object',
                              properties: {
                                name: {
                                  type: 'string',
                                  'x-component': 'SearchFilter',
                                  'x-component-props': {
                                    placeholder: intl.formatMessage({ id: 'common.form.name.placeholder' }),
                                    align: 'flex-start',
                                  },
                                },
                                [FORM_FILTER_PATH]: {
                                  type: 'object',
                                  'x-component': 'flex-layout',
                                  'x-component-props': {
                                    inline: true,
                                    rowStyle: {
                                      justifyContent: 'flex-start',
                                    },
                                    colStyle: {
                                      marginRight: 20,
                                    },
                                  },
                                  properties: {
                                    orgName: {
                                      type: 'string',
                                      'x-component-props': {
                                        placeholder: intl.formatMessage({ id: 'channel.form.orgName.placeholder' }),
                                      },
                                    },
                                    jobTitle: {
                                      type: 'string',
                                      'x-component-props': {
                                        placeholder: intl.formatMessage({ id: 'channel.form.orgName.jobTitle' }),
                                      },
                                    },
                                    submit: {
                                      'x-component': 'Submit',
                                      'x-component-props': {
                                        children: intl.formatMessage({ id: 'common.button.query' }),
                                      },
                                    },
                                  },
                                },
                              },
                            },
                            components: {
                              Search,
                              Submit,
                            },
                            effects: ($, actions) => {
                              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                            },
                            inline: false,
                          },
                        },
                        tableProps: {
                          rowKey: 'userId',
                          lableKey: 'name',
                        },
                      },
                      'x-mega-props': {
                        wrapperCol: 12,
                      },
                      'x-rules': [
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'channel.form.salesman.placeholder' }),
                        },
                      ],
                    },
                  },
                }}
                effects={($, ctx) => {
                  $('onFieldValueChange', 'userId').subscribe(async (state) => {
                    if (state?.value) {
                      setUserId(state?.value[0].userId)
                    }
                  })
                }}
              />
            </Col>
          </Row>
        </CardLayout>
        <CardLayout id="manageLayout" title={intl.formatMessage({ id: 'channel.member.tab.manage.subordinate' })}>
          <>
            <Row justify="space-between" style={{ marginBottom: 20 }}>
              <Col>
                <Button type="default" onClick={() => unBindMember()} disabled={pageStatus === PageStatus.PREVIEW}>
                  {intl.formatMessage({ id: 'channel.member.relieve.batch' })}
                </Button>
              </Col>
              <Col style={{ display: 'flex' }}>
                <Input.Search
                  placeholder={intl.formatMessage({ id: 'channel.form.memberName.placeholder' })}
                  value={keywordName}
                  onChange={(e) => setKeywordName(e.target.value)}
                  onPressEnter={handleSearchChannel}
                />
                <Button type="default" style={{ marginLeft: 20 }} onClick={() => setKeywordName('')}>
                  {intl.formatMessage({ id: 'common.button.reset' })}
                </Button>
              </Col>
            </Row>
            <Button
              style={{ marginBottom: '16px' }}
              block
              type="dashed"
              onClick={() => setMemberVisible(true)}
              disabled={!!!userId}
            >
              {intl.formatMessage({ id: 'channel.member.wait.bind.select' })}
            </Button>
            <StandardTable
              keepAlive={false}
              columns={connectMemberColumns}
              rowSelection={pageStatus !== PageStatus.PREVIEW && realRowSelection}
              rowKey="relationId"
              tableProps={{
                dataSource: fliterTableData,
                pagination: {
                  showSizeChanger: true,
                  showQuickJumper: true,
                  size: 'small',
                  pageSizeOptions: ['10', '20', '50', '100'],
                  total: fliterTableData.length,
                  showTotal: () =>
                    intl.formatMessage({ id: 'componnets.standardTablePages', totalPage: fliterTableData.length }),
                },
              }}
            />
          </>
        </CardLayout>
        <ModalTable
          confirm={handleConfirm}
          cancel={() => setMemberVisible(false)}
          visible={memberVisible}
          width={960}
          modalTitle={intl.formatMessage({ id: 'channel.modal.member.select' })}
          rowSelection={rowSelection}
          columns={modalMemberColumns}
          fetchTableData={fetchTableData}
          rowKey={'relationId'}
          forceRender
          formilyProps={{
            ctx: {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    'x-component': 'Search',
                    'x-component-props': {
                      placeholder: intl.formatMessage({ id: 'channel.form.name.placeholder' }),
                    },
                  },
                },
              },
            },
          }}
        />
      </Fragment>
    </PageHeaderWrapper>
  )
}
export default SalesmanBindAdded
