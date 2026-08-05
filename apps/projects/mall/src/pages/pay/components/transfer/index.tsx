import React, { useState, useEffect } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface'
import {
  getSettlementCommonCorporateAccountDetail,
  postOrderCreateBuyerPay,
  GetSettlementCommonCorporateAccountDetailResponse,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { LinkTo } from '@/utils'
import useLink from '@/hooks/useLink'
import { priceFormat } from '@apps/utils'
import styles from './index.module.less'

const { Dragger } = Upload

interface TransferPayWayPropsType {
  orderId: number[]
  onChange: Function
  queryParam: any
}

const TransferPayWay: React.FC<TransferPayWayPropsType> = (props) => {
  const translate = getWebIntl()
  const { orderId, queryParam, onChange } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [payOrderUrl, setPayOrderUrls] = useState<string>()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [accountInfo, setAccountInfo] = useState<GetSettlementCommonCorporateAccountDetailResponse>()
  const { linkPrefix } = useLink()

  useEffect(() => {
    getAccountInfo()
  }, [queryParam])

  const getAccountInfo = () => {
    let params: any = {
      type: queryParam?.fundMode,
      memberId: queryParam?.memberId,
      roleId: queryParam?.memberRoleId,
    }
    getSettlementCommonCorporateAccountDetail(params).then((res: any) => {
      if (res.code === 1000) {
        setAccountInfo(res.data)
      }
    })
  }

  const beforeUpload = (file: UploadFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
    if (!isJpgOrPng) {
      message.error(translate('web.resource.mall.qinzhichishangchuanwenjian'))
    }
    const isSizeLimit = (file.size || 0) / 1024 < 1024
    if (!isSizeLimit) {
      message.error(translate('web.resource.mall.shangchuantupianbuchaoguo1'))
    }
    return isJpgOrPng && isSizeLimit
  }

  const uploadProps = {
    name: 'file',
    action: '/api/support/file/upload',
    headers: {},
    data: {
      fileType: 1,
    },
    disabled: loading,
    showUploadList: false,
    onChange(info: UploadChangeParam) {
      if (info.file.status === 'uploading') {
        setLoading(true)
        return
      }
      if (info.file.status === 'done') {
        // 图片回显
        const { code, data } = info.file.response
        if (code === 1000) {
          setPayOrderUrls(data)
        }
        setLoading(false)
      }
    },
    beforeUpload,
  }

  const handleSubmitPay = () => {
    if (!payOrderUrl) {
      message.info(translate('web.resource.mall.qingshangchuanzhifupinzheng'))
      return
    }
    const param: any = {
      orderIds: orderId,
      batchNo: queryParam.batchNo,
      payChannel: queryParam.payChannel,
      payType: queryParam.payType,
      fundMode: queryParam.fundMode,
      vouchers: [payOrderUrl],
    }
    setConfirmLoading(true)

    postOrderCreateBuyerPay(param)
      .then((res) => {
        if (res.code === 1000) {
          message.destroy()
          message.success(translate('web.resource.mall.zhifuchenggong'))
          LinkTo(linkPrefix(`/pay/result?orderId=${orderId}`), 'replace')
        } else {
          setConfirmLoading(false)
          onChange(false)
        }
      })
      .catch(() => {
        onChange(false)
        setConfirmLoading(false)
      })
  }

  return (
    <>
      <div className={styles.common_title}>
        <span>{translate('web.resource.mall.xianxiazhuanzhangxianshangqueren')}</span>
      </div>
      <div className={styles.bank_payway}>
        <div className={styles.bank_payway_container}>
          <div className={styles.bank_payway_line}>
            <label>{translate('web.resource.mall.zhanghumingcheng')}：</label>
            <span>{accountInfo?.name}</span>
          </div>
          <div className={styles.bank_payway_line}>
            <label>{translate('web.resource.mall.yinhangzhanghao')}：</label>
            <span>{accountInfo?.bankAccount}</span>
          </div>
          <div className={styles.bank_payway_line}>
            <label>{translate('web.resource.balance.kaihuhang')}：</label>
            <span>{accountInfo?.bankDeposit}</span>
          </div>
          <Dragger {...uploadProps} className={styles.bank_payway_upload_dragger}>
            <div className={styles.bank_payway_upload}>
              {payOrderUrl ? (
                <img src={payOrderUrl} />
              ) : (
                <>
                  <UploadOutlined translate={undefined} className={styles.bank_payway_upload_icon} />
                  <p>{translate('web.resource.mall.shangchuanzhifupinzheng')}</p>
                </>
              )}
            </div>
          </Dragger>
          <div className={styles.bank_payway_needpay}>
            <label>{translate('web.resource.payment.zhifujine')}：</label>
            <span>{translate('web.common.currencySymbol')}</span>
            <span>{priceFormat(queryParam?.payAmount)}</span>
          </div>
          <Button
            className={styles.pay_btn}
            disabled={!accountInfo || !payOrderUrl}
            loading={confirmLoading}
            onClick={() => handleSubmitPay()}
          >
            {translate('web.common.submit')}
          </Button>
        </div>
      </div>
    </>
  )
}

export default TransferPayWay
