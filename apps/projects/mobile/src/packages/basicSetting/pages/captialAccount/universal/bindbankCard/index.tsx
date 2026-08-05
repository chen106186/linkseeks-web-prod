import GlobalWrapper from '@/components/GlobalWrapper'
// BindbankCard

import React, { useState } from 'react'
import { View, Text, Input, Form, Toast } from '@apps/mobile-ui'
import { getCurrentInstance, showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
// import { postPayAllInPayApplyBindBankCard, postPayAllInPayBindBankCard } from '@apps/apis'
import styles from './index.module.scss'
const BindBankCard = () => {
  const {
    params: { onConfirm, name, cardType, cardNo, phone },
  }: any = getCurrentInstance().preloadData
  const intl = useIntl()
  const [btnDisabled, setBtnDisabled] = useState(false) // 禁止点击发送验证
  const [btnContent, setBtnContent] = useState(
    intl.formatMessage({
      id: 'pay.huoquyanzhengma',
      defaultMessage: '获取验证码',
    }),
  ) // f发送验证码文字
  const [formItems, setFormItems] = useState<any>({
    cardNo: '',
  })
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
  const getCode = () => {
    const from = formItems
    if (!phone) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.qingshurushoujihaoma',
          defaultMessage: '请输入手机号码',
        }),
        icon: 'none',
      })
      return
    }
    if (!from.cardNo) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.qingtianxieyinhangkahao',
          defaultMessage: '请填写银行卡号',
        }),
        icon: 'none',
      })
      return
    }
    const data: any = {
      name,
      phone,
      identityType: cardType,
      identityNo: cardNo,
      cardNo: from.cardNo,
    }
    showLoading({
      title: intl.formatMessage({
        id: 'pay.caozuozhong',
        defaultMessage: '操作中',
      }),
    })
    postPayAllInPayApplyBindBankCard(data).then((res: any) => {
      if (res.code === 1000) {
        hideLoading()
        Toast.show({
          title: intl.formatMessage({
            id: 'pay.fasongchenggong',
            defaultMessage: '发送成功',
          }),
        })
        handleCountdown()
      } else {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
        })
        hideLoading()
      }
    })
  }
  const Submit = () => {
    if (!phone) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.qingxianqubangdingshoujihao',
          defaultMessage: '请先去绑定手机号码',
        }),
      })
      return
    }
    if (!formItems.cardNo) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.qingtianxieyinhangkahao',
          defaultMessage: '请填写银行卡号',
        }),
      })
      return
    }
    if (!formItems.verificationCode) {
      Toast.show({
        title: intl.formatMessage({
          id: 'pay.qingtianxieyanzhengma',
          defaultMessage: '请填写验证码',
        }),
      })
      return
    }
    const data: any = {
      cardNo: formItems.cardNo,
      phone,
      verificationCode: formItems.verificationCode,
    }
    postPayAllInPayBindBankCard(data).then((res: any) => {
      if (res.code === 1000) {
        if (onConfirm) {
          onConfirm()
          Router.navigateBack()
        }
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
  // 给input赋值
  const changeInputValue = (key: string, val: any) => {
    setFormItems({
      ...formItems,
      [key]: val,
    })
  }
  return (
    <View className={styles.page}>
      <View className={styles.warp}>
        <Form>
          <View className={styles.FormTitem}>
            <View className={styles.lalbel}>
              {intl.formatMessage({
                id: 'pay.yinhangkahao',
                defaultMessage: '银行卡号',
              })}
            </View>
            <Input
              value={formItems.cardNo}
              placeholder={intl.formatMessage({
                id: 'pay.qingshuruyinhangzhanghao',
                defaultMessage: '请输入银行账号',
              })}
              className={styles.input}
              placeholderClass={styles.placeholder}
              onChange={(e) => changeInputValue('cardNo', e)}
            />
          </View>
          <View className={styles.FormTitem}>
            <Input
              value={formItems.verificationCode}
              placeholder={intl.formatMessage({
                id: 'pay.qingshuruyanzhengma',
                defaultMessage: '请输入验证码',
              })}
              className={styles.Code}
              placeholderClass={styles.placeholder}
              onChange={(e) => changeInputValue('verificationCode', e)}
            />
            {getCodeView()}
          </View>
        </Form>
      </View>

      <View className={styles.btn} onClick={Submit}>
        <View className={styles.btnText}>
          {intl.formatMessage({
            id: 'pay.tijiao',
            defaultMessage: '提交',
          })}
        </View>
      </View>
    </View>
  )
}
export default GlobalWrapper(BindBankCard)
