import { useCallback, useState } from 'react'
import { Button, Input } from 'antd'
import { TableColumn } from './columns'
import { schema } from './schema'
import { LinkOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import TableModal from '@/components/TableModal'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { getMemberUserPage } from '@apps/apis'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'

const RowStyleLayout = styled((props) => <div {...props} />)`
  .ant-input-group-compact {
    display: flex;
  }
  .ant-input {
    height: 32px;
  }
  .ant-btn {
    height: 32px;
  }
`
interface RoleSelectProps {
  onChangeSelect?: (e) => void
  value?: any
  disabled?: boolean
  title?: string
}

/**
 * 用户角色选择器
 * @param request (payload) => Promise<any> 请求接口
 * @returns
 */
function SelectPersonModal(props: RoleSelectProps) {
  const { onChangeSelect, value = '', disabled = false, title = '选择寄样人' } = props

  const [visible, setVisible] = useState(false)
  const [selectValue, setSelectValue] = useState(value)
  const [rowSelection, rowCtl] = useRowSelectionTable({ customKey: 'userId', type: 'radio' })

  const showDrawer = useCallback(() => {
    setVisible(true)
  }, [visible])

  const closeDrawer = useCallback(() => {
    setVisible(false)
  }, [visible])

  const handleSubmit = () => {
    const { selectRow } = rowCtl
    if (selectRow?.length > 0) {
      setSelectValue(selectRow[0].name)
      onChangeSelect(selectRow[0])
    }
    closeDrawer()
  }

  const handleFetchData = async (params) => {
    const { data, code } = await getMemberUserPage({ ...params, status: 1 })
    if (code === 1000) {
      return { data: data.data || [], totalCount: data?.totalCount || 0 }
    }
    return { data: [], totalCount: 0 }
  }

  return (
    <>
      <RowStyleLayout>
        <Input.Group compact>
          <Input value={selectValue} disabled />
          {!disabled && <Button type="primary" icon={<LinkOutlined />} disabled={disabled} onClick={showDrawer} />}
        </Input.Group>
      </RowStyleLayout>
      <TableModal
        modalType="Drawer"
        title={title}
        visible={visible}
        rowSelection={rowSelection}
        schema={schema}
        columns={TableColumn}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
        }}
        onOk={handleSubmit}
        fetchData={handleFetchData}
        tableProps={{ rowKey: 'userId' }}
        onClose={closeDrawer}
        mode="radio"
      />
    </>
  )
}

export default SelectPersonModal
