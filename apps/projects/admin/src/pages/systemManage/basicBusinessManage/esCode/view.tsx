import { getManageHotWordGetHotWordList } from '@apps/apis'
import { PageHeaderWrapper, StandardFormTable, RecordColumns } from '@apps/components'
import useEsCode from './services/hooks/useEsCode'
import ControlCodeModal from './components/controlCodeModal'
import ParticipleModal from './components/participleModal'

const EsCode = () => {
  const tableRef = StandardFormTable.useTableRef()
  const {
    handleUpdateStatus,
    modalRef,
    participleModalRef,
    addCode,
    editCode,
    deleteCode,
    saveCode,
    patchDeleteCode,
    deleteLoading,
    editTableProps,
  } = useEsCode(tableRef)

  const columns: RecordColumns<any>[] = [
    {
      key: 'word',
      searchField: {
        main: true,
      },
      title: '名称',
      editable: true,
    },
    {
      key: 'enabled',
      title: '状态',
      format: 'Enabled',
      formatPayload: {
        async statusConfirm(record) {
          await handleUpdateStatus(record)
          tableRef.current.reload()
        },
      },
    },
    {
      key: 'updateTime',
      title: '更新时间',
      format: 'Date',
    },
    {
      key: 'ctl',
      title: '操作',
      format: 'Control',
      formatPayload: {
        controlList: [
          { children: '保存', onClick: saveCode, show: (record) => editTableProps.validateEditStatus(record.id) },
          {
            children: '取消',
            onClick: editTableProps.handleCancel,
            show: (record) => editTableProps.validateEditStatus(record.id),
          },
          {
            children: '编辑',
            onClick: editCode,
            key: 'edit',
            show: (record) => !editTableProps.validateEditStatus(record.id),
          },
          {
            children: '删除',
            onClick: (record) => deleteCode([record.id]),
            key: 'delete',
            show: (record) => !editTableProps.validateEditStatus(record.id),
          },
        ],
        hiddenBound: 10,
      },
    },
  ]

  const handleParticipleTest = () => {
    participleModalRef.current.toggleModal()
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        request={getManageHotWordGetHotWordList}
        actionRef={tableRef}
        editableProps={editTableProps}
        isRowSelection
        searchButtons={[
          { children: '新增', icon: 'add', type: 'primary', onClick: addCode },
          { children: '批量删除', onClick: patchDeleteCode, loading: deleteLoading },
          { children: '分词测试', onClick: handleParticipleTest },
        ]}
        columns={columns}
      />
      <ControlCodeModal ref={modalRef} tableRef={tableRef} />
      <ParticipleModal ref={participleModalRef} tableRef={tableRef} />
    </PageHeaderWrapper>
  )
}

export default EsCode
