/*
 * @Description: 考评人Field组件
 */
import { useMemo, useState, useEffect } from 'react'
import { Button, Drawer, message } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { EditOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { getMemberUserPage, GetMemberUserPageResponseDetail } from '@apps/apis'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import PolymericTable, { FetchParamsType } from '@/components/PolymericTable'
import { querySchema } from './querySchema'
import styles from './index.less'

export type UserType = GetMemberUserPageResponseDetail & {}

type ExtraFetchType = FetchParamsType & {
  /**
   * 姓名
   */
  name: string
  /**
   * 部门
   */
  orgName: string
  /**
   * 电话
   */
  phone: string
}

export type EvaluatorValueType = {
  /**
   * 评分人id
   */
  userId: number
  /**
   * 评分人姓名
   */
  userName: string
}[]

const ModifiesEvaluatorField = (props) => {
  const { value, editable } = props

  const [visibleDrawer, setVisibleDrawer] = useState(false)

  const [rowSelection, rowCtl] = useRowSelectionTable({ type: 'radio', customKey: 'userId' })

  const intl = useIntl()

  useEffect(() => {
    if ('value' in props && value) {
      rowCtl.setSelectRow(value.map(({ userName, ...rest }) => ({ name: userName, ...rest })))
      rowCtl.setSelectedRowKeys(value.map((item) => item.userId))
    }
  }, [value])

  const columns: ColumnType<UserType>[] = useMemo(
    () => [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '部门',
        dataIndex: 'orgName',
      },
      {
        title: '职位',
        dataIndex: 'jobTitle',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '邮件',
        dataIndex: 'email',
      },
    ],
    [],
  )

  const fetchUserList = async (params: ExtraFetchType) => {
    const res = await getMemberUserPage(
      {
        ...(params as any),
        current: `${params.current}`,
        pageSize: `${params.pageSize}`,
      },
      {
        ctlType: 'none',
      },
    )
    if (res.code === 1000) {
      return res.data
    }
    return { data: [], totalCount: 0 }
  }

  const handleVisibleDrawer = (flag?: boolean) => {
    setVisibleDrawer(!!flag)
  }

  const handleConfirm = () => {
    if (!rowCtl.selectRow.length) {
      message.warning('请选择考评人')
      return
    }
    if (props.mutators.change) {
      props.mutators.change(
        rowCtl.selectRow.map((item) => ({
          userId: item.userId,
          userName: item.name,
        })),
      )
    }
    handleVisibleDrawer(false)
  }

  const evaluator: EvaluatorValueType[0] = useMemo(() => value?.[0], [value])

  if (!editable) {
    return <div>{evaluator?.userName || ''}</div>
  }

  return (
    <div className={styles['modifies-evaluator']}>
      <div className={styles['modifies-evaluator-control']} onClick={() => handleVisibleDrawer(true)}>
        <EditOutlined className={styles['modifies-evaluator-icon']} />
        {!evaluator ? <span className={styles['modifies-evaluator-placeholder']}>选择考评人</span> : evaluator.userName}
      </div>
      <Drawer
        title="选择考评人"
        visible={visibleDrawer}
        width={800}
        onClose={() => handleVisibleDrawer(false)}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={() => handleVisibleDrawer(false)} style={{ marginRight: 16 }}>
              {intl.formatMessage({ id: 'common.button.cancel', defaultMessage: '取消' })}
            </Button>
            <Button onClick={handleConfirm} type="primary">
              {intl.formatMessage({ id: 'common.button.confirm', defaultMessage: '确定' })}
            </Button>
          </div>
        }
        bodyStyle={{
          paddingBottom: 0,
        }}
      >
        <PolymericTable
          rowKey="userId"
          columns={columns}
          fetchDataSource={(params) => fetchUserList(params as ExtraFetchType)}
          rowSelection={rowSelection}
          defaultPageSize={20}
          searchFormProps={{
            schema: querySchema,
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            },
          }}
          full
        />
      </Drawer>
    </div>
  )
}

ModifiesEvaluatorField.isFieldComponent = true

export default ModifiesEvaluatorField
