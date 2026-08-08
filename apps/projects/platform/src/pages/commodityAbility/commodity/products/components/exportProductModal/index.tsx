import { Modal } from '@linkseeks/ui'
import { useProduct } from '../../services/context'
import { useControl } from '../../services/useControl'
import { useWebIntl } from '@apps/locales'

const ExportProductModal = () => {
  const { exportQrcodeModal, setExportQrcodeModal, exportLoading, mainTableRef } = useProduct()
  const { handleExportQrcode } = useControl()
  const translate = useWebIntl()

  return (
    <Modal
      title={translate('web.resource.commodity.daochushanpinerweima')}
      open={exportQrcodeModal}
      onOk={handleExportQrcode}
      onCancel={() => setExportQrcodeModal(false)}
      confirmLoading={exportLoading}
    >
      <p>
        {translate('web.resource.commodity.liebiaogouxuan', {
          length: mainTableRef?.current?.selectionKeys?.length || 0,
        })}
        :
      </p>
      <p>{translate('web.resource.commodity.shuoming')}:</p>
      <p>1、{translate('web.resource.commodity.shuoming_tishi1')}</p>
      <p>2、{translate('web.resource.commodity.shuoming_tishi2')}</p>
      <p>3、{translate('web.resource.commodity.shuoming_tishi3')}</p>
      <p>4、{translate('web.resource.commodity.shuoming_tishi4')}</p>
    </Modal>
  )
}

export default ExportProductModal
