import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { Table, Button, message } from 'antd'
import { userColumns, teamColumns } from './columns'
import DrawerTable from '@/components/DrawerTable'
import NiceForm from '@/components/NiceForm'
import { postMemberUserEightList } from '@apps/apis'
import { createFormActions } from '@apps/formily'
import type { TableRowSelection } from 'antd/lib/table/interface'
import { EditableBody } from '../TableCell'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import style from './index.less'
import { authService } from '@apps/services'

type Props = {
  showAddTeamBtn?: boolean
  columns: Record<string, any>[]
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  dataSource?: object[]
  rowKey: string
  confirm?: Function
  handleChange?: Function
  showWarning: boolean
  [key: string]: any
}
interface AddTemaTableModal {
  props?: {
    'x-component-props': Props
    [key: string]: any
  }
  value?: object[]
  dataSource?: Props['dataSource']
}
const intl = getIntl()
const formActions = createFormActions()

const AddTemaTableModal: React.FC<AddTemaTableModal | Props> = (props) => {
  const {
    showAddTeamBtn = true,
    columns = [],
    prefix,
    suffix,
    rowKey,
    confirm,
    handleChange = () => {},
    formilyProps,
    showWarning = false,
    drawerTitle = `${intl.formatMessage({ id: 'eightD.tianjiaxiaozuchengyuan', defaultMessage: '添加小组成员' })}`,
    ...restProps
  } = props?.props?.['x-component-props'] || props
  const value = props?.value || props?.dataSource || []

  const [temaMemberModal, setTemaMemberModal] = useState(false)
  const [temaUserIdList, setTemaUserIdList] = useState<Array<any>>([])
  const [temaList, setTemaList] = useState<Array<any>>([])
  const molalRef = useRef<any>({})

  const fetchMemberUserList = async (params) => {
    try {
      const res = await postMemberUserEightList(
        {
          userIds: temaUserIdList,
          ...params,
        },
        { ctlType: 'none' },
      )
      if (res.code === 1000) {
        return res.data
      }
      return { totalCount: 0, data: [] }
    } catch (error) {
      return {}
    }
  }

  const rowSelection: TableRowSelection<any> = {
    onChange: (selectedRowKeys, selectedRows) => {
      setTemaList(selectedRows)
    },
  }

  const addMemberHandler = useCallback(async () => {
    const { memberRoleType } = authService.getAuth()
    const newTemaList = temaList.map((item, index) => {
      // roleType这个字段需要在confirm回调的时候自己添加上去
      item.index = index
      item.legend = ''
      item.disabled = false
      item.isGroupLeader = false
      item.isVisible = true
      item.roleType = memberRoleType
      return item
    })
    setTemaMemberModal(false)
    // 参数1：新增的小组成员数据，参数2：用户的userId数组
    confirm?.(newTemaList, temaUserIdList)
    // 清空已选数据
    setTemaList([])
  }, [temaList, temaUserIdList])

  const search = (values: any) => {
    // 调用fetchdata方法
    molalRef.current.reload(values)
  }

  const tableTeamColumns = useMemo(() => {
    const listTeamColumns = Array.isArray(columns) ? columns : teamColumns
    return listTeamColumns.map((col) => {
      if (!col.editable) {
        return { ...col }
      }
      return {
        ...col,
        // ...columns[col.key],
        onCell: (record: any) => ({
          ...col,
          component: col.component,
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          editProps: { ...col?.editProps },
          // ...columns[col.key],
          handleChange,
        }),
      }
    })
  }, [teamColumns, columns, handleChange])

  const showAddTeamBtnFn = useCallback(() => {
    setTemaMemberModal(true)
    molalRef.current?.reload?.({
      current: 1,
      pageSize: 10,
    })
  }, [])

  const cancelHandler = useCallback(() => {
    if (!temaList.length && showWarning) {
      message.warning(intl.formatMessage({ id: 'eightD.weixuanzexiaozuchengyuan', defaultMessage: '未选择小组成员' }))
    }
    setTemaMemberModal(false)
  }, [temaList, showWarning])

  useEffect(() => {
    if (Array.isArray(value) && value.length) {
      const userIdList = []
      value.forEach((item) => {
        userIdList.push(item.userId)
      })
      // 去重一下
      setTemaUserIdList(() => Array.from(new Set(userIdList)))
    }
  }, [value])

  return (
    <>
      <div style={{ width: '100%' }}>
        {!!showAddTeamBtn && (
          <Button className={style.teamMemberBtn} onClick={showAddTeamBtnFn}>
            {drawerTitle}
          </Button>
        )}
        {prefix}

        <Table
          rowKey={rowKey || 'id'}
          columns={tableTeamColumns}
          dataSource={value}
          components={EditableBody}
          scroll={{ x: 1200 }}
          {...restProps}
        />
        {suffix}
      </div>
      <DrawerTable
        drawerTitle={drawerTitle}
        visible={temaMemberModal}
        columns={userColumns}
        currentRef={molalRef}
        keepAlive={false}
        tableType={'normal'}
        fetchTableData={fetchMemberUserList}
        confirm={addMemberHandler}
        cancel={cancelHandler}
        rowSelection={rowSelection}
        // formilyProps={formilyProps}
        customKey="userId"
        tableProps={{
          rowKey: 'userId',
        }}
        controlRender={
          <NiceForm actions={formActions} onSubmit={(values) => search(values)} {...formilyProps?.ctx}></NiceForm>
        }
      />
    </>
  )
}

AddTemaTableModal.isFieldComponent = true

export default AddTemaTableModal
