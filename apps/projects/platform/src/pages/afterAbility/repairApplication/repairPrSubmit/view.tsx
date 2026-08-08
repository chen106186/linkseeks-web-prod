import React, { useState, useRef } from 'react'
import { Badge, Button, Popconfirm, Space, message } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { PlusOutlined } from '@ant-design/icons'
import { dateFormat } from '@apps/utils/src/format'
import { PageHeaderWrapper, StandardFormTable, useTableRef } from '@apps/components'
import {
  getAftersalesRepairGoodsPageToBeSubmitByConsumer,
  postAftersalesRepairGoodsDelete,
  postAftersalesRepairGoodsSubmit,
} from '@apps/apis'

import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { REPAIR_INNER_STATUS_UNCOMMITTED, REPAIR_OUTER_STATUS_FAILED } from '@/constants/afterService'
import { REPAIR_OUTER_STATUS_TAG_MAP, REPAIR_INNER_STATUS_BADGE_MAP } from '../../constants'

import { AuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'

const RepairPrSubmit: React.FC = () => {
  const tableRef = useTableRef()
  const translate = useWebIntl()
  const handleDelete = (record) => {
    const msg = message.loading({
      content: translate('web.resource.afterAbility.zhengzaishanchu'),
      duration: 0,
    })
    postAftersalesRepairGoodsDelete({
      id: record.applyId,
    })
      .then((res) => {
        if (res.code === 1000) {
          tableRef.current.reload()
        }
      })
      .finally(() => {
        msg()
      })
  }

  const handleSubmit = (record) => {
    const msg = message.loading({
      content: translate('web.resource.afterAbility.zhengzaitijiao'),
      duration: 0,
    })
    postAftersalesRepairGoodsSubmit({
      id: record.applyId,
    })
      .then((res) => {
        if (res.code === 1000) {
          tableRef.current.reload()
        }
      })
      .finally(() => {
        msg()
      })
  }

  const columns: any[] = [
    {
      title: translate('web.resource.member.shenqingdanhao'),
      dataIndex: 'applyNo',
      key: 'applyNo',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton url={`/afterAbility/repairApplication/repairPrSubmit/detail?id=${record.applyId}`}>
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
      searchField: {
        type: 'Input',
        main: true,
      },
    },
    {
      title: translate('web.resource.afterAbility.shenqingzhaiyao'),
      dataIndex: 'applyAbstract',
      key: 'applyAbstract',
      ellipsis: true,
      searchField: 'Input',
    },
    {
      title: translate('web.resource.afterAbility.supplierName'),
      dataIndex: 'supplierName',
      key: 'supplierName',
      searchField: 'Input',
    },
    {
      title: translate('web.resource.afterAbility.applyTime'),
      dataIndex: 'applyTime',
      key: 'applyTime',
      searchField: {
        type: 'DateSelect',
      },
    },
    {
      title: translate('web.resource.afterAbility.outerStatus'),
      dataIndex: 'outerStatusName',
      key: 'outerStatusName',
      render: (text, record) => <StatusTag type={REPAIR_OUTER_STATUS_TAG_MAP[record.outerStatus]} title={text} />,
    },
    {
      title: translate('web.resource.afterAbility.innerStatus'),
      dataIndex: 'innerStatusName',
      key: 'innerStatusName',
      render: (text, record) => (
        <Badge color={REPAIR_INNER_STATUS_BADGE_MAP[record.innerStatus] || '#606266'} text={text} />
      ),
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      render: (text, record) => (
        <>
          {record.innerStatus === REPAIR_INNER_STATUS_UNCOMMITTED && (
            <AuthButton type="custom" code="commit">
              <Button type="link" onClick={() => handleSubmit(record)}>
                {translate('web.common.submit')}
              </Button>
            </AuthButton>
          )}
          {/* 外部状态为不接受申请 或者 内部状态为 待提交申请 都可以进行编辑 */}
          {(record.outerStatus === REPAIR_OUTER_STATUS_FAILED ||
            record.innerStatus === REPAIR_INNER_STATUS_UNCOMMITTED) && (
            <AuthButton type="edit" code="edit">
              <Button
                type="link"
                onClick={() => history.push(`/afterAbility/repairApplication/repairPrSubmit/edit?id=${record.applyId}`)}
              >
                {translate('web.common.edit')}
              </Button>
            </AuthButton>
          )}
          {record.innerStatus === REPAIR_INNER_STATUS_UNCOMMITTED && (
            <AuthButton type="custom" code="del">
              <Popconfirm
                title={translate('web.resource.logistics.quedingyaoshanchu')}
                okText={translate('web.common.shi')}
                cancelText={translate('web.common.fou')}
                onConfirm={() => handleDelete(record)}
              >
                <Button type="link" danger>
                  {translate('web.common.delete')}
                </Button>
              </Popconfirm>
            </AuthButton>
          )}
        </>
      ),
    },
  ]
  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        rowKey="applyId"
        actionRef={tableRef}
        searchButtons={[
          {
            key: 'add',
            children: '新建',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick() {
              history.push(`/afterAbility/repairApplication/repairPrSubmit/add`)
            },
          },
        ]}
        request={(params) => {
          const [startTime, endTime] = params?.applyTime?.split(',') || []
          if (startTime) {
            params.startTime = dateFormat(new Date(+startTime), 'YY-MM-DD HH:mm:ss')
          }
          if (endTime) {
            params.endTime = dateFormat(new Date(+endTime), 'YY-MM-DD HH:mm:ss')
          }
          delete params.applyTime
          return getAftersalesRepairGoodsPageToBeSubmitByConsumer(params)
        }}
      />
    </PageHeaderWrapper>
  )
}

export default RepairPrSubmit
