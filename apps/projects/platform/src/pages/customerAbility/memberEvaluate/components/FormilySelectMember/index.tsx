import { useIntl } from '@linkseeks/i18n'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Drawer, Button, Row, Col } from 'antd'
import useModal from '../../hooks/useModal'
import StandardTable from '@/components/StandardTable'
import { ColumnsType } from 'antd/es/table'
import { createFormActions } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import memberSchema from './schema'
import styles from './index.less'

const formActions = createFormActions()

interface Iprops {
  value: {
    userId: number
    name: string
  }
  editable: boolean
  schema: any
  props: {
    ['x-component-props']: {
      customizeRender?: (value: any, toggle) => React.ReactNode
      fetchData: (params: any) => Promise<any>
    }
  }
  mutators: {
    change: (record: any) => void
  }
}

const FormilySelectMember: React.FC<Iprops> & { isFieldComponent: boolean } = (props: Iprops) => {
  const { value, editable } = props
  const ref = useRef<any>({})
  const { visible, toggle } = useModal()
  const [prevState, setPrevState] = useState(null)
  const fetchData = props.props['x-component-props']?.fetchData || null
  useEffect(() => {
    if (visible) {
      setPrevState(value)
    }
  }, [visible])

  const intl = useIntl()

  const columns: ColumnsType = [
    {
      title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.memberSerial' })}`,
      dataIndex: 'userId',
    },
    {
      title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.name' })}`,
      dataIndex: 'name',
    },
    {
      title: `${intl.formatMessage({ id: 'member.memberEvaluate.components.FormilySelectMember.index.phone' })}`,
      dataIndex: 'phone',
    },
    {
      title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.agency' })}`,
      dataIndex: 'orgName',
    },
    {
      title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.post' })}`,
      dataIndex: 'jobTitle',
    },
  ]

  const fetchListData = async (params: any) => {
    if (fetchData) {
      return await fetchData(params)
    }
    return {
      totalCount: 0,
      data: [],
    }
  }

  const onSelectChange = (record, selected: Boolean, selectedRows) => {
    props.mutators.change(record)
  }

  const onCancel = useCallback(() => {
    props.mutators.change(prevState)
    toggle(false)
  }, [toggle, prevState])

  const onConfirm = () => {
    toggle(false)
  }

  return (
    <div>
      <Drawer
        title={intl.formatMessage({ id: 'member.memberInspection.add.chooseUser' })}
        width={1000}
        visible={visible}
        onClose={onCancel}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              {intl.formatMessage({ id: 'member.memberEvaluate.components.FormilySelectMember.index.cancel' })}
            </Button>
            <Button onClick={onConfirm} type="primary">
              {intl.formatMessage({ id: 'member.memberEvaluate.components.FormilySelectMember.index.submit' })}
            </Button>
          </div>
        }
      >
        <StandardTable
          tableProps={{
            rowKey: 'userId',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          rowSelection={{
            type: 'radio',
            onSelect: onSelectChange,
            selectedRowKeys: value ? [value?.userId] : [],
          }}
          controlRender={
            <NiceForm
              schema={memberSchema}
              actions={formActions}
              onSubmit={(values) => ref.current?.reload(values)}
              expressionScope={{}}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
              }}
            />
          }
        />
      </Drawer>
      {props.props['x-component-props']?.customizeRender?.(value, toggle) || (
        <div className={styles.value}>
          <span className={styles.name}>{value?.name}</span>
          {editable && (
            <span className={styles.main} onClick={() => toggle(true)}>
              {value
                ? `${intl.formatMessage({ id: 'member.memberEvaluate.components.FormilySelectMember.index.reChoose' })}`
                : `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.chooseEvaluater' })}`}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

FormilySelectMember.isFieldComponent = true
export default FormilySelectMember
