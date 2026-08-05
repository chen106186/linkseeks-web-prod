/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-26 10:26:20
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 18:45:00
 * @Description: 待审核会员变更(二级)
 */
import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Card, Space, Button, Modal, message } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { getMemberModifyGradeTwoPage, postMemberModifyGradeTwoBatch, getMemberModifyPageConditions } from '@apps/apis'
import useSpliceArray from '@/hooks/useSpliceArray'
import { GlobalConfig } from '@/global/config'
import verifyComingSchema from '../../common/schames/verifyComingSchema'
import verifyChangeColumn from '../../common/columns/verifyChangeColumn'
import { useQueryComingEffects } from '../../common/effects/useQueryComingEffects'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const { confirm } = Modal

const formActions = createFormActions()

const MemberPrVerifyChange2: React.FC<{}> = (props) => {
  const ref = useRef<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])

  const intl = useIntl()

  const handleJumpAudit = (record) => {
    history.push(`/customerAbility/manage/memberPrVerifyChange2/edit?validateId=${record.validateId}`)
  }

  const defaultColumns = verifyChangeColumn('/customerAbility/manage/memberPrVerifyChange2/detail').concat([
    {
      title: intl.formatMessage({ id: 'customerAbility.caozuo' }),
      dataIndex: 'option',
      render: (_, record) => (
        <EditAuthButton>
          <Button type="link" onClick={() => handleJumpAudit(record)}>
            {intl.formatMessage({ id: 'customerAbility.actions.verify' })}
          </Button>
        </EditAuthButton>
      ),
    },
  ])

  const [columns, columnsHandle] = useSpliceArray<ColumnType<any>>(defaultColumns)

  const rowSelection = {
    onChange: (keys: number[]) => {
      setSelectedRowKeys(keys)
    },
    selectedRowKeys: selectedRowKeys,
  }

  const fetchListData = async (params: any) => {
    const { startDate = null, endDate = null } = params
    const payload = { ...params }

    if (startDate) {
      payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
    }
    if (endDate) {
      payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
    }

    const res = await getMemberModifyGradeTwoPage(payload)

    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const handleBatch = () => {
    if (!selectedRowKeys.length) {
      message.warning(intl.formatMessage({ id: 'customerAbility.actions.batch.nothing' }))
      return
    }
    confirm({
      title: intl.formatMessage({ id: 'customerAbility.actions.verify-tip' }),
      icon: <QuestionCircleOutlined />,
      content: intl.formatMessage({ id: 'customerAbility.management.memberPrVerifyChange1.query.verify-tip' }),
      onOk() {
        return new Promise<void>((resolve, reject) => {
          postMemberModifyGradeTwoBatch({
            validateIds: selectedRowKeys,
          })
            .then((res) => {
              if (res.code === 1000) {
                ref.current.reload()
                setSelectedRowKeys([])
                resolve()
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

  // 初始化高级筛选选项
  const fetchSearchItems = async () => {
    const res = await getMemberModifyPageConditions()

    if (res.code === 1000) {
      const { data = {} }: any = res
      const { memberTypes = [], roles = [] } = data

      return {
        memberType: memberTypes.map((item) => ({ label: item.memberTypeName, value: item.memberType })),
        roleId: roles.map((item) => ({ label: item.roleName, value: item.roleId })),
      }
    }
    return {}
  }

  const ControllerBtns = () => (
    <Space>
      <Button onClick={handleBatch}>{intl.formatMessage({ id: 'customerAbility.actions.verify-batch' })}</Button>
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
          fetchTableData={(params: any) => fetchListData(params)}
          rowSelection={rowSelection}
          controlRender={
            <NiceForm
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              components={{
                ControllerBtns,
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                if (!GlobalConfig.global.siteInfo.enableMultiTenancy) {
                  useAsyncInitSelect(['memberType', 'roleId', 'source'], fetchSearchItems)
                }
                useQueryComingEffects($, actions)
              }}
              schema={verifyComingSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberPrVerifyChange2
