/*
 * @Author: Bill
 * @Date: 2020-10-21 18:13:06
 * @Description: 上传付款凭证
 */

import React, { useState, useEffect } from 'react'
import Voucher from '../Voucher'
import styles from './index.less'
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface'
import { UPLOAD_TYPE } from '@/constants'
// import { VoucherFileProps } from '../../common/type';
import { getSettlementGetMemberAccountConfig } from '@apps/apis'

interface VoucherFileProps {
  name: string
  proveUrl: string
}

interface Iprops {
  fileList?: VoucherFileProps[]
  id: number // 结算方id
  roleId: number // 结算方角色id
  getFileList: (params: any[], status: string) => void
}

interface AccountInfo {
  bankAccount: string
  name: string
  bankDeposit: string
}

const UploadPayVoucher: React.FC<Iprops> = (props) => {
  const [fileList, setFileList] = useState<VoucherFileProps[]>([])
  const [loading, setLoading] = useState(false)
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)

  // 进来设置fileList
  // useEffect(() => {
  //   setFileList(props.fileList)
  // }, [props.fileList])

  /**
   * 获取账户名称等
   */
  useEffect(() => {
    async function getAccountInfo() {
      ///settle/accounts/corporate/account/config
      const { data, code } = await getSettlementGetMemberAccountConfig({
        memberId: props.id.toString(),
        roleId: props.roleId.toString(),
      })
      if (code == 1000) {
        setAccountInfo(data)
      }
    }
    getAccountInfo()
  }, [props.id, props.roleId])

  /***
   * 上传前检查
   */
  const fileMaxSize = 200
  const beforeUpload = (file: UploadFile) => {
    const isSizeLimit = file.size / 1024 < fileMaxSize
    if (!isSizeLimit) {
      message.error(`上传文件大小不超过${fileMaxSize}K!`)
    }
    return isSizeLimit
  }
  /**
   * 上传配置
   */
  const uploadProps = {
    name: 'file',
    action: '/api/support/file/upload',
    headers: {},
    data: {
      fileType: UPLOAD_TYPE, // 指定类型是本地还是线上，
    },
    disabled: loading,
    showUploadList: false,
    onChange(info: UploadChangeParam) {
      if (info.file.status === 'uploading') {
        props.getFileList([], 'uploading')
        setLoading(true)
        return
      }
      if (info.file.status === 'done') {
        // 图片回显
        const { code, data } = info.file.response
        if (code === 1000) {
          console.log('upload success')
          // onChange(data)
          const temp: VoucherFileProps[] = [...fileList]
          const filename = info.file.name
          temp.push({
            name: filename,
            proveUrl: data,
          })
          setFileList(temp)
          props.getFileList(temp, 'done')
        }
        setLoading(false)
      }
    },
    beforeUpload,
  }

  const handleRemove = (value) => {
    const list = [...fileList]
    const res = list.filter((item) => item.proveUrl !== value.proveUrl)
    setFileList(res)
    if (props.getFileList) {
      props.getFileList(res, 'done')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formItem}>
        <span className={styles.label}>账户名称</span>
        <span className={styles.value}>{accountInfo?.name}</span>
      </div>
      <div className={styles.formItem}>
        <span className={styles.label}>银行账号</span>
        <span className={styles.value}>{accountInfo?.bankAccount}</span>
      </div>
      <div className={styles.formItem}>
        <span className={styles.label}>开户行</span>
        <span className={styles.value}>{accountInfo?.bankDeposit}</span>
      </div>
      <p className={styles.voucherText}>上传支付凭证</p>
      <Voucher files={fileList} onRemove={handleRemove} />
      <div className={styles.upload}>
        <Upload {...uploadProps}>
          <Button loading={loading} icon={<UploadOutlined />}>
            上传凭证
          </Button>
          <p className={styles.tips}>单个凭证文件大小不能超过200K</p>
        </Upload>
      </div>
    </div>
  )
}

export default UploadPayVoucher
