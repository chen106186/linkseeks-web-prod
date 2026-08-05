import { useWebIntl } from '@apps/locales'
import { Modal } from '@linkseeks/ui'
import { useControl } from '../../services/useControl'
import { useProduct } from '../../services/context'

const ExportSkuModal = () => {
  const { exportVisible, setExportVisible, exportLoading } = useProduct()
  const { handleExport } = useControl()
  const translate = useWebIntl()

  return (
    <Modal
      title={translate('web.common.tip')}
      open={exportVisible}
      onOk={handleExport}
      onCancel={() => setExportVisible(false)}
      confirmLoading={exportLoading}
    >
      <div>{translate('web.resource.commodity.querendaochu')}</div>
    </Modal>
  )
}

export default ExportSkuModal
