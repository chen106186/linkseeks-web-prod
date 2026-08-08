import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Space, Modal, Popconfirm, Button, message, Tooltip } from 'antd'
// import UploadPayVoucher from '../UploadPayVoucher';
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import { UploadProps, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import styles from './index.less'
import { getSettlementGetMemberAccountConfig } from '@apps/apis'

interface FileType {
  name: string
  proveUrl: string
}

export interface AccountInfoType {
  bankAccount: string
  name: string
  bankDeposit: string
}

interface UploadVocherProps {
  /**
   * 结算方id
   */
  settlementId: number
  // /**
  //  * 结算单id
  //  */
  // id: number
  roleId: number
  confirmLoading: boolean
  handleUpload: (params: any) => void
  visible: boolean
  onCancel: () => void
}
// 待付款 状态 上传付款凭证
const UploadVoucherModal: React.FC<UploadVocherProps> = (props) => {
  const { settlementId, roleId, visible, onCancel, handleUpload, confirmLoading } = props
  const intl = useIntl()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  // const [isUploading, setIsUploading] = useState(false)
  const [accountInfo, setAccountInfo] = useState<AccountInfoType>(null)

  useEffect(() => {
    if (!visible) {
      /** 当模态框删除时清楚数据 */
      setFileList([])
      return
    }
    async function getAccountInfo() {
      const {
        data,
        code,
        message: msg,
      } = await getSettlementGetMemberAccountConfig({
        memberId: settlementId.toString(),
        roleId: roleId.toString(),
      })
      if (code == 1000) {
        setAccountInfo(data)
      } else {
        message.error(msg)
      }
    }
    getAccountInfo()
  }, [visible])

  const infoList = useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'balance.components.uploadVoucherModal.infoList.name' }),
        dataIndex: 'name',
      },
      {
        title: intl.formatMessage({ id: 'balance.components.uploadVoucherModal.infoList.bankAccount' }),
        dataIndex: 'bankAccount',
      },
      {
        title: intl.formatMessage({ id: 'balance.components.uploadVoucherModal.infoList.bankDeposit' }),
        dataIndex: 'bankDeposit',
      },
    ]
  }, [])

  const handleOnFileChange = (info: UploadChangeParam) => {
    console.log(info)
    const isSizeLimit = info.file.size / 1024 < fileMaxSize
    if (!isSizeLimit) {
      return
    }

    const fileList = info.fileList
    const newList = fileList.map((file) => {
      return {
        name: file.name,
        url: file.url || file.response?.data,
        uid: file.uid,
        status: file.status,
        percent: file.percent,
        size: file.size,
        type: file.type,
      }
    })
    setFileList(newList)
  }

  const onRemove = (fileItem: UploadFile) => {
    const list = [...fileList]
    const newList = list.filter((_item) => _item.url !== fileItem.url)
    setFileList(newList)
  }

  const isUploading = useMemo(() => {
    return fileList.some((_item) => _item.status === 'uploading')
  }, [fileList])

  /***
   * 上传前检查
   */
  const fileMaxSize = 200
  const beforeUpload = (file: UploadFile) => {
    const isSizeLimit = file.size / 1024 < fileMaxSize
    if (!isSizeLimit) {
      message.error(intl.formatMessage({ id: 'balance.components.uploadVoucherModal.error', data: fileMaxSize }))
    }
    return isSizeLimit
  }

  const handleComfirm = () => {
    if (fileList.length === 0) {
      message.error(intl.formatMessage({ id: 'balance.shouldUploadPaymentFile' }))
      return
    }
    const postData = {
      // account: accountInfo,
      fileList: fileList.map((_item) => ({
        name: _item.name,
        proveUrl: _item.url,
      })),
    }
    handleUpload?.(postData)
    // handleUpload?.({onCancel: params.onCancel, id: params.id, fileList: params.fileList})
  }

  const buttonTooltip = () => {
    if (accountInfo === null) {
      return intl.formatMessage({ id: 'balance.business.shouldConfigAccount' })
    }
    return intl.formatMessage({ id: 'balance.shouldUploadPaymentFile' })
  }

  return (
    <Modal
      width={548}
      title={intl.formatMessage({ id: 'balance.components.uploadVoucherModal.title' })}
      onCancel={onCancel}
      visible={visible}
      confirmLoading={confirmLoading}
      footer={
        <Space>
          <Button onClick={onCancel}>
            {intl.formatMessage({ id: 'balance.components.uploadVoucherModal.button.1' })}
          </Button>
          {isUploading ? (
            <Popconfirm
              title={intl.formatMessage({ id: 'balance.components.uploadVoucherModal.button.2.popconfirm.title' })}
              okText={intl.formatMessage({ id: 'balance.components.uploadVoucherModal.button.2.popconfirm.okText' })}
              cancelText={intl.formatMessage({
                id: 'balance.components.uploadVoucherModal.button.2.popconfirm.cancelText',
              })}
              onConfirm={() => handleComfirm()}
            >
              <Button loading={confirmLoading} type={'primary'}>
                {intl.formatMessage({ id: 'balance.components.uploadVoucherModal.button.2' })}
              </Button>
            </Popconfirm>
          ) : (
            <Tooltip title={buttonTooltip()}>
              <Button
                loading={confirmLoading}
                type={'primary'}
                onClick={() => handleComfirm()}
                disabled={fileList.length === 0 || accountInfo === null}
              >
                {intl.formatMessage({ id: 'balance.components.uploadVoucherModal.button.2' })}
              </Button>
            </Tooltip>
          )}
        </Space>
      }
    >
      <div className={styles.container}>
        {infoList.map((_item) => {
          return (
            <div className={styles.formItem} key={_item.dataIndex}>
              <span className={styles.label}>{_item.title}</span>
              {/* 可以设置render 自定义 渲染 */}
              <span className={styles.value}>{accountInfo?.[_item.dataIndex]}</span>
            </div>
          )
        })}
      </div>
      <div className={styles.upload}>
        <UploadFiles fileList={fileList} onChange={handleOnFileChange} onRemove={onRemove} beforeUpload={beforeUpload}>
          <Button>{intl.formatMessage({ id: 'balance.components.uploadVoucherModal.uploadFiles' })}</Button>
          <p className={styles.tips}>
            {intl.formatMessage({ id: 'balance.components.uploadVoucherModal.uploadFiles.tip' })}
          </p>
        </UploadFiles>
      </div>
      {/* <UploadPayVoucher roleId={roleId} id={settlementId} getFileList={getFileList} /> */}
    </Modal>
  )
}

export default UploadVoucherModal
