import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import { View, Text, Icons, Input, Button, Toast, StandardForm } from '@apps/mobile-ui'
import { showLoading, hideLoading, showToast, preload } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import AgreementLayout from '@/components/Agreement'
import {
  getPayAllInPayGetMemberInfo,
  postPayAllInPaySendVerificationCode,
  postPayAllInPaySignContract,
  postPayAllInPaySignContractQuery,
} from '@apps/apis'
import Layout from '../../components/Layout'
import styles from './index.module.scss'
import { useMobileIntl } from '@apps/locales'
import LineCard, { STATUS_ENUM } from '../../components/LineCard'
interface DataPorps {
  phone: string
  verificationCode: string
}
const BindPhone = () => {
  const intl = useIntl()
  const [form] = StandardForm.useForm()
  const [memberInfo, setMemberInfo] = useState<any>({
    Cell1: [],
    Cell2: [],
    Cell3: [],
  })
  const [btnDisabled, setBtnDisabled] = useState(false) // 禁止点击发送验证
  const [btnContent, setBtnContent] = useState(
    intl.formatMessage({
      id: 'pay.huoquyanzhengma',
      defaultMessage: '获取验证码',
    }),
  ) // f发送验证码文字
  const [formItems, setFormItems] = useState<DataPorps>({
    phone: '',
    verificationCode: '',
  })
  const [agree, setAgree] = useState<boolean>(true)
  const [phoneStatus, setPhoneStatus] = useState<{
    status: STATUS_ENUM
    text: string
  }>({
    status: STATUS_ENUM.READY,
    text: '待绑定',
  })
  const translate = useMobileIntl()

  /* 倒计时 */
  let time = 60
  const handleCountdown = () => {
    if (time > 0 && time <= 60) {
      time -= 1
      setBtnContent(time < 10 ? `0${time}s` : `${time}s`)
      setBtnDisabled(true)
      setTimeout(() => {
        handleCountdown()
      }, 1000)
    } else {
      time = 60
      setBtnDisabled(false)
      setBtnContent(
        intl.formatMessage({
          id: 'pay.huoquyanzhengma',
          defaultMessage: '获取验证码',
        }),
      )
    }
  }
  /* 获取验证码 */
  const getCode = async () => {
    const { phone } = formItems
    if (!phone) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.qingshurushoujihaoma',
          defaultMessage: '请输入手机号码',
        }),
      })
    } else {
      const param: any = {
        verificationCodeType: 9,
        phone,
      }
      const res = await postPayAllInPaySendVerificationCode(param)
      showLoading({
        title: intl.formatMessage({
          id: 'pay.jiazaizhong',
          defaultMessage: '加载中',
        }),
      })
      if (res.code === 1000) {
        handleCountdown()
        hideLoading({})
        Toast.show({
          title: intl.formatMessage({
            id: 'pay.fasongchenggong',
            defaultMessage: '发送成功',
          }),
        })
      } else {
        hideLoading({})
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
        })
      }
    }
  }
  /* 发送验证码HTML */
  const getCodeView = () =>
    btnDisabled ? (
      <View className={styles.Border}>
        <Text className={styles.countryCode}>{btnContent}</Text>
      </View>
    ) : (
      <View onClick={() => getCode()} className={styles.Border}>
        <Text className={styles.countryCode}>{btnContent}</Text>
      </View>
    )
  useEffect(() => {
    getAuthMemberInfo()
  }, [])
  const onConfirm = () => {
    getAuthMemberInfo()
  }
  // 提交
  const Submit = async () => {
    const data = formItems
    if (!data.phone) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.qingshurushoujihao',
          defaultMessage: '请输入手机号',
        }),
      })
      return
    }
    if (!data.verificationCode) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.qingshuruyanzhengma',
          defaultMessage: '请输入验证码',
        }),
      })
      return
    }
    if (!agree) {
      showToast({
        title: translate('mobile.resource.user.qingyueduxieyi'),
        icon: 'none',
      })
      return
    }
    // const res = await postPayAllInPayBindPhone({
    //   phone: data.phone,
    //   verificationCode: data.verificationCode,
    // })
    // if (res.code === 1000) {
    //   Toast.show({
    //     title: intl.formatMessage({
    //       id: 'pay.bangdingchenggong',
    //       defaultMessage: '绑定成功',
    //     }),
    //   })
    //   let arrUrl: any = [
    //     'basicSetting/entErpriseAuth',
    //     'basicSetting/ImageAcquisition',
    //     'basicSetting/enterpBindphone',
    //     'basicSetting/enterBindbankCard',
    //   ]
    //   const resj = await getPayAllInPayGetMemberInfo()
    //   if (resj.code === 1000) {
    //     Router.navigateTo(arrUrl[resj.data.step])
    //     hideLoading()
    //   } else {
    //     hideLoading()
    //   }
    // } else {
    //   Toast.show({
    //     title: intl.formatMessage({
    //       id: `${res.code}`,
    //       defaultMessage: res.message,
    //     }),
    //   })
    // }
  }
  const submit = async () => {}
  // 查询信息
  const getAuthMemberInfo = async () => {
    const res: any = await getPayAllInPayGetMemberInfo()
    if (res.code === 1000) {
      if (res.data.memberType === 2) {
        setMemberInfo(res.data)
      }
      form.setFieldsValue({
        phone: res.data.phone,
      })
      setFormItems({
        ...formItems,
        ['phone']: res.data.phone,
      })
    }
  }
  // 点击绑定手机号
  const bindPhoneNumber = async () => {
    const { phone, verificationCode } = form.getFieldsValue()
    // const { code } = await postPayAllInPayBindPhone({
    //   phone,
    //   verificationCode,
    // })
    // if (code === 1000) {
    //   Toast.show({
    //     title: '绑定成功',
    //   })
    // }
  }
  // 点击签约
  const onContract = async () => {
    const key = memberInfo.contractNo
    if (!key) {
      const res = await postPayAllInPaySignContract({
        jumpPageType: 1,
      })
      preload('params', {
        onConfirm: onConfirm,
        url: res.data,
      })
      Router.navigateTo('basicSetting/webInfo')
    } else {
      const res = await postPayAllInPaySignContractQuery({
        jumpPageType: 1,
      })
      preload('params', {
        onConfirm: onConfirm,
        url: res.data,
      })
      Router.navigateTo('basicSetting/webInfo')
    }
  }
  return (
    // 绑定手机号
    <View className={styles.page}>
      <Layout steps={2}>
        <LineCard title="绑定手机" status={phoneStatus.status} statusText={phoneStatus.text}>
          <StandardForm form={form} initialValues={formItems}>
            <StandardForm.Item name="phone" label="手机号">
              <Input
                placeholder={intl.formatMessage({
                  id: 'pay.qingshuruxinshoujihao',
                  defaultMessage: '请输入新手机号',
                })}
                className={styles.input}
                placeholderClass={styles.placeholder}
              />
            </StandardForm.Item>
            <StandardForm.Item name="verificationCode" suffix={getCodeView()}>
              <Input
                placeholder={intl.formatMessage({
                  id: 'pay.qingshuruyanzhengma',
                  defaultMessage: '请输入验证码',
                })}
                className={styles.Code}
                style={{
                  textAlign: 'left',
                }}
                placeholderClass={styles.placeholder}
              />
            </StandardForm.Item>
          </StandardForm>
          <View
            style={{
              display: 'flex',
              justifyContent: 'right',
              margin: '20px 0',
            }}
          >
            <Button
              size="small"
              customStyle={{
                width: 100,
              }}
              type="primary"
              onClick={bindPhoneNumber}
            >
              确认绑定
            </Button>
          </View>
        </LineCard>

        <LineCard title="提现协议签署">
          <View className={styles.signContainer}>
            <Text>电子协议签约</Text>
            <Text onClick={onContract} className={styles.goSign}>
              前往签署 &gt;
            </Text>
          </View>
        </LineCard>
        <Button type="primary" onClick={submit}>
          完成认证
        </Button>
      </Layout>
    </View>
  )
}
export default GlobalWrapper(BindPhone)
