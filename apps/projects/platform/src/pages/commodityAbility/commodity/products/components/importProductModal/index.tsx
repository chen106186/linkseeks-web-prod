import { Fragment, useState } from 'react'
import { Button, Drawer } from '@linkseeks/ui'
import { LineTitle, StandardFormTable } from '@apps/components'
import cx from 'classnames'
import { useProduct } from '../../services/context'
import { UploadCommodityType, useImportModal } from '../../services/useImportModal'
import { useControl } from '../../services/useControl'
import { useWebIntl } from '@apps/locales'
import { message, Space } from 'antd'
import importCommodityIcon from '@/assets/icons/import_icon.png'
import importImgIcon from '@/assets/icons/import_img_icon.png'
import { postSupportDatasheetFileLogExportData } from '@apps/apis'
import UploadProductLog from './uploadProductLog'
import UploadProduct from './uploadProduct'
import UploadImage from './uploadImage'
import UploadImagetLog from './uploadImagetLog'
import DownloadProductDir from './downloadProductDir'
import styles from './index.less'
import { downloadFileByNameAndUrl } from '@apps/utils'

const ImportProductModal = () => {
  const { importModal, mainTableRef } = useProduct()
  const { handleCancel } = useControl()
  const { importDrawVisible, drawTitle, optionType, setImportDrawVisible, setDrawTitle, setOptionType } =
    useImportModal()
  const productTableRef = StandardFormTable.useTableRef()
  /** 导入记录 */
  const logTableRef = StandardFormTable.useTableRef()
  const translate = useWebIntl()
  const [changeState, setChangeState] = useState<boolean>(false)
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false)

  const getFileNameFromUrl = (url) => {
    const match = url.match(/\/([^\/?#]+)[^\/]*$/)
    return match ? match[1] : null
  }

  const handleClose = () => {
    setImportDrawVisible(false)
    if (typeof productTableRef.current.clearSelection === 'function') {
      productTableRef.current.clearSelection()
    }
  }

  const handleDownLoadTemplate = (bizType: any, customPram?: any) => {
    setDownloadLoading(true)
    postSupportDatasheetFileLogExportData({ bizType, customPram }, { ctlType: 'none' })
      .then((res) => {
        if (res.code === 1000 && res.data) {
          const fileName = getFileNameFromUrl(res.data)
          downloadFileByNameAndUrl(res.data, fileName)
          if (optionType === 'downloadDirectory') {
            handleClose()
          }
        }
      })
      .finally(() => {
        setDownloadLoading(false)
      })
  }

  const handleDownloadDir = () => {
    const selectItems = productTableRef.current.getSelectionItems()
    if (selectItems.length === 0) {
      message.info(translate('web.common.selectOneRequest'))
      return
    }
    const customPram = {
      commodityIdList: selectItems.map((item) => item.id),
    }
    handleDownLoadTemplate(3, customPram)
  }

  const handleClick = (type: UploadCommodityType) => {
    setOptionType(type)
    switch (type) {
      case 'uploadProduct':
        setDrawTitle(translate('web.resource.commodity.shangpindaoru'))
        setImportDrawVisible(true)
        break
      case 'uploadProductLog':
        setDrawTitle(translate('web.resource.commodity.shangpindaoru'))
        setImportDrawVisible(true)
        break
      case 'uploadImage':
      case 'downloadDirectory':
        setDrawTitle(translate('web.resource.commodity.shangpintupiandaoru'))
        setImportDrawVisible(true)
        break
      case 'uploadImageLog':
        setDrawTitle(translate('web.resource.commodity.shangpintupiandaoru'))
        setImportDrawVisible(true)
        break
      case 'downloadTemplate':
        handleDownLoadTemplate(1)
        break
      default:
        break
    }
  }

  const handleSuccess = (type: UploadCommodityType) => {
    setChangeState(true)
    setImportDrawVisible(false)
    if (type === 'uploadProduct') {
      setOptionType('uploadProductLog')
    } else if (type === 'uploadImage') {
      setOptionType('uploadImageLog')
    }
    setImportDrawVisible(true)
  }

  const renderComponentByOptionType = () => {
    switch (optionType) {
      case 'uploadProduct':
        return <UploadProduct onSuccess={() => handleSuccess('uploadProduct')} />
      case 'uploadProductLog':
        return <UploadProductLog visible={importDrawVisible} tableRef={logTableRef} />
      case 'uploadImage':
        return <UploadImage onSuccess={() => handleSuccess('uploadImage')} />
      case 'uploadImageLog':
        return <UploadImagetLog visible={importDrawVisible} tableRef={logTableRef} />
      case 'downloadDirectory':
        return <DownloadProductDir tableRef={productTableRef} />
      default:
        return null
    }
  }

  return (
    <Fragment>
      <Drawer
        title={translate('web.resource.commodity.shangpindaoru')}
        open={importModal}
        onClose={() => {
          handleCancel()
          if (changeState) {
            mainTableRef.current.reload()
            setChangeState(false)
          }
        }}
        width={660}
        footer={null}
      >
        <div className={styles['drawer-body']}>
          <LineTitle>{translate('web.resource.commodity.shangpindaoru')}</LineTitle>
          <div className={styles['line-middle']}>
            <img className={styles['import-commodity-icon']} src={importCommodityIcon} />
          </div>
          <div className={styles['line-middle']}>
            <Space size={16}>
              <Button type="link" onClick={() => handleClick('uploadProduct')}>
                {translate('web.resource.commodity.xinzengdaoru')}
              </Button>
              <Button type="link" onClick={() => handleClick('uploadProductLog')}>
                {translate('web.resource.commodity.daorujilu')}
              </Button>
              <Button type="link" onClick={() => handleClick('downloadTemplate')}>
                {translate('web.resource.commodity.xiazaimuban')}
              </Button>
            </Space>
          </div>
          <div className={styles['tip-box']}>
            <div className={cx(styles['tip-line'], styles.tip1)}>
              {translate('web.resource.commodity.exportProductTip1')}
            </div>
            <div className={cx(styles['tip-line'], styles.tip2)}>
              {translate('web.resource.commodity.exportProductTip2')}
            </div>
            <div className={cx(styles['tip-line'], styles.tip3)}>
              {translate('web.resource.commodity.exportProductTip3')}
            </div>
            <div className={cx(styles['tip-line'], styles.tip4)}>
              {translate('web.resource.commodity.exportProductTip4')}
            </div>
          </div>
          <LineTitle style={{ marginTop: 64 }}>{translate('web.resource.commodity.shangpintupiandaoru')}</LineTitle>
          <div className={styles['line-middle']}>
            <img className={styles['import-commodity-icon']} src={importImgIcon} />
          </div>
          <div className={styles['line-middle']}>
            <Space size={16}>
              <Button type="link" onClick={() => handleClick('uploadImage')}>
                {translate('web.resource.commodity.xinzengdaoru')}
              </Button>
              <Button type="link" onClick={() => handleClick('uploadImageLog')}>
                {translate('web.resource.commodity.daorujilu')}
              </Button>
              <Button type="link" onClick={() => handleClick('downloadDirectory')}>
                {translate('web.resource.commodity.xiazaimulu')}
              </Button>
            </Space>
          </div>
          <div className={styles['tip-box']}>
            <div className={cx(styles['tip-line'], styles.tip1)}>
              {translate('web.resource.commodity.uploadImageTip1')}
            </div>
            <div className={cx(styles['tip-line'], styles.tip2)}>
              {translate('web.resource.commodity.uploadImageTip2')}
            </div>
            <div className={cx(styles['tip-line'], styles.tip3)}>
              {translate('web.resource.commodity.uploadImageTip3')}
            </div>
            <div className={cx(styles['tip-line'], styles.tip4)}>
              {translate('web.resource.commodity.exportProductTip4')}
            </div>
            <div className={cx(styles['tip-line'], styles.wraning)}>
              {translate('web.resource.commodity.uploadImageTip5')}
            </div>
          </div>
        </div>
        <Drawer
          title={drawTitle}
          open={importDrawVisible}
          width={800}
          onClose={handleClose}
          forceRender
          footer={
            optionType === 'downloadDirectory' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button type="link" onClick={() => handleDownLoadTemplate(3)}>
                  {translate('web.resource.commodity.daochuquanbu')}
                </Button>
                <Space>
                  <Button onClick={handleClose}>{translate('web.common.cancel')}</Button>
                  <Button type="primary" loading={downloadLoading} onClick={() => handleDownloadDir()}>
                    {translate('web.common.confirm')}
                  </Button>
                </Space>
              </div>
            ) : null
          }
        >
          {renderComponentByOptionType()}
        </Drawer>
      </Drawer>
    </Fragment>
  )
}

export default ImportProductModal
