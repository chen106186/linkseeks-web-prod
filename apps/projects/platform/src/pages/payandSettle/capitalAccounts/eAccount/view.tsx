import { Loading, PageHeaderWrapper, StandardForm, StandardFormTable, StandardModal } from '@apps/components'
import { InitContextProvider, useEAccountInitContext } from './context'
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  message,
  Modal,
  Radio,
  RadioGroup,
  Row,
  Space,
} from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import styles from './index.less'
import TranscationRecord from './components/transcationRecord'
import TransformRecord from './components/transformRecord'
import { useValidateBindPhone } from '@apps/services/eAccount'
import { useHistory } from '@linkseeks/router-core'
import alipay from '@/assets/imgs/alipay_icon.png'
import wxpay from '@/assets/imgs/wechat_icon.png'
import bankpay from '@/assets/imgs/bank_icon.png'
import fastpay from '@/assets/imgs/fast_icon.png'
import ChargeModal from './components/chargeModal'
import { useEffect, useState } from 'react'
import { useAuth } from '@apps/services'
import GetMoneyModal from './components/getMoneyModal'
import BindCardModal from './components/bindCardModal'
import FahuoModal from './components/fahuoModal'
import { postPayAllInPayRegisterCompanyMember, postPayAllInPaySignContract } from '@apps/apis'
import { authService } from '@apps/services'

/** 充值方式和icon */
const chargeIconMap = {
  // 微信
  SCAN_WEIXIN: wxpay,
  // 支付宝
  SCAN_ALIPAY: alipay,
  // 快捷
  QUICKPAY_VSP: fastpay,
  // 网银
  GATEWAY_VSP: bankpay,
}

