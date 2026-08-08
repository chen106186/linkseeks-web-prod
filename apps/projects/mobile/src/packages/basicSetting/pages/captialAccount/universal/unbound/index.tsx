import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState } from 'react'
import { View, Text, Toast, Modal } from '@apps/mobile-ui'
import { pxTransform, getCurrentInstance } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import Overlays from '@/components/Overlay'
import { useIntl } from '@linkseeks/i18n'
import CodeInput from '@/components/CodeInput'
import {
  postPayAllInPaySendVerificationCode,
  postPayAllInPayUnbindBankCard,
  // postPayAllInPayUnbindPhone,
} from '@apps/apis'
import styles from './index.module.scss'
import Capture from '../../../accountSafe/components/capture'
const Unbound = (props: any) => {
  const intl = useIntl()
  const {
    params: { phone, type, bankCardNo, onConfirm },
  }: any = getCurrentInstance().preloadData
  const [toggle, setToggle] = useState(false) // 控制显示弹出
  const [Modalvisible, setModalvisible] = useState(false)
  const handleFinish = async (code: string) => {
    // /pay/allInPay/unbindPhone
    // const res = await postPayAllInPayUnbindPhone({
    //   phone,
    //   verificationCode: code,
    // })
    console.log(res, 'res')
    if (res.code === 1000) {
      console.log('解绑成功')
      onConfirm()
      Router.navigateBack()
      // navigation.navigate('Bindphone')
      setModalvisible(false)
    } else {
      Toast.show({
        title: intl.formatMessage({
          id: `${res.code}`,
          defaultMessage: res.message,
        }),
      })
    }
  }
  // 点击确定解除绑定卡
  const setConfirm = () => {
    postPayAllInPayUnbindBankCard({
      bankCardNo: bankCardNo,
    }).then((res: any) => {
      console.log(res, 'res')
      if (res.code === 1000) {
        Toast.show({
          title: intl.formatMessage({
            id: 'pay.jiebangchenggong',
            defaultMessage: '解绑成功',
          }),
        })
        onConfirm()
        Router.navigateBack()
      } else {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
        })
      }
    })
  }
  /* 获取验证码 */
  const GetCode = async () => {
    const res = await postPayAllInPaySendVerificationCode({
      phone,
      verificationCodeType: 6,
    })
    console.log(res, '发送短信验证码')
  }
  // 点击显示弹出
  const onSubmit = () => {
    if (type === 'bankCard') {
      setToggle(true)
    } else {
      setModalvisible(true)
    }
  }
  const CodeDom = () => (
    <Capture
      beforeGetCode={() => GetCode()}
      render={(count: number) =>
        count === 0 ? (
          <Text className={styles.codeText}>
            {intl.formatMessage({
              id: 'pay.huoquyanzhengma',
              defaultMessage: '获取验证码',
            })}
          </Text>
        ) : (
          <Text className={styles.codeText}>{`${count}${intl.formatMessage({
            id: 'pay.miaohouchongxinfasong',
            defaultMessage: '秒后重新发送',
          })}`}</Text>
        )
      }
    />
  )
  return (
    <View className={styles.page}>
      <View
        style={{
          marginTop: pxTransform(40),
          flexDirection: 'column',
        }}
      >
        <View
          style={{
            textAlign: 'center',
            fontSize: pxTransform(14),
          }}
        >
          {type === 'phone' ? '当前绑定手机号' : ''}
        </View>
        {type === 'bankCard' && (
          <View
            style={{
              textAlign: 'center',
              fontSize: pxTransform(14),
            }}
          >
            {intl.formatMessage({
              id: 'pay.dangqianbangdingyinhangzhanghao',
              defaultMessage: '当前绑定银行账号',
            })}
          </View>
        )}
        <View
          style={{
            textAlign: 'center',
            fontSize: pxTransform(24),
          }}
        >
          {type === 'phone' ? `+86 ${phone}` : bankCardNo}
        </View>
      </View>
      <View className={styles.btn} onClick={() => onSubmit()}>
        <View className={styles.btnText}>
          {type === 'phone'
            ? intl.formatMessage({
                id: 'pay.genghuanshoujihaoma',
                defaultMessage: '更换手机号码',
              })
            : intl.formatMessage({
                id: 'pay.jiebangdingyinhangka',
                defaultMessage: '解绑定银行卡',
              })}
        </View>
      </View>
      {/* 更换手机号模态框 */}
      <Overlays visible={Modalvisible} position="center" onClick={() => setModalvisible(false)}>
        <View className={styles.modelWrap}>
          <View className={styles.modelMmian}>
            <View className={styles.title}>验证码</View>
            <View className={styles.modeCard}>
              <Text
                style={{
                  fontSize: pxTransform(12),
                  marginTop: pxTransform(10),
                }}
              >{`${intl.formatMessage({
                id: 'pay.qingshurufasongzhininwei',
                defaultMessage: '请输入发送至您尾号为',
              })}${phone.substring(7, 11)}${intl.formatMessage({
                id: 'pay.deshoujihaoyanzhengma',
                defaultMessage: '的手机号验证码',
              })}`}</Text>
              <CodeInput autoFocus onFinish={handleFinish} maxLength={5} />
              {CodeDom()}
            </View>
          </View>
        </View>
      </Overlays>
      <Modal
        title={intl.formatMessage({
          id: 'pay.niquedingyaojiechubangding',
          defaultMessage: '你确定要解除绑定银行卡吗',
        })}
        isOpened={toggle}
        onConfirm={setConfirm}
        onCancel={() => {
          setToggle(false)
        }}
        cancelText={intl.formatMessage({
          id: 'pay.quxiao',
          defaultMessage: '取消',
        })}
        confirmText={intl.formatMessage({
          id: 'pay.queren',
          defaultMessage: '确认',
        })}
        className={styles['pay-model']}
      />
    </View>
  )
}
export default GlobalWrapper(Unbound)
