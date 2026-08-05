import {
  PageHeaderWrapper,
  StandardForm,
  StandardFormTable,
  StandardModal,
  StandardModalRefProps,
} from '@apps/components'
import {
  Button,
  Card,
  Col,
  Descriptions,
  FormInstance,
  Input,
  message,
  Radio,
  RadioGroup,
  Row,
  Space,
} from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import { RefObject, useEffect, useState } from 'react'
import styles from '../index.less'
import alipay from '@/assets/imgs/alipay_icon.png'
import wxpay from '@/assets/imgs/wechat_icon.png'
import bankpay from '@/assets/imgs/bank_icon.png'
import fastpay from '@/assets/imgs/fast_icon.png'
import { useRequestApi } from '@linkseeks/hooks'
import {
  getPayEAccountAllInPayGetRechargeResult,
  getPayEAccountAllInPayGetRechargeType,
  postPayEAccountAllInPayRecharge,
} from '@apps/apis'
import { ScanOutlined } from '@ant-design/icons'
import QRCode from 'qrcode'
import { useEAccountInitContext } from '../context'
const chargeIconMap = {
  SCAN_WEIXIN_ORG: wxpay,
  SCAN_ALIPAY_ORG: alipay,
  QUICKPAY_VSP: fastpay,
  GATEWAY_VSP_ORG: bankpay,
}

let timeChange

const ChargeModal = ({
  modalRef,
  form,
  transcationRecordRef,
}: {
  modalRef: RefObject<StandardModalRefProps>
  form: FormInstance
  transcationRecordRef
}) => {
  const { data, loading } = useRequestApi(getPayEAccountAllInPayGetRechargeType)
  const { refreshAccountDetail } = useEAccountInitContext()
  const {
    loading: rechargeLoading,
    data: rechargeData,
    run: rechargeRun,
  } = useRequestApi(postPayEAccountAllInPayRecharge, {
    manual: true,
    onSuccess({ code, data }) {
      if (code === 1000) {
        const { codeUrl, tradeCode } = data || {}
        if (codeUrl && tradeCode) {
          setTradeCode(tradeCode)
          QRCode.toDataURL(codeUrl)
            .then((url: any) => {
              setQrcode(url)
              setOpenTimer(true)
            })
            .catch((err: any) => {
              console.error(err)
            })
          setQrcode(codeUrl)
          controlModalRef.current.toggle()
        } else {
          message.error('未能生成二维码')
        }
      }
    },
  })
  const [qrcode, setQrcode] = useState('')
  const [tradeCode, setTradeCode] = useState('')
  const controlModalRef = StandardModal.useRef()
  const translate = useWebIntl()
  const [openTimer, setOpenTimer] = useState(false)
  useEffect(() => {
    if (openTimer) {
      runTimerJump()
    } else {
      clearInterval(timeChange)
    }
  }, [openTimer])
  const runTimerJump = () => {
    timeChange = setInterval(() => pollPayResult(), 3000)
  }

  const pollPayResult = () => {
    if (tradeCode) {
      getPayEAccountAllInPayGetRechargeResult({ tradeCode: tradeCode }).then((res) => {
        if (res.code === 1000) {
          if (res.data) {
            clearInterval(timeChange)
            message.success(translate('public.chongzhichenggong'))
            setTimeout(() => {
              controlModalRef.current.toggle()
              modalRef.current?.toggle()
              refreshAccountDetail()
            }, 500)
          }
        } else {
          message.error(res.message)
        }
      })
    }
  }

  const options = data?.map((v) => {
    return {
      label: (
        <Space>
          <img className={styles['charge-icon']} src={chargeIconMap[v.key]} />
          <span>{v.value}</span>
        </Space>
      ),
      value: v.key,
      style: { width: '100%', marginBottom: 16 },
    }
  })

  const handleSubmit = async () => {
    const values = await form.validateFields()
    rechargeRun(values, { ctlType: 'none' })
  }
  return (
    <StandardModal
      title="账户充值"
      actionRef={modalRef}
      width={600}
      onOk={handleSubmit}
      confirmLoading={rechargeLoading}
    >
      <StandardForm form={form}>
        <StandardForm.Item name="money" label="充值金额" rules={[{ required: true }]}>
          <Input />
        </StandardForm.Item>

        <StandardForm.Item label="充值方式" name="type" rules={[{ required: true }]}>
          <RadioGroup options={options}></RadioGroup>
        </StandardForm.Item>
      </StandardForm>
      <StandardModal actionRef={controlModalRef} title="扫码充值">
        <div className={styles.qrCodeImage}>
          <img src={qrcode} alt="" />
          <div className={styles.scanTips}>
            <ScanOutlined className={styles.scanIcon} />
            <span>
              {form.getFieldValue('type')?.indexOf('WEIXIN') !== -1
                ? translate('web.resource.payment.dakaiweixin')
                : translate('web.resource.payment.dakaizhifubao')}
              <br />
              {translate('web.resource.payment.saomawanchengchongzhi')}
            </span>
          </div>
        </div>
      </StandardModal>
    </StandardModal>
  )
}

export default ChargeModal