const Account = () => {
  const translate = useWebIntl()
  const { memberInfo, accountDetail, loading, isSelf, isEnterprise, isFinishMoneyProcess, isFinishProcess } =
    useEAccountInitContext()
  const history = useHistory()

  const modalRef = StandardModal.useRef()
  const [formInstance] = StandardForm.useForm()

  const getMoneyModalRef = StandardModal.useRef()
  const [getMoneyFormInstance] = StandardForm.useForm()

  const transcationRecordRef = StandardFormTable.useTableRef()

  // 绑卡弹窗状态
  const [bindCardVisible, setBindCardVisible] = useState(false)
  const [huankuanVisible, setHuankuanVisible] = useState(false)

  const auth = authService.getAuth()

  const roleIds = auth?.roles.map((i) => i.roleId)

  const isPersonal = roleIds.includes(2) || roleIds.includes(5)
  /**
   * 同一个入口页
   * 个人和企业分别跳到不同的绑定页
   */
  useEffect(() => {
    if (isSelf) {
      if (memberInfo && !memberInfo.isPhoneChecked) {
        // 如果没有绑定手机号，则跳转到绑定手机号界面
        history.replace('/payandSettle/capitalAccounts/eAccount/bindPhone')
      }
    } else if (isEnterprise) {
      if (memberInfo && !memberInfo?.companyName) {
        // 如果没有企业名称
        history.replace('/payandSettle/capitalAccounts/eAccount/bindComanyName')
      }
    }
  }, [memberInfo, isSelf, isEnterprise])

  const openAccount = () => {
    if (isSelf) {
      history.push('/payandSettle/capitalAccounts/eAccount/register')
    } else {
      history.push('/payandSettle/capitalAccounts/eAccount/bindComanyName')
    }
  }

  const handleCharge = () => {
    modalRef.current.toggle()
  }

  const handleGetMoney = (isReAuth = false) => {
    if (isFinishProcess) {
      // 已经完成了整个签署，则可以进行提现
      getMoneyModalRef.current.toggle()
    } else {
      Modal.confirm({
        title: translate('public.zhanghutixian'),
        content: <Alert type="warning" message="您的账号还没完成账户提现协议签约，请先完成签署。"></Alert>,
        okText: translate('public.qianshuxieyi'),
        cancelText: translate('web.common.cancel'),
        width: 600,
        maskClosable: true,
        onOk: async () => {
          // if (isSelf) {
          const { data } = await postPayAllInPaySignContract({
            jumpPageType: 1,
            source: 1,
            jumpUrl: location.href,
            accountType: memberInfo.accountType,
          })

          location.href = data
          // }

          // if (isEnterprise) {
          //   if (memberInfo?.companyName) {
          //     const result = await postPayAllInPayRegisterCompanyMember({
          //       companyName: memberInfo?.companyName,
          //       jumpUrl: location.href,
          //       isReAuth,
          //     })

          //     if (result.code === 1000) {
          //       window.location.href = result.data.regInviteLink
          //     } else {
          //       message.error(result.message)
          //     }
          //   } else {
          //     message.error('公司名称不存在')
          //   }
          // }
        },
      })
    }
  }
  const handlePreview = () => {
    history.push('/payandSettle/capitalAccounts/eAccount/detail')
  }
  const handleEdit = () => {
    history.push('/payandSettle/capitalAccounts/eAccount/edit')
  }

  const handleReSend = async () => {
    history.push('/payandSettle/capitalAccounts/eAccount/bindComanyName')
  }

  // 处理绑卡按钮点击
  const handleBindCard = () => {
    setBindCardVisible(true)
  }
  const handleHuankuan = () => {
    setHuankuanVisible(true)
  }
  // 绑卡成功回调
  const handleBindCardSuccess = () => {
    // 可以在这里刷新页面数据或显示成功提示
    message.success('银行卡绑定成功')
  }

  if (loading) {
    return <Loading />
  }

  return (
    <PageHeaderWrapper>
      <Card isMarginBottom title={translate('web.resource.payment.zhanghuxinxi')}>
        <div className={styles['account-info-container']}>
          <div className={styles['account-info-controler']}>
            <div>{translate.formatCurrencyWith(translate('web.resource.payment.keyongyue'))}</div>
            <Row justify={'space-between'} align={'middle'}>
              <Col className={styles['money']}>{accountDetail?.usableBalance}</Col>
              <Col>
                {isFinishMoneyProcess ? (
                  <Space>
                    <Button type="primary" onClick={handleHuankuan}>
                      还款
                    </Button>

                    <Button type="primary" onClick={handleBindCard}>
                      {memberInfo.accountNo ? '绑卡' : '绑卡'}
                    </Button>

                    <Button type="primary" onClick={handleCharge}>
                      {translate('public.chongzhi')}
                    </Button>
                    {isPersonal && <Button onClick={() => handleGetMoney(false)}>{translate('public.tixian')}</Button>}
                  </Space>
                ) : (
                  <Button type="primary" onClick={openAccount}>
                    {translate('public.kaitongyuezhanghu')} &gt;
                  </Button>
                )}
              </Col>
            </Row>
          </div>

          <div className={styles['account-info-list']}>
            <Descriptions column={1} labelStyle={{ alignItems: 'center' }} size="small">
              <Descriptions.Item label={translate('public.zhanghuguishu')}>
                <Button type="link" onClick={handlePreview}>
                  {memberInfo?.accountBelong} &gt;
                </Button>
                {
                  <Button type="link" onClick={handleEdit}>
                    编辑
                  </Button>
                }
              </Descriptions.Item>
              <Descriptions.Item label={translate.formatCurrencyWith(translate('web.resource.payment.zhanghuyue'))}>
                <span>{accountDetail?.accountBalance}</span>
              </Descriptions.Item>
              <Descriptions.Item label={translate.formatCurrencyWith(translate('web.resource.payment.suodingjine'))}>
                <span>{accountDetail?.lockBalance}</span>
              </Descriptions.Item>
              <Descriptions.Item label={translate('web.resource.payment.zhanghuzhuangtai')}>
                <span>{accountDetail?.accountStatusName}</span>
                {accountDetail?.accountStatus == 3 && (
                  <Button style={{ marginLeft: '15px' }} onClick={handleReSend}>
                    重新发起
                  </Button>
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>
      <TranscationRecord tableRef={transcationRecordRef} />
      <TransformRecord />
      <ChargeModal modalRef={modalRef} form={formInstance} transcationRecordRef={transcationRecordRef} />
      <GetMoneyModal
        transcationRecordRef={transcationRecordRef}
        modalRef={getMoneyModalRef}
        form={getMoneyFormInstance}
      />
      <BindCardModal
        visible={bindCardVisible}
        onCancel={() => setBindCardVisible(false)}
        onSuccess={handleBindCardSuccess}
      />
      <FahuoModal visible={huankuanVisible} onCancel={() => setHuankuanVisible(false)} />
    </PageHeaderWrapper>
  )
}
export default () => {
  return (
    <InitContextProvider>
      <Account />
    </InitContextProvider>
  )
}
