import React, { useRef, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button, Badge, message, Modal, Space } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { QuestionCircleOutlined } from '@ant-design/icons'

import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
// import { EyeAuthButton } from '@apps/components';
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import {
  getMemberSupplierAbilityAssignedPage,
  getMemberSupplierAbilityAssignedPageitems,
  postMemberSupplierAbilityAssignedBind,
  GetMemberSupplierAbilityAssignedPageResponseDetail,
} from '@apps/apis'
import useSpliceArray from '@/hooks/useSpliceArray'
import { querySchema } from './schema2'
import { MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_OUTER_STATUS_TYPE } from '../../constant'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'

const formActions = createFormActions()

const MemberMaintain: React.FC<[]> = () => {
  // const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [data, setData] = useState<any>([])
  const [selectRow, selectRowFns] = useRowSelectionTable({ customKey: 'validateId' })

  const fetchData = async (params: any) => {
    const { startDate = null, endDate = null } = params
    const payload = { ...params }

    if (startDate) {
      payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
    }
    if (endDate) {
      payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
    }
    const res = await getMemberSupplierAbilityAssignedPage(payload)

    if (res.code === 1000) {
      setData(res.data.data)
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const ref = useRef<any>({})
  const intl = useIntl()
  const { confirm } = Modal

  const defaultColumns: ColumnType<GetMemberSupplierAbilityAssignedPageResponseDetail>[] = [
    {
      title: `${intl.formatMessage({
        id: 'supplier.management.maintain.query.supplierId',
      })}/${intl.formatMessage({
        id: 'supplier.management.maintain.query.supplierName',
      })}`,
      dataIndex: 'memberId',
      width: 150,
      render: (text, record) => (
        <>
          <div>{text}</div>
          {/* <EyeAuthButton
            url={`/supplierAbility/manage/maintain/detail?id=${record.memberId}&validateId=${record.validateId}`}
          >
            {record.name}
          </EyeAuthButton> */}
          {record.name}
        </>
      ),
    },
    // {
    //   title: intl.formatMessage({
    //     id: 'member.management.maintain.query.memberTypeName',
    //   }),
    //   dataIndex: 'memberTypeName',
    // },
    // {
    //   title: intl.formatMessage({
    //     id: 'member.management.maintain.query.roleName',
    //   }),
    //   dataIndex: 'roleName',
    // },

    {
      title: `${intl.formatMessage({
        id: 'member.management.assigned.query.sourceName',
      })}`,
      dataIndex: 'sourceName',
      // render: (text, record) => (
      //   <>
      //     <div>{text}</div>
      //   </>
      // ),
    },
    {
      title: `${intl.formatMessage({
        id: 'member.memberQuery.query.defaultColumns.registerTime',
      })}`,
      dataIndex: 'registerTime',
      // render: (text, record) => (
      //   <>
      //     <div className={styles.description}>{record.registerTime}</div>
      //   </>
      // ),
    },
    {
      title: `${intl.formatMessage({
        id: 'member.memberQuery.query.defaultColumns.depositTime',
      })}`,
      dataIndex: 'depositTime',
      // render: (text, record) => (
      //   <>
      //     <div className={styles.description}>{record.registerTime}</div>
      //   </>
      // ),
    },

    // {
    //   title: intl.formatMessage({
    //     id: 'member.management.maintain.query.level',
    //   }),
    //   dataIndex: 'level',
    //   render: (_, record) => record.levelTag,
    // },
    {
      title: intl.formatMessage({
        id: 'supplier.management.maintain.query.statusName',
      }),
      dataIndex: 'statusName',
    },
    {
      title: intl.formatMessage({
        id: 'member.management.maintain.query.outerStatusName',
      }),
      dataIndex: 'outerStatusName',
      render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
    },
    {
      title: intl.formatMessage({
        id: 'member.management.maintain.query.innerStatusName',
      }),
      dataIndex: 'innerStatusName',
      render: (text, record) => (
        <Badge color={MEMBER_INNER_STATUS_BADGE_COLOR[record.innerStatus] || '#606266'} text={text} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'option',
      render: (_, record) => (
        <Button type="link" onClick={() => handleReceive(record.memberId, record.roleId)}>
          {intl.formatMessage({
            id: 'member.management.assigned.query.receive',
          })}
        </Button>
      ),
    },
  ]

  const [columns] = useSpliceArray<ColumnType<any>>(defaultColumns)

  // 初始化高级筛选选项
  const fetchSelectOptions = async () => {
    const res = await getMemberSupplierAbilityAssignedPageitems()

    if (res.code === 1000) {
      const { data = {} }: any = res
      const {
        innerStatus = [],
        outerStatus = [],
        status = [],
        memberTypes = [],
        roles = [],
        levels = [],
        sources = [],
      } = data

      return {
        memberType: memberTypes.map((item) => ({
          label: item.memberTypeName,
          value: item.memberType,
        })),
        roleId: roles.map((item) => ({
          label: item.roleName,
          value: item.roleId,
        })),
        level: levels.map((item) => ({
          label: item.levelTag,
          value: item.level,
        })),
        source: sources.map((item) => ({ label: item.text, value: item.id })),
        innerStatus: innerStatus.map((item) => ({
          label: item.text,
          value: item.id,
        })),
        outerStatus: outerStatus.map((item) => ({
          label: item.text,
          value: item.id,
        })),
        status: status.map((item) => ({ label: item.text, value: item.id })),
      }
    }
    return {}
  }

  // const rowSelection = {
  //   onChange: (keys: number[]) => {
  //     setSelectedRowKeys(keys);
  //   },
  //   selectedRowKeys: selectedRowKeys,
  // };

  const handleReceive = (memberId, roleId) => {
    let selectDataParam = [{ subMemberId: memberId, subRoleId: roleId }]

    postMemberSupplierAbilityAssignedBind(selectDataParam, { ctlType: 'none' })
      .then((res) => {
        if (res.code === 1000) {
          message.success(
            intl.formatMessage({
              id: 'supplier.management.assigned.query.bind.suc',
            }),
          )
          setTimeout(() => {
            ref.current.reloadCurrent()
            selectRowFns.setSelectRow([])
            selectRowFns.setSelectedRowKeys([])
          }, 200)
        }
      })
      .catch((err) => {
        message.error(err.message)
      })
  }

  const handleBatch = () => {
    if (!selectRow?.selectedRowKeys.length) {
      message.warning(intl.formatMessage({ id: 'supplier.actions.batch.nothing' }))
      return
    }

    let selectDataParam = []
    selectRowFns?.selectRow?.length &&
      selectRowFns?.selectRow.map((item) => {
        selectRow?.selectedRowKeys?.length &&
          selectRow?.selectedRowKeys.map((i) => {
            if (item.validateId === i) {
              selectDataParam.push({ subMemberId: item.memberId, subRoleId: item.roleId })
            }
          })
      })

    console.log('选中data:', selectDataParam)

    confirm({
      title: intl.formatMessage({ id: 'member.actions.verify-tip' }),
      icon: <QuestionCircleOutlined />,
      content: intl.formatMessage({
        id: 'supplier.management.supplierPrVerifyComingData.query.get-tip',
      }),
      onOk() {
        return new Promise<void>((resolve, reject) => {
          postMemberSupplierAbilityAssignedBind(selectDataParam, { ctlType: 'none' })
            .then((res) => {
              if (res.code === 1000) {
                resolve()
                message.success(
                  intl.formatMessage({
                    id: 'supplier.management.assigned.query.bind.suc',
                  }),
                )
                setTimeout(() => {
                  ref.current.reloadCurrent()
                  selectRowFns.setSelectRow([])
                  selectRowFns.setSelectedRowKeys([])
                }, 200)
              }
              reject()
            })
            .catch(() => {
              reject()
            })
        })
      },
    })
  }

  const ControllerBtns = () => (
    <Space>
      <Button onClick={handleBatch}>
        {intl.formatMessage({
          id: 'member.management.assigned.query.batchReceive',
        })}
      </Button>
    </Space>
  )

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'validateId',
          }}
          columns={columns}
          currentRef={ref}
          rowSelection={selectRow}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              components={{
                ControllerBtns,
              }}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                useAsyncInitSelect(
                  ['memberType', 'roleId', 'level', 'source', 'innerStatus', 'outerStatus', 'status'],
                  fetchSelectOptions,
                )
              }}
              schema={querySchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberMaintain
