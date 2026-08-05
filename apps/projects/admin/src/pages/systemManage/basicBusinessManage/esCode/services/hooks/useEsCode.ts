import { postManageHotWordDelBatch, postManageHotWordUpdate, postManageHotWordUpdateStatus } from '@apps/apis'
import useEditTable from '@apps/components/src/web/StandardFormTable/hooks/useEditTable'
import { useRequestApi } from '@linkseeks/hooks'
import { useRef, useState } from 'react'

const useEsCode = (tableRef) => {
  const modalRef = useRef<any>({})
  const participleModalRef = useRef<any>({})
  const editTableProps = useEditTable({ rowKey: 'id' })
  const { runAsync } = useRequestApi(postManageHotWordUpdateStatus, { manual: true })
  const { run, loading } = useRequestApi(postManageHotWordDelBatch, {
    manual: true,
    onSuccess() {
      tableRef.current.reload()
    },
  })

  const handleUpdateStatus = async ({ id, enabled }) => {
    await runAsync({
      id,
      enabled: !enabled,
    })
  }

  const addCode = () => {
    modalRef.current.toggleModal('add')
  }

  const editCode = (record) => {
    editTableProps.handleEdit(record)
    editTableProps.editForm.setFieldsValue(record)
  }

  const saveCode = async (record) => {
    const payload = await editTableProps.editForm.validateFields()
    await postManageHotWordUpdate({
      id: record.id,
      word: payload.word,
    })
    editTableProps.setEditKey('')
    tableRef.current.reload()
  }

  const deleteCode = async (idList: number[]) => {
    run({
      idList,
    })
  }

  const patchDeleteCode = () => {
    if (tableRef.current.selectionKeys.length === 0) {
      return
    }
    deleteCode(tableRef.current.selectionKeys)
  }

  return {
    handleUpdateStatus,
    modalRef,
    participleModalRef,
    addCode,
    editCode,
    saveCode,
    deleteCode,
    patchDeleteCode,
    deleteLoading: loading,
    editTableProps,
  }
}

export default useEsCode
