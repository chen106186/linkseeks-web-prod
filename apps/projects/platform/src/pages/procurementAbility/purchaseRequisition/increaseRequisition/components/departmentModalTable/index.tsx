import React, { useEffect } from 'react'
import ModalTable, { ModalTableProps } from '@/components/ModalTable'
import { useModalTable } from '../../model/useModalTable'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { departmentColumns } from '../../constant'
import { getMemberBusinessOrganizationPage } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

export interface DepartmentModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  confirmModal?()
}

// 选择部门弹窗
const DepartmentModalTable: React.FC<DepartmentModalTableProps> = (props) => {
  const { type = 'radio', schemaAction, confirmModal, currentRef, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type })
  const intl = useIntl()
  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  useEffect(() => {
    if (visible) {
      const departmentId = schemaAction.getFieldValue('departmentId')
      rowSelectionCtl.setSelectedRowKeys([departmentId])
    }
  }, [visible])

  const handleConfirm = async () => {
    const item = rowSelectionCtl.selectRow[0]
    if (item) {
      schemaAction.setFieldValue('departmentId', item['id'])
      schemaAction.setFieldValue('department', item['title'])
    }
    confirmModal && confirmModal()
    setVisible(false)
  }
  return (
    <ModalTable
      modalTitle={intl.formatMessage({ id: 'purchaseRequisition.xuanzezuzhiji', defaultMessage: '选择组织机构' })}
      columns={departmentColumns}
      visible={visible}
      confirm={handleConfirm}
      cancel={() => setVisible(false)}
      fetchTableData={async (params) =>
        (await getMemberBusinessOrganizationPage({ ...params }, { useCache: true, ttl: 10 * 1000 })).data
      }
      rowSelection={rowSelection}
      modalType="departmentSchema"
      searchName="code"
      tableProps={{
        rowKey: 'id',
      }}
      resetModal={{
        destroyOnClose: true,
      }}
      {...restProps}
    />
  )
}

DepartmentModalTable.defaultProps = {}

export default DepartmentModalTable
