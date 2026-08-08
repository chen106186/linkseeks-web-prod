import { Button, Modal, Form, Select, Spin } from '@linkseeks/ui'
import { useProduct } from '../../services/context'
import { useControl } from '../../services/useControl'
import { useWebIntl } from '@apps/locales'

const RemoveImportBatchModal = () => {
  const { importBathValue, loading, deleteBatchModal, importBathLoading, importBathData } = useProduct()
  const { handleCancelDelete, handleOkDeleteBatch, handleImportBathSearch, handleImportBathChange } = useControl()
  const translate = useWebIntl()
  return (
    <Modal
      title={translate('web.resource.member.shanchudaorupici')}
      open={deleteBatchModal}
      onOk={handleOkDeleteBatch}
      onCancel={handleCancelDelete}
      okButtonProps={{ danger: true }}
      confirmLoading={loading}
      destroyOnClose={true}
    >
      <Form layout="vertical">
        <Form.Item label={translate('web.resource.commodity.xuanzeyaoshanchudepici')}>
          <Select
            showSearch={true}
            showArrow={true}
            placeholder={translate('web.resource.commodity.qingxuanzepicihao')}
            allowClear
            value={importBathValue}
            defaultActiveFirstOption={false}
            filterOption={false}
            onSearch={handleImportBathSearch}
            onChange={handleImportBathChange}
            onFocus={() => handleImportBathSearch('')}
            notFoundContent={importBathLoading ? <Spin size="small" /> : null}
            style={{ width: '100%' }}
            options={importBathData}
          ></Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RemoveImportBatchModal
